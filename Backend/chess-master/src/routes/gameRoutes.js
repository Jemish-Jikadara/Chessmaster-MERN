const express = require("express");
const { saveGame, getRecentGames, getReplay } = require("../controllers/gameController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/api/games", isAuthenticated, saveGame);
router.get("/api/games", getRecentGames);
router.get("/api/games/:id", isAuthenticated, getReplay);

module.exports = router;
