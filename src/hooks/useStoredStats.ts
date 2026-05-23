import { useCallback, useEffect, useState } from 'react';

import {
  clearGameHistory,
  getBestScores,
  getGameHistory,
  saveGameSummary,
  type BestScore,
} from '../storage/gameStorage';
import type { GameSummary } from '../utils/gameTypes';

export function useStoredStats() {
  const [history, setHistory] = useState<GameSummary[]>([]);
  const [bestScores, setBestScores] = useState<BestScore[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [storageError, setStorageError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setStorageError(null);

      const [storedHistory, storedBestScores] = await Promise.all([
        getGameHistory(),
        getBestScores(),
      ]);

      setHistory(storedHistory);
      setBestScores(storedBestScores);
    } catch {
      setStorageError('No se pudieron cargar las estadisticas locales.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveSummary = useCallback(
    async (summary: GameSummary) => {
      try {
        setStorageError(null);
        await saveGameSummary(summary);
        await loadStats();
      } catch {
        setStorageError('No se pudo guardar la partida.');
      }
    },
    [loadStats],
  );

  const clearStats = useCallback(async () => {
    try {
      setStorageError(null);
      await clearGameHistory();
      setHistory([]);
      setBestScores([]);
    } catch {
      setStorageError('No se pudo limpiar el historial.');
    }
  }, []);

  useEffect(() => {
    void loadStats();
  }, [loadStats]);

  return {
    history,
    bestScores,
    isLoading,
    storageError,
    loadStats,
    saveSummary,
    clearStats,
  };
}

