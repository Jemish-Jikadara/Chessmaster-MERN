import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChessBoard from '../components/ChessBoard';
import useChessGame from '../hooks/useChessGame';
import api from '../api/axios';

const Play = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const savedRef = useRef({ white: '', black: '', color: 'w', mode: 'rapid', minutes: 10, increment: 0 });
  const chess = useChessGame({
    onGameOver: async ({ winner, history: moveHistory }) => {
      if (!moveHistory.length) return;
      try {
        const response = await api.post('/api/games', {
          whitePlayer: savedRef.current.white || 'White Player',
          blackPlayer: savedRef.current.black || 'Black Player',
          winner,
          playerColor: savedRef.current.color,
          timeMode: savedRef.current.mode,
          timeControl: `${savedRef.current.minutes}+${savedRef.current.increment}`,
          increment: savedRef.current.increment,
          totalMoves: moveHistory.length,
          moves: moveHistory,
        });
        console.log("Game saved:", response.data);
        setSavedGameId(response.data?.game?._id || null);
      } catch (err) {
        console.error('Auto-save game failed:', err);
      }
    },
  });

  const [screen, setScreen] = useState('mode');
  const [isBotMode, setIsBotMode] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);
  const [savedGameId, setSavedGameId] = useState(null);
  const [pickedColor, setPickedColor] = useState('w');
  const [selectedTime, setSelectedTime] = useState(null);
  const [whitePlayer, setWhitePlayer] = useState(user?.username || '');
  const [blackPlayer, setBlackPlayer] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const saved = chess.loadLocalGame?.();
    if (!saved) return;

    const restored = chess.restoreGame(saved);
    if (!restored) return;

    setIsBotMode(!!saved.isBot);
    setSelectedBot(saved.bot || null);
    setPickedColor(saved.playerColor || 'w');

    setSelectedTime({
      minutes: Math.max(1, Math.ceil(Math.max(saved.whiteTime || 0, saved.blackTime || 0) / 60)),
      increment: saved.increment || 0,
      mode: 'rapid',
      label: 'Restored'
    });

    const playerName = user?.username || 'You';
    const botName = saved.bot ? `${saved.bot.name} (${saved.bot.rating})` : 'Bot';

    if (saved.isBot) {
      const white = saved.playerColor === 'w' ? playerName : botName;
      const black = saved.playerColor === 'w' ? botName : playerName;
      setWhitePlayer(white);
      setBlackPlayer(black);

      savedRef.current = {
        white,
        black,
        color: saved.playerColor || 'w',
        mode: 'rapid',
        minutes: 10,
        increment: saved.increment || 0,
      };
    } else {
      setWhitePlayer('White Player');
      setBlackPlayer('Black Player');

      savedRef.current = {
        white: 'White Player',
        black: 'Black Player',
        color: 'w',
        mode: 'rapid',
        minutes: 10,
        increment: saved.increment || 0,
      };
    }

    setGameStarted(true);
    setScreen('game');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let isRefreshing = false;

    const handleBeforeUnload = () => {
      isRefreshing = true;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (!isRefreshing) {
        chess.clearLocalGame?.();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bots = [
    { name: 'Pawn Pusher', rating: 100, level: 'beginner', icon: '🐣' },
    { name: 'Rookie Ralph', rating: 200, level: 'beginner', icon: '🌱' },
    { name: 'Novice Nina', rating: 300, level: 'beginner', icon: '🐥' },
    { name: 'Beginner Ben', rating: 400, level: 'beginner', icon: '🌿' },
    { name: 'Learner Leo', rating: 500, level: 'novice', icon: '📘' },
    { name: 'Student Sam', rating: 600, level: 'novice', icon: '📗' },
    { name: 'Amateur Amy', rating: 700, level: 'novice', icon: '📕' },
    { name: 'Casual Chris', rating: 800, level: 'novice', icon: '📙' },
    { name: 'Club Player', rating: 900, level: 'intermediate', icon: '♟' },
    { name: 'Tactical Tom', rating: 1000, level: 'intermediate', icon: '🎯' },
    { name: 'Strategic Sue', rating: 1100, level: 'intermediate', icon: '🧩' },
    { name: 'Thinker Tim', rating: 1200, level: 'intermediate', icon: '🧠' },
    { name: 'Club Champ', rating: 1300, level: 'club', icon: '🏅' },
    { name: 'Local Hero', rating: 1400, level: 'club', icon: '🥉' },
    { name: 'Rising Star', rating: 1500, level: 'club', icon: '🥈' },
    { name: 'City Master', rating: 1600, level: 'club', icon: '🥇' },
    { name: 'Expert Evan', rating: 1700, level: 'advanced', icon: '⚔' },
    { name: 'Master Mike', rating: 1800, level: 'advanced', icon: '🛡' },
    { name: 'Elite Emma', rating: 1900, level: 'advanced', icon: '👑' },
    { name: 'Pro Peter', rating: 2000, level: 'advanced', icon: '💎' },
    { name: 'FIDE Master', rating: 2100, level: 'expert', icon: '🏆' },
    { name: 'Intl Master', rating: 2200, level: 'expert', icon: '🌍' },
    { name: 'Grandmaster', rating: 2300, level: 'expert', icon: '♚' },
    { name: 'Super GM', rating: 2400, level: 'expert', icon: '👁' },
    { name: 'Elite GM', rating: 2500, level: 'master', icon: '🔥' },
    { name: 'World Class', rating: 2600, level: 'master', icon: '⚡' },
    { name: 'Champion', rating: 2700, level: 'master', icon: '🌟' },
    { name: 'Prodigy', rating: 2800, level: 'master', icon: '🚀' },
    { name: 'Legend', rating: 2900, level: 'gm', icon: '🌙' },
    { name: 'Immortal', rating: 3000, level: 'gm', icon: '☀' },
    { name: 'Stockfish', rating: 3100, level: 'gm', icon: '🤖' },
    { name: 'God Mode', rating: 3200, level: 'gm', icon: '👁‍🗨' },
  ];

  const timeControls = [
    {
      title: '⏱ Rapid',
      desc: 'Longer games with deeper calculation.',
      mode: 'rapid',
      options: [
        { minutes: 10, increment: 0, label: '10 + 0' },
        { minutes: 15, increment: 10, label: '15 + 10' },
        { minutes: 30, increment: 0, label: '30 + 0' },
      ],
    },
    {
      title: '⚡ Blitz',
      desc: 'Fast games demanding quick decisions.',
      mode: 'blitz',
      options: [
        { minutes: 3, increment: 0, label: '3 + 0' },
        { minutes: 3, increment: 2, label: '3 + 2' },
        { minutes: 5, increment: 0, label: '5 + 0' },
      ],
    },
    {
      title: '🔥 Bullet',
      desc: 'Speed chess. Every second counts.',
      mode: 'bullet',
      options: [
        { minutes: 1, increment: 0, label: '1 + 0' },
        { minutes: 1, increment: 1, label: '1 + 1' },
        { minutes: 2, increment: 1, label: '2 + 1' },
      ],
    },
  ];

  const handleSelectHuman = () => { setIsBotMode(false); setScreen('time'); };
  const handleSelectBot = () => { setIsBotMode(true); setScreen('bot'); };
  const handleSelectOnline = () => { navigate('/online'); };
  const handleSelectBotCard = (bot) => { setSelectedBot(bot); setScreen('time'); };
  const handleSelectTime = (option) => { setSelectedTime(option); setScreen('setup'); };

  const handleBack = () => {
    if (screen === 'bot') setScreen('mode');
    else if (screen === 'time') {
      if (isBotMode) setScreen('bot');
      else setScreen('mode');
    } else if (screen === 'setup') setScreen('time');
    else if (screen === 'game') setScreen('setup');
  };

  const handleConfirmPlayers = () => {
    let white = whitePlayer || user?.username || 'Player';
    let black = blackPlayer || 'Player 2';
    let color = 'w';

    if (isBotMode && selectedBot) {
      const playerName = user?.username || 'You';
      const botName = `${selectedBot.name} (${selectedBot.rating})`;
      color = pickedColor === 'random' ? (Math.random() >= 0.5 ? 'w' : 'b') : pickedColor;
      white = color === 'w' ? playerName : botName;
      black = color === 'w' ? botName : playerName;
      setWhitePlayer(white);
      setBlackPlayer(black);
    }

    const botConfig = isBotMode && selectedBot
      ? {
          ...selectedBot,
          skill: Math.max(0, Math.min(20, Math.round((selectedBot.rating - 100) / (3200 - 100) * 20))),
          thinkTime: Math.round(200 + ((selectedBot.rating - 100) / (3200 - 100)) * 1800),
        }
      : null;

    savedRef.current = {
      white,
      black,
      color,
      mode: selectedTime?.mode || 'rapid',
      minutes: selectedTime?.minutes || 10,
      increment: selectedTime?.increment || 0,
    };

    chess.setupGame({
      minutes: selectedTime?.minutes || 10,
      increment: selectedTime?.increment || 0,
      isBot: isBotMode,
      bot: botConfig,
      playerColor: color,
    });

    setGameStarted(true);
    setScreen('game');
  };

  const handleStartGame = () => { chess.startGame(); };

  const playerColorForBot = () => (isBotMode ? savedRef.current.color : 'w');
  const botColor = () => (savedRef.current.color === 'w' ? 'b' : 'w');

  const handlePlayAgain = () => {
    setSavedGameId(null);
    chess.clearLocalGame?.();
    setScreen('mode');
    setIsBotMode(false);
    setSelectedBot(null);
    setSelectedTime(null);
    setWhitePlayer('');
    setBlackPlayer('');
    setPickedColor('w');
    setGameStarted(false);
  };

  useEffect(() => {
    window.BOARD_THEME = user?.boardTheme || 'classic';
  }, [user]);

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

        .play-page {
          position:relative;
          background:#050510;
          min-height:100vh;
          color:var(--h-text);
          font-family:var(--h-font-body);
          overflow-x:hidden;
        }

        /* Animated grid backdrop */
        .play-page::before{
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

        .play-page::after{
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

        .play-page > *{ position:relative; z-index:1; }

        .play-screen {
          max-width:900px;
          margin:0 auto;
          padding:80px 24px;
          animation:fadeUp 0.4s ease both;
        }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to { opacity:1; transform:translateY(0); }
        }

        .play-kicker {
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

        .play-kicker::before{
          content:'[';
          color:#a8f8ff;
          font-family:'Orbitron', system-ui, sans-serif;
          font-weight:900;
        }
        .play-kicker::after{
          content:']';
          color:#a8f8ff;
          font-family:'Orbitron', system-ui, sans-serif;
          font-weight:900;
        }

        .play-title {
          font-family:var(--h-font-display);
          font-size:clamp(2rem, 5vw, 3rem);
          font-weight:800;
          color:#fff;
          margin:0 0 12px;
          letter-spacing:-0.005em;
          line-height:1.05;
          text-transform:uppercase;
          text-shadow:0 0 26px rgba(0,229,255,0.3);
        }

        .play-sub {
          color:var(--h-muted);
          font-size:15px;
          margin:0 0 44px;
          line-height:1.7;
        }

        /* =========================================================
           MODE CARDS
           ========================================================= */
        .mode-grid {
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:18px;
        }

        @media (max-width: 780px) {
          .mode-grid { grid-template-columns:1fr; }
        }

        .mode-card {
          position:relative;
          background:
            linear-gradient(180deg, rgba(0,229,255,.06), rgba(139,92,246,.03)),
            #08081a;
          border:1px solid rgba(0,229,255,.22);
          border-radius:8px;
          padding:36px 28px;
          cursor:pointer;
          transition:border-color .25s ease, background .25s ease, transform .2s ease, box-shadow .25s ease;
          overflow:hidden;
        }

        .mode-card::before {
          content:'';
          position:absolute;
          top:0; left:0; right:0;
          height:2px;
          background:linear-gradient(90deg, #00e5ff, #ff2d95);
          transform:scaleX(0);
          transform-origin:left;
          transition:transform .3s ease;
        }

        .mode-card:hover {
          border-color:rgba(0,229,255,.55);
          background:rgba(0,229,255,.07);
          transform:translateY(-4px);
          box-shadow:
            0 0 30px rgba(0,229,255,.28),
            0 0 60px rgba(139,92,246,.12),
            0 12px 30px rgba(0,0,0,.4);
        }

        .mode-card:hover::before {
          transform:scaleX(1);
        }

        .mode-icon {
          font-size:2.6rem;
          margin-bottom:18px;
          display:block;
          filter:drop-shadow(0 0 14px rgba(0,229,255,0.55));
        }

        .mode-card h3 {
          font-family:var(--h-font-display);
          font-size:16px;
          font-weight:800;
          color:#fff;
          margin:0 0 10px;
          text-transform:uppercase;
          letter-spacing:0.04em;
        }

        .mode-card p {
          font-size:13px;
          color:var(--h-muted);
          line-height:1.65;
          margin:0 0 24px;
        }

        .mode-btn {
          width:100%;
          padding:13px;
          background:rgba(0,229,255,.06);
          border:1px solid rgba(0,229,255,.3);
          border-radius:4px;
          color:var(--h-cyan);
          font-family:var(--h-font-tech);
          font-size:12px;
          font-weight:700;
          letter-spacing:0.16em;
          text-transform:uppercase;
          cursor:pointer;
          transition:all .25s ease;
          box-shadow:inset 0 0 12px rgba(0,229,255,.08);
        }

        .mode-btn:hover {
          background:rgba(0,229,255,.14);
          border-color:var(--h-cyan);
          color:var(--h-cyan-3);
          box-shadow:
            inset 0 0 18px rgba(0,229,255,.18),
            0 0 20px rgba(0,229,255,.4);
          text-shadow:0 0 10px rgba(0,229,255,.6);
        }

        /* =========================================================
           BOT GRID
           ========================================================= */
        .bot-grid {
          display:grid;
          grid-template-columns:repeat(auto-fill, minmax(130px, 1fr));
          gap:12px;
          margin-top:32px;
        }

        .bot-card {
          position:relative;
          background:rgba(0,229,255,.025);
          border:1px solid rgba(0,229,255,.18);
          border-radius:6px;
          padding:16px 10px;
          text-align:center;
          cursor:pointer;
          transition:border-color .2s ease, background .2s ease, transform .15s ease, box-shadow .2s ease;
        }

        .bot-card:hover {
          border-color:rgba(0,229,255,.55);
          background:rgba(0,229,255,.08);
          transform:translateY(-3px);
          box-shadow:0 0 20px rgba(0,229,255,.28);
        }

        .bot-card.selected {
          border-color:var(--h-cyan);
          background:rgba(0,229,255,.14);
          box-shadow:
            0 0 22px rgba(0,229,255,.5),
            inset 0 0 14px rgba(0,229,255,.12);
        }

        .bot-card.selected .bot-name,
        .bot-card.selected .bot-title,
        .bot-card.selected .bot-rating {
          color:#fff !important;
        }

        .bot-icon {
          font-size:1.5rem;
          margin-bottom:6px;
          filter:drop-shadow(0 0 8px rgba(0,229,255,.5));
        }

        .bot-name {
          font-family:var(--h-font-tech);
          font-size:12px;
          font-weight:700;
          color:var(--h-text);
          letter-spacing:0.04em;
        }

        .bot-rating {
          font-family:var(--h-font-display);
          font-size:13px;
          font-weight:800;
          margin:3px 0;
          color:var(--h-cyan);
          text-shadow:0 0 10px rgba(0,229,255,.5);
        }

        .bot-title {
          font-family:var(--h-font-tech);
          font-size:10px;
          color:var(--h-muted);
          letter-spacing:0.14em;
          text-transform:uppercase;
        }

        .bot-card[data-level="beginner"] .bot-rating { color:#6ee7b7; text-shadow:0 0 10px rgba(110,231,183,.5); }
        .bot-card[data-level="novice"] .bot-rating { color:#93c5fd; text-shadow:0 0 10px rgba(147,197,253,.5); }
        .bot-card[data-level="intermediate"] .bot-rating { color:var(--h-cyan); }
        .bot-card[data-level="club"] .bot-rating { color:#fbbf24; text-shadow:0 0 10px rgba(251,191,36,.5); }
        .bot-card[data-level="advanced"] .bot-rating { color:#fb923c; text-shadow:0 0 10px rgba(251,146,60,.5); }
        .bot-card[data-level="expert"] .bot-rating { color:#f87171; text-shadow:0 0 10px rgba(248,113,113,.5); }
        .bot-card[data-level="master"] .bot-rating { color:#e879f9; text-shadow:0 0 10px rgba(232,121,249,.5); }
        .bot-card[data-level="gm"] .bot-rating { color:#ffffff; text-shadow:0 0 14px rgba(255,255,255,.6); }

        /* =========================================================
           TIME GRID
           ========================================================= */
        .time-grid {
          display:grid;
          grid-template-columns:repeat(3, 1fr);
          gap:16px;
          margin-top:32px;
        }

        @media (max-width: 600px) {
          .time-grid { grid-template-columns:1fr; }
        }

        .time-card {
          background:
            linear-gradient(180deg, rgba(0,229,255,.06), rgba(139,92,246,.03)),
            #08081a;
          border:1px solid rgba(0,229,255,.22);
          border-radius:8px;
          padding:26px 20px;
          transition:border-color .2s ease, box-shadow .2s ease;
        }

        .time-card:hover {
          border-color:rgba(0,229,255,.55);
          box-shadow:
            0 0 28px rgba(0,229,255,.25),
            0 12px 30px rgba(0,0,0,.4);
        }

        .time-card h3 {
          font-family:var(--h-font-display);
          font-size:15px;
          font-weight:800;
          color:#fff;
          margin:0 0 8px;
          text-transform:uppercase;
          letter-spacing:0.06em;
        }

        .time-card p {
          font-size:12px;
          color:var(--h-muted);
          margin:0 0 18px;
          line-height:1.55;
        }

        .time-btns {
          display:flex;
          flex-direction:column;
          gap:8px;
        }

        .time-btns button {
          padding:11px;
          background:rgba(0,229,255,.03);
          border:1px solid rgba(0,229,255,.22);
          border-radius:4px;
          color:var(--h-soft);
          font-family:var(--h-font-tech);
          font-size:12px;
          font-weight:700;
          letter-spacing:0.14em;
          text-transform:uppercase;
          cursor:pointer;
          transition:all .2s ease;
        }

        .time-btns button:hover {
          border-color:var(--h-cyan);
          color:var(--h-cyan-3);
          background:rgba(0,229,255,.12);
          box-shadow:
            inset 0 0 12px rgba(0,229,255,.15),
            0 0 16px rgba(0,229,255,.35);
          text-shadow:0 0 10px rgba(0,229,255,.6);
        }

        /* =========================================================
           PLAYER FORM
           ========================================================= */
        .player-form {
          max-width:460px;
          margin:40px auto 0;
          display:flex;
          flex-direction:column;
          gap:18px;
        }

        .player-form label {
          display:flex;
          flex-direction:column;
          gap:9px;
          font-family:var(--h-font-tech);
          font-size:10.5px;
          letter-spacing:0.2em;
          color:var(--h-cyan);
          text-transform:uppercase;
          font-weight:700;
        }

        .player-form input {
          padding:14px 16px;
          background:rgba(0,229,255,.03);
          border:1px solid rgba(0,229,255,.22);
          border-radius:6px;
          color:#fff;
          font-family:var(--h-font-body);
          font-size:15px;
          outline:none;
          transition:all .25s ease;
        }

        .player-form input:focus {
          border-color:var(--h-cyan);
          background:rgba(0,229,255,.06);
          box-shadow:
            0 0 0 3px rgba(0,229,255,.15),
            0 0 22px rgba(0,229,255,.25),
            inset 0 0 10px rgba(0,229,255,.06);
        }

        .player-form input::placeholder {
          color:#5a6684;
        }

        .continue-btn {
          padding:16px;
          background:linear-gradient(90deg, #00e5ff, #a8f8ff);
          border:none;
          border-radius:6px;
          color:#050510;
          font-family:var(--h-font-tech);
          font-size:13px;
          font-weight:800;
          letter-spacing:0.18em;
          text-transform:uppercase;
          cursor:pointer;
          transition:transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow:
            0 0 20px rgba(0,229,255,.5),
            0 0 44px rgba(0,229,255,.22),
            inset 0 0 10px rgba(255,255,255,.4);
          margin-top:10px;
          position:relative;
          overflow:hidden;
        }

        .continue-btn::after {
          content:'';
          position:absolute;
          inset:0;
          background:linear-gradient(90deg, transparent, rgba(255,255,255,.4), transparent);
          transform:translateX(-100%);
          transition:transform .5s ease;
        }

        .continue-btn:hover {
          transform:translateY(-2px);
          box-shadow:
            0 0 30px rgba(0,229,255,.8),
            0 0 60px rgba(0,229,255,.4),
            inset 0 0 12px rgba(255,255,255,.55);
        }

        .continue-btn:hover::after {
          transform:translateX(100%);
        }

        .back-btn {
          display:inline-flex;
          align-items:center;
          gap:8px;
          margin-top:28px;
          padding:11px 22px;
          background:rgba(0,229,255,.04);
          border:1px solid rgba(0,229,255,.28);
          border-radius:4px;
          color:var(--h-cyan);
          font-family:var(--h-font-tech);
          font-size:12px;
          font-weight:700;
          letter-spacing:0.16em;
          text-transform:uppercase;
          cursor:pointer;
          transition:all .25s ease;
          box-shadow:inset 0 0 10px rgba(0,229,255,.08);
        }

        .back-btn:hover {
          border-color:var(--h-cyan);
          color:var(--h-cyan-3);
          background:rgba(0,229,255,.12);
          box-shadow:
            inset 0 0 16px rgba(0,229,255,.18),
            0 0 18px rgba(0,229,255,.4);
        }

        /* =========================================================
           GAME LAYOUT
           ========================================================= */
        .game-layout {
          display:grid;
          grid-template-columns:minmax(0, 560px) 320px;
          gap:22px;
          max-width:960px;
          margin:0 auto;
          padding:32px 24px 60px;
          animation:fadeUp 0.4s ease both;
        }

        @media (max-width: 900px) {
          .game-layout { grid-template-columns:1fr; }
        }

        .board-shell {
          position:relative;
          background:
            linear-gradient(180deg, rgba(0,229,255,.06), rgba(139,92,246,.03)),
            #08081a;
          border:1px solid rgba(0,229,255,.32);
          border-radius:8px;
          padding:22px;
          display:flex;
          flex-direction:column;
          gap:14px;
          box-shadow:
            0 0 40px rgba(0,229,255,.18),
            inset 0 0 40px rgba(0,229,255,.04);
        }

        .player-strip {
          display:flex;
          align-items:center;
          justify-content:space-between;
          padding:12px 14px;
          background:rgba(0,229,255,.03);
          border-radius:6px;
          border:1px solid rgba(0,229,255,.15);
          transition:all .25s ease;
        }

        .player-strip .ps-left {
          display:flex;
          align-items:center;
          gap:12px;
        }

        .ps-avatar {
          width:36px;
          height:36px;
          border-radius:6px;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:16px;
          flex-shrink:0;
          font-weight:800;
        }

        .ps-avatar.white-av {
          background:linear-gradient(135deg, #00e5ff, #a8f8ff);
          color:#050510;
          box-shadow:0 0 14px rgba(0,229,255,.55);
        }

        .ps-avatar.black-av {
          background:linear-gradient(135deg, #8b5cf6, #ff2d95);
          color:#fff;
          box-shadow:0 0 14px rgba(139,92,246,.55);
        }

        .ps-name {
          font-family:var(--h-font-tech);
          font-size:13px;
          font-weight:700;
          color:#fff;
          letter-spacing:0.06em;
          text-transform:uppercase;
        }

        .ps-thinking {
          font-family:var(--h-font-tech);
          font-size:10.5px;
          color:var(--h-cyan);
          display:none;
          animation:pulse 1.2s ease-in-out infinite;
          letter-spacing:0.14em;
          text-transform:uppercase;
        }

        @keyframes pulse {
          0%, 100% { opacity:1; }
          50% { opacity:0.3; }
        }

        .ps-clock {
          font-family:var(--h-font-display);
          font-size:22px;
          font-weight:800;
          color:#fff;
          min-width:80px;
          text-align:right;
          letter-spacing:0.02em;
          text-shadow:0 0 14px rgba(0,229,255,.4);
        }

        .player-strip.active-turn,
        .player-strip.cm-active {
          border-color:rgba(0,229,255,.6);
          background:rgba(0,229,255,.08);
          box-shadow:
            inset 0 0 14px rgba(0,229,255,.18),
            0 0 20px rgba(0,229,255,.25);
        }

        .player-strip.active-turn .ps-clock,
        .player-strip.cm-active .ps-clock {
          color:var(--h-cyan);
        }

        .player-strip.low-time .ps-clock {
          color:#ff6bb0;
          text-shadow:0 0 14px rgba(255,45,149,.7);
        }

        .board-status {
          display:flex;
          align-items:center;
          justify-content:space-between;
          font-size:13px;
        }

        .status-turn {
          color:var(--h-muted);
          font-family:var(--h-font-tech);
          letter-spacing:0.12em;
          text-transform:uppercase;
          font-size:11.5px;
          font-weight:700;
        }

        .status-badge {
          padding:5px 14px;
          border-radius:4px;
          font-family:var(--h-font-tech);
          font-size:10.5px;
          font-weight:700;
          letter-spacing:0.14em;
          text-transform:uppercase;
        }

        .status-badge.active {
          background:rgba(0,229,255,.1);
          color:var(--h-cyan);
          border:1px solid rgba(0,229,255,.4);
          box-shadow:inset 0 0 10px rgba(0,229,255,.15);
        }

        .status-badge.check {
          background:rgba(255,45,149,.1);
          color:var(--h-pink-2);
          border:1px solid rgba(255,45,149,.4);
          box-shadow:inset 0 0 10px rgba(255,45,149,.15);
        }

        .status-badge.over {
          background:rgba(139,92,246,.12);
          color:#c4b5fd;
          border:1px solid rgba(139,92,246,.4);
          box-shadow:inset 0 0 10px rgba(139,92,246,.15);
        }

        .board-scroll {
          width:100%;
          aspect-ratio:1;
          border-radius:8px;
          padding:2px;
          background:linear-gradient(135deg, rgba(0,229,255,.4), rgba(255,45,149,.25));
          box-shadow:0 0 30px rgba(0,229,255,.25);
        }

        .board-actions {
          display:flex;
          gap:10px;
        }

        .action-btn {
          flex:1;
          padding:13px;
          border-radius:4px;
          font-family:var(--h-font-tech);
          font-size:12px;
          font-weight:700;
          letter-spacing:0.14em;
          text-transform:uppercase;
          cursor:pointer;
          transition:all .25s ease;
        }

        .action-btn.primary {
          background:linear-gradient(90deg, #00e5ff, #a8f8ff);
          border:none;
          color:#050510;
          box-shadow:
            0 0 20px rgba(0,229,255,.5),
            inset 0 0 10px rgba(255,255,255,.4);
        }

        .action-btn.primary:hover:not(:disabled) {
          transform:translateY(-2px);
          box-shadow:
            0 0 30px rgba(0,229,255,.8),
            0 0 60px rgba(0,229,255,.35),
            inset 0 0 12px rgba(255,255,255,.5);
        }

        .action-btn.primary:disabled {
          background:rgba(0,229,255,.05);
          border:1px solid rgba(0,229,255,.2);
          color:var(--h-muted);
          cursor:not-allowed;
          box-shadow:none;
        }

        .action-btn.secondary {
          background:rgba(0,229,255,.04);
          border:1px solid rgba(0,229,255,.3);
          color:var(--h-cyan);
          box-shadow:inset 0 0 10px rgba(0,229,255,.08);
        }

        .action-btn.secondary:hover {
          border-color:var(--h-cyan);
          color:var(--h-cyan-3);
          background:rgba(0,229,255,.12);
          box-shadow:
            inset 0 0 16px rgba(0,229,255,.18),
            0 0 18px rgba(0,229,255,.4);
        }

        /* =========================================================
           GAME OVER OVERLAY
           ========================================================= */
        .game-over-overlay {
          position:absolute;
          inset:0;
          background:rgba(5,5,16,0.88);
          border-radius:8px;
          display:none;
          place-items:center;
          backdrop-filter:blur(10px);
          z-index:50;
        }

        .game-over-overlay.show {
          display:grid;
        }

        .game-over-card {
          position:relative;
          background:
            linear-gradient(180deg, rgba(0,229,255,.08), rgba(139,92,246,.04)),
            #08081a;
          border:1px solid rgba(0,229,255,.35);
          border-radius:8px;
          padding:44px 36px;
          text-align:center;
          max-width:360px;
          width:90%;
          box-shadow:
            0 0 50px rgba(0,229,255,.28),
            0 0 100px rgba(255,45,149,.15);
        }

        .game-over-card::before,
        .game-over-card::after {
          content:'';
          position:absolute;
          width:20px;
          height:20px;
          border:2px solid #00e5ff;
          filter:drop-shadow(0 0 8px rgba(0,229,255,.8));
          pointer-events:none;
        }
        .game-over-card::before { top:-2px; left:-2px; border-right:0; border-bottom:0; }
        .game-over-card::after { bottom:-2px; right:-2px; border-left:0; border-top:0; }

        .game-over-close {
          position:absolute;
          top:10px;
          right:12px;
          width:34px;
          height:34px;
          border:1px solid rgba(0,229,255,.35);
          background:rgba(0,229,255,.05);
          color:var(--h-cyan);
          border-radius:4px;
          cursor:pointer;
          font-size:16px;
          line-height:1;
          transition:all .2s ease;
        }

        .game-over-close:hover {
          border-color:var(--h-cyan);
          color:var(--h-cyan-3);
          background:rgba(0,229,255,.14);
          box-shadow:0 0 16px rgba(0,229,255,.5);
        }

        .go-kicker {
          display:inline-flex;
          align-items:center;
          gap:9px;
          font-family:var(--h-font-tech);
          font-size:11px;
          letter-spacing:0.22em;
          color:var(--h-cyan);
          text-transform:uppercase;
          margin-bottom:14px;
          font-weight:700;
        }

        .go-kicker::before{
          content:'[';
          color:#a8f8ff;
          font-family:'Orbitron', system-ui, sans-serif;
          font-weight:900;
        }
        .go-kicker::after{
          content:']';
          color:#a8f8ff;
          font-family:'Orbitron', system-ui, sans-serif;
          font-weight:900;
        }

        .game-over-card h2 {
          font-family:var(--h-font-display);
          font-size:26px;
          font-weight:800;
          color:#fff;
          margin:0 0 10px;
          text-transform:uppercase;
          letter-spacing:0.02em;
          text-shadow:0 0 22px rgba(0,229,255,.4);
        }

        .game-over-card p {
          color:var(--h-muted);
          font-size:14px;
          margin:0 0 30px;
          line-height:1.65;
        }

        .go-actions {
          display:flex;
          flex-direction:column;
          gap:10px;
        }

        /* =========================================================
           HISTORY PANEL
           ========================================================= */
        .history-panel {
          background:
            linear-gradient(180deg, rgba(0,229,255,.06), rgba(139,92,246,.03)),
            #08081a;
          border:1px solid rgba(0,229,255,.32);
          border-radius:8px;
          padding:22px;
          display:flex;
          flex-direction:column;
          gap:14px;
          max-height:720px;
          box-shadow:
            0 0 40px rgba(0,229,255,.18),
            inset 0 0 40px rgba(0,229,255,.04);
        }

        .history-head {
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
        }

        .hh-label {
          font-family:var(--h-font-tech);
          font-size:10.5px;
          color:var(--h-cyan);
          text-transform:uppercase;
          letter-spacing:0.22em;
          margin-bottom:4px;
          font-weight:700;
        }

        .history-head h2 {
          font-family:var(--h-font-display);
          font-size:15px;
          font-weight:800;
          color:#fff;
          margin:0;
          text-transform:uppercase;
          letter-spacing:0.06em;
        }

        .move-count-badge {
          background:rgba(0,229,255,.1);
          border:1px solid rgba(0,229,255,.4);
          color:var(--h-cyan);
          font-family:var(--h-font-display);
          font-size:13px;
          font-weight:800;
          padding:5px 12px;
          border-radius:4px;
          box-shadow:inset 0 0 10px rgba(0,229,255,.15);
        }

        .review-controls {
          display:flex;
          align-items:center;
          gap:10px;
          background:rgba(0,229,255,.04);
          border-radius:6px;
          padding:10px 12px;
          border:1px solid rgba(0,229,255,.2);
        }

        .review-controls button {
          background:transparent;
          border:1px solid rgba(0,229,255,.28);
          border-radius:4px;
          color:var(--h-cyan);
          padding:6px 14px;
          cursor:pointer;
          font-size:14px;
          transition:all .2s ease;
        }

        .review-controls button:hover:not(:disabled) {
          border-color:var(--h-cyan);
          color:var(--h-cyan-3);
          background:rgba(0,229,255,.14);
          box-shadow:0 0 14px rgba(0,229,255,.5);
        }

        .review-controls button:disabled {
          opacity:0.25;
          cursor:not-allowed;
        }

        .review-controls span {
          flex:1;
          text-align:center;
          font-family:var(--h-font-tech);
          font-size:11px;
          color:var(--h-muted);
          letter-spacing:0.12em;
          text-transform:uppercase;
        }

        .move-history {
          flex:1;
          overflow-y:auto;
          display:flex;
          flex-direction:column;
          gap:6px;
          scrollbar-width:thin;
          scrollbar-color:rgba(0,229,255,.3) transparent;
        }

        .move-history::-webkit-scrollbar {
          width:6px;
        }

        .move-history::-webkit-scrollbar-thumb {
          background:rgba(0,229,255,.3);
          border-radius:3px;
        }

        .move-history p {
          color:var(--h-muted);
          font-size:13px;
        }

        .move-item {
          background:rgba(0,229,255,.03);
          border:1px solid rgba(0,229,255,.15);
          border-radius:4px;
          padding:10px 14px;
          font-size:13px;
        }

        .move-num {
          color:var(--h-cyan);
          font-weight:800;
          margin-right:6px;
          font-family:var(--h-font-display);
          text-shadow:0 0 10px rgba(0,229,255,.5);
        }

        .move-san {
          color:#fff;
          font-weight:600;
          font-family:var(--h-font-tech);
          letter-spacing:0.04em;
        }

        .move-sq {
          color:var(--h-muted);
          font-size:11px;
          margin-left:8px;
          font-family:var(--h-font-tech);
          letter-spacing:0.08em;
        }
      `}</style>

      <div className="play-page">
        <main>
          {/* ====== SCREEN 1: GAME MODE ====== */}
          {screen === 'mode' && (
            <section className="play-screen">
              <span className="play-kicker">ChessMaster</span>
              <h1 className="play-title">Play Chess</h1>
              <p className="play-sub">Choose your game mode, then select a time control.</p>

              <div className="mode-grid">
                <article className="mode-card friend">
                  <span className="mode-icon">👥</span>
                  <h3>2 Players</h3>
                  <p>Play locally with a friend on the same device.</p>
                  <button type="button" className="mode-btn" onClick={handleSelectHuman}>
                    Play vs Friend
                  </button>
                </article>

                <article className="mode-card bot">
                  <span className="mode-icon">🤖</span>
                  <h3>vs Computer</h3>
                  <p>Challenge one of 32 AI bots from 100 to 3200 rating.</p>
                  <button type="button" className="mode-btn" onClick={handleSelectBot}>
                    Play vs Bot
                  </button>
                </article>

                <article className="mode-card online">
                  <span className="mode-icon">🌐</span>
                  <h3>Play Online</h3>
                  <p>Find a real player and play a live match with real-time moves.</p>
                  <button type="button" className="mode-btn" onClick={handleSelectOnline}>
                    Find Online Match
                  </button>
                </article>
              </div>
            </section>
          )}

          {/* ====== SCREEN 2: BOT SELECT ====== */}
          {screen === 'bot' && (
            <section className="play-screen">
              <span className="play-kicker">Choose Opponent</span>
              <h1 className="play-title">Select a Bot</h1>
              <p className="play-sub">From complete beginner to Super Grandmaster.</p>

              <div className="bot-grid">
                {bots.map((bot) => (
                  <div
                    key={bot.name}
                    className={`bot-card ${selectedBot?.name === bot.name ? 'selected' : ''}`}
                    data-level={bot.level}
                    onClick={() => handleSelectBotCard(bot)}
                  >
                    <div className="bot-icon">{bot.icon}</div>
                    <div className="bot-name">{bot.name}</div>
                    <div className="bot-rating">{bot.rating}</div>
                    <div className="bot-title">{bot.level}</div>
                  </div>
                ))}
              </div>

              <button className="back-btn" onClick={handleBack}>← Back</button>
            </section>
          )}

          {/* ====== SCREEN 3: TIME CONTROL ====== */}
          {screen === 'time' && (
            <section className="play-screen">
              <span className="play-kicker">Time Control</span>
              <h1 className="play-title">How long to play?</h1>
              <p className="play-sub">Pick Rapid, Blitz, or Bullet before starting.</p>

              <div className="time-grid">
                {timeControls.map((tc) => (
                  <div key={tc.mode} className="time-card">
                    <h3>{tc.title}</h3>
                    <p>{tc.desc}</p>
                    <div className="time-btns">
                      {tc.options.map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => handleSelectTime(opt)}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button className="back-btn" onClick={handleBack}>← Back</button>
            </section>
          )}

          {/* ====== SCREEN 4: PLAYER SETUP ====== */}
          {screen === 'setup' && (
            <section className="play-screen">
              <span className="play-kicker">{isBotMode ? 'Color' : 'Players'}</span>
              <h1 className="play-title">{isBotMode ? 'Pick your side' : "Who's playing?"}</h1>
              <p className="play-sub">
                {isBotMode
                  ? `You'll play against ${selectedBot?.name || 'the bot'}.`
                  : 'Enter player names before starting the game.'}
              </p>

              {isBotMode ? (
                <div className="player-form">
                  <div className="color-picker-row" style={{ display: 'flex', gap: '14px', marginBottom: '10px' }}>
                    {[
                      { id: 'w', label: 'White', icon: '♔' },
                      { id: 'b', label: 'Black', icon: '♚' },
                      { id: 'random', label: 'Random', icon: '🎲' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setPickedColor(opt.id)}
                        className={`bot-card ${pickedColor === opt.id ? 'selected' : ''}`}
                        style={{ flex: 1, padding: '18px 10px', textAlign: 'center', cursor: 'pointer' }}
                      >
                        <div style={{ fontSize: '28px', marginBottom: '6px' }}>{opt.icon}</div>
                        <div>{opt.label}</div>
                      </button>
                    ))}
                  </div>
                  <button type="button" className="continue-btn" onClick={handleConfirmPlayers}>
                    Continue →
                  </button>
                </div>
              ) : (
                <div className="player-form">
                  <label>
                    ♔ White Player
                    <input
                      type="text"
                      value={whitePlayer}
                      onChange={(e) => setWhitePlayer(e.target.value)}
                      placeholder="White player name"
                    />
                  </label>
                  <label>
                    ♚ Black Player
                    <input
                      type="text"
                      value={blackPlayer}
                      onChange={(e) => setBlackPlayer(e.target.value)}
                      placeholder="Black player name"
                    />
                  </label>
                  <button type="button" className="continue-btn" onClick={handleConfirmPlayers}>
                    Continue →
                  </button>
                </div>
              )}

              <button className="back-btn" onClick={handleBack}>← Back</button>
            </section>
          )}

          {/* ====== SCREEN 5: GAME AREA ====== */}
          {screen === 'game' && (() => {
            const orientation = playerColorForBot();
            const topColor = orientation === 'w' ? 'b' : 'w';
            const bottomColor = orientation;

            const strip = (color) => (
              <div className={`player-strip ${chess.turn === color && chess.gameStarted ? 'cm-active' : ''}`} id={color === 'w' ? 'whiteStrip' : 'blackStrip'}>
                <div className="ps-left">
                  <div className={`ps-avatar ${color === 'w' ? 'white-av' : 'black-av'}`}>{color === 'w' ? '♔' : '♚'}</div>
                  <div>
                    <div className="ps-name">{color === 'w' ? (whitePlayer || 'White') : (blackPlayer || 'Black')}</div>
                    {chess.botThinking && botColor() === color && (
                      <div className="ps-thinking">🤖 thinking...</div>
                    )}
                  </div>
                </div>
                <div className="ps-clock">{chess.formatTime(color === 'w' ? chess.whiteTime : chess.blackTime)}</div>
              </div>
            );

            return (
              <div className="game-layout">
                <section className="board-shell">
                  {strip(topColor)}

                  <div className="board-status">
                    <span className="status-turn" id="turnIndicator">{chess.turn === 'w' ? 'White' : 'Black'} to move</span>
                    <span className={`status-badge ${chess.status.type}`} id="gameStatus">{chess.status.text}</span>
                  </div>

                  <div className="board-scroll">
                    <ChessBoard
                      board={chess.board}
                      orientation={orientation}
                      selectedSquare={chess.selectedSquare}
                      legalMoves={chess.legalMoves}
                      lastMove={chess.lastMove}
                      checkedSquare={null}
                      theme={user?.boardTheme || 'classic'}
                      disabled={!chess.gameStarted || chess.gameOver || chess.isReviewing}
                      onSquareClick={chess.handleSquareClick}
                      onDragStart={chess.handleDragStart}
                      onDrop={chess.handleDrop}
                    />
                  </div>

                  {strip(bottomColor)}

                  <div className="board-actions">
                    {!chess.gameStarted ? (
                      <button id="startGameBtn" type="button" className="action-btn primary" onClick={handleStartGame}>
                        Start Game
                      </button>
                    ) : (
                      <button id="startGameBtn" type="button" className="action-btn primary" disabled>
                        Game Started
                      </button>
                    )}
                    <button id="changeTimeBtn" type="button" className="action-btn secondary" onClick={() => setScreen('setup')}>
                      Change Time
                    </button>
                  </div>

                  {chess.gameOver && chess.gameOverInfo && (
                    <div id="gameOverModal" className="game-over-overlay" style={{ display: 'grid' }}>
                      <div className="game-over-card">
                        <button
                          type="button"
                          className="game-over-close"
                          onClick={chess.closeGameOver}
                          aria-label="Close game over"
                        >
                          ✕
                        </button>
                        <div className="go-kicker">Game Over</div>
                        <h2 id="gameOverTitle">{chess.gameOverInfo.title}</h2>
                        <p id="gameOverMessage">{chess.gameOverInfo.message}</p>
                        <div className="go-actions">
                          <button
                            id="newGameBtn"
                            type="button"
                            className="action-btn primary"
                            onClick={() => {
                              const botConfig = isBotMode && selectedBot
                                ? {
                                    ...selectedBot,
                                    skill: Math.max(0, Math.min(20, Math.round((selectedBot.rating - 100) / (3200 - 100) * 20))),
                                    thinkTime: Math.round(200 + ((selectedBot.rating - 100) / (3200 - 100)) * 1800),
                                  }
                                : null;
                              chess.setupGame({
                                minutes: selectedTime?.minutes || 10,
                                increment: selectedTime?.increment || 0,
                                isBot: isBotMode,
                                bot: botConfig,
                                playerColor: savedRef.current.color,
                              });
                            }}
                          >
                            New Game
                          </button>
                          {savedGameId && (
                            <button
                              type="button"
                              className="action-btn secondary"
                              onClick={() => navigate(`/replay/${savedGameId}`)}
                            >
                              ▶ Replay
                            </button>
                          )}
                          <button
                            type="button"
                            className="action-btn secondary"
                            onClick={handlePlayAgain}
                          >
                            ← Back to Play
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </section>

                <aside className="history-panel">
                  <div className="history-head">
                    <div>
                      <div className="hh-label">Match Log</div>
                      <h2>Move History</h2>
                    </div>
                    <span className="move-count-badge" id="moveCount">{chess.history.length}</span>
                  </div>
                  <div className="review-controls">
                    <button id="prevMoveBtn" type="button" title="Previous" disabled={chess.reviewIndex <= 0} onClick={() => chess.goToMove('prev')}>⟵</button>
                    <span id="reviewStatus">{chess.positionHistory.length === 1 ? 'Live' : chess.isReviewing ? `Move ${chess.reviewIndex}/${chess.positionHistory.length - 1}` : 'Live'}</span>
                    <button id="nextMoveBtn" type="button" title="Next" disabled={chess.reviewIndex >= chess.positionHistory.length - 1} onClick={() => chess.goToMove('next')}>⟶</button>
                  </div>
                  <div id="moveHistory" className="move-history">
                    {chess.history.length === 0 ? (
                      <p style={{ color: 'var(--h-muted)' }}>No moves yet.</p>
                    ) : (
                      chess.history.map((move, index) => (
                        <div key={index} className="move-item">
                          <span className="move-num">{index + 1}.</span>
                          <span className="move-san">{move.san}</span>
                          <span className="move-sq">({move.from} → {move.to})</span>
                        </div>
                      ))
                    )}
                  </div>
                </aside>
              </div>
            );
          })()}
        </main>
      </div>
    </>
  );
};

export default Play;