import React, { useCallback, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, usePathname, type Href, type Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, EDGE, FONTS, RADII, getModulePalette, type ModuleKey } from '../constants/theme';
import type { ModuleItem } from '../data/modules';
import { sfx } from '../lib/fx';
import { ToastCtx, type ToastInput } from '../lib/hooks';
import { useProgress } from '../state/progress';
import Icon, { type IconName } from './Icon';
import { ModuleArt } from './Illustrations';

/* ---------- Chunky 3D button ---------- */
export type ButtonVariant = 'primary' | 'gold' | 'danger' | 'ghost' | 'ghost-danger' | 'module';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconName;
  iconRight?: IconName;
  block?: boolean;
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  sound?: boolean;
  moduleColor?: ModuleKey | string;
  style?: StyleProp<ViewStyle>;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  block,
  children,
  onPress,
  disabled = false,
  sound = true,
  moduleColor,
  style,
}: ButtonProps) {
  const modPal = getModulePalette(moduleColor);

  let bg: string = COLORS.green;
  let edgeColor: string = COLORS.greenDeep;
  let ink: string = COLORS.onBright;
  let borderColor: string | undefined;

  if (variant === 'gold') {
    bg = COLORS.gold;
    edgeColor = COLORS.goldDeep;
    ink = COLORS.onBright;
  } else if (variant === 'danger') {
    bg = COLORS.red;
    edgeColor = COLORS.redDeep;
    ink = COLORS.white;
  } else if (variant === 'ghost') {
    bg = COLORS.surface2;
    edgeColor = '#0a1c12';
    ink = COLORS.green;
    borderColor = COLORS.lineStrong;
  } else if (variant === 'ghost-danger') {
    bg = 'transparent';
    edgeColor = 'transparent';
    ink = COLORS.red;
  } else if (variant === 'module') {
    bg = modPal.m;
    edgeColor = modPal.deep;
    ink = modPal.onDarkText ? COLORS.white : '#07170d';
  }

  if (disabled) {
    bg = '#1d3427';
    edgeColor = '#13251b';
    ink = COLORS.text3;
    borderColor = undefined;
  }

  const edge = variant === 'ghost-danger' ? 0 : size === 'sm' ? 3 : EDGE;
  const padV = size === 'sm' ? 10 : size === 'lg' ? 16 : 13;
  const padH = size === 'sm' ? 14 : size === 'lg' ? 24 : 20;
  const fontSize = size === 'sm' ? 14 : size === 'lg' ? 17.5 : 16;
  const radius = size === 'sm' ? 14 : size === 'lg' ? 18 : RADII.md;

  return (
    <Pressable
      disabled={disabled}
      onPress={() => {
        if (sound && !disabled) sfx.tap();
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.btnBase,
        {
          backgroundColor: bg,
          paddingVertical: padV,
          paddingHorizontal: padH,
          borderRadius: radius,
          borderBottomWidth: pressed && !disabled ? 0 : edge,
          borderBottomColor: edgeColor,
          marginTop: pressed && !disabled ? edge : 0,
          marginBottom: pressed && !disabled ? 0 : edge,
          width: block ? '100%' : undefined,
        },
        borderColor
          ? {
              borderWidth: 2,
              borderColor,
              borderBottomWidth: pressed && !disabled ? 2 : edge + 1,
              borderBottomColor: edgeColor,
            }
          : null,
        style,
      ]}
    >
      {icon && <Icon name={icon} size={20} color={ink} />}
      <Text style={[styles.btnText, { color: ink, fontSize }]}>{children}</Text>
      {iconRight && <Icon name={iconRight} size={18} color={ink} />}
    </Pressable>
  );
}

/* ---------- Bottom sheet ---------- */
export function Sheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={open} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.sheetWrap}>
        <Pressable style={styles.sheetScrim} onPress={onClose} />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 14) + 12 }]}>
          <View style={styles.sheetGrab} />
          {title ? (
            <View style={styles.sheetHead}>
              <Text style={styles.sheetTitle}>{title}</Text>
              <Pressable
                style={styles.iconBtn}
                onPress={onClose}
                accessibilityLabel="Close"
                hitSlop={8}
              >
                <Icon name="x" size={18} color={COLORS.text} />
              </Pressable>
            </View>
          ) : null}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sheetBody}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

/* ---------- Toasts ---------- */
interface ToastEntry extends ToastInput {
  id: string;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastEntry[]>([]);
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const push = useCallback((t: string | ToastInput) => {
    const id = Math.random().toString(36).slice(2);
    const entry: ToastEntry = { id, ...(typeof t === 'string' ? { text: t } : t) };
    setItems((l) => [...l.slice(-2), entry]);
    setTimeout(() => {
      setItems((l) => l.filter((x) => x.id !== id));
    }, 2600);
  }, []);

  const topOffset = insets.top + (pathname.startsWith('/quiz') ? 74 : 14);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <View style={[styles.toasts, { top: topOffset }]} pointerEvents="none">
        {items.map((t) => (
          <View key={t.id} style={styles.toast}>
            {t.emoji ? <Text style={styles.toastEmoji}>{t.emoji}</Text> : null}
            <Text style={styles.toastText}>{t.text}</Text>
          </View>
        ))}
      </View>
    </ToastCtx.Provider>
  );
}

