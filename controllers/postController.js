// Handles routes specific to post
const { promisify } = require("util");
const path = require("path");

const multer = require("multer");
const sharp = require("sharp");

const cloudinary = require("cloudinary").v2;

const Post = require("../models/postModel");
const User = require("../models/userModel");
const Follow = require("../models/followModel");
const Like = require("../models/likeModel");
const Report = require("../models/reportModel");

const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// ! ALL ROUTES HERE MUST BE PROTECTED BY authController.protectRoute()

// *? 1. CREATE NEW POST

// * 1a. Multer for image handling
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith("image")) {
		cb(null, true);
	} else {
		cb(new AppError("Please upload images only!", 400));
	}
};

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
	limits: {
		fileSize: 7000000, // 7MB
	},
});

exports.uploadPostPhoto = upload.single("photo");

exports.convertImageToJpeg = async (req, res, next) => {
	if (!req.file) {
		throw new AppError("Please provide an image.", 400);
	}

	req.file.filename = `post-${req.user.id}-${new Date(
		Date.now()
	).getTime()}.jpg`;

	await sharp(req.file.buffer)
		.resize(500, 500)
		.toFormat("jpeg")
		.jpeg({ quality: 90 })
		.toFile(`public/img/posts/${req.file.filename}`);

	next();
};

// * 1b. Store post to database
exports.storePost = catchAsync(async (req, res) => {
	const caption = req.body.caption || "";
	const locationName = req.body.locationName || "";
	let { latitude, longitude } = req.body;
	let location = [];

	if (latitude && longitude) {
		latitude = latitude * 1;
		longitude = longitude * 1;
		location = [longitude, latitude];
	} else {
		location = [0, 0];
	}

	const imagePath = path.join(
		__dirname,
		"..",
		"public",
		"img",
		"posts",
		req.file.filename
	);

	const uploadPublicId = `post-${req.user._id}-${Date.now()}`;

	const image = await cloudinary.uploader.upload(
		imagePath,
		(options = {
			public_id: uploadPublicId,
		})
	);

	const newPost = {
		caption,
		location: {
			coordinates: location,
		},
		locationName,
		photo: image.url,
		dimensions: "500 x 500",
		createdBy: req.user.id,
	};

	// Create the new post
	const post = await Post.create(newPost);

	// Update the post date of user
	await User.findByIdAndUpdate(req.user.id, {
		lastPostAt: Date.now(),
	});

	res.status(201).send({
		status: "success",
		data: {
			post,
			public_id: uploadPublicId,
		},
	});
});

// *? 2. EDIT A POST
exports.editPost = catchAsync(async (req, res) => {
	const post = await Post.findById(req.params.postId);

	if (req.body.photo) {
		throw new AppError("You can only edit captions in a post.", 400);
	}

	const caption = req.body.caption || "";

	// a. If post exists or not
	if (!post) {
		throw new AppError("No post found with this id.", 400);
	}

	// b. If user editing the post has only created it
	if (post.createdBy.toString() != req.user._id) {
		throw new AppError("You do not have permission to delete this post.", 403);
	}

	// c. Edit the post
	const updatedPost = await Post.findByIdAndUpdate(
		req.params.postId,
		{ caption },
		{ new: true }
	);

	res.status(200).json({
		status: "success",
		data: {
			post: updatedPost,
		},
	});
});

// *? 3. DELETE A POST
exports.deletePost = catchAsync(async (req, res) => {
	const post = await Post.findById(req.params.postId);

	// a. If post exists or not
	if (!post) {
		throw new AppError("No post found with this id.", 400);
	}

	// b. If user deleting the post has only created it
	if (post.createdBy.toString() != req.user._id) {
		throw new AppError("You do not have permission to delete this post.", 403);
	}

	// c. Delete the post
	await Post.findByIdAndRemove(req.params.postId);

	res.status(204).json({
		status: "success",
	});
});

