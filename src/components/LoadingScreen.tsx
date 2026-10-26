import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Cheetah head size tuned to match the ~47% width ratio from the mockup
const CHEETAH_SIZE = Math.min(Math.round(SCREEN_WIDTH * 0.48), 240);

interface LoadingScreenProps {
  onFinish?: () => void;
  minDurationMs?: number;
}

export default function LoadingScreen({ onFinish, minDurationMs }: LoadingScreenProps) {
  const insets = useSafeAreaInsets();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Gentle fade-in for smooth entrance
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();

    // Subtle gentle breathing pulse on the cheetah head
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.035,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    let timer: ReturnType<typeof setTimeout>;
    if (minDurationMs && onFinish) {
      timer = setTimeout(() => {
        onFinish();
      }, minDurationMs);
    }

    return () => {
      pulseLoop.stop();
      if (timer) clearTimeout(timer);
    };
  }, [minDurationMs, onFinish, pulseAnim, fadeAnim]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Center cheetah head */}
      <View style={styles.centerContainer}>
        <Animated.View
          style={[
            styles.imageWrapper,
            {
              opacity: fadeAnim,
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Image
            source={require('../../assets/cheetah.png')}
            style={styles.cheetahImage}
            resizeMode="contain"
            accessibilityLabel="Cheetah Mascot"
          />
        </Animated.View>
      </View>

      {/* Bottom text matching the mockup exact layout */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            paddingBottom: Math.max(insets.bottom + 48, 80),
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={styles.brandText}>cheetah</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.sandBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Slight upward offset (~2%) to match the mockup vertical center
    marginTop: -20,
  },
  imageWrapper: {
    width: CHEETAH_SIZE,
    height: CHEETAH_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cheetahImage: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: COLORS.chocolateBrown,
    fontSize: 34,
    fontWeight: '700',
    fontFamily: Platform.select({
      ios: 'Fredoka_700Bold',
      android: 'Fredoka_700Bold',
      default: 'Fredoka_700Bold, -apple-system, system-ui, sans-serif',
    }),
    letterSpacing: 0.2,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
