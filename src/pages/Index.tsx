import { useAuth } from "@/lib/auth-context";
import { Navigate, Link } from "react-router-dom";
import GameBoard from "@/components/GameBoard";
import { Button } from "@/components/ui/button";
import { LogOut, BarChart3, Gamepad2 } from "lucide-react";

const Index = () => {
  const { user, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">OX Game</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              สวัสดี, <strong className="text-foreground">{user?.name}</strong>
            </span>
            <Link to="/leaderboard">
              <Button variant="outline" size="sm" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">อันดับ</span>
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout} className="gap-2 text-destructive hover:text-destructive">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">ออก</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Game */}
      <main className="container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-1">Player vs Bot</h2>
          <p className="text-muted-foreground">คุณเป็น X — บอทเป็น O</p>
        </div>
        <GameBoard />
      </main>
    </div>
  );
};

export default Index;
