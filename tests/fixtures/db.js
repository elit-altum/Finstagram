// Configuring the database before testing
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const Post = require("../../models/postModel");
const Like = require("../../models/likeModel");
const Comment = require("../../models/commentModel");

// 01. SAMPLE USERS FOR TESTS

let newUser = {
	name: "Kevin Flank",
	username: "kev_flank",
	password: "test1234",
	passwordConfirm: "test1234",
	email: "kev@gmail.com",
};

let postUser = {
	name: "Jen Doe",
	username: "jen_doe",
	password: "test1234",
	passwordConfirm: "test1234",
	email: "jen@gmail.com",
};

let userOne = {
	name: "Mark Ruffalo",
	username: "mark_ruff",
	password: "test1234",
	passwordConfirm: "test1234",
	email: "mark_ruff@gmail.com",
};

let userTwo = {
	name: "Bruce Banner",
	username: "bruce_hulk",
	password: "test1234",
	passwordConfirm: "test1234",
	email: "bruce_hulk@gmail.com",
};

let samplePost = {
	photo: "/photo-url",
	caption: "my-caption",
	dimensions: "500 x 500",
	locationName: "DLF Cyber City",
	location: {
		type: "Point",
		coordinates: [77.0864596, 28.4940474],
	},
	createdAt: Date.now(),
};

let samplePostTwo = {
	photo: "/photo-url",
	caption: "my-caption",
	dimensions: "500 x 500",
	locationName: "DLF Cyber City",
	location: {
		type: "Point",
		coordinates: [77.0864596, 28.4940474],
	},
	createdAt: Date.now(),
};

// 02. SETUP BEFORE AUTH TESTS
const setupAuthCollection = async () => {
	await User.deleteMany();
};

// 03. SETUP BEFORE POST TESTS
const setupPostCollection = async () => {
	await Post.deleteMany();
	await User.deleteMany();
	const user = await User.create(postUser);
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});

	postUser.token = token;
};

// 04. SETUP BEFORE USER TESTS
const setupUserCollection = async () => {
	await User.deleteMany();

	// First user
	const firstUser = await User.create(userOne);
	const firstToken = jwt.sign({ id: firstUser._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});

	userOne.token = firstToken;

	// Second user
	const secondUser = await User.create(userTwo);
	const secondToken = jwt.sign({ id: secondUser._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});

	userTwo.token = secondToken;

	// Create post one
	samplePost.createdBy = firstUser._id;

	const post = await Post.create(samplePost);
	samplePost._id = post._id;

	// Create post two
	samplePostTwo.createdBy = secondUser._id;

	const postTwo = await Post.create(samplePostTwo);
	samplePostTwo._id = postTwo._id;
};

module.exports = {
	setupUserCollection,
	setupPostCollection,
	setupAuthCollection,
	newUser,
	postUser,
	userOne,
	userTwo,
	samplePost,
};
