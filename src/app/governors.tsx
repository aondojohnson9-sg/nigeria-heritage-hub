import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { COLORS, FONTS, MODULE_COLORS, RADII } from '../constants/theme';
import { GOVERNORS_AS_OF, STATES, ZONES, type NigeriaState } from '../data/states';
import { byId } from '../data/modules';
import { useProgress } from '../state/progress';
import { sfx } from '../lib/fx';
import { useToast } from '../lib/hooks';
import Icon from '../components/Icon';
import Confetti from '../components/Confetti';
import PracticeCTA from '../components/Practice';
import { Button, ModuleHero, Sheet } from '../components/ui';

const mod = byId('governors')!;
const pal = MODULE_COLORS.governors;

export default function GovernorsScreen() {
  const { learned, markLearned, moduleProgress } = useProgress();
  const toast = useToast();
  const params = useLocalSearchParams<{ q?: string }>();
  const [zone, setZone] = useState<string>('All');
  const [q, setQ] = useState(typeof params.q === 'string' ? params.q : '');
  const [open, setOpen] = useState<NigeriaState | null>(null);
  const [boom, setBoom] = useState(0);
  const done = learned.governors || [];

  const list = useMemo(
    () =>
      STATES.filter(
        (s) =>
          (zone === 'All' || s.zone === zone) &&
          `${s.name} ${s.slogan} ${s.governor}`
            .toLowerCase()
            .includes(q.trim().toLowerCase())
      ),
    [zone, q]
  );

  const openGov = (s: NigeriaState) => {
    sfx.pop();
    setOpen(s);
    if (markLearned('governors', s.id)) {
      sfx.xp();
      setBoom((b) => b + 1);
      toast({ emoji: '⚡', text: '+5 XP' });
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ModuleHero mod={mod} progress={moduleProgress('governors')} />

        <View style={styles.searchBox}>
          <Icon name="search" size={20} color={COLORS.text3} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Search a state, slogan or governor"
            placeholderTextColor={COLORS.text3}
            style={styles.searchInput}
            accessibilityLabel="Search governors and slogans"
          />
          {q ? (
            <Pressable
              onPress={() => setQ('')}
              accessibilityLabel="Clear"
              style={styles.searchClear}
            >
              <Icon name="x" size={14} color={COLORS.text} />
            </Pressable>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
          style={{ marginHorizontal: -18 }}
        >
          {ZONES.map((z) => {
            const on = zone === z;
            return (
              <Pressable
                key={z}
                onPress={() => {
                  sfx.tap();
                  setZone(z);
                }}
                style={[styles.chipBtn, on && styles.chipBtnOn]}
              >
                <Text style={[styles.chipBtnText, on && styles.chipBtnTextOn]}>{z}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <Text style={styles.hint}>
          Governors as of {GOVERNORS_AS_OF}. Tap a state to see who leads it.
        </Text>

        <View style={styles.list}>
          {list.map((s) => {
            const isDone = done.includes(s.id);
            return (
              <Pressable
                key={s.id}
                onPress={() => openGov(s)}
                style={({ pressed }) => [
                  styles.row,
                  pressed && { transform: [{ scale: 0.98 }] },
                ]}
              >
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {s.name.slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.main}>
                  <Text style={styles.slogan}>{s.slogan}</Text>
                  <Text style={styles.stateName}>
                    {s.name} State · {s.governor.replace('Minister: ', '')}
                  </Text>
                </View>
                {isDone && (
                  <View style={styles.learnedDot}>
                    <Icon name="check" size={12} color={COLORS.onBright} />
                  </View>
                )}
                <Icon name="right" size={18} color={COLORS.text3} />
              </Pressable>
            );
          })}
        </View>

        {list.length === 0 && (
          <Text style={styles.empty}>Nothing matches “{q}”.</Text>
        )}

        <PracticeCTA mod={mod} />
      </ScrollView>

      <Sheet
        open={!!open}
        onClose={() => setOpen(null)}
        title={open ? `${open.name}${open.id === 'fct' ? '' : ' State'}` : undefined}
      >
        {open && (
          <View style={{ gap: 10 }}>
            <View style={styles.zoneChip}>
              <Text style={styles.zoneChipText}>{open.slogan}</Text>
            </View>
            <View style={styles.kv}>
              <Text style={styles.kvLabel}>
                {open.id === 'fct' ? 'LED BY' : 'GOVERNOR'}
              </Text>
              <Text style={styles.kvVal}>
                {open.governor.replace('Minister: ', '')}
              </Text>
            </View>
            <View style={styles.kv}>
              <Text style={styles.kvLabel}>CAPITAL</Text>
              <Text style={styles.kvVal}>{open.capital}</Text>
            </View>
            <View style={styles.kv}>
              <Text style={styles.kvLabel}>ZONE</Text>
              <Text style={styles.kvVal}>{open.zone}</Text>
            </View>
            {open.note ? <Text style={styles.note}>{open.note}</Text> : null}
            <Button
              variant="module"
              moduleColor="governors"
              block
              onPress={() => setOpen(null)}
            >
              Got it
            </Button>
          </View>
        )}
      </Sheet>

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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 50,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 15.5,
  },
  searchClear: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: {
    paddingHorizontal: 18,
    gap: 8,
    paddingBottom: 10,
  },
  chipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.line,
  },
  chipBtnOn: {
    backgroundColor: pal.m,
    borderColor: pal.m,
  },
  chipBtnText: {
    fontWeight: '800',
    fontSize: 13.5,
    color: COLORS.text2,
  },
  chipBtnTextOn: {
    color: COLORS.white,
  },
  hint: {
    color: COLORS.text2,
    fontSize: 13.5,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 14,
  },
  list: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    borderBottomWidth: 5,
    borderBottomColor: '#020b06',
  },
  badge: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: pal.m,
    borderBottomWidth: 4,
    borderBottomColor: pal.deep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: FONTS.display,
    fontSize: 17,
    color: COLORS.white,
  },
  main: {
    flex: 1,
  },
  slogan: {
    fontFamily: FONTS.displaySemi,
    fontSize: 17,
    color: COLORS.text,
  },
  stateName: {
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
  empty: {
    textAlign: 'center',
    color: COLORS.text2,
    paddingVertical: 24,
  },
  zoneChip: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADII.pill,
    backgroundColor: 'rgba(155, 107, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(155, 107, 255, 0.45)',
  },
  zoneChipText: {
    color: '#dec9ff',
    fontSize: 13,
    fontWeight: '800',
  },
  kv: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: COLORS.surface2,
  },
  kvLabel: {
    color: COLORS.text2,
    fontWeight: '800',
    fontSize: 11.5,
    letterSpacing: 0.5,
  },
  kvVal: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 15,
    flexShrink: 1,
    textAlign: 'right',
  },
  note: {
    color: COLORS.text2,
    fontSize: 13.5,
    lineHeight: 19,
  },
});

