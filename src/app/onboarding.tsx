import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface EraOption {
  id: string;
  name: string;
  icon: any;
}

const ERA_OPTIONS: EraOption[] = [
  {
    id: 'nok',
    name: 'Nok Civilization',
    icon: require('../../assets/onboarding/nok.png'),
  },
  {
    id: 'benin',
    name: 'Benin Kingdom',
    icon: require('../../assets/onboarding/benin.png'),
  },
  {
    id: 'oyo',
    name: 'Oyo Empire',
    icon: require('../../assets/onboarding/oyo.png'),
  },
  {
    id: 'kanem',
    name: 'Kanem-Bornu Empire',
    icon: require('../../assets/onboarding/kanem.png'),
  },
  {
    id: 'civil_war',
    name: 'Nigerian Civil War',
    icon: require('../../assets/onboarding/civil_war.png'),
  },
  {
    id: 'post_indep',
    name: 'Post-Independence Nigeria',
    icon: require('../../assets/onboarding/post_indep.png'),
  },
];

interface OnboardingScreenProps {
  onContinue?: () => void;
}

export default function OnboardingScreen({ onContinue }: OnboardingScreenProps = {}) {
  const insets = useSafeAreaInsets();
  const [selectedEras, setSelectedEras] = useState<string[]>(['nok', 'benin']);
  const popAnim = React.useRef(new Animated.Value(0.94)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.spring(popAnim, {
        toValue: 1,
        friction: 7,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, popAnim]);

  const toggleEra = (id: string) => {
    setSelectedEras((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const isComplete = selectedEras.length >= 2;

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      {/* Native status bar only - NO simulated battery, wifi, or clock icons */}
      <StatusBar style="dark" />

      <Animated.View
        style={[
          styles.animatedWrapper,
          {
            opacity: fadeAnim,
            transform: [{ scale: popAnim }],
          },
        ]}
      >
        <ImageBackground
          source={require('../../assets/onboarding-bg.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            {
              paddingTop: Math.max(insets.top + 8, 24),
              paddingBottom: Math.max(insets.bottom + 20, 36),
            },
          ]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Top Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarTrack}>
              <View style={styles.progressBarFill} />
            </View>
          </View>

          {/* Mascot Section */}
          <View style={styles.mascotContainer}>
            <Image
              source={require('../../assets/mascot-speaking.png')}
              style={styles.mascotImage}
              resizeMode="contain"
              accessibilityLabel="Cheetah Mascot speaking"
            />
          </View>

          {/* Speech Bubbles */}
          <View style={styles.dialogueContainer}>
            {/* Bubble 1 */}
            <View style={styles.speechBubble}>
              <Text style={styles.bubbleText}>
                Hey! I'm here to craft your perfect Nigerian history journey.
              </Text>
            </View>

            {/* Bubble 2 */}
            <View style={[styles.speechBubble, styles.secondBubble]}>
              <Text style={styles.bubbleText}>
                What era fascinates you the most?{'\n'}Pick at least two.
              </Text>
            </View>
          </View>

          {/* Era Grid - 2 columns */}
          <View style={styles.gridContainer}>
            {ERA_OPTIONS.map((item) => {
              const isSelected = selectedEras.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.card,
                    isSelected && styles.cardSelected,
                  ]}
                  onPress={() => toggleEra(item.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardIconWrapper}>
                    <Image
                      source={item.icon}
                      style={[
                        styles.cardIcon,
                        isSelected && styles.cardIconSelected,
                      ]}
                      resizeMode="contain"
                    />
                  </View>
                  <Text
                    style={[
                      styles.cardText,
                      isSelected && styles.cardTextSelected,
                    ]}
                    numberOfLines={2}
                  >
                    {item.name}
                  </Text>

                  {/* Active selection indicator badge */}
                  {isSelected && (
                    <View style={styles.selectionBadge}>
                      <Ionicons name="checkmark-circle" size={17} color="#442A13" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bottom Action Area */}
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[
                styles.continueButton,
                !isComplete && styles.continueButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!isComplete}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.continueText,
                  !isComplete && styles.continueTextDisabled,
                ]}
              >
                {isComplete
                  ? `Continue (${selectedEras.length} Selected)`
                  : `Pick at least 2 (${selectedEras.length}/2)`}
              </Text>
              {isComplete && (
                <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={styles.btnArrow} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleContinue}
              activeOpacity={0.7}
            >
              <Text style={styles.skipText}>Skip for now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.sandBg,
  },
  animatedWrapper: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  progressContainer: {
    width: '100%',
    marginTop: 4,
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(214, 195, 167, 0.65)',
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '46%',
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#442A13',
  },
  mascotContainer: {
    width: 140,
    height: 100,
    marginLeft: 12,
    marginBottom: 8,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  mascotImage: {
    width: 130,
    height: 95,
  },
  dialogueContainer: {
    gap: 12,
    marginBottom: 24,
  },
  speechBubble: {
    backgroundColor: 'rgba(246, 240, 230, 0.94)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(224, 212, 194, 0.85)',
    shadowColor: '#281F0E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  secondBubble: {
    marginTop: -2,
  },
  bubbleText: {
    fontSize: 16.5,
    lineHeight: 23,
    color: '#281F0E',
    fontFamily: Platform.select({
      ios: 'Georgia',
      android: 'serif',
      default: 'serif',
    }),
    letterSpacing: 0.1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
    marginBottom: 28,
  },
  card: {
    width: (SCREEN_WIDTH - 54) / 2,
    minHeight: 58,
    backgroundColor: 'rgba(247, 241, 231, 0.96)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(227, 216, 198, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    shadowColor: '#281F0E',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1.5,
    position: 'relative',
  },
  cardSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#442A13',
    shadowOpacity: 0.09,
    shadowRadius: 8,
    elevation: 3,
  },
  cardIconWrapper: {
    width: 28,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cardIcon: {
    width: 24,
    height: 28,
    opacity: 0.85,
  },
  cardIconSelected: {
    opacity: 1,
  },
  cardText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#342514',
    lineHeight: 16,
  },
  cardTextSelected: {
    fontWeight: '700',
    color: '#1E1408',
  },
  selectionBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  continueButton: {
    width: '100%',
    height: 52,
    backgroundColor: '#442A13',
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#442A13',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonDisabled: {
    backgroundColor: 'rgba(68, 42, 19, 0.35)',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  continueTextDisabled: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  btnArrow: {
    marginLeft: 8,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontSize: 14,
    color: '#6E553E',
    fontWeight: '600',
  },
});
