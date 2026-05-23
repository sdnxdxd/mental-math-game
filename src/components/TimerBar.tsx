import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';

type Props = {
  remainingMs: number;
  totalMs: number;
};

export function TimerBar({ remainingMs, totalMs }: Props) {
  const progress = Math.max(0, Math.min(1, remainingMs / totalMs));
  const seconds = Math.ceil(remainingMs / 1000);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Tiempo</Text>
        <Text style={styles.value}>{seconds}s</Text>
      </View>

      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            {
              width: `${progress * 100}%`,
              backgroundColor: progress <= 0.25 ? colors.danger : colors.success,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '700',
  },
  value: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '800',
  },
  track: {
    height: 12,
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  fill: {
    height: '100%',
    borderRadius: 8,
  },
});

