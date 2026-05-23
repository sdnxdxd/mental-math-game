import AsyncStorage from '@react-native-async-storage/async-storage';

import { STORAGE_KEYS } from './storageKeys';
import type { Difficulty, GameMode, GameSummary } from '../utils/gameTypes';

export type BestScore = {
  mode: GameMode;
  difficulty: Difficulty;
  score: number;
  playedAt: string;
};

export async function getGameHistory(): Promise<GameSummary[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.GAME_HISTORY);
  return raw ? (JSON.parse(raw) as GameSummary[]) : [];
}

export async function saveGameSummary(summary: GameSummary): Promise<void> {
  const history = await getGameHistory();
  const nextHistory = [summary, ...history].slice(0, 50);

  await AsyncStorage.setItem(STORAGE_KEYS.GAME_HISTORY, JSON.stringify(nextHistory));
  await updateBestScore(summary);
}

export async function clearGameHistory(): Promise<void> {
  await AsyncStorage.multiRemove([STORAGE_KEYS.GAME_HISTORY, STORAGE_KEYS.BEST_SCORES]);
}

export async function getBestScores(): Promise<BestScore[]> {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.BEST_SCORES);
  return raw ? (JSON.parse(raw) as BestScore[]) : [];
}

async function updateBestScore(summary: GameSummary): Promise<void> {
  const bestScores = await getBestScores();

  const existingIndex = bestScores.findIndex(
    item =>
      item.mode === summary.settings.mode && item.difficulty === summary.settings.difficulty,
  );

  const candidate: BestScore = {
    mode: summary.settings.mode,
    difficulty: summary.settings.difficulty,
    score: summary.stats.finalScore,
    playedAt: summary.playedAt,
  };

  if (existingIndex === -1) {
    await AsyncStorage.setItem(STORAGE_KEYS.BEST_SCORES, JSON.stringify([...bestScores, candidate]));
    return;
  }

  const current = bestScores[existingIndex];

  if (current && candidate.score <= current.score) {
    return;
  }

  const nextBestScores = [...bestScores];
  nextBestScores[existingIndex] = candidate;

  await AsyncStorage.setItem(STORAGE_KEYS.BEST_SCORES, JSON.stringify(nextBestScores));
}

