// Handles routes for follow
const User = require("../models/userModel");
const Follow = require("../models/followModel");
const Notication = require("../models/notificationModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const createNotification = require("../utils/createNotification");

// *? 1. FOLLOW A USER
exports.followUser = catchAsync(async (req, res) => {
	const userToFollow = await User.findOne({ username: req.params.username });

	// a. Check if user to follow exists
	if (!userToFollow || !userToFollow.isActive) {
		throw new AppError("This user does not seem to exist", 400);
	}

	if (req.user.id === userToFollow.id) {
		throw new AppError("You cannot follow yourself!", 400);
	}

	// b. Check if user already follows requested user
	const existingFollow = await Follow.findOne({
		user: req.user.id,
		follows: userToFollow.id,
	});

	if (existingFollow) {
		throw new AppError("You already follow this user!", 400);
	}

	// c. Dispatch notification to user
	const notif = await createNotification.followNotification(
		userToFollow._id,
		req.user.id
	);

	if (!notif) {
		throw new AppError("Internal server error", 500);
	}

	// d. Create a new follow instance
	await Follow.create({
		user: req.user.id,
		follows: userToFollow._id,
		notification: notif._id,
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
	if (!userToUnfollow || !userToUnfollow.isActive) {
		throw new AppError("This user does not seem to exist", 400);
	}

	if (req.user.id === userToUnfollow.id) {
		throw new AppError("You cannot unfollow yourself.", 400);
	}

	// b. Check of user even follows this user
	const existingFollow = await Follow.findOne({
		user: req.user.id,
		follows: userToUnfollow.id,
	});

	if (!existingFollow) {
		throw new AppError("You do not follow this user.", 400);
	}

	// c. Delete the previously created follow instance
	await Follow.findOneAndRemove({
		user: req.user.id,
		follows: userToUnfollow._id,
	});

	res.status(200).json({
		status: "success",
		message: `You unfollowed @${userToUnfollow.username}`,
	});

	// d. Delete the follow notification
	await Notication.findByIdAndRemove(existingFollow.notification);
});

// *? 3. GET ALL FOLLOWERS OF A USER
exports.getAllFollowers = catchAsync(async (req, res) => {
	const username = req.params.username;

	const user = await User.findOne({ username })
		.populate({
			path: "followers",
			select: "user",
			populate: {
				path: "user",
				select: "username photo name",
			},
		})
		.select("username photo followers");

	if (!user) {
		throw new AppError("This user does not exist.", 404);
	}

	res.json({
		status: "success",
		data: {
			followers: user.followers,
		},
	});
});

// *? 3. GET ALL USERS FOLLOWED BY A USER
exports.getAllFollows = catchAsync(async (req, res) => {
	const username = req.params.username;

	const user = await User.findOne({ username })
		.populate({
			path: "follows",
			select: "follows",
			populate: {
				path: "follows",
				select: "username photo name",
			},
		})
		.select("username photo followers");

	if (!user) {
		throw new AppError("This user does not exist.", 404);
	}

	res.json({
		status: "success",
		data: {
			user,
		},
	});
});
