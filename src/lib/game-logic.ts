export type CellValue = "X" | "O" | null;
export type Board = CellValue[];
export type GameResult = "win" | "lose" | "draw" | null;

export const WINNING_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diagonals
];

export const createEmptyBoard = (): Board => Array(9).fill(null);

export const checkWinner = (board: Board): { winner: CellValue; combo: number[] | null } => {
  for (const combo of WINNING_COMBOS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], combo };
    }
  }
  return { winner: null, combo: null };
};

export const isBoardFull = (board: Board): boolean => board.every((cell) => cell !== null);

export const getAvailableMoves = (board: Board): number[] =>
  board.reduce<number[]>((moves, cell, i) => (cell === null ? [...moves, i] : moves), []);

// Bot AI: mix of smart + random for fair difficulty
export const getBotMove = (board: Board): number => {
  const available = getAvailableMoves(board);
  if (available.length === 0) return -1;

  // 1. Win if possible
  for (const move of available) {
    const test = [...board];
    test[move] = "O";
    if (checkWinner(test).winner === "O") return move;
  }

  // 2. Block player win
  for (const move of available) {
    const test = [...board];
    test[move] = "X";
    if (checkWinner(test).winner === "X") return move;
  }

  // 3. Take center
  if (board[4] === null) return 4;

  // 4. Take a corner
  const corners = [0, 2, 6, 8].filter((i) => board[i] === null);
  if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];

  // 5. Random
  return available[Math.floor(Math.random() * available.length)];
};
