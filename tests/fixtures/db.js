// Configuring the database before testing
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const Post = require("../../models/postModel");

// 01. SAMPLE USERS FOR TESTS
let sampleUser = {
	name: "John Flank",
	username: "john_flank",
	email: "john_flank@gmail.com",
	password: "pass1234",
	passwordConfirm: "pass1234",
};

let newUser = {
	name: "Kevin Flank",
	username: "kev_flank",
	password: "test1234",
	passwordConfirm: "test1234",
	email: "kev@gmail.com",
};

// 02. CLEAR USER COLLECTION BEFORE TESTS
const setupUserCollection = async () => {
	await User.deleteMany();
	const user = await User.create(sampleUser);
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	});

	sampleUser.token = token;
};

// 03. CLEAR POSTS COLLECTION
const setupPostCollection = async () => {
	await Post.deleteMany();
};

module.exports = {
	setupUserCollection,
	setupPostCollection,
	sampleUser,
	newUser,
};
