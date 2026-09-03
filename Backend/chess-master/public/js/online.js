const socket = io();

const findMatchBtn = document.getElementById("findMatchBtn");
const matchStatus = document.getElementById("matchStatus");

findMatchBtn.addEventListener("click", () => {
    if (!selectedTimeControl) return;

    // Purana data clear karo
    sessionStorage.removeItem("onlineMoves");
    sessionStorage.removeItem("onlineTimeControl");
    sessionStorage.removeItem("onlineRoomId");
    sessionStorage.removeItem("onlineColor");
    sessionStorage.removeItem("onlineOpponent");

    const player = {

    id: window.currentUserId,
        username: window.currentUsername || "Player"
    };

    findMatchBtn.disabled = true;
    findMatchBtn.textContent = "Searching...";
    matchStatus.textContent = "Looking for opponent...";

    socket.emit("findMatch", {
        player,
        timeControl: selectedTimeControl
    });
});
socket.on("waitingForOpponent", () => {
    matchStatus.textContent = `Waiting for ${selectedTimeControl.label} opponent...`;
});
socket.on("matchFound", ({ roomId, color, opponent, timeControl }) => {
    matchStatus.textContent = "Match found. Starting game...";

    sessionStorage.setItem("onlineRoomId", roomId);
    sessionStorage.setItem("onlineColor", color);
    sessionStorage.setItem("onlineOpponent", JSON.stringify(opponent));
    sessionStorage.setItem("onlineTimeControl", JSON.stringify(timeControl));

    window.location.href = "/online/play";
});