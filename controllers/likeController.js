// Handles routes for likes
const User = require("../models/userModel");
const Like = require("../models/likeModel");
const Post = require("../models/postModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.likePost = catchAsync(async (req, res) => {
	const post = await Post.findById(req.params.postId);

	if (!post) {
		throw new AppError("This post does not exist.", 400);
	}

	const alreadyLiked = await Like.find({
		likedBy: req.user.id,
		post: req.params.postId,
	});

	if (alreadyLiked) {
		throw new AppError("You have already liked this post!");
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
