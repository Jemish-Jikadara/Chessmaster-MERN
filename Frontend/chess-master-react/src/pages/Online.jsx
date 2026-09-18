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
      navigate('/online/play');
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
        :root {
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
        }

        .online-page {
          background: var(--h-bg);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-family: 'Inter', sans-serif;
          color: var(--h-text);
        }

        .online-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 60px 24px;
        }

        .online-card {
          width: 100%;
          max-width: 700px;
          background: rgba(255,255,255,0.045);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 24px;
          padding: 40px 32px;
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .online-kicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--h-green-2);
          margin-bottom: 10px;
          display: block;
          font-weight: 800;
        }

        .online-card h1 {
          font-family: 'Fraunces', serif;
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--h-text);
          margin-bottom: 8px;
        }

        .online-card > p {
          color: var(--h-muted);
          font-size: 15px;
          margin-bottom: 24px;
        }

        .tc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin: 24px 0;
        }

        @media (max-width: 700px) {
          .tc-grid {
            grid-template-columns: 1fr;
          }
          .online-main {
            padding: 40px 16px;
          }
          .online-card {
            padding: 32px 20px;
          }
        }

        .tc-card {
          background: rgba(255,255,255,0.04);
          border: 2px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 16px 10px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tc-card:hover {
          border-color: rgba(129,182,76,0.35);
          background: rgba(129,182,76,0.08);
        }

        .tc-card.selected {
          border-color: var(--h-green);
          background: rgba(129,182,76,0.12);
        }

        .tc-icon { font-size: 1.8rem; }

        .tc-name {
          font-weight: 850;
          color: var(--h-text);
          margin: 6px 0 2px;
          font-size: 14px;
        }

        .tc-time {
          font-size: 12px;
          color: var(--h-muted);
        }

        .tc-btns {
          display: grid;
          gap: 8px;
          margin-top: 12px;
        }

        .tc-btn {
          width: 100%;
          padding: 9px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: var(--h-muted);
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }

        .tc-btn:hover, .tc-btn.active {
          border-color: var(--h-green);
          color: var(--h-green-2);
          background: rgba(129,182,76,0.1);
        }

        .find-match-btn {
          width: 100%;
          padding: 16px;
          border-radius: 12px;
          border: none;
          background: linear-gradient(180deg,#9bd761,#7fb64a);
          color: #10180e;
          font-size: 15px;
          font-weight: 850;
          cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 16px 30px rgba(129,182,76,.25), inset 0 1px rgba(255,255,255,.45);
          font-family: 'Inter', sans-serif;
          margin-top: 8px;
        }

        .find-match-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          background: linear-gradient(180deg,#a8e372,#82bd4a);
          box-shadow: 0 20px 38px rgba(129,182,76,.32), inset 0 1px rgba(255,255,255,.55);
        }

        .find-match-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          filter: grayscale(0.6);
        }

        .match-status {
          margin-top: 12px;
          font-size: 13px;
          color: var(--h-muted);
          line-height: 1.6;
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
                className="find-match-btn"
                style={{
                  background: 'rgba(255,255,255,.06)',
                  border: '1px solid rgba(255,255,255,.12)',
                  color: 'var(--h-text)',
                  marginTop: '10px',
                }}
                onClick={handleCancelSearch}
              >
                Cancel
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