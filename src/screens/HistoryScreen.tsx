import { useCallback } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { useStoredStats } from '../hooks/useStoredStats';
import { DIFFICULTY_LABELS, MODE_LABELS } from '../navigation/routes';
import { colors } from '../theme/colors';

export function HistoryScreen() {
  const { history, isLoading, storageError, loadStats, clearStats } = useStoredStats();

  useFocusEffect(
    useCallback(() => {
      void loadStats();
    }, [loadStats]),
  );

  const confirmClear = () => {
    Alert.alert(
      'Limpiar historial',
      'Esta accion borra todas las partidas guardadas en este dispositivo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Borrar', style: 'destructive', onPress: clearStats },
      ],
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Historial</Text>

        {history.length > 0 && (
          <Pressable style={styles.clearButton} onPress={confirmClear}>
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </Pressable>
        )}
      </View>

      {storageError ? <Text style={styles.error}>{storageError}</Text> : null}

      {isLoading ? (
        <Text style={styles.emptyText}>Cargando estadisticas...</Text>
      ) : history.length === 0 ? (
        <Text style={styles.emptyText}>No hay partidas guardadas.</Text>
      ) : (
        history.map(summary => (
          <View key={summary.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleBlock}>
                <Text style={styles.mode}>{MODE_LABELS[summary.settings.mode]}</Text>
                <Text style={styles.meta}>
                  {DIFFICULTY_LABELS[summary.settings.difficulty]} -{' '}
                  {formatDate(summary.playedAt)}
                </Text>
              </View>

              <Text style={styles.score}>{summary.stats.finalScore}</Text>
            </View>

            <View style={styles.metricsRow}>
              <Metric label="OK" value={summary.stats.correct} />
              <Metric label="Error" value={summary.stats.incorrect} />
              <Metric label="Timeout" value={summary.stats.timeouts} />
              <Metric label="Precision" value={`${Math.round(summary.stats.accuracy * 100)}%`} />
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 14,
    backgroundColor: colors.background,
  },
  header: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: '900',
  },
  clearButton: {
    borderRadius: 8,
    backgroundColor: colors.dangerSoft,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  clearButtonText: {
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '900',
  },
  error: {
    color: '#B91C1C',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 15,
    fontWeight: '600',
  },
  card: {
    gap: 14,
    borderRadius: 8,
    backgroundColor: colors.surface,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardTitleBlock: {
    flex: 1,
  },
  mode: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  meta: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  score: {
    color: colors.primary,
    fontSize: 26,
    fontWeight: '900',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  metric: {
    flex: 1,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    paddingVertical: 10,
    alignItems: 'center',
  },
  metricValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '900',
  },
  metricLabel: {
    marginTop: 2,
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
  },
});

