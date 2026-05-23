import type {
  AnswerOutcome,
  Difficulty,
  GameMode,
  GameSettings,
  NormalizedGameSettings,
  Question,
  UserAnswer,
} from './gameTypes';

export const DEFAULT_TIME_LIMITS_MS: Record<Difficulty, number> = {
  easy: 12000,
  medium: 9000,
  hard: 6000,
};

export const SCORE_BY_OUTCOME: Record<AnswerOutcome, number> = {
  correctFast: 100,
  correct: 70,
  incorrect: -30,
  timeout: -50,
};

export const DEFAULT_SETTINGS: NormalizedGameSettings = {
  mode: 'classic',
  difficulty: 'easy',
  totalQuestions: 10,
  dynamicDifficulty: true,
  soundEnabled: true,
  timeLimitsMs: DEFAULT_TIME_LIMITS_MS,
  minTimeLimitMs: 2500,
  dynamicDecreaseMs: 400,
  timeAttackTotalMs: 60000,
  feedbackDelayMs: 650,
};

export function normalizeSettings(settings?: Partial<GameSettings>): NormalizedGameSettings {
  const timeLimitsMs = {
    ...DEFAULT_TIME_LIMITS_MS,
    ...settings?.timeLimitsMs,
  };

  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    timeLimitsMs,
    totalQuestions: Math.max(
      1,
      Math.floor(settings?.totalQuestions ?? DEFAULT_SETTINGS.totalQuestions),
    ),
    minTimeLimitMs: Math.max(
      1000,
      settings?.minTimeLimitMs ?? DEFAULT_SETTINGS.minTimeLimitMs,
    ),
    dynamicDecreaseMs: Math.max(
      0,
      settings?.dynamicDecreaseMs ?? DEFAULT_SETTINGS.dynamicDecreaseMs,
    ),
    timeAttackTotalMs: Math.max(
      10000,
      settings?.timeAttackTotalMs ?? DEFAULT_SETTINGS.timeAttackTotalMs,
    ),
    feedbackDelayMs: Math.max(
      0,
      settings?.feedbackDelayMs ?? DEFAULT_SETTINGS.feedbackDelayMs,
    ),
    soundEnabled: settings?.soundEnabled ?? DEFAULT_SETTINGS.soundEnabled,
  };
}

export function getTimeLimitMs(settings: NormalizedGameSettings, questionIndex: number) {
  const baseTime = settings.timeLimitsMs[settings.difficulty];

  if (!settings.dynamicDifficulty) {
    return baseTime;
  }

  return Math.max(settings.minTimeLimitMs, baseTime - questionIndex * settings.dynamicDecreaseMs);
}

export function validateAnswer(question: Question, mode: GameMode, answer: UserAnswer) {
  if (mode === 'trueFalse') {
    return Boolean(answer) === question.statementIsTrue;
  }

  const numericAnswer = typeof answer === 'number' ? answer : Number(answer);

  return Number.isFinite(numericAnswer) && numericAnswer === question.correctAnswer;
}

export function getAnswerOutcome(params: {
  isTimeout: boolean;
  isCorrect: boolean;
  responseTimeMs: number;
  timeLimitMs: number;
}): AnswerOutcome {
  if (params.isTimeout) return 'timeout';

  if (params.isCorrect && params.responseTimeMs < params.timeLimitMs * 0.75) {
    return 'correctFast';
  }

  if (params.isCorrect) return 'correct';

  return 'incorrect';
}

