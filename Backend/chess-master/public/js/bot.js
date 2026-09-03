const BOTS = Array.from({ length: 32 }, (_, i) => {
  const rating    = Math.round(100 + (i * (3200 - 100)) / 31);
  const skill     = Math.round((i / 31) * 20);
  const thinkTime = 200 + Math.round((i / 31) * 1800);
  const levels    = ["beginner","beginner","beginner","beginner","novice","novice","novice","novice","intermediate","intermediate","intermediate","intermediate","club","club","club","club","advanced","advanced","advanced","advanced","expert","expert","expert","expert","master","master","master","master","master","gm","gm","gm"];
  const titles    = ["Beginner","Beginner","Beginner","Beginner","Novice","Novice","Novice","Novice","Intermediate","Intermediate","Intermediate","Intermediate","Club Player","Club Player","Club Player","Club Player","Advanced","Advanced","Advanced","Advanced","Expert","Expert","Expert","Expert","Candidate Master","Candidate Master","FIDE Master","FIDE Master","Int'l Master","Grandmaster","Grandmaster","Super GM"];
  return { id: i + 1, name: `Bot ${i + 1}`, rating, skill, thinkTime, title: titles[i], level: levels[i] };
});

let isBotMode   = false;
let selectedBot = null;
let stockfish   = null;

window.isBotMode   = () => isBotMode;
window.selectedBot = () => selectedBot;
window.PLAYER_COLOR = "w";

function buildBotGrid() {
  const botGrid = document.getElementById("botGrid");
  if (!botGrid) return;

  botGrid.innerHTML = BOTS.map(bot => `
    <div class="bot-card" data-bot-id="${bot.id}" data-level="${bot.level}">
      <div class="bot-icon">🤖</div>
      <div class="bot-name">${bot.name}</div>
      <div class="bot-rating">${bot.rating}</div>
      <div class="bot-title">${bot.title}</div>
    </div>
  `).join("");

  botGrid.querySelectorAll(".bot-card").forEach(card => {
    card.addEventListener("click", () => {
      botGrid.querySelectorAll(".bot-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      selectedBot = BOTS[Number(card.dataset.botId) - 1];
      setTimeout(() => {
        document.getElementById("botSelectScreen").style.display = "none";
        timeControlScreen.style.display = "block";
      }, 300);
    });
  });
}

function initStockfish() {
  if (stockfish) return;
  stockfish = new Worker("/js/stockfish.js");
  stockfish.addEventListener("message", (e) => {
    const msg = e.data;
    if (typeof msg !== "string") return;
    if (msg.startsWith("bestmove")) {
      const moveStr = msg.split(" ")[1];
      if (!moveStr || moveStr === "(none)") return;
      applyBotMove(moveStr);
    }
  });
  stockfish.postMessage("uci");
  stockfish.postMessage("isready");
}

function askBotMove() {
  if (!stockfish || !selectedBot || gameOver) return;
  const el = document.getElementById("botThinking");
  if (el) el.style.display = "block";
  stockfish.postMessage(`setoption name Skill Level value ${selectedBot.skill}`);
  stockfish.postMessage(`position fen ${game.fen()}`);
  stockfish.postMessage(`go movetime ${selectedBot.thinkTime}`);
}

function applyBotMove(uciMove) {
  const el = document.getElementById("botThinking");
  if (el) el.style.display = "none";
  if (gameOver || !gameStarted) return;
  const from      = uciMove.slice(0, 2);
  const to        = uciMove.slice(2, 4);
  const promotion = uciMove.length > 4 ? uciMove[4] : "q";
  const move = game.move({ from, to, promotion });
  if (move) afterSuccessfulMove(move);
}

window._botHook = function() {
  if (!isBotMode || !selectedBot || !gameStarted || gameOver) return;
  const botColor = window.PLAYER_COLOR === "b" ? "w" : "b";
  if (game.turn() === botColor) {
    setTimeout(askBotMove, 100);
  }
};