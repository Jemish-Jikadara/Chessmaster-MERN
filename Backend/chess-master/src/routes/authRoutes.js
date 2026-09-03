const express = require("express");
const authController = require("../controllers/authController");
const { isAuthenticated, isGuest } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

const router = express.Router();

function handleUpload(req, res, next) {
  upload.single("profileImage")(req, res, function (err) {
    if (err) {
      console.error("Upload error:", err.message);
      return res.status(400).json({ success: false, message: err.message || "Image upload failed. Try again." });
    }
    next();
  });
}

router.post("/register", isGuest, authController.registerUser);
router.post("/setup-profile", handleUpload, authController.setupProfile);

// Edit Profile
router.post("/profile/edit", isAuthenticated, handleUpload, authController.updateProfile);

router.post("/login", isGuest, authController.loginUser);

router.get("/profile", isAuthenticated, authController.showProfile);
router.get("/friends", isAuthenticated, authController.showFriends);
router.get("/profile/status", isAuthenticated, authController.showStatus);
router.post("/logout", isAuthenticated, authController.logoutUser);

router.get("/api/me", authController.getMe);

module.exports = router;
