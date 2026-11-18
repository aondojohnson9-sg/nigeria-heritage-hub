import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { COLORS, FONTS, getModulePalette } from '../constants/theme';
import type { ModuleItem } from '../data/modules';
import { useProgress } from '../state/progress';
import Mascot from './Mascot';
import { Button } from './ui';

export default function PracticeCTA({ mod }: { mod: ModuleItem }) {
  const { quizzes } = useProgress();
  const best = quizzes[mod.id]?.best;
  const pal = getModulePalette(mod.id);

  return (
    <View
      style={[
        styles.practice,
        {
          borderColor: pal.m,
          borderBottomColor: pal.deep,
        },
      ]}
    >
      <View style={styles.row}>
        <Mascot mood="happy" size={72} />
        <View style={styles.copy}>
          <Text style={styles.title}>Ready to test yourself?</Text>
          <Text style={styles.sub}>
            {best != null ? `Your best: ${best}%. Beat it!` : 'Quick quiz · earn XP and stars'}
          </Text>
        </View>
      </View>
      <Button
        variant="module"
        moduleColor={mod.id}
        iconRight="right"
        block
        onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: mod.id } })}
      >
        Start quiz
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  practice: {
    marginTop: 26,
    padding: 14,
    borderRadius: 26,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderBottomWidth: 5,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  copy: {
    flex: 1,
  },
  title: {
    fontFamily: FONTS.displaySemi,
    fontSize: 19,
    color: COLORS.text,
  },
  sub: {
    color: COLORS.text2,
    fontSize: 13.5,
    marginTop: 2,
    fontWeight: '600',
  },
});

