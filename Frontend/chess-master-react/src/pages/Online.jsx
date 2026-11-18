import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../lib/socket';

const Online = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const [searching, setSearching] = useState(false);

  const [selectedTimeControl, setSelectedTimeControl] = useState(null);
  const [selectedBtn, setSelectedBtn] = useState(null);
  const [matchStatus, setMatchStatus] = useState('Select a time control to find an opponent. Once you click "Find Match", we will search for a player.');

  // Set global window variables for external JS compatibility
  useEffect(() => {
    window.currentUsername = user?.username || 'Player';
    window.currentUserId = user?.id || '';
  }, [user]);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const onWaiting = () => setMatchStatus('Searching for an opponent... hang tight.');

    const onMatchFound = ({ roomId, color, opponent, timeControl }) => {
      sessionStorage.setItem('onlineRoomId', roomId);
      sessionStorage.setItem('onlineColor', color);
      sessionStorage.setItem('onlineOpponent', JSON.stringify(opponent));
      sessionStorage.setItem('onlineTimeControl', JSON.stringify(timeControl));
      sessionStorage.removeItem('onlineMoves');
      sessionStorage.removeItem('onlineWhiteTime');
      sessionStorage.removeItem('onlineBlackTime');
      setSearching(false);
      window.location.href = '/online/play';
    };

    socket.on('waitingForOpponent', onWaiting);
    socket.on('matchFound', onMatchFound);

    return () => {
      socket.off('waitingForOpponent', onWaiting);
      socket.off('matchFound', onMatchFound);
    };
  }, [navigate]);

  const timeControls = [
    {
      id: 'bullet',
      icon: '⚡',
      name: 'Bullet',
      time: '1-2 min',
      options: [
        { minutes: 1, increment: 0, mode: 'bullet', label: '1+0' },
        { minutes: 1, increment: 1, mode: 'bullet', label: '1+1' },
        { minutes: 2, increment: 1, mode: 'bullet', label: '2+1' },
      ],
    },
    {
      id: 'blitz',
      icon: '🔥',
      name: 'Blitz',
      time: '3-5 min',
      options: [
        { minutes: 3, increment: 0, mode: 'blitz', label: '3+0' },
        { minutes: 3, increment: 2, mode: 'blitz', label: '3+2' },
        { minutes: 5, increment: 0, mode: 'blitz', label: '5+0' },
      ],
    },
    {
      id: 'rapid',
      icon: '⏱',
      name: 'Rapid',
      time: '10-15 min',
      options: [
        { minutes: 10, increment: 0, mode: 'rapid', label: '10+0' },
        { minutes: 10, increment: 5, mode: 'rapid', label: '10+5' },
        { minutes: 15, increment: 10, mode: 'rapid', label: '15+10' },
      ],
    },
  ];

  const handleSelect = (control, option, btnId) => {
    setSelectedTimeControl({
      minutes: option.minutes,
      increment: option.increment,
      mode: option.mode,
      label: option.label,
    });
    setSelectedBtn(btnId);
    setMatchStatus(`Selected: ${control.name} ${option.label}. Click "Find Match" to start.`);
  };

  const handleFindMatch = () => {
    if (!selectedTimeControl) return;
    setSearching(true);
    setMatchStatus('Searching for opponent...');
    socketRef.current?.emit('findMatch', {
      player: { id: user?.id, username: user?.username || 'Player' },
      timeControl: {
        mode: selectedTimeControl.mode,
        minutes: selectedTimeControl.minutes,
        increment: selectedTimeControl.increment,
      },
    });
  };

  const handleCancelSearch = () => {
    setSearching(false);
    setMatchStatus('Search cancelled. Select a time control to try again.');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=Orbitron:wght@500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');

        :root {
          --h-bg:#050510;
          --h-bg-2:#0a0a1e;
          --h-panel:#08081a;
          --h-line:rgba(0,229,255,0.14);
          --h-line-soft:rgba(255,255,255,0.06);
          --h-text:#e8f4ff;
          --h-muted:#7d8ba8;
          --h-soft:#b8c6dd;
          --h-cyan:#00e5ff;
          --h-cyan-2:#5cf0ff;
          --h-cyan-3:#a8f8ff;
          --h-pink:#ff2d95;
          --h-pink-2:#ff6bb0;
          --h-acid:#b6ff3c;
          --h-purple:#8b5cf6;
          --h-font-display:'Orbitron', system-ui, sans-serif;
          --h-font-tech:'Chakra Petch', system-ui, sans-serif;
          --h-font-body:'Inter', system-ui, sans-serif;
        }

        .online-page {
          position:relative;
          background:#050510;
          min-height:100vh;
          display:flex;
          flex-direction:column;
          font-family:var(--h-font-body);
          color:var(--h-text);
          overflow-x:hidden;
        }

        /* Animated grid backdrop */
        .online-page::before{
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

        .online-page::after{
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

        .online-page > *{ position:relative; z-index:1; }

        .online-main {
          flex:1;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:60px 24px;
        }

        /* =========================================================
           CARD
           ========================================================= */
        .online-card {
          position:relative;
          width:100%;
          max-width:760px;
          padding:44px 36px;
          border-radius:8px;
          text-align:center;
          background:
            linear-gradient(180deg, rgba(0,229,255,.08), rgba(139,92,246,.04)),
            #08081a;
          border:1px solid rgba(0,229,255,.35);
          box-shadow:
            0 0 60px rgba(0,229,255,.18),
            0 0 120px rgba(255,45,149,.1),
            inset 0 0 60px rgba(0,229,255,.06);
        }

        /* HUD corner brackets */
        .online-card::before,
        .online-card::after{
          content:'';
          position:absolute;
          width:22px; height:22px;
          border:2px solid #00e5ff;
          filter:drop-shadow(0 0 8px rgba(0,229,255,.8));
          pointer-events:none;
        }
        .online-card::before{ top:-2px; left:-2px; border-right:0; border-bottom:0; }
        .online-card::after{ bottom:-2px; right:-2px; border-left:0; border-top:0; }

        /* =========================================================
           HEADINGS
           ========================================================= */
        .online-kicker {
          display:inline-flex;
          align-items:center;
          gap:9px;
          font-family:var(--h-font-tech);
          font-size:11px;
          letter-spacing:0.22em;
          text-transform:uppercase;
          color:var(--h-cyan);
          margin-bottom:16px;
          font-weight:700;
        }

        .online-kicker::before{
          content:'[';
          color:#a8f8ff;
          font-family:'Orbitron', system-ui, sans-serif;
          font-weight:900;
        }
        .online-kicker::after{
          content:']';
          color:#a8f8ff;
          font-family:'Orbitron', system-ui, sans-serif;
          font-weight:900;
        }

        .online-card h1 {
          font-family:var(--h-font-display);
          font-size:clamp(1.8rem, 4vw, 2.6rem);
          font-weight:800;
          color:#fff;
          margin:0 0 12px;
          text-transform:uppercase;
          letter-spacing:-0.005em;
          text-shadow:0 0 26px rgba(0,229,255,0.35);
        }

        .online-card > p {
          color:var(--h-muted);
          font-size:14px;
          margin:0 0 30px;
          font-family:var(--h-font-tech);
          letter-spacing:0.1em;
          text-transform:uppercase;
        }

        /* =========================================================
           TIME CONTROL GRID
           ========================================================= */
        .tc-grid {
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:14px;
          margin:26px 0;
        }

        @media (max-width: 700px) {
          .tc-grid {
            grid-template-columns:1fr;
          }
          .online-main {
            padding:40px 16px;
          }
          .online-card {
            padding:32px 20px;
          }
        }

        .tc-card {
          position:relative;
          background:rgba(0,229,255,.025);
          border:1px solid rgba(0,229,255,.2);
          border-radius:8px;
          padding:20px 12px;
          text-align:center;
          cursor:pointer;
          transition:all 0.22s ease;
          overflow:hidden;
        }

        .tc-card::before {
          content:'';
          position:absolute;
          top:0; left:0; right:0;
          height:2px;
          background:linear-gradient(90deg, #00e5ff, #ff2d95);
          transform:scaleX(0);
          transform-origin:left;
          transition:transform .3s ease;
        }

        .tc-card:hover {
          border-color:rgba(0,229,255,0.55);
          background:rgba(0,229,255,.08);
          transform:translateY(-3px);
          box-shadow:
            0 0 24px rgba(0,229,255,0.28),
            0 0 50px rgba(139,92,246,0.12);
        }

        .tc-card:hover::before {
          transform:scaleX(1);
        }

        .tc-card.selected {
          border-color:var(--h-cyan);
          background:rgba(0,229,255,.12);
          box-shadow:
            0 0 30px rgba(0,229,255,0.5),
            0 0 60px rgba(139,92,246,0.2),
            inset 0 0 24px rgba(0,229,255,0.1);
        }

        .tc-card.selected::before {
          transform:scaleX(1);
        }

        .tc-icon {
          font-size:1.8rem;
          filter:drop-shadow(0 0 12px rgba(0,229,255,0.6));
        }

        .tc-name {
          font-family:var(--h-font-display);
          font-weight:800;
          color:#fff;
          margin:8px 0 4px;
          font-size:14px;
          text-transform:uppercase;
          letter-spacing:0.08em;
        }

        .tc-time {
          font-family:var(--h-font-tech);
          font-size:11px;
          color:var(--h-muted);
          letter-spacing:0.14em;
          text-transform:uppercase;
        }

        .tc-btns {
          display:grid;
          gap:8px;
          margin-top:16px;
        }

        .tc-btn {
          width:100%;
          padding:10px;
          border-radius:4px;
          border:1px solid rgba(0,229,255,.22);
          background:rgba(0,229,255,.03);
          color:var(--h-soft);
          font-family:var(--h-font-tech);
          font-size:12px;
          font-weight:700;
          letter-spacing:0.14em;
          text-transform:uppercase;
          cursor:pointer;
          transition:all 0.2s ease;
        }

        .tc-btn:hover,
        .tc-btn.active {
          border-color:var(--h-cyan);
          color:var(--h-cyan-3);
          background:rgba(0,229,255,.14);
          box-shadow:
            inset 0 0 12px rgba(0,229,255,.15),
            0 0 16px rgba(0,229,255,.35);
          text-shadow:0 0 10px rgba(0,229,255,.6);
        }

        /* =========================================================
           FIND MATCH BUTTON
           ========================================================= */
        .find-match-btn {
          position:relative;
          width:100%;
          padding:18px;
          border-radius:6px;
          border:none;
          background:linear-gradient(90deg, #00e5ff, #a8f8ff);
          color:#050510;
          font-family:var(--h-font-tech);
          font-size:13.5px;
          font-weight:800;
          letter-spacing:0.2em;
          text-transform:uppercase;
          cursor:pointer;
          transition:transform 0.25s ease, box-shadow 0.25s ease;
          box-shadow:
            0 0 20px rgba(0,229,255,.55),
            0 0 44px rgba(0,229,255,.25),
            inset 0 0 10px rgba(255,255,255,.4);
          margin-top:10px;
          overflow:hidden;
        }

        .find-match-btn::after {
          content:'';
          position:absolute;
          inset:0;
          background:linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent);
          transform:translateX(-100%);
          transition:transform .6s ease;
        }

        .find-match-btn:hover:not(:disabled) {
          transform:translateY(-2px);
          box-shadow:
            0 0 32px rgba(0,229,255,.9),
            0 0 64px rgba(0,229,255,.45),
            inset 0 0 12px rgba(255,255,255,.55);
        }

        .find-match-btn:hover:not(:disabled)::after {
          transform:translateX(100%);
        }

        .find-match-btn:disabled {
          opacity:0.4;
          cursor:not-allowed;
          filter:grayscale(0.5);
        }

        /* Cancel button */
        .cancel-match-btn {
          width:100%;
          padding:14px;
          border-radius:6px;
          background:rgba(255,45,149,.06);
          border:1px solid rgba(255,45,149,.35);
          color:var(--h-pink-2);
          font-family:var(--h-font-tech);
          font-size:12px;
          font-weight:700;
          letter-spacing:0.2em;
          text-transform:uppercase;
          cursor:pointer;
          transition:all .2s ease;
          margin-top:12px;
          box-shadow:inset 0 0 12px rgba(255,45,149,.1);
        }

        .cancel-match-btn:hover {
          background:rgba(255,45,149,.14);
          border-color:rgba(255,45,149,.7);
          color:#ff9ecb;
          box-shadow:
            inset 0 0 16px rgba(255,45,149,.18),
            0 0 18px rgba(255,45,149,.4);
        }

        /* =========================================================
           MATCH STATUS
           ========================================================= */
        .match-status {
          margin-top:20px;
          padding:14px 18px;
          font-family:var(--h-font-tech);
          font-size:12px;
          color:var(--h-soft);
          line-height:1.7;
          letter-spacing:0.06em;
          border-radius:6px;
          background:rgba(0,229,255,.03);
          border:1px solid rgba(0,229,255,.15);
          box-shadow:inset 0 0 14px rgba(0,229,255,.06);
        }

        @media (max-width:560px){
          .online-card {
            padding:28px 20px;
          }
          .tc-card {
            padding:16px 12px;
          }
          .tc-icon {
            font-size:1.5rem;
          }
        }
      `}</style>

      <div className="online-page">
        <main className="online-main">
          <section className="online-card">
            <span className="online-kicker">Real Time</span>
            <h1>Online Matchmaking</h1>
            <p>New Game</p>

            {/* Time Control Selection */}
            <div className="tc-grid">
              {timeControls.map((control) => (
                <div
                  key={control.id}
                  className={`tc-card ${selectedTimeControl?.mode === control.id ? 'selected' : ''}`}
                  id={`tc-${control.id}`}
                >
                  <div className="tc-icon">{control.icon}</div>
                  <div className="tc-name">{control.name}</div>
                  <div className="tc-time">{control.time}</div>
                  <div className="tc-btns">
                    {control.options.map((option, idx) => {
                      const btnId = `${control.id}-${idx}`;
                      return (
                        <button
                          key={btnId}
                          className={`tc-btn ${selectedBtn === btnId ? 'active' : ''}`}
                          onClick={() => handleSelect(control, option, btnId)}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <button
              id="findMatchBtn"
              type="button"
              className="find-match-btn"
              disabled={!selectedTimeControl || searching}
              onClick={handleFindMatch}
            >
              {searching
                ? 'Searching...'
                : selectedTimeControl
                ? `Find Match (${selectedTimeControl.label})`
                : 'Find Match'}
            </button>

            {searching && (
              <button
                type="button"
                className="cancel-match-btn"
                onClick={handleCancelSearch}
              >
                Cancel Search
              </button>
            )}

            <p id="matchStatus" className="match-status">
              {matchStatus}
            </p>
          </section>
        </main>

        {/* Hidden spans for JS compatibility */}
        <span id="currentUsername" style={{ display: 'none' }}>
          {user?.username || 'Player'}
        </span>
        <span id="currentUserId" style={{ display: 'none' }}>
          {user?.id || ''}
        </span>
      </div>
    </>
  );
};

export default Online;