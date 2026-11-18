import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChessBoard from '../components/ChessBoard';
import useOnlineGame from '../hooks/useOnlineGame';

const OnlinePlay = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const online = useOnlineGame({ user });

  const [showResignOverlay, setShowResignOverlay] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  useEffect(() => {
    if (online.invalid) {
      navigate('/online');
    }
  }, [online.invalid, navigate]);

  useEffect(() => {
    setShowGameOver(online.gameOver);
  }, [online.gameOver]);

  const handleResign = () => setShowResignOverlay(true);
  const confirmResign = () => {
    setShowResignOverlay(false);
    online.resign();
  };
  const handleDrawOffer = () => online.offerDraw();
  const handleAcceptDraw = () => online.acceptDraw();
  const handleDeclineDraw = () => online.declineDraw();
  const handleAbort = () => online.abort();
  const handleChat = () => alert('Live chat coming soon!');
  const handleCloseGameOver = () => setShowGameOver(false);

  if (online.invalid) return null;

  const isMyTurn = online.turn === online.playerColor;
  const myTime = online.playerColor === 'w' ? online.whiteTime : online.blackTime;
  const oppTime = online.playerColor === 'w' ? online.blackTime : online.whiteTime;

  const historyPairs = [];
  for (let i = 0; i < online.history.length; i += 2) {
    historyPairs.push({
      num: i / 2 + 1,
      white: online.history[i]?.san,
      black: online.history[i + 1]?.san,
    });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Orbitron:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

        .og-page {
          position:relative;
          background:#050510;
          min-height:100vh;
          display:flex;
          flex-direction:column;
          font-family:'Inter', system-ui, sans-serif;
          color:#e8f4ff;
          overflow-x:hidden;
        }

        /* Animated grid backdrop */
        .og-page::before{
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
          animation:og-grid 24s linear infinite;
        }

        .og-page::after{
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

        @keyframes og-grid{
          0%{ background-position:0 0, 0 0; }
          100%{ background-position:52px 52px, 52px 52px; }
        }

        .og-page > *{ position:relative; z-index:1; }

        .og-layout {
          flex:1;
          display:grid;
          grid-template-columns:minmax(0, 600px) 320px;
          gap:20px;
          max-width:960px;
          margin:0 auto;
          padding:24px 16px 40px;
          align-items:start;
          width:100%;
        }

        .og-board-panel {
          display:flex;
          flex-direction:column;
          gap:10px;
          position:relative;
        }

        /* =========================================================
           PLAYER STRIPS
           ========================================================= */
        .og-player-strip {
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:12px 16px;
          background:rgba(0,229,255,.03);
          border:1px solid rgba(0,229,255,.16);
          border-radius:6px;
          transition:border-color .2s ease, background .2s ease, box-shadow .2s ease;
        }

        .og-player-strip.active-turn {
          border-color:rgba(0,229,255,.6);
          background:rgba(0,229,255,.08);
          box-shadow:
            inset 0 0 14px rgba(0,229,255,.18),
            0 0 22px rgba(0,229,255,.28);
        }

        .og-player-left {
          display:flex;
          align-items:center;
          gap:12px;
        }

        .og-avatar {
          width:38px;
          height:38px;
          border-radius:6px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-family:'Orbitron', sans-serif;
          font-weight:800;
          font-size:15px;
          flex-shrink:0;
        }

        .og-avatar.white-av {
          background:linear-gradient(135deg, #00e5ff, #a8f8ff);
          color:#050510;
          box-shadow:0 0 14px rgba(0,229,255,.55);
        }

        .og-avatar.black-av {
          background:linear-gradient(135deg, #8b5cf6, #ff2d95);
          color:#fff;
          box-shadow:0 0 14px rgba(139,92,246,.55);
        }

        .og-player-name {
          font-family:'Chakra Petch', system-ui, sans-serif;
          font-size:13.5px;
          font-weight:700;
          color:#fff;
          line-height:1.2;
          letter-spacing:0.06em;
          text-transform:uppercase;
        }

        .og-player-rating {
          font-family:'Chakra Petch', system-ui, sans-serif;
          font-size:11px;
          color:#7d8ba8;
          margin-top:3px;
          letter-spacing:0.1em;
          text-transform:uppercase;
        }

        .og-disconnect-msg {
          font-family:'Chakra Petch', system-ui, sans-serif;
          font-size:10.5px;
          color:#ff6bb0;
          margin-top:3px;
          letter-spacing:0.12em;
          text-transform:uppercase;
          text-shadow:0 0 10px rgba(255,45,149,.6);
        }

        .og-player-clock {
          font-family:'Orbitron', system-ui, sans-serif;
          font-size:23px;
          font-weight:800;
          font-variant-numeric:tabular-nums;
          color:#fff;
          min-width:80px;
          text-align:right;
          letter-spacing:0.02em;
          text-shadow:0 0 14px rgba(0,229,255,.4);
        }

        .og-player-strip.active-turn .og-player-clock {
          color:#00e5ff;
          text-shadow:0 0 16px rgba(0,229,255,.7);
        }

        .og-player-strip.low-time .og-player-clock {
          color:#ff6bb0 !important;
          text-shadow:0 0 16px rgba(255,45,149,.8);
        }

        /* =========================================================
           BOARD
           ========================================================= */
        .og-board-wrap {
          width:100%;
          border-radius:8px;
          padding:2px;
          background:linear-gradient(135deg, rgba(0,229,255,.5), rgba(255,45,149,.35));
          box-shadow:0 0 40px rgba(0,229,255,.28);
        }

        /* =========================================================
           STATUS BAR
           ========================================================= */
        .og-status-bar {
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:6px 4px;
        }

        .og-turn-label {
          font-family:'Chakra Petch', system-ui, sans-serif;
          font-size:11.5px;
          color:#7d8ba8;
          letter-spacing:0.12em;
          text-transform:uppercase;
        }

        .og-status-badge {
          font-family:'Chakra Petch', system-ui, sans-serif;
          font-size:10.5px;
          font-weight:700;
          padding:5px 14px;
          border-radius:4px;
          letter-spacing:0.14em;
          text-transform:uppercase;
        }

        .og-status-badge.active {
          background:rgba(0,229,255,.1);
          color:#00e5ff;
          border:1px solid rgba(0,229,255,.4);
          box-shadow:inset 0 0 10px rgba(0,229,255,.15);
        }

        .og-status-badge.check {
          background:rgba(255,45,149,.1);
          color:#ff6bb0;
          border:1px solid rgba(255,45,149,.4);
          box-shadow:inset 0 0 10px rgba(255,45,149,.15);
        }

        .og-status-badge.over {
          background:rgba(139,92,246,.12);
          color:#c4b5fd;
          border:1px solid rgba(139,92,246,.4);
          box-shadow:inset 0 0 10px rgba(139,92,246,.15);
        }

        /* =========================================================
           SIDE PANEL
           ========================================================= */
        .og-side-panel {
          display:flex;
          flex-direction:column;
          gap:14px;
        }

        .og-side-card {
          position:relative;
          background:
            linear-gradient(180deg, rgba(0,229,255,.06), rgba(139,92,246,.03)),
            #08081a;
          border:1px solid rgba(0,229,255,.28);
          border-radius:8px;
          padding:18px;
          box-shadow:
            0 0 28px rgba(0,229,255,.12),
            inset 0 0 28px rgba(0,229,255,.03);
        }

        .og-side-card-label {
          font-family:'Chakra Petch', system-ui, sans-serif;
          font-size:10.5px;
          color:#00e5ff;
          text-transform:uppercase;
          letter-spacing:0.22em;
          margin-bottom:12px;
          font-weight:700;
          text-shadow:0 0 10px rgba(0,229,255,.5);
        }

        /* =========================================================
           ACTION BUTTONS
           ========================================================= */
        .og-actions {
          display:flex;
          flex-direction:column;
          gap:10px;
        }

        .og-btn {
          width:100%;
          min-height:44px;
          border-radius:4px;
          font-family:'Chakra Petch', system-ui, sans-serif;
          font-size:12px;
          font-weight:700;
          letter-spacing:0.14em;
          text-transform:uppercase;
          cursor:pointer;
          border:1px solid transparent;
          transition:all .2s ease;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
        }

        .og-btn-resign {
          background:rgba(255,45,149,.06);
          border-color:rgba(255,45,149,.35);
          color:#ff6bb0;
          box-shadow:inset 0 0 10px rgba(255,45,149,.08);
        }

        .og-btn-resign:hover:not(:disabled) {
          background:rgba(255,45,149,.14);
          border-color:rgba(255,45,149,.7);
          color:#ff9ecb;
          box-shadow:
            inset 0 0 16px rgba(255,45,149,.15),
            0 0 18px rgba(255,45,149,.4);
        }

        .og-btn-draw {
          background:rgba(0,229,255,.05);
          border-color:rgba(0,229,255,.3);
          color:#00e5ff;
          box-shadow:inset 0 0 10px rgba(0,229,255,.08);
        }

        .og-btn-draw:hover:not(:disabled) {
          background:rgba(0,229,255,.14);
          border-color:#00e5ff;
          color:#a8f8ff;
          box-shadow:
            inset 0 0 16px rgba(0,229,255,.18),
            0 0 18px rgba(0,229,255,.4);
        }

        .og-btn-draw:disabled {
          opacity:0.35;
          cursor:not-allowed;
        }

        .og-btn-abort {
          background:rgba(139,92,246,.06);
          border-color:rgba(139,92,246,.35);
          color:#c4b5fd;
          box-shadow:inset 0 0 10px rgba(139,92,246,.08);
        }

        .og-btn-abort:hover:not(:disabled) {
          background:rgba(139,92,246,.14);
          border-color:rgba(139,92,246,.7);
          color:#ddd6fe;
          box-shadow:
            inset 0 0 16px rgba(139,92,246,.15),
            0 0 18px rgba(139,92,246,.4);
        }

        .og-btn-chat {
          background:rgba(182,255,60,.05);
          border-color:rgba(182,255,60,.35);
          color:#b6ff3c;
          box-shadow:inset 0 0 10px rgba(182,255,60,.08);
        }

        .og-btn-chat:hover:not(:disabled) {
          background:rgba(182,255,60,.14);
          border-color:rgba(182,255,60,.7);
          color:#d4ff85;
          box-shadow:
            inset 0 0 16px rgba(182,255,60,.15),
            0 0 18px rgba(182,255,60,.4);
        }

        /* =========================================================
           MOVE HISTORY
           ========================================================= */
        .og-moves-label {
          font-family:'Chakra Petch', system-ui, sans-serif;
          font-size:10.5px;
          color:#00e5ff;
          text-transform:uppercase;
          letter-spacing:0.22em;
          margin-bottom:10px;
          font-weight:700;
          text-shadow:0 0 10px rgba(0,229,255,.5);
        }

        .og-move-list {
          display:flex;
          flex-direction:column;
          gap:6px;
          max-height:340px;
          overflow-y:auto;
          scrollbar-width:thin;
          scrollbar-color:rgba(0,229,255,.3) transparent;
          padding-right:4px;
        }

        .og-move-list::-webkit-scrollbar {
          width:6px;
        }
        .og-move-list::-webkit-scrollbar-thumb {
          background:rgba(0,229,255,.3);
          border-radius:3px;
        }

        .og-move-item {
          background:rgba(0,229,255,.03);
          border:1px solid rgba(0,229,255,.15);
          border-radius:4px;
          padding:9px 12px;
          font-family:'Chakra Petch', system-ui, sans-serif;
          font-size:12.5px;
          color:#b8c6dd;
          letter-spacing:0.04em;
        }

        .og-move-item strong {
          color:#00e5ff;
          margin-right:6px;
          font-family:'Orbitron', sans-serif;
          font-weight:800;
          text-shadow:0 0 8px rgba(0,229,255,.5);
        }

        .og-move-item span {
          color:#7d8ba8;
          font-size:11px;
          margin-left:6px;
        }

        /* =========================================================
           DRAW OFFER BANNER
           ========================================================= */
        .og-draw-banner {
          background:rgba(0,229,255,.08);
          border:1px solid rgba(0,229,255,.4);
          border-radius:6px;
          padding:16px;
          text-align:center;
          box-shadow:
            inset 0 0 16px rgba(0,229,255,.12),
            0 0 24px rgba(0,229,255,.25);
        }

        .og-draw-banner p {
          font-family:'Chakra Petch', system-ui, sans-serif;
          font-size:12.5px;
          color:#a8f8ff;
          margin-bottom:14px;
          letter-spacing:0.12em;
          text-transform:uppercase;
        }

        .og-draw-banner-btns {
          display:flex;
          gap:10px;
        }

        .og-draw-accept {
          flex:1;
          min-height:40px;
          border-radius:4px;
          border:none;
          background:linear-gradient(90deg, #00e5ff, #a8f8ff);
          color:#050510;
          font-family:'Chakra Petch', sans-serif;
          font-weight:700;
          font-size:11.5px;
          letter-spacing:0.16em;
          text-transform:uppercase;
          cursor:pointer;
          box-shadow:
            0 0 18px rgba(0,229,255,.5),
            inset 0 0 8px rgba(255,255,255,.4);
          transition:all .2s ease;
        }

        .og-draw-accept:hover {
          box-shadow:
            0 0 26px rgba(0,229,255,.8),
            inset 0 0 10px rgba(255,255,255,.5);
        }

        .og-draw-decline {
          flex:1;
          min-height:40px;
          border-radius:4px;
          border:1px solid rgba(0,229,255,.3);
          background:transparent;
          color:#7d8ba8;
          font-family:'Chakra Petch', sans-serif;
          font-weight:700;
          font-size:11.5px;
          letter-spacing:0.16em;
          text-transform:uppercase;
          cursor:pointer;
          transition:all .2s ease;
        }

        .og-draw-decline:hover {
          border-color:rgba(0,229,255,.6);
          color:#a8f8ff;
          background:rgba(0,229,255,.08);
        }

        /* =========================================================
           RESIGN CONFIRM OVERLAY
           ========================================================= */
        .og-confirm-overlay {
          position:fixed;
          inset:0;
          background:rgba(5,5,16,0.88);
          backdrop-filter:blur(8px);
          -webkit-backdrop-filter:blur(8px);
          z-index:100;
          display:grid;
          place-items:center;
        }

        .og-confirm-card {
          position:relative;
          background:
            linear-gradient(180deg, rgba(255,45,149,.08), rgba(139,92,246,.04)),
            #08081a;
          border:1px solid rgba(255,45,149,.4);
          border-radius:8px;
          padding:36px 30px;
          text-align:center;
          width:min(90%, 360px);
          box-shadow:
            0 0 60px rgba(255,45,149,.28),
            0 0 100px rgba(139,92,246,.15);
        }

        .og-confirm-card::before,
        .og-confirm-card::after {
          content:'';
          position:absolute;
          width:20px;
          height:20px;
          border:2px solid #ff2d95;
          filter:drop-shadow(0 0 8px rgba(255,45,149,.8));
          pointer-events:none;
        }
        .og-confirm-card::before { top:-2px; left:-2px; border-right:0; border-bottom:0; }
        .og-confirm-card::after { bottom:-2px; right:-2px; border-left:0; border-top:0; }

        .og-confirm-card h3 {
          font-family:'Orbitron', sans-serif;
          font-size:20px;
          font-weight:800;
          color:#fff;
          margin:0 0 12px;
          text-transform:uppercase;
          letter-spacing:0.04em;
        }

        .og-confirm-card p {
          font-family:'Chakra Petch', sans-serif;
          font-size:12.5px;
          color:#b8c6dd;
          margin-bottom:26px;
          line-height:1.6;
          letter-spacing:0.06em;
        }

        .og-confirm-btns {
          display:flex;
          gap:10px;
        }

        .og-confirm-yes {
          flex:1;
          min-height:46px;
          border-radius:4px;
          border:none;
          background:linear-gradient(90deg, #ff2d95, #ff6bb0);
          color:#fff;
          font-family:'Chakra Petch', sans-serif;
          font-weight:800;
          font-size:12px;
          letter-spacing:0.16em;
          text-transform:uppercase;
          cursor:pointer;
          box-shadow:
            0 0 20px rgba(255,45,149,.5),
            inset 0 0 8px rgba(255,255,255,.3);
          transition:all .2s ease;
        }

        .og-confirm-yes:hover {
          box-shadow:
            0 0 30px rgba(255,45,149,.8),
            inset 0 0 10px rgba(255,255,255,.4);
        }

        .og-confirm-no {
          flex:1;
          min-height:46px;
          border-radius:4px;
          border:1px solid rgba(0,229,255,.3);
          background:transparent;
          color:#7d8ba8;
          font-family:'Chakra Petch', sans-serif;
          font-weight:700;
          font-size:12px;
          letter-spacing:0.16em;
          text-transform:uppercase;
          cursor:pointer;
          transition:all .2s ease;
        }

        .og-confirm-no:hover {
          border-color:rgba(0,229,255,.6);
          color:#a8f8ff;
          background:rgba(0,229,255,.08);
        }

        /* =========================================================
           GAME OVER OVERLAY
           ========================================================= */
        .og-gameover-overlay {
          position:fixed;
          inset:0;
          background:rgba(5,5,16,0.9);
          backdrop-filter:blur(10px);
          -webkit-backdrop-filter:blur(10px);
          z-index:90;
          display:grid;
          place-items:center;
        }

        .og-gameover-card {
          position:relative;
          background:
            linear-gradient(180deg, rgba(0,229,255,.08), rgba(139,92,246,.04)),
            #08081a;
          border:1px solid rgba(0,229,255,.4);
          border-radius:8px;
          padding:40px 34px;
          text-align:center;
          width:min(90%, 380px);
          box-shadow:
            0 0 70px rgba(0,229,255,.28),
            0 0 120px rgba(255,45,149,.15);
        }

        .og-gameover-card::before,
        .og-gameover-card::after {
          content:'';
          position:absolute;
          width:24px;
          height:24px;
          border:2px solid #00e5ff;
          filter:drop-shadow(0 0 10px rgba(0,229,255,.9));
          pointer-events:none;
        }
        .og-gameover-card::before { top:-2px; left:-2px; border-right:0; border-bottom:0; }
        .og-gameover-card::after { bottom:-2px; right:-2px; border-left:0; border-top:0; }

        .og-gameover-kicker {
          display:inline-flex;
          align-items:center;
          gap:9px;
          font-family:'Chakra Petch', sans-serif;
          font-size:11px;
          letter-spacing:0.24em;
          text-transform:uppercase;
          color:#00e5ff;
          font-weight:700;
          margin-bottom:16px;
        }

        .og-gameover-kicker::before{
          content:'[';
          color:#a8f8ff;
          font-family:'Orbitron', sans-serif;
          font-weight:900;
        }
        .og-gameover-kicker::after{
          content:']';
          color:#a8f8ff;
          font-family:'Orbitron', sans-serif;
          font-weight:900;
        }

        .og-gameover-card h2 {
          font-family:'Orbitron', sans-serif;
          font-size:26px;
          font-weight:800;
          color:#fff;
          margin:0 0 12px;
          text-transform:uppercase;
          letter-spacing:0.02em;
          text-shadow:0 0 26px rgba(0,229,255,.4);
        }

        .og-gameover-card p {
          font-family:'Chakra Petch', sans-serif;
          font-size:12.5px;
          color:#b8c6dd;
          margin-bottom:30px;
          line-height:1.7;
          letter-spacing:0.06em;
        }

        .og-gameover-btns {
          display:flex;
          flex-direction:column;
          gap:12px;
        }

        .og-gameover-btn {
          min-height:48px;
          border-radius:4px;
          font-family:'Chakra Petch', sans-serif;
          font-size:12px;
          font-weight:800;
          letter-spacing:0.16em;
          text-transform:uppercase;
          cursor:pointer;
          border:1px solid transparent;
          transition:all .2s ease;
          display:flex;
          align-items:center;
          justify-content:center;
          text-decoration:none;
        }

        .og-gameover-btn.primary {
          background:linear-gradient(90deg, #00e5ff, #a8f8ff);
          color:#050510;
          box-shadow:
            0 0 22px rgba(0,229,255,.55),
            inset 0 0 10px rgba(255,255,255,.4);
        }

        .og-gameover-btn.primary:hover {
          box-shadow:
            0 0 32px rgba(0,229,255,.85),
            0 0 60px rgba(0,229,255,.4),
            inset 0 0 12px rgba(255,255,255,.5);
          transform:translateY(-2px);
        }

        .og-gameover-btn.secondary {
          background:rgba(0,229,255,.04);
          border:1px solid rgba(0,229,255,.3);
          color:#00e5ff;
          box-shadow:inset 0 0 10px rgba(0,229,255,.08);
        }

        .og-gameover-btn.secondary:hover {
          border-color:#00e5ff;
          color:#a8f8ff;
          background:rgba(0,229,255,.12);
          box-shadow:
            inset 0 0 16px rgba(0,229,255,.18),
            0 0 20px rgba(0,229,255,.4);
        }

        /* =========================================================
           RESPONSIVE
           ========================================================= */
        @media (max-width:760px) {
          .og-layout {
            grid-template-columns:1fr;
            padding:16px 12px 32px;
          }
          .og-player-clock {
            font-size:20px;
            min-width:70px;
          }
          .og-gameover-card,
          .og-confirm-card {
            padding:32px 22px;
          }
          .og-gameover-card h2 {
            font-size:22px;
          }
        }

        @media (max-width:420px) {
          .og-player-strip {
            padding:10px 12px;
          }
          .og-avatar {
            width:34px;
            height:34px;
            font-size:13px;
          }
          .og-player-name {
            font-size:12px;
          }
          .og-player-clock {
            font-size:18px;
            min-width:60px;
          }
        }
      `}</style>

      <div className="og-page">
        <main>
          <div className="og-layout">

            {/* LEFT: BOARD PANEL */}
            <div className="og-board-panel">

              {/* Opponent strip (top) */}
              <div className={`og-player-strip ${!isMyTurn && !online.gameOver ? 'active-turn' : ''}`} id="ogOpponentStrip">
                <div className="og-player-left">
                  <div className="og-avatar black-av" id="ogOpponentAvatar">
                    {online.opponent?.username?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                  <div className="og-player-info">
                    <div className="og-player-name" id="ogOpponentName">
                      {online.opponent?.username || 'Opponent'}
                    </div>
                    <div className="og-player-rating" id="ogOpponentRating">
                      {online.disconnectMessage || (online.timeControl?.label || '')}
                    </div>
                  </div>
                </div>
                <div className="og-player-clock" id="ogOpponentClock">{online.formatTime(oppTime)}</div>
              </div>

              {/* Status bar */}
              <div className="og-status-bar">
                <span className="og-turn-label" id="ogTurnLabel">{online.turn === 'w' ? 'White to move' : 'Black to move'}</span>
                <span className={`og-status-badge ${online.status.type}`} id="ogStatusBadge">{online.status.text}</span>
              </div>

              {/* Board */}
              <div className="og-board-wrap">
                <ChessBoard
                  board={online.board}
                  orientation={online.playerColor || 'w'}
                  selectedSquare={online.selectedSquare}
                  legalMoves={online.legalMoves}
                  lastMove={online.lastMove}
                  theme={user?.boardTheme || 'classic'}
                  disabled={online.gameOver || online.turn !== online.playerColor}
                  onSquareClick={online.handleSquareClick}
                  onDragStart={online.handleDragStart}
                  onDrop={online.handleDrop}
                />
              </div>

              {/* My strip (bottom) */}
              <div className={`og-player-strip ${isMyTurn && !online.gameOver ? 'active-turn' : ''} ${myTime <= 10 && myTime > 0 ? 'low-time' : ''}`} id="ogMyStrip">
                <div className="og-player-left">
                  <div className="og-avatar white-av" id="ogMyAvatar">
                    {user?.username?.charAt(0)?.toUpperCase() || 'Y'}
                  </div>
                  <div className="og-player-info">
                    <div className="og-player-name" id="ogMyName">{user?.username || 'You'}</div>
                    <div className="og-player-rating" id="ogMyRating">
                      {user?.rapidRating || user?.blitzRating || user?.bulletRating || 1200}
                    </div>
                  </div>
                </div>
                <div className="og-player-clock" id="ogMyClock">{online.formatTime(myTime)}</div>
              </div>

            </div>

            {/* RIGHT: SIDE PANEL */}
            <div className="og-side-panel">

              {/* Draw offer banner */}
              {online.drawOffered && (
                <div className="og-draw-banner" id="ogDrawBanner">
                  <p>Opponent offered a draw!</p>
                  <div className="og-draw-banner-btns">
                    <button className="og-draw-accept" id="ogDrawAcceptBtn" onClick={handleAcceptDraw}>Accept</button>
                    <button className="og-draw-decline" id="ogDrawDeclineBtn" onClick={handleDeclineDraw}>Decline</button>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="og-side-card">
                <div className="og-side-card-label">Actions</div>
                <div className="og-actions">
                  <button className="og-btn og-btn-resign" id="ogResignBtn" onClick={handleResign} disabled={online.gameOver}>◆ Resign</button>
                  <button className="og-btn og-btn-draw" id="ogDrawBtn" onClick={handleDrawOffer} disabled={!online.canOfferDraw || online.gameOver}>◆ Offer Draw</button>
                  {online.showAbort && (
                    <button className="og-btn og-btn-abort" id="ogAbortBtn" onClick={handleAbort} disabled={online.gameOver}>◆ Abort Game</button>
                  )}
                  <button className="og-btn og-btn-chat" id="ogChatBtn" onClick={handleChat}>◆ Live Chat</button>
                </div>
              </div>

              {/* Move history */}
              <div className="og-side-card" style={{ flex: 1 }}>
                <div className="og-moves-label">Move History</div>
                <div className="og-move-list" id="onlineMoveHistory">
                  {historyPairs.length === 0 ? (
                    <p style={{
                      color:'#7d8ba8',
                      fontSize:'12px',
                      fontFamily:"'Chakra Petch', sans-serif",
                      letterSpacing:'0.14em',
                      textTransform:'uppercase',
                      textAlign:'center',
                      padding:'16px 8px'
                    }}>No moves yet.</p>
                  ) : (
                    historyPairs.map((move, i) => (
                      <div key={i} className="og-move-item">
                        <strong>{move.num}.</strong> {move.white} {move.black && <span>{move.black}</span>}
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </main>

        {/* Resign confirm popup */}
        {showResignOverlay && (
          <div className="og-confirm-overlay" id="ogResignOverlay">
            <div className="og-confirm-card">
              <h3>Resign Game?</h3>
              <p>Are you sure you want to resign? This will count as a loss.</p>
              <div className="og-confirm-btns">
                <button className="og-confirm-yes" id="ogResignConfirmBtn" onClick={confirmResign}>Yes, Resign</button>
                <button className="og-confirm-no" id="ogResignCancelBtn" onClick={() => setShowResignOverlay(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Game Over overlay */}
        {showGameOver && online.gameOverInfo && (
          <div className="og-gameover-overlay" id="onlineGameOverModal">
            <div className="og-gameover-card">
              <div className="og-gameover-kicker">Game Over</div>
              <h2 id="onlineGameOverTitle">{online.gameOverInfo.title}</h2>
              <p id="onlineGameOverMessage">{online.gameOverInfo.message}</p>
              <div className="og-gameover-btns">
                <Link to="/play" className="og-gameover-btn primary">
                  ← Back to Play
                </Link>

                <Link to="/online" className="og-gameover-btn secondary">
                  New Match
                </Link>

                {online.savedGameId && (
                  <button
                    type="button"
                    className="og-gameover-btn secondary"
                    onClick={() => navigate(`/replay/${online.savedGameId}`)}
                  >
                    ▶ Replay
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Hidden spans for JS compatibility */}
        <span id="playerColorLabel" style={{ display: 'none' }}></span>
        <span id="onlineTurnLabel" style={{ display: 'none' }}></span>
        <span id="onlineStatusLabel" style={{ display: 'none' }}></span>
        <span id="opponentName" style={{ display: 'none' }}></span>
        <span id="onlineGameInfo" style={{ display: 'none' }}></span>
      </div>
    </>
  );
};

export default OnlinePlay;