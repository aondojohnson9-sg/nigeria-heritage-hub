import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { COLORS, FONTS, MODULE_COLORS, RADII, ZONE_COLORS } from '../constants/theme';
import { STATES, ZONES, ZONE_EMOJI, type NigeriaState } from '../data/states';
import { byId } from '../data/modules';
import { useProgress } from '../state/progress';
import { useToast } from '../lib/hooks';
import { sfx } from '../lib/fx';
import Icon from '../components/Icon';
import Confetti from '../components/Confetti';
import NigeriaMap, { type MapMark } from '../components/NigeriaMap';
import PracticeCTA from '../components/Practice';
import { Button, ModuleHero, Sheet } from '../components/ui';

const mod = byId('states')!;

function StateTile({
  s,
  seen,
  onPress,
}: {
  s: NigeriaState;
  seen: boolean;
  onPress: (s: NigeriaState) => void;
}) {
  return (
    <Pressable
      onPress={() => {
        sfx.pop();
        onPress(s);
      }}
      style={({ pressed }) => [styles.tile, pressed && { transform: [{ scale: 0.96 }] }]}
    >
      <Text style={styles.tileEmoji}>{ZONE_EMOJI[s.zone] || '🗺️'}</Text>
      <Text style={styles.tileName}>{s.name}</Text>
      <Text style={styles.tileCapital}>{s.capital}</Text>
      {seen && (
        <View style={styles.learnedDot}>
          <Icon name="check" size={12} color={COLORS.onBright} />
        </View>
      )}
    </Pressable>
  );
}

