import { useCallback, useEffect, useRef, useState } from 'react';
import { Chess } from '../lib/chessjs';

// Same 32-bot roster the EJS bot.js generated (rating 100 -> 3200)
export function buildBots() {
  return Array.from({ length: 32 }, (_, i) => {
    const rating = Math.round(100 + (i * (3200 - 100)) / 31);
    const skill = Math.round((i / 31) * 20);
    const thinkTime = 200 + Math.round((i / 31) * 1800);
    const levels = ['beginner','beginner','beginner','beginner','novice','novice','novice','novice','intermediate','intermediate','intermediate','intermediate','club','club','club','club','advanced','advanced','advanced','advanced','expert','expert','expert','expert','master','master','master','master','master','gm','gm','gm'];
    const titles = ['Beginner','Beginner','Beginner','Beginner','Novice','Novice','Novice','Novice','Intermediate','Intermediate','Intermediate','Intermediate','Club Player','Club Player','Club Player','Club Player','Advanced','Advanced','Advanced','Advanced','Expert','Expert','Expert','Expert','Candidate Master','Candidate Master','FIDE Master','FIDE Master',"Int'l Master",'Grandmaster','Grandmaster','Super GM'];
    return { id: i + 1, name: `Bot ${i + 1}`, rating, skill, thinkTime, title: titles[i], level: levels[i] };
  });
}

