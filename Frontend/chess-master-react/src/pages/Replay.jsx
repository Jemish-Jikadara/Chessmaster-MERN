import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Chess } from '../lib/chessjs';
import api from '../api/axios';

const Replay = () => {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playSpeed, setPlaySpeed] = useState(2000);

  const playIntervalRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    api.get(`/api/games/${id}`)
      .then((res) => mounted && setGame(res.data.game))
      .catch(() => mounted && setError('Game not found.'))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id]);

  // Replay verbose moves + FEN at every position, exactly like replay.ejs.
  const { positionHistory, verboseMoves } = useMemo(() => {
    if (!game) return { positionHistory: [], verboseMoves: [] };
    const chess = new Chess();
    const positions = [chess.fen()];
    const moves = [];
    (game.moves || []).forEach((san) => {
      const m = chess.move(san);
      if (m) {
        moves.push(m);
        positions.push(chess.fen());
      }
    });
    return { positionHistory: positions, verboseMoves: moves };
  }, [game]);

  const total = positionHistory.length - 1;

  const board = useMemo(() => {
    if (!positionHistory.length) return null;
    const display = new Chess();
    display.load(positionHistory[currentIndex] || positionHistory[0]);
    return display.board();
  }, [positionHistory, currentIndex]);

  const lastMove = currentIndex > 0 ? verboseMoves[currentIndex - 1] : null;

  const stopPlaying = useCallback(() => {
    setIsPlaying(false);
    if (playIntervalRef.current) {
      clearInterval(playIntervalRef.current);
      playIntervalRef.current = null;
    }
  }, []);

  const goTo = useCallback((index) => {
    setCurrentIndex((prev) => {
      const clamped = Math.max(0, Math.min(total, index));
      if (clamped >= total) stopPlaying();
      return clamped;
    });
  }, [total, stopPlaying]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopPlaying();
      return;
    }
    if (currentIndex >= total) setCurrentIndex(0);
    setIsPlaying(true);
  }, [isPlaying, currentIndex, total, stopPlaying]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    playIntervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= total) {
          stopPlaying();
          return prev;
        }
        return prev + 1;
      });
    }, playSpeed);
    return () => clearInterval(playIntervalRef.current);
  }, [isPlaying, playSpeed, total, stopPlaying]);

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', background: '#0f0f0f' }}>Loading replay...</div>;
  }

  if (error || !game) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center', justifyContent: 'center', color: '#f87171', background: '#0f0f0f' }}>
        <p>{error || 'Game not found.'}</p>
        <Link to="/profile" style={{ color: '#c9a84c' }}>← Back to Profile</Link>
      </div>
    );
  }

  return (
    <>
      <style>{`
        :root {
            --replay-bg: #0f0f0f;
            --replay-bg-2: #161616;
            --replay-bg-3: #1e1e1e;
            --replay-line: rgba(243,234,217,0.08);
            --replay-ink: #f0ece4;
            --replay-ink-dim: #7a7570;
            --replay-ink-faint: #4a4642;
            --replay-brass: #c9a84c;
            --replay-brass-lt: #e8c97a;
            --replay-sage: #7a9569;
            --replay-sage-lt: #a4c191;
        }
        .replay-page-wrap { max-width:1100px; margin:0 auto; padding:40px 24px 80px; background:var(--replay-bg); min-height: 100vh; }
        .replay-banner {
            background: linear-gradient(135deg, rgba(201,162,39,0.10) 0%, rgba(122,149,105,0.07) 50%, transparent 100%);
            border-bottom:1px solid var(--replay-line);
            padding:40px 24px 0;
            position:relative;
            overflow:hidden;
        }
        .replay-banner::before {
            content:''; position:absolute; width:600px; height:600px;
            background: radial-gradient(circle, rgba(201,162,39,0.12) 0%, transparent 70%);
            top:-200px; right:-100px; pointer-events:none;
        }
        .replay-banner-inner { max-width:1100px; margin:0 auto; position:relative; z-index:1; padding-bottom: 28px; }
        .replay-back-link { display:inline-flex; align-items:center; gap:6px; color:var(--replay-ink-dim); font-size:13px; text-decoration:none; margin-bottom:20px; transition:color 0.2s; }
        .replay-back-link:hover { color:var(--replay-ink); }
        .replay-kicker { font-family:'Fraunces',serif; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; color:var(--replay-brass); margin-bottom:8px; display:block; }
        .replay-page-title { font-family:'Fraunces',serif; font-size:clamp(1.5rem,4vw,2.4rem); font-weight:700; color:var(--replay-ink); margin:0 0 6px; letter-spacing:-0.02em; }
        .replay-page-meta { font-size:13px; color:var(--replay-ink-dim); }

        .replay-game-layout { display:grid; grid-template-columns:1fr 320px; gap:24px; margin-top:28px; }
        @media (max-width:900px) { .replay-game-layout { grid-template-columns:1fr; } }

        .replay-board-shell {
            background:var(--replay-bg-2);
            border:1px solid var(--replay-line);
            border-radius:20px;
            padding:24px;
            display:flex;
            flex-direction:column;
            gap:14px;
        }
        .replay-player-strip {
            display:flex; align-items:center; justify-content:space-between;
            padding:12px 16px;
            background:var(--replay-bg-3);
            border-radius:12px;
            border:1px solid var(--replay-line);
        }
        .replay-ps-left { display:flex; align-items:center; gap:12px; }
        .replay-ps-avatar {
            width:36px; height:36px; border-radius:50%;
            display:flex; align-items:center; justify-content:center;
            font-size:16px; font-weight:700;
        }
        .replay-white-av { background:var(--replay-ink); color:var(--replay-bg); }
        .replay-black-av { background:var(--replay-bg-3); border:1px solid var(--replay-line); color:var(--replay-ink); }
        .replay-ps-name { font-size:14px; font-weight:600; color:var(--replay-ink); }

        .replay-board-status {
            display:flex; align-items:center; justify-content:space-between;
            font-size:13px; padding:0 4px;
        }
        .replay-status-label { color:var(--replay-ink-dim); font-size:12px; text-transform:uppercase; letter-spacing:0.08em; }
        .replay-result-badge {
            padding:5px 16px; border-radius:20px;
            font-size:12px; font-family:'Fraunces',serif; font-weight:700;
        }
        .rb-white { background:rgba(201,168,76,0.12); border:1px solid rgba(201,168,76,0.25); color:var(--replay-brass-lt); }
        .rb-black { background:rgba(0,0,0,0.35); border:1px solid var(--replay-line); color:var(--replay-ink-dim); }
        .rb-draw { background:rgba(122,149,105,0.12); border:1px solid rgba(122,149,105,0.25); color:var(--replay-sage-lt); }

        .replay-board-wrap { display:flex; justify-content:center; padding:8px 0; }
        #replayBoard {
            display:grid;
            grid-template-columns:repeat(8,1fr);
            width:100%;
            max-width:480px;
            aspect-ratio:1;
            border-radius:10px;
            overflow:hidden;
            border:3px solid rgba(201,168,76,0.2);
            box-shadow:0 8px 40px rgba(0,0,0,0.4);
        }
        #replayBoard > div { display:flex; align-items:center; justify-content:center; aspect-ratio:1; }
        #replayBoard img { width:78%; height:78%; object-fit:contain; pointer-events:none; }

        .replay-history-panel {
            background:var(--replay-bg-2);
            border:1px solid var(--replay-line);
            border-radius:20px;
            padding:24px;
            display:flex;
            flex-direction:column;
            gap:16px;
            max-height:720px;
        }
        .replay-history-head { display:flex; align-items:flex-start; justify-content:space-between; padding-bottom:14px; border-bottom:1px solid var(--replay-line); }
        .replay-hh-label { font-size:11px; color:var(--replay-ink-faint); text-transform:uppercase; letter-spacing:0.12em; font-family:'Fraunces',serif; }
        .replay-history-head h2 { font-family:'Fraunces',serif; font-size:18px; font-weight:700; color:var(--replay-ink); margin:4px 0 0; }
        .replay-move-count {
            background:rgba(201,168,76,0.12);
            border:1px solid rgba(201,168,76,0.2);
            color:var(--replay-brass-lt);
            font-family:'Fraunces',serif;
            font-size:13px; font-weight:700;
            padding:5px 12px; border-radius:20px;
        }

        .replay-review-controls { display:flex; align-items:center; gap:8px; background:var(--replay-bg-3); border-radius:12px; padding:12px; border:1px solid var(--replay-line); }
        .replay-review-controls button {
            background:transparent; border:1px solid var(--replay-line); border-radius:8px;
            color:var(--replay-ink-dim); padding:8px 12px; cursor:pointer; font-size:14px;
            transition:all 0.2s; display:flex; align-items:center; justify-content:center;
            min-width:36px; height:36px;
        }
        .replay-review-controls button:hover:not(:disabled) { border-color:rgba(201,168,76,0.4); color:var(--replay-brass-lt); background:rgba(201,168,76,0.06); }
        .replay-review-controls button:disabled { opacity:0.25; cursor:not-allowed; }
        .replay-btn-play { background:rgba(201,168,76,0.12) !important; border-color:rgba(201,168,76,0.3) !important; color:var(--replay-brass-lt) !important; font-weight:600; min-width:64px !important; }
        .replay-btn-play:hover:not(:disabled) { background:rgba(201,168,76,0.2) !important; }
        .replay-btn-play.active { background:rgba(181,84,31,0.12) !important; border-color:rgba(181,84,31,0.3) !important; color:#e08a5b !important; }

        .replay-move-list { flex:1; overflow-y:auto; display:flex; flex-direction:column; gap:6px; }
        .replay-move-list p { color:var(--replay-ink-faint); font-size:13px; text-align:center; padding:20px; }
        .replay-move-item {
            background:var(--replay-bg-3); border:1px solid var(--replay-line); border-radius:10px;
            padding:10px 14px; font-size:13px; cursor:pointer; transition:all 0.15s;
            display:flex; align-items:center; gap:8px;
        }
        .replay-move-item:hover { border-color:rgba(201,168,76,0.3); background:rgba(201,168,76,0.05); }
        .replay-move-item.active { border-color:rgba(201,168,76,0.5); background:rgba(201,168,76,0.1); }
        .replay-move-num { color:var(--replay-brass-lt); font-weight:700; font-family:'JetBrains Mono',monospace; min-width:28px; }
        .replay-move-san { color:var(--replay-ink); font-weight:500; flex:1; }
        .replay-move-sq { color:var(--replay-ink-faint); font-size:11px; font-family:'JetBrains Mono',monospace; }

        .replay-speed-label { font-size:11px; color:var(--replay-ink-faint); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:6px; }
        .replay-speed-options { display:flex; gap:6px; }
        .replay-speed-btn { flex:1; padding:6px; background:var(--replay-bg-3); border:1px solid var(--replay-line); border-radius:8px; color:var(--replay-ink-dim); font-size:12px; cursor:pointer; transition:all 0.2s; text-align:center; }
        .replay-speed-btn:hover { border-color:rgba(201,168,76,0.3); color:var(--replay-ink); }
        .replay-speed-btn.active { background:rgba(201,168,76,0.12); border-color:rgba(201,168,76,0.3); color:var(--replay-brass-lt); font-weight:600; }

        @media (max-width:900px) {
            .replay-game-layout { grid-template-columns:1fr; }
            #replayBoard { max-width:100%; }
            .replay-history-panel { max-height:none; }
        }
      `}</style>

      <div className="replay-banner">
        <div className="replay-banner-inner">
          <Link to="/profile" className="replay-back-link">← Back</Link>
          <span className="replay-kicker">Game Replay</span>
          <h1 className="replay-page-title">{game.whitePlayer} vs {game.blackPlayer}</h1>
          <p className="replay-page-meta">{game.timeControl} &bull; {game.timeMode} &bull; {new Date(game.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <main>
        <div className="replay-page-wrap">
          <div className="replay-game-layout">

            {/* BOARD SECTION */}
            <section className="replay-board-shell">
              <div className="replay-player-strip">
                <div className="replay-ps-left">
                  <div className="replay-ps-avatar replay-black-av">♚</div>
                  <div><div className="replay-ps-name">{game.blackPlayer}</div></div>
                </div>
              </div>

              <div className="replay-board-status">
                <span className="replay-status-label">Result</span>
                {game.winner === 'white' ? (
                  <span className="replay-result-badge rb-white">⬜ White Won</span>
                ) : game.winner === 'black' ? (
                  <span className="replay-result-badge rb-black">⬛ Black Won</span>
                ) : (
                  <span className="replay-result-badge rb-draw">Draw</span>
                )}
              </div>

              <div className="replay-board-wrap">
                <div id="replayBoard">
                  {board && board.flatMap((rowArr, row) =>
                    rowArr.map((piece, col) => {
                      const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
                      const sq = `${files[col]}${8 - row}`;
                      const light = (row + col) % 2 === 0;
                      const isLast = lastMove && (lastMove.from === sq || lastMove.to === sq);
                      const bg = isLast ? (light ? '#fef08a' : '#ca8a04') : (light ? '#f0d9b5' : '#b58863');
                      return (
                        <div key={sq} style={{ backgroundColor: bg }}>
                          {piece && (
                            <img
                              src={`/images/pieces/${piece.color === 'w' ? 'white' : 'black'}-${{ p: 'pawn', r: 'rook', n: 'knight', b: 'bishop', q: 'queen', k: 'king' }[piece.type]}.png`}
                              draggable={false}
                              alt=""
                            />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="replay-player-strip">
                <div className="replay-ps-left">
                  <div className="replay-ps-avatar replay-white-av">♔</div>
                  <div><div className="replay-ps-name">{game.whitePlayer}</div></div>
                </div>
              </div>
            </section>

            {/* HISTORY PANEL */}
            <aside className="replay-history-panel">
              <div className="replay-history-head">
                <div>
                  <div className="replay-hh-label">Match Log</div>
                  <h2>Move History</h2>
                </div>
                <span className="replay-move-count">{game.totalMoves}</span>
              </div>

              <div className="replay-review-controls">
                <button type="button" title="First" disabled={currentIndex === 0} onClick={() => goTo(0)}>⟪</button>
                <button type="button" title="Previous" disabled={currentIndex === 0} onClick={() => { stopPlaying(); goTo(currentIndex - 1); }}>←</button>
                <button type="button" className={`replay-btn-play ${isPlaying ? 'active' : ''}`} title="Play/Pause" onClick={togglePlay}>
                  {isPlaying ? '⏸ Pause' : '▶ Play'}
                </button>
                <button type="button" title="Next" disabled={currentIndex >= total} onClick={() => { stopPlaying(); goTo(currentIndex + 1); }}>→</button>
                <button type="button" title="Last" disabled={currentIndex >= total} onClick={() => { stopPlaying(); goTo(total); }}>⟫</button>
              </div>
              <span style={{ textAlign: 'center', fontSize: '12px', color: 'var(--replay-ink-faint)', fontFamily: "'JetBrains Mono',monospace" }}>
                Move {currentIndex} / {total}
              </span>

              <div>
                <div className="replay-speed-label">Playback Speed</div>
                <div className="replay-speed-options">
                  {[1000, 2000, 3000].map((speed) => (
                    <button
                      key={speed}
                      type="button"
                      className={`replay-speed-btn ${playSpeed === speed ? 'active' : ''}`}
                      onClick={() => setPlaySpeed(speed)}
                    >
                      {speed / 1000}s
                    </button>
                  ))}
                </div>
              </div>

              <div className="replay-move-list">
                {verboseMoves.length === 0 ? (
                  <p>No moves recorded.</p>
                ) : (
                  verboseMoves.map((move, i) => (
                    <div
                      key={i}
                      className={`replay-move-item ${currentIndex === i + 1 ? 'active' : ''}`}
                      onClick={() => { stopPlaying(); goTo(i + 1); }}
                    >
                      <span className="replay-move-num">{Math.floor(i / 2) + 1}{move.color === 'w' ? '.' : '...'}</span>
                      <span className="replay-move-san">{move.san}</span>
                      <span className="replay-move-sq">{move.from}→{move.to}</span>
                    </div>
                  ))
                )}
              </div>
            </aside>

          </div>
        </div>
      </main>
    </>
  );
};

export default Replay;
