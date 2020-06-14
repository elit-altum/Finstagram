// Handles routes specific to comments

const Post = require("../models/postModel");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// ! ALL ROUTES HERE MUST BE PROTECTED BY authController.protectRoute()

// *? 1. CREATE A NEW COMMENT ON A POST
exports.createComment = catchAsync(async (req, res) => {
	const postId = req.params.postId;

	if (!req.body.comment) {
		throw new AppError("Please add a comment body.", 400);
	}

	const post = await Post.findById(postId);

	if (!post) {
		throw new AppError("This post does not exist.", 404);
	}

	const comment = await Comment.create({
		createdBy: req.user.id,
		post: postId,
		body: req.body.comment,
	});

	const newComment = await Comment.findById(comment.id).populate({
		path: "createdBy",
		select: "username photo",
	});

	res.status(200).json({
		status: "success",
		data: {
			comment: newComment,
		},
	});
});

// *? 2. REMOVE A COMMENT ON A POST
exports.removeComment = catchAsync(async (req, res) => {
	const postId = req.params.postId;
	const commentId = req.params.commentId;

	const post = await Post.findById(postId);

	if (!post) {
		throw new AppError("This post does not exist.", 404);
	}

	const comment = await Comment.findById(commentId);

	if (!comment) {
		throw new AppError("This comment does not exist.", 404);
	}

	if (comment.createdBy != req.user.id) {
		throw new AppError("You do not have permission for this.", 403);
	}

	await Comment.findByIdAndRemove(comment.id);

	res.status(204).json({
		status: "success",
		data: {
			comment,
		},
	});
});

// *? 3. GET ALL COMMENTS
exports.getAllComments = catchAsync(async (req, res) => {
	const postId = req.params.postId;

	const post = await Post.findById(postId);

	if (!post) {
		throw new AppError("This post does not exist.", 404);
	}

	const comments = await Comment.find({
		post: postId,
	})
		.populate({
			path: "createdBy",
			select: "username photo",
		})
		.select("-__v");

	res.status(200).json({
		status: "success",
		results: comments.length,
		data: {
			comments,
		},
	});
});
