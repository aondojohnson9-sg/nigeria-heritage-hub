import React, { useMemo, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS, RADII, ZONE_COLORS } from '../constants/theme';
import { MAP_H, MAP_STATES, MAP_VIEWBOX, MAP_W } from '../data/nigeriaMap';
import { STATES } from '../data/states';

export type MapMark = 'sel' | 'right' | 'wrong' | 'target' | 'learned';

const ZONE_MAP = Object.fromEntries(
  STATES.map((s) => [s.id, s.zone.toLowerCase().replace(/ /g, '-')])
);

const LEVELS = [1, 1.8, 3] as const;

export default function NigeriaMap({
  onPick,
  marks = {},
  zones = false,
  activeZone = null,
  interactive = true,
  zoomControls = true,
}: {
  onPick?: (id: string) => void;
  marks?: Record<string, MapMark>;
  zones?: boolean;
  activeZone?: string | null;
  interactive?: boolean;
  zoomControls?: boolean;
}) {
  const { width: winW } = useWindowDimensions();
  const [zi, setZi] = useState(0);
  const hScroll = useRef<ScrollView>(null);
  const vScroll = useRef<ScrollView>(null);

  const baseW = Math.min(winW - 40, 444);
  const svgW = baseW * LEVELS[zi];
  const svgH = svgW * (MAP_H / MAP_W);

  const zoom = (next: number) => {
    const n = Math.min(LEVELS.length - 1, Math.max(0, next));
    setZi(n);
    const nextW = baseW * LEVELS[n];
    const nextH = nextW * (MAP_H / MAP_W);
    setTimeout(() => {
      hScroll.current?.scrollTo({
        x: Math.max(0, (nextW - baseW) / 2),
        animated: true,
      });
      vScroll.current?.scrollTo({
        y: Math.max(0, (nextH - baseW * (MAP_H / MAP_W)) / 2),
        animated: true,
      });
    }, 30);
  };

  // Draw marked states last so their highlight outline sits on top of neighbours.
  const ids = useMemo(
    () => Object.keys(MAP_STATES).sort((a, b) => (marks[a] ? 1 : 0) - (marks[b] ? 1 : 0)),
    [marks]
  );

  const activeSlug = activeZone ? activeZone.toLowerCase().replace(/ /g, '-') : null;

  return (
    <View style={styles.mapBox}>
      <View style={styles.mapWrap}>
        <ScrollView
          ref={vScroll}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          style={{ maxHeight: 380 }}
        >
          <ScrollView
            ref={hScroll}
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
          >
            <Svg width={svgW} height={svgH} viewBox={MAP_VIEWBOX}>
              {ids.map((id) => {
                const mark = marks[id];
                const zoneSlug = ZONE_MAP[id];
                const dimmed = !!activeSlug && zoneSlug !== activeSlug && mark !== 'sel' && mark !== 'right' && mark !== 'wrong' && mark !== 'target';

                let fill = '#1c4a31';
                if (zones && zoneSlug && ZONE_COLORS[zoneSlug]) {
                  fill = ZONE_COLORS[zoneSlug];
                }
                if (mark === 'sel') fill = COLORS.blue;
                else if (mark === 'target') fill = COLORS.gold;
                else if (mark === 'right') fill = COLORS.green;
                else if (mark === 'wrong') fill = COLORS.red;

                let stroke = '#04140c';
                let strokeWidth = 1.6;
                if (mark === 'learned') {
                  stroke = '#b9ffd8';
                  strokeWidth = 2.6;
                }
                if (mark === 'sel' || mark === 'right' || mark === 'wrong') {
                  stroke = '#ffffff';
                  strokeWidth = 3.2;
                } else if (mark === 'target') {
                  stroke = '#ffffff';
                  strokeWidth = 2.6;
                }

                return (
                  <Path
                    key={id}
                    d={MAP_STATES[id].d}
                    fill={fill}
                    fillOpacity={dimmed ? 0.22 : 1}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                    onPress={interactive && onPick ? () => onPick(id) : undefined}
                  />
                );
              })}
            </Svg>
          </ScrollView>
        </ScrollView>
      </View>

      {zoomControls && (
        <View style={styles.zoomWrap}>
          <Pressable
            disabled={zi === LEVELS.length - 1}
            onPress={() => zoom(zi + 1)}
            accessibilityLabel="Zoom in"
            style={({ pressed }) => [
              styles.zoomBtn,
              zi === LEVELS.length - 1 && { opacity: 0.35 },
              pressed && { transform: [{ translateY: 2 }] },
            ]}
          >
            <Text style={styles.zoomText}>+</Text>
          </Pressable>
          <Pressable
            disabled={zi === 0}
            onPress={() => zoom(zi - 1)}
            accessibilityLabel="Zoom out"
            style={({ pressed }) => [
              styles.zoomBtn,
              zi === 0 && { opacity: 0.35 },
              pressed && { transform: [{ translateY: 2 }] },
            ]}
          >
            <Text style={styles.zoomText}>−</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mapBox: {
    position: 'relative',
    marginTop: 6,
  },
  mapWrap: {
    borderRadius: RADII.lg + 2,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    backgroundColor: '#092416',
    overflow: 'hidden',
  },
  zoomWrap: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    gap: 6,
  },
  zoomBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.surface2,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    borderBottomWidth: 4,
    borderBottomColor: '#041109',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomText: {
    color: COLORS.text,
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 22,
  },
});

