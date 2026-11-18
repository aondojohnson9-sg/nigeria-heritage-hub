import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { COLORS, FONTS, MODULE_COLORS, RADII } from '../constants/theme';
import { UPDATES, fmtDate, type TodayExplainer } from '../data/today';
import { byId } from '../data/modules';
import { useProgress } from '../state/progress';
import { sfx } from '../lib/fx';
import { useToast } from '../lib/hooks';
import Icon from '../components/Icon';
import Confetti from '../components/Confetti';
import LiveHeadlines from '../components/LiveHeadlines';
import PracticeCTA from '../components/Practice';
import { Button, ModuleHero, SectionHead, Sheet } from '../components/ui';

const mod = byId('today')!;
const pal = MODULE_COLORS.today;

export default function TodayScreen() {
  const { learned, markLearned, moduleProgress } = useProgress();
  const toast = useToast();
  const params = useLocalSearchParams<{ open?: string; q?: string }>();
  const [open, setOpen] = useState<TodayExplainer | null>(() => {
    if (typeof params.open === 'string') {
      return UPDATES.find((u) => u.id === params.open) || null;
    }
    if (typeof params.q === 'string') {
      const q = params.q.toLowerCase();
      return UPDATES.find((u) => u.title.toLowerCase().includes(q)) || null;
    }
    return null;
  });
  const [boom, setBoom] = useState(0);
  const done = learned.today || [];

  const finish = (u: TodayExplainer) => {
    if (markLearned('today', u.id)) {
      sfx.xp();
      setBoom((b) => b + 1);
      toast({ emoji: '⚡', text: '+5 XP' });
    } else {
      sfx.tap();
    }
    setOpen(null);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ModuleHero mod={mod} progress={moduleProgress('today')} />

        <SectionHead title="Live headlines" />
        <LiveHeadlines />

        <SectionHead title="Explainers" />
        <Text style={styles.hint}>
          Learn how Nigeria works — these count towards your progress.
        </Text>

        <View style={styles.feed}>
          {UPDATES.map((u) => (
            <Pressable
              key={u.id}
              onPress={() => {
                sfx.pop();
                setOpen(u);
              }}
              style={({ pressed }) => [
                styles.feedCard,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
            >
              <View style={styles.feedArt}>
                <Text style={styles.feedEmoji}>{u.emoji}</Text>
              </View>
              <View style={styles.feedBody}>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>{u.tag}</Text>
                </View>
                <Text style={styles.feedTitle}>{u.title}</Text>
                <Text style={styles.feedTeaser}>{u.teaser}</Text>
                <View style={styles.dateRow}>
                  <Icon name="book" size={13} color={COLORS.text3} />
                  <Text style={styles.dateText}>{fmtDate(u.date)}</Text>
                </View>
              </View>
              {done.includes(u.id) && (
                <View style={styles.learnedDot}>
                  <Icon name="check" size={13} color={COLORS.onBright} />
                </View>
              )}
            </Pressable>
          ))}
        </View>

        <PracticeCTA mod={mod} />
      </ScrollView>

      <Sheet open={!!open} onClose={() => setOpen(null)}>
        {open && (
          <View style={styles.lesson}>
            <View style={styles.lessonEmojiBox}>
              <Text style={styles.lessonEmoji}>{open.emoji}</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                {open.tag} · {fmtDate(open.date)}
              </Text>
            </View>
            <Text style={styles.lessonTitle}>{open.title}</Text>
            <Text style={styles.lessonBody}>{open.body}</Text>
            <Button
              variant="module"
              moduleColor="today"
              size="lg"
              block
              onPress={() => finish(open)}
            >
              {done.includes(open.id) ? 'Done' : 'Got it! +5 XP'}
            </Button>
          </View>
        )}
      </Sheet>

      <Confetti fire={boom} power={0.4} origin={[0.5, 0.7]} />
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
    paddingBottom: 32,
  },
  hint: {
    color: COLORS.text2,
    fontSize: 13.5,
    marginBottom: 14,
  },
  feed: {
    gap: 12,
  },
  feedCard: {
    position: 'relative',
    flexDirection: 'row',
    gap: 12,
    padding: 10,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    borderBottomWidth: 5,
    borderBottomColor: '#020b06',
  },
  feedArt: {
    width: 82,
    minHeight: 88,
    borderRadius: 16,
    backgroundColor: pal.deep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedEmoji: {
    fontSize: 36,
  },
  feedBody: {
    flex: 1,
    gap: 4,
  },
  chip: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: RADII.pill,
    backgroundColor: 'rgba(31, 200, 219, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(31, 200, 219, 0.45)',
  },
  chipText: {
    color: '#aef4fc',
    fontSize: 11.5,
    fontWeight: '800',
  },
  feedTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 17,
    lineHeight: 21,
    color: COLORS.text,
  },
  feedTeaser: {
    color: COLORS.text2,
    fontSize: 13.5,
    lineHeight: 18,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  dateText: {
    color: COLORS.text3,
    fontSize: 12,
    fontWeight: '800',
  },
  learnedDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lesson: {
    gap: 12,
    alignItems: 'flex-start',
  },
  lessonEmojiBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: pal.m,
    borderBottomWidth: 5,
    borderBottomColor: pal.deep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonEmoji: {
    fontSize: 38,
  },
  lessonTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 25,
    color: COLORS.text,
  },
  lessonBody: {
    color: '#d2e6da',
    fontSize: 16,
    lineHeight: 24,
  },
});

