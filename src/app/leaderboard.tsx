import React, { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS, FONTS, RADII } from '../constants/theme';
import { rankOf } from '../data/ranks';
import { api } from '../lib/api';
import { sfx } from '../lib/fx';
import { useAuth } from '../state/auth';
import { useProgress } from '../state/progress';
import Icon from '../components/Icon';
import Mascot from '../components/Mascot';
import { Button, PageHeader } from '../components/ui';

const MEDAL = ['🥇', '🥈', '🥉'] as const;

interface LeaderboardEntry {
  key: string;
  rank: number;
  name: string;
  level: number;
  streak: number;
  score: number;
  you?: boolean;
}

interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  me?: LeaderboardEntry | null;
}

type ResState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | ({ status: 'ok' } & LeaderboardResponse);

function Row({ e }: { e: LeaderboardEntry }) {
  return (
    <View style={[styles.row, e.you && styles.rowYou]}>
      <Text style={styles.rank}>{MEDAL[e.rank - 1] || `#${e.rank}`}</Text>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{(e.name[0] || '?').toUpperCase()}</Text>
      </View>
      <View style={styles.main}>
        <Text style={styles.name} numberOfLines={1}>
          {e.name}
          {e.you ? ' (you)' : ''}
        </Text>
        <Text style={styles.sub}>
          Lv {e.level} · {rankOf(e.level)}
        </Text>
      </View>
      {e.streak > 0 && (
        <View style={styles.streakWrap}>
          <Icon name="flame" size={16} />
          <Text style={styles.streakText}>{e.streak}</Text>
        </View>
      )}
      <View style={styles.xpWrap}>
        <Icon name="bolt" size={16} color={COLORS.gold} />
        <Text style={styles.xpText}>{e.score}</Text>
      </View>
    </View>
  );
}

export default function LeaderboardScreen() {
  const { user } = useAuth();
  const p = useProgress();
  const [range, setRange] = useState<'week' | 'all'>('week');
  const [res, setRes] = useState<ResState>({ status: 'loading' });

  const load = useCallback((r: 'week' | 'all') => {
    api<LeaderboardResponse>(`/api/leaderboard?range=${r}`).then(
      (j) => setRes({ status: 'ok', ...j }),
      (e: unknown) =>
        setRes({
          status: 'error',
          message: (e as Error).message || 'Unable to load leaderboard',
        })
    );
  }, []);

  useEffect(() => {
    let alive = true;
    api<LeaderboardResponse>('/api/leaderboard?range=week').then(
      (j) => alive && setRes({ status: 'ok', ...j }),
      (e: unknown) =>
        alive &&
        setRes({
          status: 'error',
          message: (e as Error).message || 'Unable to load leaderboard',
        })
    );
    return () => {
      alive = false;
    };
  }, []);

  const pick = (r: 'week' | 'all') => {
    sfx.tap();
    setRange(r);
    setRes({ status: 'loading' });
    load(r);
  };

  const localEntry: LeaderboardEntry = {
    key: 'local-me',
    rank: 1,
    name: p.name,
    level: p.level.level,
    streak: p.streakAlive ? p.streak : 0,
    score: p.xp,
    you: true,
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <PageHeader back title="Leaderboard" sub="Top learners across Nigeria" />

        <View style={styles.seg}>
          <Pressable
            onPress={() => pick('week')}
            style={[styles.segBtn, range === 'week' && styles.segBtnOn]}
          >
            <Text style={[styles.segText, range === 'week' && styles.segTextOn]}>
              This week
            </Text>
          </Pressable>
          <Pressable
            onPress={() => pick('all')}
            style={[styles.segBtn, range === 'all' && styles.segBtnOn]}
          >
            <Text style={[styles.segText, range === 'all' && styles.segTextOn]}>
              All time
            </Text>
          </Pressable>
        </View>

        {res.status === 'loading' && (
          <View style={styles.skelList}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.skelRow} />
            ))}
          </View>
        )}

        {res.status === 'error' && (
          <>
            <View style={styles.emptyCard}>
              <Mascot mood="sad" size={92} />
              <Text style={styles.emptyTitle}>Leaderboard is offline</Text>
              <Text style={styles.emptySub}>{res.message}</Text>
              <Button variant="ghost" icon="refresh" onPress={() => pick(range)}>
                Try again
              </Button>
            </View>
            <View style={styles.meDivider}>
              <Row e={localEntry} />
            </View>
          </>
        )}

        {res.status === 'ok' && (
          <>
            {res.entries.length === 0 ? (
              <View style={styles.emptyCard}>
                <Mascot mood="cheer" size={92} />
                <Text style={styles.emptyTitle}>Be the first on the board!</Text>
                <Text style={styles.emptySub}>
                  Finish a quiz and your XP will show up here.
                </Text>
              </View>
            ) : (
              <View style={styles.list}>
                {res.entries.map((e) => (
                  <Row key={e.key} e={e} />
                ))}
              </View>
            )}

            {res.me && !res.entries.some((e) => e.you) && (
              <View style={styles.meDivider}>
                <Row e={res.me} />
              </View>
            )}

            {!user && (
              <View style={styles.joinCard}>
                <Text style={styles.emptyTitle}>Want a spot on the board?</Text>
                <Text style={styles.emptySub}>
                  Create a free account so your XP counts.
                </Text>
                <Button
                  variant="primary"
                  iconRight="right"
                  onPress={() => router.push('/auth')}
                >
                  Sign in or register
                </Button>
              </View>
            )}
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
    paddingBottom: 32,
  },
  seg: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    marginBottom: 16,
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
  skelList: {
    gap: 10,
  },
  skelRow: {
    height: 62,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  list: {
    gap: 10,
  },
  meDivider: {
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 2,
    borderStyle: 'dashed',
    borderTopColor: COLORS.lineStrong,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    paddingLeft: 10,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    borderBottomWidth: 5,
    borderBottomColor: '#020b06',
  },
  rowYou: {
    borderColor: COLORS.green,
    backgroundColor: 'rgba(37, 217, 126, 0.14)',
    borderBottomColor: COLORS.greenDeep,
  },
  rank: {
    width: 38,
    textAlign: 'center',
    fontFamily: FONTS.display,
    fontSize: 20,
    color: COLORS.text2,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FONTS.display,
    fontSize: 19,
    color: COLORS.onBright,
  },
  main: {
    flex: 1,
  },
  name: {
    fontSize: 16.5,
    fontWeight: '800',
    color: COLORS.text,
  },
  sub: {
    color: COLORS.text2,
    fontSize: 12.5,
  },
  streakWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  streakText: {
    fontWeight: '900',
    color: '#ffb347',
  },
  xpWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
    minWidth: 50,
  },
  xpText: {
    fontWeight: '900',
    color: COLORS.gold,
  },
  emptyCard: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 22,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.lineStrong,
  },
  joinCard: {
    alignItems: 'center',
    gap: 10,
    marginTop: 18,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: COLORS.lineStrong,
  },
  emptyTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 20,
    color: COLORS.text,
    textAlign: 'center',
  },
  emptySub: {
    color: COLORS.text2,
    textAlign: 'center',
    fontSize: 14.5,
  },
});

