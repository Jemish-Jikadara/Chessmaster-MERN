const socket = io();

const onlineChessBoard = document.getElementById("onlineChessBoard");
const onlineGameOverModal = document.getElementById("onlineGameOverModal");
const onlineGameOverTitle = document.getElementById("onlineGameOverTitle");
const onlineGameOverMessage = document.getElementById("onlineGameOverMessage");
const onlineCloseGameOverBtn = document.getElementById("onlineCloseGameOverBtn");
const onlineSaveGameBtn = document.getElementById("onlineSaveGameBtn");
const onlineMoveHistory = document.getElementById("onlineMoveHistory");

// New UI elements
const ogOpponentName = document.getElementById("ogOpponentName");
const ogOpponentRating = document.getElementById("ogOpponentRating");
const ogOpponentAvatar = document.getElementById("ogOpponentAvatar");
const ogOpponentClock = document.getElementById("ogOpponentClock");
const ogOpponentStrip = document.getElementById("ogOpponentStrip");
const ogMyName = document.getElementById("ogMyName");
const ogMyRating = document.getElementById("ogMyRating");
const ogMyAvatar = document.getElementById("ogMyAvatar");
const ogMyClock = document.getElementById("ogMyClock");
const ogMyStrip = document.getElementById("ogMyStrip");
const ogTurnLabel = document.getElementById("ogTurnLabel");
const ogStatusBadge = document.getElementById("ogStatusBadge");
const ogDisconnectMsg = document.getElementById("ogDisconnectMsg");
const ogResignBtn = document.getElementById("ogResignBtn");
const ogResignOverlay = document.getElementById("ogResignOverlay");
const ogResignConfirmBtn = document.getElementById("ogResignConfirmBtn");
const ogResignCancelBtn = document.getElementById("ogResignCancelBtn");
const ogDrawBtn = document.getElementById("ogDrawBtn");
const ogDrawBanner = document.getElementById("ogDrawBanner");
const ogDrawAcceptBtn = document.getElementById("ogDrawAcceptBtn");
const ogDrawDeclineBtn = document.getElementById("ogDrawDeclineBtn");
const ogAbortBtn = document.getElementById("ogAbortBtn");
const ogChatBtn = document.getElementById("ogChatBtn");

const roomId = sessionStorage.getItem("onlineRoomId");
const playerColor = sessionStorage.getItem("onlineColor");
const opponent = JSON.parse(sessionStorage.getItem("onlineOpponent") || "{}");
const savedTC = JSON.parse(sessionStorage.getItem("onlineTimeControl") || "{}");

const game = new Chess();

let selectedSquare = null;
let legalMoves = [];
let lastMove = null;
let gameOver = false;
let draggedSquare = null;
let disconnectTimer = null;
let drawOfferMoveCount = -99;
let canOfferDraw = false;
let premove = null;
let premoveHighlights = [];

// Timer
let whiteTime = 0;
let blackTime = 0;
let incrementSeconds = 0;
let timerInterval = null;

if (savedTC.minutes) {
    whiteTime = Number(sessionStorage.getItem("onlineWhiteTime")) || savedTC.minutes * 60;
    blackTime = Number(sessionStorage.getItem("onlineBlackTime")) || savedTC.minutes * 60;
    incrementSeconds = savedTC.increment || 0;
}

const pieceImages = {
    wp: "white-pawn", wr: "white-rook", wn: "white-knight",
    wb: "white-bishop", wq: "white-queen", wk: "white-king",
    bp: "black-pawn", br: "black-rook", bn: "black-knight",
    bb: "black-bishop", bq: "black-queen", bk: "black-king"
};

if (!roomId || !playerColor) {
    window.location.href = "/online";
}

socket.emit("joinOnlineRoom", { roomId });

// ── SETUP PLAYER INFO ──
function setupPlayerInfo() {
    const myUsername = window.currentUsername || "You";
    const myRating = window.currentRating || 1200;
    const opponentUsername = opponent.username || opponent.player?.username || "Opponent";
    const opponentRating = opponent.rating || opponent.player?.rating || 1200;

    const tc = savedTC;
    let ratingKey = "rapidRating";
    if (tc.mode === "blitz") ratingKey = "blitzRating";
    if (tc.mode === "bullet") ratingKey = "bulletRating";

    ogMyName.textContent = myUsername;
    ogMyRating.textContent = `${myRating} • ${tc.label || "Rapid"}`;
    ogMyAvatar.textContent = myUsername.charAt(0).toUpperCase();

    ogOpponentName.textContent = opponentUsername;
    ogOpponentRating.textContent = `${opponentRating} • ${tc.label || "Rapid"}`;
    ogOpponentAvatar.textContent = opponentUsername.charAt(0).toUpperCase();

    // Avatar colors based on piece color
    if (playerColor === "w") {
        ogMyAvatar.className = "og-avatar white-av";
        ogOpponentAvatar.className = "og-avatar black-av";
    } else {
        ogMyAvatar.className = "og-avatar black-av";
        ogOpponentAvatar.className = "og-avatar white-av";
    }
}

