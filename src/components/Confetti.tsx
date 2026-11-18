import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { useProgress } from '../state/progress';

const CONFETTI_COLORS = ['#25d97e', '#ffffff', '#ffc82e', '#13b866', '#ff8a3d', '#3d8bff'];

interface Particle {
  id: number;
  x0: number;
  y0: number;
  dx: number;
  dy: number;
  size: number;
  round: boolean;
  color: string;
  rot: number;
}

export default function Confetti({
  fire,
  power = 1,
  origin = [0.5, 0.35],
}: {
  fire: number;
  power?: number;
  origin?: [number, number];
}) {
  const { settings } = useProgress();
  const [particles, setParticles] = useState<Particle[]>([]);
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!fire || settings.motion === 'reduced') return;
    const { width, height } = Dimensions.get('window');
    const count = Math.min(48, Math.max(18, Math.round(32 * power)));
    const x0 = width * origin[0];
    const y0 = height * origin[1];

    const list: Particle[] = Array.from({ length: count }, (_, idx) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = (60 + Math.random() * 170) * Math.sqrt(power);
      return {
        id: idx,
        x0,
        y0,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist - 60 + 180,
        size: 6 + Math.random() * 6,
        round: Math.random() > 0.55,
        color: CONFETTI_COLORS[(Math.random() * CONFETTI_COLORS.length) | 0],
        rot: (Math.random() - 0.5) * 360,
      };
    });

    setParticles(list);
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 950,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setParticles([]);
    });
  }, [fire]); // eslint-disable-line react-hooks/exhaustive-deps

  if (particles.length === 0) return null;

  const opacity = progress.interpolate({
    inputRange: [0, 0.65, 1],
    outputRange: [1, 1, 0],
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {particles.map((p) => {
        const translateX = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, p.dx],
        });
        const translateY = progress.interpolate({
          inputRange: [0, 0.35, 1],
          outputRange: [0, -50 * Math.sqrt(power), p.dy],
        });
        const rotate = progress.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', `${p.rot}deg`],
        });
        return (
          <Animated.View
            key={p.id}
            style={{
              position: 'absolute',
              left: p.x0,
              top: p.y0,
              width: p.size,
              height: p.round ? p.size : p.size * 0.66,
              borderRadius: p.round ? p.size / 2 : 2,
              backgroundColor: p.color,
              opacity,
              transform: [{ translateX }, { translateY }, { rotate }],
            }}
          />
        );
      })}
    </View>
  );
}

