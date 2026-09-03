const Game = require("../models/Game");
const GameMove = require("../models/GameMove");
const User = require("../models/User");
const Rating = require("../models/Rating");
const { updateRatings } = require("../utils/rating");

async function saveGame(req, res) {

    try {
        const {
            gameId,
            playerColor,
            timeMode,
            timeControl,
            increment,
            totalMoves,
            moves
        } = req.body;

        let { whiteUser, blackUser, whitePlayer, blackPlayer, winner } = req.body;

        // Local/bot games only send one real player — attach the logged-in
        // user's id to whichever colour they were playing, when available.
        if (req.session.user && !whiteUser && !blackUser) {
            if (playerColor === "w") whiteUser = req.session.user.id;
            else if (playerColor === "b") blackUser = req.session.user.id;
        }

        // Duplicate save guard
        if (gameId) {
            const existing = await Game.findOne({ gameId });

            if (existing) {
                return res.status(200).json({
                    success: true,
                    game: existing
                });
            }
        }

        // Save game information
        const game = await Game.create({
            gameId: gameId || null,

            whiteUser: whiteUser || undefined,
            blackUser: blackUser || undefined,

            whitePlayer,
            blackPlayer,

            winner,
            timeMode,
            timeControl,
            increment,
            totalMoves
        });

        // Save moves separately in GameMove collection
        await GameMove.create({
            game: game._id,
            moves: Array.isArray(moves) ? moves : []
        });

        // Only update ladder ratings when both sides are real, distinct users
        // (bot / pass-and-play games do not affect ELO).
        if (whiteUser && blackUser && String(whiteUser) !== String(blackUser)) {
            try {
                await updateRatings(whiteUser, blackUser, winner, timeMode);

                if (req.session.user) {
                    const currentRating = await Rating.findOne({
                        user: req.session.user.id
                    });

                    if (currentRating) {
                        req.session.user.rapidRating = currentRating.rapidRating;
                        req.session.user.blitzRating = currentRating.blitzRating;
                        req.session.user.bulletRating = currentRating.bulletRating;
                    }
                }
            } catch (ratingErr) {
                console.error("Error updating ratings:", ratingErr);
            }
        }

        res.status(201).json({
            success: true,
            game
        });

    } catch (error) {
        console.error("Error saving game:", error);

        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function getRecentGames(req, res) {
    try {
        const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
        const games = await Game.find()
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        res.json({ success: true, games });
    } catch (error) {
        console.error("Error loading games:", error);
        res.status(500).json({ success: false, message: "Failed to load games" });
    }
}

async function getReplay(req, res) {
    try {

        // Get game information
        const game = await Game.findById(req.params.id).lean();

        if (!game) {
            return res.status(404).json({ success: false, message: "Game not found" });
        }

        // Get moves belonging to this game
        const gameMoves = await GameMove.findOne({
            game: game._id
        }).lean();

        game.moves = gameMoves ? gameMoves.moves : [];

        res.json({ success: true, game });

    } catch (error) {

        console.error("Error loading replay:", error);

        res.status(404).json({ success: false, message: "Game not found" });
    }
}


module.exports = {
    saveGame,
    getRecentGames,
    getReplay
};