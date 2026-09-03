const User = require("../models/User");
const Rating = require("../models/Rating");
const Friend = require("../models/Friend");
const Statistic = require("../models/Statistic");
const Game = require("../models/Game");
const GameMove = require("../models/GameMove");

async function showSettings(req, res) {
  try {
    const user = await User.findById(req.session.user.id).lean();
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
}

async function updateTheme(req, res) {
  try {
    const { boardTheme } = req.body;
    const allowed = ["classic", "midnight", "forest", "ocean", "ruby", "walnut"];

    if (!allowed.includes(boardTheme)) {
      return res.status(400).json({ success: false, message: "Invalid theme." });
    }

    await User.findByIdAndUpdate(req.session.user.id, { boardTheme });
    req.session.user.boardTheme = boardTheme;

    res.json({ success: true, boardTheme });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteAccount(req, res) {
  try {
    const userId = req.session.user.id;

    // Pehle saari games find karo jisme user involved hai
    const userGames = await Game.find({
      $or: [{ whiteUser: userId }, { blackUser: userId }]
    });

    const gameIds = userGames.map(g => g._id);

    // Saara data delete karo
    await GameMove.deleteMany({ game: { $in: gameIds } });
    await Game.deleteMany({ $or: [{ whiteUser: userId }, { blackUser: userId }] });
    await Rating.deleteOne({ user: userId });
    await Statistic.deleteOne({ user: userId });
    await Friend.deleteOne({ user: userId });
    
    // Dusre users ke friend lists se bhi hatao
    await Friend.updateMany(
      { $or: [{ friends: userId }, { friendRequests: userId }] },
      { $pull: { friends: userId, friendRequests: userId } }
    );

    await User.findByIdAndDelete(userId);

    // Session destroy karo
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Logout failed." });
      }
      res.clearCookie("connect.sid");
      return res.json({ success: true, message: "Account deleted successfully." });
    });

  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ success: false, message: "Something went wrong." });
  }
}

module.exports = { showSettings, updateTheme, deleteAccount };