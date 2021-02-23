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
    reputation : {
      type: Number,
      default: 0
    },
		dimensions: {
			type: String,
			required: true,
		},
		locationName: {
			type: String,
			default: "",
		},
		location: {
			type: {
				type: String,
				default: "Point",
			},
			coordinates: {
				type: [Number],
				default: [],
			},
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Indexing the location coordinates
postSchema.index(
	{ location: "2dsphere" },
	{
		sparse: true,
	}
);

// 0a. Virtual property for getting users which liked the post
postSchema.virtual("likers", {
	ref: "Like",
	foreignField: "post",
	localField: "id",
});

// 0b. Virtual property for getting number of likes
postSchema.virtual("likes", {
	ref: "Like",
	foreignField: "post",
	localField: "_id",
	count: true,
});

// 0c. Virtual property for getting number of comments
postSchema.virtual("comments", {
	ref: "Comment",
	foreignField: "post",
	localField: "_id",
	count: true,
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
