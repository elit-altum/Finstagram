// Handling user posts
const express = require("express");

const authController = require("../controllers/authController");
const postController = require("../controllers/postController");
const likeController = require("../controllers/likeController");

const router = express.Router();

// ! ALL ROUTES HERE ARE PROTECTED BY authController.protectRoute()
router.use(authController.protectRoute);

// *? 1. CREATE A POST
router.post(
	"/create",
	postController.uploadPostPhoto,
	postController.convertImageToJpeg,
	postController.storePost
);

// *? 2. EDIT A POST
router.patch("/edit/:postId", postController.editPost);

// *? 3. DELETE A POST
router.delete("/delete/:postId", postController.deletePost);

// *? 4. GET USER TIMELINE
router.get("/feed", postController.getTimeline);

// *? 5. GET POSTS BY A USER
router.get("/myPosts/:username?", postController.getMyPosts);

// *? 6. GET INDIVIDUAL POST
router.get("/:postId", postController.getPost);

// *? <--- LIKES ---->

router.get("/:postId/like", likeController.likePost);
router.get("/:postId/unlike", likeController.unlikePost);

router.get("/:postId/likedBy", likeController.likedBy);

module.exports = router;
