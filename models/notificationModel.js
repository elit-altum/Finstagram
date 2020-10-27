// Notification schema and model
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
	{
		to: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
			required: true,
		},
		from: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
		type: {
			type: String,
			enum: ["follow", "comment", "like", "admin"],
			required: true,
		},
		priority: {
			type: Number,
			default: 0,
		},
		read: {
			type: Boolean,
			default: false,
		},
		post: {
			type: mongoose.Schema.ObjectId,
			ref: "Post",
		},
		data: {
			type: String,
		},
		photo: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
