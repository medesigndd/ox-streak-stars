import { useState, useEffect, useCallback } from "react";
import { Board, CellValue, GameResult, createEmptyBoard, checkWinner, isBoardFull, getBotMove } from "@/lib/game-logic";
import { recordGameResult, getPlayerScore } from "@/lib/score-manager";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, Trophy, Flame } from "lucide-react";

const GameBoard = () => {
  const { user } = useAuth();
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameResult, setGameResult] = useState<GameResult>(null);
  const [winningCombo, setWinningCombo] = useState<number[] | null>(null);
  const [score, setScore] = useState(0);
  const [winStreak, setWinStreak] = useState(0);
  const [bonusMsg, setBonusMsg] = useState(false);
  const [moveHistory, setMoveHistory] = useState<number[]>([]);

  // Load initial score
  useEffect(() => {
    if (user) {
      const ps = getPlayerScore(user.id, user.name);
      setScore(ps.score);
      setWinStreak(ps.winStreak);
    }
  }, [user]);

  const handleCellClick = useCallback((index: number) => {
    if (!isPlayerTurn || board[index] || gameResult) return;

    const newBoard = [...board];
    newBoard[index] = "X";
    setBoard(newBoard);
    setMoveHistory((prev) => [...prev, index]);

    const { winner, combo } = checkWinner(newBoard);
    if (winner === "X") {
      setWinningCombo(combo);
      setGameResult("win");
      if (user) {
        const { playerScore, bonusAwarded } = recordGameResult(user.id, user.name, "win");
        setScore(playerScore.score);
        setWinStreak(playerScore.winStreak);
        if (bonusAwarded) setBonusMsg(true);
      }
      return;
    }

    if (isBoardFull(newBoard)) {
      setGameResult("draw");
      if (user) {
        const { playerScore } = recordGameResult(user.id, user.name, "draw");
        setScore(playerScore.score);
        setWinStreak(0);
      }
      return;
    }

    setIsPlayerTurn(false);
  }, [board, isPlayerTurn, gameResult, user]);

  // Bot move
  useEffect(() => {
    if (isPlayerTurn || gameResult) return;

    const timer = setTimeout(() => {
      const botIndex = getBotMove(board);
      if (botIndex === -1) return;

      const newBoard = [...board];
      newBoard[botIndex] = "O";
      setBoard(newBoard);
      setMoveHistory((prev) => [...prev, botIndex]);

      const { winner, combo } = checkWinner(newBoard);
      if (winner === "O") {
        setWinningCombo(combo);
        setGameResult("lose");
        if (user) {
          const { playerScore } = recordGameResult(user.id, user.name, "lose");
          setScore(playerScore.score);
          setWinStreak(0);
        }
        return;
      }

      if (isBoardFull(newBoard)) {
        setGameResult("draw");
        if (user) {
          const { playerScore } = recordGameResult(user.id, user.name, "draw");
          setScore(playerScore.score);
          setWinStreak(0);
        }
        return;
      }

      setIsPlayerTurn(true);
    }, 500);

    return () => clearTimeout(timer);
  }, [isPlayerTurn, gameResult, board, user]);

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setIsPlayerTurn(true);
    setGameResult(null);
    setWinningCombo(null);
    setBonusMsg(false);
    setMoveHistory([]);
  };

  const getCellStyle = (index: number, value: CellValue) => {
    const isWinning = winningCombo?.includes(index);
    const base = "flex items-center justify-center text-4xl md:text-5xl font-mono font-bold cursor-pointer transition-all duration-200 aspect-square rounded-lg border-2";

    if (isWinning) return `${base} bg-game-win/20 border-game-win scale-105`;
    if (value === "X") return `${base} text-game-x border-border hover:border-primary/30 bg-card`;
    if (value === "O") return `${base} text-game-o border-border hover:border-primary/30 bg-card`;
    if (gameResult) return `${base} border-border bg-card opacity-50`;
    return `${base} border-border bg-card hover:bg-muted hover:border-primary/50 hover:scale-[1.02]`;
  };

  const resultMessage = () => {
    if (gameResult === "win") return "🎉 คุณชนะ! +1 คะแนน";
    if (gameResult === "lose") return "😔 บอทชนะ! -1 คะแนน";
    if (gameResult === "draw") return "🤝 เสมอ!";
    return isPlayerTurn ? "ตาคุณ (X)" : "บอทกำลังคิด...";
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Score bar */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-card rounded-lg border shadow-sm">
          <Trophy className="w-5 h-5 text-accent" />
          <span className="font-semibold text-foreground">{score} คะแนน</span>
        </div>
        {winStreak > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-accent/10 rounded-lg border border-accent/30">
            <Flame className="w-5 h-5 text-accent" />
            <span className="font-semibold text-accent">ชนะติดต่อกัน {winStreak}</span>
          </div>
        )}
      </div>

      {/* Status */}
      <div className={`text-lg font-semibold px-6 py-2 rounded-full transition-all ${
        gameResult === "win" ? "bg-game-win/15 text-game-win" :
        gameResult === "lose" ? "bg-game-o/15 text-game-o" :
        gameResult === "draw" ? "bg-game-draw/15 text-game-draw" :
        "bg-muted text-foreground"
      }`}>
        {resultMessage()}
      </div>

      {/* Bonus message */}
      {bonusMsg && (
        <div className="animate-bounce-in bg-accent/20 text-accent border border-accent/40 px-6 py-3 rounded-xl font-bold text-center">
          🔥 ชนะ 3 ครั้งติดต่อกัน! ได้คะแนนพิเศษ +1!
        </div>
      )}

      {/* Board */}
      <Card className="p-1 shadow-lg">
        <CardContent className="p-3">
          <div className="grid grid-cols-3 gap-2 w-[280px] md:w-[340px]">
            {board.map((cell, i) => (
              <button
                key={i}
                className={getCellStyle(i, cell)}
                onClick={() => handleCellClick(i)}
                disabled={!!cell || !!gameResult || !isPlayerTurn}
              >
                {cell && (
                  <span className={moveHistory.includes(i) ? "animate-cell-pop" : ""}>
                    {cell}
                  </span>
                )}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reset */}
      {gameResult && (
        <Button onClick={resetGame} size="lg" className="animate-bounce-in gap-2">
          <RotateCcw className="w-4 h-4" />
          เล่นอีกครั้ง
        </Button>
      )}
    </div>
  );
};

export default GameBoard;