setupPlayerInfo();

// ── BOARD ──
function createOnlineBoard() {
    onlineChessBoard.innerHTML = "";
onlineChessBoard.style.transform = "";
const board = game.board();
const rows = playerColor === "b" ? [7,6,5,4,3,2,1,0] : [0,1,2,3,4,5,6,7];
const cols = playerColor === "b" ? [7,6,5,4,3,2,1,0] : [0,1,2,3,4,5,6,7];
    rows.forEach((row) => {
        cols.forEach((col) => {
            const squareName = getSquareName(row, col);
            const square = document.createElement("div");
            const isLightSquare = (row + col) % 2 === 0;
            const isSelected = selectedSquare === squareName;
            const legalMove = legalMoves.find((m) => m.to === squareName);
            const piece = board[row][col];
            let displayPiece = piece;

if (premove) {

    // Original square se piece hide
    if (squareName === premove.from) {
        displayPiece = null;
    }

    // Destination par piece dikhao
    if (squareName === premove.to) {
        displayPiece = game.get(premove.from);
    }
}
            const isLastMove = lastMove && (lastMove.from === squareName || lastMove.to === squareName);
            const isPremoveSquare =  premove &&(premove.from === squareName || premove.to === squareName);

            square.className = `aspect-square relative flex items-center justify-center ${isSelected ? "ring-4 ring-yellow-400 ring-inset" : ""} hover:brightness-110 transition`;
            if (isPremoveSquare) {
    square.style.backgroundColor = isLightSquare
        ? "rgba(255, 0, 0, 0.53)"
        : "rgba(180, 0, 0, 0.57)";
} else if (isLastMove) {
    square.style.backgroundColor = isLightSquare
        ? "#fef08a"
        : "#ca8a04";
} else {
    square.style.backgroundColor = isLightSquare
        ? "#f0d9b5"
        : "#b58863";
}
            if (legalMove) {
                const dot = document.createElement("div");
                dot.style.cssText = `position:absolute;pointer-events:none;z-index:20;border-radius:50%;${legalMove.captured ? "width:78%;height:78%;border:5px solid rgba(250,204,21,0.85)" : "width:16px;height:16px;background:rgba(250,204,21,0.9)"}`;
                square.appendChild(dot);
            }
            if (displayPiece) {
                const img = document.createElement("img");
                img.src = `/images/pieces/${pieceImages[displayPiece.color + displayPiece.type]}.png`;
                img.alt = displayPiece.type;
                img.className = "relative z-30 w-[78%] h-[78%] object-contain cursor-pointer select-none";
                img.draggable = !gameOver;
                img.style.touchAction = "none";
                img.addEventListener("dragstart", (event) => {
                handleOnlineDragStart(event, squareName, piece);
                });

                img.addEventListener("dragend", () => {
                draggedSquare = null;
                selectedSquare = null;
                legalMoves = [];
                createOnlineBoard();    
                });
                square.appendChild(img);
            }

            square.addEventListener("click", () => handleOnlineSquareClick(squareName));
            square.addEventListener("dragover", (event) => {event.preventDefault();});
            square.addEventListener("drop", (event) => {handleOnlineDrop(event, squareName);});
            onlineChessBoard.appendChild(square);
        });
    });
}

