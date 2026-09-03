import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

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
      return <span className="lb-badge-white">⬜ White</span>;
    }
    if (winner === 'black') {
      return <span className="lb-badge-black">⬛ Black</span>;
    }
    return <span className="lb-badge-draw">🤝 Draw</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      <style>{`
        :root {
          --cm-gold: #C9A227;
          --cm-gold-lt: #F0D265;
          --cm-gold-dk: #8F6B18;
          --cm-bg: #080810;
          --cm-bg-2: #13131d;
          --cm-line: rgba(201, 162, 39, 0.2);
          --cm-ink: #f3f4f6;
          --cm-ink-dim: #9ca3af;
          --cm-ink-faint: #6b7280;
        }

        .lb-page {
          background-color: var(--cm-bg);
          background-image: radial-gradient(circle at 50% 20%, rgba(201, 162, 39, 0.12) 0%, rgba(8, 8, 16, 1) 75%);
          background-attachment: fixed;
          color: var(--cm-ink);
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        .lb-wrap {
          max-width: 1200px;
          margin: auto;
          padding: 0 24px 80px;
        }

        .lb-head {
          margin: 0 -24px 40px;
          padding: 60px 40px 35px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
          flex-wrap: wrap;
          border-bottom: 1px solid var(--cm-line);
          background: linear-gradient(135deg, rgba(201, 162, 39, 0.12), rgba(143, 107, 24, 0.05), transparent);
          position: relative;
          overflow: hidden;
          border-radius: 0 0 16px 16px;
        }

        .lb-head::before {
          content: '';
          position: absolute;
          width: 700px;
          height: 700px;
          right: -180px;
          top: -260px;
          background: radial-gradient(circle, rgba(201, 162, 39, 0.15), transparent 70%);
          pointer-events: none;
        }

        .lb-head > * { position: relative; z-index: 2; }

        .lb-kicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--cm-gold-lt);
          display: block;
          margin-bottom: 12px;
        }

        .lb-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(2.4rem, 5vw, 3.4rem);
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 10px;
        }

        .lb-sub {
          max-width: 520px;
          line-height: 1.8;
          color: var(--cm-ink-dim);
          font-size: 15px;
        }

        .lb-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          padding: 13px 24px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(135deg, var(--cm-gold-dk) 0%, var(--cm-gold) 100%);
          transition: all 0.25s ease;
          box-shadow: 0 8px 22px rgba(201, 162, 39, 0.28);
          border: none;
          cursor: pointer;
        }

        .lb-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(201, 162, 39, 0.45);
          color: #ffffff;
        }

        .lb-btn-watch {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          color: var(--cm-gold-lt);
          background: rgba(201, 162, 39, 0.08);
          border: 1px solid var(--cm-line);
          transition: all 0.25s ease;
        }

        .lb-btn-watch:hover {
          background: rgba(201, 162, 39, 0.2);
          border-color: var(--cm-gold);
          color: #ffffff;
          transform: translateY(-1px);
        }

        .lb-empty {
          background: var(--cm-bg-2);
          border: 1px solid var(--cm-line);
          border-radius: 20px;
          padding: 80px 40px;
          text-align: center;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35);
        }

        .lb-empty-icon { font-size: 58px; margin-bottom: 20px; }

        .lb-empty h2 {
          font-family: 'Fraunces', serif;
          font-size: 32px;
          margin-bottom: 12px;
          color: #ffffff;
        }

        .lb-empty p {
          color: var(--cm-ink-dim);
          font-size: 15px;
          line-height: 1.8;
          margin-bottom: 30px;
        }

        .lb-table-wrap {
          background: var(--cm-bg-2);
          border: 1px solid var(--cm-line);
          border-radius: 18px;
          overflow: hidden;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
        }

        .lb-table-wrap table {
          width: 100%;
          border-collapse: collapse;
        }

        .lb-table-wrap thead {
          background: linear-gradient(180deg, rgba(201, 162, 39, 0.15), rgba(201, 162, 39, 0.04));
          border-bottom: 1px solid var(--cm-line);
        }

        .lb-table-wrap th {
          padding: 18px 20px;
          text-align: left;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--cm-gold-lt);
        }

        .lb-table-wrap td {
          padding: 18px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 14px;
          color: var(--cm-ink);
          transition: all 0.25s ease;
        }

        .lb-table-wrap tbody tr:last-child td { border-bottom: none; }
        .lb-table-wrap tbody tr:hover td { background: rgba(201, 162, 39, 0.08); }

        .lb-td-num {
          width: 70px;
          font-weight: 700;
          color: var(--cm-gold);
        }

        .lb-td-player {
          font-weight: 600;
          color: #ffffff;
        }

        .lb-badge-white {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: #ffffff;
          font-size: 12px;
          font-weight: 700;
        }

        .lb-badge-black {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #d1d5db;
          font-size: 12px;
          font-weight: 700;
        }

        .lb-badge-draw {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(201, 162, 39, 0.15);
          border: 1px solid rgba(201, 162, 39, 0.4);
          color: var(--cm-gold-lt);
          font-size: 12px;
          font-weight: 700;
        }

        .lb-mobile-cards {
          display: none;
          flex-direction: column;
          gap: 18px;
        }

        .lb-game-card {
          display: block;
          text-decoration: none;
          color: inherit;
          background: var(--cm-bg-2);
          border: 1px solid var(--cm-line);
          border-radius: 18px;
          padding: 22px;
          transition: all 0.25s ease;
        }

        .lb-game-card:hover {
          border-color: var(--cm-gold);
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(201, 162, 39, 0.15);
        }

        .lb-card-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 18px;
        }

        .lb-match-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--cm-gold-lt);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .lb-card-head h3 {
          font-family: 'Fraunces', serif;
          font-size: 22px;
          color: #ffffff;
        }

        .lb-card-meta {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .lb-meta-item {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(201, 162, 39, 0.15);
          border-radius: 12px;
          padding: 14px;
        }

        .lb-meta-item span {
          display: block;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.10em;
          color: var(--cm-ink-faint);
          margin-bottom: 5px;
        }

        .lb-meta-item strong {
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
        }

        @media(max-width: 768px) {
          .lb-head {
            padding: 45px 24px 30px;
            margin: 0 -24px 30px;
          }
          .lb-title { font-size: 2.4rem; }
          .lb-table-wrap { display: none; }
          .lb-mobile-cards { display: flex; }
        }

        @media(max-width: 540px) {
          .lb-card-meta { grid-template-columns: 1fr; }
          .lb-wrap { padding: 0 18px 60px; }
          .lb-head {
            margin: 0 -18px 25px;
            padding: 40px 18px 25px;
          }
          .lb-title { font-size: 2rem; }
          .lb-btn-primary {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>

      <main className="lb-page">
        <div className="lb-wrap">
          
          {/* ====== HERO ====== */}
          <div className="lb-head">
            <div>
              <span className="lb-kicker">♚ ChessMaster Ranking</span>
              <h1 className="lb-title">Leaderboard</h1>
              <p className="lb-sub">
                Explore recently saved matches, winners, move
                counts, and replay your favourite games.
              </p>
            </div>
            <Link to="/play" className="lb-btn-primary">♟ Play New Match</Link>
          </div>

          {/* ====== EMPTY STATE ====== */}
          {(!games || games.length === 0) && !loading && (
            <div className="lb-empty">
              <div className="lb-empty-icon">🏆</div>
              <h2>No Games Found</h2>
              <p>Play and save your first chess match to appear on the leaderboard.</p>
              <Link to="/play" className="lb-btn-primary">Start Playing</Link>
            </div>
          )}

          {/* ====== CONTENT ====== */}
          {games && games.length > 0 && (
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
      </main>
    </>
  );
};

export default Leaderboard;