// Handles user and authentication functions
const { promisify } = require("util");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendEmails");
const createNotification = require("../utils/createNotification");

// *? 0. GENERATE JWT
const generateJWT = (user, res) => {
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});

	// Send cookie
	res.cookie("jwt", token, {
		httpOnly: true,
		expires: new Date(
			Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
	});

	// Send response
	res.status(200).json({
		status: "success",
		data: {
			token,
			user,
		},
	});
};

// *? 1. SIGNUP NEW USER
exports.signupUser = catchAsync(async (req, res) => {
	const { name, username, email, password, passwordConfirm } = req.body;

	const user = await User.create({
		username,
		name,
		email,
		password,
		passwordConfirm,
	});

	// Censor sensitive data
	user.password = undefined;
	user.passwordChangedAt = undefined;
	user.__v = undefined;

	sendEmail({
		to: email,
		subject: `Welcome to the ${process.env.APP_NAME} family!`,
		html:
			"We are so glad to have you here! Let's do some exciting things together.",
	});

	generateJWT(user, res);
});

// *? 2. LOGIN EXISTING USER
exports.loginUser = catchAsync(async (req, res) => {
	const { username, password } = req.body;

	// A. If username and password exist in request
	if (!username || !password) {
		throw new AppError("Please provide username and password!", 400);
	}

	// B. Get user based on username
	const tempUser = await User.findOne({ username }).select("+password");

	if (!tempUser) {
		throw new AppError("Invalid username or password.", 400);
	}

	// C. Check if user password matches stored password
	const isMatch = await tempUser.comparePassword(password, tempUser.password);

	if (!isMatch) {
		throw new AppError("Invalid username or password.", 400);
	}

	// D. If user deactivated, mark him as active again
	tempUser.isActive = true;
	await tempUser.save({
		validateBeforeSave: false,
	});

	tempUser.password = undefined;
	generateJWT(tempUser, res);
});

// *? 3. LOGOUT USER
exports.logoutUser = (req, res) => {
	res.cookie("jwt", "loggedOut", {
		httpOnly: true,
		expires: new Date(Date.now() + 100),
	});

	res.status(200).json({
		status: "success",
	});
};

// *? 4. MIDDLEWARE: PROTECT ROUTE
exports.protectRoute = catchAsync(async (req, res, next) => {
	let token = "";

	// A. Extract JWT from request
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		// For <Bearer Token> in API calls
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.jwt) {
		// For web cookies
		token = req.cookies.jwt;
	}

	if (!token) {
		throw new AppError("Please authenticate to access.", 401);
	}

	// B. Verify JWT
	const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// C. Get user from payload user id
	const user = await User.findById(payload.id).select("+passwordChangedAt");

	if (!user || !user.isActive) {
		throw new AppError("This user no longer exists. Please login again.", 401);
	}

	// D. If user changed password after JWT issue
	const passwordChangedAt = Math.floor(
		new Date(user.passwordChangedAt).getTime() / 1000
	);

	if (passwordChangedAt > payload.iat) {
		throw new AppError(
			"Your password was changed recently. Please login again.",
			401
		);
	}

	// E. Authenticate User
	req.user = user;
	next();
});

// *? 5. MIDDLEWARE: RESTRICT TO ROLES ROUTE
// * Always use after protectRoute() middleware
exports.restrictTo = (...roles) => {
	return catchAsync(async (req, res, next) => {
		if (roles.includes(req.user.role)) {
			return next();
		}

		throw new AppError("You do not have permission to access this route.", 403);
	});
};

// *? 6. PASSWORD FORGOT & RESET

// * 6a. Generate Reset Email
exports.generateResetToken = catchAsync(async (req, res) => {
	const { email } = req.body;

	// If no email in request
	if (!email) {
		throw new AppError("Please provide a registered email id.", 400);
	}

	const foundUser = await User.findOne({ email }).select("+passwordResetToken");

	// If email not registered for a user
	if (!foundUser) {
		throw new AppError(
			"No existing user found with this email id. Please signup if you are new.",
			400
		);
	}

	// Get reset token
	const resetToken = foundUser.generateResetToken();
	foundUser.save({ validateBeforeSave: false });

	// Generate email for reset
	const fullUrl = req.protocol + "://" + req.get("host");
	const resetEmailHtml = `We have received a password reset request from this email id. Please use this link to provide a new password. 
	<br> <a target="_blank" href="${fullUrl}/api/v1/users/resetPassword/${resetToken}">Reset Password</a>`;

	sendEmail({
		to: `${foundUser.email}`,
		subject: "Password reset request (expires in 15 minutes)",
		html: resetEmailHtml,
	});

	res.status(200).json({
		status: "success",
		message: `An email with password reset instructions has been sent to ${foundUser.email}`,
	});
});

// * 6b. Reset new password
exports.resetPassword = catchAsync(async (req, res) => {
	const token = req.params.token;

	const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

	// Find user with same and unexpired token and
	const user = await User.findOne({
		passwordResetToken: hashedToken,
		passwordResetValidity: { $gte: Date.now() },
	});

	if (!user) {
		throw new AppError(
			"This token is not valid or has expired. Please try again",
			401
		);
	}

	// Update user details and password
	user.password = req.body.password;
	user.passwordConfirm = req.body.passwordConfirm;
	user.passwordChangedAt = Date.now();

	user.passwordResetToken = undefined;
	user.passwordResetValidity = undefined;

	await user.save();

	user.password = undefined;
	user.passwordChangedAt = undefined;
	generateJWT(user, res);
});

// *? 6. CHECK IF USER IS LOGGED IN
exports.isLoggedIn = catchAsync(async (req, res, next) => {
	let token = "";

	// A. Extract JWT from request
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		// For <Bearer Token> in API calls
		token = req.headers.authorization.split(" ")[1];
	} else if (req.cookies.jwt) {
		// For web cookies
		token = req.cookies.jwt;
	}

	if (!token || token === "loggedOut") {
		return res.status(401).json({
			status: "failure",
		});
	}

	// B. Verify JWT
	const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// C. Get user from payload user id
	const user = await User.findById(payload.id).select("+passwordChangedAt");

	if (!user || !user.isActive) {
		return res.status(401).json({
			status: "failure",
		});
	}

	// D. If user changed password after JWT issue
	const passwordChangedAt = Math.floor(
		new Date(user.passwordChangedAt).getTime() / 1000
	);

	if (passwordChangedAt > payload.iat) {
		return res.status(401).json({
			status: "failure",
		});
	}

	// E. Authenticate User
	return res.status(200).json({
		status: "success",
		data: {
			user,
		},
	});
});
