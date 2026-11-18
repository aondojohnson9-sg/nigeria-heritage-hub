import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { COLORS, FONTS, MODULE_COLORS, RADII } from '../constants/theme';
import { HISTORY, type HistoryStop } from '../data/history';
import { byId } from '../data/modules';
import { useProgress } from '../state/progress';
import { sfx } from '../lib/fx';
import { useToast } from '../lib/hooks';
import Icon from '../components/Icon';
import Confetti from '../components/Confetti';
import PracticeCTA from '../components/Practice';
import { Button, ModuleHero, Sheet } from '../components/ui';

const mod = byId('history')!;
const pal = MODULE_COLORS.history;

export default function HistoryScreen() {
  const { learned, markLearned, moduleProgress } = useProgress();
  const toast = useToast();
  const params = useLocalSearchParams<{ q?: string }>();
  const [open, setOpen] = useState<HistoryStop | null>(() => {
    const q = typeof params.q === 'string' ? params.q.toLowerCase() : '';
    return (q && HISTORY.find((x) => x.title.toLowerCase() === q)) || null;
  });
  const [boom, setBoom] = useState(0);
  const done = learned.history || [];

  const complete = (h: HistoryStop) => {
    if (markLearned('history', h.id)) {
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
        <ModuleHero mod={mod} progress={moduleProgress('history')} />
        <Text style={styles.hint}>Tap each stop on the journey to learn it.</Text>

        <View style={styles.path}>
          {HISTORY.map((h, i) => {
            const isDone = done.includes(h.id);
            const firstOpen = !isDone && HISTORY.findIndex((x) => !done.includes(x.id)) === i;
            const side = (['c', 'r', 'c', 'l'] as const)[i % 4];
            const offsetX = side === 'r' ? 54 : side === 'l' ? -54 : 0;

            return (
              <View key={h.id} style={[styles.pathItem, { transform: [{ translateX: offsetX }] }]}>
                {firstOpen && (
                  <View style={styles.startBubble}>
                    <Text style={styles.startText}>START</Text>
                  </View>
                )}
                <Pressable
                  onPress={() => {
                    sfx.pop();
                    setOpen(h);
                  }}
                  accessibilityLabel={`${h.title}, ${h.year}${isDone ? ', learned' : ''}`}
                  style={({ pressed }) => [
                    styles.node,
                    isDone ? styles.nodeDone : styles.nodePending,
                    pressed && { transform: [{ translateY: 4 }] },
                  ]}
                >
                  <Text style={styles.nodeEmoji}>{h.emoji}</Text>
                  {isDone && (
                    <View style={styles.nodeCheck}>
                      <Icon name="check" size={14} color={COLORS.greenDeep} />
                    </View>
                  )}
                </Pressable>
                <View style={styles.nodeLabel}>
                  <Text style={styles.nodeTitle}>{h.title}</Text>
                  <Text style={styles.nodeYear}>{h.year}</Text>
                </View>
              </View>
            );
          })}
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
                {open.tag} · {open.year}
              </Text>
            </View>
            <Text style={styles.lessonTitle}>{open.title}</Text>
            <Text style={styles.lessonBody}>{open.text}</Text>
            <View style={styles.funfact}>
              <Icon name="sparkles" size={18} color={COLORS.gold} />
              <Text style={styles.funfactText}>{open.fun}</Text>
            </View>
            <Button
              variant="module"
              moduleColor="history"
              size="lg"
              block
              onPress={() => complete(open)}
            >
              {done.includes(open.id) ? 'Done' : 'Got it! +5 XP'}
            </Button>
          </View>
        )}
      </Sheet>

      <Confetti fire={boom} power={0.5} origin={[0.5, 0.7]} />
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
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  path: {
    gap: 18,
    paddingTop: 22,
    paddingBottom: 18,
    alignItems: 'center',
  },
  pathItem: {
    alignItems: 'center',
    gap: 8,
  },
  startBubble: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    marginBottom: 2,
  },
  startText: {
    color: pal.deep,
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.6,
  },
  node: {
    width: 82,
    height: 82,
    borderRadius: 41,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderBottomWidth: 8,
  },
  nodePending: {
    backgroundColor: pal.m,
    borderColor: '#ffd27d',
    borderBottomColor: pal.deep,
  },
  nodeDone: {
    backgroundColor: COLORS.green,
    borderColor: '#b6ffd5',
    borderBottomColor: COLORS.greenDeep,
  },
  nodeEmoji: {
    fontSize: 34,
  },
  nodeCheck: {
    position: 'absolute',
    right: -4,
    top: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeLabel: {
    alignItems: 'center',
    maxWidth: 180,
  },
  nodeTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 16.5,
    color: COLORS.text,
    textAlign: 'center',
  },
  nodeYear: {
    color: COLORS.text2,
    fontSize: 12.5,
    marginTop: 2,
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
  chip: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADII.pill,
    backgroundColor: 'rgba(245, 165, 36, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(245, 165, 36, 0.45)',
  },
  chipText: {
    color: '#ffe0a3',
    fontSize: 13,
    fontWeight: '800',
  },
  lessonTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 26,
    color: COLORS.text,
  },
  lessonBody: {
    color: '#d2e6da',
    fontSize: 16,
    lineHeight: 24,
  },
  funfact: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(255,200,46,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,200,46,0.35)',
    width: '100%',
  },
  funfactText: {
    flex: 1,
    color: '#ffe9a6',
    fontSize: 14.5,
    lineHeight: 20,
  },
});

