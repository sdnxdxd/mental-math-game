import type { AnswerRecord, GameStats } from './gameTypes';

export function buildStats(records: AnswerRecord[], finalScore: number): GameStats {
  const correct = records.filter(record => record.isCorrect).length;
  const timeouts = records.filter(record => record.outcome === 'timeout').length;
  const totalResponseTime = records.reduce((sum, record) => sum + record.responseTimeMs, 0);

  let streak = 0;
  let bestStreak = 0;

  records.forEach(record => {
    streak = record.isCorrect ? streak + 1 : 0;
    bestStreak = Math.max(bestStreak, streak);
  });

  return {
    total: records.length,
    correct,
    incorrect: records.length - correct - timeouts,
    timeouts,
    accuracy: records.length === 0 ? 0 : correct / records.length,
    averageResponseMs: records.length === 0 ? 0 : Math.round(totalResponseTime / records.length),
    bestStreak,
    finalScore,
  };
}