function handleOnlineSquareClick(squareName) {
    if (gameOver || game.game_over()) return;
    // ---------------- PREMOVE ----------------
if (game.turn() !== playerColor) {

    const piece = game.get(squareName);

    // First click
    if (!selectedSquare) {

        if (!piece || piece.color !== playerColor) return;

        selectedSquare = squareName;
        createOnlineBoard();
        return;
    }

    // Don't allow same square
    if (selectedSquare === squareName) {
        selectedSquare = null;
        premove = null;
        createOnlineBoard();
        return;
    }

    // Save premove
    premove = {
        from: selectedSquare,
        to: squareName
    };

    selectedSquare = null;

    console.log("PREMOVE:", premove);

    createOnlineBoard();
    return;
}


    const piece = game.get(squareName);

    if (!selectedSquare) {
        if (!piece || piece.color !== playerColor) return;
        selectedSquare = squareName;
        legalMoves = game.moves({ square: squareName, verbose: true });
        createOnlineBoard();
        return;
    }

    const move = game.move({ from: selectedSquare, to: squareName, promotion: "q" });

    if (move) {
        afterOnlineMove(move);
        socket.emit("onlineMove", { roomId, move: { from: move.from, to: move.to, promotion: "q" } });
        return;
    }

    if (piece && piece.color === playerColor) {
        selectedSquare = squareName;
        legalMoves = game.moves({ square: squareName, verbose: true });
        createOnlineBoard();
        return;
    }

    selectedSquare = null;
    legalMoves = [];
    createOnlineBoard();
}
function handleOnlineDragStart(event, squareName, piece) {

    if (gameOver) {
        event.preventDefault();
        return;
    }

    if (game.turn() !== playerColor) {
        event.preventDefault();
        return;
    }

    if (!piece || piece.color !== playerColor) {
        event.preventDefault();
        return;
    }

    draggedSquare = squareName;
    selectedSquare = squareName;

    legalMoves = game.moves({
        square: squareName,
        verbose: true
    });

    event.dataTransfer.setData("text/plain", squareName);
    event.dataTransfer.effectAllowed = "move";

    setTimeout(() => {
        createOnlineBoard();
    }, 0);
}

function handleOnlineDrop(event, targetSquare) {

    event.preventDefault();

    if (gameOver || !draggedSquare) return;

    const move = game.move({
        from: draggedSquare,
        to: targetSquare,
        promotion: "q"
    });

    if (move) {

        draggedSquare = null;

        afterOnlineMove(move);

        socket.emit("onlineMove", {
            roomId,
            move: {
                from: move.from,
                to: move.to,
                promotion: "q"
            }
        });

        return;
    }

    draggedSquare = null;
    selectedSquare = null;
    legalMoves = [];

    createOnlineBoard();
}
// ── AFTER MOVE ──
function afterOnlineMove(move) {
    lastMove = { from: move.from, to: move.to };
    selectedSquare = null;
    legalMoves = [];
/*
    if (incrementSeconds > 0) {
        if (move.color === "w") whiteTime += incrementSeconds;
        else blackTime += incrementSeconds;
    }
*/
    const savedMoves = JSON.parse(sessionStorage.getItem("onlineMoves") || "[]");
    savedMoves.push({ from: move.from, to: move.to, promotion: move.promotion || "q" });
    sessionStorage.setItem("onlineMoves", JSON.stringify(savedMoves));

    // Abort button hide after first move
    const totalMoves = savedMoves.length;
    if (totalMoves >= 2 && ogAbortBtn) {
        ogAbortBtn.style.display = "none";
    }

    // Draw offer enable after 30 moves (15 each)
    if (totalMoves >= 30) {
        canOfferDraw = true;
        const movesSinceDecline = totalMoves - drawOfferMoveCount;
        if (movesSinceDecline >= 2) {
            ogDrawBtn.disabled = false;
        }
    }

    updateOnlineInfo();
    updateClockStrips();
    checkOnlineGameOver();
    createOnlineBoard();

    /*
    if (!timerInterval && totalMoves >= 1) {
        startOnlineTimer();
    }
        */
}

// ── SOCKET EVENTS ──
socket.on("opponentMove", (moveData) => {
    const move = game.move(moveData);
    if (!move) return;
    afterOnlineMove(move);
    // -------- Execute Premove --------
if (premove) {

    const premoveResult = game.move({
        from: premove.from,
        to: premove.to,
        promotion: "q"
    });
    if (premoveResult) {

    premove = null;   // <-- pehle clear karo

    afterOnlineMove(premoveResult);

    socket.emit("onlineMove", {
        roomId,
        move: {
            from: premoveResult.from,
            to: premoveResult.to,
            promotion: "q"
        }
    });

    console.log("Premove executed");

} else {

    premove = null;   

    createOnlineBoard(); 

    console.log("Premove cancelled");
}
}
});
//new code for timer update from server
socket.on("timerUpdate", (data) => {

    whiteTime = Math.max(0, data.whiteTime);
    blackTime = Math.max(0, data.blackTime);

    updateClockStrips();

});
socket.on("timeOut", ({ winner }) => {

    finishOnlineGame(
        "Time Out",
        `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins on time!`,
        "timeout"
    );

});

