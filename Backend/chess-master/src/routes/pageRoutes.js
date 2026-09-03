const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Total users count for the React landing page.
router.get("/api/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ success: true, totalUsers });
  } catch (err) {
    console.error("Error fetching total users:", err);
    res.status(500).json({ success: false, totalUsers: 0 });
  }
});

module.exports = router;
