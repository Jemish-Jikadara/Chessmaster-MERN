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

.cm2-h1{
  margin:0;
  color:#fff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-size:clamp(1.5rem, 4vw, 2.4rem);
  line-height:1.02;
  letter-spacing:-0.005em;
  font-weight:800;
  text-transform:uppercase;
}

.cm2-sub{
  max-width:620px;
  margin:14px 0 0;
  color:#b8c6dd;
  font-size:15px;
  line-height:1.7;
}

/* =========================================================
   BANNER
   ========================================================= */
.replay-banner{
  position:relative;
  padding:80px 0 44px;
  border-bottom:1px solid rgba(0,229,255,0.14);
  background:
    radial-gradient(700px 400px at 12% 8%, rgba(0,229,255,0.14), transparent 60%),
    radial-gradient(600px 400px at 92% 20%, rgba(255,45,149,0.10), transparent 60%),
    #050510;
  overflow:hidden;
}

.replay-banner::before{
  content:'';
  position:absolute;
  inset:0;
  background-image:
    linear-gradient(rgba(0,229,255,0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0,229,255,0.045) 1px, transparent 1px);
  background-size:52px 52px;
  mask-image:radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 80%);
  -webkit-mask-image:radial-gradient(ellipse 80% 60% at 50% 40%, #000 20%, transparent 80%);
  pointer-events:none;
}

.replay-banner-inner{
  max-width:1240px;
  margin:0 auto;
  position:relative;
  z-index:1;
  padding:0 24px 28px;
}

.replay-back-link{
  display:inline-flex;
  align-items:center;
  gap:8px;
  color:#7d8ba8;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12px;
  letter-spacing:0.16em;
  text-transform:uppercase;
  text-decoration:none;
  margin-bottom:22px;
  transition:color 0.2s ease, text-shadow 0.2s ease;
  font-weight:700;
}

.replay-back-link:hover{
  color:#00e5ff;
  text-shadow:0 0 12px rgba(0,229,255,0.7);
}

.replay-kicker{
  display:inline-flex;
  align-items:center;
  gap:9px;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:11px;
  letter-spacing:0.22em;
  text-transform:uppercase;
  color:#00e5ff;
  margin-bottom:14px;
  font-weight:700;
}

.replay-kicker::before{
  content:'[';
  color:#a8f8ff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-weight:900;
}
.replay-kicker::after{
  content:']';
  color:#a8f8ff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-weight:900;
}

.replay-page-title{
  margin:0 0 10px;
  text-shadow:0 0 26px rgba(0,229,255,0.35);
}

.replay-page-meta{
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12px;
  color:#7d8ba8;
  letter-spacing:0.14em;
  text-transform:uppercase;
}

/* =========================================================
   LAYOUT
   ========================================================= */
.replay-page-wrap{
  max-width:1240px;
  margin:0 auto;
  padding:44px 24px 80px;
}

.replay-game-layout{
  display:grid;
  grid-template-columns:1fr 340px;
  gap:24px;
  margin-top:28px;
}

@media (max-width:900px){
  .replay-game-layout{
    grid-template-columns:1fr;
  }
}

/* =========================================================
   BOARD SHELL
   ========================================================= */
.replay-board-shell{
  position:relative;
  background:
    linear-gradient(180deg, rgba(0,229,255,.06), rgba(139,92,246,.03)),
    #08081a;
  border:1px solid rgba(0,229,255,.32);
  border-radius:8px;
  padding:24px;
  display:flex;
  flex-direction:column;
  gap:16px;
  box-shadow:
    0 0 40px rgba(0,229,255,.18),
    inset 0 0 40px rgba(0,229,255,.04);
}

.replay-player-strip{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:13px 16px;
  background:rgba(0,229,255,.03);
  border:1px solid rgba(0,229,255,.16);
  border-radius:6px;
  transition:border-color .2s ease, background .2s ease;
}

.replay-player-strip:hover{
  border-color:rgba(0,229,255,.35);
  background:rgba(0,229,255,.06);
}

.replay-ps-left{
  display:flex;
  align-items:center;
  gap:14px;
}

