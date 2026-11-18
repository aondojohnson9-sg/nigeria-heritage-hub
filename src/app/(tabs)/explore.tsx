import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, type Href } from 'expo-router';
import { COLORS, FONTS, RADII, getModulePalette } from '../../constants/theme';
import { MODULES, byId } from '../../data/modules';
import { STATES } from '../../data/states';
import { PRESIDENTS } from '../../data/presidents';
import { HISTORY } from '../../data/history';
import { CHAPTERS } from '../../data/constitution';
import { UPDATES } from '../../data/today';
import { useProgress } from '../../state/progress';
import { sfx } from '../../lib/fx';
import Icon from '../../components/Icon';
import { ModuleArt } from '../../components/Illustrations';
import { PageHeader, SectionHead } from '../../components/ui';

interface SearchEntry {
  label: string;
  sub: string;
  mod: string;
  q: string;
}

const INDEX: SearchEntry[] = [
  ...HISTORY.map((h) => ({ label: h.title, sub: h.year, mod: 'history', q: h.title })),
  ...PRESIDENTS.map((p) => ({
    label: p.name,
    sub: `${p.title} · ${p.years}`,
    mod: 'presidents',
    q: p.name,
  })),
  ...STATES.flatMap((s) => [
    { label: s.name, sub: `Capital: ${s.capital} · ${s.zone}`, mod: 'states', q: s.name },
    { label: s.governor, sub: `${s.name} · ${s.slogan}`, mod: 'governors', q: s.name },
    { label: s.slogan, sub: s.name, mod: 'governors', q: s.name },
  ]),
  ...CHAPTERS.map((c) => ({
    label: `Chapter ${c.num}: ${c.title}`,
    sub: c.range,
    mod: 'constitution',
    q: c.title,
  })),
  ...UPDATES.map((u) => ({ label: u.title, sub: u.tag, mod: 'today', q: u.title })),
];

export default function ExploreScreen() {
  const { moduleProgress } = useProgress();
  const [q, setQ] = useState('');
  const term = q.trim().toLowerCase();

  const results = useMemo(
    () =>
      term.length < 2
        ? []
        : INDEX.filter((r) => `${r.label} ${r.sub}`.toLowerCase().includes(term)).slice(0, 14),
    [term]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <PageHeader title="Explore" sub="Pick a module or search anything Nigerian." />

        <View style={styles.searchBox}>
          <Icon name="search" size={20} color={COLORS.text3} />
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder="Try “Lagos”, “Gowon” or “Section 33”"
            placeholderTextColor={COLORS.text3}
            style={styles.searchInput}
            accessibilityLabel="Search all modules"
          />
          {q ? (
            <Pressable
              onPress={() => {
                sfx.tap();
                setQ('');
              }}
              accessibilityLabel="Clear search"
              style={styles.searchClear}
            >
              <Icon name="x" size={14} color={COLORS.text} />
            </Pressable>
          ) : null}
        </View>

        {term.length >= 2 ? (
          <View style={styles.results}>
            {results.length === 0 && (
              <Text style={styles.empty}>
                No matches for “{q}”. Try a state, leader or section number.
              </Text>
            )}
            {results.map((r, i) => {
              const m = byId(r.mod);
              if (!m) return null;
              const pal = getModulePalette(r.mod);
              return (
                <Pressable
                  key={`${r.mod}-${r.label}-${i}`}
                  onPress={() => {
                    sfx.tap();
                    router.push({ pathname: m.path as '/history', params: { q: r.q } });
                  }}
                  style={({ pressed }) => [
                    styles.resultRow,
                    pressed && { transform: [{ scale: 0.98 }] },
                  ]}
                >
                  <View style={[styles.resultDot, { backgroundColor: pal.m }]} />
                  <View style={styles.resultMain}>
                    <Text style={styles.resultTitle}>{r.label}</Text>
                    <Text style={styles.resultSub}>{r.sub}</Text>
                  </View>
                  <View style={[styles.chip, { borderColor: pal.m }]}>
                    <Text style={[styles.chipText, { color: pal.m }]}>{m.short}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <>
            <View style={styles.exploreList}>
              {MODULES.map((m) => {
                const p = Math.round(moduleProgress(m.id) * 100);
                const pal = getModulePalette(m.id);
                return (
                  <Pressable
                    key={m.id}
                    onPress={() => {
                      sfx.pop();
                      router.push(m.path as Href);
                    }}
                    style={({ pressed }) => [
                      styles.exploreRow,
                      {
                        borderColor: pal.m,
                        borderBottomColor: pal.deep,
                      },
                      pressed && { transform: [{ scale: 0.98 }] },
                    ]}
                  >
                    <LinearGradient
                      colors={[pal.m, pal.deep]}
                      style={styles.exploreArt}
                    >
                      <ModuleArt id={m.id} />
                    </LinearGradient>
                    <View style={styles.exploreInfo}>
                      <Text style={styles.exploreTitle}>{m.name}</Text>
                      <Text style={styles.exploreBlurb} numberOfLines={2}>
                        {m.blurb}
                      </Text>
                      <View style={styles.bar}>
                        <View
                          style={[
                            styles.barFill,
                            { width: `${p}%`, backgroundColor: pal.m },
                          ]}
                        />
                      </View>
                    </View>
                    <Text style={[styles.explorePct, { color: pal.m }]}>{p}%</Text>
                  </Pressable>
                );
              })}
            </View>

            <SectionHead title="Bonus" />
            <Pressable
              onPress={() => {
                sfx.pop();
                router.push('/culture');
              }}
              style={({ pressed }) => [
                styles.exploreRow,
                {
                  borderColor: getModulePalette('culture').m,
                  borderBottomColor: getModulePalette('culture').deep,
                },
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
            >
              <LinearGradient
                colors={[
                  getModulePalette('culture').m,
                  getModulePalette('culture').deep,
                ]}
                style={styles.exploreArt}
              >
                <Text style={styles.emojiArt}>🥁</Text>
              </LinearGradient>
              <View style={styles.exploreInfo}>
                <Text style={styles.exploreTitle}>Culture & Festivals</Text>
                <Text style={styles.exploreBlurb}>
                  Peoples, languages and the festivals that bring them together.
                </Text>
              </View>
              <Icon name="right" size={18} color={COLORS.text2} />
            </Pressable>
          </>
        )}
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
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    height: 52,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    marginBottom: 8,
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
  results: {
    gap: 8,
    marginTop: 8,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.text2,
    paddingVertical: 26,
    fontSize: 15,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.lineStrong,
  },
  resultDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  resultMain: {
    flex: 1,
  },
  resultTitle: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 15.5,
  },
  resultSub: {
    color: COLORS.text2,
    fontSize: 13,
    marginTop: 2,
  },
  chip: {
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: RADII.pill,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  chipText: {
    fontSize: 11.5,
    fontWeight: '800',
  },
  exploreList: {
    gap: 12,
    marginTop: 10,
  },
  exploreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 10,
    paddingRight: 14,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderBottomWidth: 5,
  },
  exploreArt: {
    width: 82,
    height: 70,
    padding: 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiArt: {
    fontSize: 34,
  },
  exploreInfo: {
    flex: 1,
    gap: 3,
  },
  exploreTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 18,
    color: COLORS.text,
  },
  exploreBlurb: {
    color: COLORS.text2,
    fontSize: 13,
    lineHeight: 17,
  },
  bar: {
    height: 8,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    marginTop: 5,
  },
  barFill: {
    height: '100%',
    borderRadius: 99,
  },
  explorePct: {
    fontWeight: '900',
    fontSize: 15,
  },
});

