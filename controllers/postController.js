// Handles routes specific to post
const { promisify } = require("util");

const multer = require("multer");
const sharp = require("sharp");
const sizeOf = require("image-size");

const Post = require("../models/postModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// ! ALL ROUTES HERE MUST BE PROTECTED BY authController.protectRoute()

// *? 1. CREATE NEW POST

// * 1a. Multer for image handling
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(new AppError("Please upload images only!", 400));
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
	limits: {
		fileSize: 7000000, // 7MB
	},
});

exports.uploadPostPhoto = upload.single("photo");

exports.convertImageToJpeg = async (req, res, next) => {
	if (!req.file) {
		throw new AppError("Please provide an image.", 400);
	}

	req.file.filename = `post-${req.user.id}-${new Date(
		Date.now()
	).getTime()}.jpg`;

	await sharp(req.file.buffer)
		.toFormat("jpeg")
		.jpeg({ quality: 90 })
		.toFile(`public/img/posts/${req.file.filename}`);

	next();
};

// * 1b. Store post to database
exports.storePost = catchAsync(async (req, res) => {
	const caption = req.body.caption || "";

	const dimensions = await promisify(sizeOf)(
		`public/img/posts/${req.file.filename}`
	);

	const newPost = {
		caption,
		photo: `/img/posts/${req.file.filename}`,
		dimensions: `${dimensions.width} x ${dimensions.height}`,
		createdBy: req.user.id,
	};

	// Create the new post
	const post = await Post.create(newPost);

	// Update the post date of user
	await User.findByIdAndUpdate(req.user.id, {
		lastPostAt: Date.now(),
	});

	res.status(201).send({
		status: "success",
		data: {
			post,
		},
	});
});

// *? GET POSTS FOR THE USER
