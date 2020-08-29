// Configuring the database before testing
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const Post = require("../../models/postModel");

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

// 02. CLEAR USER COLLECTION BEFORE TESTS
const setupUserCollection = async () => {
	await User.deleteMany();
};

// 03. CLEAR POSTS COLLECTION
const setupPostCollection = async () => {
	await Post.deleteMany();
	const user = await User.create(postUser);
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});

	postUser.token = token;
};

module.exports = {
	setupUserCollection,
	setupPostCollection,
	newUser,
	postUser,
};
