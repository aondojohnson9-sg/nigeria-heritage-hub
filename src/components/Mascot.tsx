import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path } from 'react-native-svg';
import { useProgress } from '../state/progress';

export type MascotMood = 'happy' | 'wave' | 'cheer' | 'sad' | 'think';

// Kobo — the HeritageHub eagle. Moods: happy | wave | cheer | sad | think
export default function Mascot({
  mood = 'happy',
  size = 120,
}: {
  mood?: MascotMood;
  size?: number;
}) {
  const { settings } = useProgress();
  const reduced = settings.motion === 'reduced';
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduced || mood === 'sad') {
      bob.setValue(0);
      return;
    }
    const distance = mood === 'cheer' ? -9 : -5;
    const duration = mood === 'cheer' ? 350 : 1500;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: distance,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [bob, mood, reduced]);

  const happyEyes = mood === 'cheer';
  const sad = mood === 'sad';

  const wingLTransform =
    mood === 'cheer'
      ? 'rotate(38, 46, 120)'
      : sad
        ? 'rotate(-14, 46, 120)'
        : undefined;
  const wingRTransform =
    mood === 'cheer'
      ? 'rotate(-38, 154, 120)'
      : sad
        ? 'rotate(14, 154, 120)'
        : mood === 'wave'
          ? 'rotate(-16, 154, 120)'
          : undefined;

  return (
    <View style={{ width: size, height: size * 1.1 }}>
      <Svg viewBox="0 0 200 220" width={size} height={size * 1.1}>
        <Ellipse cx={100} cy={209} rx={58} ry={7} fill="#000" opacity={0.28} />
      </Svg>
      <Animated.View
        style={{
          position: 'absolute',
          inset: 0,
          transform: [
            { translateY: bob },
            ...(sad ? [{ rotate: '-3deg' }, { translateY: 3 }] : []),
          ],
        }}
      >
        <Svg viewBox="0 0 200 220" width={size} height={size * 1.1}>
          {/* feet */}
          <Ellipse cx={76} cy={201} rx={19} ry={8} fill="#ffc82e" />
          <Ellipse cx={124} cy={201} rx={19} ry={8} fill="#ffc82e" />
          {/* wings (behind) */}
          <G transform={wingLTransform}>
            <Path d="M46 116q-28 8-26 42 2 15 19 8 9-21 13-42z" fill="#0d9b55" />
          </G>
          <G transform={wingRTransform}>
            <Path d="M154 116q28 8 26 42-2 15-19 8-9-21-13-42z" fill="#0d9b55" />
          </G>
          {/* body */}
          <Path
            d="M100 28c-45 0-70 35-70 82 0 47 29 88 70 88s70-41 70-88c0-47-25-82-70-82z"
            fill="#1ec26f"
          />
          <Path
            d="M100 28c-45 0-70 35-70 82 0 6 .5 11 1.5 16C40 78 66 42 100 40c34 2 60 38 68.5 86 1-5 1.5-10 1.5-16 0-47-25-82-70-82z"
            fill="#3ee08c"
            opacity={0.55}
          />
          <Ellipse cx={100} cy={146} rx={41} ry={48} fill="#effff4" />
          {/* scarf */}
          <Path d="M46 114q54 28 108 0l-2 20q-52 24-104 0z" fill="#ffffff" />
          <Path
            d="M46 114q54 28 108 0M48 134q52 22 104 0"
            stroke="#13b866"
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
          />
          <Path
            d="M138 132l12 30-14 4-8-24z"
            fill="#fff"
            stroke="#13b866"
            strokeWidth={3}
            strokeLinejoin="round"
          />
          {/* tuft */}
          <Path
            d="M82 38q-4-20 8-28 0 12 6 26zM96 32q2-22 16-26-2 14 0 28zM110 36q8-16 22-16-6 10-8 24z"
            fill="#0d9b55"
          />
          {/* cheeks */}
          <Circle cx={54} cy={104} r={9} fill="#ff8aa0" opacity={0.5} />
          <Circle cx={146} cy={104} r={9} fill="#ff8aa0" opacity={0.5} />
          {/* eyes */}
          {happyEyes ? (
            <G fill="none" stroke="#052113" strokeWidth={7} strokeLinecap="round">
              <Path d="M56 88q18-24 36 0" />
              <Path d="M108 88q18-24 36 0" />
            </G>
          ) : (
            <G>
              <Circle cx={76} cy={84} r={21} fill="#fff" />
              <Circle cx={124} cy={84} r={21} fill="#fff" />
              <Circle cx={sad ? 76 : 79} cy={sad ? 90 : 86} r={10.5} fill="#052113" />
              <Circle cx={sad ? 124 : 121} cy={sad ? 90 : 86} r={10.5} fill="#052113" />
              <Circle cx={sad ? 80 : 83} cy={sad ? 86 : 82} r={3.8} fill="#fff" />
              <Circle cx={sad ? 128 : 125} cy={sad ? 86 : 82} r={3.8} fill="#fff" />
            </G>
          )}
          {sad && (
            <G>
              <Path
                d="M54 74l28-10M146 74l-28-10"
                stroke="#052113"
                strokeWidth={5}
                strokeLinecap="round"
              />
              <Path d="M60 106q6 10 0 14-6-4 0-14z" fill="#6cc4ff" />
            </G>
          )}
          {mood === 'think' && (
            <Path
              d="M110 66q16-6 28 2"
              stroke="#052113"
              strokeWidth={5}
              strokeLinecap="round"
              fill="none"
            />
          )}
          {/* beak */}
          <Path d="M86 100q14-10 28 0-2 15-14 29-12-14-14-29z" fill="#ffc82e" />
          <Path
            d="M90 106q10-5 20 0"
            stroke="#d79a00"
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
          />
          {mood === 'cheer' && (
            <Path
              d="M92 120q8 8 16 0"
              stroke="#b57a00"
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
            />
          )}
        </Svg>
      </Animated.View>
    </View>
  );
}

