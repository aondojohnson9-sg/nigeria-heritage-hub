import React, { useId } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg';
import { COLORS, FONTS } from '../constants/theme';
import { MAP_H, MAP_OUTLINE, MAP_W } from '../data/nigeriaMap';

// Stylised Nigeria silhouette (green-white-green) — shared by logo and module art.
export const NIGERIA_PATH = MAP_OUTLINE;
const T = MAP_W / 3;

export function NigeriaMapSilhouette({
  width = 64,
  height = 52,
  stroke = true,
}: {
  width?: number;
  height?: number;
  stroke?: boolean;
}) {
  const id = useId().replace(/:/g, '');
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${MAP_W} ${MAP_H}`}>
      <Defs>
        <ClipPath id={`c${id}`}>
          <Path d={NIGERIA_PATH} />
        </ClipPath>
      </Defs>
      <G clipPath={`url(#c${id})`}>
        <Rect x={0} y={0} width={T} height={MAP_H} fill="#13b866" />
        <Rect x={T} y={0} width={T} height={MAP_H} fill="#ffffff" />
        <Rect x={2 * T} y={0} width={T} height={MAP_H} fill="#13b866" />
      </G>
      {stroke && (
        <Path
          d={NIGERIA_PATH}
          fill="none"
          stroke="#25d97e"
          strokeWidth={12}
          strokeLinejoin="round"
        />
      )}
    </Svg>
  );
}

function NigeriaMapInner() {
  const id = useId().replace(/:/g, '');
  return (
    <G>
      <Defs>
        <ClipPath id={`m${id}`}>
          <Path d={NIGERIA_PATH} />
        </ClipPath>
      </Defs>
      <G clipPath={`url(#m${id})`}>
        <Rect x={0} y={0} width={T} height={MAP_H} fill="#13b866" />
        <Rect x={T} y={0} width={T} height={MAP_H} fill="#ffffff" />
        <Rect x={2 * T} y={0} width={T} height={MAP_H} fill="#13b866" />
      </G>
      <Path
        d={NIGERIA_PATH}
        fill="none"
        stroke="#25d97e"
        strokeWidth={16}
        strokeLinejoin="round"
      />
    </G>
  );
}

export function LogoMark({ size = 56 }: { size?: number }) {
  return (
    <Svg width={size} height={size * (112 / 120)} viewBox="0 0 120 112">
      <G transform="translate(8, 0) scale(0.165)">
        <NigeriaMapInner />
      </G>
      {/* open book */}
      <Path d="M12 84q24-8 48 4 24-12 48-4v20q-24-8-48 4-24-12-48-4z" fill="#ffc82e" />
      <Path d="M60 88v20" stroke="#b57a00" strokeWidth={3} strokeLinecap="round" />
      <Path
        d="M18 88q20-5 40 3M102 88q-20-5-40 3"
        stroke="#fff3c4"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

export default function Logo({ size = 44, tagline = true }: { size?: number; tagline?: boolean }) {
  return (
    <View style={styles.logo}>
      <LogoMark size={size} />
      <View style={styles.textWrap}>
        <Text style={styles.word}>
          Heritage<Text style={styles.wordAccent}>Hub</Text>
        </Text>
        {tagline && <Text style={styles.tag}>Learn • Explore • Be Proud</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textWrap: {
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: COLORS.lineStrong,
  },
  word: {
    fontFamily: FONTS.display,
    fontSize: 22,
    lineHeight: 24,
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  wordAccent: {
    color: COLORS.green,
  },
  tag: {
    fontSize: 10.5,
    color: COLORS.text2,
    marginTop: 2,
    fontWeight: '700',
  },
});

