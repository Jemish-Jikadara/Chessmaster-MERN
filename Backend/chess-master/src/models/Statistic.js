const mongoose = require("mongoose");

const statisticSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },

    rapidGames: { type: Number, default: 0 },
    rapidWins: { type: Number, default: 0 },
    rapidLosses: { type: Number, default: 0 },
    rapidDraws: { type: Number, default: 0 },

    blitzGames: { type: Number, default: 0 },
    blitzWins: { type: Number, default: 0 },
    blitzLosses: { type: Number, default: 0 },
    blitzDraws: { type: Number, default: 0 },

    bulletGames: { type: Number, default: 0 },
    bulletWins: { type: Number, default: 0 },
    bulletLosses: { type: Number, default: 0 },
    bulletDraws: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model("Statistic", statisticSchema);