// Action Model: Like Posts
const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema(
	{
		likedBy: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
		post: {
			type: mongoose.Schema.ObjectId,
			ref: "Post",
		},
		notification: {
			type: mongoose.Schema.ObjectId,
			ref: "Notification",
		},
	},
	{
		timestamps: true,
	}
);

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
