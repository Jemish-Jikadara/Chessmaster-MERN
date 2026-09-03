const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    rapidRating: { type: Number, default: 1200 },
    blitzRating: { type: Number, default: 1200 },
    bulletRating: { type: Number, default: 1200 },

    rapidPeak: { type: Number, default: 1200 },
    blitzPeak: { type: Number, default: 1200 },
    bulletPeak: { type: Number, default: 1200 },

    rapidHistory: { type: [Number], default: [1200] },
    blitzHistory: { type: [Number], default: [1200] },
    bulletHistory: { type: [Number], default: [1200] }

}, { timestamps: true });

module.exports = mongoose.model("Rating", ratingSchema);