// Handles user specific routes
const fs = require("fs");
const { promisify } = require("util");
const path = require("path");

const multer = require("multer");
const sharp = require("sharp");
const cloudinary = require("cloudinary").v2;

const User = require("../models/userModel");
const Post = require("../models/postModel");
const Follow = require("../models/followModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendEmails");

// ! ALL ROUTES HERE MUST BE PROTECTED BY authController.protectRoute()

// *? 0. GET SPECIFIC PROPERTIES
const getSpecifics = (req, ...props) => {
	const finalObj = {};

	const requestKeys = Object.keys(req.body);

	requestKeys.forEach((key) => {
		if (props.includes(key)) {
			finalObj[key] = req.body[key];
		}
	});

	return finalObj;
};

// *? 1. GET USER PROFILE
exports.getUser = catchAsync(async (req, res) => {
	// a. Check if user(P) is requesting his own posts or someone else's(Q)
	const username = req.params.username || req.user.username;

	// b. Get details of user Q
	const user = await User.findOne({ username })
		.populate("followCount")
		.populate("followersCount")
		.populate("postsCount")
		.select("-createdAt -updatedAt -__v -lastPostAt -lastSeenAt -email");

	if (!user || !user.isActive) {
		throw new AppError("This user does not seem to exist!");
	}

	// c. For pagination
	const limit = Number(req.query.limit) || 10;
	const skip = (Number(req.query.page) - 1) * limit || 0;

	// d. Get posts by user
	const posts = await Post.find({
		createdBy: user.id,
	})
		.populate("likes")
		.populate("comments")
		.sort({ createdAt: -1 })
		.limit(limit)
		.skip(skip);

	const finalUser = user.toObject();
	// e. Follow info of user
	if (req.user.id !== user.id) {
		const follow = await Follow.findOne({
			user: req.user.id,
			follows: user._id,
		});

		if (follow) {
			finalUser.followedByMe = true;
		} else {
			finalUser.followedByMe = false;
		}
	}

	res.status(200).json({
		status: "success",
		data: {
			user: finalUser,
			posts,
		},
	});
});

// *? 2. UPDATE USER DETAILS (insensitive)
exports.updateMe = catchAsync(async (req, res) => {
	if (req.body.password) {
		throw new AppError(
			"This route is not for updating passwords. Please use /updatePassword instead",
			400
		);
	}

	const santisedObject = getSpecifics(req, "email", "name", "username");

	if (req.hasOwnProperty("file")) {
		const imagePath = path.join(
			__dirname,
			"..",
			"public",
			"img",
			"user-profiles",
			req.file.filename
		);

		const image = await cloudinary.uploader.upload(imagePath);

		santisedObject.photo = image.url;
	}

	const user = await User.findByIdAndUpdate(req.user.id, santisedObject, {
		runValidators: true,
		new: true,
	});

	res.status(200).json({
		status: "success",
		data: {
			user,
		},
	});
});

// *? 3. UPDATE USER PASSWORD
exports.updatePassword = catchAsync(async (req, res) => {
	const { oldPassword, newPassword, confirmPassword } = req.body;

	if (!oldPassword || !newPassword || !confirmPassword) {
		throw new AppError(
			"Please provide the old password, new password and a password confirmation.",
			400
		);
	}

	const user = await User.findById(req.user.id).select("+password");

	const isMatch = await user.comparePassword(oldPassword, user.password);

	if (!isMatch) {
		throw new AppError("The provided password is incorrect.", 403);
	}

	user.password = newPassword;
	user.passwordConfirm = confirmPassword;
	user.passwordChangedAt = Date.now();

	await user.save({
		validateBeforeSave: true,
	});

	res.status(200).json({
		status: "success",
		message: "Password changed successfully.",
	});
});

// *? 4. DELETE USER (deactivate account)
exports.deactivateUser = catchAsync(async (req, res) => {
	const user = await User.findByIdAndUpdate(req.user.id, {
		isActive: false,
	});

	const deactivateHtml = `Sorry to see you go @${user.username}. You can reclaim access to your account by logging in again later. We hope to see you back soon.`;
	sendEmail({
		to: `${user.email}`,
		subject: "Sorry to see you go :(",
		html: deactivateHtml,
	});

	res.status(204).json({
		status: "success",
	});
});

// *? 5. DELETE USER FROM DB (admin only)
exports.deleteUser = catchAsync(async (req, res) => {
	const user = await User.findByIdAndRemove(req.params.userId);

	// Delete the user profile image
	const imageName = req.user.photo.split("/")[3];
	if (imageName != "default.png") {
		await deleteProfilePhoto(imageName);
	}

	if (!user) {
		throw new AppError("No user found with this id.", 404);
	}

	res.status(204).json({
		status: "success",
	});
});

// *? 6. SEARCH FOR A USER USING NAME/USERNAME
exports.searchUser = catchAsync(async (req, res) => {
	if (!req.body.search) {
		throw new AppError("Please provide a search value.", 400);
	}

	const regex = "^" + req.body.search;
	const searchQuery = new RegExp(regex, "i");

	const users = await User.find({
		$or: [
			{
				username: searchQuery,
			},
			{
				name: searchQuery,
			},
		],
	})
		.limit(8)
		.skip(0)
		.select("username name photo");

	if (!users) {
		throw new AppError("No users found.", 404);
	}

	res.status(200).json({
		status: "success",
		data: {
			results: users.length,
			users,
		},
	});
});

// *? 6. SEARCH FOR A USER USING NAME/USERNAME
exports.findRandomUsers = catchAsync(async (req, res) => {
	const users = await User.find({ _id: { $ne: req.user.id } })
		.limit(8)
		.skip(0)
		.select("username name photo");

	if (!users) {
		throw new AppError("No users found.", 404);
	}

	res.status(200).json({
		status: "success",
		data: {
			results: users.length,
			users,
		},
	});
});

// *? <--------------- USER PROFILE IMAGES ----------------->

// *? 0. UTILITY FUNCTIONS FOR IMAGES

// ** a. Setup multer for image and files handling
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(new AppError("Please upload images only.", 400), false);
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
	limits: {
		fileSize: 5000000, // 5MB
	},
});

// * b. MIDDLEWARE : Multer for image handling
exports.uploadUserProfile = upload.single("photo");

// * c. MIDDLEWARE: Sharp for image processing and storing
exports.resizeUserImage = async (req, res, next) => {
	if (!req.hasOwnProperty("file")) {
		return next();
	}
	req.file.filename = `user-${req.user.id}-${new Date(
		Date.now()
	).getTime()}.jpg`;

	await sharp(req.file.buffer)
		.resize(500, 500)
		.toFormat("jpeg")
		.jpeg({ quality: 90 })
		.toFile(`public/img/user-profiles/${req.file.filename}`);

	return next();
};
