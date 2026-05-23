import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { DIFFICULTY_LABELS, MODE_LABELS, type RootStackParamList } from '../navigation/routes';
import { colors } from '../theme/colors';
import type { Difficulty, GameMode } from '../utils/gameTypes';

type Props = NativeStackScreenProps<RootStackParamList, 'GameConfig'>;

const modes: GameMode[] = ['classic', 'trueFalse', 'multipleChoice', 'timeAttack'];
const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

export function GameConfigScreen({ navigation }: Props) {
  const [mode, setMode] = useState<GameMode>('classic');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [totalQuestions, setTotalQuestions] = useState('10');
  const [dynamicDifficulty, setDynamicDifficulty] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const parsedRounds = Math.max(1, Number(totalQuestions) || 1);

  const startGame = () => {
    navigation.navigate('Game', {
      settings: {
        mode,
        difficulty,
        totalQuestions: parsedRounds,
        dynamicDifficulty,
        soundEnabled,
      },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Configuracion</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Modo de juego</Text>

        <View style={styles.grid}>
          {modes.map(item => (
            <Pressable
              key={item}
              onPress={() => setMode(item)}
              style={[styles.option, mode === item && styles.optionSelected]}
            >
              <Text style={[styles.optionText, mode === item && styles.optionTextSelected]}>
                {MODE_LABELS[item]}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Dificultad</Text>

        <View style={styles.row}>
          {difficulties.map(item => (
            <Pressable
              key={item}
              onPress={() => setDifficulty(item)}
              style={[styles.difficultyOption, difficulty === item && styles.optionSelected]}
            >
              <Text style={[styles.optionText, difficulty === item && styles.optionTextSelected]}>
                {DIFFICULTY_LABELS[item]}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {mode !== 'timeAttack' && (
        <View style={styles.section}>
          <Text style={styles.label}>Preguntas por ronda</Text>

          <TextInput
            value={totalQuestions}
            onChangeText={setTotalQuestions}
            keyboardType="number-pad"
            maxLength={2}
            style={styles.input}
          />
        </View>
      )}

      <View style={styles.switchRow}>
        <View style={styles.switchText}>
          <Text style={styles.label}>Dificultad dinamica</Text>
          <Text style={styles.hint}>Reduce el tiempo disponible en cada pregunta.</Text>
        </View>

        <Switch value={dynamicDifficulty} onValueChange={setDynamicDifficulty} />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchText}>
          <Text style={styles.label}>Sonidos</Text>
          <Text style={styles.hint}>Feedback auditivo local para aciertos, errores y timeout.</Text>
        </View>

        <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
      </View>

      <Pressable style={styles.primaryButton} onPress={startGame}>
        <Text style={styles.primaryButtonText}>Iniciar partida</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 24,
    backgroundColor: colors.background,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
  section: {
    gap: 12,
  },
  label: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  hint: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  grid: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  option: {
    minHeight: 48,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
  },
  difficultyOption: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  optionText: {
    color: '#374151',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#1D4ED8',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  switchRow: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  switchText: {
    flex: 1,
    gap: 4,
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
    fontWeight: '800',
  },
});