function formatTime(seconds) {
  const safe = Math.max(0, seconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * Local game engine hook — ports public/js/board.js + public/js/bot.js.
 * Drives a single local Chess() instance for pass-and-play and bot games.
 */
export default function useChessGame({ onGameOver } = {}) {
  const gameRef = useRef(new Chess());
  const [fen, setFen] = useState(gameRef.current.fen());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [history, setHistory] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverInfo, setGameOverInfo] = useState(null);
  const [whiteTime, setWhiteTime] = useState(0);
  const [blackTime, setBlackTime] = useState(0);
  const [positionHistory, setPositionHistory] = useState([gameRef.current.fen()]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [isReviewing, setIsReviewing] = useState(false);
  const [botThinking, setBotThinking] = useState(false);

  const timerRef = useRef(null);
  const incrementRef = useRef(0);
  const botModeRef = useRef(false);
  const selectedBotRef = useRef(null);
  const playerColorRef = useRef('w');
  const stockfishRef = useRef(null);
  const gameOverRef = useRef(false);
  const botRequestIdRef = useRef(0);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  const refreshBoardState = useCallback(() => {
    const g = gameRef.current;
    setFen(g.fen());
    setHistory(g.history({ verbose: true }));
  }, []);

  const initStockfish = useCallback(() => {
    if (stockfishRef.current) return stockfishRef.current;
    try {
      const worker = new Worker('/stockfish.js');
      worker.addEventListener('message', (e) => {
        const msg = e.data;
        if (typeof msg !== 'string') return;
        if (msg.startsWith('bestmove')) {
          const moveStr = msg.split(' ')[1];
          setBotThinking(false);
          if (!moveStr || moveStr === '(none)') return;
          if (gameOverRef.current) return;
          const from = moveStr.slice(0, 2);
          const to = moveStr.slice(2, 4);
          const promotion = moveStr.length > 4 ? moveStr[4] : 'q';
          const move = gameRef.current.move({ from, to, promotion });
          if (move) afterSuccessfulMoveRef.current(move);
        }
      });
      worker.postMessage('uci');
      worker.postMessage('isready');
      stockfishRef.current = worker;
      return worker;
    } catch (err) {
      console.error('Stockfish worker failed to start:', err);
      return null;
    }
  }, []);

  const getWinner = useCallback(() => {
    const g = gameRef.current;
    if (g.in_draw()) return 'draw';
    if (g.in_checkmate()) return g.turn() === 'w' ? 'black' : 'white';
    if (whiteTime <= 0) return 'black';
    if (blackTime <= 0) return 'white';
    return 'draw';
  }, [whiteTime, blackTime]);

  const finishGame = useCallback((title, message) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameStarted(false);
    setGameOver(true);
    setIsReviewing(false);
    setGameOverInfo({ title, message });
    if (onGameOver) {
      onGameOver({ title, message, winner: getWinner(), history: gameRef.current.history() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getWinner, onGameOver]);

  const checkGameOver = useCallback(() => {
    const g = gameRef.current;
    if (g.in_checkmate()) {
      const winner = g.turn() === 'w' ? 'Black' : 'White';
      finishGame('Checkmate', `${winner} wins by checkmate.`);
      return true;
    }
    if (g.in_draw()) {
      finishGame('Draw', 'The game ended in a draw.');
      return true;
    }
    return false;
  }, [finishGame]);

  // afterSuccessfulMove is referenced from inside the Stockfish worker's
  // message handler (registered once in initStockfish), so we keep a ref
  // to the latest version to avoid a stale closure there.
  const afterSuccessfulMoveRef = useRef(() => {});

  const afterSuccessfulMove = useCallback((move) => {
    setLastMove({ from: move.from, to: move.to });
    if (incrementRef.current > 0) {
      if (move.color === 'w') setWhiteTime((t) => t + incrementRef.current);
      else setBlackTime((t) => t + incrementRef.current);
    }
    const g = gameRef.current;
    setPositionHistory((prev) => {
      const next = [...prev, g.fen()];
      setReviewIndex(next.length - 1);
      return next;
    });
    setIsReviewing(false);
    setSelectedSquare(null);
    setLegalMoves([]);
    refreshBoardState();
    checkGameOver();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshBoardState, checkGameOver]);

  useEffect(() => {
    afterSuccessfulMoveRef.current = afterSuccessfulMove;
  }, [afterSuccessfulMove]);

  // ── Bot move trigger ──────────────────────────────────────────────
  // Driven by an effect (not a manually-called function) so it can never
  // go stale: whenever the position, game-started flag, or game-over flag
  // changes, we simply check "is it the bot's turn right now?" and, if so,
  // kick off a Stockfish search.
  useEffect(() => {
    if (!gameStarted || gameOver || !botModeRef.current || !selectedBotRef.current) return;
    const botColor = playerColorRef.current === 'w' ? 'b' : 'w';
    if (gameRef.current.turn() !== botColor) return;

    const requestId = ++botRequestIdRef.current;
    const timeout = setTimeout(() => {
      if (botRequestIdRef.current !== requestId) return; // superseded
      if (gameOverRef.current) return;
      const worker = stockfishRef.current || initStockfish();
      if (!worker) return;
      setBotThinking(true);
      worker.postMessage(`setoption name Skill Level value ${selectedBotRef.current.skill}`);
      worker.postMessage(`position fen ${gameRef.current.fen()}`);
      worker.postMessage(`go movetime ${selectedBotRef.current.thinkTime}`);
    }, 250);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fen, gameStarted, gameOver, initStockfish]);

  const isBotTurn = useCallback(() => {
    if (!botModeRef.current) return false;
    const botColor = playerColorRef.current === 'b' ? 'w' : 'b';
    return gameRef.current.turn() === botColor;
  }, []);

  const trySquareMove = useCallback((from, to) => {
    const move = gameRef.current.move({ from, to, promotion: 'q' });
    if (move) {
      afterSuccessfulMove(move);
      return move;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [afterSuccessfulMove]);

  const selectSquare = useCallback((squareName) => {
    setSelectedSquare(squareName);
    setLegalMoves(gameRef.current.moves({ square: squareName, verbose: true }));
  }, []);

  const handleSquareClick = useCallback((squareName) => {
    if (!gameStarted || isReviewing || gameOverRef.current) return;
    if (isBotTurn()) return;
    const g = gameRef.current;
    const piece = g.get(squareName);

    if (!selectedSquare) {
      if (!piece || piece.color !== g.turn()) return;
      selectSquare(squareName);
      return;
    }

    const move = trySquareMove(selectedSquare, squareName);
    if (move) return;

    if (piece && piece.color === g.turn()) {
      selectSquare(squareName);
      return;
    }

    setSelectedSquare(null);
    setLegalMoves([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted, isReviewing, isBotTurn, selectedSquare, selectSquare, trySquareMove]);

  const handleDragStart = useCallback((event, squareName, piece) => {
    if (!gameStarted || isReviewing || gameOverRef.current || isBotTurn()) {
      event.preventDefault();
      return;
    }
    if (!piece || piece.color !== gameRef.current.turn()) {
      event.preventDefault();
      return;
    }
    selectSquare(squareName);
    event.dataTransfer.setData('text/plain', squareName);
    event.dataTransfer.effectAllowed = 'move';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted, isReviewing, isBotTurn, selectSquare]);

  const handleDrop = useCallback((event, targetSquare) => {
    event.preventDefault();
    if (!gameStarted || isReviewing || gameOverRef.current || !selectedSquare) return;
    const move = trySquareMove(selectedSquare, targetSquare);
    if (!move) {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted, isReviewing, selectedSquare, trySquareMove]);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      const g = gameRef.current;
      if (gameOverRef.current || g.in_checkmate() || g.in_draw()) {
        clearInterval(timerRef.current);
        checkGameOver();
        return;
      }
      if (g.turn() === 'w') {
        setWhiteTime((t) => {
          const next = t - 1;
          if (next <= 0) finishGame('Time Out', 'Black wins on time.');
          return Math.max(0, next);
        });
      } else {
        setBlackTime((t) => {
          const next = t - 1;
          if (next <= 0) finishGame('Time Out', 'White wins on time.');
          return Math.max(0, next);
        });
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkGameOver, finishGame]);

  const setupGame = useCallback(({ minutes, increment, isBot, bot, playerColor }) => {
    gameRef.current.reset();
    incrementRef.current = increment || 0;
    botModeRef.current = !!isBot;
    selectedBotRef.current = bot || null;
    playerColorRef.current = playerColor || 'w';
    setWhiteTime(minutes * 60);
    setBlackTime(minutes * 60);
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setGameOver(false);
    setGameOverInfo(null);
    setPositionHistory([gameRef.current.fen()]);
    setReviewIndex(0);
    setIsReviewing(false);
    setBotThinking(false);
    refreshBoardState();
    if (isBot) initStockfish();
  }, [refreshBoardState, initStockfish]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    startTimer();
  }, [startTimer]);

  const goToMove = useCallback((direction) => {
    setReviewIndex((idx) => {
      const next = direction === 'prev' ? Math.max(0, idx - 1) : Math.min(positionHistory.length - 1, idx + 1);
      setIsReviewing(next !== positionHistory.length - 1);
      setSelectedSquare(null);
      setLegalMoves([]);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionHistory.length]);

  const displayGame = useCallback(() => {
    if (!isReviewing) return gameRef.current;
    const g = new Chess();
    g.load(positionHistory[reviewIndex]);
    return g;
  }, [isReviewing, positionHistory, reviewIndex]);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (stockfishRef.current) stockfishRef.current.terminate();
  }, []);

  const status = (() => {
    const g = gameRef.current;
    if (g.in_checkmate()) return { text: 'Checkmate', type: 'over' };
    if (g.in_check()) return { text: 'Check', type: 'check' };
    if (g.in_draw()) return { text: 'Draw', type: 'over' };
    return { text: 'Active', type: 'active' };
  })();

  return {
    game: gameRef.current,
    fen,
    board: displayGame().board(),
    turn: gameRef.current.turn(),
    selectedSquare,
    legalMoves,
    lastMove: isReviewing ? null : lastMove,
    history,
    positionHistory,
    reviewIndex,
    isReviewing,
    gameStarted,
    gameOver,
    gameOverInfo,
    botThinking,
    whiteTime,
    blackTime,
    formatTime,
    status,
    isBotTurn,
    setupGame,
    startGame,
    handleSquareClick,
    handleDragStart,
    handleDrop,
    goToMove,
    getWinner,
  };
}
