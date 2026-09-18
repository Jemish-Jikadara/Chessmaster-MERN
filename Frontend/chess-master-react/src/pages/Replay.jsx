import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Chess } from '../lib/chessjs';
import api from '../api/axios';

const THEMES = {
  classic: ['#f0d9b5', '#b58863'],
  midnight: ['#6b7fa3', '#2c3e6b'],
  forest: ['#ffffdd', '#6faa3f'],
  ocean: ['#d6eaf8', '#2e86c1'],
  ruby: ['#f5cba7', '#b91c1c'],
  walnut: ['#e8d5b0', '#6b4226'],
};

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
  min-height:100vh;
}

.h-page *{ box-sizing:border-box; }

.cm2-wrap{
  width:min(1180px,calc(100% - 40px));
  margin:0 auto;
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
  font-size:clamp(1.5rem,4vw,2.4rem);
  line-height:1.02;
  letter-spacing:0;
  font-weight:900;
}

.cm2-accent{
  color:var(--h-green-2);
}

.cm2-sub{
  max-width:620px;
  margin:14px 0 0;
  color:var(--h-muted);
  font-size:15px;
  line-height:1.7;
}

.cm2-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  min-height:44px;
  padding:0 18px;
  border-radius:8px;
  font-size:14px;
  font-weight:850;
  text-decoration:none;
  border:1px solid transparent;
  transition:transform .18s ease, box-shadow .18s ease, background .18s ease, border-color .18s ease;
  cursor:pointer;
  color:var(--h-text);
  background:rgba(255,255,255,.06);
  border-color:rgba(255,255,255,.12);
}

.cm2-btn:hover:not(:disabled){
  transform:translateY(-1px);
  background:rgba(255,255,255,.1);
  border-color:rgba(129,182,76,.35);
}

.cm2-btn:disabled{
  opacity:0.35;
  cursor:not-allowed;
  transform:none;
}

/* Replay banner */
.replay-banner{
  position:relative;
  padding:72px 0 40px;
  border-bottom:1px solid var(--h-line);
  background:
    linear-gradient(135deg,rgba(129,182,76,0.10) 0%,rgba(129,182,76,0.04) 50%,transparent 100%);
  overflow:hidden;
}

.replay-banner::before{
  content:'';
  position:absolute;
  width:600px;height:600px;
  background:radial-gradient(circle,rgba(129,182,76,0.12) 0%,transparent 70%);
  top:-200px;right:-100px;
  pointer-events:none;
}

.replay-banner-inner{
  max-width:1100px;
  margin:0 auto;
  position:relative;
  z-index:1;
  padding-bottom:28px;
}

.replay-back-link{
  display:inline-flex;
  align-items:center;
  gap:6px;
  color:var(--h-muted);
  font-size:13px;
  text-decoration:none;
  margin-bottom:20px;
  transition:color 0.2s;
  font-weight:800;
}

.replay-back-link:hover{
  color:var(--h-text);
}

.replay-kicker{
  font-size:11px;
  letter-spacing:0.18em;
  text-transform:uppercase;
  color:var(--h-green-2);
  margin-bottom:8px;
  display:block;
  font-weight:800;
}

.replay-page-title{
  font-size:clamp(1.5rem,4vw,2.4rem);
  font-weight:900;
  color:var(--h-text);
  margin:0 0 6px;
  letter-spacing:-0.02em;
}

.replay-page-meta{
  font-size:13px;
  color:var(--h-muted);
}

/* Layout */
.replay-page-wrap{
  max-width:1100px;
  margin:0 auto;
  padding:40px 24px 80px;
}

.replay-game-layout{
  display:grid;
  grid-template-columns:1fr 320px;
  gap:24px;
  margin-top:28px;
}

@media (max-width:900px){
  .replay-game-layout{
    grid-template-columns:1fr;
  }
}

/* Board shell */
.replay-board-shell{
  background:rgba(255,255,255,.045);
  border:1px solid rgba(255,255,255,.09);
  border-radius:12px;
  padding:24px;
  display:flex;
  flex-direction:column;
  gap:14px;
}

