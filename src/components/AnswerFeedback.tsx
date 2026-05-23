import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { colors } from '../theme/colors';
import type { AnswerRecord } from '../utils/gameTypes';

type Props = {
  feedback: AnswerRecord | null;
};

const feedbackText = {
  correctFast: 'Correcto rapido +100',
  correct: 'Correcto +70',
  incorrect: 'Incorrecto -30',
  timeout: 'Sin respuesta -50',
};

export function AnswerFeedback({ feedback }: Props) {
  const scale = useRef(new Animated.Value(0.92)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!feedback) return;

    scale.setValue(0.92);
    opacity.setValue(0);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 140,
        useNativeDriver: true,
      }),
    ]).start();
  }, [feedback, opacity, scale]);

  if (!feedback) return null;

  const isPositive = feedback.isCorrect;

  return (
    <Animated.View
      style={[
        styles.container,
        isPositive ? styles.success : styles.error,
        {
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      <Text style={styles.text}>{feedbackText[feedback.outcome]}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 14,
  },
  success: {
    backgroundColor: colors.successSoft,
  },
  error: {
    backgroundColor: colors.dangerSoft,
  },
  text: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },
});

