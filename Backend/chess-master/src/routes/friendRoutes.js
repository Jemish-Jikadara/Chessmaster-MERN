const express = require("express");
const {
  searchUsers,
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
  getFriendRequests
} = require("../controllers/friendController");
const { isAuthenticated } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/api/users/search", isAuthenticated, searchUsers);
router.post("/api/friends/request", isAuthenticated, sendFriendRequest);
router.post("/api/friends/accept", isAuthenticated, acceptFriendRequest);
router.post("/api/friends/decline", isAuthenticated, declineFriendRequest);
router.post("/api/friends/remove", isAuthenticated, removeFriend);
router.get("/api/friends/requests", isAuthenticated, getFriendRequests);

module.exports = router;
