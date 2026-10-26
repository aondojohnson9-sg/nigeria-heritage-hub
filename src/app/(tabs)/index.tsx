import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import TopBar from '../../components/TopBar';
import DrawerModal from '../../components/DrawerModal';
import { COLORS, SHADOWS } from '../../constants/theme';
import { MODULES, STATS, QUICK_FACTS, ModuleItem } from '../../constants/data';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [query, setQuery] = useState('');

  const filteredModules = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MODULES;
    return MODULES.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.desc.toLowerCase().includes(q)
    );
  }, [query]);

  const handleModulePress = (mod: ModuleItem) => {
    router.push(mod.route as any);
  };

  const handleOpenNBS = () => {
    Linking.openURL('https://www.nigerianstat.gov.ng/');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <TopBar
        onOpenDrawer={() => setDrawerOpen(true)}
        query={query}
        setQuery={setQuery}
        placeholder="Search modules..."
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>OFFICIAL HUB</Text>
          </View>
          <Text style={styles.heroTitle}>Welcome, 🇳🇬</Text>
          <Text style={styles.heroSub}>
            Heritage, governance & progress of Africa's giant
          </Text>

          {/* Abstract green patterns */}
          <View style={styles.heroDecor}>
            <View style={[styles.heroDecorBar, { opacity: 0.15, height: 60 }]} />
            <View style={[styles.heroDecorBar, { opacity: 0.25, height: 40 }]} />
            <View style={[styles.heroDecorBar, { opacity: 0.2, height: 50 }]} />
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeadingRow}>
          <Text style={styles.sectionHeading}>Explore Modules</Text>
          <Text style={styles.moduleCountBadge}>
            {filteredModules.length} {filteredModules.length === 1 ? 'module' : 'modules'}
          </Text>
        </View>

        {/* Modules Grid */}
        <View style={styles.modGrid}>
          {filteredModules.map((mod) => (
            <TouchableOpacity
              key={mod.id}
              style={styles.modCard}
              onPress={() => handleModulePress(mod)}
              activeOpacity={0.8}
            >
              <View style={styles.modIconWrapper}>
                <Ionicons
                  name={mod.iconName as any}
                  size={24}
                  color={COLORS.g700}
                />
              </View>
              <Text style={styles.modName}>{mod.name}</Text>
              <Text style={styles.modDesc} numberOfLines={2}>
                {mod.desc}
              </Text>
              <View style={styles.modActionRow}>
                <Text style={styles.modActionText}>Open</Text>
                <Ionicons name="arrow-forward" size={14} color={COLORS.g600} />
              </View>
            </TouchableOpacity>
          ))}

          {filteredModules.length === 0 && (
            <View style={styles.noResultsBox}>
              <Ionicons name="search-outline" size={36} color={COLORS.text3} />
              <Text style={styles.noResultsText}>
                No modules match "{query}"
              </Text>
            </View>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsHeading}>Nigeria at a Glance</Text>
          <View style={styles.statsGrid}>
            {STATS.map((stat, idx) => (
              <View key={idx} style={styles.statPanel}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Info Cards Row */}
        <View style={styles.infoSection}>
          {/* Explore Nigeria Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="location" size={20} color={COLORS.g700} />
              <Text style={styles.infoCardTitle}>Explore Nigeria</Text>
            </View>

            <View style={styles.mapGraphicWrapper}>
              <View style={styles.mapBadge}>
                <Ionicons name="map" size={32} color={COLORS.g600} />
              </View>
              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={handleOpenNBS}
                activeOpacity={0.85}
              >
                <Text style={styles.exploreBtnText}>Explore Map →</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.exploreDesc}>
              Discover Nigeria's states, capitals, and geographic diversity
            </Text>
          </View>

          {/* Quick Facts Card */}
          <View style={styles.infoCard}>
            <View style={styles.infoCardHeader}>
              <Ionicons name="flash" size={20} color={COLORS.gold} />
              <Text style={styles.infoCardTitle}>Quick Facts</Text>
            </View>
            <View style={styles.factsList}>
              {QUICK_FACTS.map((fact, idx) => (
                <View key={idx} style={styles.factItem}>
                  <View style={styles.checkIcon}>
                    <Ionicons name="checkmark" size={14} color={COLORS.g700} />
                  </View>
                  <Text style={styles.factText}>{fact}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Footer Banner */}
        <View style={styles.footerBanner}>
          <View style={styles.flagSmall}>
            <View style={[styles.flagSmallStrip, { backgroundColor: COLORS.g700 }]} />
            <View style={[styles.flagSmallStrip, { backgroundColor: COLORS.white }]} />
            <View style={[styles.flagSmallStrip, { backgroundColor: COLORS.g700 }]} />
          </View>
          <Text style={styles.footerTitle}>One Nigeria · Great Promise</Text>
          <Text style={styles.footerSubtitle}>
            Unity & Faith, Peace & Progress
          </Text>
        </View>
      </ScrollView>

      {/* Drawer navigation modal */}
      <DrawerModal
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeRoute="/"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: COLORS.g900,
    borderRadius: 24,
    padding: 24,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 24,
    ...SHADOWS.md,
  },
  heroBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.g200,
    letterSpacing: 1,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
  },
  heroSub: {
    fontSize: 15,
    color: COLORS.g200,
    lineHeight: 22,
    maxWidth: '85%',
  },
  heroDecor: {
    position: 'absolute',
    right: 20,
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  heroDecorBar: {
    width: 14,
    backgroundColor: COLORS.white,
    borderRadius: 6,
  },
  sectionHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text1,
  },
  moduleCountBadge: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text2,
    backgroundColor: COLORS.g100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  modGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
    marginBottom: 24,
  },
  modCard: {
    width: (width - 44) / 2,
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  modIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.g100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text1,
    marginBottom: 6,
  },
  modDesc: {
    fontSize: 12,
    color: COLORS.text2,
    lineHeight: 16,
    marginBottom: 12,
    minHeight: 32,
  },
  modActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.g600,
  },
  noResultsBox: {
    width: '100%',
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.text2,
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text1,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },
  statPanel: {
    width: (width - 44) / 2,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.g700,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.text2,
    fontWeight: '500',
  },
  infoSection: {
    gap: 16,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text1,
  },
  mapGraphicWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.g50,
    padding: 16,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.g200,
  },
  mapBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.g100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exploreBtn: {
    backgroundColor: COLORS.g700,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  exploreBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
  },
  exploreDesc: {
    fontSize: 13,
    color: COLORS.text2,
    lineHeight: 18,
  },
  factsList: {
    gap: 10,
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.g100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  factText: {
    fontSize: 13,
    color: COLORS.text1,
    fontWeight: '500',
    flex: 1,
  },
  footerBanner: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 8,
    ...SHADOWS.sm,
  },
  flagSmall: {
    flexDirection: 'row',
    width: 32,
    height: 18,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#c6e8d4',
    marginBottom: 10,
  },
  flagSmallStrip: {
    flex: 1,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.g900,
    marginBottom: 2,
  },
  footerSubtitle: {
    fontSize: 12,
    color: COLORS.text2,
  },
});
