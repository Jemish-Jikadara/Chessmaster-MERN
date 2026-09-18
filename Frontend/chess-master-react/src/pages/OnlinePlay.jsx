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
        .og-page {
          background: #080810;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', ui-sans-serif, sans-serif;
          color: #f0ece4;
        }

        .og-layout {
          flex: 1;
          display: grid;
          grid-template-columns: minmax(0, 580px) 300px;
          gap: 18px;
          max-width: 920px;
          margin: 0 auto;
          padding: 24px 16px 32px;
          align-items: start;
          width: 100%;
        }

        .og-board-panel {
          display: flex;
          flex-direction: column;
          gap: 8px;
          position: relative;
        }

        .og-player-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          transition: border-color 0.2s, background 0.2s;
        }

        .og-player-strip.active-turn {
          border-color: rgba(250,204,21,0.5);
          background: rgba(250,204,21,0.05);
        }

        .og-player-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .og-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 15px;
          flex-shrink: 0;
        }

        .og-avatar.white-av {
          background: #e8e0d4;
          color: #1a1a1a;
        }

        .og-avatar.black-av {
          background: #1a1a2e;
          border: 1px solid rgba(255,255,255,0.15);
          color: #f0ece4;
        }

        .og-player-name {
          font-size: 14px;
          font-weight: 700;
          color: #f0ece4;
          line-height: 1.2;
        }

        .og-player-rating {
          font-size: 12px;
          color: #6b7280;
          margin-top: 1px;
        }

        .og-disconnect-msg {
          font-size: 11px;
          color: #ef4444;
          margin-top: 2px;
        }

        .og-player-clock {
          font-size: 22px;
          font-weight: 800;
          font-variant-numeric: tabular-nums;
          color: #f0ece4;
          min-width: 72px;
          text-align: right;
        }

        .og-player-strip.active-turn .og-player-clock {
          color: #facc15;
        }

        .og-player-strip.low-time .og-player-clock {
          color: #ef4444 !important;
        }

        .og-board-wrap {
          width: 100%;
        }

        .og-board {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          width: 100%;
          aspect-ratio: 1;
          border-radius: 10px;
          overflow: hidden;
          border: 3px solid #facc15;
          box-shadow: 0 16px 50px rgba(0,0,0,0.4);
        }

        .og-status-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 4px;
        }

        .og-turn-label {
          font-size: 13px;
          color: #6b7280;
        }

        .og-status-badge {
          font-size: 12px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
        }

        .og-status-badge.active {
          background: rgba(74,222,128,0.1);
          color: #4ade80;
          border: 1px solid rgba(74,222,128,0.2);
        }

        .og-status-badge.check {
          background: rgba(250,204,21,0.1);
          color: #facc15;
          border: 1px solid rgba(250,204,21,0.2);
        }

        .og-status-badge.over {
          background: rgba(239,68,68,0.1);
          color: #ef4444;
          border: 1px solid rgba(239,68,68,0.2);
        }

        .og-side-panel {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .og-side-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 16px;
        }

        .og-side-card-label {
          font-size: 11px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 4px;
        }

        .og-actions {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .og-btn {
          width: 100%;
          min-height: 42px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-family: 'Inter', sans-serif;
        }

        .og-btn-resign {
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          color: #f87171;
        }

        .og-btn-resign:hover {
          background: rgba(239,68,68,0.22);
          border-color: #ef4444;
        }

        .og-btn-draw {
          background: rgba(59,130,246,0.12);
          border: 1px solid rgba(59,130,246,0.3);
          color: #93c5fd;
        }

        .og-btn-draw:hover {
          background: rgba(59,130,246,0.22);
          border-color: #3b82f6;
        }

        .og-btn-draw:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }

        .og-btn-abort {
          background: rgba(107,114,128,0.12);
          border: 1px solid rgba(107,114,128,0.3);
          color: #9ca3af;
        }

        .og-btn-abort:hover {
          background: rgba(107,114,128,0.22);
          border-color: #6b7280;
        }

        .og-btn-chat {
          background: rgba(124,58,237,0.12);
          border: 1px solid rgba(124,58,237,0.3);
          color: #a78bfa;
        }

        .og-btn-chat:hover {
          background: rgba(124,58,237,0.22);
          border-color: #7c3aed;
        }

        .og-moves-label {
          font-size: 11px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .og-move-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
          max-height: 320px;
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #1f1f2e transparent;
        }

        .og-move-item {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 13px;
          color: #cbd5e1;
        }

        .og-move-item strong {
          color: #facc15;
          margin-right: 4px;
        }

        .og-move-item span {
          color: #374151;
          font-size: 11px;
          margin-left: 4px;
        }

        .og-draw-banner {
          background: rgba(59,130,246,0.1);
          border: 1px solid rgba(59,130,246,0.3);
          border-radius: 12px;
          padding: 14px;
          text-align: center;
        }

        .og-draw-banner p {
          font-size: 13px;
          color: #93c5fd;
          margin-bottom: 10px;
        }

        .og-draw-banner-btns {
          display: flex;
          gap: 8px;
        }

        .og-draw-accept {
          flex: 1;
          min-height: 36px;
          border-radius: 8px;
          border: none;
          background: #3b82f6;
          color: #fff;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
        }

        .og-draw-decline {
          flex: 1;
          min-height: 36px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: #6b7280;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
        }

        .og-confirm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(4px);
          z-index: 100;
          display: grid;
          place-items: center;
        }

        .og-confirm-card {
          background: #0f0f1a;
          border: 1px solid rgba(239,68,68,0.4);
          border-radius: 18px;
          padding: 32px 28px;
          text-align: center;
          width: min(90%, 340px);
          box-shadow: 0 0 60px rgba(239,68,68,0.15);
        }

        .og-confirm-card h3 {
          font-size: 22px;
          font-weight: 800;
          color: #f0ece4;
          margin-bottom: 8px;
        }

        .og-confirm-card p {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 24px;
        }

        .og-confirm-btns {
          display: flex;
          gap: 10px;
        }

        .og-confirm-yes {
          flex: 1;
          min-height: 44px;
          border-radius: 10px;
          border: none;
          background: #ef4444;
          color: #fff;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
        }

        .og-confirm-no {
          flex: 1;
          min-height: 44px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.12);
          background: transparent;
          color: #9ca3af;
          font-weight: 700;
          font-size: 14px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
        }

        .og-gameover-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(6px);
          z-index: 90;
          display: grid;
          place-items: center;
        }

        .og-gameover-card {
          background: #0f0f1a;
          border: 1px solid rgba(250,204,21,0.35);
          border-radius: 20px;
          padding: 36px 32px;
          text-align: center;
          width: min(90%, 360px);
          box-shadow: 0 0 80px rgba(250,204,21,0.1);
        }

        .og-gameover-kicker {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #facc15;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .og-gameover-card h2 {
          font-size: 28px;
          font-weight: 900;
          color: #f0ece4;
          margin-bottom: 8px;
        }

        .og-gameover-card p {
          color: #6b7280;
          font-size: 14px;
          margin-bottom: 28px;
        }

        .og-gameover-btns {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .og-gameover-btn {
          min-height: 46px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          font-family: 'Inter', sans-serif;
        }

        .og-gameover-btn.primary {
          background: #facc15;
          color: #050816;
        }

        .og-gameover-btn.primary:hover {
          background: #fde047;
        }

        .og-gameover-btn.secondary {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: #9ca3af;
        }

        .og-gameover-btn.secondary:hover {
          border-color: rgba(255,255,255,0.2);
          color: #f0ece4;
        }

        @media (max-width: 760px) {
          .og-layout {
            grid-template-columns: 1fr;
            padding: 16px 12px 24px;
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
                  <button className="og-btn og-btn-resign" id="ogResignBtn" onClick={handleResign} disabled={online.gameOver}>🏳 Resign</button>
                  <button className="og-btn og-btn-draw" id="ogDrawBtn" onClick={handleDrawOffer} disabled={!online.canOfferDraw || online.gameOver}>🤝 Offer Draw</button>
                  {online.showAbort && (
                    <button className="og-btn og-btn-abort" id="ogAbortBtn" onClick={handleAbort} disabled={online.gameOver}>✖ Abort Game</button>
                  )}
                  <button className="og-btn og-btn-chat" id="ogChatBtn" onClick={handleChat}>💬 Live Chat</button>
                </div>
              </div>

              {/* Move history */}
              <div className="og-side-card" style={{ flex: 1 }}>
                <div className="og-moves-label">Move History</div>
                <div className="og-move-list" id="onlineMoveHistory">
                  {historyPairs.length === 0 ? (
                    <p style={{ color: '#6b7280', fontSize: '13px' }}>No moves yet.</p>
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