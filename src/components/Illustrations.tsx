import React, { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, {
  Circle,
  ClipPath,
  Defs,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import { MAP_H, MAP_W } from '../data/nigeriaMap';
import { NIGERIA_PATH } from './Logo';
import Mascot from './Mascot';

const cream = '#fff4cf';
const gold = '#ffd45e';

/* Small 120×84 scenes that sit on top of each module card. */
export function ModuleArt({
  id,
  width = '100%',
  height = '100%',
}: {
  id: string;
  width?: number | `${number}%`;
  height?: number | `${number}%`;
}) {
  const clipId = useId().replace(/:/g, '');
  const common = {
    viewBox: '0 0 120 84',
    width,
    height,
    preserveAspectRatio: 'xMidYMax meet' as const,
  };

  switch (id) {
    case 'history':
      return (
        <Svg {...common}>
          <Circle cx={94} cy={20} r={11} fill="#fff" opacity={0.35} />
          <Path d="M60 12 20 32h80z" fill={cream} />
          <Rect x={24} y={34} width={72} height={5} rx={2} fill={gold} />
          {[32, 47, 62, 77].map((x) => (
            <Rect key={x} x={x} y={40} width={11} height={29} rx={3} fill={cream} />
          ))}
          <Rect x={20} y={69} width={80} height={6} rx={2} fill={gold} />
          <Rect x={15} y={75} width={90} height={7} rx={2} fill={cream} />
          <Circle cx={60} cy={25} r={4} fill="#b97508" />
        </Svg>
      );

    case 'presidents':
      return (
        <Svg {...common}>
          <Path
            d="M8 84V58h20v26zM30 84V44h16v40zM96 84V50h18v34zM76 84V62h18v22z"
            fill="#fff"
            opacity={0.18}
          />
          <Path d="M26 84q0-26 34-26t34 26z" fill="#dce9ff" />
          <Path d="M52 60l8 14 8-14z" fill="#fff" />
          <Path d="M60 62l-3 20h6z" fill="#2260c4" />
          <Circle cx={60} cy={38} r={15} fill="#c6dcff" />
          <Path d="M45 34q15-16 30 0-4-4-15-4t-15 4z" fill="#2260c4" />
          <Path
            d="M96 10l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"
            fill={gold}
          />
        </Svg>
      );

    case 'states':
      return (
        <Svg {...common}>
          <G transform="translate(22, 4) scale(0.1258)">
            <Defs>
              <ClipPath id={`smc${clipId}`}>
                <Path d={NIGERIA_PATH} />
              </ClipPath>
            </Defs>
            <G clipPath={`url(#smc${clipId})`}>
              <Rect x={0} y={0} width={MAP_W / 3} height={MAP_H} fill="#0d9b55" />
              <Rect x={MAP_W / 3} y={0} width={MAP_W / 3} height={MAP_H} fill="#fff" />
              <Rect x={(2 * MAP_W) / 3} y={0} width={MAP_W / 3} height={MAP_H} fill="#0d9b55" />
            </G>
            <Path
              d={NIGERIA_PATH}
              fill="none"
              stroke="#fff"
              strokeWidth={18}
              strokeLinejoin="round"
            />
          </G>
          <Path
            d="M70 24a9 9 0 0 0-9 9c0 7 9 17 9 17s9-10 9-17a9 9 0 0 0-9-9zm0 12.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"
            fill={gold}
          />
        </Svg>
      );

    case 'governors':
      return (
        <Svg {...common}>
          <Path d="M60 8v10" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" />
          <Path d="M60 8h12l-3 4 3 4H60z" fill="#25d97e" />
          <Path d="M38 40a22 22 0 0 1 44 0z" fill="#3fbf7a" />
          <Path d="M42 40a18 18 0 0 1 36 0z" fill="#58d98e" />
          <Rect x={22} y={40} width={76} height={6} rx={2} fill="#efe6ff" />
          {[28, 42, 56, 70, 84].map((x) => (
            <Rect key={x} x={x} y={46} width={8} height={24} rx={2} fill="#ffffff" />
          ))}
          <Rect x={16} y={70} width={88} height={6} rx={2} fill="#efe6ff" />
          <Rect x={10} y={76} width={100} height={7} rx={2} fill="#d9c9ff" />
        </Svg>
      );

    case 'constitution':
      return (
        <Svg {...common}>
          <G transform="rotate(-6, 60, 44)">
            <Rect x={30} y={8} width={58} height={72} rx={6} fill="#7a2f0b" />
            <Rect x={34} y={8} width={54} height={72} rx={5} fill="#a34716" />
            <Rect x={30} y={8} width={8} height={72} rx={3} fill="#5c2107" />
            <Circle cx={62} cy={32} r={10} fill="none" stroke={gold} strokeWidth={2.5} />
            <Path
              d="M62 24l2.2 5 5.4.5-4.1 3.6 1.3 5.3L62 35.5l-4.8 2.9 1.3-5.3-4.1-3.6 5.4-.5z"
              fill={gold}
            />
            <Rect x={44} y={50} width={36} height={4} rx={2} fill={gold} />
            <Rect x={48} y={58} width={28} height={3.5} rx={2} fill={gold} opacity={0.8} />
            <Rect x={52} y={65} width={20} height={3} rx={1.5} fill={gold} opacity={0.6} />
          </G>
        </Svg>
      );

    case 'today':
      return (
        <Svg {...common}>
          <Circle cx={92} cy={22} r={10} fill="#fff" opacity={0.35} />
          <Path
            d="M0 84V56h14V42h16v18h10V30h18V12l4-8 4 8v18h12V50h14V36h14v48z"
            fill="#fff"
            opacity={0.9}
          />
          {[
            [6, 62],
            [20, 48],
            [46, 38],
            [62, 44],
            [74, 56],
            [94, 42],
            [104, 62],
          ].map(([x, y], i) => (
            <Rect key={i} x={x} y={y} width={4} height={5} rx={1} fill="#0f93a3" opacity={0.7} />
          ))}
          <Circle cx={60} cy={9} r={2.5} fill="#ff5d6c" />
        </Svg>
      );

    default:
      return (
        <Svg {...common}>
          <Path d="M10 84q10-30 25-30t22 10 26-14 27 34z" fill="#fff" opacity={0.35} />
          <Circle cx={60} cy={40} r={16} fill={gold} />
          <Path
            d="M60 14v8M60 58v8M34 40h8M78 40h8"
            stroke="#fff"
            strokeWidth={3}
            strokeLinecap="round"
          />
        </Svg>
      );
  }
}

/* Big hero scene: waving flag, National Mosque silhouette, Zuma-style rock, and Kobo waving. */
export function HeroScene() {
  const uid = useId().replace(/:/g, '');
  const sunId = `hsun${uid}`;
  const hillId = `hhill${uid}`;

  return (
    <View style={styles.scene} pointerEvents="none">
      <Svg
        viewBox="10 0 370 250"
        width="100%"
        height="100%"
        preserveAspectRatio="xMaxYMax meet"
      >
        <Defs>
          <RadialGradient id={sunId} cx="0.5" cy="0.5" r="0.5">
            <Stop offset="0" stopColor="#ffe9a0" stopOpacity={0.9} />
            <Stop offset="1" stopColor="#ffe9a0" stopOpacity={0} />
          </RadialGradient>
          <LinearGradient id={hillId} x1="0" x2="0" y1="0" y2="1">
            <Stop offset="0" stopColor="#0f6b3e" />
            <Stop offset="1" stopColor="#06301d" />
          </LinearGradient>
        </Defs>
        <Circle cx={230} cy={96} r={110} fill={`url(#${sunId})`} />
        {/* rock + hills */}
        <Path
          d="M0 250V190q40-24 70-4t58-22q30-14 46 6 30-30 62-14t64 8q40-10 80 12v74z"
          fill={`url(#${hillId})`}
        />
        <Path d="M290 190q6-44 30-58 10-6 22 2 22 16 24 56z" fill="#1c8a52" />
        <Path
          d="M300 190q6-34 24-46"
          stroke="#34b274"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          opacity={0.6}
        />
        {/* mosque */}
        <G transform="translate(70, 28)">
          {[0, 1].map((i) => (
            <G key={i} transform={`translate(${i ? 164 : 0}, 0)`}>
              <Rect x={6} y={40} width={9} height={108} rx={3} fill="#dfe8df" />
              <Path d="M5 40l5.5-26L16 40z" fill="#f4faf4" />
              <Circle cx={10.5} cy={12} r={3} fill={gold} />
            </G>
          ))}
          <Rect x={30} y={110} width={124} height={48} rx={4} fill="#eef4ee" />
          {[40, 58, 76, 94, 112, 130].map((x) => (
            <Path key={x} d={`M${x} 158v-24a8 8 0 0 1 16 0v24z`} fill="#b7c9bb" />
          ))}
          <Path d="M46 110a46 46 0 0 1 92 0z" fill={gold} />
          <Path d="M60 110a32 32 0 0 1 64 0z" fill="#ffe27f" opacity={0.55} />
          <Path d="M92 64v-14M92 50l-4-6h8z" stroke={gold} strokeWidth={3} strokeLinecap="round" />
          <Rect x={22} y={152} width={140} height={8} rx={3} fill="#d3e0d5" />
        </G>
        {/* trees */}
        {[
          [20, 214, 22],
          [62, 222, 17],
          [330, 224, 20],
          [360, 214, 15],
        ].map(([x, y, r], i) => (
          <Circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? '#12a85f' : '#0d8049'} />
        ))}
      </Svg>
      {/* Flag */}
      <View style={styles.flagWrap}>
        <View style={styles.flagPole} />
        <View style={styles.flagCloth}>
          <View style={[styles.flagBand, { backgroundColor: '#0fa85c' }]} />
          <View style={[styles.flagBand, { backgroundColor: '#ffffff' }]} />
          <View style={[styles.flagBand, { backgroundColor: '#0fa85c' }]} />
        </View>
      </View>
      {/* Kobo waving */}
      <View style={styles.koboWrap}>
        <Mascot mood="wave" size={96} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scene: {
    position: 'absolute',
    right: -6,
    top: -4,
    bottom: -4,
    width: '64%',
    zIndex: 1,
    overflow: 'hidden',
  },
  flagWrap: {
    position: 'absolute',
    top: 24,
    right: 68,
    width: 72,
    height: 68,
    zIndex: 2,
  },
  flagPole: {
    position: 'absolute',
    left: 0,
    top: -4,
    width: 3.5,
    height: 76,
    borderRadius: 4,
    backgroundColor: '#cceee0',
  },
  flagCloth: {
    position: 'absolute',
    left: 3.5,
    top: 0,
    width: 62,
    height: 40,
    flexDirection: 'row',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
  },
  flagBand: {
    flex: 1,
  },
  koboWrap: {
    position: 'absolute',
    right: 6,
    bottom: -6,
    zIndex: 3,
  },
});

