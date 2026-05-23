export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'classic' | 'trueFalse' | 'multipleChoice' | 'timeAttack';
export type GameStatus = 'idle' | 'playing' | 'feedback' | 'finished';
export type AnswerOutcome = 'correctFast' | 'correct' | 'incorrect' | 'timeout';

export type UserAnswer = number | boolean | string | null;

export type GameSettings = {
  mode: GameMode;
  difficulty: Difficulty;
  totalQuestions: number;
  dynamicDifficulty: boolean;
  soundEnabled?: boolean;
  timeLimitsMs?: Partial<Record<Difficulty, number>>;
  minTimeLimitMs?: number;
  dynamicDecreaseMs?: number;
  timeAttackTotalMs?: number;
  feedbackDelayMs?: number;
};

export type NormalizedGameSettings = Required<Omit<GameSettings, 'timeLimitsMs'>> & {
  timeLimitsMs: Record<Difficulty, number>;
};

export type Question = {
  id: string;
  prompt: string;
  operationText: string;
  correctAnswer: number;
  options?: number[];
  proposedAnswer?: number;
  statementIsTrue?: boolean;
  timeLimitMs: number;
};

export type AnswerRecord = {
  questionId: string;
  prompt: string;
  correctAnswer: number;
  userAnswer: UserAnswer;
  isCorrect: boolean;
  responseTimeMs: number;
  points: number;
  outcome: AnswerOutcome;
};

export type GameStats = {
  total: number;
  correct: number;
  incorrect: number;
  timeouts: number;
  accuracy: number;
  averageResponseMs: number;
  bestStreak: number;
  finalScore: number;
};

export type GameSummary = {
  id: string;
  playedAt: string;
  settings: NormalizedGameSettings;
  answers: AnswerRecord[];
  stats: GameStats;
};

