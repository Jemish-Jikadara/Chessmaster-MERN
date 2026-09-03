const User = require("../models/User");
const Rating = require("../models/Rating");
const Statistic = require("../models/Statistic");


function calculateElo(playerRating, opponentRating, result) {
const K = 20;
;

    const expected =
        1 /(1 +Math.pow(10,(opponentRating - playerRating)/400));

let score = 0;
    if (result === "win") score = 1;
    else if (result === "draw") score = 0.5;
    else score = 0;
    const newRating = Math.round(
        playerRating + K * (score - expected)
    );
    return newRating;
}
async function updateRatings(
    whiteUserId,
    blackUserId,
    winner,
    mode
) {

    const white = await User.findById(whiteUserId);
    const black = await User.findById(blackUserId);
    const whiteRating = await Rating.findOne({ user: whiteUserId });
const blackRating = await Rating.findOne({ user: blackUserId });

const whiteStat = await Statistic.findOne({ user: whiteUserId });
const blackStat = await Statistic.findOne({ user: blackUserId });

    if (!whiteRating ||
    !blackRating ||
    !whiteStat ||
    !blackStat) {
        console.log("Players not found");
        return;
    }

    const ratingField = `${mode}Rating`;

    const whiteOld = whiteRating[ratingField];
    const blackOld = blackRating[ratingField];
    const gamesField = `${mode}Games`;
    const winsField = `${mode}Wins`;
    const lossesField = `${mode}Losses`;
    const drawsField = `${mode}Draws`;

    if (winner === "white") {

        whiteRating[ratingField] =
            calculateElo(whiteOld, blackOld, "win");

        blackRating[ratingField] =
            calculateElo(blackOld, whiteOld, "lose");

        whiteStat.wins++;
        blackStat.losses++;
        whiteStat.gamesPlayed++;
        blackStat.gamesPlayed++;

        whiteStat[gamesField]++;
blackStat[gamesField]++;

whiteStat[winsField]++;
blackStat[lossesField]++;

    }

    else if (winner === "black") {

        blackRating[ratingField] =
            calculateElo(blackOld, whiteOld, "win");

        whiteRating[ratingField] =
            calculateElo(whiteOld, blackOld, "lose");

        blackStat.wins++;
        whiteStat.losses++;
        whiteStat.gamesPlayed++;
        blackStat.gamesPlayed++;

        whiteStat[gamesField]++;
        blackStat[gamesField]++;

        blackStat[winsField]++;
        whiteStat[lossesField]++;

    }

    else {

        whiteRating[ratingField] =
            calculateElo(whiteOld, blackOld, "draw");

        blackRating[ratingField] =
            calculateElo(blackOld, whiteOld, "draw");

        whiteStat.draws++;
        blackStat.draws++;
        whiteStat.gamesPlayed++;
        blackStat.gamesPlayed++;

        whiteStat[gamesField]++;
        blackStat[gamesField]++;

        whiteStat[drawsField]++;
        blackStat[drawsField]++;

    }
    // Update Peak Rating

if (whiteRating[ratingField] > whiteRating[`${mode}Peak`]) {
    whiteRating[`${mode}Peak`] = whiteRating[ratingField];
}

if (blackRating[ratingField] > blackRating[`${mode}Peak`]) {
    blackRating[`${mode}Peak`] = blackRating[ratingField];
}
if (!whiteRating[`${mode}History`]) whiteRating[`${mode}History`] = [];
if (!blackRating[`${mode}History`]) blackRating[`${mode}History`] = [];

whiteRating[`${mode}History`].push(whiteRating[ratingField]);
blackRating[`${mode}History`].push(blackRating[ratingField]);
await whiteRating.save();
await blackRating.save();

await whiteStat.save();
await blackStat.save();
const whiteUser = await User.findById(whiteUserId);
const blackUser = await User.findById(blackUserId);

console.log(
    whiteUser.username,
    whiteOld,
    "->",
    whiteRating[ratingField]
);

console.log(
    blackUser.username,
    blackOld,
    "->",
    blackRating[ratingField]
);
}
module.exports = {
    calculateElo,
    updateRatings
};
