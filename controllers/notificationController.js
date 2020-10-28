// Handles routes for notifications
const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const Like = require("../models/likeModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// ? Handling various notification types for frontend

// ?  1. Follow notifications
const handleFollowNotification = async (notif) => {
	const user = await User.findById(notif.from);

	const notification = {
		photo: user.photo,
		message: `@${user.username} started following you.`,
		link: `/user/${user.username}`,
		createdAt: notif.createdAt,
		read: notif.read,
	};

	return notification;
};

// ? 2. Like notifications
const handleLikeNotification = async (notif) => {
	const user = await User.findById(notif.from);
	const post = await Post.findById(notif.post);

	const notification = {
		photo: user.photo,
		post: post.photo,
		message: `@${user.username} liked your post.`,
		link: `/post/${post._id}`,
		createdAt: notif.createdAt,
		read: notif.read,
	};

	return notification;
};

// ? 3. Comment notifications
const handleCommentNotification = async (notif) => {
	const user = await User.findById(notif.from);
	const post = await Post.findById(notif.post);

	const notification = {
		photo: user.photo,
		post: post.photo,
		message: `@${user.username} commented on your post: ${notif.data}`,
		link: `/post/${post._id}`,
		createdAt: notif.createdAt,
		read: notif.read,
	};

	return notification;
};

// ? 4. Admin notifications
const handleAdminNotification = async (notif) => {
	const notification = {
		photo: notif.photo,
		link: notif.link,
		message: notif.data,
		createdAt: notif.createdAt,
		read: notif.read,
	};

	return notification;
};

// ? Handle notifications for frontend
const convertNotifications = async (notifs) => {
	const type = {
		like: handleLikeNotification,
		follow: handleFollowNotification,
		comment: handleCommentNotification,
		admin: handleAdminNotification,
	};

	const converted = notifs.map(async (notif) => {
		return await type[notif.type](notif);
	});

	const convertedNotifs = await Promise.all(converted);
	return convertedNotifs;
};

// ? 1. TO FETCH USER NOTIFICATIONS
exports.getNotifications = catchAsync(async (req, res) => {
	const page = req.query.page * 1 || 1;
	const limit = req.query.limit * 1 || 20;

	if (limit < 0 || page < 1) {
		throw new AppError("Invalid request format.", 404);
	}

	const skip = limit * (page - 1);

	const notifs = await Notification.find({
		to: req.user.id,
	})
		.sort({
			priority: -1,
			createdAt: -1,
		})
		.limit(limit)
		.skip(skip);

	const converted = await convertNotifications(notifs);
	res.status(200).json({
		status: "success",
		data: {
			notifications: converted,
		},
	});
});

// ? 2. TO MARK USER NOTIFICATIONS AS READ
exports.readNotifications = catchAsync(async (req, res) => {
	const lastDate = req.body.date;

	if (!lastDate) {
		throw new AppError("Invalid request format.", 404);
	}

	await Notification.updateMany(
		{
			createdAt: { $lte: lastDate },
			read: false,
		},
		{
			read: true,
		},
		{
			multi: true,
		}
	);

	res.status(200).json({
		status: "success",
	});
});
