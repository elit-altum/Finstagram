// For dispatching or creating new notifications
const Notification = require("../models/notificationModel");
const catchAsync = require("./catchAsync");

// Create follow notification
exports.followNotification = async (toUser, fromUser) => {
	try {
		const notif = await Notification.create({
			to: toUser,
			from: fromUser,
			type: "follow",
		});

		return notif;
	} catch (error) {
		console.log(error);
	}
};

// Create like notification
exports.likeNotification = async (toUser, fromUser, postId) => {
	try {
		const notif = await Notification.create({
			to: toUser,
			from: fromUser,
			post: postId,
			type: "like",
		});

		return notif;
	} catch (error) {
		console.log(error);
	}
};

// Create comment notification
exports.commentNotification = async (toUser, fromUser, postId, comment) => {
	try {
		const notif = await Notification.create({
			to: toUser,
			from: fromUser,
			post: postId,
			data: comment,
			type: "comment",
		});

		return notif;
	} catch (error) {
		console.log(error);
	}
};

// Create admin notification
exports.adminNotification = async (toUser, message) => {
	try {
		const notif = await Notification.create({
			to: toUser,
			data: message,
			type: "admin",
		});

		return notif;
	} catch (error) {
		console.log(error);
	}
};
