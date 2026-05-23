import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

import { colors } from '../theme/colors';
import type { GameStats } from '../utils/gameTypes';

type Props = {
  stats: GameStats;
};

const screenWidth = Dimensions.get('window').width;

export function StatsChart({ stats }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rendimiento</Text>

      <BarChart
        data={{
          labels: ['OK', 'Error', 'Timeout'],
          datasets: [
            {
              data: [stats.correct, stats.incorrect, stats.timeouts],
            },
          ],
        }}
        width={screenWidth - 40}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        fromZero
        showValuesOnTopOfBars
        chartConfig={{
          backgroundGradientFrom: colors.surface,
          backgroundGradientTo: colors.surface,
          decimalPlaces: 0,
          color: () => colors.primary,
          labelColor: () => '#374151',
          barPercentage: 0.72,
          propsForBackgroundLines: {
            stroke: '#E5E7EB',
          },
        }}
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '800',
  },
  chart: {
    borderRadius: 8,
  },
});