socket.on("opponentDisconnected", () => {
    if (gameOver) return;
    ogDisconnectMsg.style.display = "block";
    let sec = 30;
    ogDisconnectMsg.textContent = `Disconnected — auto-win in ${sec}s`;
    disconnectTimer = setInterval(() => {
        sec--;
        ogDisconnectMsg.textContent = `Disconnected — auto-win in ${sec}s`;
        if (sec <= 0) {
            clearInterval(disconnectTimer);
            finishOnlineGame(
                            "Opponent Disconnected",
                            "Your opponent left. You win!",
                        "disconnect"
);
        }
    }, 1000);
});

socket.on("opponentReconnected", () => {
    clearInterval(disconnectTimer);
    ogDisconnectMsg.style.display = "none";
});

socket.on("drawOffered", () => {
    ogDrawBanner.style.display = "block";
});

socket.on("drawDeclined", () => {
    drawOfferMoveCount = game.history().length;
    ogDrawBtn.disabled = true;
});

socket.on("drawAccepted", () => {
    finishOnlineGame("Draw", "Both players agreed to a draw.", "draw");
});

socket.on("opponentResigned", () => {
    finishOnlineGame("Opponent Resigned", "Your opponent resigned. You win!","opponent_resigned");
});

socket.on("gameAborted", () => {
    finishOnlineGame("Game Aborted", "The game was aborted.");
});

socket.on("firstMoveTimeout", () => {
    finishOnlineGame("Game Aborted", "No moves were made in time. Game aborted.");
});

// ── RESIGN ──
ogResignBtn.addEventListener("click", () => {
    ogResignOverlay.classList.add("show");
});

ogResignCancelBtn.addEventListener("click", () => {
    ogResignOverlay.classList.remove("show");
});

ogResignConfirmBtn.addEventListener("click", () => {
    ogResignOverlay.classList.remove("show");
    socket.emit("resign", { roomId });
    finishOnlineGame("You Resigned", "You resigned the game.", "resign");
});

// ── DRAW ──
ogDrawBtn.addEventListener("click", () => {
    if (ogDrawBtn.disabled) return;
    ogDrawBtn.disabled = true;
    socket.emit("offerDraw", { roomId });
});

ogDrawAcceptBtn.addEventListener("click", () => {
    ogDrawBanner.style.display = "none";
    socket.emit("acceptDraw", { roomId });
    finishOnlineGame("Draw", "Both players agreed to a draw.");
});

ogDrawDeclineBtn.addEventListener("click", () => {
    ogDrawBanner.style.display = "none";
    socket.emit("declineDraw", { roomId });
});

// ── ABORT ──
ogAbortBtn.addEventListener("click", () => {
    socket.emit("abortGame", { roomId });
    finishOnlineGame("Game Aborted", "The game was aborted.");
});

// ── CHAT (placeholder) ──
ogChatBtn.addEventListener("click", () => {
    alert("Live chat coming soon!");
});

// ── GAME OVER ──
function checkOnlineGameOver() {
    if (game.in_checkmate()) {
        const winner = game.turn() === "w" ? "Black" : "White";
        finishOnlineGame("Checkmate", `${winner} wins by checkmate.`, "checkmate");
        return;
    }
    if (game.in_draw()) {
        finishOnlineGame("Draw", "The game ended in a draw.");
    }
}
let onlineGameSaved = false;

