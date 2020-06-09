// Handling user posts
const express = require("express");

const authController = require("../controllers/authController");
const likeController = require("../controllers/likeController");

const router = express.Router();

// ! ALL ROUTES HERE ARE PROTECTED BY authController.protectRoute()
router.use(authController.protectRoute);

router.get("/like/:postId", likeController.likePost);
router.get("/unlike/:postId", likeController.unlikePost);

router.get("/likedBy/:postId", likeController.likedBy);

module.exports = router;