// *? 4. GET POSTS TO SHOW TO A USER (timeline)
exports.getTimeline = catchAsync(async (req, res) => {
	// a. For pagination
	const limit = Number(req.query.limit) || 10;
	const skip = (Number(req.query.page) - 1) * limit || 0;

	// b. Get current user and the id of users it follows
	const userFollows = await Follow.find({
		user: req.user._id,
	}).populate({
		path: "follows",
		select: "isActive",
	});

	// c. Check if followed users are active anymore or not
	const userFollowsArray = [];
	userFollows.forEach((user) => {
		if (user.follows.isActive) {
			userFollowsArray.push(user.follows.id);
		}
	});

	userFollowsArray.push(req.user.id);

	// d. Get posts by followers
	const posts = await Post.find({
		createdBy: {
			$in: userFollowsArray,
		},
	})
		.sort({
			createdAt: -1,
		})
		.limit(limit)
		.skip(skip)
		.populate("likes")
		.populate("comments")
		.populate({
			path: "createdBy",
			select: "username photo",
		});

	const newPosts = posts.map(async (post) => {
		const likedByMe = await Like.findOne({
			likedBy: req.user._id,
			post: post._id,
		});

		let newPost = post.toObject();

		if (likedByMe) {
			newPost.likedByMe = true;
		} else {
			newPost.likedByMe = false;
		}

		return newPost;
	});

	const sendNewPosts = await Promise.all(newPosts);

	res.status(200).json({
		status: "success",
		results: posts.length,
		data: {
			posts: sendNewPosts,
		},
	});
});

// *? 5. GET POSTS BY A USER / MY POSTS
exports.getMyPosts = catchAsync(async (req, res) => {
	const username = req.params.username || req.user.username;

	const user = await User.findOne({ username });

	if (!user || !user.isActive) {
		throw new AppError("This user does not exist.", 404);
	}

	// a. For pagination
	const limit = Number(req.query.limit) || 10;
	const skip = (Number(req.query.page) - 1) * limit || 0;

	// b. Get posts by user
	const posts = await Post.find({
		createdBy: user._id,
	})
		.sort({ createdAt: -1 })
		.limit(limit)
		.skip(skip)
		.populate("likes")
		.populate("comments")
		.populate({
			path: "createdBy",
			select: "username photo",
		})
		.select("photo caption dimensions");

	res.status(200).json({
		status: "success",
		results: posts.length,
		data: {
			posts,
		},
	});
});

// *? 6. GET INDIVIDUAL POST
exports.getPost = catchAsync(async (req, res) => {
	const postId = req.params.postId;

	const post = await Post.findById(postId)
		.populate({
			path: "createdBy",
			select: "username photo isActive",
		})
		.populate("likes")
		.populate("comments");

	if (!post || !post.createdBy.isActive) {
		throw new AppError("No post found.", 404);
	}

	const like = await Like.findOne({
		post: post.id,
		likedBy: req.user.id,
	});

	let newPost = post.toObject();

	if (like) {
		newPost.likedByMe = true;
	} else {
		newPost.likedByMe = false;
	}

	res.status(200).json({
		status: "success",
		results: {
			post: newPost,
		},
	});
});

// *? 7. GET TRENDING POSTS
exports.getTrending = catchAsync(async (req, res) => {
	/* 
  a. Aggregation Pipeline to sort posts on the basis of: 
   -> (time since created) / likes
   lower the score, higher the position on the result.

  b. Aggregation pipeline steps
    - $lookup: populate the 'likes' field with all people who liked the post.
    - $addFields: only get the array size of likers as we only need no. of likes
                  find the difference in date when post was created and now ($$NOW provided by mongodb with system current time)
    - $addFields: calculate the trendScore based on the previously calculated data 
    - $project: to only select the required fields in every document
    - $sort and $limit: only return the top 10 trending posts.
    Aggregation pipeline returns all documents as plain JS Objects and not MongoDB Documents
  */

	const posts = await Post.aggregate([
		{
			$lookup: {
				from: "likes",
				localField: "_id",
				foreignField: "post",
				as: "likers",
			},
		},
		{
			$addFields: {
				likes: { $size: "$likers" },
				dateDifference: {
					$subtract: ["$$NOW", "$createdAt"],
				},
			},
		},
		{
			$match: {
				likes: { $gt: 0 },
			},
		},
		{
			$addFields: {
				trendScore: {
					$divide: ["$dateDifference", "$likes"],
				},
			},
		},
		{
			$project: {
				photo: 1,
				caption: 1,
				createdBy: 1,
				dimensions: 1,
				createdAt: 1,
				trendScore: 1,
				likes: 1,
				locationName: 1,
				location: 1,
			},
		},
		{
			$sort: {
				trendScore: 1,
			},
		},
		{
			$limit: 10,
		},
	]);

	//c1. Check if every post is liked by user or not
	const ifLikedPosts = posts.map(async (post) => {
		const likedByMe = await Like.findOne({
			likedBy: req.user._id,
			post: post._id,
		});

		if (likedByMe) {
			post.likedByMe = true;
		} else {
			post.likedByMe = false;
		}

		return post;
	});

	// c2. Resolve promises in array
	const ifLikedPostsResolved = await Promise.all(ifLikedPosts);

	// d. Populate the user info for every post
	const populatedPosts = await Post.populate(ifLikedPostsResolved, {
		path: "createdBy",
		select: "username photo isActive",
	});

	// e. Send trending posts
	res.status(200).json({
		status: "success",
		data: {
			results: populatedPosts.length,
			posts: populatedPosts,
		},
	});
});

