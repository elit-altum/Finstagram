// Handling user posts
const express = require("express");

const authController = require("../controllers/authController");
const postController = require("../controllers/postController");
const likeController = require("../controllers/likeController");
const commentController = require("../controllers/commentController");

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

// ? <--- UTILS --->

// ? REPUTATION LIMIT
router.get("/utils/getReputation", postController.getReputation);

// ? REPORT A POST
router.post("/utils/report", postController.reportPost);

// ? UN-REPORT A POST
router.post("/utils/unReport", postController.unReportPost);

// *? 2. EDIT A POST
router.patch("/edit/:postId", postController.editPost);

// *? 3. DELETE A POST
router.delete("/delete/:postId", postController.deletePost);

// *? 4. GET USER TIMELINE
router.get("/feed", postController.getTimeline);

// *? 5. GET TRENDING POSTS
router.get("/trending", postController.getTrending);

// *? 7. GET POSTS NEAR A LOCATION
router.get("/near", postController.getPostsNearTo);

// *? 8. GET POSTS BY A USER
router.get("/:username?", postController.getMyPosts);

// *? 9. GET INDIVIDUAL POST
router.get("/one/:postId", postController.getPost);

// *? <--- LIKES ---->

// *? LIKE A POST
router.get("/:postId/like", likeController.likePost);
// *? UNLIKE A POST
router.get("/:postId/unlike", likeController.unlikePost);
// *? GET ALL LIKES ON A POST
router.get("/:postId/likedBy", likeController.likedBy);

// *? <--- COMMENTS ---->

// *? COMMENT ON A POST
router.post("/:postId/comments", commentController.createComment);

// *? GET ALL COMMENTS ON A POST
router.get("/:postId/comments", commentController.getAllComments);

// *? DELETE COMMENT ON A POST
router.delete("/:postId/comment/:commentId", commentController.removeComment);

module.exports = router;
