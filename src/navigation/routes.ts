import type { Difficulty, GameMode, GameSettings, GameSummary } from '../utils/gameTypes';

export type RootStackParamList = {
  Home: undefined;
  Productivity: undefined;
  WealthManager: undefined;
  FinanceWishlist: undefined;
  InvestmentAdvisor: undefined;
  HealthTracker: undefined;
  HealthProgress: undefined;
  WidgetCenter: undefined;
  DataBackup: undefined;
  EventEditor: {
    eventId?: string;
    selectedDate?: string;
  };
  Focus: {
    eventId?: string;
  };
  FocusHistory: undefined;
  CalendarSync: undefined;
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
