// Handling user posts
const express = require("express");

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

// *? 2. EDIT A POST
router.patch("/editPost/:postId", postController.editPost);

// *? 3. DELETE A POST
router.delete("/deletePost/:postId", postController.deletePost);

// *? 4. GET USER TIMELINE
router.get("/timeline", postController.getTimeline);

module.exports = router;
