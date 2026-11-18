import React, { useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router, type Href } from 'expo-router';
import Svg, { G, Path, Rect } from 'react-native-svg';
import { COLORS, FONTS, MODULE_COLORS, RADII } from '../../constants/theme';
import { MODULES } from '../../data/modules';
import { UPDATES, fmtDate } from '../../data/today';
import { dailyTeaser } from '../../data/quizzes';
import { useProgress } from '../../state/progress';
import { sfx } from '../../lib/fx';
import { useOnline } from '../../lib/hooks';
import { useNews } from '../../lib/useNews';
import { timeAgo } from '../../lib/time';
import Logo from '../../components/Logo';
import Icon from '../../components/Icon';
import { HeroScene } from '../../components/Illustrations';
import ProgressRing from '../../components/ProgressRing';
import OnThisDay from '../../components/OnThisDay';
import { Button, ModuleCard, SectionHead, Sheet, StatPill } from '../../components/ui';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const p = useProgress();
  const [bell, setBell] = useState(false);
  const online = useOnline();
  const news = useNews();

  const notifs = [
    {
      id: 'w',
      emoji: '👋',
      title: `Welcome to HeritageHub, ${p.name}!`,
      text: 'Start with Nigerian History — it takes about five minutes.',
    },
    p.dailyDone
      ? {
          id: 'd',
          emoji: '✅',
          title: 'Daily challenge complete',
          text: 'Come back tomorrow for a fresh set of questions.',
        }
      : {
          id: 'd',
          emoji: '🏆',
          title: 'Your Daily Naija Challenge is ready',
          text: 'Five quick questions. Keep your streak alive!',
        },
  ];
  const unread = Math.max(0, notifs.length - p.notifsSeen);

  const pct = Math.round(p.overall * 100);
  const next =
    [...MODULES]
      .filter((m) => p.moduleProgress(m.id) < 1)
      .sort((a, b) => p.moduleProgress(b.id) - p.moduleProgress(a.id))[0] || MODULES[0];
  const status =
    pct >= 100
      ? 'Champion! 🏆'
      : pct >= 60
        ? 'Almost there!'
        : pct >= 20
          ? 'Keep going!'
          : 'Getting started…';

  // 2-column module grid width calculation
  const cardWidth = Math.floor((Math.min(width, 480) - 36 - 12) / 2);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {!online && (
          <View style={styles.offlineBar}>
            <Text style={styles.offlineText}>
              📡 You&apos;re offline — lessons and quizzes still work, and progress saves on this device.
            </Text>
          </View>
        )}

        {/* Top Bar */}
        <View style={styles.topBar}>
          <Logo size={38} tagline={width >= 385} />
          <View style={styles.topRight}>
            <StatPill
              icon="flame"
              value={p.streakAlive ? p.streak : 0}
              tone="fire"
              label="day streak"
            />
            <StatPill icon="bolt" value={p.xp} tone="gold" label="XP" />
            <Pressable
              accessibilityLabel={`Notifications${unread ? `, ${unread} unread` : ''}`}
              onPress={() => {
                sfx.pop();
                setBell(true);
                p.markNotifsSeen(notifs.length);
              }}
              style={({ pressed }) => [styles.bell, pressed && { transform: [{ scale: 0.92 }] }]}
            >
              <Icon name="bell" size={20} color={COLORS.text} />
              {unread > 0 && (
                <View style={styles.bellBadge}>
                  <Text style={styles.bellBadgeText}>{unread}</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        {/* Welcome Hero */}
        <View style={styles.hero}>
          <View style={styles.heroCopy}>
            <Text style={styles.heroHello}>Welcome back,</Text>
            <Text style={[styles.heroName, p.name.length > 9 && styles.heroNameLong]}>
              {p.name}! 👋
            </Text>
            <Text style={styles.heroSub}>
              Discover the rich history and current affairs of Nigeria.
            </Text>
          </View>
          <HeroScene />
        </View>

        {/* Learning Progress Card */}
        <LinearGradient
          colors={['#0f3d27', '#0a2819']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.progressCard}
        >
          <View style={styles.progressTop}>
            <ProgressRing value={p.overall} size={96} stroke={10}>
              <Text style={styles.ringPct}>{pct}%</Text>
            </ProgressRing>
            <View style={styles.progressCopy}>
              <Text style={styles.progressTitle}>Your Learning Progress</Text>
              <Text style={styles.progressStatus}>{status}</Text>
              <Text style={styles.progressHint}>
                {pct === 0
                  ? 'Complete lessons and quizzes to build your knowledge.'
                  : `Next up: ${next.name}`}
              </Text>
            </View>
          </View>
          <Button
            variant="primary"
            size="sm"
            iconRight="right"
            block
            onPress={() => router.push(next.path as Href)}
          >
            Continue Learning
          </Button>
        </LinearGradient>

        {/* Modules Grid */}
        <SectionHead
          title="Explore Our Modules"
          right={
            <Pressable
              onPress={() => {
                sfx.tap();
                router.push('/explore');
              }}
              style={styles.linkBtn}
            >
              <Text style={styles.linkBtnText}>{MODULES.length} Modules</Text>
              <Icon name="right" size={16} color={COLORS.green} />
            </Pressable>
          }
        />
        <View style={styles.modGrid}>
          {MODULES.map((m) => (
            <ModuleCard key={m.id} mod={m} width={cardWidth} />
          ))}
        </View>

        {/* Daily Naija Challenge */}
        <LinearGradient
          colors={['#17352a', '#0c1f18']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.dailyCard}
        >
          <View style={styles.dailyTop}>
            <View style={styles.dailyBulb}>
              <Svg viewBox="0 0 64 80" width={58} height={72}>
                <G stroke="#ffc82e" strokeWidth={3.5} strokeLinecap="round">
                  <Path d="M32 4v7M8 20l6 4M56 20l-6 4M4 42h7M60 42h-7" />
                </G>
                <Path
                  d="M32 14a18 18 0 0 0-10 33c3 2 4 5 4 8h12c0-3 1-6 4-8a18 18 0 0 0-10-33z"
                  fill="#ffd54a"
                />
                <Path
                  d="M24 26q4-8 12-6"
                  stroke="#fff6c9"
                  strokeWidth={3.5}
                  fill="none"
                  strokeLinecap="round"
                />
                <Rect x={25} y={57} width={14} height={5} rx={2.5} fill="#4aa8ff" />
                <Rect x={27} y={63} width={10} height={5} rx={2.5} fill="#2a79d0" />
              </Svg>
            </View>
            <View style={styles.dailyCopy}>
              <View style={styles.dailyTag}>
                <Icon name="trophy" size={13} color="#3a2900" />
                <Text style={styles.dailyTagText}>Daily Naija Challenge</Text>
              </View>
              <Text style={styles.dailyTitle}>
                {p.dailyDone ? 'Challenge complete — see you tomorrow!' : dailyTeaser()}
              </Text>
              <Text style={styles.dailySub}>
                {p.dailyDone
                  ? 'Want extra practice? Replay it any time.'
                  : "Test your knowledge with today's quick quiz."}
              </Text>
            </View>
          </View>
          <Button
            variant="gold"
            iconRight="right"
            block
            onPress={() => router.push({ pathname: '/quiz/[id]', params: { id: 'daily' } })}
          >
            {p.dailyDone ? 'Replay' : 'Start Quiz'}
          </Button>
        </LinearGradient>

        {/* On This Day */}
        <OnThisDay />

        {/* Latest Updates */}
        <SectionHead
          title="Latest Updates"
          right={
            <Pressable
              onPress={() => {
                sfx.tap();
                router.push('/today');
              }}
              style={styles.linkBtn}
            >
              <Text style={styles.linkBtnText}>See All</Text>
              <Icon name="right" size={16} color={COLORS.green} />
            </Pressable>
          }
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.updatesRow}
          style={{ marginHorizontal: -18 }}
        >
          {news.items.length > 0
            ? news.items.slice(0, 5).map((n) => (
                <Pressable
                  key={n.id}
                  onPress={() => {
                    sfx.tap();
                    if (n.link) Linking.openURL(n.link).catch(() => {});
                  }}
                  style={({ pressed }) => [
                    styles.updateCard,
                    pressed && { transform: [{ scale: 0.97 }] },
                  ]}
                >
                  <View style={styles.updateArt}>
                    <Text style={styles.updateArtEmoji}>📰</Text>
                  </View>
                  <View style={styles.updateBody}>
                    <View style={styles.updateChip}>
                      <Text style={styles.updateChipText}>{n.source}</Text>
                    </View>
                    <Text style={styles.updateTitle} numberOfLines={3}>
                      {n.title}
                    </Text>
                    <View style={styles.updateDateRow}>
                      <Icon name="book" size={13} color={COLORS.text3} />
                      <Text style={styles.updateDateText}>
                        {timeAgo(n.publishedAt)} · live
                      </Text>
                    </View>
                  </View>
                </Pressable>
              ))
            : UPDATES.slice(0, 4).map((u) => (
                <Pressable
                  key={u.id}
                  onPress={() => {
                    sfx.tap();
                    router.push({ pathname: '/today', params: { open: u.id } });
                  }}
                  style={({ pressed }) => [
                    styles.updateCard,
                    pressed && { transform: [{ scale: 0.97 }] },
                  ]}
                >
                  <View style={styles.updateArt}>
                    <Text style={styles.updateArtEmoji}>{u.emoji}</Text>
                  </View>
                  <View style={styles.updateBody}>
                    <View style={styles.updateChip}>
                      <Text style={styles.updateChipText}>{u.tag}</Text>
                    </View>
                    <Text style={styles.updateTitle} numberOfLines={2}>
                      {u.title}
                    </Text>
                    <Text style={styles.updateTeaser} numberOfLines={2}>
                      {u.teaser}
                    </Text>
                    <View style={styles.updateDateRow}>
                      <Icon name="book" size={13} color={COLORS.text3} />
                      <Text style={styles.updateDateText}>{fmtDate(u.date)}</Text>
                    </View>
                  </View>
                </Pressable>
              ))}
        </ScrollView>
      </ScrollView>

      {/* Notifications Sheet */}
      <Sheet open={bell} onClose={() => setBell(false)} title="Notifications">
        <View style={styles.notifList}>
          {notifs.map((n) => (
            <View key={n.id} style={styles.notif}>
              <Text style={styles.notifEmoji}>{n.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTitle}>{n.title}</Text>
                <Text style={styles.notifText}>{n.text}</Text>
              </View>
            </View>
          ))}
        </View>
        <Button variant="ghost" block onPress={() => setBell(false)}>
          Got it
        </Button>
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg0,
  },
  scroll: {
    paddingTop: 10,
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  offlineBar: {
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,200,46,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,200,46,0.4)',
  },
  offlineText: {
    color: '#ffe9a6',
    fontSize: 13,
    fontWeight: '800',
    textAlign: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bell: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    minWidth: 19,
    height: 19,
    paddingHorizontal: 4,
    borderRadius: 99,
    backgroundColor: COLORS.red,
    borderWidth: 2,
    borderColor: COLORS.bg0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '900',
  },
  hero: {
    position: 'relative',
    marginTop: 10,
    marginHorizontal: -18,
    paddingTop: 20,
    paddingHorizontal: 18,
    paddingBottom: 12,
    minHeight: 224,
  },
  heroCopy: {
    zIndex: 4,
    maxWidth: '58%',
  },
  heroHello: {
    fontFamily: FONTS.displaySemi,
    fontSize: 22,
    color: COLORS.white,
    lineHeight: 26,
  },
  heroName: {
    fontFamily: FONTS.display,
    fontSize: 32,
    lineHeight: 36,
    color: COLORS.text,
    marginTop: 2,
  },
  heroNameLong: {
    fontSize: 26,
    lineHeight: 30,
  },
  heroSub: {
    marginTop: 10,
    fontSize: 14.5,
    color: COLORS.text2,
    lineHeight: 20,
    maxWidth: 170,
    fontWeight: '600',
  },
  progressCard: {
    marginTop: 10,
    padding: 16,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(37,217,126,0.32)',
    borderBottomWidth: 5,
    borderBottomColor: '#051a0f',
    gap: 14,
  },
  progressTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ringPct: {
    fontFamily: FONTS.display,
    fontSize: 24,
    color: COLORS.text,
  },
  progressCopy: {
    flex: 1,
  },
  progressTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 18.5,
    color: COLORS.text,
  },
  progressStatus: {
    fontFamily: FONTS.displaySemi,
    fontSize: 17,
    color: COLORS.green,
    marginTop: 2,
  },
  progressHint: {
    color: COLORS.text2,
    fontSize: 13.5,
    lineHeight: 18,
    marginTop: 4,
  },
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkBtnText: {
    color: COLORS.green,
    fontWeight: '900',
    fontSize: 14.5,
  },
  modGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  dailyCard: {
    marginTop: 24,
    padding: 16,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,200,46,0.35)',
    borderBottomWidth: 5,
    borderBottomColor: '#06110c',
    gap: 12,
  },
  dailyTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  dailyBulb: {
    width: 64,
    height: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dailyCopy: {
    flex: 1,
  },
  dailyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: 99,
    backgroundColor: COLORS.gold,
  },
  dailyTagText: {
    color: '#3a2900',
    fontWeight: '900',
    fontSize: 12.5,
  },
  dailyTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 19,
    lineHeight: 23,
    color: COLORS.text,
    marginTop: 8,
  },
  dailySub: {
    color: COLORS.text2,
    fontSize: 13.5,
    marginTop: 4,
  },
  updatesRow: {
    paddingHorizontal: 18,
    gap: 12,
    paddingBottom: 6,
  },
  updateCard: {
    width: 295,
    flexDirection: 'row',
    gap: 12,
    padding: 10,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.lineStrong,
    borderBottomWidth: 4,
    borderBottomColor: '#020b06',
  },
  updateArt: {
    width: 82,
    minHeight: 88,
    borderRadius: 16,
    backgroundColor: MODULE_COLORS.today.deep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateArtEmoji: {
    fontSize: 36,
  },
  updateBody: {
    flex: 1,
    gap: 4,
  },
  updateChip: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: RADII.pill,
    backgroundColor: 'rgba(31, 200, 219, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(31, 200, 219, 0.45)',
  },
  updateChipText: {
    color: '#aef4fc',
    fontSize: 11,
    fontWeight: '800',
  },
  updateTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 16,
    lineHeight: 20,
    color: COLORS.text,
  },
  updateTeaser: {
    color: COLORS.text2,
    fontSize: 13,
    lineHeight: 17,
  },
  updateDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 'auto',
    paddingTop: 2,
  },
  updateDateText: {
    color: COLORS.text3,
    fontSize: 12,
    fontWeight: '800',
  },
  notifList: {
    gap: 10,
    marginBottom: 6,
  },
  notif: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    borderRadius: 18,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  notifEmoji: {
    fontSize: 26,
  },
  notifTitle: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 15,
  },
  notifText: {
    color: COLORS.text2,
    fontSize: 13.5,
    marginTop: 2,
  },
});
