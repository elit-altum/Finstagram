// Handling user posts
const express = require("express");

const authController = require("../controllers/authController");
const followController = require("../controllers/followController");

const router = express.Router();

// ! ALL ROUTES HERE ARE PROTECTED BY authController.protectRoute()
router.use(authController.protectRoute);

// *? 1. FOLLOW A USER
router.get("/follow/:userId", followController.followUser);

// *? 2. UNFOLLOW A USER
router.get("/unfollow/:userId", followController.unfollowUser);

module.exports = router;
