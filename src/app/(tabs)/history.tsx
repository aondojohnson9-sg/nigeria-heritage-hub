import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../../components/TopBar';
import DrawerModal from '../../components/DrawerModal';
import { COLORS, SHADOWS } from '../../constants/theme';
import { TIMELINE_EVENTS } from '../../constants/data';

export default function HistoryScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <TopBar
        onOpenDrawer={() => setDrawerOpen(true)}
        placeholder="Search history..."
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Timeline of Nigeria</Text>
          <Text style={styles.subtitle}>
            From ancient civilisations to modern democratic governance
          </Text>
        </View>

        {/* Timeline List */}
        <View style={styles.timelineList}>
          {TIMELINE_EVENTS.map((event, index) => {
            const isLast = index === TIMELINE_EVENTS.length - 1;
            return (
              <View key={event.title} style={styles.timelineRow}>
                {/* Badge Column & Connector Line */}
                <View style={styles.badgeCol}>
                  <View style={styles.badge}>
                    <Text style={styles.badgeNum}>{index + 1}</Text>
                  </View>
                  {!isLast && <View style={styles.connectorLine} />}
                </View>

                {/* Event Card */}
                <View style={styles.eventCard}>
                  <View style={styles.cardHeaderRow}>
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagText}>{event.tag}</Text>
                    </View>
                    <Text style={styles.yearText}>{event.year}</Text>
                  </View>

                  <Text style={styles.eventTitle}>{event.title}</Text>
                  <Text style={styles.eventDesc}>{event.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <DrawerModal
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeRoute="/(tabs)/history"
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
    marginBottom: 20,
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
  timelineList: {
    marginTop: 4,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  badgeCol: {
    alignItems: 'center',
    marginRight: 14,
    width: 32,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.g700,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  badgeNum: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  connectorLine: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.g200,
    marginTop: 6,
    marginBottom: -6,
  },
  eventCard: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tagBadge: {
    backgroundColor: COLORS.g100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.g800,
  },
  yearText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text2,
  },
  eventTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text1,
    marginBottom: 8,
  },
  eventDesc: {
    fontSize: 13,
    color: COLORS.text2,
    lineHeight: 19,
  },
});