.replay-player-strip{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:12px 16px;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.09);
  border-radius:12px;
}

.replay-ps-left{
  display:flex;
  align-items:center;
  gap:12px;
}

.replay-ps-avatar{
  width:36px;height:36px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:16px;
  font-weight:900;
}

.replay-white-av{
  background:var(--h-text);
  color:var(--h-bg);
}

.replay-black-av{
  background:rgba(255,255,255,.06);
  border:1px solid rgba(255,255,255,.12);
  color:var(--h-text);
}

.replay-ps-name{
  font-size:14px;
  font-weight:850;
  color:var(--h-text);
}

.replay-board-status{
  display:flex;
  align-items:center;
  justify-content:space-between;
  font-size:13px;
  padding:0 4px;
}

.replay-status-label{
  color:var(--h-muted);
  font-size:12px;
  text-transform:uppercase;
  letter-spacing:0.08em;
  font-weight:800;
}

.replay-result-badge{
  padding:5px 16px;
  border-radius:20px;
  font-size:12px;
  font-weight:850;
}

.rb-white{
  background:rgba(129,182,76,.12);
  border:1px solid rgba(129,182,76,.25);
  color:var(--h-green-2);
}

.rb-black{
  background:rgba(0,0,0,.35);
  border:1px solid var(--h-line);
  color:var(--h-muted);
}

.rb-draw{
  background:rgba(129,182,76,.12);
  border:1px solid rgba(129,182,76,.3);
  color:var(--h-green-2);
}

.replay-board-wrap{
  display:flex;
  justify-content:center;
  padding:8px 0;
}

#replayBoard{
  display:grid;
  grid-template-columns:repeat(8,1fr);
  width:100%;
  max-width:480px;
  aspect-ratio:1;
  border-radius:10px;
  overflow:hidden;
  border:3px solid rgba(129,182,76,.2);
  box-shadow:0 8px 40px rgba(0,0,0,0.4);
}

#replayBoard > div{
  display:flex;
  align-items:center;
  justify-content:center;
  aspect-ratio:1;
}

#replayBoard img{
  width:78%;
  height:78%;
  object-fit:contain;
  pointer-events:none;
}

/* History panel */
.replay-history-panel{
  background:rgba(255,255,255,.045);
  border:1px solid rgba(255,255,255,.09);
  border-radius:12px;
  padding:24px;
  display:flex;
  flex-direction:column;
  gap:16px;
  max-height:720px;
}

.replay-history-head{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  padding-bottom:14px;
  border-bottom:1px solid var(--h-line);
}

.replay-hh-label{
  font-size:11px;
  color:var(--h-muted);
  text-transform:uppercase;
  letter-spacing:0.12em;
  font-weight:800;
}

.replay-history-head h2{
  font-size:18px;
  font-weight:900;
  color:var(--h-text);
  margin:4px 0 0;
}

.replay-move-count{
  background:rgba(129,182,76,.12);
  border:1px solid rgba(129,182,76,.2);
  color:var(--h-green-2);
  font-size:13px;
  font-weight:850;
  padding:5px 12px;
  border-radius:20px;
}

.replay-review-controls{
  display:flex;
  align-items:center;
  gap:8px;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.09);
  border-radius:12px;
  padding:12px;
}

.replay-review-controls button{
  background:transparent;
  border:1px solid rgba(255,255,255,.09);
  border-radius:8px;
  color:var(--h-muted);
  padding:8px 12px;
  cursor:pointer;
  font-size:14px;
  transition:all 0.2s;
  display:flex;
  align-items:center;
  justify-content:center;
  min-width:36px;
  height:36px;
  font-weight:800;
}

.replay-review-controls button:hover:not(:disabled){
  border-color:rgba(129,182,76,.35);
  color:var(--h-green-2);
  background:rgba(129,182,76,.08);
}

.replay-review-controls button:disabled{
  opacity:0.25;
  cursor:not-allowed;
}

