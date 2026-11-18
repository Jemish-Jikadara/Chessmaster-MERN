import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const pageStyles = `
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Orbitron:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

.h-page{
  position:relative;
  background:#050510;
  color:#e8f4ff;
  font-family:'Inter', system-ui, sans-serif;
  min-height:100vh;
  overflow-x:hidden;
}

/* Animated grid backdrop */
.h-page::before{
  content:'';
  position:fixed;
  inset:0;
  background-image:
    linear-gradient(rgba(0,229,255,0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,229,255,0.045) 1px, transparent 1px);
  background-size:52px 52px;
  mask-image:radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 80%);
  -webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 80%);
  pointer-events:none;
  z-index:0;
  animation:h-grid 24s linear infinite;
}

.h-page::after{
  content:'';
  position:fixed;
  inset:0;
  background:
    radial-gradient(700px 400px at 12% 8%, rgba(0,229,255,0.14), transparent 60%),
    radial-gradient(600px 400px at 92% 20%, rgba(255,45,149,0.10), transparent 60%),
    radial-gradient(800px 500px at 50% 110%, rgba(139,92,246,0.12), transparent 60%);
  pointer-events:none;
  z-index:0;
}

@keyframes h-grid{
  0%{ background-position:0 0, 0 0; }
  100%{ background-position:52px 52px, 52px 52px; }
}

.h-page > *{ position:relative; z-index:1; }
.h-page *{ box-sizing:border-box; }

.cm2-wrap{
  width:min(1240px, calc(100% - 40px));
  margin:0 auto;
}

.cm2-divider{
  height:1px;
  background:linear-gradient(90deg, transparent, rgba(0,229,255,.35), rgba(255,45,149,.25), transparent);
  box-shadow:0 0 12px rgba(0,229,255,.25);
}

.cm2-section{
  padding:90px 0;
}

/* =========================================================
   HERO
   ========================================================= */
.lb-hero{
  position:relative;
  padding:100px 0 80px;
}

.lb-head{
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
  gap:30px;
  flex-wrap:wrap;
}

.lb-kicker{
  display:inline-flex;
  align-items:center;
  gap:10px;
  color:#00e5ff;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12px;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.22em;
  margin-bottom:16px;
}

.lb-kicker::before{
  content:'[';
  color:#a8f8ff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-weight:900;
}
.lb-kicker::after{
  content:']';
  color:#a8f8ff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-weight:900;
}

.lb-title{
  margin:0;
  color:#fff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-size:clamp(2.4rem, 5.6vw, 4.4rem);
  line-height:.98;
  font-weight:800;
  letter-spacing:-0.015em;
  text-transform:uppercase;
}

.lb-title .cm2-accent{
  background:linear-gradient(90deg, #00e5ff, #a8f8ff, #ff2d95);
  -webkit-background-clip:text;
  background-clip:text;
  color:transparent;
  filter:drop-shadow(0 0 24px rgba(0,229,255,.35));
}

.lb-sub{
  max-width:600px;
  margin:20px 0 0;
  color:#b8c6dd;
  font-size:16px;
  line-height:1.75;
}

/* =========================================================
   BUTTONS
   ========================================================= */
.cm2-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:9px;
  min-height:48px;
  padding:0 24px;
  border-radius:6px;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:13px;
  font-weight:700;
  letter-spacing:.14em;
  text-transform:uppercase;
  text-decoration:none;
  border:1px solid transparent;
  cursor:pointer;
  position:relative;
  transition:transform .18s ease, box-shadow .22s ease, background .22s ease, color .22s ease;
  overflow:hidden;
}

.cm2-btn:hover{ transform:translateY(-2px); }

.cm2-btn-primary{
  color:#050510;
  background:linear-gradient(90deg, #00e5ff, #a8f8ff);
  box-shadow:
    0 0 20px rgba(0,229,255,.55),
    0 0 44px rgba(0,229,255,.25),
    inset 0 0 10px rgba(255,255,255,.4);
}
.cm2-btn-primary:hover{
  box-shadow:
    0 0 30px rgba(0,229,255,.8),
    0 0 60px rgba(0,229,255,.4),
    inset 0 0 12px rgba(255,255,255,.55);
}

.cm2-btn-primary::after{
  content:'';
  position:absolute;
  inset:0;
  background:linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
  transform:translateX(-100%);
  transition:transform .5s ease;
}
.cm2-btn-primary:hover::after{ transform:translateX(100%); }

.cm2-btn-secondary{
  color:#00e5ff;
  background:rgba(0,229,255,.05);
  border-color:rgba(0,229,255,.35);
  box-shadow:inset 0 0 12px rgba(0,229,255,.12);
}
.cm2-btn-secondary:hover{
  background:rgba(0,229,255,.12);
  border-color:#00e5ff;
  color:#a8f8ff;
  box-shadow:
    inset 0 0 20px rgba(0,229,255,.2),
    0 0 22px rgba(0,229,255,.35);
}

.cm2-corners{ position:relative; }
.cm2-corners::before,
.cm2-corners::after{
  content:'';
  position:absolute;
  width:8px; height:8px;
  border:1px solid currentColor;
  opacity:0.55;
  pointer-events:none;
}
.cm2-corners::before{
  top:3px; left:3px;
  border-right:0; border-bottom:0;
}
.cm2-corners::after{
  bottom:3px; right:3px;
  border-left:0; border-top:0;
}

/* =========================================================
   TABLE (desktop)
   ========================================================= */
.lb-table-wrap{
  margin-top:34px;
  border-radius:8px;
  overflow:hidden;
  background:rgba(5,5,16,.75);
  border:1px solid rgba(0,229,255,.3);
  box-shadow:
    0 0 40px rgba(0,229,255,.15),
    inset 0 0 40px rgba(0,229,255,.04);
}

.lb-table-wrap table{
  width:100%;
  border-collapse:collapse;
}

.lb-table-wrap thead{
  background:rgba(0,229,255,.06);
  border-bottom:1px solid rgba(0,229,255,.24);
}

.lb-table-wrap th{
  padding:16px 18px;
  text-align:left;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:10.5px;
  text-transform:uppercase;
  letter-spacing:.22em;
  color:#00e5ff;
  font-weight:700;
}

.lb-table-wrap td{
  padding:16px 18px;
  border-bottom:1px solid rgba(255,255,255,.05);
  font-size:14px;
  color:#e8f4ff;
  transition:background .18s ease;
  font-family:'Inter', system-ui, sans-serif;
}

.lb-table-wrap tbody tr:last-child td{
  border-bottom:none;
}

.lb-table-wrap tbody tr:hover td{
  background:rgba(0,229,255,.06);
}

.lb-td-num{
  width:80px;
  font-family:'Orbitron', system-ui, sans-serif;
  font-weight:900;
  color:#00e5ff;
  font-size:15px;
  text-shadow:0 0 12px rgba(0,229,255,.55);
}

.lb-td-player{
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-weight:700;
  color:#ffffff;
  font-size:14px;
  letter-spacing:.04em;
}

/* =========================================================
   WINNER BADGES
   ========================================================= */
.lb-badge{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:6px 12px;
  border-radius:4px;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:11px;
  font-weight:700;
  letter-spacing:.12em;
  text-transform:uppercase;
  white-space:nowrap;
}

.lb-badge-white{
  background:rgba(0,229,255,.1);
  border:1px solid rgba(0,229,255,.4);
  color:#a8f8ff;
  box-shadow:inset 0 0 10px rgba(0,229,255,.15);
}

.lb-badge-black{
  background:rgba(139,92,246,.12);
  border:1px solid rgba(139,92,246,.4);
  color:#c4b5fd;
  box-shadow:inset 0 0 10px rgba(139,92,246,.15);
}

.lb-badge-draw{
  background:rgba(182,255,60,.1);
  border:1px solid rgba(182,255,60,.4);
  color:#b6ff3c;
  box-shadow:inset 0 0 10px rgba(182,255,60,.15);
}

/* =========================================================
   WATCH BUTTON
   ========================================================= */
.lb-btn-watch{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:8px 14px;
  border-radius:4px;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:11px;
  font-weight:700;
  letter-spacing:.14em;
  text-transform:uppercase;
  text-decoration:none;
  color:#00e5ff;
  background:rgba(0,229,255,.06);
  border:1px solid rgba(0,229,255,.35);
  transition:all .18s ease;
  white-space:nowrap;
}

.lb-btn-watch:hover{
  background:rgba(0,229,255,.14);
  border-color:#00e5ff;
  color:#a8f8ff;
  transform:translateY(-2px);
  box-shadow:
    0 0 18px rgba(0,229,255,.45),
    inset 0 0 12px rgba(0,229,255,.15);
}

/* =========================================================
   EMPTY STATE
   ========================================================= */
.lb-empty{
  margin-top:34px;
  padding:80px 24px;
  border-radius:8px;
  text-align:center;
  background:
    linear-gradient(180deg, rgba(0,229,255,.06), rgba(139,92,246,.03)),
    #08081a;
  border:1px solid rgba(0,229,255,.28);
  box-shadow:
    0 0 40px rgba(0,229,255,.12),
    inset 0 0 40px rgba(0,229,255,.04);
  position:relative;
}

.lb-empty::before,
.lb-empty::after{
  content:'';
  position:absolute;
  width:22px;
  height:22px;
  border:2px solid #00e5ff;
  filter:drop-shadow(0 0 8px rgba(0,229,255,.7));
  pointer-events:none;
}
.lb-empty::before{ top:-2px; left:-2px; border-right:0; border-bottom:0; }
.lb-empty::after{ bottom:-2px; right:-2px; border-left:0; border-top:0; }

.lb-empty-icon{
  font-size:48px;
  margin-bottom:20px;
  filter:drop-shadow(0 0 20px rgba(0,229,255,.6));
}

.lb-empty h2{
  margin:0 0 10px;
  color:#fff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-size:22px;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.04em;
}

.lb-empty p{
  margin:0 0 24px;
  color:#7d8ba8;
  font-size:14px;
  line-height:1.7;
}

/* =========================================================
   MOBILE CARDS
   ========================================================= */
.lb-mobile-cards{
  display:none;
  flex-direction:column;
  gap:16px;
  margin-top:34px;
}

.lb-game-card{
  display:block;
  text-decoration:none;
  color:inherit;
  padding:20px;
  border-radius:8px;
  background:
    linear-gradient(180deg, rgba(0,229,255,.06), rgba(139,92,246,.03)),
    #08081a;
  border:1px solid rgba(0,229,255,.24);
  transition:transform .2s ease, border-color .2s ease, box-shadow .2s ease;
  position:relative;
}

.lb-game-card:hover{
  border-color:rgba(0,229,255,.55);
  transform:translateY(-3px);
  box-shadow:
    0 0 24px rgba(0,229,255,.28),
    0 10px 24px rgba(0,0,0,.4);
}

.lb-card-head{
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
  gap:16px;
  margin-bottom:16px;
}

.lb-match-num{
  display:block;
  color:#00e5ff;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:10px;
  font-weight:700;
  text-transform:uppercase;
  letter-spacing:.22em;
  margin-bottom:6px;
}

.lb-card-head h3{
  margin:0;
  color:#fff;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:15px;
  font-weight:700;
  letter-spacing:.04em;
  text-transform:uppercase;
  line-height:1.3;
}

.lb-card-meta{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:10px;
}

.lb-meta-item{
  background:rgba(0,229,255,.04);
  border:1px solid rgba(0,229,255,.18);
  border-radius:6px;
  padding:12px;
}

.lb-meta-item span{
  display:block;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:10px;
  text-transform:uppercase;
  letter-spacing:.18em;
  color:#00e5ff;
  margin-bottom:6px;
  font-weight:700;
}

.lb-meta-item strong{
  color:#fff;
  font-family:'Inter', system-ui, sans-serif;
  font-size:14px;
  font-weight:700;
}

/* =========================================================
   RESPONSIVE
   ========================================================= */
@media (max-width:960px){
  .lb-hero{ padding:72px 0 60px; }
  .lb-head{ align-items:flex-start; }
}

@media (max-width:820px){
  .lb-table-wrap{ display:none; }
  .lb-mobile-cards{ display:flex; }
  .lb-hero{ padding:60px 0 50px; }
}

@media (max-width:560px){
  .cm2-wrap{ width:calc(100% - 24px); }
  .lb-hero{ padding:52px 0 44px; }
  .lb-title{ font-size:clamp(1.9rem, 10vw, 2.6rem); }
  .lb-sub{ font-size:14px; }
  .cm2-section{ padding:56px 0; }
  .cm2-btn{ width:100%; justify-content:center; }
  .lb-meta-item{ padding:10px; }
  .lb-meta-item strong{ font-size:13px; }
}
`;

