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
exports.likeNotification = catchAsync(async (toUser, fromUser, postId) => {
	const notif = await Notification.create({
		to: toUser,
		from: fromUser,
		post: postId,
		type: "like",
	});

	return notif;
});
