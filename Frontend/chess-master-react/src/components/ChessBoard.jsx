import { useMemo } from 'react';

const PIECE_IMAGES = {
  wp: 'white-pawn', wr: 'white-rook', wn: 'white-knight',
  wb: 'white-bishop', wq: 'white-queen', wk: 'white-king',
  bp: 'black-pawn', br: 'black-rook', bn: 'black-knight',
  bb: 'black-bishop', bq: 'black-queen', bk: 'black-king',
};

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

const THEMES = {
  classic: { light: '#f0d9b5', dark: '#b58863' },
  midnight: { light: '#6b7fa3', dark: '#2c3e6b' },
  forest: { light: '#ffffdd', dark: '#6faa3f' },
  ocean: { light: '#d6eaf8', dark: '#2e86c1' },
  ruby: { light: '#f5cba7', dark: '#b91c1c' },
  walnut: { light: '#e8d5b0', dark: '#6b4226' },
};

function squareName(row, col) {
  return `${FILES[col]}${8 - row}`;
}

/**
 * board: 8x8 array as returned by chess.js `.board()`
 * orientation: 'w' | 'b' — which side is shown at the bottom
 */
export default function ChessBoard({
  board,
  orientation = 'w',
  selectedSquare = null,
  legalMoves = [],
  lastMove = null,
  checkedSquare = null,
  theme = 'classic',
  disabled = false,
  onSquareClick,
  onDragStart,
  onDrop,
}) {
  const colors = THEMES[theme] || THEMES.classic;

  const squares = useMemo(() => {
    const rows = orientation === 'b' ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
    const cols = orientation === 'b' ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
    const out = [];
    rows.forEach((row) => {
      cols.forEach((col) => {
        out.push({ row, col, name: squareName(row, col), piece: board?.[row]?.[col] || null });
      });
    });
    return out;
  }, [board, orientation]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(8, 1fr)',
        gridTemplateRows: 'repeat(8, 1fr)',
        width: '100%',
        aspectRatio: '1 / 1',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
      }}
    >
      {squares.map(({ row, col, name, piece }) => {
        const isLight = (row + col) % 2 === 0;
        const isSelected = selectedSquare === name;
        const legalMove = legalMoves.find((m) => m.to === name);
        const isLastMove = lastMove && (lastMove.from === name || lastMove.to === name);
        const isChecked = checkedSquare === name;

        let bg = isLight ? colors.light : colors.dark;
        if (isChecked) bg = '#dc2626';
        else if (isLastMove) bg = isLight ? '#fef08a' : '#ca8a04';

        return (
          <div
            key={name}
            onClick={() => onSquareClick && onSquareClick(name)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop && onDrop(e, name)}
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: bg,
              boxShadow: isSelected ? 'inset 0 0 0 4px rgba(250,204,21,0.9)' : isChecked ? 'inset 0 0 0 4px rgba(254,202,202,0.9)' : 'none',
              cursor: disabled ? 'default' : 'pointer',
            }}
          >
            {legalMove && (
              <div
                style={{
                  position: 'absolute',
                  pointerEvents: 'none',
                  zIndex: 20,
                  borderRadius: '50%',
                  ...(legalMove.captured
                    ? { width: '78%', height: '78%', border: '5px solid rgba(250,204,21,0.85)' }
                    : { width: '16px', height: '16px', backgroundColor: 'rgba(250,204,21,0.9)' }),
                }}
              />
            )}
            {piece && (
              <img
                src={`/images/pieces/${PIECE_IMAGES[piece.color + piece.type]}.png`}
                alt={piece.type}
                draggable={!disabled}
                onDragStart={(e) => onDragStart && onDragStart(e, name, piece)}
                style={{
                  position: 'relative',
                  zIndex: 30,
                  width: '82%',
                  height: '82%',
                  objectFit: 'contain',
                  userSelect: 'none',
                  touchAction: 'none',
                  cursor: disabled ? 'default' : 'grab',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
