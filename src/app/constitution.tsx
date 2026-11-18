import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { COLORS, FONTS, MODULE_COLORS, RADII } from '../constants/theme';
import { CHAPTERS, type ConstitutionChapter } from '../data/constitution';
import { byId } from '../data/modules';
import { useProgress } from '../state/progress';
import { sfx } from '../lib/fx';
import { useToast } from '../lib/hooks';
import Icon from '../components/Icon';
import Confetti from '../components/Confetti';
import PracticeCTA from '../components/Practice';
import { ModuleHero } from '../components/ui';

const mod = byId('constitution')!;
const pal = MODULE_COLORS.constitution;

export default function ConstitutionScreen() {
  const { learned, markLearned, moduleProgress } = useProgress();
  const toast = useToast();
  const params = useLocalSearchParams<{ q?: string }>();
  const [open, setOpen] = useState<string | null>(() => {
    const q = typeof params.q === 'string' ? params.q.toLowerCase() : '';
    return (q && CHAPTERS.find((c) => c.title.toLowerCase().includes(q))?.id) || null;
  });
  const [boom, setBoom] = useState(0);
  const done = learned.constitution || [];

  const toggle = (c: ConstitutionChapter) => {
    sfx.pop();
    const next = open === c.id ? null : c.id;
    setOpen(next);
    if (next && markLearned('constitution', c.id)) {
      sfx.xp();
      setBoom((b) => b + 1);
      toast({ emoji: '⚡', text: '+5 XP' });
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ModuleHero mod={mod} progress={moduleProgress('constitution')} />
        <Text style={styles.hint}>
          The 1999 Constitution of the Federal Republic of Nigeria · {done.length}/
          {CHAPTERS.length} chapters read
        </Text>

        <View style={styles.accList}>
          {CHAPTERS.map((c) => {
            const isOpen = open === c.id;
            return (
              <View
                key={c.id}
                style={[
                  styles.acc,
                  isOpen && { borderColor: pal.m, borderBottomColor: pal.deep },
                ]}
              >
                <Pressable
                  onPress={() => toggle(c)}
                  accessibilityState={{ expanded: isOpen }}
                  style={styles.accHead}
                >
                  <View style={styles.accBadge}>
                    <Text style={styles.accBadgeText}>{c.num}</Text>
                  </View>
                  <View style={styles.accMain}>
                    <Text style={styles.accTitle}>{c.title}</Text>
                    <Text style={styles.accRange}>{c.range}</Text>
                  </View>
                  {done.includes(c.id) && (
                    <View style={styles.learnedDot}>
                      <Icon name="check" size={12} color={COLORS.onBright} />
                    </View>
                  )}
                  <View style={isOpen ? { transform: [{ rotate: '180deg' }] } : undefined}>
                    <Icon
                      name="down"
                      size={18}
                      color={isOpen ? pal.m : COLORS.text3}
                    />
                  </View>
                </Pressable>

                {isOpen && (
                  <View style={styles.accBody}>
                    <Text style={styles.accSummary}>{c.summary}</Text>
                    <View style={styles.points}>
                      {c.points.map((pt) => (
                        <View key={pt} style={styles.pointRow}>
                          <View style={styles.pointDot} />
                          <Text style={styles.pointText}>{pt}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <PracticeCTA mod={mod} />
      </ScrollView>

      <Confetti fire={boom} power={0.4} origin={[0.5, 0.6]} />
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
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  accList: {
    gap: 10,
  },
  acc: {
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    borderBottomWidth: 5,
    borderBottomColor: '#020b06',
    overflow: 'hidden',
  },
  accHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  accBadge: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: pal.m,
    borderBottomWidth: 4,
    borderBottomColor: pal.deep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accBadgeText: {
    fontFamily: FONTS.display,
    fontSize: 18,
    color: COLORS.white,
  },
  accMain: {
    flex: 1,
  },
  accTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 17,
    color: COLORS.text,
  },
  accRange: {
    color: COLORS.text2,
    fontSize: 13,
    marginTop: 2,
  },
  learnedDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accBody: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 10,
  },
  accSummary: {
    color: '#d2e6da',
    lineHeight: 22,
    fontSize: 15,
  },
  points: {
    gap: 8,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: COLORS.surface2,
  },
  pointDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: pal.m,
    marginTop: 6,
  },
  pointText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
  },
});

