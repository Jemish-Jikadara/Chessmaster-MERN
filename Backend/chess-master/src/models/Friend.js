const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],

    friendRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]

}, { timestamps: true });

module.exports = mongoose.model("Friend", friendSchema);