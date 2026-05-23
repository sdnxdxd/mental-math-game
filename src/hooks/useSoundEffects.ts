import { useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

import type { AnswerOutcome } from '../utils/gameTypes';

type SoundKey = 'correct' | 'wrong' | 'timeout';

const soundFiles: Record<SoundKey, number> = {
  correct: require('../assets/sounds/correct.wav'),
  wrong: require('../assets/sounds/wrong.wav'),
  timeout: require('../assets/sounds/timeout.wav'),
};

export function useSoundEffects(enabled = true) {
  const soundsRef = useRef<Partial<Record<SoundKey, Audio.Sound>>>({});

  useEffect(() => {
    let isMounted = true;

    async function loadSounds() {
      try {
        const [correct, wrong, timeout] = await Promise.all([
          Audio.Sound.createAsync(soundFiles.correct),
          Audio.Sound.createAsync(soundFiles.wrong),
          Audio.Sound.createAsync(soundFiles.timeout),
        ]);

        if (!isMounted) {
          await Promise.all([
            correct.sound.unloadAsync(),
            wrong.sound.unloadAsync(),
            timeout.sound.unloadAsync(),
          ]);
          return;
        }

        soundsRef.current = {
          correct: correct.sound,
          wrong: wrong.sound,
          timeout: timeout.sound,
        };
      } catch {
        soundsRef.current = {};
      }
    }

    void loadSounds();

    return () => {
      isMounted = false;

      Object.values(soundsRef.current).forEach(sound => {
        void sound?.unloadAsync();
      });

      soundsRef.current = {};
    };
  }, []);

  const play = useCallback(
    async (key: SoundKey) => {
      if (!enabled) return;

      try {
        await soundsRef.current[key]?.replayAsync();
      } catch {
        // El sonido es decorativo y no debe interrumpir la partida.
      }
    },
    [enabled],
  );

  const playOutcome = useCallback(
    async (outcome: AnswerOutcome) => {
      if (outcome === 'correct' || outcome === 'correctFast') {
        await play('correct');
        return;
      }

      if (outcome === 'timeout') {
        await play('timeout');
        return;
      }

      await play('wrong');
    },
    [play],
  );

  return {
    playOutcome,
  };
}

