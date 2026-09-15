const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Game = require("../models/Game");
const Rating = require("../models/Rating");
const Friend = require("../models/Friend");
const Statistic = require("../models/Statistic");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");


function createAuthToken(user) {
  return jwt.sign(
    sessionUserFromDoc(user),
    process.env.JWT_SECRET || "chessmasterjwtsecret",
    { expiresIn: "7d" }
  );
}
function sessionUserFromDoc(user) {
  return {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    rapidRating: user.rapidRating,
    blitzRating: user.blitzRating,
    bulletRating: user.bulletRating,
    boardTheme: user.boardTheme,
    profileImage: user.profileImage
  };
}

// ── REGISTER STEP 1 ──────────────────────────
async function registerUser(req, res) {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!email  || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match." });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }
    // if (!/^\d{10}$/.test(mobile)) {
    //   return res.status(400).json({ success: false, message: "Invalid mobile number format." });
    // }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.profileSetup) {
      return res.status(409).json({ success: false, message: "Email is already registered." });
    }
    // const existingMobile = await User.findOne({ mobile });

    // if (existingMobile && existingMobile.profileSetup) {
    //   return res.status(409).json({ success: false, message: "Mobile number is already registered." });
    // }

    const hashedPassword = await bcrypt.hash(password, 12);
    const setupToken = crypto.randomBytes(32).toString("hex");
    const tempUsername = "user_" + Date.now();

    if (existingUser && !existingUser.profileSetup) {
      existingUser.password = hashedPassword;
      existingUser.setupToken = setupToken;
      await existingUser.save();
    } else {
      const user = await User.create({
        email,
        password: hashedPassword,
        username: tempUsername,
        profileSetup: false,
        setupToken
      });
      await Rating.create({ user: user._id });
      await Friend.create({ user: user._id });
      await Statistic.create({ user: user._id });
    }

    req.session.setupEmail = email;

    return req.session.save(() => {
      res.status(201).json({ success: true, needsProfileSetup: true, email, setupToken });
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
}

// ── PROFILE SETUP STEP 2 ─────────────────────
async function setupProfile(req, res) {
  try {
    const {
  username,
  fullName,
  country,
  bio,
  dateOfBirth,
  profileImage,
  setupToken,
  email: bodyEmail
} = req.body;

const email = req.session.setupEmail || req.session.user?.email || bodyEmail;

    if (!email && !setupToken) {
  return res.status(400).json({ success: false, message: "Please register first." });
}

    if (!username || username.length < 3 || username.length > 24) {
      return res.status(400).json({ success: false, message: "Username must be 3-24 characters." });
    }
const user = setupToken
  ? await User.findOne({ setupToken, profileSetup: false })
  : await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const existingUsername = await User.findOne({
      username,
      _id: { $ne: user._id }
    });

    if (existingUsername) {
      return res.status(409).json({ success: false, message: "Username already taken. Please choose another." });
    }

    user.username = username.trim();
    user.fullName = fullName?.trim() || "";
    user.country = country || "";
    user.bio = bio?.trim() || "";
    user.dateOfBirth = dateOfBirth || null;
    user.profileSetup = true;
   if (req.file) {
  user.profileImage = req.file.path;
} else if (profileImage && profileImage.trim()) {
  user.profileImage = profileImage.trim();
}
user.setupToken = null;

    await user.save();
    req.session.setupEmail = null;
    req.session.user = sessionUserFromDoc(user);

    return req.session.save(() => {
res.status(200).json({
  success: true,
  user: req.session.user,
  token: createAuthToken(user)
});
    });
  } catch (error) {
    console.error("Setup profile error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong." });
  }
}

// ── LOGIN ─────────────────────────────────────
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    if (!user.profileSetup) {
      req.session.setupEmail = email;

      return req.session.save(() => {
        res.status(200).json({ success: true, needsProfileSetup: true, email });
      });
    }

    req.session.user = sessionUserFromDoc(user);

    return req.session.save(() => {
     res.status(200).json({
  success: true,
  user: req.session.user,
  token: createAuthToken(user)
});
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong while logging in." });
  }
}

// ── CURRENT SESSION USER ──────────────────────
function getMe(req, res) {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "Not authenticated." });
  }
  res.json({ success: true, user: req.session.user });
}

