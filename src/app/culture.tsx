import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import DrawerModal from '../components/DrawerModal';
import { COLORS, SHADOWS } from '../constants/theme';
import { ETHNIC_GROUPS, FESTIVALS, EthnicGroup, Festival } from '../constants/data';

type CultureTab = 'groups' | 'festivals';

export default function CultureScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CultureTab>('groups');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <TopBar
        showBack={true}
        onOpenDrawer={() => setDrawerOpen(true)}
        placeholder="Search culture..."
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Nigerian Culture</Text>
          <Text style={styles.subtitle}>
            Explore the rich heritage of over 250 ethnic groups and national celebrations
          </Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabBarWrapper}>
          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'groups' && styles.tabBtnActive,
              ]}
              onPress={() => setActiveTab('groups')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'groups' && styles.tabBtnTextActive,
                ]}
              >
                Ethnic Groups
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'festivals' && styles.tabBtnActive,
              ]}
              onPress={() => setActiveTab('festivals')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  activeTab === 'festivals' && styles.tabBtnTextActive,
                ]}
              >
                Famous Festivals
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Culture Cards Grid */}
        <View style={styles.cardList}>
          {activeTab === 'groups'
            ? ETHNIC_GROUPS.map((group: EthnicGroup) => (
                <View key={group.name} style={styles.cultureCard}>
                  <View style={styles.cardTopRow}>
                    <View style={styles.badge}>
                      <Ionicons name="location-outline" size={13} color={COLORS.g800} />
                      <Text style={styles.badgeText}>{group.region}</Text>
                    </View>
                  </View>
                  <Text style={styles.cardTitle}>{group.name}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Language:</Text>
                    <Text style={styles.metaValue}> {group.language}</Text>
                  </View>
                  <Text style={styles.cardDesc}>{group.desc}</Text>
                </View>
              ))
            : FESTIVALS.map((fest: Festival) => (
                <View
                  key={fest.name}
                  style={[styles.cultureCard, styles.festivalCard]}
                >
                  <View style={styles.cardTopRow}>
                    <View style={[styles.badge, styles.festivalBadge]}>
                      <Ionicons name="sparkles-outline" size={13} color={COLORS.gold} />
                      <Text style={[styles.badgeText, { color: '#92400e' }]}>
                        {fest.location}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.cardTitle}>{fest.name}</Text>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>When:</Text>
                    <Text style={styles.metaValue}> {fest.date}</Text>
                  </View>
                  <Text style={styles.cardDesc}>{fest.desc}</Text>
                </View>
              ))}
        </View>
      </ScrollView>

      <DrawerModal
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeRoute="/culture"
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
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text1,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text2,
    lineHeight: 20,
  },
  tabBarWrapper: {
    marginBottom: 16,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#e6ece8',
    borderRadius: 14,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 11,
  },
  tabBtnActive: {
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text2,
  },
  tabBtnTextActive: {
    color: COLORS.g900,
    fontWeight: '700',
  },
  cardList: {
    gap: 14,
  },
  cultureCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  festivalCard: {
    borderColor: '#fde68a',
  },
  cardTopRow: {
    marginBottom: 10,
  },
  badge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.g100,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  festivalBadge: {
    backgroundColor: COLORS.goldLight,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.g800,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text1,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text1,
  },
  metaValue: {
    fontSize: 13,
    color: COLORS.text2,
    fontWeight: '500',
  },
  cardDesc: {
    fontSize: 13,
    color: COLORS.text2,
    lineHeight: 19,
  },
});