export default function StatesScreen() {
  const { learned, markLearned, moduleProgress } = useProgress();
  const toast = useToast();
  const params = useLocalSearchParams<{ q?: string }>();
  const initialQ = typeof params.q === 'string' ? params.q : '';

  const [view, setView] = useState<'map' | 'cards'>('map');
  const [zone, setZone] = useState<string>('All');
  const [q, setQ] = useState(initialQ);
  const [picked, setPicked] = useState<string | null>(
    () => STATES.find((s) => s.name === initialQ)?.id || null
  );
  const [sheetState, setSheetState] = useState<NigeriaState | null>(null);
  const [boom, setBoom] = useState(0);

  const done = learned.states || [];
  const list = useMemo(
    () =>
      STATES.filter(
        (s) =>
          (zone === 'All' || s.zone === zone) &&
          `${s.name} ${s.capital}`.toLowerCase().includes(q.trim().toLowerCase())
      ),
    [zone, q]
  );

  const info = STATES.find((s) => s.id === picked);

  const reward = (id: string) => {
    if (markLearned('states', id)) {
      sfx.xp();
      setBoom((b) => b + 1);
      toast({ emoji: '⚡', text: '+5 XP' });
    }
  };

  const onPick = (id: string) => {
    sfx.select();
    setPicked(id);
    reward(id);
    const st = STATES.find((s) => s.id === id);
    if (st) setSheetState(st);
  };

  const marks: Record<string, MapMark> = {};
  for (const id of done) marks[id] = 'learned';
  if (picked) marks[picked] = 'sel';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ModuleHero mod={mod} progress={moduleProgress('states')} />

        {/* Segmented control */}
        <View style={styles.seg}>
          <Pressable
            onPress={() => {
              sfx.tap();
              setView('map');
            }}
            style={[styles.segBtn, view === 'map' && styles.segBtnOn]}
          >
            <Text style={[styles.segText, view === 'map' && styles.segTextOn]}>
              🗺️ Map
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              sfx.tap();
              setView('cards');
            }}
            style={[styles.segBtn, view === 'cards' && styles.segBtnOn]}
          >
            <Text style={[styles.segText, view === 'cards' && styles.segTextOn]}>
              🃏 Grid
            </Text>
          </Pressable>
        </View>

        {/* Zone filter chips */}
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

        {view === 'map' ? (
          <>
            <NigeriaMap
              zones
              activeZone={zone === 'All' ? null : zone}
              marks={marks}
              onPick={onPick}
            />

            {/* Zone color legend */}
            <View style={styles.legend}>
              {ZONES.filter((z) => z !== 'All').map((z) => {
                const slug = z.toLowerCase().replace(/ /g, '-');
                return (
                  <View key={z} style={styles.legendItem}>
                    <View
                      style={[
                        styles.legendDot,
                        { backgroundColor: ZONE_COLORS[slug] || COLORS.green },
                      ]}
                    />
                    <Text style={styles.legendText}>{z}</Text>
                  </View>
                );
              })}
            </View>

            <Text style={styles.hint}>
              {done.length}/{STATES.length} explored · tap a state · use + to zoom into small ones
            </Text>

            {info ? (
              <Pressable
                onPress={() => setSheetState(info)}
                style={styles.stateCard}
              >
                <View style={styles.stateCardHead}>
                  <Text style={styles.stateCardTitle}>
                    {info.name}
                    {info.id === 'fct' ? '' : ' State'}
                  </Text>
                  <View style={styles.zoneChip}>
                    <Text style={styles.zoneChipText}>{info.zone}</Text>
                  </View>
                </View>
                <View style={styles.kv}>
                  <Text style={styles.kvLabel}>CAPITAL</Text>
                  <Text style={styles.kvVal}>{info.capital}</Text>
                </View>
                <View style={styles.kv}>
                  <Text style={styles.kvLabel}>SLOGAN</Text>
                  <Text style={styles.kvVal}>{info.slogan}</Text>
                </View>
                <View style={styles.kv}>
                  <Text style={styles.kvLabel}>
                    {info.id === 'fct' ? 'LED BY' : 'GOVERNOR'}
                  </Text>
                  <Text style={styles.kvVal}>
                    {info.governor.replace('Minister: ', '')}
                  </Text>
                </View>
              </Pressable>
            ) : (
              <View style={[styles.stateCard, styles.emptyCard]}>
                <Text style={styles.emptyCardTitle}>Tap any state to meet it.</Text>
                <Text style={styles.emptyCardSub}>
                  You&apos;ll see its capital, slogan and governor.
                </Text>
              </View>
            )}

            <Button
              variant="module"
              moduleColor="states"
              block
              icon="pin"
              onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: 'map' } })}
            >
              Play Map Master
            </Button>
          </>
        ) : (
          <>
            <View style={styles.searchBox}>
              <Icon name="search" size={20} color={COLORS.text3} />
              <TextInput
                value={q}
                onChangeText={setQ}
                placeholder="Search a state or capital"
                placeholderTextColor={COLORS.text3}
                style={styles.searchInput}
                accessibilityLabel="Search states"
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
            <Text style={styles.hint}>
              Tap a state to view details · {done.length}/{STATES.length} explored
            </Text>
            <View style={styles.tiles}>
              {list.map((s) => (
                <StateTile
                  key={s.id}
                  s={s}
                  seen={done.includes(s.id)}
                  onPress={(st) => {
                    reward(st.id);
                    setPicked(st.id);
                    setSheetState(st);
                  }}
                />
              ))}
            </View>
            {list.length === 0 && (
              <Text style={styles.empty}>No states match “{q}”.</Text>
            )}
          </>
        )}

        <PracticeCTA mod={mod} />
      </ScrollView>

      {/* State detail Sheet */}
      <Sheet
        open={!!sheetState}
        onClose={() => setSheetState(null)}
        title={
          sheetState
            ? `${sheetState.name}${sheetState.id === 'fct' ? '' : ' State'}`
            : undefined
        }
      >
        {sheetState && (
          <View style={{ gap: 10 }}>
            <View style={styles.zoneChip}>
              <Text style={styles.zoneChipText}>
                {ZONE_EMOJI[sheetState.zone]} {sheetState.zone}
              </Text>
            </View>
            <View style={styles.kv}>
              <Text style={styles.kvLabel}>CAPITAL</Text>
              <Text style={styles.kvVal}>{sheetState.capital}</Text>
            </View>
            <View style={styles.kv}>
              <Text style={styles.kvLabel}>SLOGAN</Text>
              <Text style={styles.kvVal}>{sheetState.slogan}</Text>
            </View>
            <View style={styles.kv}>
              <Text style={styles.kvLabel}>
                {sheetState.id === 'fct' ? 'LED BY' : 'GOVERNOR'}
              </Text>
              <Text style={styles.kvVal}>
                {sheetState.governor.replace('Minister: ', '')}
              </Text>
            </View>
            {sheetState.note ? (
              <Text style={styles.note}>{sheetState.note}</Text>
            ) : null}
            <Button
              variant="module"
              moduleColor="states"
              block
              onPress={() => setSheetState(null)}
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
  seg: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    marginBottom: 14,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 13,
    alignItems: 'center',
  },
  segBtnOn: {
    backgroundColor: COLORS.green,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.greenDeep,
  },
  segText: {
    fontWeight: '900',
    fontSize: 15,
    color: COLORS.text2,
  },
  segTextOn: {
    color: COLORS.onBright,
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
    backgroundColor: MODULE_COLORS.states.m,
    borderColor: MODULE_COLORS.states.m,
  },
  chipBtnText: {
    fontWeight: '800',
    fontSize: 13.5,
    color: COLORS.text2,
  },
  chipBtnTextOn: {
    color: '#07170d',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: COLORS.text2,
    fontSize: 12,
    fontWeight: '700',
  },
  hint: {
    color: COLORS.text2,
    fontSize: 13.5,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  stateCard: {
    gap: 8,
    marginBottom: 14,
    padding: 14,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: 'rgba(37,217,126,0.55)',
    borderBottomWidth: 5,
    borderBottomColor: '#04140c',
  },
  emptyCard: {
    borderStyle: 'dashed',
    borderColor: COLORS.lineStrong,
    alignItems: 'center',
    paddingVertical: 18,
  },
  emptyCardTitle: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 16,
  },
  emptyCardSub: {
    color: COLORS.text2,
    fontSize: 13.5,
  },
  stateCardHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  stateCardTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 22,
    color: COLORS.text,
  },
  zoneChip: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADII.pill,
    backgroundColor: 'rgba(37,217,126,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(37,217,126,0.45)',
  },
  zoneChipText: {
    color: '#9ff8c7',
    fontSize: 12,
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
    marginTop: 4,
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
  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tile: {
    position: 'relative',
    width: '48%',
    flexGrow: 1,
    minHeight: 124,
    padding: 14,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    borderBottomWidth: 5,
    borderBottomColor: '#020b06',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tileEmoji: {
    fontSize: 28,
  },
  tileName: {
    fontFamily: FONTS.displaySemi,
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
  },
  tileCapital: {
    color: COLORS.green,
    fontWeight: '800',
    fontSize: 13,
    textAlign: 'center',
  },
  learnedDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    textAlign: 'center',
    color: COLORS.text2,
    paddingVertical: 24,
  },
});