.replay-ps-avatar{
  width:38px;
  height:38px;
  border-radius:6px;
  display:flex;
  align-items:center;
  justify-content:center;
  font-size:16px;
  font-weight:800;
  flex-shrink:0;
}

.replay-white-av{
  background:linear-gradient(135deg, #00e5ff, #a8f8ff);
  color:#050510;
  box-shadow:0 0 14px rgba(0,229,255,.55);
}

.replay-black-av{
  background:linear-gradient(135deg, #8b5cf6, #ff2d95);
  color:#fff;
  box-shadow:0 0 14px rgba(139,92,246,.55);
}

.replay-ps-name{
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:13.5px;
  font-weight:700;
  color:#fff;
  letter-spacing:0.06em;
  text-transform:uppercase;
}

.replay-board-status{
  display:flex;
  align-items:center;
  justify-content:space-between;
  font-size:13px;
  padding:0 4px;
}

.replay-status-label{
  color:#7d8ba8;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:10.5px;
  text-transform:uppercase;
  letter-spacing:0.22em;
  font-weight:700;
}

.replay-result-badge{
  padding:6px 16px;
  border-radius:4px;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:11px;
  font-weight:700;
  letter-spacing:0.14em;
  text-transform:uppercase;
}

.rb-white{
  background:rgba(0,229,255,.1);
  border:1px solid rgba(0,229,255,.4);
  color:#a8f8ff;
  box-shadow:inset 0 0 10px rgba(0,229,255,.15);
}

.rb-black{
  background:rgba(139,92,246,.12);
  border:1px solid rgba(139,92,246,.4);
  color:#c4b5fd;
  box-shadow:inset 0 0 10px rgba(139,92,246,.15);
}

.rb-draw{
  background:rgba(182,255,60,.1);
  border:1px solid rgba(182,255,60,.4);
  color:#b6ff3c;
  box-shadow:inset 0 0 10px rgba(182,255,60,.15);
}

.replay-board-wrap{
  display:flex;
  justify-content:center;
  padding:8px 0;
  border-radius:8px;
  background:linear-gradient(135deg, rgba(0,229,255,.4), rgba(255,45,149,.25));
  box-shadow:0 0 30px rgba(0,229,255,.25);
}

#replayBoard{
  display:grid;
  grid-template-columns:repeat(8, 1fr);
  width:100%;
  max-width:480px;
  aspect-ratio:1;
  border-radius:6px;
  overflow:hidden;
  border:2px solid rgba(0,229,255,.5);
  box-shadow:inset 0 0 30px rgba(0,229,255,.2);
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
  filter:
    drop-shadow(0 0 6px rgba(0,229,255,.45))
    drop-shadow(0 2px 3px rgba(0,0,0,.55));
}

/* =========================================================
   HISTORY PANEL
   ========================================================= */
.replay-history-panel{
  background:
    linear-gradient(180deg, rgba(0,229,255,.06), rgba(139,92,246,.03)),
    #08081a;
  border:1px solid rgba(0,229,255,.32);
  border-radius:8px;
  padding:24px;
  display:flex;
  flex-direction:column;
  gap:16px;
  max-height:780px;
  box-shadow:
    0 0 40px rgba(0,229,255,.18),
    inset 0 0 40px rgba(0,229,255,.04);
}

.replay-history-head{
  display:flex;
  align-items:flex-start;
  justify-content:space-between;
  padding-bottom:16px;
  border-bottom:1px solid rgba(0,229,255,.18);
}

.replay-hh-label{
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:10.5px;
  color:#00e5ff;
  text-transform:uppercase;
  letter-spacing:0.22em;
  font-weight:700;
}

.replay-history-head h2{
  font-family:'Orbitron', system-ui, sans-serif;
  font-size:15px;
  font-weight:800;
  color:#fff;
  margin:6px 0 0;
  text-transform:uppercase;
  letter-spacing:0.06em;
}

.replay-move-count{
  background:rgba(0,229,255,.1);
  border:1px solid rgba(0,229,255,.4);
  color:#00e5ff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-size:13px;
  font-weight:800;
  padding:6px 14px;
  border-radius:4px;
  box-shadow:inset 0 0 10px rgba(0,229,255,.15);
}

.replay-review-controls{
  display:flex;
  align-items:center;
  gap:8px;
  background:rgba(0,229,255,.03);
  border:1px solid rgba(0,229,255,.18);
  border-radius:6px;
  padding:12px;
}

.replay-review-controls button{
  background:transparent;
  border:1px solid rgba(0,229,255,.28);
  border-radius:4px;
  color:#00e5ff;
  padding:8px 12px;
  cursor:pointer;
  font-size:14px;
  transition:all 0.2s ease;
  display:flex;
  align-items:center;
  justify-content:center;
  min-width:38px;
  height:38px;
  font-weight:800;
}

.replay-review-controls button:hover:not(:disabled){
  border-color:#00e5ff;
  color:#a8f8ff;
  background:rgba(0,229,255,.14);
  box-shadow:0 0 16px rgba(0,229,255,.5);
}

.replay-review-controls button:disabled{
  opacity:0.25;
  cursor:not-allowed;
}

.replay-btn-play{
  background:linear-gradient(90deg, #00e5ff, #a8f8ff) !important;
  border-color:transparent !important;
  color:#050510 !important;
  font-family:'Chakra Petch', system-ui, sans-serif !important;
  font-size:11px !important;
  font-weight:800 !important;
  letter-spacing:0.14em !important;
  text-transform:uppercase !important;
  min-width:86px !important;
  box-shadow:
    0 0 18px rgba(0,229,255,.5),
    inset 0 0 8px rgba(255,255,255,.4) !important;
}

.replay-btn-play:hover:not(:disabled){
  box-shadow:
    0 0 28px rgba(0,229,255,.8),
    0 0 50px rgba(0,229,255,.4),
    inset 0 0 10px rgba(255,255,255,.5) !important;
  transform:translateY(-1px);
}

.replay-btn-play.active{
  background:linear-gradient(90deg, #ff2d95, #ff6bb0) !important;
  color:#fff !important;
  box-shadow:
    0 0 18px rgba(255,45,149,.55),
    inset 0 0 8px rgba(255,255,255,.3) !important;
}

.replay-move-list{
  flex:1;
  overflow-y:auto;
  display:flex;
  flex-direction:column;
  gap:6px;
  scrollbar-width:thin;
  scrollbar-color:rgba(0,229,255,.3) transparent;
  padding-right:4px;
}

.replay-move-list::-webkit-scrollbar{
  width:6px;
}

.replay-move-list::-webkit-scrollbar-thumb{
  background:rgba(0,229,255,.3);
  border-radius:3px;
}

.replay-move-list p{
  color:#7d8ba8;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12px;
  text-align:center;
  padding:24px 20px;
  letter-spacing:0.14em;
  text-transform:uppercase;
}

.replay-move-item{
  background:rgba(0,229,255,.03);
  border:1px solid rgba(0,229,255,.15);
  border-radius:4px;
  padding:10px 14px;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:12.5px;
  cursor:pointer;
  transition:all 0.15s ease;
  display:flex;
  align-items:center;
  gap:10px;
  font-weight:600;
}

.replay-move-item:hover{
  border-color:rgba(0,229,255,.5);
  background:rgba(0,229,255,.08);
  transform:translateX(2px);
}

.replay-move-item.active{
  border-color:#00e5ff;
  background:rgba(0,229,255,.12);
  box-shadow:
    0 0 16px rgba(0,229,255,.35),
    inset 0 0 10px rgba(0,229,255,.1);
}

.replay-move-num{
  color:#00e5ff;
  font-family:'Orbitron', system-ui, sans-serif;
  font-weight:800;
  min-width:34px;
  text-shadow:0 0 8px rgba(0,229,255,.5);
}

.replay-move-san{
  color:#fff;
  font-weight:700;
  flex:1;
  letter-spacing:0.04em;
}

.replay-move-sq{
  color:#7d8ba8;
  font-size:10.5px;
  letter-spacing:0.08em;
}

.replay-speed-label{
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:10.5px;
  color:#00e5ff;
  text-transform:uppercase;
  letter-spacing:0.22em;
  margin-bottom:8px;
  font-weight:700;
}

.replay-speed-options{
  display:flex;
  gap:8px;
}

.replay-speed-btn{
  flex:1;
  padding:8px;
  background:rgba(0,229,255,.03);
  border:1px solid rgba(0,229,255,.22);
  border-radius:4px;
  color:#b8c6dd;
  font-family:'Chakra Petch', system-ui, sans-serif;
  font-size:11px;
  font-weight:700;
  letter-spacing:0.14em;
  text-transform:uppercase;
  cursor:pointer;
  transition:all 0.2s ease;
  text-align:center;
}

.replay-speed-btn:hover{
  border-color:rgba(0,229,255,.5);
  color:#a8f8ff;
  background:rgba(0,229,255,.08);
}

.replay-speed-btn.active{
  background:rgba(0,229,255,.14);
  border-color:#00e5ff;
  color:#a8f8ff;
  box-shadow:
    inset 0 0 12px rgba(0,229,255,.18),
    0 0 16px rgba(0,229,255,.35);
  text-shadow:0 0 10px rgba(0,229,255,.6);
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

@media (max-width:560px){
  .replay-banner{
    padding:56px 0 32px;
  }
  .replay-page-wrap{
    padding:32px 16px 60px;
  }
  .replay-board-shell,
  .replay-history-panel{
    padding:18px;
  }
  .replay-review-controls button{
    min-width:32px;
    height:32px;
    padding:6px 8px;
    font-size:12px;
  }
  .replay-btn-play{
    min-width:72px !important;
    font-size:10px !important;
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
      <>
        <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
        <main className="h-page" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div className="cm2-wrap" style={{ textAlign:'center' }}>
            <p style={{
              color:'#00e5ff',
              fontFamily:"'Chakra Petch', sans-serif",
              fontSize:'13px',
              letterSpacing:'0.24em',
              textTransform:'uppercase',
              textShadow:'0 0 16px rgba(0,229,255,.6)',
            }}>Loading replay...</p>
          </div>
        </main>
      </>
    );
  }

  if (error || !game) {
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: pageStyles }} />
        <main className="h-page" style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div className="cm2-wrap" style={{ textAlign:'center' }}>
            <p style={{
              color:'#ff6bb0',
              fontFamily:"'Chakra Petch', sans-serif",
              fontSize:'13px',
              letterSpacing:'0.24em',
              textTransform:'uppercase',
              textShadow:'0 0 16px rgba(255,45,149,.6)',
            }}>{error || 'Game not found.'}</p>
            <Link to="/profile" style={{
              color:'#00e5ff',
              fontFamily:"'Chakra Petch', sans-serif",
              fontWeight:700,
              letterSpacing:'0.18em',
              textTransform:'uppercase',
              fontSize:'12px',
            }}>← Back to Profile</Link>
          </div>
        </main>
      </>
    );
  }

  const t = THEMES[game.boardTheme] || THEMES.classic;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pageStyles }} />

      <main className="h-page" style={{ display:'block', padding:0 }}>
        <div className="replay-banner">
          <div className="replay-banner-inner">
            <Link to="/profile" className="replay-back-link">← Back to Profile</Link>
            <span className="replay-kicker">Game Replay</span>
            <h1 className="cm2-h1 replay-page-title">{game.whitePlayer} vs {game.blackPlayer}</h1>
            <p className="cm2-sub replay-page-meta" style={{ fontSize:13 }}>
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
                  <span className="replay-result-badge rb-white">◆ White Won</span>
                ) : game.winner === 'black' ? (
                  <span className="replay-result-badge rb-black">◆ Black Won</span>
                ) : (
                  <span className="replay-result-badge rb-draw">◆ Draw</span>
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
              <span style={{
                textAlign:'center',
                fontSize:'11.5px',
                color:'#00e5ff',
                fontFamily:"'Orbitron', sans-serif",
                fontWeight:800,
                letterSpacing:'0.16em',
                textTransform:'uppercase',
                textShadow:'0 0 10px rgba(0,229,255,.5)',
              }}>
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