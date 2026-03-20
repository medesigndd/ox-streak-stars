export interface PlayerScore {
  userId: string;
  name: string;
  score: number;
  wins: number;
  losses: number;
  draws: number;
  winStreak: number;
  bestStreak: number;
  gamesPlayed: number;
}

const STORAGE_KEY = "ox_scores";

const loadScores = (): Record<string, PlayerScore> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveScores = (scores: Record<string, PlayerScore>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
};

export const getPlayerScore = (userId: string, name: string): PlayerScore => {
  const scores = loadScores();
  if (!scores[userId]) {
    scores[userId] = {
      userId,
      name,
      score: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winStreak: 0,
      bestStreak: 0,
      gamesPlayed: 0,
    };
    saveScores(scores);
  }
  return scores[userId];
};

export const recordGameResult = (
  userId: string,
  name: string,
  result: "win" | "lose" | "draw"
): { playerScore: PlayerScore; bonusAwarded: boolean } => {
  const scores = loadScores();
  const player = scores[userId] || getPlayerScore(userId, name);
  player.name = name;
  player.gamesPlayed++;

  let bonusAwarded = false;

  if (result === "win") {
    player.score += 1;
    player.wins++;
    player.winStreak++;
    if (player.winStreak > player.bestStreak) {
      player.bestStreak = player.winStreak;
    }
    // 3 consecutive wins bonus
    if (player.winStreak >= 3 && player.winStreak % 3 === 0) {
      player.score += 1;
      bonusAwarded = true;
      player.winStreak = 0; // reset streak count
    }
  } else if (result === "lose") {
    player.score -= 1;
    player.losses++;
    player.winStreak = 0;
  } else {
    player.draws++;
    // draw doesn't break win streak per requirements
    // Actually, let's keep streak only for consecutive wins
    // A draw is not a win, so reset
    player.winStreak = 0;
  }

  scores[userId] = player;
  saveScores(scores);
  return { playerScore: player, bonusAwarded };
};

export const getAllScores = (): PlayerScore[] => {
  const scores = loadScores();
  return Object.values(scores).sort((a, b) => b.score - a.score);
};
