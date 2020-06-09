// Post Schema/Model
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		photo: {
			type: String,
			required: [true, "Please provide an image in post"],
		},
		caption: {
			type: String,
			maxlength: 400,
		},
		createdBy: {
			type: mongoose.Schema.ObjectId,
			ref: "User",
		},
		dimensions: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

// 1. Query middleware for populating createdBy
// postSchema.pre(/find^/, function (next) {
// 	// Populate createdBy with the user info
// 	this.populate({
// 		path: "createdBy",
// 		select: "username photo",
// 	});
// });

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
