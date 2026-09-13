const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ── Auth ──────────────────────────────────────
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    resetPasswordToken: String,
  resetPasswordExpires: Date,
  //   mobile: {
  //   type: String,
  //   required: false,
  //   unique: true,
  //   trim: true
  //  },
    password: {
      type: String,
      required: true,
      minlength: 6
    },

    // ── Profile ───────────────────────────────────
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 24,
      unique: true
    },
    fullName: {
      type: String,
      trim: true,
      maxlength: 50,
      default: ""
    },
     profileImage: {
    type: String, 
    default: ''},
    bio: {
      type: String,
      trim: true,
      maxlength: 200,
      default: ""
    },
    country: {
      type: String,
      trim: true,
      default: ""
    },
    dateOfBirth: {
      type: Date,
      default: null
    },
    profileSetup: {
      type: Boolean,
      default: false
    },

    // ── Settings ──────────────────────────────────
    role: {
      type: String,
      enum: ["player", "admin"],
      default: "player"
    },
    boardTheme: {
      type: String,
      enum: ["classic", "midnight", "forest", "ocean", "ruby", "walnut"],
      default: "classic"
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);