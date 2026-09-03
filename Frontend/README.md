# ChessMaster — React + Express (converted)

This package contains two projects that together make up the full app:

- `chess-master/` — the Node/Express + MongoDB backend. It now serves a
  **pure JSON API** (no EJS rendering) plus a Socket.IO server for
  matchmaking and live multiplayer moves.
- `chess-master-react/` — the React (Vite) frontend. It replaces the old
  EJS views entirely and talks to the backend over HTTP (axios) and
  WebSockets (socket.io-client).

## Running it locally

**1. Backend** (from `chess-master/`):
```bash
npm install
npm start        # or: node server.js
```
Runs on `http://localhost:3000`. Configuration lives in `.env`
(Mongo connection string, session secret, Cloudinary keys for profile
picture uploads, and `CLIENT_URL` for CORS — already set to
`http://localhost:5173`).

**2. Frontend** (from `chess-master-react/`):
```bash
npm install
npm run dev
```
Runs on `http://localhost:5173` and talks to the backend at
`http://localhost:3000` (see `src/api/axios.js` and `src/lib/socket.js`
if you need to point it somewhere else, e.g. for deployment).

> I wasn't able to run `npm install` in the sandbox this was built in
> (its network policy blocks most of the npm registry), so the build
> hasn't been executed end-to-end here. Both projects passed static
> syntax checks (`node --check` on every backend file, brace/paren
> balance checks on every frontend file), but please run
> `npm install && npm run dev` / `npm start` yourself as the real test.

## What changed

### Frontend (`chess-master-react`)
- Vendored the **exact `chess.js` v0.10.3 engine** the original EJS app used
  (`src/lib/chessjs.js`) and the real **Stockfish** worker
  (`public/stockfish.js`), so move legality and bot strength match the
  original exactly.
- New `src/components/ChessBoard.jsx` — a reusable, presentational board
  (drag-and-drop + click-to-move, board themes, legal-move dots, check
  highlighting).
- New `src/hooks/useChessGame.js` — local play engine (pass-and-play or vs.
  the Stockfish bot across all 32 bot personalities), ported from the
  original `board.js` + `bot.js`.
- New `src/hooks/useOnlineGame.js` — real-time multiplayer over
  `socket.io-client` (moves, timers, resign, draw offer/accept/decline,
  abort, disconnect/reconnect handling), ported from `online-game.js`.
- `Play.jsx` and `OnlinePlay.jsx` now render a fully playable board instead
  of an empty placeholder `<div>`.
- `Online.jsx` does real matchmaking instead of a `console.log` stub.
- Filled in previously-stub/missing pages: `SetupProfile.jsx` (2-step
  registration), `Profile.jsx`, `Settings.jsx` (theme picker + delete
  account), `Status.jsx` (full rating/stat breakdown), `Replay.jsx`
  (step through a saved game move-by-move).
- `Login.jsx`, `Register.jsx`, `EditProfile.jsx`, `Friends.jsx`,
  `Leaderboard.jsx`, `Home.jsx` now call the real backend instead of
  `console.log`/demo data. `Friends.jsx`'s raw `fetch()` calls (which would
  have hit the Vite dev server, not the API, and dropped the session
  cookie) were switched to the shared `axios` client.
- Added routes for the new pages in `App.jsx` and protected the ones that
  need a session (`play`, `online`, `profile`, `settings`, `friends`,
  replay) with `PrivateRoute`.

### Backend (`chess-master`)
- `authController.js` was fully rewritten from EJS-redirect style to a
  JSON API (register → setup-profile → login → profile/status/edit →
  logout), matching what `AuthContext.jsx` expects.
- `authMiddleware.js` now returns JSON 401/403 instead of redirecting.
- Added `GET /api/games` (recent games list, for the leaderboard) and
  `GET /api/games/:id` (JSON replay data).
- Fixed a real pre-existing bug: `Game.whiteUser`/`blackUser` were
  `required: true`, but local/bot games only ever have one real logged-in
  user — saving a local game would have failed validation. Both fields are
  now optional, `saveGame` fills in whichever side the session user played,
  and Elo rating updates only run when both sides are real, distinct users.
- `pageRoutes.js` was trimmed down to the one JSON endpoint the frontend
  needs (`/api/stats`); the old EJS page-rendering routes are gone since
  React Router now owns all page routing.
- `server.js` no longer sets up the EJS view engine or `connect-flash`;
  it returns JSON for 404s and errors, and CORS is driven by `CLIENT_URL`.

## Known gaps / things to double-check
- I could not execute `npm install` / a real build in this sandbox
  (network policy), so please treat `npm run build` as the real
  smoke test.
- Live chat button in `OnlinePlay.jsx` is a placeholder alert — the
  original app didn't have chat wired up either, so no functionality was
  lost, but it's not implemented.
- `Navbar.jsx` references `/images/default-avatar.png`, which wasn't
  present in the uploaded React project — add one if you want a fallback
  avatar image instead of a broken image icon for users without a
  profile picture.