.replay-btn-play{
  background:rgba(129,182,76,.12) !important;
  border-color:rgba(129,182,76,.3) !important;
  color:var(--h-green-2) !important;
  font-weight:900;
  min-width:72px !important;
}

.replay-btn-play:hover:not(:disabled){
  background:rgba(129,182,76,.2) !important;
}

.replay-btn-play.active{
  background:rgba(229,139,66,.12) !important;
  border-color:rgba(229,139,66,.3) !important;
  color:var(--h-orange) !important;
}

.replay-move-list{
  flex:1;
  overflow-y:auto;
  display:flex;
  flex-direction:column;
  gap:6px;
}

.replay-move-list p{
  color:var(--h-muted);
  font-size:13px;
  text-align:center;
  padding:20px;
}

.replay-move-item{
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.09);
  border-radius:10px;
  padding:10px 14px;
  font-size:13px;
  cursor:pointer;
  transition:all 0.15s;
  display:flex;
  align-items:center;
  gap:8px;
  font-weight:700;
}

.replay-move-item:hover{
  border-color:rgba(129,182,76,.35);
  background:rgba(129,182,76,.08);
}

.replay-move-item.active{
  border-color:rgba(129,182,76,.5);
  background:rgba(129,182,76,.12);
}

.replay-move-num{
  color:var(--h-green-2);
  font-weight:900;
  min-width:28px;
}

.replay-move-san{
  color:var(--h-text);
  font-weight:850;
  flex:1;
}

.replay-move-sq{
  color:var(--h-muted);
  font-size:11px;
}

.replay-speed-label{
  font-size:11px;
  color:var(--h-muted);
  text-transform:uppercase;
  letter-spacing:0.08em;
  margin-bottom:6px;
  font-weight:800;
}

.replay-speed-options{
  display:flex;
  gap:6px;
}

.replay-speed-btn{
  flex:1;
  padding:6px;
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.09);
  border-radius:8px;
  color:var(--h-muted);
  font-size:12px;
  cursor:pointer;
  transition:all 0.2s;
  text-align:center;
  font-weight:800;
}

.replay-speed-btn:hover{
  border-color:rgba(129,182,76,.35);
  color:var(--h-text);
}

.replay-speed-btn.active{
  background:rgba(129,182,76,.12);
  border-color:rgba(129,182,76,.3);
  color:var(--h-green-2);
  font-weight:900;
}

@media (max-width:900px){
  .replay-game-layout{
    grid-template-columns:1fr;
  }
  #replayBoard{
    max-width:100%;
  }
  .replay-history-panel{
    max-height:none;
  }
}
`;

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
    return (
      <main className="h-page" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div className="cm2-wrap" style={{ textAlign:'center' }}>
          <p style={{ color:'var(--h-green-2)', fontSize:16 }}>Loading replay...</p>
        </div>
      </main>
    );
  }

  if (error || !game) {
    return (
      <main className="h-page" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div className="cm2-wrap" style={{ textAlign:'center' }}>
          <p style={{ color:'#ff8585', fontSize:16 }}>{error || 'Game not found.'}</p>
          <Link to="/profile" style={{ color:'var(--h-green-2)', fontWeight:800 }}>← Back to Profile</Link>
        </div>
      </main>
    );
  }

  const t = THEMES[game.boardTheme] || THEMES.classic;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

      <main className="h-page" style={{ display:'block', padding:0 }}>
        <div className="replay-banner">
          <div className="replay-banner-inner">
            <Link to="/profile" className="replay-back-link">← Back</Link>
            <span className="replay-kicker">Game Replay</span>
            <h1 className="cm2-h1 replay-page-title">{game.whitePlayer} vs {game.blackPlayer}</h1>
            <p className="cm2-sub" style={{ fontSize:13 }}>
              {game.timeControl} • {game.timeMode} • {new Date(game.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

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
                      const bg = isLast ? (light ? '#fef08a' : '#ca8a04') : (light ? t[0] : t[1]);
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
              <span style={{ textAlign: 'center', fontSize: '12px', color: 'var(--h-muted)', fontFamily: "'JetBrains Mono',monospace", fontWeight:800 }}>
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