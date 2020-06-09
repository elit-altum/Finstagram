// Handles routes for likes
const User = require("../models/userModel");
const Like = require("../models/likeModel");
const Post = require("../models/postModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// *? 1. LIKE A POST
exports.likePost = catchAsync(async (req, res) => {
	const post = await Post.findById(req.params.postId);

	if (!post) {
		throw new AppError("This post does not exist.", 400);
	}

	const alreadyLiked = await Like.findOne({
		likedBy: req.user.id,
		post: req.params.postId,
	});

	if (alreadyLiked) {
		throw new AppError("You have already liked this post.", 400);
	}

	await Like.create({
		likedBy: req.user.id,
		post: req.params.postId,
	});

	res.status(200).json({
		status: "success",
		message: `You have liked this post`,
	});
});

// *? 2. UNLIKE A LIKED POST
exports.unlikePost = catchAsync(async (req, res) => {
	const post = await Post.findById(req.params.postId);

	if (!post) {
		throw new AppError("This post does not exist.", 400);
	}

	const alreadyLiked = await Like.findOne({
		likedBy: req.user.id,
		post: req.params.postId,
	});

	if (!alreadyLiked) {
		throw new AppError("You have not liked this post.", 400);
	}

	await Like.findOneAndRemove({
		likedBy: req.user.id,
		post: req.params.postId,
	});

	res.status(200).json({
		status: "success",
		message: `You have unliked this post`,
	});
});

// *? 3. GET ALL LIKES ON A POST
exports.likedBy = catchAsync(async (req, res) => {
	const postId = req.params.postId;

	const likers = await Like.find({
		post: postId,
	})
		.populate({
			path: "likedBy",
			select: "username photo",
		})
		.select("likedBy")
		.select("-_id");

	res.status(200).json({
		status: "success",
		data: {
			results: likers.length,
			likers,
		},
	});
});