// ── PROFILE ───────────────────────────────────
async function showProfile(req, res) {
  try {
    const userId = req.session.user.id;

    const [user, rating, statistic, friend, games] = await Promise.all([
      User.findById(userId).lean(),
      Rating.findOne({ user: userId }).lean(),
      Statistic.findOne({ user: userId }).lean(),
      Friend.findOneAndUpdate(
        { user: userId },
        { $setOnInsert: { user: userId, friends: [], friendRequests: [] } },
        { new: true, upsert: true }
      )
        .populate("friends", "username fullName country profileImage")
        .populate("friendRequests", "username fullName country profileImage")
        .lean(),
      Game.find({
        $or: [{ whiteUser: userId }, { blackUser: userId }]
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .lean()
    ]);

    res.json({
      success: true,
      user: {
        ...user,
        ...rating,
        ...statistic,
        friends: friend.friends,
        friendRequests: friend.friendRequests
      },
      games
    });
  } catch (err) {
    console.error("Show profile error:", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
}

async function showStatus(req, res) {
  try {
    const userId = req.session.user.id;
    const [rating, statistic] = await Promise.all([
      Rating.findOne({ user: userId }).lean(),
      Statistic.findOne({ user: userId }).lean()
    ]);

    if (!rating || !statistic) {
      return res.status(404).json({ success: false, message: "No stats found yet." });
    }

    const totalGames = statistic.gamesPlayed || 0;

    const winRate = totalGames === 0 ? 0 : Math.round((statistic.wins / totalGames) * 100);
    const rapidWinRate = statistic.rapidGames === 0 ? 0 : Math.round((statistic.rapidWins / statistic.rapidGames) * 100);
    const blitzWinRate = statistic.blitzGames === 0 ? 0 : Math.round((statistic.blitzWins / statistic.blitzGames) * 100);
    const bulletWinRate = statistic.bulletGames === 0 ? 0 : Math.round((statistic.bulletWins / statistic.bulletGames) * 100);

    res.json({
      success: true,
      rapidRating: rating.rapidRating,
      blitzRating: rating.blitzRating,
      bulletRating: rating.bulletRating,

      wins: statistic.wins,
      losses: statistic.losses,
      draws: statistic.draws,
      gamesPlayed: totalGames,
      winRate,

      rapidPeak: rating.rapidPeak,
      blitzPeak: rating.blitzPeak,
      bulletPeak: rating.bulletPeak,

      rapidHistory: rating.rapidHistory,
      blitzHistory: rating.blitzHistory,
      bulletHistory: rating.bulletHistory,

      rapidGames: statistic.rapidGames,
      rapidWins: statistic.rapidWins,
      rapidLosses: statistic.rapidLosses,
      rapidDraws: statistic.rapidDraws,
      rapidWinRate,

      blitzGames: statistic.blitzGames,
      blitzWins: statistic.blitzWins,
      blitzLosses: statistic.blitzLosses,
      blitzDraws: statistic.blitzDraws,
      blitzWinRate,

      bulletGames: statistic.bulletGames,
      bulletWins: statistic.bulletWins,
      bulletLosses: statistic.bulletLosses,
      bulletDraws: statistic.bulletDraws,
      bulletWinRate
    });
  } catch (err) {
    console.error("Show status error:", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
}

// ── UPDATE PROFILE ──────────────────────────────
async function updateProfile(req, res) {
  try {
    const { username, fullName, country, bio, dateOfBirth } = req.body;

    const user = await User.findById(req.session.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (!username || username.length < 3 || username.length > 24) {
      return res.status(400).json({ success: false, message: "Username must be 3-24 characters." });
    }

    const existingUser = await User.findOne({
      username,
      _id: { $ne: user._id }
    });

    if (existingUser) {
      return res.status(409).json({ success: false, message: "Username already taken." });
    }

    user.username = username.trim();
    user.fullName = fullName?.trim() || "";
    user.country = country || "";
    user.bio = bio?.trim() || "";
    user.dateOfBirth = dateOfBirth || null;

    if (req.file) {
      user.profileImage = req.file.path;
    }

    await user.save();

    req.session.user.username = user.username;
    req.session.user.profileImage = user.profileImage;

    req.session.save(() => {
      res.json({ success: true, user: req.session.user });
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
}

// ── LOGOUT ────────────────────────────────────
function logoutUser(req, res) {
  req.session.destroy((error) => {
    if (error) return res.status(500).json({ success: false, message: "Could not log out." });
    res.clearCookie("connect.sid");
    return res.json({ success: true });
  });
}

async function showFriends(req, res) {
  try {
    const user = await User.findById(req.session.user.id).lean();

    const friend = await Friend.findOne({ user: req.session.user.id })
      .populate("friends", "username fullName country profileImage")
      .populate("friendRequests", "username fullName country profileImage")
      .lean();

    res.json({
      success: true,
      user: {
        ...user,
        friends: friend?.friends || [],
        friendRequests: friend?.friendRequests || []
      }
    });
  } catch (err) {
    console.error("Show friends error:", err);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
}

module.exports = {
  registerUser,
  setupProfile,
  loginUser,
  getMe,
  showProfile,
  updateProfile,
  logoutUser,
  showFriends,
  showStatus,
};
