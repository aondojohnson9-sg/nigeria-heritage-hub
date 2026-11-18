import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, MODULE_COLORS, RADII } from '../constants/theme';
import { sfx } from '../lib/fx';
import { timeAgo } from '../lib/time';
import { useNews } from '../lib/useNews';
import Icon from './Icon';
import { Button } from './ui';

export default function LiveHeadlines({ limit = 8 }: { limit?: number }) {
  const { items, status, updatedAt, refresh } = useNews();
  const label =
    status === 'live' && updatedAt
      ? `Live · updated ${timeAgo(updatedAt)}`
      : status === 'cached' && updatedAt
        ? `Saved headlines · ${timeAgo(updatedAt)}`
        : status === 'loading'
          ? 'Loading headlines…'
          : 'Headlines unavailable';

  const dotColor =
    status === 'live'
      ? COLORS.green
      : status === 'cached'
        ? COLORS.gold
        : COLORS.text3;

  return (
    <View style={styles.live}>
      <View style={styles.liveHead}>
        <View style={styles.livePill}>
          <View style={[styles.dot, { backgroundColor: dotColor }]} />
          <Text
            style={[
              styles.livePillText,
              status === 'live' && { color: '#7dffb6' },
            ]}
          >
            {label}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            sfx.tap();
            refresh().catch(() => {});
          }}
          accessibilityLabel="Refresh headlines"
          style={({ pressed }) => [styles.refreshBtn, pressed && { opacity: 0.7 }]}
        >
          <Icon name="refresh" size={14} color={COLORS.text} />
        </Pressable>
      </View>

      {items.length === 0 && status !== 'loading' && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>
            Live headlines appear when the HeritageHub server is running and you&apos;re online. The explainers below always work offline.
          </Text>
        </View>
      )}

      <View style={styles.feed}>
        {items.slice(0, limit).map((n) => (
          <Pressable
            key={n.id}
            onPress={() => {
              sfx.tap();
              if (n.link) Linking.openURL(n.link).catch(() => {});
            }}
            style={({ pressed }) => [
              styles.card,
              pressed && { transform: [{ scale: 0.98 }] },
            ]}
          >
            <View style={styles.art}>
              <Text style={styles.artEmoji}>📰</Text>
            </View>
            <View style={styles.body}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>{n.source}</Text>
              </View>
              <Text style={styles.title} numberOfLines={3}>
                {n.title}
              </Text>
              {n.summary ? (
                <Text style={styles.summary} numberOfLines={2}>
                  {n.summary}
                </Text>
              ) : null}
              <Text style={styles.meta}>
                {timeAgo(n.publishedAt)} · Read at {n.source} ↗
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {status === 'live' && items.length > limit && (
        <Button
          variant="ghost"
          block
          onPress={() => {
            refresh().catch(() => {});
          }}
        >
          Refresh
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  live: {
    gap: 10,
  },
  liveHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.lineStrong,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  livePillText: {
    fontWeight: '900',
    fontSize: 12.5,
    color: COLORS.text2,
  },
  refreshBtn: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.lineStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyBox: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.lineStrong,
  },
  emptyText: {
    color: COLORS.text2,
    fontSize: 14,
    lineHeight: 20,
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
    minHeight: 82,
    borderRadius: 16,
    backgroundColor: MODULE_COLORS.today.deep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artEmoji: {
    fontSize: 36,
  },
  body: {
    flex: 1,
    gap: 4,
  },
  chip: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: RADII.pill,
    backgroundColor: 'rgba(31, 200, 219, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(31, 200, 219, 0.45)',
  },
  chipText: {
    color: '#aef4fc',
    fontSize: 11.5,
    fontWeight: '800',
  },
  title: {
    fontFamily: FONTS.displaySemi,
    fontSize: 16.5,
    lineHeight: 20,
    color: COLORS.text,
  },
  summary: {
    color: COLORS.text2,
    fontSize: 13.5,
    lineHeight: 18,
  },
  meta: {
    color: COLORS.text3,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
  },
});

