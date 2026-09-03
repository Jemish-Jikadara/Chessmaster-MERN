const mongoose = require("mongoose");

const gameMoveSchema = new mongoose.Schema({

    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: true,
        unique: true
    },

    moves: {
        type: [String],
        default: []
    }

}, { timestamps: true });

module.exports = mongoose.model("GameMove", gameMoveSchema);