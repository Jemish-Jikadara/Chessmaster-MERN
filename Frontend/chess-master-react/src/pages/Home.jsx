import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSocket } from '../lib/socket';
import api from '../api/axios';

const pageStyles = `
.h-page{
  --h-bg:#0f1411;
  --h-panel:#1b241d;
  --h-panel-2:#222d24;
  --h-line:rgba(255,255,255,0.09);
  --h-text:#f5f7f1;
  --h-muted:#aeb7aa;
  --h-soft:#d7ded0;
  --h-green:#81b64c;
  --h-green-2:#95c95e;
  --h-dark-green:#5d8b32;
  --h-gold:#f0c15b;
  --h-orange:#e58b42;
  background:
    linear-gradient(180deg,rgba(129,182,76,0.08),transparent 360px),
    radial-gradient(circle at 15% 8%,rgba(129,182,76,0.18),transparent 34%),
    radial-gradient(circle at 85% 12%,rgba(240,193,91,0.1),transparent 32%),
    var(--h-bg);
  color:var(--h-text);
  overflow:hidden;
}

.h-page *{ box-sizing:border-box; }

.h-hero{
  position:relative;
  padding:88px 0 72px;
}

.h-hero::before{
  content:'';
  position:absolute;
  inset:0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg,rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size:58px 58px;
  mask-image:linear-gradient(to bottom,#000,transparent 78%);
  pointer-events:none;
}

.h-grid{
  display:grid;
  grid-template-columns:minmax(0,1.02fr) minmax(320px,0.98fr);
  gap:56px;
  align-items:center;
  position:relative;
  z-index:1;
}

.h-copy{
  max-width:650px;
}

.stats-container{
  display:flex;
  align-items:center;
  gap:10px;
  flex-wrap:wrap;
  margin-bottom:24px;
}

.stat-badge{
  display:inline-flex;
  align-items:center;
  gap:9px;
  min-height:36px;
  color:#eef6e9;
  background:rgba(255,255,255,0.07);
  border:1px solid rgba(255,255,255,0.11);
  padding:7px 13px;
  border-radius:999px;
  font-size:13px;
  font-weight:700;
  box-shadow:0 12px 28px rgba(0,0,0,0.18);
  backdrop-filter:blur(12px);
}

.stat-badge strong{
  color:#ffffff;
  font-weight:800;
}

.live-dot-wrapper{
  position:relative;
  display:flex;
  height:10px;
  width:10px;
}

.live-dot-ping{
  position:absolute;
  display:inline-flex;
  height:100%;
  width:100%;
  border-radius:50%;
  background-color:#89e263;
  opacity:.72;
  animation:ping 1.5s cubic-bezier(0,0,.2,1) infinite;
}

.live-dot-main{
  position:relative;
  display:inline-flex;
  height:10px;
  width:10px;
  border-radius:50%;
  background-color:#89e263;
  box-shadow:0 0 0 4px rgba(137,226,99,0.13);
}

@keyframes ping{
  75%,100%{ transform:scale(2.3); opacity:0; }
}

.cm2-eyebrow{
  display:inline-flex;
  align-items:center;
  gap:9px;
  color:var(--h-green-2);
  font-size:12px;
  line-height:1;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.14em;
  margin-bottom:18px;
}

.cm2-eyebrow .sq{
  width:9px;
  height:9px;
  border-radius:2px;
  background:var(--h-green);
  box-shadow:0 0 0 5px rgba(129,182,76,.12);
}

.cm2-h1{
  margin:0;
  color:var(--h-text);
  font-size:clamp(2.7rem,6.2vw,5.7rem);
  line-height:.94;
  letter-spacing:0;
  font-weight:900;
}

.cm2-accent{
  color:var(--h-green-2);
}

.cm2-accent-sage{
  color:#e5ecd9;
}

.cm2-h2{
  margin:0;
  color:var(--h-text);
  font-size:clamp(2rem,4vw,3.4rem);
  line-height:1.02;
  letter-spacing:0;
  font-weight:900;
}

.cm2-h3{
  margin:0 0 10px;
  color:var(--h-text);
  font-size:20px;
  line-height:1.2;
  font-weight:850;
}

.cm2-sub{
  max-width:620px;
  margin:22px 0 0;
  color:var(--h-muted);
  font-size:17px;
  line-height:1.72;
}

.h-btns{
  display:flex;
  gap:12px;
  flex-wrap:wrap;
  margin-top:34px;
}

.cm2-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  min-height:48px;
  padding:0 20px;
  border-radius:8px;
  font-size:15px;
  font-weight:850;
  text-decoration:none;
  border:1px solid transparent;
  transition:transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease;
}

.cm2-btn:hover{
  transform:translateY(-2px);
}

.cm2-btn-primary{
  color:#10180e;
  background:linear-gradient(180deg,#9bd761,#7fb64a);
  box-shadow:0 16px 30px rgba(129,182,76,.25), inset 0 1px rgba(255,255,255,.45);
}

.cm2-btn-primary:hover{
  background:linear-gradient(180deg,#a8e372,#82bd4a);
  box-shadow:0 20px 38px rgba(129,182,76,.32), inset 0 1px rgba(255,255,255,.55);
}

.cm2-btn-secondary{
  color:#f4f7ef;
  background:rgba(255,255,255,.075);
  border-color:rgba(255,255,255,.13);
}

.cm2-btn-secondary:hover{
  background:rgba(255,255,255,.11);
  border-color:rgba(255,255,255,.2);
}

.h-stats{
  display:grid;
  grid-template-columns:repeat(4,minmax(88px,1fr));
  gap:10px;
  max-width:560px;
  margin-top:42px;
}

.h-stats div{
  padding:16px 14px;
  background:rgba(255,255,255,.055);
  border:1px solid rgba(255,255,255,.09);
  border-radius:10px;
}

.h-stats strong{
  display:block;
  color:#ffffff;
  font-size:26px;
  line-height:1;
  font-weight:900;
  margin-bottom:7px;
}

.h-stats span{
  display:block;
  color:var(--h-muted);
  font-size:11px;
  line-height:1.25;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.08em;
}

.board-frame{
  position:relative;
  padding:18px;
  border-radius:16px;
  background:
    linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.03)),
    #1a211b;
  border:1px solid rgba(255,255,255,.12);
  box-shadow:0 32px 80px rgba(0,0,0,.46);
}

.board-frame::before{
  content:'';
  position:absolute;
  inset:-1px;
  border-radius:16px;
  background:linear-gradient(135deg,rgba(149,201,94,.45),transparent 34%,rgba(240,193,91,.26));
  z-index:-1;
}

.board-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14px;
  margin-bottom:14px;
}

.cm2-tag{
  display:inline-flex;
  color:#c5ceb9;
  font-size:10px;
  font-weight:850;
  text-transform:uppercase;
  letter-spacing:.12em;
  margin-bottom:5px;
}

.board-top h3{
  margin:0;
  font-size:17px;
  color:#ffffff;
  font-weight:850;
}

.live-dot-wrap{
  display:inline-flex;
  align-items:center;
  gap:7px;
  white-space:nowrap;
  color:#bfe7a4;
  background:rgba(129,182,76,.12);
  border:1px solid rgba(129,182,76,.24);
  padding:7px 11px;
  border-radius:999px;
  font-size:11px;
  font-weight:800;
}

.live-dot{
  width:7px;
  height:7px;
  border-radius:50%;
  background:#89e263;
  animation:cmblink 1.6s ease-in-out infinite;
}

@keyframes cmblink{
  0%,100%{opacity:1}
  50%{opacity:.32}
}

.board-outer{
  display:grid;
  grid-template-columns:20px 1fr;
  grid-template-rows:1fr 20px;
  gap:5px;
}

.board-ranks{
  display:grid;
  grid-template-rows:repeat(8,1fr);
  color:#899381;
  font-size:10px;
  font-weight:800;
}

.board-ranks span{
  display:flex;
  align-items:center;
  justify-content:center;
}

.board-files{
  grid-column:2;
  display:grid;
  grid-template-columns:repeat(8,1fr);
  color:#899381;
  font-size:10px;
  font-weight:800;
}

.board-files span{
  display:flex;
  align-items:center;
  justify-content:center;
}

.board-8{
  grid-column:2;
  grid-row:1;
  display:grid;
  grid-template-columns:repeat(8,1fr);
  grid-template-rows:repeat(8,1fr);
  overflow:hidden;
  aspect-ratio:1;
  border-radius:8px;
  border:2px solid rgba(255,255,255,.11);
  box-shadow:inset 0 0 0 1px rgba(0,0,0,.16);
}

.board-8 .sqlt{
  background:#eeeed2;
}

.board-8 .sqdk{
  background:#769656;
}

.board-8 .sq{
  display:flex;
  align-items:center;
  justify-content:center;
  position:relative;
}

.board-8 .sq img{
  width:82%;
  height:82%;
  object-fit:contain;
  filter:drop-shadow(0 3px 3px rgba(0,0,0,.36));
}

.board-bottom{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:8px;
  margin-top:14px;
}

.board-bottom .bc-tag{
  padding:11px 8px;
  background:rgba(255,255,255,.055);
  border:1px solid rgba(255,255,255,.09);
  border-radius:8px;
  text-align:center;
}

.board-bottom .bc-tag span{
  display:block;
  margin-bottom:4px;
  color:#9ca796;
  font-size:9px;
  font-weight:850;
  text-transform:uppercase;
  letter-spacing:.11em;
}

.board-bottom .bc-tag strong{
  color:#ffffff;
  font-size:13px;
  font-weight:850;
}

.cm2-wrap{
  width:min(1180px,calc(100% - 40px));
  margin:0 auto;
}

.cm2-divider{
  height:1px;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.13),transparent);
}

.cm2-section{
  padding:76px 0;
}

.cm2-card{
  position:relative;
  height:100%;
  padding:22px;
  border-radius:12px;
  background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.04));
  border:1px solid rgba(255,255,255,.1);
  box-shadow:0 20px 44px rgba(0,0,0,.18);
  transition:transform .2s ease, border-color .2s ease, background .2s ease;
}

.cm2-card:hover{
  transform:translateY(-4px);
  border-color:rgba(129,182,76,.34);
  background:linear-gradient(180deg,rgba(255,255,255,.095),rgba(255,255,255,.048));
}

.battle-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:16px;
  margin-top:34px;
}

.battle-card{
  display:flex;
  flex-direction:column;
}

.battle-icon,
.feat-icon{
  width:44px;
  height:44px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:10px;
  margin-bottom:16px;
  font-size:21px;
}

.battle-card p,
.feat-card p{
  color:var(--h-muted);
  font-size:14px;
  line-height:1.65;
  margin:0;
}

.battle-card p{
  flex-grow:1;
  margin-bottom:18px;
}

.battle-link{
  display:inline-flex;
  align-items:center;
  gap:7px;
  width:max-content;
  color:var(--h-green-2) !important;
  font-size:14px;
  font-weight:850;
  text-decoration:none;
}

.feat-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:16px;
  margin-top:34px;
}

.how-wrap{
  background:
    linear-gradient(180deg,rgba(255,255,255,.035),rgba(255,255,255,.02)),
    #121914;
  border-top:1px solid rgba(255,255,255,.08);
  border-bottom:1px solid rgba(255,255,255,.08);
}

.steps-grid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:18px;
  margin-top:42px;
}

.step{
  padding:28px 22px;
  background:rgba(255,255,255,.045);
  border:1px solid rgba(255,255,255,.09);
  border-radius:12px;
  text-align:center;
}

.step-num{
  width:52px;
  height:52px;
  display:flex;
  align-items:center;
  justify-content:center;
  margin:0 auto 18px;
  border-radius:12px;
  color:#12200e;
  background:linear-gradient(180deg,#9fdb65,#7fb64a);
  font-size:22px;
  font-weight:950;
  box-shadow:0 14px 28px rgba(129,182,76,.18);
}

.step p{
  max-width:290px;
  margin:0 auto;
  color:var(--h-muted);
  font-size:14px;
  line-height:1.65;
}

.cta-wrap{
  position:relative;
  padding:90px 0 100px;
  text-align:center;
}

.cta-wrap::before{
  content:'';
  position:absolute;
  left:50%;
  top:50%;
  width:min(760px,90vw);
  height:360px;
  transform:translate(-50%,-50%);
  background:radial-gradient(ellipse,rgba(129,182,76,.18),transparent 68%);
  pointer-events:none;
}

.cta-inner{
  position:relative;
  z-index:1;
  width:min(680px,calc(100% - 40px));
  margin:0 auto;
}

.cta-btns{
  display:flex;
  justify-content:center;
  gap:12px;
  flex-wrap:wrap;
  margin-top:30px;
}

@media (max-width:960px){
  .h-hero{ padding:64px 0 58px; }
  .h-grid{
    grid-template-columns:1fr;
    gap:38px;
    text-align:center;
  }
  .h-copy{
    max-width:none;
  }
  .stats-container,
  .h-btns{
    justify-content:center;
  }
  .cm2-sub{
    margin-left:auto;
    margin-right:auto;
  }
  .h-stats{
    margin-left:auto;
    margin-right:auto;
  }
}

@media (max-width:820px){
  .battle-grid,
  .feat-grid,
  .steps-grid{
    grid-template-columns:1fr;
  }
}

@media (max-width:560px){
  .cm2-wrap{
    width:min(100% - 24px,1180px);
  }

  .h-hero{
    padding:46px 0 44px;
  }

  .cm2-h1{
    font-size:clamp(2.35rem,13vw,3.7rem);
  }

  .cm2-sub{
    font-size:15px;
    line-height:1.65;
  }

  .h-stats{
    grid-template-columns:repeat(2,1fr);
  }

  .board-frame{
    padding:12px;
    border-radius:14px;
  }

  .board-top{
    align-items:flex-start;
  }

  .live-dot-wrap{
    padding:6px 9px;
  }

  .board-bottom{
    grid-template-columns:1fr;
  }

  .cm2-section{
    padding:56px 0;
  }

  .cm2-card,
  .step{
    padding:20px;
  }

  .cta-wrap{
    padding:68px 0 76px;
  }
}
`;

