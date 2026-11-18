import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { COLORS, FONTS, RADII, getModulePalette } from '../../constants/theme';
import { MODULES } from '../../data/modules';
import { dailyTeaser } from '../../data/quizzes';
import { starsFor, useProgress } from '../../state/progress';
import { sfx } from '../../lib/fx';
import Icon, { type IconName } from '../../components/Icon';
import { Button, PageHeader, SectionHead } from '../../components/ui';

function Stars({ pct = 0 }: { pct?: number }) {
  const n = starsFor(pct);
  return (
    <View style={styles.stars} accessibilityLabel={`${n} of 3 stars`}>
      {[0, 1, 2].map((i) => (
        <Icon
          key={i}
          name="star"
          size={18}
          color={i < n ? COLORS.gold : '#2c4a3a'}
        />
      ))}
    </View>
  );
}

function ChallengeRow({
  modKey,
  icon,
  title,
  sub,
  onPress,
}: {
  modKey: string;
  icon: IconName;
  title: string;
  sub: string;
  onPress: () => void;
}) {
  const pal = getModulePalette(modKey);
  const iconColor = pal.onDarkText ? COLORS.white : COLORS.onBright;

  return (
    <Pressable
      onPress={() => {
        sfx.pop();
        onPress();
      }}
      style={({ pressed }) => [
        styles.mixedQuiz,
        {
          borderColor: pal.m,
          borderBottomColor: pal.deep,
        },
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      <View
        style={[
          styles.mixedIcon,
          {
            backgroundColor: pal.m,
            borderBottomColor: pal.deep,
          },
        ]}
      >
        <Icon name={icon} size={24} color={iconColor} />
      </View>
      <View style={styles.mixedCopy}>
        <Text style={styles.mixedTitle}>{title}</Text>
        <Text style={styles.mixedSub}>{sub}</Text>
      </View>
      <Icon name="right" size={20} color={COLORS.text2} />
    </Pressable>
  );
}

export default function QuizzesScreen() {
  const { quizzes, dailyDone, answered, correct, missedCount } = useProgress();
  const acc = answered ? Math.round((correct / answered) * 100) : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <PageHeader
          title="Quizzes"
          sub={
            acc === null
              ? 'Earn XP, stars and streaks.'
              : `${answered} answered · ${acc}% accuracy`
          }
        />

        {/* Daily Naija Challenge */}
        <LinearGradient
          colors={['#1d3a2c', '#0e2119']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.bigQuiz}
        >
          <View style={styles.dailyTag}>
            <Icon name="trophy" size={14} color="#3a2900" />
            <Text style={styles.dailyTagText}>Daily Naija Challenge</Text>
          </View>
          <Text style={styles.bigQuizTitle}>
            {dailyDone ? 'Done for today! 🎉' : dailyTeaser()}
          </Text>
          <Text style={styles.bigQuizSub}>
            5 questions · +10 XP each · keeps your streak alive
          </Text>
          <Button
            variant="gold"
            iconRight="right"
            block
            onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: 'daily' } })}
          >
            {dailyDone ? 'Replay' : 'Start Quiz'}
          </Button>
        </LinearGradient>

        <ChallengeRow
          modKey="mixed"
          icon="sparkles"
          title="Mixed Challenge"
          sub="10 questions from every module"
          onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: 'mixed' } })}
        />

        <ChallengeRow
          modKey="states"
          icon="pin"
          title="Map Master"
          sub="Tap and name states on the real map"
          onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: 'map' } })}
        />

        {missedCount > 0 && (
          <ChallengeRow
            modKey="review"
            icon="refresh"
            title="Fix your mistakes"
            sub={`${missedCount} question${missedCount > 1 ? 's' : ''} to revisit`}
            onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: 'review' } })}
          />
        )}

        <ChallengeRow
          modKey="daily"
          icon="trophy"
          title="Leaderboard"
          sub="See who's top across Nigeria"
          onPress={() => router.push('/leaderboard')}
        />

        <SectionHead title="Module Quizzes" />
        <View style={styles.quizList}>
          {MODULES.map((m) => {
            const rec = quizzes[m.id];
            const pal = getModulePalette(m.id);
            const badgeInk = pal.onDarkText ? COLORS.white : '#07170d';
            return (
              <Pressable
                key={m.id}
                onPress={() => {
                  sfx.pop();
                  router.push({ pathname: '/quiz/[id]', params: { id: m.id } });
                }}
                style={({ pressed }) => [
                  styles.quizRow,
                  pressed && { transform: [{ scale: 0.98 }] },
                ]}
              >
                <View
                  style={[
                    styles.quizBadge,
                    {
                      backgroundColor: pal.m,
                      borderBottomColor: pal.deep,
                    },
                  ]}
                >
                  <Icon name={rec ? 'check' : 'play'} size={19} color={badgeInk} />
                </View>
                <View style={styles.quizRowMain}>
                  <Text style={styles.quizRowTitle}>{m.name}</Text>
                  <Text style={styles.quizRowSub}>
                    {rec ? `Best ${rec.best}% · played ${rec.plays}×` : 'Not started'}
                  </Text>
                </View>
                <Stars pct={rec ? rec.best : 0} />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg0,
  },
  scroll: {
    paddingTop: 14,
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  bigQuiz: {
    padding: 18,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,200,46,0.4)',
    borderBottomWidth: 5,
    borderBottomColor: '#06110c',
    gap: 10,
  },
  dailyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 99,
    backgroundColor: COLORS.gold,
  },
  dailyTagText: {
    color: '#3a2900',
    fontWeight: '900',
    fontSize: 13,
  },
  bigQuizTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 22,
    lineHeight: 26,
    color: COLORS.text,
  },
  bigQuizSub: {
    color: COLORS.text2,
    fontSize: 14,
    marginBottom: 4,
  },
  mixedQuiz: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderBottomWidth: 5,
  },
  mixedIcon: {
    width: 50,
    height: 50,
    borderRadius: 16,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mixedCopy: {
    flex: 1,
  },
  mixedTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 19,
    color: COLORS.text,
  },
  mixedSub: {
    color: COLORS.text2,
    fontSize: 13.5,
    marginTop: 2,
  },
  quizList: {
    gap: 10,
  },
  quizRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.lineStrong,
    borderBottomWidth: 4,
    borderBottomColor: '#020b06',
  },
  quizBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizRowMain: {
    flex: 1,
  },
  quizRowTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  quizRowSub: {
    color: COLORS.text2,
    fontSize: 13,
    marginTop: 2,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
});

