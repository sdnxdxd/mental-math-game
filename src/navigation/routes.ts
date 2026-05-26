import type { Difficulty, GameMode, GameSettings, GameSummary } from '../utils/gameTypes';

export type RootStackParamList = {
  Home: undefined;
  GameConfig: undefined;
  Game: {
    settings: GameSettings;
  };
  Results: {
    summary: GameSummary;
  };
  History: undefined;
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Facil',
  medium: 'Medio',
  hard: 'Dificil',
};

export const MODE_LABELS: Record<GameMode, string> = {
  classic: 'Clasico',
  trueFalse: 'Verdadero / Falso',
  multipleChoice: 'Multiple Choice',
  timeAttack: 'Contra reloj',
};

