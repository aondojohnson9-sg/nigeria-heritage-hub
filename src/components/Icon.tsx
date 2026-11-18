import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../constants/theme';

const FILL = {
  home: 'M12 2.6 2.8 10.4a1 1 0 0 0 .65 1.76H5V20a1.5 1.5 0 0 0 1.5 1.5h3V15h5v6.5h3A1.5 1.5 0 0 0 19 20v-7.84h1.55a1 1 0 0 0 .65-1.76z',
  compass: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.3 5.7-2 5.4a1.7 1.7 0 0 1-1 1l-5.4 2 2-5.4a1.7 1.7 0 0 1 1-1z',
  trophy: 'M7 2h10v2h3a1 1 0 0 1 1 1v2a4 4 0 0 1-3.6 4 5.5 5.5 0 0 1-4.4 3.9V17h3v2h1.5v3h-11v-3H8v-2h3v-2.1A5.5 5.5 0 0 1 6.6 11 4 4 0 0 1 3 7V5a1 1 0 0 1 1-1h3zM5 6v1a2 2 0 0 0 1.2 1.8A9 9 0 0 1 6 7.5V6zm14 0h-1v1.5q0 .7-.2 1.3A2 2 0 0 0 19 7z',
  user: 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.4 0-8 2.2-8 5v1.5A1.5 1.5 0 0 0 5.5 22h13a1.5 1.5 0 0 0 1.5-1.5V19c0-2.8-3.6-5-8-5z',
  bell: 'M12 2a1.5 1.5 0 0 0-1.5 1.5v.6a6.5 6.5 0 0 0-5 6.4v3.2l-1.7 2.6A1 1 0 0 0 4.6 18h14.8a1 1 0 0 0 .8-1.7l-1.7-2.6v-3.2a6.5 6.5 0 0 0-5-6.4v-.6A1.5 1.5 0 0 0 12 2zm0 20a2.5 2.5 0 0 0 2.4-1.8H9.6A2.5 2.5 0 0 0 12 22z',
  search: 'M10.5 3a7.5 7.5 0 1 0 4.5 13.5l4.6 4.6a1.3 1.3 0 0 0 1.8-1.8L16.8 14.7A7.5 7.5 0 0 0 10.5 3zm0 2.6a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8z',
  heart: 'M12 21s-8-5.2-8-11a4.6 4.6 0 0 1 8-3 4.6 4.6 0 0 1 8 3c0 5.8-8 11-8 11z',
  bolt: 'M13.5 2 5 13.5h6L9.5 22 19 9.8h-6.2z',
  star: 'M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z',
  volume: 'M3 9v6h4l5 4V5L7 9zm13.5 3A4.5 4.5 0 0 0 14 8v8a4.5 4.5 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z',
  phone: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm4 17.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  vibrate: 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm-5 5v10h2V7zm16 0v10h2V7z',
  sparkles: 'M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8zM19 14l.9 2.6 2.6.9-2.6.9L19 21l-.9-2.6-2.6-.9 2.6-.9z',
  motion: 'M4 12a8 8 0 0 1 13.7-5.6L16 8h5V3l-1.9 1.9A10 10 0 1 0 22 12h-2a8 8 0 0 1-16 0z',
  book: 'M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H6.5a1.5 1.5 0 0 0 0 3H20v1H6.5A2.5 2.5 0 0 1 4 19.5z',
  trash: 'M9 3h6l1 2h4v2H4V5h4zM6 9h12l-1 11a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 20z',
  play: 'M7 4.5v15l13-7.5z',
  pin: 'M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z',
  pencil: 'M3 17.3V21h3.7L18 9.7 14.3 6zM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8L18.9 8.8z',
  share: 'M18 16.1c-.8 0-1.4.3-2 .8l-7.1-4.2c.1-.2.1-.5.1-.7s0-.5-.1-.7L16 7.2c.5.5 1.2.8 2 .8 1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3c0 .2 0 .5.1.7L8 9.8C7.5 9.3 6.8 9 6 9c-1.7 0-3 1.3-3 3s1.3 3 3 3c.8 0 1.5-.3 2-.8l7.1 4.2c-.1.2-.1.4-.1.6 0 1.6 1.3 2.9 2.9 2.9s2.9-1.3 2.9-2.9-1.3-2.9-2.8-2.9z',
  lock: 'M7 10V8a5 5 0 0 1 10 0v2h1a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1zm2 0h6V8a3 3 0 0 0-6 0z',
} as const;

const STROKE = {
  right: 'M5 12h14M13 6l6 6-6 6',
  left: 'M19 12H5M11 6l-6 6 6 6',
  x: 'M6 6l12 12M18 6 6 18',
  check: 'M5 12.5l4.5 4.5L19 7.5',
  down: 'M6 9l6 6 6-6',
  refresh: 'M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7',
  chevron: 'M9 6l6 6-6 6',
} as const;

export type IconName = 'flame' | keyof typeof FILL | keyof typeof STROKE;

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
}

export default function Icon({ name, size = 24, color = COLORS.text }: IconProps) {
  if (name === 'flame') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d="M12.7 1.8c.5 3.3-1.2 5-2.7 6.6-1.4 1.5-3 3.1-3 5.9A5.6 5.6 0 0 0 12.4 20c3.2 0 5.8-2.4 5.8-5.8 0-2.2-1.1-4-2.3-5.4-.2 1.1-.8 1.8-1.5 2.3.3-3.5-.4-7.4-1.7-9.3z"
          fill="#ff8a1f"
        />
        <Path
          d="M12.4 20.2c-2.2 0-3.9-1.6-3.9-3.7 0-1.7 1-2.7 2-3.7.9-.9 1.7-1.7 1.8-3.4 1.6 1.8 3.9 3.9 3.9 6.4 0 2.5-1.7 4.4-3.8 4.4z"
          fill="#ffd23f"
        />
      </Svg>
    );
  }
  if (name in STROKE) {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Path
          d={STROKE[name as keyof typeof STROKE]}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={FILL[name as keyof typeof FILL]} fill={color} fillRule="evenodd" />
    </Svg>
  );
}