const Home = ({ currentUser }) => {
  const [onlineCount, setOnlineCount] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const socket = getSocket();

    const onUpdate = (count) => setOnlineCount(count);
    socket.on("activeUsersUpdate", onUpdate);

    return () => socket.off("activeUsersUpdate", onUpdate);
  }, []);

  useEffect(() => {
    api.get('/api/stats')
      .then((res) => setTotalUsers(res.data.totalUsers || 0))
      .catch(() => setTotalUsers(0));
  }, []);

  const backRow = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
  const boardSquares = [];

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const isLight = (row + col) % 2 === 0;
      let piece = null;

      if (row === 0) piece = { color: "black", type: backRow[col] };
      else if (row === 1) piece = { color: "black", type: "pawn" };
      else if (row === 6) piece = { color: "white", type: "pawn" };
      else if (row === 7) piece = { color: "white", type: backRow[col] };

      boardSquares.push(
        <div key={`${row}-${col}`} className={`sq ${isLight ? 'sqlt' : 'sqdk'}`}>
          {piece && (
            <img
              src={`/images/pieces/${piece.color}-${piece.type}.png`}
              alt={`${piece.color} ${piece.type}`}
            />
          )}
        </div>
      );
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

      <main className="h-page">
        <section className="h-hero">
          <div className="cm2-wrap h-grid">
            <div className="h-copy">
              <div className="stats-container">
                <div className="stat-badge">
                  <span className="live-dot-wrapper">
                    <span className="live-dot-ping"></span>
                    <span className="live-dot-main"></span>
                  </span>
                  <span>Online: <strong>{onlineCount}</strong></span>
                </div>
                <div className="stat-badge">
                  <span>👥</span>
                  <span>Total Members: <strong>{totalUsers || 0}</strong></span>
                </div>
              </div>

              <span className="cm2-eyebrow">
                <span className="sq"></span>1.e4 e5 2.Nf3 — it's your move
              </span>

              <h1 className="cm2-h1">
                Play chess<br />
                <span className="cm2-accent">your way.</span><br />
                <span className="cm2-accent-sage">Win the next game.</span>
              </h1>

              <p className="cm2-sub">
                ChessMaster brings fast online matches, local games, Stockfish bots,
                make friends, saved replays, ratings, and profiles into one clean place.
              </p>

              <div className="h-btns">
                <Link to="/play" className="cm2-btn cm2-btn-primary">♟ Play Now</Link>
                {!currentUser ? (
                  <Link to="/register" className="cm2-btn cm2-btn-secondary">Create Free Account →</Link>
                ) : (
                  <Link to="/online" className="cm2-btn cm2-btn-secondary">Play Online →</Link>
                )}
              </div>

              <div className="h-stats">
                <div><strong>32</strong><span>AI Bots</span></div>
                <div><strong>Live</strong><span>Online PvP</span></div>
                <div><strong>6</strong><span>Board Themes</span></div>
                <div><strong>100%</strong><span>Free</span></div>
              </div>
            </div>

            <div className="board-frame">
              <div className="board-top">
                <div>
                  <div className="cm2-tag">Starting Position</div>
                  <h3>Ready when you are</h3>
                </div>
                <div className="live-dot-wrap">
                  <span className="live-dot"></span>Engine idle
                </div>
              </div>

              <div className="board-outer">
                <div className="board-ranks">
                  <span>8</span><span>7</span><span>6</span><span>5</span>
                  <span>4</span><span>3</span><span>2</span><span>1</span>
                </div>
                <div className="board-8">
                  {boardSquares}
                </div>
                <div></div>
                <div className="board-files">
                  <span>a</span><span>b</span><span>c</span><span>d</span>
                  <span>e</span><span>f</span><span>g</span><span>h</span>
                </div>
              </div>

              <div className="board-bottom">
                <div className="bc-tag"><span>Turn</span><strong>White</strong></div>
                <div className="bc-tag"><span>Mode</span><strong>Your Choice</strong></div>
                <div className="bc-tag"><span>Engine</span><strong>Stockfish</strong></div>
              </div>
            </div>
          </div>
        </section>

        <div className="cm2-wrap"><div className="cm2-divider"></div></div>

        <section className="cm2-section">
          <div className="cm2-wrap">
            <span className="cm2-eyebrow"><span className="sq"></span>Three ways to play</span>
            <h2 className="cm2-h2">Choose your next match</h2>
            <p className="cm2-sub">Jump into a quick game, train against bots, or challenge real players online.</p>

            <div className="battle-grid">
              <div className="cm2-card battle-card">
                <div className="battle-icon" style={{ background: 'rgba(129,182,76,0.16)' }}>🧑‍🤝‍🧑</div>
                <h3 className="cm2-h3">Play a Friend</h3>
                <p>Pass-and-play on one screen. Perfect for quick games, rematches, and settling the score instantly.</p>
                <Link to="/play" className="battle-link">Start a local game →</Link>
              </div>

              <div className="cm2-card battle-card">
                <div className="battle-icon" style={{ background: 'rgba(240,193,91,0.16)' }}>🤖</div>
                <h3 className="cm2-h3">Challenge a Bot</h3>
                <p>32 opponents from 100 to 3200 rating, powered by Stockfish for practice at every level.</p>
                <Link to="/play" className="battle-link">Pick a bot →</Link>
              </div>

              <div className="cm2-card battle-card">
                <div className="battle-icon" style={{ background: 'rgba(229,139,66,0.16)' }}>🌐</div>
                <h3 className="cm2-h3">Go Online</h3>
                <p>Play live multiplayer, add friends, send challenges, and compete from anywhere.</p>
                <Link to="/online" className="battle-link">Find an opponent →</Link>
              </div>
            </div>
          </div>
        </section>

        <div className="cm2-wrap"><div className="cm2-divider"></div></div>

        <section className="cm2-section">
          <div className="cm2-wrap">
            <span className="cm2-eyebrow"><span className="sq"></span>Everything included</span>
            <h2 className="cm2-h2">Built for real games</h2>
            <p className="cm2-sub">All the core pieces a chess platform needs, from legal moves to saved match history.</p>

            <div className="feat-grid">
              <div className="cm2-card feat-card">
                <div className="feat-icon" style={{ background: 'rgba(129,182,76,0.16)' }}>♟</div>
                <h3 className="cm2-h3">Interactive Board</h3>
                <p>Click or drag pieces, see legal move hints, captures, and check highlights in real time.</p>
              </div>

              <div className="cm2-card feat-card">
                <div className="feat-icon" style={{ background: 'rgba(240,193,91,0.16)' }}>🤖</div>
                <h3 className="cm2-h3">32 AI Bots</h3>
                <p>Challenge bots from 100 to 3200 rating, powered by Stockfish.</p>
              </div>

              <div className="cm2-card feat-card">
                <div className="feat-icon" style={{ background: 'rgba(229,139,66,0.16)' }}>🌐</div>
                <h3 className="cm2-h3">Online Multiplayer</h3>
                <p>Live games over Socket.IO — create a room, share it, or match with a friend.</p>
              </div>

              <div className="cm2-card feat-card">
                <div className="feat-icon" style={{ background: 'rgba(129,182,76,0.16)' }}>🧑‍🤝‍🧑</div>
                <h3 className="cm2-h3">Friends</h3>
                <p>Search players by username, send friend requests.</p>
              </div>

              <div className="cm2-card feat-card">
                <div className="feat-icon" style={{ background: 'rgba(240,193,91,0.16)' }}>⏱</div>
                <h3 className="cm2-h3">Time Controls</h3>
                <p>Rapid, Blitz, or Bullet — clocks tick, increment applies, and timeout ends the game.</p>
              </div>

              <div className="cm2-card feat-card">
                <div className="feat-icon" style={{ background: 'rgba(229,139,66,0.16)' }}>▶</div>
                <h3 className="cm2-h3">Game Replay</h3>
                <p>Every game is auto-saved and fully replayable so you can review each move.</p>
              </div>

              <div className="cm2-card feat-card">
                <div className="feat-icon" style={{ background: 'rgba(129,182,76,0.16)' }}>🏆</div>
                <h3 className="cm2-h3">Leaderboard & Ratings</h3>
                <p>Wins, losses, draws, and an Elo-style rating are saved for every player.</p>
              </div>

              <div className="cm2-card feat-card">
                <div className="feat-icon" style={{ background: 'rgba(240,193,91,0.16)' }}>🎨</div>
                <h3 className="cm2-h3">Board Themes</h3>
                <p>Six board themes saved to your profile so your setup follows you.</p>
              </div>

              <div className="cm2-card feat-card">
                <div className="feat-icon" style={{ background: 'rgba(229,139,66,0.16)' }}>👤</div>
                <h3 className="cm2-h3">Player Profiles</h3>
                <p>Your stats, history, and rating live in one profile you can update anytime.</p>
              </div>
            </div>
          </div>
        </section>

        <div className="how-wrap">
          <section className="cm2-section">
            <div className="cm2-wrap" style={{ textAlign: 'center' }}>
              <span className="cm2-eyebrow" style={{ margin: '0 auto 16px' }}>
                <span className="sq"></span>Getting started
              </span>
              <h2 className="cm2-h2">Three moves to your first game</h2>

              <div className="steps-grid">
                <div className="step">
                  <div className="step-num">1</div>
                  <h3 className="cm2-h3">Create an account</h3>
                  <p>Free, no card required. Your stats, friends, and games are saved from move one.</p>
                </div>
                <div className="step">
                  <div className="step-num">2</div>
                  <h3 className="cm2-h3">Pick your opponent</h3>
                  <p>Choose a friend, a Stockfish bot, or someone online, then set your time control.</p>
                </div>
                <div className="step">
                  <div className="step-num">3</div>
                  <h3 className="cm2-h3">Review and improve</h3>
                  <p>Replay saved games, check the leaderboard, and come back stronger.</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="cta-wrap">
          <div className="cta-inner">
            <span className="cm2-eyebrow" style={{ margin: '0 auto 20px' }}>
              <span className="sq"></span>Checkmate awaits
            </span>
            <h2 className="cm2-h1" style={{ fontSize: 'clamp(2rem,4.5vw,3.2rem)' }}>
              Your next move<br />
              <span className="cm2-accent">starts here.</span>
            </h2>
            <p className="cm2-sub" style={{ margin: '18px auto 0' }}>
              Join ChessMaster — play, learn, and challenge yourself every day.
            </p>
            <div className="cta-btns">
              <Link to={currentUser ? '/play' : '/register'} className="cm2-btn cm2-btn-primary">
                ♟ {currentUser ? 'Play Now' : 'Get Started Free'}
              </Link>
              <Link to="/leaderboard" className="cm2-btn cm2-btn-secondary">View Leaderboard →</Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;