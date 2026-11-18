import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, MODULE_COLORS, RADII } from '../constants/theme';
import { ERAS, PRESIDENTS, type EraId, type President } from '../data/presidents';
import { byId } from '../data/modules';
import { useProgress } from '../state/progress';
import { sfx } from '../lib/fx';
import { useToast } from '../lib/hooks';
import Icon from '../components/Icon';
import Confetti from '../components/Confetti';
import PracticeCTA from '../components/Practice';
import { ModuleHero } from '../components/ui';

const mod = byId('presidents')!;

const ERA_COLORS: Record<EraId, { m: string; deep: string }> = {
  first: { m: '#3d8bff', deep: '#2260c4' },
  mil1: { m: '#7a8f3a', deep: '#566a22' },
  second: { m: '#14b8a6', deep: '#0c8174' },
  mil2: { m: '#b0762f', deep: '#80521a' },
  fourth: { m: '#25a667', deep: '#167a49' },
};

const initials = (n: string) =>
  n
    .replace(/[^A-Za-z' -]/g, '')
    .split(/[ -]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

function PresidentCard({
  p,
  learned,
  onFlip,
}: {
  p: President;
  learned: boolean;
  onFlip: (p: President) => void;
}) {
  const [flipped, setFlipped] = useState(false);
  const eraPal = ERA_COLORS[p.era];

  return (
    <Pressable
      onPress={() => {
        sfx.pop();
        setFlipped((f) => {
          const next = !f;
          if (next) onFlip(p);
          return next;
        });
      }}
      accessibilityLabel={`${p.name}, ${p.years}. Tap to ${flipped ? 'hide' : 'read'} highlights.`}
      style={({ pressed }) => [
        styles.card,
        flipped && {
          backgroundColor: '#12293e',
          borderColor: eraPal.m,
        },
        p.current &&
          !flipped && {
            borderColor: COLORS.green,
            borderBottomColor: COLORS.greenDeep,
          },
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      {p.current && !flipped && (
        <View style={styles.inOffice}>
          <Text style={styles.inOfficeText}>In office</Text>
        </View>
      )}

      {!flipped ? (
        <View style={styles.cardFront}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: eraPal.m, borderBottomColor: eraPal.deep },
            ]}
          >
            <Text style={styles.avatarText}>{initials(p.name)}</Text>
          </View>
          <View style={styles.presMain}>
            <Text style={styles.presName}>{p.name}</Text>
            <Text style={styles.presYears}>{p.years}</Text>
            <View style={styles.chip}>
              <Text style={styles.chipText}>{p.title}</Text>
            </View>
          </View>
          {learned ? (
            <View style={styles.learnedDot}>
              <Icon name="check" size={13} color={COLORS.onBright} />
            </View>
          ) : (
            <Text style={styles.tapHint}>TAP</Text>
          )}
        </View>
      ) : (
        <View style={styles.cardBack}>
          <View style={styles.cardBackHead}>
            <Text style={styles.backTitle}>{p.name}</Text>
            <Text style={styles.tapHint}>TAP TO FLIP</Text>
          </View>
          <View style={styles.points}>
            {p.points.map((pt) => (
              <View key={pt} style={styles.pointRow}>
                <View style={[styles.pointDot, { backgroundColor: eraPal.m }]} />
                <Text style={styles.pointText}>{pt}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Pressable>
  );
}

export default function PresidentsScreen() {
  const { learned, markLearned, moduleProgress } = useProgress();
  const toast = useToast();
  const [boom, setBoom] = useState(0);
  const done = learned.presidents || [];

  const onFlip = (p: President) => {
    if (markLearned('presidents', p.id)) {
      sfx.xp();
      setBoom((b) => b + 1);
      toast({ emoji: '⚡', text: '+5 XP' });
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <ModuleHero mod={mod} progress={moduleProgress('presidents')} />
        <Text style={styles.hint}>
          Flip each card to read the highlights. {done.length}/{PRESIDENTS.length} read.
        </Text>

        {ERAS.map((era) => (
          <View key={era.id} style={styles.era}>
            <View style={styles.eraHead}>
              <Text style={styles.eraTitle}>{era.label}</Text>
              <Text style={styles.eraRange}>{era.range}</Text>
            </View>
            <View style={styles.eraList}>
              {PRESIDENTS.filter((p) => p.era === era.id).map((p) => (
                <PresidentCard
                  key={p.id}
                  p={p}
                  learned={done.includes(p.id)}
                  onFlip={onFlip}
                />
              ))}
            </View>
          </View>
        ))}

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
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  era: {
    marginBottom: 8,
  },
  eraHead: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 18,
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  eraTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 20,
    color: '#9ec5ff',
  },
  eraRange: {
    color: COLORS.text3,
    fontWeight: '800',
    fontSize: 13,
  },
  eraList: {
    gap: 12,
  },
  card: {
    position: 'relative',
    borderRadius: RADII.lg,
    padding: 14,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    borderBottomWidth: 5,
    borderBottomColor: '#020b06',
  },
  cardFront: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FONTS.display,
    fontSize: 20,
    color: COLORS.white,
  },
  presMain: {
    flex: 1,
    gap: 3,
  },
  presName: {
    fontFamily: FONTS.displaySemi,
    fontSize: 18,
    color: COLORS.text,
  },
  presYears: {
    color: COLORS.text2,
    fontWeight: '800',
    fontSize: 13.5,
  },
  chip: {
    alignSelf: 'flex-start',
    marginTop: 2,
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: RADII.pill,
    backgroundColor: 'rgba(61, 139, 255, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(61, 139, 255, 0.45)',
  },
  chipText: {
    color: '#b9d6ff',
    fontSize: 11.5,
    fontWeight: '800',
  },
  learnedDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tapHint: {
    color: COLORS.text3,
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  inOffice: {
    position: 'absolute',
    top: -10,
    right: 14,
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 99,
    backgroundColor: COLORS.gold,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.goldDeep,
    zIndex: 2,
  },
  inOfficeText: {
    color: '#3a2900',
    fontSize: 11.5,
    fontWeight: '900',
  },
  cardBack: {
    gap: 8,
  },
  cardBackHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 18,
    color: MODULE_COLORS.presidents.m,
  },
  points: {
    gap: 6,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  pointDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  pointText: {
    flex: 1,
    color: '#e1efe6',
    fontSize: 14.5,
    lineHeight: 20,
  },
});

