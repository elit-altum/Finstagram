// Handling user posts
const express = require("express");
const Post = require("../models/postModel");

const authController = require("../controllers/authController");
const postController = require("../controllers/postController");

const router = express.Router();

// ! ALL ROUTES HERE ARE PROTECTED BY authController.protectRoute()
router.use(authController.protectRoute);

// *? 1. CREATE A POST
router.post(
	"/createPost",
	postController.uploadPostPhoto,
	postController.convertImageToJpeg,
	postController.storePost
);

module.exports = router;
