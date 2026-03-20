import { useEffect, useState } from "react";
import { getAllScores, PlayerScore } from "@/lib/score-manager";
import { useAuth } from "@/lib/auth-context";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Trophy, Medal, Award } from "lucide-react";

const rankIcon = (index: number) => {
  if (index === 0) return <Trophy className="w-5 h-5 text-accent" />;
  if (index === 1) return <Medal className="w-5 h-5 text-muted-foreground" />;
  if (index === 2) return <Award className="w-5 h-5 text-game-draw" />;
  return <span className="text-sm text-muted-foreground font-mono">{index + 1}</span>;
};

const Leaderboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [scores, setScores] = useState<PlayerScore[]>([]);

  useEffect(() => {
    setScores(getAllScores());
  }, []);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              กลับไปเล่นเกม
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">🏆 อันดับคะแนน</h1>
          <div className="w-24" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">ผู้เล่นทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent>
            {scores.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">ยังไม่มีข้อมูลคะแนน</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>ชื่อ</TableHead>
                    <TableHead className="text-center">คะแนน</TableHead>
                    <TableHead className="text-center">ชนะ</TableHead>
                    <TableHead className="text-center">แพ้</TableHead>
                    <TableHead className="text-center">เสมอ</TableHead>
                    <TableHead className="text-center hidden sm:table-cell">Streak สูงสุด</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scores.map((s, i) => (
                    <TableRow
                      key={s.userId}
                      className={s.userId === user?.id ? "bg-primary/5 font-semibold" : ""}
                    >
                      <TableCell>{rankIcon(i)}</TableCell>
                      <TableCell>
                        {s.name}
                        {s.userId === user?.id && (
                          <span className="ml-2 text-xs text-primary">(คุณ)</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center font-mono font-bold text-primary">
                        {s.score}
                      </TableCell>
                      <TableCell className="text-center text-game-win">{s.wins}</TableCell>
                      <TableCell className="text-center text-game-o">{s.losses}</TableCell>
                      <TableCell className="text-center text-muted-foreground">{s.draws}</TableCell>
                      <TableCell className="text-center hidden sm:table-cell font-mono">
                        {s.bestStreak}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Leaderboard;
