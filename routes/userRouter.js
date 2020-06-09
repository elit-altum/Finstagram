// Handles users and authentication routes
const express = require("express");
const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

// *? 1. BASICS
router.post("/signup", authController.signupUser);
router.post("/login", authController.loginUser);
router.get("/logout", authController.logoutUser);

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

router.delete("/deleteMe", userController.deactivateUser);

// *? 4. GET A USER
router.get("/user/:username?", userController.getUser);

// *? ADMIN ONLY ROUTES
router.use(authController.restrictTo("admin"));

// *? DELETE USER FROM DB
router.delete("/deleteUser/:userId", userController.deleteUser);

module.exports = router;
