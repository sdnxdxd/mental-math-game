import { useCallback, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { AnswerFeedback } from '../components/AnswerFeedback';
import { TimerBar } from '../components/TimerBar';
import { useGameLogic } from '../hooks/useGameLogic';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { useStoredStats } from '../hooks/useStoredStats';
import { MODE_LABELS, type RootStackParamList } from '../navigation/routes';
import { colors } from '../theme/colors';
import type { GameMode, GameSummary } from '../utils/gameTypes';

type Props = NativeStackScreenProps<RootStackParamList, 'Game'>;

export function GameScreen({ route, navigation }: Props) {
  const { saveSummary } = useStoredStats();
  const [typedAnswer, setTypedAnswer] = useState('');
  const lastPlayedFeedbackId = useRef<string | null>(null);

  const handleGameFinished = useCallback(
    async (nextSummary: GameSummary) => {
      await saveSummary(nextSummary);
      navigation.replace('Results', { summary: nextSummary });
    },
    [navigation, saveSummary],
  );

  const game = useGameLogic({
    initialSettings: route.params.settings,
    onGameFinished: handleGameFinished,
  });
  const { playOutcome } = useSoundEffects(game.settings.soundEnabled);

  useEffect(() => {
    game.startGame(route.params.settings);
    // La partida debe arrancar una sola vez al montar esta pantalla.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTypedAnswer('');
  }, [game.currentQuestion?.id]);

  useEffect(() => {
    if (!game.lastFeedback) return;

    if (lastPlayedFeedbackId.current === game.lastFeedback.questionId) {
      return;
    }

    lastPlayedFeedbackId.current = game.lastFeedback.questionId;
    void playOutcome(game.lastFeedback.outcome);
  }, [game.lastFeedback, playOutcome]);

  const submitTypedAnswer = () => {
    if (!typedAnswer.trim() || game.status !== 'playing') return;
    game.submitAnswer(Number(typedAnswer));
  };

  const canAnswer = game.status === 'playing' && game.currentQuestion != null;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.topRow}>
          <View style={styles.titleBlock}>
            <Text style={styles.mode}>{MODE_LABELS[game.settings.mode]}</Text>
            <Text style={styles.round}>
              {game.settings.mode === 'timeAttack'
                ? 'Modo continuo'
                : `Pregunta ${game.currentQuestionNumber} de ${game.totalQuestions}`}
            </Text>
          </View>

          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Puntos</Text>
            <Text style={styles.scoreValue}>{game.score}</Text>
          </View>
        </View>

        {game.settings.mode === 'timeAttack' ? (
          <TimerBar
            remainingMs={game.timeAttackRemainingMs}
            totalMs={game.settings.timeAttackTotalMs}
          />
        ) : (
          <TimerBar remainingMs={game.remainingMs} totalMs={game.timeLimitMs} />
        )}

        <View style={styles.questionPanel}>
          <Text style={styles.question}>{game.currentQuestion?.prompt ?? ''}</Text>
        </View>

        <AnswerFeedback feedback={game.lastFeedback} />

        {renderAnswerArea({
          canAnswer,
          typedAnswer,
          setTypedAnswer,
          submitTypedAnswer,
          submitAnswer: game.submitAnswer,
          mode: game.settings.mode,
          options: game.currentQuestion?.options ?? [],
        })}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function renderAnswerArea(params: {
  canAnswer: boolean;
  typedAnswer: string;
  setTypedAnswer: (value: string) => void;
  submitTypedAnswer: () => void;
  submitAnswer: (answer: number | boolean | string) => void;
  mode: GameMode;
  options: number[];
}) {
  if (params.mode === 'trueFalse') {
    return (
      <View style={styles.answerGrid}>
        <Pressable
          disabled={!params.canAnswer}
          style={[styles.answerButton, !params.canAnswer && styles.disabled]}
          onPress={() => params.submitAnswer(true)}
        >
          <Text style={styles.answerButtonText}>Verdadero</Text>
        </Pressable>

        <Pressable
          disabled={!params.canAnswer}
          style={[styles.answerButton, !params.canAnswer && styles.disabled]}
          onPress={() => params.submitAnswer(false)}
        >
          <Text style={styles.answerButtonText}>Falso</Text>
        </Pressable>
      </View>
    );
  }

  if (params.mode === 'multipleChoice') {
    return (
      <View style={styles.optionsGrid}>
        {params.options.map(option => (
          <Pressable
            key={option}
            disabled={!params.canAnswer}
            style={[styles.optionButton, !params.canAnswer && styles.disabled]}
            onPress={() => params.submitAnswer(option)}
          >
            <Text style={styles.optionText}>{option}</Text>
          </Pressable>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.inputArea}>
      <TextInput
        value={params.typedAnswer}
        onChangeText={params.setTypedAnswer}
        editable={params.canAnswer}
        keyboardType="number-pad"
        placeholder="Resultado"
        placeholderTextColor="#9CA3AF"
        style={styles.input}
      />

      <Pressable
        disabled={!params.canAnswer}
        style={[styles.submitButton, !params.canAnswer && styles.disabled]}
        onPress={params.submitTypedAnswer}
      >
        <Text style={styles.submitButtonText}>Responder</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: 20,
    gap: 22,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  titleBlock: {
    flex: 1,
  },
  mode: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  round: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  scoreBox: {
    minWidth: 92,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.dark,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  scoreLabel: {
    color: '#D1D5DB',
    fontSize: 12,
    fontWeight: '700',
  },
  scoreValue: {
    color: colors.surface,
    fontSize: 22,
    fontWeight: '900',
  },
  questionPanel: {
    minHeight: 150,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.surface,
    padding: 24,
  },
  question: {
    color: colors.text,
    fontSize: 42,
    fontWeight: '900',
    textAlign: 'center',
  },
  answerGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  answerButton: {
    flex: 1,
    minHeight: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  answerButtonText: {
    color: colors.surface,
    fontSize: 17,
    fontWeight: '800',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    width: '47.5%',
    minHeight: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  optionText: {
    color: colors.surface,
    fontSize: 24,
    fontWeight: '900',
  },
  inputArea: {
    gap: 12,
  },
  input: {
    height: 58,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    color: colors.text,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  submitButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  submitButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.45,
  },
});

