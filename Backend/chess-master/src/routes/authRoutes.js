
require("dotenv").config();

const express = require("express");
const authController = require("../controllers/authController");
const { isAuthenticated, isGuest } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const dns = require("dns");
const nodemailer = require("nodemailer");
const User = require("../models/User"); 
const router = express.Router();

dns.setDefaultResultOrder("ipv4first");

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
// FORGOT PASSWORD — sends reset link email
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate token (valid for 15 minutes)
    const token = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h3>You requested a password reset</h3>
        <p>Click the link below to reset your password (valid for 15 minutes):</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you didn't request this, ignore this email.</p>
      `,
    });

    res.json({ message: "Reset link sent to your email" });
  } catch (err) {
    console.error("FORGOT PASSWORD ERROR:", err);
  console.error("FULL ERROR:", err.stack);

  return res.status(500).json({
    success: false,
    message: err.message
  });
  }
});
// RESET PASSWORD — update password using reset token
router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password, confirmPassword } = req.body;

    // Check required fields
    if (!password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirm password are required."
      });
    }

    // Check password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match."
      });
    }

    // Same minimum password rule as registration
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters."
      });
    }

    // Find user with valid token that has not expired
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired."
      });
    }

    // Hash password using the same bcryptjs used during registration
    const hashedPassword = await bcrypt.hash(password, 12);

    user.password = hashedPassword;

    // Remove token so it cannot be used again
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully. You can now login."
    });

  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
});
router.get("/api/me", authController.getMe);

module.exports = router;
