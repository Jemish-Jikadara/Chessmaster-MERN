
require("dotenv").config();

const express = require("express");
const authController = require("../controllers/authController");
const { isAuthenticated, isGuest } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { google } = require("googleapis");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User"); 
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

// Gmail API authentication
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  "http://localhost:3000/oauth2callback"
);

oauth2Client.setCredentials({
  refresh_token: process.env.GMAIL_REFRESH_TOKEN
});

const gmail = google.gmail({
  version: "v1",
  auth: oauth2Client
});

// Email content
const emailBody = `
  <h2>ChessMaster Password Reset</h2>

  <p>You requested to reset your ChessMaster password.</p>

  <p>
    Click the button below to reset your password:
  </p>

  <p>
    <a href="${resetLink}"
       style="
         display:inline-block;
         padding:12px 20px;
         background:#d4af37;
         color:#000;
         text-decoration:none;
         border-radius:6px;
         font-weight:bold;
       ">
      Reset Password
    </a>
  </p>

  <p>This reset link is valid for <strong>15 minutes</strong>.</p>

  <p>If you did not request this password reset, you can safely ignore this email.</p>

  <p>— ChessMaster Team</p>
`;

// Create email
const rawMessage = [
  `From: ChessMaster <${process.env.EMAIL_USER}>`,
  `To: ${email}`,
  `Subject: Password Reset Request`,
  `MIME-Version: 1.0`,
  `Content-Type: text/html; charset=UTF-8`,
  "",
  emailBody
].join("\r\n");

// Gmail API requires Base64URL encoding
const encodedMessage = Buffer
  .from(rawMessage)
  .toString("base64")
  .replace(/\+/g, "-")
  .replace(/\//g, "_")
  .replace(/=+$/, "");

// Send email through Gmail API
await gmail.users.messages.send({
  userId: "me",
  requestBody: {
    raw: encodedMessage
  }
});

res.json({
  success: true,
  message: "Reset link sent to your email"
});
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
router.get("/api/me",isAuthenticated, authController.getMe);
router.get("/api/me",isAuthenticated, authController.getMe);

// ── VERIFY EMAIL ───────────────────────────────
// ── VERIFY EMAIL (JSON — frontend calls this) ───
router.get("/verify-email/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verifyEmailToken: token,
      verifyEmailExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Verification link is invalid or has expired."
      });
    }

    user.isVerified = true;
    user.verifyEmailToken = null;
    user.verifyEmailExpires = null;
    await user.save();

    return res.json({
      success: true,
      message: "Email verified successfully. You can now login."
    });
  } catch (err) {
    console.error("Verify email error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

// ── RESEND VERIFICATION ────────────────────────
router.post("/resend-verification", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    if (user.isVerified) {
      return res.status(400).json({ success: false, message: "Email already verified." });
    }

    const verifyEmailToken = crypto.randomBytes(32).toString("hex");
    user.verifyEmailToken = verifyEmailToken;
    user.verifyEmailExpires = Date.now() + 60 * 60 * 1000;
    await user.save();

    const verifyLink = `${process.env.CLIENT_URL}/verify-email/${verifyEmailToken}`;
    const verifyHtml = `
      <h2>Verify your ChessMaster email</h2>
      <p><a href="${verifyLink}"
         style="display:inline-block;padding:12px 20px;background:#d4af37;
                color:#000;text-decoration:none;border-radius:6px;font-weight:bold;">
         Verify Email</a></p>
      <p>Or paste: ${verifyLink}</p>
      <p>Valid for <strong>1 hour</strong>.</p>
    `;

    await sendEmail({
      to: email,
      subject: "Verify your ChessMaster email",
      html: verifyHtml
    });

    return res.json({ success: true, message: "Verification email sent." });
  } catch (err) {
    console.error("Resend verification error:", err);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
});

module.exports = router;
