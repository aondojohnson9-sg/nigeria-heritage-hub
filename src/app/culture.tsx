import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTS, MODULE_COLORS, RADII } from '../constants/theme';
import { ETHNIC_GROUPS, FESTIVALS } from '../data/culture';
import { PageHeader, SectionHead } from '../components/ui';

const pal = MODULE_COLORS.culture;

export default function CultureScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <PageHeader
          back="/explore"
          title="Culture & Festivals"
          sub="The peoples and celebrations that make Nigeria vibrant."
        />

        <SectionHead title="Peoples & Languages" />
        <View style={styles.feed}>
          {ETHNIC_GROUPS.map((g) => (
            <View key={g.id} style={styles.card}>
              <View style={styles.art}>
                <Text style={styles.emoji}>{g.emoji}</Text>
              </View>
              <View style={styles.body}>
                <Text style={styles.title}>{g.name}</Text>
                <Text style={styles.desc}>{g.desc}</Text>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>
                    {g.region} · {g.language}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <SectionHead title="Festivals" />
        <View style={styles.feed}>
          {FESTIVALS.map((f) => (
            <View key={f.id} style={styles.card}>
              <View style={styles.art}>
                <Text style={styles.emoji}>{f.emoji}</Text>
              </View>
              <View style={styles.body}>
                <Text style={styles.title}>{f.name}</Text>
                <Text style={styles.desc}>{f.desc}</Text>
                <View style={styles.chip}>
                  <Text style={styles.chipText}>
                    {f.place} · {f.when}
                  </Text>
                </View>
              </View>
            </View>
          ))}
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
    paddingBottom: 32,
  },
  feed: {
    gap: 12,
  },
  card: {
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
  art: {
    width: 82,
    minHeight: 88,
    borderRadius: 16,
    backgroundColor: pal.deep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 38,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontFamily: FONTS.displaySemi,
    fontSize: 18,
    color: COLORS.text,
  },
  desc: {
    color: COLORS.text2,
    fontSize: 13.5,
    lineHeight: 19,
  },
  chip: {
    alignSelf: 'flex-start',
    marginTop: 4,
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: RADII.pill,
    backgroundColor: 'rgba(255, 138, 61, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(255, 138, 61, 0.45)',
  },
  chipText: {
    color: '#ffd0b0',
    fontSize: 11.5,
    fontWeight: '800',
  },
});
