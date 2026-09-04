require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cloudinary = require("./src/config/cloudinary");
const cors = require("cors");

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const gameRoutes = require("./src/routes/gameRoutes");
const pageRoutes = require("./src/routes/pageRoutes");
const settingsRoutes = require("./src/routes/settingsRoutes");
const friendRoutes = require("./src/routes/friendRoutes");
const { calculateElo } = require("./src/utils/rating");

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "https://chessmaster-frontend.vercel.app",
  "https://localhost"
];
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  }
});
const PORT = process.env.PORT || 3000;
connectDB();
app.set("trust proxy", 1);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET || "chessmastersecret",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: {
  maxAge: 1000 * 60 * 60 * 24 * 7,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
}
}));

// This backend is now a pure JSON API for the React frontend (chess-master-react).
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ChessMaster API is running. This is a JSON API server — the website itself is served separately by the React app (default: http://localhost:5173).",
  });
});
app.use("/", authRoutes);
app.use("/", gameRoutes);
app.use("/", pageRoutes);
app.use("/", settingsRoutes);
app.use("/", friendRoutes);
app.use((req, res) => { res.status(404).json({ success: false, message: "Not found" }); });
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: err.message || "Something went wrong" });
});

let waitingPlayer = null;
let activeUsersCount = 0; // Starts at 0

// roomId => { sockets: Set, moved: bool, firstMoveTimer: timeout }
const rooms = {};
const socketToRoom = {};
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  activeUsersCount++; // Add 1 to total users
io.emit("activeUsersUpdate", activeUsersCount); // Tell ALL players the new number

  // ── MATCHMAKING ──
  socket.on("findMatch", ({ player, timeControl }) => {
    if (waitingPlayer &&
        waitingPlayer.socketId !== socket.id &&
        waitingPlayer.timeControl.mode === timeControl.mode &&
        waitingPlayer.timeControl.minutes === timeControl.minutes &&
        waitingPlayer.timeControl.increment === timeControl.increment) {

      const roomId = `room-${waitingPlayer.socketId}-${socket.id}`;
      const tc = waitingPlayer.timeControl || timeControl;

      socket.join(roomId);
      io.sockets.sockets.get(waitingPlayer.socketId)?.join(roomId);
const totalSeconds = tc.minutes * 60;

rooms[roomId] = {
    sockets: new Set([waitingPlayer.socketId, socket.id]),
    moved: false,
    firstMoveTimer: null,

    // Players
    whiteUser: waitingPlayer.player,
    blackUser: player,

    whiteTime: totalSeconds,
    blackTime: totalSeconds,
    increment: tc.increment || 0,

    turn: "w",

    lastUpdate: Date.now(),

    timer: null
};

      rooms[roomId].firstMoveTimer = setTimeout(() => {
        if (rooms[roomId] && !rooms[roomId].moved) {
          io.to(roomId).emit("firstMoveTimeout");
          clearRoom(roomId);
        }
      }, 60000);
io.to(waitingPlayer.socketId).emit("matchFound", {
    roomId,
    color: "w",
    opponent: {
        id: player.id,
        username: player.username
    },
    timeControl: tc
});

socket.emit("matchFound", {
    roomId,
    color: "b",
    opponent: {
        id: waitingPlayer.player.id,
        username: waitingPlayer.player.username
    },
    timeControl: tc
});

      waitingPlayer = null;
      // ---- SERVER TIMER ----
rooms[roomId].timer = setInterval(() => {

    const room = rooms[roomId];
    if (!room) return;

    const now = Date.now();
    const elapsed = Math.floor((now - room.lastUpdate) / 1000);

    if (elapsed <= 0) return;

    room.lastUpdate = now;

    if (room.turn === "w") {
        room.whiteTime -= elapsed;
    } else {
        room.blackTime -= elapsed;
    }

    io.to(roomId).emit("timerUpdate", {
        whiteTime: room.whiteTime,
        blackTime: room.blackTime,
        turn: room.turn
    });

    if (room.whiteTime <= 0 || room.blackTime <= 0) {

        clearInterval(room.timer);

        io.to(roomId).emit("timeOut", {
            winner: room.whiteTime <= 0 ? "black" : "white"
        });

    }

}, 1000);

    } else {
      waitingPlayer = { socketId: socket.id, player, timeControl };
      socket.emit("waitingForOpponent");
    }
  });

 socket.on("joinOnlineRoom", ({ roomId }) => {

    socket.join(roomId);

    socketToRoom[socket.id] = roomId;

    if (rooms[roomId]) {

        rooms[roomId].sockets.add(socket.id);

        // NEW
        socket.to(roomId).emit("opponentReconnected");

        socket.emit("timerUpdate", {
            whiteTime: rooms[roomId].whiteTime,
            blackTime: rooms[roomId].blackTime,
            turn: rooms[roomId].turn
        });

    }

});

 socket.on("onlineMove", ({ roomId, move }) => {

    const room = rooms[roomId];
    if (!room) return;

    // First move timer stop
    if (!room.moved) {
        room.moved = true;
        clearTimeout(room.firstMoveTimer);
        room.firstMoveTimer = null;
    }

    const now = Date.now();
    const elapsed = Math.floor((now - room.lastUpdate) / 1000);

    // Current player's time reduce
    if (room.turn === "w") {
        room.whiteTime = Math.max(0, room.whiteTime - elapsed);
        room.whiteTime += room.increment;
    } else {
        room.blackTime = Math.max(0, room.blackTime - elapsed);
        room.blackTime += room.increment;
    }

    // Turn change
    room.turn = room.turn === "w" ? "b" : "w";

    room.lastUpdate = now;

    // Send move
    socket.to(roomId).emit("opponentMove", move);

    // Send updated timer
    io.to(roomId).emit("timerUpdate", {
        whiteTime: room.whiteTime,
        blackTime: room.blackTime,
        turn: room.turn
    });

});

  // ── RESIGN ──
  socket.on("resign", ({ roomId }) => {
    socket.to(roomId).emit("opponentResigned");
    clearRoom(roomId);
  });

  // ── DRAW ──
  socket.on("offerDraw", ({ roomId }) => {
    socket.to(roomId).emit("drawOffered");
  });

  socket.on("acceptDraw", ({ roomId }) => {
    socket.to(roomId).emit("drawAccepted");
    clearRoom(roomId);
  });

  socket.on("declineDraw", ({ roomId }) => {
    socket.to(roomId).emit("drawDeclined");
  });

  // ── ABORT ──
  socket.on("abortGame", ({ roomId }) => {
    socket.to(roomId).emit("gameAborted");
    clearRoom(roomId);
  });

  // ── DISCONNECT ──
  socket.on("disconnect", () => {
    if (waitingPlayer && waitingPlayer.socketId === socket.id) {
      waitingPlayer = null;
    }
    const roomId = socketToRoom[socket.id];
    if (roomId && rooms[roomId]) {
      socket.to(roomId).emit("opponentDisconnected");
      rooms[roomId].sockets.delete(socket.id);
    }

    delete socketToRoom[socket.id];
    activeUsersCount = Math.max(0, activeUsersCount - 1); // Subtract 1 (never go below 0)
io.emit("activeUsersUpdate", activeUsersCount); // Tell ALL players the new number
    console.log("Socket disconnected:", socket.id);
  });
});

function clearRoom(roomId) {
  if (rooms[roomId]) {
    clearInterval(rooms[roomId].timer);
    delete rooms[roomId];
  }
}

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});