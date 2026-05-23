import { useCallback } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useStoredStats } from '../hooks/useStoredStats';
import { DIFFICULTY_LABELS, MODE_LABELS, type RootStackParamList } from '../navigation/routes';
import { colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const { bestScores, loadStats } = useStoredStats();

  useFocusEffect(
    useCallback(() => {
      void loadStats();
    }, [loadStats]),
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.title}>Calculo Mental</Text>
        <Text style={styles.subtitle}>
          Resolve operaciones bajo presion, mejora tu velocidad y supera tus marcas.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryButton} onPress={() => navigation.navigate('GameConfig')}>
          <Text style={styles.primaryButtonText}>Nueva partida</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate('History')}>
          <Text style={styles.secondaryButtonText}>Historial</Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mejores puntajes</Text>

        {bestScores.length === 0 ? (
          <Text style={styles.emptyText}>Todavia no hay partidas guardadas.</Text>
        ) : (
          bestScores.map(item => (
            <View key={`${item.mode}-${item.difficulty}`} style={styles.bestScoreRow}>
              <View>
                <Text style={styles.bestScoreMode}>{MODE_LABELS[item.mode]}</Text>
                <Text style={styles.bestScoreMeta}>
                  {DIFFICULTY_LABELS[item.difficulty]} - {formatDate(item.playedAt)}
                </Text>
              </View>

              <Text style={styles.bestScoreValue}>{item.score}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 24,
    backgroundColor: colors.background,
  },
  hero: {
    gap: 8,
    paddingTop: 12,
  },
  title: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
  },
  subtitle: {
    color: '#4B5563',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  actions: {
    gap: 10,
  },
  primaryButton: {
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    color: colors.surface,
    fontSize: 17,
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
  section: {
    gap: 12,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 19,
    fontWeight: '900',
  },
  emptyText: {
    color: colors.muted,
    fontSize: 14,
    fontWeight: '600',
  },
  bestScoreRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    backgroundColor: colors.surface,
    padding: 14,
    gap: 12,
  },
  bestScoreMode: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  bestScoreMeta: {
    marginTop: 3,
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  bestScoreValue: {
    color: colors.primary,
    fontSize: 24,
    fontWeight: '900',
  },
});

