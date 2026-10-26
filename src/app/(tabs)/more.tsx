import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../../components/TopBar';
import DrawerModal from '../../components/DrawerModal';
import { COLORS, SHADOWS } from '../../constants/theme';
import { RESOURCES, TEAM, ResourceItem } from '../../constants/data';

export default function MoreScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <TopBar onOpenDrawer={() => setDrawerOpen(true)} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>More</Text>
          <Text style={styles.subtitle}>
            Resources, references, and information about this platform
          </Text>
        </View>

        {/* About Card */}
        <View style={styles.aboutCard}>
          <View style={styles.flagRow}>
            <View style={[styles.flagStrip, { backgroundColor: COLORS.g700 }]} />
            <View style={[styles.flagStrip, { backgroundColor: COLORS.white }]} />
            <View style={[styles.flagStrip, { backgroundColor: COLORS.g700 }]} />
          </View>
          <Text style={styles.aboutTitle}>Nigeria | Heritage Hub</Text>
          <Text style={styles.aboutDesc}>
            A modern interactive platform for exploring Nigerian history, law, culture, and
            geography. Designed to make civic and cultural knowledge accessible to everyone
            — from students to diaspora communities around the world.
          </Text>
        </View>

        {/* Resources Section */}
        <View style={styles.sectionTitleRow}>
          <Ionicons name="library-outline" size={18} color={COLORS.g700} />
          <Text style={styles.sectionTitle}>Official Resources</Text>
        </View>

        <View style={styles.resourcesList}>
          {RESOURCES.map((res: ResourceItem) => (
            <TouchableOpacity
              key={res.title}
              style={styles.resourceCard}
              onPress={() => handleOpenLink(res.url)}
              activeOpacity={0.75}
            >
              <View style={styles.resourceTopRow}>
                <View style={styles.resourceTagBadge}>
                  <Text style={styles.resourceTagText}>{res.tag}</Text>
                </View>
                <Ionicons name="open-outline" size={18} color={COLORS.g600} />
              </View>
              <Text style={styles.resourceTitle}>{res.title}</Text>
              <Text style={styles.resourceDesc}>{res.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Credits / Team */}
        <View style={styles.sectionTitleRow}>
          <Ionicons name="information-circle-outline" size={18} color={COLORS.g700} />
          <Text style={styles.sectionTitle}>About This App</Text>
        </View>

        <View style={styles.creditsCard}>
          {TEAM.map((item, idx) => (
            <View
              key={item.role}
              style={[
                styles.creditRow,
                idx < TEAM.length - 1 && styles.creditRowBorder,
              ]}
            >
              <Text style={styles.creditRole}>{item.role}</Text>
              <Text style={styles.creditName}>{item.name}</Text>
            </View>
          ))}
        </View>

        {/* Footer Banner */}
        <View style={styles.footerBanner}>
          <Text style={styles.footerTitle}>One Nigeria · Great Promise</Text>
          <Text style={styles.footerSubtitle}>
            Unity & Faith, Peace & Progress
          </Text>
        </View>
      </ScrollView>

      <DrawerModal
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeRoute="/(tabs)/more"
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
  aboutCard: {
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
    ...SHADOWS.sm,
  },
  flagRow: {
    flexDirection: 'row',
    width: 36,
    height: 20,
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#c6e8d4',
    marginBottom: 12,
  },
  flagStrip: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.g900,
    marginBottom: 8,
  },
  aboutDesc: {
    fontSize: 13,
    color: COLORS.text2,
    lineHeight: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text1,
  },
  resourcesList: {
    gap: 12,
    marginBottom: 24,
  },
  resourceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  resourceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resourceTagBadge: {
    backgroundColor: COLORS.g100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  resourceTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.g800,
  },
  resourceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text1,
    marginBottom: 6,
  },
  resourceDesc: {
    fontSize: 13,
    color: COLORS.text2,
    lineHeight: 18,
  },
  creditsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
    ...SHADOWS.sm,
  },
  creditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  creditRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  creditRole: {
    fontSize: 13,
    color: COLORS.text2,
    fontWeight: '500',
  },
  creditName: {
    fontSize: 13,
    color: COLORS.text1,
    fontWeight: '700',
  },
  footerBanner: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
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
