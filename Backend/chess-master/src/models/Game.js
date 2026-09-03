const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    gameId: {
      type: String,
      unique: true,
      sparse: true
    },
    whiteUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    blackUser:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:false
},
    whitePlayer: {
      type: String,
      required: true,
      trim: true
    },
    blackPlayer: {
      type: String,
      required: true,
      trim: true
    },
    winner: {
      type: String,
      enum: ["white", "black", "draw"],
      required: true
    },
    timeMode: {
      type: String,
      enum: ["rapid", "blitz", "bullet"],
      required: true
    },
    timeControl: {
      type: String,
      required: true
    },
    increment: {
      type: Number,
      default: 0
    },
    totalMoves: {
      type: Number,
      required: true
    },
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Game", gameSchema);