/* ---------- Bottom navigation ---------- */
type TabBarProps = Parameters<NonNullable<React.ComponentProps<typeof Tabs>['tabBar']>>[0];

const TAB_CONFIG: Record<string, { label: string; icon: IconName }> = {
  index: { label: 'Home', icon: 'home' },
  explore: { label: 'Explore', icon: 'compass' },
  quizzes: { label: 'Quizzes', icon: 'trophy' },
  profile: { label: 'Profile', icon: 'user' },
};

export function BottomNav({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bottomNav,
        { paddingBottom: Math.max(insets.bottom, 10) },
      ]}
    >
      {state.routes.map((route, index) => {
        const cfg = TAB_CONFIG[route.name] || { label: route.name, icon: 'home' as IconName };
        const isFocused = state.index === index;

        const onPress = () => {
          sfx.tap();
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={styles.tab}
          >
            <View style={styles.tabIconWrap}>
              <Icon
                name={cfg.icon}
                size={24}
                color={isFocused ? COLORS.green : COLORS.text3}
              />
            </View>
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
              {cfg.label}
            </Text>
            {isFocused && <View style={styles.tabIndicator} />}
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------- Back / page header ---------- */
export function BackButton({
  to,
  label = 'Back',
  onColor = false,
}: {
  to?: Href;
  label?: string;
  onColor?: boolean;
}) {
  return (
    <Pressable
      accessibilityLabel={label}
      onPress={() => {
        sfx.tap();
        if (to) {
          router.replace(to);
        } else if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/');
        }
      }}
      style={({ pressed }) => [
        styles.iconBtn,
        onColor && styles.iconBtnOnColor,
        pressed && { transform: [{ scale: 0.9 }] },
      ]}
    >
      <Icon name="left" size={20} color={COLORS.white} />
    </Pressable>
  );
}

export function PageHeader({
  title,
  sub,
  right,
  back,
}: {
  title: string;
  sub?: string;
  right?: React.ReactNode;
  back?: boolean | Href;
}) {
  return (
    <View style={styles.pageHead}>
      {back ? <BackButton to={back === true ? undefined : back} /> : null}
      <View style={styles.pageHeadText}>
        <Text style={styles.pageHeadTitle}>{title}</Text>
        {sub ? <Text style={styles.pageHeadSub}>{sub}</Text> : null}
      </View>
      {right}
    </View>
  );
}

/* ---------- Module hero used at the top of every module page ---------- */
export function ModuleHero({
  mod,
  progress,
}: {
  mod: ModuleItem;
  progress: number;
}) {
  const pct = Math.round((progress || 0) * 100);
  const pal = getModulePalette(mod.id);

  return (
    <LinearGradient
      colors={[pal.m, pal.deep]}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[
        styles.modHero,
        {
          borderBottomWidth: 5,
          borderBottomColor: pal.deep,
        },
      ]}
    >
      <View style={styles.modHeroTop}>
        <BackButton to="/explore" onColor />
        <View style={styles.modHeroPct}>
          <Text style={styles.modHeroPctText}>{pct}% learned</Text>
        </View>
      </View>
      <View style={styles.modHeroBody}>
        <View style={{ flex: 1 }}>
          <Text style={styles.modHeroTitle}>{mod.name}</Text>
          <Text style={styles.modHeroSub}>{mod.blurb}</Text>
        </View>
        <View style={styles.modHeroArt}>
          <ModuleArt id={mod.id} />
        </View>
      </View>
      <View style={styles.barOnColor}>
        <View style={[styles.barOnColorFill, { width: `${pct}%` }]} />
      </View>
    </LinearGradient>
  );
}

/* ---------- Module card (Home grid) ---------- */
export function ModuleCard({
  mod,
  width,
}: {
  mod: ModuleItem;
  width?: number;
}) {
  const { moduleProgress } = useProgress();
  const p = moduleProgress(mod.id);
  const pal = getModulePalette(mod.id);
  const done = p >= 1;
  const barPct = Math.max(p * 100, p > 0 ? 8 : 0);

  return (
    <Pressable
      onPress={() => {
        sfx.pop();
        router.push(mod.path as Href);
      }}
      style={({ pressed }) => [
        styles.modCardOuter,
        width ? { width } : { flex: 1 },
        { borderBottomColor: pal.deep },
        pressed && { transform: [{ scale: 0.96 }] },
      ]}
      accessibilityLabel={`${mod.name}. ${mod.sub}. ${Math.round(p * 100)}% complete`}
    >
      <LinearGradient
        colors={[pal.m, pal.deep]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.modCardGrad}
      >
        <View style={styles.modCardArt}>
          <ModuleArt id={mod.id} />
        </View>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.68)']}
          style={styles.modCardScrim}
        >
          <View style={styles.modCardInfo}>
            <View style={{ flex: 1 }}>
              <Text style={styles.modCardTitle} numberOfLines={2}>
                {mod.name}
              </Text>
              <Text style={styles.modCardSub} numberOfLines={1}>
                {mod.sub}
              </Text>
            </View>
            <View
              style={[
                styles.modCardGo,
                { borderColor: 'rgba(255,255,255,0.45)' },
                done && styles.modCardGoDone,
              ]}
            >
              <Icon
                name={done ? 'check' : 'right'}
                size={14}
                color={done ? COLORS.onBright : COLORS.white}
              />
            </View>
          </View>
        </LinearGradient>
        <View style={styles.modCardBarTrack}>
          <View style={[styles.modCardBarFill, { width: `${barPct}%` }]} />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

/* ---------- Stat pills ---------- */
export function StatPill({
  icon,
  value,
  tone = 'fire',
  label,
}: {
  icon: IconName;
  value: number | string;
  tone?: 'fire' | 'gold';
  label: string;
}) {
  const color = tone === 'gold' ? COLORS.gold : '#ffb347';
  return (
    <View style={styles.statPill} accessibilityLabel={`${value} ${label}`}>
      <Icon name={icon} size={17} color={color} />
      <Text style={[styles.statPillText, { color }]}>{value}</Text>
    </View>
  );
}

/* ---------- Section Heading ---------- */
export function SectionHead({
  title,
  right,
}: {
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.sectionHead}>
      <View style={styles.sectionTitleRow}>
        <View style={styles.sectionAccent} />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  btnBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnText: {
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.surface2,
    borderWidth: 2,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnOnColor: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderColor: 'rgba(255,255,255,0.25)',
  },
  sheetWrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetScrim: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.62)',
  },
  sheet: {
    maxHeight: '88%',
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopWidth: 2,
    borderColor: COLORS.lineStrong,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  sheetGrab: {
    width: 44,
    height: 5,
    borderRadius: 5,
    backgroundColor: COLORS.lineStrong,
    alignSelf: 'center',
    marginBottom: 14,
  },
  sheetHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sheetTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 22,
    color: COLORS.text,
  },
  sheetBody: {
    gap: 10,
    paddingBottom: 12,
  },
  toasts: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    gap: 8,
    zIndex: 300,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  toastEmoji: {
    fontSize: 18,
  },
  toastText: {
    color: '#08240f',
    fontWeight: '900',
    fontSize: 14.5,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#061a10',
    borderTopWidth: 1,
    borderTopColor: COLORS.lineStrong,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingTop: 8,
    paddingHorizontal: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    paddingBottom: 8,
    position: 'relative',
  },
  tabIconWrap: {
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text3,
    marginTop: 2,
  },
  tabLabelActive: {
    color: COLORS.green,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 38,
    height: 4,
    borderRadius: 4,
    backgroundColor: COLORS.green,
  },
  pageHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  pageHeadText: {
    flex: 1,
  },
  pageHeadTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 30,
    color: COLORS.text,
  },
  pageHeadSub: {
    color: COLORS.text2,
    fontSize: 14.5,
    marginTop: 2,
    fontWeight: '600',
  },
  modHero: {
    marginBottom: 16,
    padding: 16,
    borderRadius: RADII.xl,
    overflow: 'hidden',
  },
  modHeroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modHeroPct: {
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 99,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  modHeroPctText: {
    fontWeight: '900',
    fontSize: 13,
    color: COLORS.white,
  },
  modHeroBody: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 10,
    marginBottom: 14,
  },
  modHeroTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 27,
    color: COLORS.white,
  },
  modHeroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.92)',
    marginTop: 5,
    fontWeight: '600',
  },
  modHeroArt: {
    width: 112,
    height: 82,
  },
  barOnColor: {
    height: 11,
    borderRadius: 99,
    backgroundColor: 'rgba(0,0,0,0.28)',
    overflow: 'hidden',
  },
  barOnColorFill: {
    height: '100%',
    borderRadius: 99,
    backgroundColor: COLORS.white,
  },
  modCardOuter: {
    aspectRatio: 1.08,
    borderRadius: RADII.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderBottomWidth: 5,
  },
  modCardGrad: {
    flex: 1,
    position: 'relative',
  },
  modCardArt: {
    position: 'absolute',
    top: 8,
    left: 10,
    right: 10,
    bottom: '40%',
  },
  modCardScrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 28,
    paddingBottom: 12,
    paddingHorizontal: 11,
  },
  modCardInfo: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  modCardTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 15,
    lineHeight: 18,
    color: COLORS.white,
  },
  modCardSub: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.88)',
    marginTop: 2,
  },
  modCardGo: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modCardGoDone: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.white,
  },
  modCardBarTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modCardBarFill: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 11,
    borderRadius: RADII.pill,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.lineStrong,
  },
  statPillText: {
    fontWeight: '900',
    fontSize: 14.5,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionAccent: {
    width: 6,
    height: 24,
    borderRadius: 6,
    backgroundColor: COLORS.green,
  },
  sectionTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 22,
    color: COLORS.text,
  },
});

