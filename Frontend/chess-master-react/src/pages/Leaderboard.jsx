import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

.cm2-h2{
  margin:0;
  color:var(--h-text);
  font-size:clamp(2rem,4vw,3.4rem);
  line-height:1.02;
  letter-spacing:0;
  font-weight:900;
}

.cm2-sub{
  max-width:620px;
  margin:22px 0 0;
  color:var(--h-muted);
  font-size:17px;
  line-height:1.72;
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

/* Leaderboard specific */
.lb-hero{
  position:relative;
  padding:88px 0 72px;
}

.lb-hero::before{
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

.lb-head{
  display:flex;
  justify-content:space-between;
  align-items:flex-end;
  gap:30px;
  flex-wrap:wrap;
}

.lb-kicker{
  display:block;
  color:var(--h-green-2);
  font-size:11px;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.18em;
  margin-bottom:10px;
}

.lb-title{
  margin:0;
  color:var(--h-text);
  font-size:clamp(2.4rem,5vw,3.4rem);
  line-height:1.02;
  font-weight:900;
}

.lb-sub{
  max-width:560px;
  margin:14px 0 0;
  color:var(--h-muted);
  font-size:16px;
  line-height:1.7;
}

/* Table */
.lb-table-wrap{
  margin-top:34px;
  background:rgba(255,255,255,.045);
  border:1px solid rgba(255,255,255,.09);
  border-radius:12px;
  overflow:hidden;
}

.lb-table-wrap table{
  width:100%;
  border-collapse:collapse;
}

.lb-table-wrap thead{
  background:rgba(255,255,255,.06);
  border-bottom:1px solid var(--h-line);
}

.lb-table-wrap th{
  padding:16px 18px;
  text-align:left;
  font-size:11px;
  text-transform:uppercase;
  letter-spacing:.12em;
  color:var(--h-muted);
  font-weight:800;
}

.lb-table-wrap td{
  padding:16px 18px;
  border-bottom:1px solid rgba(255,255,255,.05);
  font-size:14px;
  color:var(--h-text);
  transition:background .18s ease;
}

.lb-table-wrap tbody tr:last-child td{
  border-bottom:none;
}

.lb-table-wrap tbody tr:hover td{
  background:rgba(129,182,76,.08);
}

.lb-td-num{
  width:70px;
  font-weight:900;
  color:var(--h-gold);
}

.lb-td-player{
  font-weight:850;
  color:#ffffff;
}

/* Badges */
.lb-badge{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:6px 12px;
  border-radius:999px;
  font-size:12px;
  font-weight:800;
}

.lb-badge-white{
  background:rgba(255,255,255,.12);
  border:1px solid rgba(255,255,255,.25);
  color:#ffffff;
}

.lb-badge-black{
  background:rgba(0,0,0,.45);
  border:1px solid rgba(255,255,255,.15);
  color:#d1d5db;
}

.lb-badge-draw{
  background:rgba(240,193,91,.15);
  border:1px solid rgba(240,193,91,.35);
  color:var(--h-gold);
}

/* Watch button */
.lb-btn-watch{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding:8px 14px;
  border-radius:8px;
  font-size:12px;
  font-weight:850;
  text-decoration:none;
  color:var(--h-green-2);
  background:rgba(129,182,76,.12);
  border:1px solid rgba(129,182,76,.24);
  transition:all .18s ease;
}

.lb-btn-watch:hover{
  background:rgba(129,182,76,.2);
  border-color:var(--h-green);
  color:#ffffff;
  transform:translateY(-1px);
}

/* Empty state */
.lb-empty{
  margin-top:34px;
  background:rgba(255,255,255,.045);
  border:1px solid rgba(255,255,255,.09);
  border-radius:12px;
  padding:60px 24px;
  text-align:center;
}

.lb-empty-icon{
  font-size:48px;
  margin-bottom:16px;
}

.lb-empty h2{
  margin:0 0 8px;
  color:var(--h-text);
  font-size:24px;
  font-weight:900;
}

.lb-empty p{
  margin:0 0 20px;
  color:var(--h-muted);
  font-size:14px;
  line-height:1.65;
}

/* Mobile cards */
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
  background:rgba(255,255,255,.045);
  border:1px solid rgba(255,255,255,.09);
  border-radius:12px;
  padding:18px;
  transition:all .18s ease;
}

.lb-game-card:hover{
  border-color:rgba(129,182,76,.34);
  transform:translateY(-3px);
  box-shadow:0 10px 24px rgba(129,182,76,.12);
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
  color:var(--h-muted);
  font-size:10px;
  font-weight:800;
  text-transform:uppercase;
  letter-spacing:.1em;
  margin-bottom:6px;
}

.lb-card-head h3{
  margin:0;
  color:var(--h-text);
  font-size:18px;
  font-weight:900;
}

.lb-card-meta{
  display:grid;
  grid-template-columns:repeat(2,1fr);
  gap:12px;
}

.lb-meta-item{
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.09);
  border-radius:10px;
  padding:12px;
}

.lb-meta-item span{
  display:block;
  font-size:10px;
  text-transform:uppercase;
  letter-spacing:.1em;
  color:var(--h-muted);
  margin-bottom:4px;
  font-weight:800;
}

.lb-meta-item strong{
  color:var(--h-text);
  font-size:14px;
  font-weight:850;
}

/* Responsive */
@media (max-width:960px){
  .lb-hero{
    padding:64px 0 58px;
  }
  .lb-head{
    align-items:flex-start;
  }
}

@media (max-width:820px){
  .lb-table-wrap{
    display:none;
  }
  .lb-mobile-cards{
    display:flex;
  }
}

@media (max-width:560px){
  .cm2-wrap{
    width:min(100% - 24px,1180px);
  }
  .lb-hero{
    padding:46px 0 44px;
  }
  .cm2-h1{
    font-size:clamp(2.35rem,13vw,3.7rem);
  }
  .lb-title{
    font-size:clamp(2rem,10vw,2.6rem);
  }
  .cm2-sub{
    font-size:15px;
    line-height:1.65;
  }
  .cm2-section{
    padding:56px 0;
  }
  .lb-btn-primary{
    width:100%;
    justify-content:center;
  }
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
      return <span className="lb-badge lb-badge-white">⬜ White</span>;
    }
    if (winner === 'black') {
      return <span className="lb-badge lb-badge-black">⬛ Black</span>;
    }
    return <span className="lb-badge lb-badge-draw">🤝 Draw</span>;
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
                <h1 className="cm2-h1 lb-title">Leaderboard</h1>
                <p className="cm2-sub lb-sub">
                  Explore recently saved matches, winners, move counts, and replay your favourite games.
                </p>
              </div>
              <Link to="/play" className="cm2-btn cm2-btn-primary">♟ Play New Match</Link>
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
                <Link to="/play" className="cm2-btn cm2-btn-primary">Start Playing</Link>
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