const Leaderboard = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api.get('/api/games')
      .then((res) => mounted && setGames(res.data.games || []))
      .catch((err) => console.error('Failed to load games:', err))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, []);

  const getRankDisplay = (index) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return index + 1;
  };

  const getWinnerBadge = (winner) => {
    if (winner === 'white') {
      return <span className="lb-badge lb-badge-white">◆ White</span>;
    }
    if (winner === 'black') {
      return <span className="lb-badge lb-badge-black">◆ Black</span>;
    }
    return <span className="lb-badge lb-badge-draw">◆ Draw</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

      <main className="h-page">
        {/* HERO */}
        <section className="lb-hero">
          <div className="cm2-wrap">
            <div className="lb-head">
              <div>
                <span className="lb-kicker">♚ ChessMaster Ranking</span>
                <h1 className="cm2-h1 lb-title">
                  Leader<span className="cm2-accent">board</span>
                </h1>
                <p className="cm2-sub lb-sub">
                  Explore recently saved matches, winners, move counts, and replay your favourite games.
                </p>
              </div>
              <Link to="/play" className="cm2-btn cm2-btn-primary cm2-corners">
                ▶ Play New Match
              </Link>
            </div>
          </div>
        </section>

        <div className="cm2-wrap"><div className="cm2-divider"></div></div>

        {/* CONTENT */}
        <section className="cm2-section">
          <div className="cm2-wrap">
            {loading && (
              <div className="lb-empty">
                <div className="lb-empty-icon">⏳</div>
                <h2>Loading games…</h2>
                <p>Please wait while we fetch the latest matches.</p>
              </div>
            )}

            {!loading && (!games || games.length === 0) && (
              <div className="lb-empty">
                <div className="lb-empty-icon">🏆</div>
                <h2>No Games Found</h2>
                <p>Play and save your first chess match to appear on the leaderboard.</p>
                <Link to="/play" className="cm2-btn cm2-btn-primary cm2-corners">
                  ▶ Start Playing
                </Link>
              </div>
            )}

            {!loading && games && games.length > 0 && (
              <>
                {/* Mobile Cards */}
                <div className="lb-mobile-cards">
                  {games.map((game, index) => (
                    <Link key={game._id} to={`/game/${game._id}`} className="lb-game-card">
                      <div className="lb-card-head">
                        <div>
                          <div className="lb-match-num">Match #{index + 1}</div>
                          <h3>{game.whitePlayer} vs {game.blackPlayer}</h3>
                        </div>
                        <div>{getWinnerBadge(game.winner)}</div>
                      </div>
                      <div className="lb-card-meta">
                        <div className="lb-meta-item">
                          <span>Moves</span>
                          <strong>{game.totalMoves}</strong>
                        </div>
                        <div className="lb-meta-item">
                          <span>Date</span>
                          <strong>{formatDate(game.createdAt)}</strong>
                        </div>
                        <div className="lb-meta-item">
                          <span>Mode</span>
                          <strong>{game.timeMode || 'Classic'}</strong>
                        </div>
                        <div className="lb-meta-item">
                          <span>Time</span>
                          <strong>{game.timeControl || '-'}</strong>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Desktop Table */}
                <div className="lb-table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>White Player</th>
                        <th>Black Player</th>
                        <th>Winner</th>
                        <th>Moves</th>
                        <th>Date</th>
                        <th>Replay</th>
                      </tr>
                    </thead>
                    <tbody>
                      {games.map((game, index) => (
                        <tr key={game._id}>
                          <td className="lb-td-num">{getRankDisplay(index)}</td>
                          <td className="lb-td-player">{game.whitePlayer}</td>
                          <td className="lb-td-player">{game.blackPlayer}</td>
                          <td>{getWinnerBadge(game.winner)}</td>
                          <td>{game.totalMoves}</td>
                          <td>{formatDate(game.createdAt)}</td>
                          <td>
                            <Link to={`/game/${game._id}`} className="lb-btn-watch">▶ Watch</Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  );
};

export default Leaderboard;