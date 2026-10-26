import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import TopBar from '../../components/TopBar';
import DrawerModal from '../../components/DrawerModal';
import { COLORS, SHADOWS } from '../../constants/theme';
import { CONSTITUTION_CHAPTERS, ConstitutionChapter } from '../../constants/data';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ConstitutionScreen() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('ch1');

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredChapters = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return CONSTITUTION_CHAPTERS;
    return CONSTITUTION_CHAPTERS.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.articles.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.detail.some((d) => d.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <TopBar onOpenDrawer={() => setDrawerOpen(true)} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Header */}
        <View style={styles.header}>
          <Text style={styles.title}>1999 Constitution</Text>
          <Text style={styles.subtitle}>
            Explore the supreme law of the Federal Republic of Nigeria
          </Text>
        </View>

        {/* In-page Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={18}
            color={COLORS.text3}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Search chapters or sections..."
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

        {/* Chapters Accordion */}
        <View style={styles.accordionList}>
          {filteredChapters.map((chapter: ConstitutionChapter) => {
            const isExpanded = expandedId === chapter.id;

            return (
              <View key={chapter.id} style={styles.chapterCard}>
                <TouchableOpacity
                  style={styles.cardHeader}
                  onPress={() => toggleExpand(chapter.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardHeaderLeft}>
                    <Text style={styles.chapterTitle}>{chapter.title}</Text>
                    <View style={styles.articlesBadge}>
                      <Text style={styles.articlesText}>{chapter.articles}</Text>
                    </View>
                  </View>
                  <Ionicons
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={COLORS.text2}
                  />
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.cardBody}>
                    <Text style={styles.summaryText}>{chapter.summary}</Text>
                    <View style={styles.divider} />
                    <Text style={styles.provisionsHeading}>Key Provisions:</Text>
                    <View style={styles.provisionsList}>
                      {chapter.detail.map((item, idx) => (
                        <View key={idx} style={styles.provisionItem}>
                          <View style={styles.bulletDot} />
                          <Text style={styles.provisionText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            );
          })}

          {filteredChapters.length === 0 && (
            <View style={styles.noResultsBox}>
              <Ionicons name="document-text-outline" size={40} color={COLORS.text3} />
              <Text style={styles.noResultsText}>
                No constitution chapters match "{search}"
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <DrawerModal
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        activeRoute="/(tabs)/constitution"
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
    marginBottom: 16,
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
  accordionList: {
    gap: 12,
  },
  chapterCard: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOWS.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text1,
    marginBottom: 4,
  },
  articlesBadge: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.g100,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  articlesText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.g800,
  },
  cardBody: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.white,
  },
  summaryText: {
    fontSize: 13,
    color: COLORS.text2,
    lineHeight: 19,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginBottom: 12,
  },
  provisionsHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text1,
    marginBottom: 8,
  },
  provisionsList: {
    gap: 8,
  },
  provisionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulletDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.g600,
    marginTop: 6,
    marginRight: 8,
  },
  provisionText: {
    fontSize: 13,
    color: COLORS.text2,
    lineHeight: 18,
    flex: 1,
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
