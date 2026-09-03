const express = require("express");
const { showSettings, updateTheme,deleteAccount } = require("../controllers/settingsController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/api/settings", isAuthenticated, showSettings);
router.post("/api/settings/theme", isAuthenticated, updateTheme);
router.post("/api/settings/delete-account", isAuthenticated, deleteAccount);

module.exports = router;