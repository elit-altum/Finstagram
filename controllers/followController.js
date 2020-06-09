// Handles routes for follow
const User = require("../models/userModel");
const Follow = require("../models/followModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// *? 1. FOLLOW A USER
exports.followUser = catchAsync(async (req, res) => {
	const userToFollow = await User.findOne({ username: req.params.username });

	// a. Check if user to follow exists
	if (!userToFollow) {
		throw new AppError("This user does not seem to exist", 400);
	}

	if (currentUser.id === userToUnfollow.id) {
		throw new AppError("You cannot follow yourself!", 400);
	}

	// b. Get all users which the user already follows
	const currentUser = await User.findById(req.user.id).populate({
		path: "follows",
		select: "follows -user",
	});

	// c. Check if user already follows the other user
	if (currentUser.follows.length) {
		if (
			!currentUser.follows.every(
				(user) => user.follows.toString() !== userToFollow._id.toString()
			)
		) {
			throw new AppError("You already follow this user", 400);
		}
	}

	// d. Create a new follow instance
	const follow = await Follow.create({
		user: req.user.id,
		follows: userToFollow._id,
	});

	res.status(200).json({
		status: "success",
		message: `You now follow @${userToFollow.username}`,
	});
});

// *? 2. UNFOLLOW A USER
exports.unfollowUser = catchAsync(async (req, res) => {
	const userToUnfollow = await User.findOne({ username: req.params.username });

	// a. Check if user to unfollow exists
	if (!userToUnfollow) {
		throw new AppError("This user does not seem to exist", 400);
	}

	// b. Get all users which the user already follows
	const currentUser = await User.findById(req.user.id).populate({
		path: "follows",
		select: "follows -user",
	});

	if (currentUser.id === userToUnfollow.id) {
		throw new AppError("You cannot follow yourself!", 400);
	}

	// c. Check if user doesn't even follow the other user
	if (!currentUser.follows.length) {
		throw new AppError("You don't follow this user", 400);
	} else if (
		!currentUser.follows.every((user) => user.follows !== userToUnfollow._id)
	) {
		throw new AppError("You don't follow this user", 400);
	}

	// d. Delete the previously created follow instance
	const follow = await Follow.findOneAndRemove({
		user: req.user.id,
		follows: userToUnfollow._id,
	});

	res.status(200).json({
		status: "success",
		message: `You unfollowed @${userToUnfollow.username}`,
	});
});
