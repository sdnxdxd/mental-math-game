import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { createId, createQuestion } from '../utils/mathGenerator';
import {
  getAnswerOutcome,
  getTimeLimitMs,
  normalizeSettings,
  SCORE_BY_OUTCOME,
  validateAnswer,
} from '../utils/scoring';
import { buildStats } from '../utils/statistics';
import type {
  AnswerRecord,
  GameSettings,
  GameStatus,
  GameSummary,
  NormalizedGameSettings,
  Question,
  UserAnswer,
} from '../utils/gameTypes';

type UseGameLogicParams = {
  initialSettings?: Partial<GameSettings>;
  onGameFinished?: (summary: GameSummary) => void | Promise<void>;
};

export function useGameLogic(params: UseGameLogicParams = {}) {
  const onGameFinishedRef = useRef(params.onGameFinished);
  const [settings, setSettings] = useState(() => normalizeSettings(params.initialSettings));
  const [status, setStatus] = useState<GameStatus>('idle');
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [remainingMs, setRemainingMs] = useState(settings.timeLimitsMs[settings.difficulty]);
  const [timeAttackRemainingMs, setTimeAttackRemainingMs] = useState(settings.timeAttackTotalMs);
  const [lastFeedback, setLastFeedback] = useState<AnswerRecord | null>(null);
  const [summary, setSummary] = useState<GameSummary | null>(null);

  const settingsRef = useRef(settings);
  const statusRef = useRef<GameStatus>('idle');
  const questionRef = useRef<Question | null>(null);
  const questionStartedAtRef = useRef(0);
  const questionIndexRef = useRef(0);
  const scoreRef = useRef(0);
  const answersRef = useRef<AnswerRecord[]>([]);
  const timeAttackEndsAtRef = useRef(0);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onGameFinishedRef.current = params.onGameFinished;
  }, [params.onGameFinished]);

  const changeStatus = useCallback((nextStatus: GameStatus) => {
    statusRef.current = nextStatus;
    setStatus(nextStatus);
  }, []);

  const clearFeedbackTimeout = useCallback(() => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
  }, []);

  const prepareQuestion = useCallback(
    (nextSettings: NormalizedGameSettings, nextIndex: number) => {
      const timeLimitMs = getTimeLimitMs(nextSettings, nextIndex);
      const question = createQuestion(nextSettings.mode, nextSettings.difficulty, timeLimitMs);

      questionRef.current = question;
      questionStartedAtRef.current = Date.now();

      setCurrentQuestion(question);
      setRemainingMs(timeLimitMs);
      setLastFeedback(null);
      changeStatus('playing');
    },
    [changeStatus],
  );

  const finishGame = useCallback(() => {
    const activeSettings = settingsRef.current;
    const gameSummary: GameSummary = {
      id: createId(),
      playedAt: new Date().toISOString(),
      settings: activeSettings,
      answers: answersRef.current,
      stats: buildStats(answersRef.current, scoreRef.current),
    };

    questionRef.current = null;
    setCurrentQuestion(null);
    setSummary(gameSummary);
    changeStatus('finished');

    Promise.resolve(onGameFinishedRef.current?.(gameSummary)).catch(() => undefined);
  }, [changeStatus]);

  const goToNextQuestion = useCallback(() => {
    const nextIndex = questionIndexRef.current + 1;
    questionIndexRef.current = nextIndex;
    setQuestionIndex(nextIndex);
    prepareQuestion(settingsRef.current, nextIndex);
  }, [prepareQuestion]);

  const completeQuestion = useCallback(
    (userAnswer: UserAnswer, forcedOutcome?: 'timeout') => {
      if (statusRef.current !== 'playing' || !questionRef.current) return;

      const now = Date.now();
      const activeSettings = settingsRef.current;
      const question = questionRef.current;
      const rawElapsed = now - questionStartedAtRef.current;
      const timeExpired = rawElapsed > question.timeLimitMs;
      const attackExpired =
        activeSettings.mode === 'timeAttack' && now >= timeAttackEndsAtRef.current;
      const isTimeout = forcedOutcome === 'timeout' || timeExpired || attackExpired;
      const responseTimeMs = Math.min(rawElapsed, question.timeLimitMs);
      const isCorrect = !isTimeout && validateAnswer(question, activeSettings.mode, userAnswer);
      const outcome = getAnswerOutcome({
        isTimeout,
        isCorrect,
        responseTimeMs,
        timeLimitMs: question.timeLimitMs,
      });
      const points = SCORE_BY_OUTCOME[outcome];

      const record: AnswerRecord = {
        questionId: question.id,
        prompt: question.prompt,
        correctAnswer: question.correctAnswer,
        userAnswer,
        isCorrect,
        responseTimeMs,
        points,
        outcome,
      };

      const nextAnswers = [...answersRef.current, record];
      const nextScore = scoreRef.current + points;

      answersRef.current = nextAnswers;
      scoreRef.current = nextScore;

      setAnswers(nextAnswers);
      setScore(nextScore);
      setLastFeedback(record);
      changeStatus('feedback');

      const shouldFinishByRounds =
        activeSettings.mode !== 'timeAttack' && nextAnswers.length >= activeSettings.totalQuestions;
      const shouldFinishTimeAttack =
        activeSettings.mode === 'timeAttack' && (!isCorrect || outcome === 'timeout');

      clearFeedbackTimeout();
      feedbackTimeoutRef.current = setTimeout(() => {
        if (shouldFinishByRounds || shouldFinishTimeAttack) {
          finishGame();
        } else {
          goToNextQuestion();
        }
      }, activeSettings.feedbackDelayMs);
    },
    [changeStatus, clearFeedbackTimeout, finishGame, goToNextQuestion],
  );

  const startGame = useCallback(
    (overrideSettings?: Partial<GameSettings>) => {
      clearFeedbackTimeout();

      const nextSettings = normalizeSettings({
        ...settingsRef.current,
        ...overrideSettings,
        timeLimitsMs: {
          ...settingsRef.current.timeLimitsMs,
          ...overrideSettings?.timeLimitsMs,
        },
      });

      settingsRef.current = nextSettings;
      questionIndexRef.current = 0;
      scoreRef.current = 0;
      answersRef.current = [];

      if (nextSettings.mode === 'timeAttack') {
        timeAttackEndsAtRef.current = Date.now() + nextSettings.timeAttackTotalMs;
        setTimeAttackRemainingMs(nextSettings.timeAttackTotalMs);
      } else {
        timeAttackEndsAtRef.current = 0;
      }

      setSettings(nextSettings);
      setQuestionIndex(0);
      setScore(0);
      setAnswers([]);
      setSummary(null);
      setLastFeedback(null);

      prepareQuestion(nextSettings, 0);
    },
    [clearFeedbackTimeout, prepareQuestion],
  );

  const submitAnswer = useCallback(
    (answer: Exclude<UserAnswer, null>) => {
      completeQuestion(answer);
    },
    [completeQuestion],
  );

  const resetGame = useCallback(() => {
    clearFeedbackTimeout();

    questionRef.current = null;
    answersRef.current = [];
    scoreRef.current = 0;
    questionIndexRef.current = 0;
    timeAttackEndsAtRef.current = 0;

    setCurrentQuestion(null);
    setAnswers([]);
    setScore(0);
    setQuestionIndex(0);
    setLastFeedback(null);
    setSummary(null);
    setRemainingMs(settingsRef.current.timeLimitsMs[settingsRef.current.difficulty]);
    setTimeAttackRemainingMs(settingsRef.current.timeAttackTotalMs);
    changeStatus('idle');
  }, [changeStatus, clearFeedbackTimeout]);

  const restartGame = useCallback(() => {
    startGame(settingsRef.current);
  }, [startGame]);

  useEffect(() => {
    if (status !== 'playing' || !currentQuestion) return undefined;

    const intervalId = setInterval(() => {
      const now = Date.now();
      const questionLeft = Math.max(
        currentQuestion.timeLimitMs - (now - questionStartedAtRef.current),
        0,
      );

      setRemainingMs(questionLeft);

      if (settingsRef.current.mode === 'timeAttack') {
        const attackLeft = Math.max(timeAttackEndsAtRef.current - now, 0);
        setTimeAttackRemainingMs(attackLeft);

        if (attackLeft <= 0) {
          completeQuestion(null, 'timeout');
        }
      }

      if (questionLeft <= 0) {
        completeQuestion(null, 'timeout');
      }
    }, 100);

    return () => clearInterval(intervalId);
  }, [completeQuestion, currentQuestion, status]);

  useEffect(() => clearFeedbackTimeout, [clearFeedbackTimeout]);

  const stats = useMemo(() => buildStats(answers, score), [answers, score]);

  return {
    status,
    settings,
    currentQuestion,
    questionIndex,
    currentQuestionNumber: questionIndex + 1,
    totalQuestions: settings.totalQuestions,
    score,
    answers,
    stats,
    summary,
    remainingMs,
    timeLimitMs: currentQuestion?.timeLimitMs ?? settings.timeLimitsMs[settings.difficulty],
    timeProgress: currentQuestion == null ? 0 : remainingMs / Math.max(currentQuestion.timeLimitMs, 1),
    timeAttackRemainingMs,
    timeAttackProgress:
      settings.mode === 'timeAttack'
        ? timeAttackRemainingMs / Math.max(settings.timeAttackTotalMs, 1)
        : 0,
    lastFeedback,
    startGame,
    submitAnswer,
    resetGame,
    restartGame,
  };
}

