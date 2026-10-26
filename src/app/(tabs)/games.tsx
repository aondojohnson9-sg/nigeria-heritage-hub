import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../../components/TopBar';
import DrawerModal from '../../components/DrawerModal';
import { COLORS, SHADOWS } from '../../constants/theme';
import { QUESTIONS, QuizQuestion } from '../../constants/data';

type GameState = 'start' | 'playing' | 'answered' | 'result';

export default function GamesScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [score, setScore] = useState(0);

  const activeQuestion: QuizQuestion = QUESTIONS[currentIdx];

  const handleStart = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOpt(null);
    setGameState('playing');
  };

  const handleAnswer = (index: number) => {
    if (gameState === 'answered') return;
    setSelectedOpt(index);
    if (index === activeQuestion.answer) {
      setScore((prev) => prev + 1);
    }
    setGameState('answered');
  };

  const handleNext = () => {
    if (currentIdx + 1 < QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOpt(null);
      setGameState('playing');
    } else {
      setGameState('result');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <TopBar onOpenDrawer={() => setDrawerOpen(true)} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Heritage Quiz</Text>
          <Text style={styles.subtitle}>
            Test your knowledge of Nigerian history, geography, and national culture
          </Text>
        </View>

        {/* Start View */}
        {gameState === 'start' && (
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Text style={styles.largeEmoji}>🏆</Text>
            </View>
            <Text style={styles.cardTitle}>Are you a Heritage Expert?</Text>
            <Text style={styles.cardDesc}>
              Answer all {QUESTIONS.length} trivia questions correctly to test your mastery of Nigerian history and civic knowledge.
            </Text>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleStart}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Start Quiz</Text>
              <Ionicons name="arrow-forward" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        )}

        {/* Playing & Answered View */}
        {(gameState === 'playing' || gameState === 'answered') && (
          <View style={styles.card}>
            {/* Progress Bar */}
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${((currentIdx + 1) / QUESTIONS.length) * 100}%` },
                ]}
              />
            </View>

            <View style={styles.stepRow}>
              <Text style={styles.stepText}>
                Question {currentIdx + 1} of {QUESTIONS.length}
              </Text>
              <View style={styles.scorePill}>
                <Text style={styles.scorePillText}>Score: {score}</Text>
              </View>
            </View>

            <Text style={styles.questionTitle}>{activeQuestion.question}</Text>

            {/* Options List */}
            <View style={styles.optionsList}>
              {activeQuestion.options.map((opt, idx) => {
                const isSelected = selectedOpt === idx;
                const isCorrect = idx === activeQuestion.answer;
                const isAnswered = gameState === 'answered';

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.optionBtn,
                      isSelected && !isAnswered && styles.optionSelected,
                      isAnswered && isCorrect && styles.optionCorrect,
                      isAnswered && isSelected && !isCorrect && styles.optionIncorrect,
                    ]}
                    onPress={() => handleAnswer(idx)}
                    disabled={isAnswered}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.optionLetterBadge,
                        isAnswered && isCorrect && styles.optionCorrectLetter,
                        isAnswered && isSelected && !isCorrect && styles.optionIncorrectLetter,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionLetterText,
                          isAnswered && isCorrect && styles.optionCorrectLetterText,
                          isAnswered && isSelected && !isCorrect && styles.optionIncorrectLetterText,
                        ]}
                      >
                        {String.fromCharCode(65 + idx)}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.optionText,
                        isAnswered && isCorrect && styles.optionCorrectText,
                        isAnswered && isSelected && !isCorrect && styles.optionIncorrectText,
                      ]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Feedback Box */}
            {gameState === 'answered' && (
              <View
                style={[
                  styles.feedbackBox,
                  selectedOpt === activeQuestion.answer
                    ? styles.feedbackCorrect
                    : styles.feedbackIncorrect,
                ]}
              >
                <View style={styles.feedbackHeader}>
                  <Text style={styles.feedbackTitle}>
                    {selectedOpt === activeQuestion.answer
                      ? '🎉 Correct!'
                      : '❌ Incorrect'}
                  </Text>
                </View>
                <Text style={styles.factText}>{activeQuestion.fact}</Text>
                <TouchableOpacity
                  style={styles.nextBtn}
                  onPress={handleNext}
                  activeOpacity={0.85}
                >
                  <Text style={styles.nextBtnText}>
                    {currentIdx + 1 === QUESTIONS.length
                      ? 'Finish Quiz →'
                      : 'Next Question →'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Result View */}
        {gameState === 'result' && (
          <View style={styles.card}>
            <View style={styles.iconCircle}>
              <Text style={styles.largeEmoji}>
                {score >= QUESTIONS.length - 1
                  ? '🥇'
                  : score >= Math.ceil(QUESTIONS.length / 2)
                  ? '🥈'
                  : '🥉'}
              </Text>
            </View>
            <Text style={styles.cardTitle}>Quiz Completed!</Text>
            <View style={styles.resultScoreBadge}>
              <Text style={styles.resultScoreBig}>{score}</Text>
              <Text style={styles.resultScoreTotal}> / {QUESTIONS.length}</Text>
            </View>
            <Text style={styles.cardDesc}>
              {score === QUESTIONS.length
                ? 'Incredible! You have a flawless knowledge of Nigerian heritage.'
                : score >= Math.ceil(QUESTIONS.length / 2)
                ? "Well done! You have a strong grasp of Nigeria's history and facts."
                : 'Keep exploring the Heritage Hub modules to learn more facts!'}
            </Text>
            <TouchableOpacity
              style={styles.primaryBtn}
              onPress={handleStart}
              activeOpacity={0.85}
            >
              <Text style={styles.primaryBtnText}>Play Again</Text>
              <Ionicons name="reload" size={18} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <DrawerModal
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeRoute="/(tabs)/games"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text2,
    lineHeight: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.g50,
    borderWidth: 1,
    borderColor: COLORS.g200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  largeEmoji: {
    fontSize: 36,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text1,
    textAlign: 'center',
    marginBottom: 10,
  },
  cardDesc: {
    fontSize: 14,
    color: COLORS.text2,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
    maxWidth: '90%',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.g700,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
    gap: 8,
    width: '100%',
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: COLORS.borderLight,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.g600,
    borderRadius: 3,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 14,
  },
  stepText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text2,
  },
  scorePill: {
    backgroundColor: COLORS.g100,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scorePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.g900,
  },
  questionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text1,
    textAlign: 'left',
    width: '100%',
    lineHeight: 24,
    marginBottom: 18,
  },
  optionsList: {
    width: '100%',
    gap: 10,
    marginBottom: 16,
  },
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  optionSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.g50,
    borderWidth: 1.5,
    borderColor: COLORS.g600,
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  optionCorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.g100,
    borderWidth: 1.5,
    borderColor: COLORS.g600,
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  optionIncorrect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerLight,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  optionLetterBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionLetterText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text2,
  },
  optionCorrectLetter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.g700,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCorrectLetterText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  optionIncorrectLetter: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIncorrectLetterText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text1,
    lineHeight: 18,
  },
  optionCorrectText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.g900,
    fontWeight: '600',
    lineHeight: 18,
  },
  optionIncorrectText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.danger,
    lineHeight: 18,
  },
  feedbackBox: {
    width: '100%',
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
    borderWidth: 1,
  },
  feedbackCorrect: {
    backgroundColor: COLORS.g50,
    borderColor: COLORS.g200,
  },
  feedbackIncorrect: {
    backgroundColor: '#fff5f5',
    borderColor: '#fecaca',
  },
  feedbackHeader: {
    marginBottom: 6,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text1,
  },
  factText: {
    fontSize: 13,
    color: COLORS.text2,
    lineHeight: 19,
    marginBottom: 14,
  },
  nextBtn: {
    backgroundColor: COLORS.g700,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  nextBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  resultScoreBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: COLORS.g100,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 16,
  },
  resultScoreBig: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.g700,
  },
  resultScoreTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text2,
  },
});