async function saveOnlineGame(reason) {
    if (playerColor !== "w") {
    return;
}

    if (onlineGameSaved) return;
    onlineGameSaved = true;

    const history = game.history();

    if (history.length === 0) return;

    const tc = JSON.parse(sessionStorage.getItem("onlineTimeControl") || "{}");

    const myName = window.currentUsername || "Player";
    const opponentName =
        opponent.username ||
        opponent.player?.username ||
        "Opponent";

    let whitePlayer, blackPlayer;

    if (playerColor === "w") {
        whitePlayer = myName;
        blackPlayer = opponentName;
    } else {
        whitePlayer = opponentName;
        blackPlayer = myName;
    }

    let winner = "draw";

    switch (reason) {

        case "checkmate":
        case "timeout":

            if (game.turn() === "w") {
                winner = "black";
            } else {
                winner = "white";
            }

            break;

        case "resign":

            winner = playerColor === "w" ? "black" : "white";

            break;

        case "opponent_resigned":

            winner = playerColor === "w" ? "white" : "black";

            break;

        case "draw":
            winner = "draw";
            break;

        case "disconnect":

            winner = playerColor === "w" ? "white" : "black";

            break;
    }

    try {

        await fetch("/api/games", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                whiteUser:
                    playerColor === "w"? window.currentUserId: opponent.id,

                blackUser:
                    playerColor === "b"? window.currentUserId: opponent.id,

                gameId: roomId,

                whitePlayer,

                blackPlayer,

                winner,

                playerColor,

                timeMode: tc.mode,

                timeControl: `${tc.minutes}+${tc.increment}`,

                increment: tc.increment,

                totalMoves: history.length,

                moves: history
            })

        });

    } catch (err) {

        console.error(err);

    }

}function finishOnlineGame(title, message, reason = "draw") {
    gameOver = true;
    selectedSquare = null;
    legalMoves = [];

    clearInterval(timerInterval);
    clearInterval(disconnectTimer);

    // SAVE FIRST
    saveOnlineGame(reason);

    // THEN CLEAR SESSION
    sessionStorage.removeItem("onlineMoves");
    sessionStorage.removeItem("onlineWhiteTime");
    sessionStorage.removeItem("onlineBlackTime");

    onlineGameOverModal.classList.add("show");

    if (onlineGameOverTitle)
        onlineGameOverTitle.textContent = title;

    if (onlineGameOverMessage)
        onlineGameOverMessage.textContent = message;
}
// ── INFO UPDATE ──
function updateOnlineInfo() {
    const turn = game.turn();
    ogTurnLabel.textContent = turn === "w" ? "White to move" : "Black to move";

    ogStatusBadge.className = "og-status-badge";
    if (game.in_checkmate()) {
        ogStatusBadge.textContent = "Checkmate";
        ogStatusBadge.classList.add("over");
    } else if (game.in_check()) {
        ogStatusBadge.textContent = "Check!";
        ogStatusBadge.classList.add("check");
    } else if (game.in_draw()) {
        ogStatusBadge.textContent = "Draw";
        ogStatusBadge.classList.add("over");
    } else {
        ogStatusBadge.textContent = "Active";
        ogStatusBadge.classList.add("active");
    }

    const history = game.history({ verbose: true });
    if (history.length === 0) {
        onlineMoveHistory.innerHTML = `<p style="color:#6b7280;font-size:13px;">No moves yet.</p>`;
        return;
    }

    onlineMoveHistory.innerHTML = history.map((m, i) => `
        <div class="og-move-item">
            <strong>${i + 1}.</strong> ${m.san}
            <span>(${m.from}→${m.to})</span>
        </div>
    `).join("");

    onlineMoveHistory.scrollTop = onlineMoveHistory.scrollHeight;
}

// ── CLOCKS ──
function formatTime(s) {
    s = Math.max(0, s);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function updateClockStrips() {
    const myIsWhite = playerColor === "w";
    const myTime = myIsWhite ? whiteTime : blackTime;
    const oppTime = myIsWhite ? blackTime : whiteTime;

    ogMyClock.textContent = formatTime(myTime);
    ogOpponentClock.textContent = formatTime(oppTime);

    const myTurn = game.turn() === playerColor;
    ogMyStrip.classList.toggle("active-turn", myTurn && !gameOver);
    ogOpponentStrip.classList.toggle("active-turn", !myTurn && !gameOver);
    ogMyStrip.classList.toggle("low-time", myTime <= 10 && myTime > 0);
    ogOpponentStrip.classList.toggle("low-time", oppTime <= 10 && oppTime > 0);
}

/*function startOnlineTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (gameOver) { clearInterval(timerInterval); return; }

        if (game.turn() === "w") whiteTime--;
        else blackTime--;

        sessionStorage.setItem("onlineWhiteTime", whiteTime);
        sessionStorage.setItem("onlineBlackTime", blackTime);

        if (whiteTime <= 0 || blackTime <= 0) {
            whiteTime = Math.max(0, whiteTime);
            blackTime = Math.max(0, blackTime);
            clearInterval(timerInterval);
            finishOnlineGame("Time Out", whiteTime <= 0 ? "Black wins on time!" : "White wins on time!");
        }

        updateClockStrips();
    }, 1000);
}
    */

// ── HELPERS ──
function getSquareName(row, col) {
    return `${"abcdefgh"[col]}${8 - row}`;
}

// ── RESTORE ON REFRESH ──
const savedMoves = JSON.parse(sessionStorage.getItem("onlineMoves") || "[]");
if (savedMoves.length > 0) {
    savedMoves.forEach(m => game.move(m));
    lastMove = { from: savedMoves[savedMoves.length - 1].from, to: savedMoves[savedMoves.length - 1].to };
    if (savedMoves.length >= 2) ogAbortBtn.style.display = "none";
    if (savedMoves.length >= 30) {
        canOfferDraw = true;
        ogDrawBtn.disabled = false;
    }
    //if (savedMoves.length >= 1) startOnlineTimer();
}

// ── INIT ──
createOnlineBoard();
updateOnlineInfo();
updateClockStrips();
