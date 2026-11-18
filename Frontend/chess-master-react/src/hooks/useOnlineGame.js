import { useCallback, useEffect, useRef, useState } from 'react';
import { Chess } from '../lib/chessjs';
import { getSocket } from '../lib/socket';
import api from '../api/axios';

function formatTime(seconds) {
  const s = Math.max(0, seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * Ports public/js/online-game.js to React. Reads the room info that
 * Online.jsx stashes in sessionStorage after a match is found.
 */
export default function useOnlineGame({ user } = {}) {
  const gameRef = useRef(new Chess());
  const socketRef = useRef(null);
  const savedRef = useRef({
    roomId: sessionStorage.getItem('onlineRoomId'),
    playerColor: sessionStorage.getItem('onlineColor'),
    opponent: JSON.parse(sessionStorage.getItem('onlineOpponent') || '{}'),
    timeControl: JSON.parse(sessionStorage.getItem('onlineTimeControl') || '{}'),
  });

  const [fen, setFen] = useState(gameRef.current.fen());
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [lastMove, setLastMove] = useState(null);
  const [history, setHistory] = useState([]);
  const [whiteTime, setWhiteTime] = useState((savedRef.current.timeControl.minutes || 10) * 60);
  const [blackTime, setBlackTime] = useState((savedRef.current.timeControl.minutes || 10) * 60);
  const [gameOver, setGameOver] = useState(false);
  const [gameOverInfo, setGameOverInfo] = useState(null);
  const [drawOffered, setDrawOffered] = useState(false);
  const [canOfferDraw, setCanOfferDraw] = useState(false);
  const [showAbort, setShowAbort] = useState(true);
  const [disconnectMessage, setDisconnectMessage] = useState('');
  const [invalid, setInvalid] = useState(!savedRef.current.roomId || !savedRef.current.playerColor);

  const gameOverRef = useRef(false);
  const savedGameRef = useRef(false);
  const disconnectTimerRef = useRef(null);
  const drawOfferMoveCountRef = useRef(-99);

  const { roomId, playerColor, opponent, timeControl } = savedRef.current;

  useEffect(() => {
  savedGameRef.current = false;
}, [roomId]);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  
  const refresh = useCallback(() => {
    setFen(gameRef.current.fen());
    setHistory(gameRef.current.history({ verbose: true }));
  }, []);

  const saveOnlineGame = useCallback(async (reason) => {
    // Only the white-side client saves, to avoid duplicate rows (mirrors board.js).
    if (playerColor !== 'w' || savedGameRef.current) return;
    savedGameRef.current = true;

    const moveHistory = gameRef.current.history();
    if (moveHistory.length === 0) return;

    const myName = user?.username || 'Player';
    const opponentName = opponent.username || 'Opponent';
    const whitePlayer = myName;
    const blackPlayer = opponentName;

    let winner = 'draw';
    switch (reason) {
      case 'checkmate':
      case 'timeout':
        winner = gameRef.current.turn() === 'w' ? 'black' : 'white';
        break;
      case 'resign':
        winner = playerColor === 'w' ? 'black' : 'white';
        break;
      case 'opponent_resigned':
        winner = playerColor === 'w' ? 'white' : 'black';
        break;
      case 'disconnect':
        winner = playerColor === 'w' ? 'white' : 'black';
        break;
      default:
        winner = 'draw';
    }

    try {
    await api.post('/api/games', {
  whiteUser: playerColor === 'w' ? user?.id : opponent.id,
  blackUser: playerColor === 'b' ? user?.id : opponent.id,
  gameId: roomId,
  whitePlayer,
  blackPlayer,
  winner,
  playerColor,
  timeMode: timeControl.mode,
  timeControl: `${timeControl.minutes}+${timeControl.increment}`,
  increment: timeControl.increment,
  totalMoves: moveHistory.length,
  moves: moveHistory,
});

    } catch (err) {
      console.error('Failed to save online game:', err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerColor, opponent, roomId, timeControl, user]);

  const finish = useCallback((title, message, reason = 'draw') => {
    setGameOver(true);
    setGameOverInfo({ title, message });
    if (disconnectTimerRef.current) clearInterval(disconnectTimerRef.current);
    saveOnlineGame(reason);
  }, [saveOnlineGame]);

  const checkGameOver = useCallback(() => {
    const g = gameRef.current;
    if (g.in_checkmate()) {
      const winner = g.turn() === 'w' ? 'Black' : 'White';
      finish('Checkmate', `${winner} wins by checkmate.`, 'checkmate');
      return true;
    }
    if (g.in_draw()) {
      finish('Draw', 'The game ended in a draw.', 'draw');
      return true;
    }
    return false;
  }, [finish]);

  const afterMove = useCallback((move) => {
    setLastMove({ from: move.from, to: move.to });
    setSelectedSquare(null);
    setLegalMoves([]);
    refresh();
    const totalMoves = gameRef.current.history().length;
    if (totalMoves >= 2) setShowAbort(false);
    if (totalMoves >= 30) {
      setCanOfferDraw(true);
    }
    checkGameOver();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, checkGameOver]);

  useEffect(() => {
    if (invalid) return undefined;
    const socket = getSocket();
    socketRef.current = socket;

    socket.emit('joinOnlineRoom', { roomId });

    const onOpponentMove = (moveData) => {
      const move = gameRef.current.move(moveData);
      if (!move) return;
      afterMove(move);
    };
const onOnlineGameState = (data) => {
  // Rebuild the chess position from all server-side moves
  gameRef.current = new Chess();

  if (Array.isArray(data.moves)) {
    data.moves.forEach((moveData) => {
      gameRef.current.move(moveData);
    });
  }

  // Restore timer
  setWhiteTime(Math.max(0, data.whiteTime));
  setBlackTime(Math.max(0, data.blackTime));

  // Restore board/history
  setFen(gameRef.current.fen());
  setHistory(gameRef.current.history({ verbose: true }));

  // Restore last move highlight
  const restoredHistory = gameRef.current.history({ verbose: true });

  if (restoredHistory.length > 0) {
    const last = restoredHistory[restoredHistory.length - 1];

    setLastMove({
      from: last.from,
      to: last.to
    });
  } else {
    setLastMove(null);
  }

  setSelectedSquare(null);
  setLegalMoves([]);
};
    const onTimerUpdate = (data) => {
      setWhiteTime(Math.max(0, data.whiteTime));
      setBlackTime(Math.max(0, data.blackTime));
    };

    const onTimeOut = ({ winner }) => {
      finish('Time Out', `${winner.charAt(0).toUpperCase() + winner.slice(1)} wins on time!`, 'timeout');
    };

    const onOpponentDisconnected = () => {
      if (gameOverRef.current) return;
      let sec = 30;
      setDisconnectMessage(`Disconnected — auto-win in ${sec}s`);
      disconnectTimerRef.current = setInterval(() => {
        sec -= 1;
        setDisconnectMessage(`Disconnected — auto-win in ${sec}s`);
        if (sec <= 0) {
          clearInterval(disconnectTimerRef.current);
          finish('Opponent Disconnected', 'Your opponent left. You win!', 'disconnect');
        }
      }, 1000);
    };

    const onOpponentReconnected = () => {
      if (disconnectTimerRef.current) clearInterval(disconnectTimerRef.current);
      setDisconnectMessage('');
    };

    const onDrawOffered = () => setDrawOffered(true);
    const onDrawDeclined = () => {
      drawOfferMoveCountRef.current = gameRef.current.history().length;
      setCanOfferDraw(false);
    };
    const onDrawAccepted = () => finish('Draw', 'Both players agreed to a draw.', 'draw');
    const onOpponentResigned = () => finish('Opponent Resigned', 'Your opponent resigned. You win!', 'opponent_resigned');
    const onGameAborted = () => finish('Game Aborted', 'The game was aborted.');
    const onFirstMoveTimeout = () => finish('Game Aborted', 'No moves were made in time. Game aborted.');

    socket.on('opponentMove', onOpponentMove);
    socket.on('timerUpdate', onTimerUpdate);
    socket.on('onlineGameState', onOnlineGameState);
    socket.on('timeOut', onTimeOut);
    socket.on('opponentDisconnected', onOpponentDisconnected);
    socket.on('opponentReconnected', onOpponentReconnected);
    socket.on('drawOffered', onDrawOffered);
    socket.on('drawDeclined', onDrawDeclined);
    socket.on('drawAccepted', onDrawAccepted);
    socket.on('opponentResigned', onOpponentResigned);
    socket.on('gameAborted', onGameAborted);
    socket.on('firstMoveTimeout', onFirstMoveTimeout);

    return () => {
      socket.off('opponentMove', onOpponentMove);
      socket.off('onlineGameState', onOnlineGameState);
      socket.off('timerUpdate', onTimerUpdate);
      socket.off('timeOut', onTimeOut);
      socket.off('opponentDisconnected', onOpponentDisconnected);
      socket.off('opponentReconnected', onOpponentReconnected);
      socket.off('drawOffered', onDrawOffered);
      socket.off('drawDeclined', onDrawDeclined);
      socket.off('drawAccepted', onDrawAccepted);
      socket.off('opponentResigned', onOpponentResigned);
      socket.off('gameAborted', onGameAborted);
      socket.off('firstMoveTimeout', onFirstMoveTimeout);
      if (disconnectTimerRef.current) clearInterval(disconnectTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invalid, roomId, afterMove, finish]);

  const makeMove = useCallback((from, to) => {
    if (gameOverRef.current) return null;
    const move = gameRef.current.move({ from, to, promotion: 'q' });
    if (move) {
      afterMove(move);
      socketRef.current?.emit('onlineMove', { roomId, move: { from: move.from, to: move.to, promotion: 'q' } });
    }
    return move;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, afterMove]);

  const handleSquareClick = useCallback((squareName) => {
    if (gameOverRef.current || gameRef.current.game_over()) return;
    const g = gameRef.current;
    if (g.turn() !== playerColor) return; // not our turn — premoves are omitted in this port
    const piece = g.get(squareName);

    if (!selectedSquare) {
      if (!piece || piece.color !== playerColor) return;
      setSelectedSquare(squareName);
      setLegalMoves(g.moves({ square: squareName, verbose: true }));
      return;
    }

    const move = makeMove(selectedSquare, squareName);
    if (move) return;

    if (piece && piece.color === playerColor) {
      setSelectedSquare(squareName);
      setLegalMoves(g.moves({ square: squareName, verbose: true }));
      return;
    }

    setSelectedSquare(null);
    setLegalMoves([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSquare, playerColor, makeMove]);

  const handleDragStart = useCallback((event, squareName, piece) => {
    if (gameOverRef.current || gameRef.current.turn() !== playerColor || !piece || piece.color !== playerColor) {
      event.preventDefault();
      return;
    }
    setSelectedSquare(squareName);
    setLegalMoves(gameRef.current.moves({ square: squareName, verbose: true }));
    event.dataTransfer.setData('text/plain', squareName);
    event.dataTransfer.effectAllowed = 'move';
  }, [playerColor]);

  const handleDrop = useCallback((event, targetSquare) => {
    event.preventDefault();
    if (gameOverRef.current || !selectedSquare) return;
    const move = makeMove(selectedSquare, targetSquare);
    if (!move) {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }, [selectedSquare, makeMove]);

  const resign = useCallback(() => {
    socketRef.current?.emit('resign', { roomId });
    finish('You Resigned', 'You resigned the game.', 'resign');
  }, [roomId, finish]);

  const offerDraw = useCallback(() => {
    if (!canOfferDraw) return;
    setCanOfferDraw(false);
    socketRef.current?.emit('offerDraw', { roomId });
  }, [roomId, canOfferDraw]);

  const acceptDraw = useCallback(() => {
    setDrawOffered(false);
    socketRef.current?.emit('acceptDraw', { roomId });
    finish('Draw', 'Both players agreed to a draw.', 'draw');
  }, [roomId, finish]);

  const declineDraw = useCallback(() => {
    setDrawOffered(false);
    socketRef.current?.emit('declineDraw', { roomId });
  }, [roomId]);

  const abort = useCallback(() => {
    socketRef.current?.emit('abortGame', { roomId });
    finish('Game Aborted', 'The game was aborted.');
  }, [roomId, finish]);

  const status = (() => {
    const g = gameRef.current;
    if (g.in_checkmate()) return { text: 'Checkmate', type: 'over' };
    if (g.in_check()) return { text: 'Check!', type: 'check' };
    if (g.in_draw()) return { text: 'Draw', type: 'over' };
    return { text: 'Active', type: 'active' };
  })();

  return {
    invalid,
    roomId,
    playerColor,
    opponent,
    timeControl,
    fen,
    board: gameRef.current.board(),
    turn: gameRef.current.turn(),
    selectedSquare,
    legalMoves,
    lastMove,
    history,
    whiteTime,
    blackTime,
    formatTime,
    gameOver,
    gameOverInfo,
    drawOffered,
    canOfferDraw,
    showAbort,
    disconnectMessage,
    status,
    handleSquareClick,
    handleDragStart,
    handleDrop,
    resign,
    offerDraw,
    acceptDraw,
    declineDraw,
    abort,
  };
}
