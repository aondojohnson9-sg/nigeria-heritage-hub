import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../components/TopBar';
import DrawerModal from '../components/DrawerModal';
import { COLORS, SHADOWS } from '../constants/theme';
import { STATES_DATA, ZONES, StateData } from '../constants/data';

export default function StatesScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [search, setSearch] = useState('');

  const filteredStates = useMemo(() => {
    return STATES_DATA.filter((state: StateData) => {
      const matchesZone = selectedZone === 'All' || state.zone === selectedZone;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        state.name.toLowerCase().includes(q) ||
        state.capital.toLowerCase().includes(q) ||
        state.fact.toLowerCase().includes(q);
      return matchesZone && matchesSearch;
    });
  }, [selectedZone, search]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <TopBar
        showBack={true}
        onOpenDrawer={() => setDrawerOpen(true)}
        placeholder="Search states..."
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>States & Territories</Text>
          <Text style={styles.subtitle}>
            Explore the 36 states + FCT of the Federal Republic of Nigeria
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={18}
            color={COLORS.text3}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Search by state or capital name..."
            placeholderTextColor={COLORS.text3}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
          {search.length > 0 && Platform.OS !== 'ios' && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={16} color={COLORS.text3} />
            </TouchableOpacity>
          )}
        </View>

        {/* Zone Filter Chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.zoneScroll}
          contentContainerStyle={styles.zoneScrollContent}
        >
          {ZONES.map((zone) => {
            const isSelected = selectedZone === zone;
            return (
              <TouchableOpacity
                key={zone}
                style={[
                  styles.zoneChip,
                  isSelected && styles.zoneChipSelected,
                ]}
                onPress={() => setSelectedZone(zone)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.zoneChipText,
                    isSelected && styles.zoneChipTextSelected,
                  ]}
                >
                  {zone}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* States Cards */}
        <View style={styles.statesList}>
          {filteredStates.map((state: StateData) => (
            <View key={state.name} style={styles.stateCard}>
              <View style={styles.stateHeaderRow}>
                <Text style={styles.stateName}>{state.name}</Text>
                <View style={styles.zoneBadge}>
                  <Text style={styles.zoneBadgeText}>{state.zone}</Text>
                </View>
              </View>

              <View style={styles.capitalRow}>
                <Ionicons name="location-sharp" size={14} color={COLORS.g600} />
                <Text style={styles.capitalLabel}>Capital:</Text>
                <Text style={styles.capitalValue}> {state.capital}</Text>
              </View>

              <Text style={styles.factText}>{state.fact}</Text>
            </View>
          ))}

          {filteredStates.length === 0 && (
            <View style={styles.noResultsBox}>
              <Ionicons name="map-outline" size={40} color={COLORS.text3} />
              <Text style={styles.noResultsText}>
                No states found matching your filters.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <DrawerModal
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeRoute="/states"
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 10 : 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 14,
    ...SHADOWS.sm,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text1,
  },
  zoneScroll: {
    marginBottom: 16,
  },
  zoneScrollContent: {
    gap: 8,
    paddingRight: 16,
  },
  zoneChip: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    ...SHADOWS.sm,
  },
  zoneChipSelected: {
    backgroundColor: COLORS.g700,
    borderColor: COLORS.g700,
  },
  zoneChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text2,
  },
  zoneChipTextSelected: {
    color: COLORS.white,
    fontWeight: '700',
  },
  statesList: {
    gap: 12,
  },
  stateCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  stateHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stateName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text1,
  },
  zoneBadge: {
    backgroundColor: COLORS.g100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  zoneBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.g800,
  },
  capitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  capitalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text1,
  },
  capitalValue: {
    fontSize: 13,
    color: COLORS.text2,
  },
  factText: {
    fontSize: 13,
    color: COLORS.text2,
    lineHeight: 18,
  },
  noResultsBox: {
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    marginTop: 8,
    fontSize: 14,
    color: COLORS.text2,
  },
});
