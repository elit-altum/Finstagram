// Handles users and authentication routes
const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const followController = require("../controllers/followController");
const notificationController = require("../controllers/notificationController");

const router = express.Router();

// *? 1. BASICS
router.post("/signup", authController.signupUser);
router.post("/login", authController.loginUser);
router.get("/logout", authController.logoutUser);

// *? 1B. UTILITY: CHECK IF USER IS LOGGED IN
router.get("/isLoggedIn", authController.isLoggedIn);

// *? 2. FORGOT AND RESET PASSWORD
router.post("/forgotPassword", authController.generateResetToken);
router.patch("/resetPassword/:token", authController.resetPassword);

// *? PROTECTED ROUTES
router.use(authController.protectRoute);

// *? 3. UPDATE USER DETAILS
router.patch(
	"/updateMe",
	userController.uploadUserProfile,
	userController.resizeUserImage,
	userController.updateMe
);
router.patch("/updatePassword", userController.updatePassword);

// *? 4. DEACTIVATE A USER
router.delete("/deleteMe", userController.deactivateUser);

// *? 5. GET A USER
router.get("/user/:username?", userController.getUser);

// *? 6. SEARCH A USER
router.post("/search", userController.searchUser);

// *? 7. GET RANDOM USERS
router.get("/random", userController.findRandomUsers);

// *? <---- FOLLOW ---->

// *? FOLLOW A USER
router.get("/:username/follow", followController.followUser);
// *? UNFOLLOW A USER
router.get("/:username/unfollow", followController.unfollowUser);

// *? ALL FOLLOWERS OF A USER
router.get("/:username/followers", followController.getAllFollowers);
// *? ALL FOLLOWS OF A USER
router.get("/:username/follows", followController.getAllFollows);

// *? <---- NOTIFICATIONS ---->

// *? ALL NOTIFICATIONS OF A USER
router.get("/notifications", notificationController.getNotifications);

// *? MARK AS READ ALL NOTIFICATIONS OF A USER
router.post("/notifications/read", notificationController.readNotifications);

// *? <---- ADMIN ONLY ROUTES ---->
router.use(authController.restrictTo("admin"));

// *? DELETE USER FROM DB
router.delete("/deleteUser/:userId", userController.deleteUser);

module.exports = router;
