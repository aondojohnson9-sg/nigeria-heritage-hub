import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, MODULE_COLORS, RADII } from '../constants/theme';
import { MONTHS, forDate, type HistoricalDateEvent } from '../data/onThisDay';
import { sfx } from '../lib/fx';
import { useToast } from '../lib/hooks';
import { useProgress } from '../state/progress';
import Confetti from './Confetti';
import Icon from './Icon';
import { Button, Sheet } from './ui';

const idOf = (e: HistoricalDateEvent) => `${e.m}-${e.d}-${e.y}`;

export default function OnThisDay() {
  const { learned, markLearned } = useProgress();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [boom, setBoom] = useState(0);
  const [{ kind, events, daysAway }] = useState(() => forDate());
  const first = events[0];
  const seen = learned.otd || [];
  const label =
    kind === 'today'
      ? 'On this day'
      : daysAway === 1
        ? 'Tomorrow in history'
        : `Coming up in ${daysAway} days`;

  const read = (e: HistoricalDateEvent) => {
    if (markLearned('otd', idOf(e))) {
      sfx.xp();
      setBoom((b) => b + 1);
      toast({ emoji: '⏳', text: '+5 XP' });
    }
  };

  const allSeen = events.every((e) => seen.includes(idOf(e)));

  return (
    <>
      <Pressable
        onPress={() => {
          sfx.pop();
          setOpen(true);
          events.forEach(read);
        }}
        style={({ pressed }) => [styles.otd, pressed && { transform: [{ scale: 0.98 }] }]}
      >
        <View style={styles.dateBox}>
          <Text style={styles.dateDay}>{first.d}</Text>
          <Text style={styles.dateMonth}>{MONTHS[first.m - 1]}</Text>
        </View>
        <View style={styles.body}>
          <View style={styles.labelRow}>
            <Icon name="sparkles" size={14} color={COLORS.gold} />
            <Text style={styles.labelText}>
              {label} · {first.y}
            </Text>
          </View>
          <Text style={styles.title}>{first.title}</Text>
          <Text style={styles.text} numberOfLines={3}>
            {first.text}
          </Text>
          {events.length > 1 && (
            <View style={styles.extraChip}>
              <Text style={styles.extraChipText}>+{events.length - 1} more on this date</Text>
            </View>
          )}
        </View>
        {allSeen && (
          <View style={styles.learnedDot}>
            <Icon name="check" size={13} color={COLORS.onBright} />
          </View>
        )}
      </Pressable>

      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title={`${first.d} ${MONTHS[first.m - 1]} in history`}
      >
        {events.map((e) => (
          <View key={idOf(e)} style={styles.sheetItem}>
            <View style={styles.yearChip}>
              <Text style={styles.yearChipText}>{e.y}</Text>
            </View>
            <Text style={styles.sheetTitle}>{e.title}</Text>
            <Text style={styles.sheetText}>{e.text}</Text>
          </View>
        ))}
        <Button
          variant="module"
          moduleColor="history"
          size="lg"
          block
          onPress={() => setOpen(false)}
        >
          Got it
        </Button>
      </Sheet>

      <Confetti fire={boom} power={0.4} origin={[0.5, 0.7]} />
    </>
  );
}

const styles = StyleSheet.create({
  otd: {
    position: 'relative',
    flexDirection: 'row',
    gap: 14,
    marginTop: 14,
    padding: 14,
    borderRadius: 24,
    backgroundColor: '#251a08',
    borderWidth: 1,
    borderColor: 'rgba(245, 165, 36, 0.45)',
    borderBottomWidth: 5,
    borderBottomColor: '#120d04',
  },
  dateBox: {
    width: 62,
    height: 72,
    borderRadius: 18,
    backgroundColor: MODULE_COLORS.history.m,
    borderBottomWidth: 4,
    borderBottomColor: MODULE_COLORS.history.deep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    fontFamily: FONTS.display,
    fontSize: 28,
    lineHeight: 30,
    color: '#2c1b00',
  },
  dateMonth: {
    fontWeight: '900',
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 0.6,
    color: '#2c1b00',
  },
  body: {
    flex: 1,
    gap: 3,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  labelText: {
    color: COLORS.gold,
    fontWeight: '900',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  title: {
    fontFamily: FONTS.displaySemi,
    fontSize: 18.5,
    lineHeight: 22,
    color: COLORS.text,
  },
  text: {
    color: COLORS.text2,
    fontSize: 13.5,
    lineHeight: 18,
  },
  extraChip: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: RADII.pill,
    backgroundColor: 'rgba(245, 165, 36, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(245, 165, 36, 0.45)',
  },
  extraChipText: {
    color: '#ffe0a3',
    fontSize: 11.5,
    fontWeight: '800',
  },
  learnedDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheetItem: {
    gap: 6,
    marginBottom: 8,
  },
  yearChip: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADII.pill,
    backgroundColor: 'rgba(245, 165, 36, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(245, 165, 36, 0.45)',
  },
  yearChipText: {
    color: '#ffe0a3',
    fontWeight: '800',
    fontSize: 13,
  },
  sheetTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 22,
    color: COLORS.text,
  },
  sheetText: {
    color: '#d2e6da',
    fontSize: 16,
    lineHeight: 23,
  },
});

