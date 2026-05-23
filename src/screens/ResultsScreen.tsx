import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { StatsChart } from '../components/StatsChart';
import { DIFFICULTY_LABELS, MODE_LABELS, type RootStackParamList } from '../navigation/routes';
import { colors } from '../theme/colors';
import type { AnswerOutcome } from '../utils/gameTypes';

type Props = NativeStackScreenProps<RootStackParamList, 'Results'>;

const outcomeLabels: Record<AnswerOutcome, string> = {
  correctFast: 'Correcta rapida',
  correct: 'Correcta',
  incorrect: 'Incorrecta',
  timeout: 'Sin respuesta',
};

export function ResultsScreen({ route, navigation }: Props) {
  const { summary } = route.params;
  const { stats, settings, answers } = summary;
  const accuracyPercent = Math.round(stats.accuracy * 100);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Resultados</Text>
        <Text style={styles.subtitle}>
          {MODE_LABELS[settings.mode]} - {DIFFICULTY_LABELS[settings.difficulty]}
        </Text>
      </View>

      <View style={styles.scorePanel}>
        <Text style={styles.scoreLabel}>Puntaje final</Text>
        <Text style={styles.scoreValue}>{stats.finalScore}</Text>
      </View>

      <View style={styles.metricsGrid}>
        <MetricCard label="Correctas" value={stats.correct} />
        <MetricCard label="Incorrectas" value={stats.incorrect} />
        <MetricCard label="Timeouts" value={stats.timeouts} />
        <MetricCard label="Precision" value={`${accuracyPercent}%`} />
        <MetricCard label="Promedio" value={`${(stats.averageResponseMs / 1000).toFixed(1)}s`} />
        <MetricCard label="Mejor racha" value={stats.bestStreak} />
      </View>

      <StatsChart stats={stats} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalle de respuestas</Text>

        {answers.map((answer, index) => (
          <View key={answer.questionId} style={styles.answerRow}>
            <View style={styles.answerLeft}>
              <Text style={styles.answerIndex}>#{index + 1}</Text>
              <Text style={styles.answerPrompt}>{answer.prompt}</Text>
              <Text style={styles.answerMeta}>
                Correcta: {answer.correctAnswer} - Tiempo:{' '}
                {(answer.responseTimeMs / 1000).toFixed(1)}s
              </Text>
            </View>

            <View
              style={[
                styles.pointsBadge,
                answer.points >= 0 ? styles.positiveBadge : styles.negativeBadge,
              ]}
            >
              <Text style={styles.pointsText}>{answer.points}</Text>
            </View>

            <Text style={styles.outcome}>{outcomeLabels[answer.outcome]}</Text>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => navigation.replace('Game', { settings })}>
          <Text style={styles.primaryButtonText}>Reintentar</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('GameConfig')}>
          <Text style={styles.secondaryButtonText}>Nueva configuracion</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('History')}>
          <Text style={styles.secondaryButtonText}>Ver historial</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function MetricCard({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.metricCard}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 22,
    backgroundColor: colors.background,
  },
  header: {
    gap: 4,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '600',
  },
  scorePanel: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.dark,
    paddingVertical: 24,
  },
  scoreLabel: {
    color: '#D1D5DB',
    fontSize: 14,
    fontWeight: '700',
  },
  scoreValue: {
    marginTop: 4,
    color: colors.surface,
    fontSize: 44,
    fontWeight: '900',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metricCard: {
    width: '48%',
    minHeight: 82,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.surface,
    padding: 14,
  },
  metricValue: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '900',
  },
  metricLabel: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  answerRow: {
    gap: 8,
    borderRadius: 8,
    backgroundColor: colors.surface,
    padding: 14,
  },
  answerLeft: {
    gap: 3,
  },
  answerIndex: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  answerPrompt: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  answerMeta: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  pointsBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  positiveBadge: {
    backgroundColor: colors.successSoft,
  },
  negativeBadge: {
    backgroundColor: colors.dangerSoft,
  },
  pointsText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '900',
  },
  outcome: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '700',
  },
  actions: {
    gap: 10,
  },
  primaryButton: {
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '900',
  },
  secondaryButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
  },
});