// *? 8. GET POSTS NEAR A LOCATION
exports.getPostsNearTo = catchAsync(async (req, res) => {
	const { lat, lng } = req.query;

	if (!lat || !lng) {
		throw new AppError("Please provide coordinates.", 400);
	}

	// Get posts with a valid location in a 20Km radius of specified center
	const nearByPosts = await Post.aggregate([
		{
			$geoNear: {
				near: {
					type: "Point",
					coordinates: [lng * 1, lat * 1],
				},
				query: { locationName: { $ne: "" } },
				maxDistance: 20 * 1000,
				distanceField: "displacement",
				spherical: true,
			},
		},
		{
			$sort: {
        reputation: -1,
        createdAt: -1,
				displacement: 1
			},
		},
		{
			$limit: 20,
		},
	]);

	let populatedPosts = await Post.populate(nearByPosts, [
		{
			path: "createdBy",
			select: "username photo isActive",
		},
		{
			path: "likes",
		},
		{
			path: "comments",
		},
	]);

	const promisesArray = populatedPosts.map(async (post) => {
		const isLiked = await Like.findOne({
			likedBy: req.user._id,
			post: post._id,
		});

    const isReported = await Report.findOne({
      user: req.user._id,
      post: post._id
    })

    post.likedByMe = isLiked ? true : false;
    post.reportedByMe = isReported ? true : false;
		return post;
	});

	const resolvedArray = await Promise.all(promisesArray);

	res.status(200).json({
		status: "success",
		data: {
			location: {
				latitude: lat * 1,
				longitude: lng * 1,
				name: nearByPosts[0].locationName,
			},
			posts: resolvedArray,
		},
	});
});

// ? FOR REPUTATION AND REPORTS

// *? 9. REPUTATION LIMIT
exports.getReputation = catchAsync(async (req, res) => {
  const allUsers = await User.find({});
  const currUsers = allUsers.length;

  return res.status(200).json({
		status: "success",
		results: {
			reputationLimit: Math.ceil(currUsers * 0.2)
		},
	});
})

// *? 10. REPORT POST
exports.reportPost = catchAsync(async(req, res) => {
  const {post, status} = req.body;

  if(!post || !status) {
    throw new AppError('Please provide the status and post.', 400);
  }

  const isReviewed = await Report.findOne({
    user: req.user._id,
    post
  });

  if(isReviewed) {
    throw new AppError('User has already reported.', 400);
  }
  
  const postExists = await Post.findById(post);

  if(!postExists) {
    throw new AppError('No post found.', 400);
  }

  // Create a new report
  const newReport = await Report.create({
    user: req.user._id,
    post,
    status,
  });

  if(!newReport) {
    throw new AppError('Internal server error.', 500);
  }

  // Update post reputation
  const updatedPost = await Post.findByIdAndUpdate(post, {
    $inc: {
      reputation: -1,
    }
  })

  if(!updatedPost) {
    throw new AppError('Internal server error.', 500);
  }

  return res.status(200).json({
    status: "success",
  });
});

// *? 11. UN-REPORT POST
exports.unReportPost = catchAsync(async (req, res) => {
  const {
    post,
  } = req.body;

  if (!post) {
    throw new AppError('Please provide the post.', 400);
  }

  const isReviewed = await Report.findOne({
    user: req.user._id,
    post
  });

  if (!isReviewed) {
    throw new AppError('User has not reported.', 400);
  }

  const postExists = await Post.findById(post);

  if (!postExists) {
    throw new AppError('No post found.', 400);
  }

  // Create a new report
  const newReport = await Report.findByIdAndDelete(isReviewed._id);

  if (!newReport) {
    throw new AppError('Internal server error.', 500);
  }

  // Update post reputation
  const updatedPost = await Post.findByIdAndUpdate(post, {
    $inc: {
      reputation: 1,
    }
  })

  if (!updatedPost) {
    throw new AppError('Internal server error.', 500);
  }

  return res.status(200).json({
    status: "success",
  });
});