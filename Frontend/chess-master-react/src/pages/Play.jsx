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
        await api.post('/api/games', {
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
      } catch (err) {
        console.error('Auto-save game failed:', err);
      }
    },
  });

  // Screen states: 'mode' | 'bot' | 'time' | 'setup' | 'game'
  const [screen, setScreen] = useState('mode');
  const [isBotMode, setIsBotMode] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);
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

  // Bot data (32 bots, 100-3200 rating)
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

  const handleSelectHuman = () => {
    setIsBotMode(false);
    setScreen('time');
  };

  const handleSelectBot = () => {
    setIsBotMode(true);
    setScreen('bot');
  };

  const handleSelectOnline = () => {
    navigate('/online');
  };

  const handleSelectBotCard = (bot) => {
    setSelectedBot(bot);
    setScreen('time');
  };

  const handleSelectTime = (option) => {
    setSelectedTime(option);
    setScreen('setup');
  };

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

  const handleStartGame = () => {
    chess.startGame();
  };

  // Board orientation always matches the human player's chosen side.
  // (For pass-and-play, White always sits at the bottom, matching the
  // original EJS app.)
  const playerColorForBot = () => (isBotMode ? savedRef.current.color : 'w');
  const botColor = () => (savedRef.current.color === 'w' ? 'b' : 'w');

  const handlePlayAgain = () => {
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

  // Set board theme for external JS
  useEffect(() => {
    window.BOARD_THEME = user?.boardTheme || 'classic';
  }, [user]);

  return (
    <>
      <style>{`
        :root {
          --gold-primary: #d4af37;
          --gold-light: #f3e5ab;
          --gold-dark: #aa7c11;
          --gold-gradient: linear-gradient(135deg, #fce082 0%, #d4af37 50%, #996515 100%);
          --gold-glow: 0 0 25px rgba(212, 175, 55, 0.22);
          --bg-dark: #0a0908;
          --bg-card: rgba(18, 15, 11, 0.85);
          --border-gold: rgba(212, 175, 55, 0.28);
          --border-gold-hover: rgba(212, 175, 55, 0.6);
          --text-main: #fefcf0;
          --text-muted: #c5a880;
          --text-faint: #8c7355;
          --input-bg: rgba(25, 20, 14, 0.7);
        }

        .play-page {
          background-color: var(--bg-dark);
          background-image: 
            radial-gradient(circle at 50% 10%, rgba(212, 175, 55, 0.12) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(170, 124, 17, 0.08) 0%, transparent 60%);
          background-attachment: fixed;
          color: var(--text-main);
          min-height: 100vh;
          font-family: 'Inter', sans-serif;
        }

        .play-screen {
          max-width: 860px;
          margin: 0 auto;
          padding: 80px 24px;
          animation: fadeUp 0.4s ease both;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .play-kicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold-primary);
          margin-bottom: 10px;
          display: block;
          font-weight: 600;
        }

        .play-title {
          font-family: 'Fraunces', serif;
          font-size: clamp(2rem, 5vw, 3rem);
          font-weight: 800;
          color: var(--gold-light);
          margin: 0 0 10px;
          letter-spacing: -0.02em;
          line-height: 1.1;
        }

        .play-sub {
          color: var(--text-muted);
          font-size: 15px;
          margin: 0 0 44px;
          line-height: 1.6;
        }

        /* Mode Cards */
        .mode-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 780px) {
          .mode-grid { grid-template-columns: 1fr; }
        }

        .mode-card {
          background: var(--bg-card);
          border: 1px solid var(--border-gold);
          border-radius: 18px;
          padding: 36px 28px;
          cursor: pointer;
          transition: border-color 0.25s, background 0.25s, transform 0.2s, box-shadow 0.25s;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(12px);
        }

        .mode-card::before {
          content: '';
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.3s;
          pointer-events: none;
        }

        .mode-card.friend::before {
          background: radial-gradient(ellipse at top left, rgba(212, 175, 55, 0.18), transparent 70%);
        }

        .mode-card.bot::before {
          background: radial-gradient(ellipse at top left, rgba(243, 229, 171, 0.18), transparent 70%);
        }

        .mode-card.online::before {
          background: radial-gradient(ellipse at top left, rgba(170, 124, 17, 0.25), transparent 70%);
        }

        .mode-card:hover {
          border-color: var(--border-gold-hover);
          background: rgba(30, 24, 16, 0.85);
          transform: translateY(-3px);
          box-shadow: var(--gold-glow);
        }

        .mode-card:hover::before { opacity: 1; }

        .mode-icon {
          font-size: 2.6rem;
          margin-bottom: 16px;
          display: block;
        }

        .mode-card h3 {
          font-family: 'Fraunces', serif;
          font-size: 20px;
          font-weight: 700;
          color: var(--gold-light);
          margin: 0 0 8px;
        }

        .mode-card p {
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.6;
          margin: 0 0 24px;
        }

        .mode-btn {
          width: 100%;
          padding: 13px;
          background: rgba(212, 175, 55, 0.12);
          border: 1px solid var(--border-gold);
          border-radius: 10px;
          color: var(--gold-light);
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.25s;
        }

        .mode-btn:hover {
          background: var(--gold-gradient);
          border-color: var(--gold-primary);
          color: #0a0908;
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }

        /* Bot Grid */
        .bot-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 10px;
          margin-top: 32px;
        }

        .bot-card {
          background: var(--bg-card);
          border: 1px solid var(--border-gold);
          border-radius: 12px;
          padding: 16px 10px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.15s, box-shadow 0.2s;
        }

        .bot-card:hover {
          border-color: var(--gold-primary);
          background: rgba(212, 175, 55, 0.15);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
        }

        .bot-card.selected {
          border-color: var(--gold-light);
          background: var(--gold-gradient);
          color: #0a0908;
        }

        .bot-card.selected .bot-name,
        .bot-card.selected .bot-title,
        .bot-card.selected .bot-rating {
          color: #0a0908 !important;
        }

        .bot-icon { font-size: 1.5rem; margin-bottom: 6px; }
        .bot-name { font-size: 12px; font-weight: 600; color: var(--text-main); }
        .bot-rating {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          margin: 2px 0;
          color: var(--gold-primary);
        }
        .bot-title { font-size: 10px; color: var(--text-muted); }

        .bot-card[data-level="beginner"] .bot-rating { color: #6ee7b7; }
        .bot-card[data-level="novice"] .bot-rating { color: #93c5fd; }
        .bot-card[data-level="intermediate"] .bot-rating { color: var(--gold-light); }
        .bot-card[data-level="club"] .bot-rating { color: #fbbf24; }
        .bot-card[data-level="advanced"] .bot-rating { color: #fb923c; }
        .bot-card[data-level="expert"] .bot-rating { color: #f87171; }
        .bot-card[data-level="master"] .bot-rating { color: #e879f9; }
        .bot-card[data-level="gm"] .bot-rating { color: #ffffff; }

        /* Time Control */
        .time-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-top: 32px;
        }

        @media (max-width: 600px) {
          .time-grid { grid-template-columns: 1fr; }
        }

        .time-card {
          background: var(--bg-card);
          border: 1px solid var(--border-gold);
          border-radius: 14px;
          padding: 24px 18px;
          transition: border-color 0.2s, box-shadow 0.2s;
          backdrop-filter: blur(12px);
        }

        .time-card:hover {
          border-color: var(--gold-primary);
          box-shadow: var(--gold-glow);
        }

        .time-card h3 {
          font-family: 'Fraunces', serif;
          font-size: 16px;
          font-weight: 700;
          color: var(--gold-light);
          margin: 0 0 6px;
        }

        .time-card p {
          font-size: 12px;
          color: var(--text-muted);
          margin: 0 0 16px;
          line-height: 1.5;
        }

        .time-btns {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .time-btns button {
          padding: 10px;
          background: rgba(25, 20, 14, 0.6);
          border: 1px solid var(--border-gold);
          border-radius: 8px;
          color: var(--text-main);
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .time-btns button:hover {
          border-color: var(--gold-primary);
          color: #0a0908;
          background: var(--gold-gradient);
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.25);
        }

        /* Player Setup */
        .player-form {
          max-width: 440px;
          margin: 40px auto 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .player-form label {
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.12em;
          color: var(--gold-light);
          text-transform: uppercase;
        }

        .player-form input {
          padding: 14px 16px;
          background: var(--input-bg);
          border: 1px solid var(--border-gold);
          border-radius: 10px;
          color: var(--text-main);
          font-size: 15px;
          font-family: 'Inter', sans-serif;
          outline: none;
          transition: all 0.25s ease;
        }

        .player-form input:focus {
          border-color: var(--gold-primary);
          box-shadow: 0 0 12px rgba(212, 175, 55, 0.25);
          background: rgba(30, 24, 16, 0.85);
        }

        .player-form input::placeholder {
          color: var(--text-faint);
        }

        .continue-btn {
          padding: 14px;
          background: var(--gold-gradient);
          border: none;
          border-radius: 10px;
          color: #0a0908;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
          margin-top: 8px;
        }

        .continue-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
          filter: brightness(1.05);
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 24px;
          padding: 10px 20px;
          background: rgba(10, 9, 8, 0.4);
          border: 1px solid var(--border-gold);
          border-radius: 8px;
          color: var(--text-muted);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'Inter', sans-serif;
        }

        .back-btn:hover {
          border-color: var(--gold-primary);
          color: var(--gold-light);
          background: rgba(212, 175, 55, 0.05);
        }

        /* Game Layout */
        .game-layout {
          display: grid;
          grid-template-columns: minmax(0, 560px) 300px;
          gap: 20px;
          max-width: 900px;
          margin: 0 auto;
          padding: 32px 24px 60px;
          animation: fadeUp 0.4s ease both;
        }

        @media (max-width: 900px) {
          .game-layout { grid-template-columns: 1fr; }
        }

        .board-shell {
          background: var(--bg-card);
          border: 1px solid var(--border-gold);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), var(--gold-glow);
          backdrop-filter: blur(12px);
          position: relative;
        }

        .player-strip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          background: rgba(25, 20, 14, 0.6);
          border-radius: 10px;
          border: 1px solid var(--border-gold);
          transition: all 0.25s ease;
        }

        .player-strip .ps-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .ps-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          flex-shrink: 0;
        }

        .ps-avatar.white-av {
          background: var(--gold-light);
          color: #0a0908;
          font-weight: bold;
        }

        .ps-avatar.black-av {
          background: #120f0b;
          border: 1px solid var(--gold-dark);
          color: var(--gold-light);
        }

        .ps-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-main);
        }

        .ps-thinking {
          font-size: 11px;
          color: var(--gold-primary);
          display: none;
          animation: pulse 1.2s ease-in-out infinite;
          font-family: 'JetBrains Mono', monospace;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .ps-clock {
          font-family: 'JetBrains Mono', monospace;
          font-size: 20px;
          font-weight: 700;
          color: var(--gold-light);
          min-width: 70px;
          text-align: right;
        }

        .player-strip.active-turn {
          border-color: var(--gold-primary);
          background: rgba(212, 175, 55, 0.12);
          box-shadow: inset 0 0 10px rgba(212, 175, 55, 0.15);
        }

        .player-strip.active-turn .ps-clock {
          color: var(--gold-primary);
        }

        .player-strip.low-time .ps-clock {
          color: #ef4444;
        }

        .board-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13px;
        }

        .status-turn {
          color: var(--text-muted);
          font-family: 'Inter', sans-serif;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-family: 'Syne', sans-serif;
          font-weight: 600;
        }

        .status-badge.active {
          background: rgba(212, 175, 55, 0.15);
          color: var(--gold-light);
          border: 1px solid var(--border-gold);
        }

        .status-badge.check {
          background: rgba(250, 204, 21, 0.15);
          color: #facc15;
          border: 1px solid rgba(250, 204, 21, 0.3);
        }

        .status-badge.over {
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .board-scroll {
          width: 100%;
          aspect-ratio: 1;
        }

        .cm-game-board {
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          width: 100%;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid var(--border-gold);
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
        }

        .board-actions {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          flex: 1;
          padding: 11px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.25s ease;
          font-family: 'Syne', sans-serif;
        }

        .action-btn.primary {
          background: var(--gold-gradient);
          border: none;
          color: #0a0908;
          font-weight: 700;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.2);
        }

        .action-btn.primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
          filter: brightness(1.05);
        }

        .action-btn.primary:disabled {
          background: rgba(25, 20, 14, 0.5);
          border: 1px solid var(--border-gold);
          color: var(--text-faint);
          cursor: not-allowed;
          box-shadow: none;
          filter: none;
        }

        .action-btn.secondary {
          background: rgba(10, 9, 8, 0.4);
          border: 1px solid var(--border-gold);
          color: var(--text-muted);
        }

        .action-btn.secondary:hover {
          border-color: var(--gold-primary);
          color: var(--gold-light);
          background: rgba(212, 175, 55, 0.05);
        }

        .game-over-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10, 9, 8, 0.85);
          border-radius: 20px;
          display: none;
          place-items: center;
          backdrop-filter: blur(8px);
          z-index: 50;
        }

        .game-over-overlay.show {
          display: grid;
        }

        .game-over-card {
          background: var(--bg-card);
          border: 1px solid var(--gold-primary);
          border-radius: 18px;
          padding: 40px 36px;
          text-align: center;
          max-width: 320px;
          width: 90%;
          box-shadow: 0 0 50px rgba(212, 175, 55, 0.3);
        }

        .go-kicker {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          color: var(--gold-primary);
          text-transform: uppercase;
          margin-bottom: 10px;
          font-weight: 600;
        }

        .game-over-card h2 {
          font-family: 'Fraunces', serif;
          font-size: 28px;
          font-weight: 800;
          color: var(--gold-light);
          margin: 0 0 8px;
        }

        .game-over-card p {
          color: var(--text-muted);
          font-size: 14px;
          margin: 0 0 28px;
        }

        .go-actions {
          display: flex;
          gap: 10px;
        }

        /* History Panel */
        .history-panel {
          background: var(--bg-card);
          border: 1px solid var(--border-gold);
          border-radius: 20px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-height: 700px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(12px);
        }

        .history-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .hh-label {
          font-size: 11px;
          color: var(--gold-primary);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 2px;
          font-family: 'JetBrains Mono', monospace;
          font-weight: 600;
        }

        .history-head h2 {
          font-family: 'Fraunces', serif;
          font-size: 16px;
          font-weight: 700;
          color: var(--gold-light);
          margin: 0;
        }

        .move-count-badge {
          background: rgba(212, 175, 55, 0.15);
          border: 1px solid var(--border-gold);
          color: var(--gold-light);
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 20px;
        }

        .review-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(25, 20, 14, 0.6);
          border-radius: 10px;
          padding: 10px 12px;
          border: 1px solid var(--border-gold);
        }

        .review-controls button {
          background: transparent;
          border: 1px solid var(--border-gold);
          border-radius: 6px;
          color: var(--text-muted);
          padding: 5px 12px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .review-controls button:hover:not(:disabled) {
          border-color: var(--gold-primary);
          color: var(--gold-light);
          background: rgba(212, 175, 55, 0.1);
        }

        .review-controls button:disabled {
          opacity: 0.25;
          cursor: not-allowed;
        }

        .review-controls span {
          flex: 1;
          text-align: center;
          font-size: 12px;
          color: var(--text-muted);
          font-family: 'Syne', sans-serif;
        }

        .move-history {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 6px;
          scrollbar-width: thin;
          scrollbar-color: var(--border-gold) transparent;
        }

        .move-history p {
          color: var(--text-faint);
          font-size: 13px;
        }

        .move-item {
          background: rgba(25, 20, 14, 0.5);
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
        }

        .move-num {
          color: var(--gold-primary);
          font-weight: 700;
          margin-right: 4px;
          font-family: 'JetBrains Mono', monospace;
        }

        .move-san {
          color: var(--text-main);
          font-weight: 500;
        }

        .move-sq {
          color: var(--text-faint);
          font-size: 11px;
          margin-left: 6px;
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

                {/* Status */}
                <div className="board-status">
                  <span className="status-turn" id="turnIndicator">{chess.turn === 'w' ? 'White' : 'Black'} to move</span>
                  <span className={`status-badge ${chess.status.type}`} id="gameStatus">{chess.status.text}</span>
                </div>

                {/* Board */}
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

                {/* Actions */}
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

                {/* Game Over Overlay */}
                {chess.gameOver && chess.gameOverInfo && (
                  <div id="gameOverModal" className="game-over-overlay" style={{ display: 'grid' }}>
                    <div className="game-over-card">
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

              {/* History Panel */}
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
                    <p style={{ color: '#8c7355' }}>No moves yet.</p>
                  ) : (
                    chess.history.map((move, index) => (
                      <div key={index} style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '10px', padding: '10px 14px', marginBottom: '6px', fontSize: '14px' }}>
                        <span style={{ color: 'var(--gold-primary)', fontWeight: 700 }}>{index + 1}.</span> {move.san}
                        <span style={{ color: 'var(--text-faint)', fontSize: '11px', marginLeft: '6px' }}>({move.from} → {move.to})</span>
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