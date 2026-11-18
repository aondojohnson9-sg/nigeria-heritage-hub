import React, { useState } from 'react';
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { COLORS, FONTS, RADII } from '../../constants/theme';
import { dayKey } from '../../data/quizzes';
import { rankOf } from '../../data/ranks';
import { useAuth } from '../../state/auth';
import { useProgress } from '../../state/progress';
import { useToast } from '../../lib/hooks';
import { shareText } from '../../lib/share';
import { timeAgo } from '../../lib/time';
import { sfx } from '../../lib/fx';
import Icon, { type IconName } from '../../components/Icon';
import Mascot from '../../components/Mascot';
import { Button, PageHeader, SectionHead, Sheet } from '../../components/ui';

const RESOURCES = [
  {
    title: 'National Bureau of Statistics',
    desc: "Official data on Nigeria's demographics and economy.",
    url: 'https://www.nigerianstat.gov.ng/',
    tag: 'Official Data',
  },
  {
    title: 'Nigerian Constitution (1999)',
    desc: 'Full text of the Constitution, as amended.',
    url: 'https://www.nigeria-law.org/ConstitutionOfTheFederalRepublicOfNigeria.htm',
    tag: 'Legal',
  },
  {
    title: 'INEC',
    desc: 'Election timetables and results from the electoral commission.',
    url: 'https://inecnigeria.org/',
    tag: 'Elections',
  },
  {
    title: 'National Commission for Museums & Monuments',
    desc: "Custodians of Nigeria's cultural heritage.",
    url: 'https://www.ncmm.gov.ng/',
    tag: 'Culture',
  },
];

function Toggle({
  on,
  onChange,
  label,
  icon,
  hint,
}: {
  on: boolean;
  onChange: (next: boolean) => void;
  label: string;
  icon: IconName;
  hint: string;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      onPress={() => {
        onChange(!on);
        sfx.tap();
      }}
      style={styles.setting}
    >
      <View style={styles.settingIcon}>
        <Icon name={icon} size={20} color={COLORS.green} />
      </View>
      <View style={styles.settingMain}>
        <Text style={styles.settingLabel}>{label}</Text>
        <Text style={styles.settingHint}>{hint}</Text>
      </View>
      <View style={[styles.switchTrack, on && styles.switchTrackOn]}>
        <View style={[styles.switchThumb, on && styles.switchThumbOn]} />
      </View>
    </Pressable>
  );
}

const SYNC_MAP: Record<string, [string, string]> = {
  synced: ['ok', 'Backed up'],
  syncing: ['busy', 'Syncing…'],
  offline: ['warn', 'Offline — will sync later'],
  error: ['warn', 'Sync problem — retrying'],
  idle: ['busy', 'Connecting…'],
  off: ['warn', ''],
};

export default function ProfileScreen() {
  const toast = useToast();
  const p = useProgress();
  const { user, sync, lastSync, logout, deleteAccount, resetProgress, syncNow } = useAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(p.name);
  const [confirm, setConfirm] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [delPw, setDelPw] = useState('');
  const [delErr, setDelErr] = useState('');
  const [now] = useState(() => Date.now());

  const days = Array.from({ length: 7 }, (_, k) => {
    const d = new Date(now - (6 - k) * 86400000);
    return {
      key: dayKey(d),
      label: 'SMTWTFS'[d.getDay()],
      xp: p.xpByDay[dayKey(d)] || 0,
      today: k === 6,
    };
  });
  const max = Math.max(20, ...days.map((d) => d.xp));
  const quizPlays = Object.values(p.quizzes).reduce((a, q) => a + q.plays, 0);
  const saveName = () => {
    p.setName(draft);
    setEditing(false);
    sfx.pop();
  };
  const [syncTone, syncText] = SYNC_MAP[sync] || SYNC_MAP.off;

  const shareProgress = async () => {
    const r = await shareText({
      title: 'HeritageHub',
      text: `I'm a Level ${p.level.level} ${rankOf(p.level.level)} on HeritageHub 🇳🇬 — ${p.xp} XP${p.streakAlive && p.streak ? ` and a ${p.streak}-day streak 🔥` : ''}. Learn Nigerian history with me!`,
    });
    if (r === 'copied') toast({ emoji: '📋', text: 'Copied to clipboard' });
  };

  const doReset = async () => {
    try {
      await resetProgress();
      toast('Progress reset');
    } catch (e: unknown) {
      toast((e as Error).message || 'Reset failed');
    }
    setConfirm(false);
  };

  const doDelete = async () => {
    setDelErr('');
    try {
      await deleteAccount(delPw);
      setDelOpen(false);
      setDelPw('');
      toast('Account deleted');
    } catch (err: unknown) {
      setDelErr((err as Error).message || 'Could not delete account');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <PageHeader title="Profile" />

        {/* Profile Hero Card */}
        <LinearGradient
          colors={['#123f29', '#0b2518']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.meCard}
        >
          <Mascot mood="happy" size={86} />
          <View style={styles.meMain}>
            {editing ? (
              <View style={styles.nameEdit}>
                <TextInput
                  value={draft}
                  maxLength={18}
                  autoFocus
                  onChangeText={setDraft}
                  onSubmitEditing={saveName}
                  style={styles.nameInput}
                  accessibilityLabel="Your name"
                />
                <Pressable
                  onPress={saveName}
                  accessibilityLabel="Save name"
                  style={styles.saveNameBtn}
                >
                  <Icon name="check" size={18} color={COLORS.onBright} />
                </Pressable>
              </View>
            ) : (
              <View style={styles.nameRow}>
                <Text style={styles.meName} numberOfLines={1}>
                  {p.name}
                </Text>
                <Pressable
                  onPress={() => {
                    setDraft(p.name);
                    setEditing(true);
                    sfx.tap();
                  }}
                  accessibilityLabel="Edit name"
                  style={styles.editBtn}
                >
                  <Icon name="pencil" size={14} color={COLORS.text2} />
                </Pressable>
              </View>
            )}
            <Text style={styles.meLevel}>
              Level {p.level.level} · {rankOf(p.level.level)}
            </Text>
            <View style={styles.xpBar}>
              <View style={[styles.xpBarFill, { width: `${p.level.into}%` }]} />
            </View>
            <Text style={styles.meXp}>
              {p.level.into}/100 XP to level {p.level.level + 1}
            </Text>
          </View>
        </LinearGradient>

        {/* Stats 2x2 Grid */}
        <View style={styles.statGrid}>
          <View style={styles.statBox}>
            <Icon name="bolt" size={26} color={COLORS.gold} />
            <Text style={styles.statVal}>{p.xp}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="flame" size={26} />
            <Text style={styles.statVal}>{p.streakAlive ? p.streak : 0}</Text>
            <Text style={styles.statLabel}>Day Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="trophy" size={26} color={COLORS.green} />
            <Text style={styles.statVal}>{quizPlays}</Text>
            <Text style={styles.statLabel}>Quizzes</Text>
          </View>
          <View style={styles.statBox}>
            <Icon name="star" size={26} color={COLORS.blue} />
            <Text style={styles.statVal}>{p.fixed || 0}</Text>
            <Text style={styles.statLabel}>Mistakes fixed</Text>
          </View>
        </View>

        <View style={styles.btnRow}>
          <View style={{ flex: 1 }}>
            <Button variant="ghost" block icon="share" onPress={shareProgress}>
              Share
            </Button>
          </View>
          <View style={{ flex: 1 }}>
            <Button
              variant="ghost"
              block
              icon="trophy"
              onPress={() => router.push('/leaderboard')}
            >
              Leaderboard
            </Button>
          </View>
        </View>

        {/* This Week */}
        <SectionHead
          title="This Week"
          right={<Text style={styles.muted}>XP per day</Text>}
        />
        <View style={styles.week}>
          {days.map((d) => {
            const pct = Math.max(d.xp ? 10 : 0, (d.xp / max) * 100);
            return (
              <View key={d.key} style={styles.weekCol}>
                <View style={styles.weekTrack}>
                  <View style={[styles.weekFill, { height: `${pct}%` }]} />
                </View>
                <Text style={[styles.weekLabel, d.today && styles.weekLabelToday]}>
                  {d.label}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Achievements 2-column grid */}
        <SectionHead
          title="Achievements"
          right={
            <Text style={styles.muted}>
              {p.achievements.filter((a) => a.done).length}/{p.achievements.length}
            </Text>
          }
        />
        <View style={styles.badges}>
          {p.achievements.map((a) => (
            <View key={a.id} style={[styles.badge, a.done && styles.badgeDone]}>
              <Text style={[styles.badgeEmoji, !a.done && { opacity: 0.45 }]}>
                {a.emoji}
              </Text>
              <Text style={styles.badgeName}>{a.name}</Text>
              <Text style={[styles.badgeSub, a.done && { color: COLORS.gold }]}>
                {a.done ? 'Unlocked!' : `${a.value}/${a.goal}`}
              </Text>
              {!a.done && (
                <View style={styles.miniBar}>
                  <View
                    style={[
                      styles.miniBarFill,
                      { width: `${(a.value / a.goal) * 100}%` },
                    ]}
                  />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Cloud Sync / Account */}
        <SectionHead title="Account" />
        {user ? (
          <View style={styles.acct}>
            <View style={styles.acctTop}>
              <View style={styles.avatarSm}>
                <Text style={styles.avatarSmText}>
                  {(user.name[0] || '?').toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.acctName}>{user.name}</Text>
                <Text style={styles.acctEmail}>{user.email}</Text>
              </View>
            </View>
            {syncText ? (
              <Pressable
                onPress={() => {
                  sfx.tap();
                  syncNow().catch(() => {});
                }}
                style={styles.syncPill}
              >
                <View
                  style={[
                    styles.syncDot,
                    {
                      backgroundColor:
                        syncTone === 'ok' ? COLORS.green : COLORS.gold,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.syncText,
                    {
                      color:
                        syncTone === 'ok' ? '#7dffb6' : '#ffe9a6',
                    },
                  ]}
                >
                  {syncText}
                  {sync === 'synced' && lastSync
                    ? ` · ${timeAgo(new Date(lastSync).toISOString())}`
                    : ''}
                </Text>
              </Pressable>
            ) : null}
            <Button
              variant="ghost"
              block
              onPress={() => {
                logout();
                toast('Signed out');
              }}
            >
              Sign out
            </Button>
          </View>
        ) : (
          <View style={styles.acct}>
            <Text style={styles.acctPitch}>
              Sign in to back up your progress, play on any device and appear on the leaderboard.
            </Text>
            <Button
              variant="primary"
              block
              iconRight="right"
              onPress={() => router.push('/auth')}
            >
              Sign in or create an account
            </Button>
          </View>
        )}

        {/* Preferences */}
        <SectionHead title="Settings" />
        <View style={styles.settings}>
          <Toggle
            on={p.settings.sound}
            onChange={(v) => p.setSetting('sound', v)}
            label="Sound effects"
            hint="Cheerful blips for answers and rewards"
            icon="volume"
          />
          <Toggle
            on={p.settings.haptics}
            onChange={(v) => p.setSetting('haptics', v)}
            label="Haptic feedback"
            hint="Gentle vibrations on supported phones"
            icon="vibrate"
          />
          <Toggle
            on={p.settings.pidgin}
            onChange={(v) => p.setSetting('pidgin', v)}
            label="Naija flavour"
            hint={'A little Pidgin in your feedback — "Na so! Correct!"'}
            icon="sparkles"
          />
          <Toggle
            on={p.settings.motion === 'reduced'}
            onChange={(v) => p.setSetting('motion', v ? 'reduced' : 'auto')}
            label="Reduce motion"
            hint="Turn off bouncy animations and confetti"
            icon="motion"
          />
        </View>

        {/* Official Resources */}
        <SectionHead title="Official Resources" />
        <View style={styles.resources}>
          {RESOURCES.map((r) => (
            <Pressable
              key={r.title}
              onPress={() => {
                sfx.tap();
                Linking.openURL(r.url).catch(() => {});
              }}
              style={({ pressed }) => [
                styles.resource,
                pressed && { transform: [{ scale: 0.98 }] },
              ]}
            >
              <View style={styles.resourceChip}>
                <Text style={styles.resourceChipText}>{r.tag}</Text>
              </View>
              <Text style={styles.resourceTitle}>{r.title}</Text>
              <Text style={styles.resourceDesc}>{r.desc}</Text>
            </Pressable>
          ))}
        </View>

        {/* About & Danger Zone */}
        <View style={styles.about}>
          <Text style={styles.aboutTitle}>HeritageHub</Text>
          <Text style={styles.aboutText}>
            An interactive way to learn Nigerian history, states, leaders, the constitution and current affairs. State boundaries from Natural Earth (public domain).
          </Text>
          <Pressable
            onPress={() => {
              sfx.tap();
              setConfirm(true);
            }}
            style={styles.dangerLink}
          >
            <Icon name="trash" size={16} color={COLORS.red} />
            <Text style={styles.dangerLinkText}>Reset my progress</Text>
          </Pressable>
          {user && (
            <Pressable
              onPress={() => {
                sfx.tap();
                setDelOpen(true);
              }}
              style={styles.dangerLink}
            >
              <Icon name="trash" size={16} color={COLORS.red} />
              <Text style={styles.dangerLinkText}>Delete my account</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>

      {/* Reset confirmation */}
      <Sheet open={confirm} onClose={() => setConfirm(false)} title="Reset all progress?">
        <View style={styles.quitBody}>
          <Mascot mood="sad" size={86} />
          <Text style={styles.quitText}>
            This clears your XP, streak, lessons and quiz scores
            {user ? ' on this device and in your account' : ' on this device'}. It can&apos;t be undone.
          </Text>
        </View>
        <Button variant="primary" block onPress={() => setConfirm(false)}>
          Keep my progress
        </Button>
        <Button variant="ghost-danger" block onPress={doReset}>
          Reset everything
        </Button>
      </Sheet>

      {/* Delete account */}
      <Sheet open={delOpen} onClose={() => setDelOpen(false)} title="Delete your account?">
        <Text style={styles.acctPitch}>
          This permanently deletes your account and leaderboard entry. Progress on this device is kept. Enter your password to confirm.
        </Text>
        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Password</Text>
          <TextInput
            value={delPw}
            onChangeText={setDelPw}
            secureTextEntry
            placeholder="Your password"
            placeholderTextColor={COLORS.text3}
            style={styles.fieldInput}
          />
        </View>
        {delErr ? (
          <View style={styles.formError}>
            <Text style={styles.formErrorText}>{delErr}</Text>
          </View>
        ) : null}
        <Button variant="danger" block onPress={doDelete} disabled={!delPw}>
          Delete account
        </Button>
        <Button variant="ghost" block onPress={() => setDelOpen(false)}>
          Cancel
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
    paddingTop: 14,
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  meCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(37,217,126,0.3)',
    borderBottomWidth: 5,
    borderBottomColor: '#051a0f',
  },
  meMain: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  meName: {
    fontFamily: FONTS.displaySemi,
    fontSize: 26,
    color: COLORS.text,
    flexShrink: 1,
  },
  editBtn: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameEdit: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  nameInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: COLORS.bg0,
    borderWidth: 2,
    borderColor: COLORS.green,
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 17,
  },
  saveNameBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  meLevel: {
    color: COLORS.gold,
    fontWeight: '900',
    fontSize: 14.5,
  },
  xpBar: {
    height: 11,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    marginTop: 2,
  },
  xpBarFill: {
    height: '100%',
    borderRadius: 99,
    backgroundColor: COLORS.gold,
  },
  meXp: {
    color: COLORS.text2,
    fontWeight: '700',
    fontSize: 13,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 14,
  },
  statBox: {
    width: '48%',
    flexGrow: 1,
    padding: 14,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    borderBottomWidth: 5,
    borderBottomColor: '#020b06',
    gap: 3,
  },
  statVal: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: COLORS.text,
    marginTop: 4,
  },
  statLabel: {
    color: COLORS.text2,
    fontWeight: '800',
    fontSize: 13,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  muted: {
    color: COLORS.text3,
    fontWeight: '700',
    fontSize: 14,
  },
  week: {
    flexDirection: 'row',
    gap: 8,
    padding: 14,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.lineStrong,
  },
  weekCol: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  weekTrack: {
    width: '100%',
    maxWidth: 30,
    height: 86,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  weekFill: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: COLORS.green,
  },
  weekLabel: {
    color: COLORS.text3,
    fontWeight: '900',
    fontSize: 12,
  },
  weekLabelToday: {
    color: COLORS.green,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    width: '48%',
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    gap: 4,
  },
  badgeDone: {
    borderColor: 'rgba(255,200,46,0.6)',
    backgroundColor: 'rgba(255,200,46,0.1)',
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(215,154,0,0.5)',
  },
  badgeEmoji: {
    fontSize: 32,
  },
  badgeName: {
    fontFamily: FONTS.displaySemi,
    fontSize: 14,
    color: COLORS.text,
    textAlign: 'center',
  },
  badgeSub: {
    color: COLORS.text3,
    fontWeight: '800',
    fontSize: 12,
  },
  miniBar: {
    width: '72%',
    height: 6,
    borderRadius: 99,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    marginTop: 4,
  },
  miniBarFill: {
    height: '100%',
    borderRadius: 99,
    backgroundColor: COLORS.green,
  },
  acct: {
    gap: 12,
    padding: 14,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    borderBottomWidth: 5,
    borderBottomColor: '#020b06',
  },
  acctTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarSm: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.green,
    borderWidth: 2,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmText: {
    fontFamily: FONTS.display,
    fontSize: 20,
    color: COLORS.onBright,
  },
  acctName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  acctEmail: {
    color: COLORS.text2,
    fontSize: 13.5,
  },
  acctPitch: {
    color: COLORS.text2,
    fontSize: 14.5,
    lineHeight: 20,
  },
  syncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 99,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.lineStrong,
  },
  syncDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
  },
  syncText: {
    fontWeight: '900',
    fontSize: 13,
  },
  settings: {
    gap: 10,
  },
  setting: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: COLORS.surface3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingMain: {
    flex: 1,
  },
  settingLabel: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 15.5,
  },
  settingHint: {
    color: COLORS.text2,
    fontSize: 13,
    marginTop: 2,
  },
  switchTrack: {
    width: 54,
    height: 32,
    borderRadius: 99,
    backgroundColor: '#243a2e',
    padding: 4,
    justifyContent: 'center',
  },
  switchTrackOn: {
    backgroundColor: COLORS.green,
  },
  switchThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.white,
  },
  switchThumbOn: {
    alignSelf: 'flex-end',
  },
  resources: {
    gap: 10,
  },
  resource: {
    gap: 4,
    padding: 14,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
  },
  resourceChip: {
    alignSelf: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 9,
    borderRadius: RADII.pill,
    backgroundColor: 'rgba(37,217,126,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(37,217,126,0.4)',
  },
  resourceChipText: {
    color: '#a8f7cb',
    fontSize: 11.5,
    fontWeight: '800',
  },
  resourceTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 17,
    color: COLORS.text,
    marginTop: 2,
  },
  resourceDesc: {
    color: COLORS.text2,
    fontSize: 13.5,
  },
  about: {
    marginTop: 24,
    padding: 18,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.lineStrong,
    gap: 8,
  },
  aboutTitle: {
    fontFamily: FONTS.displaySemi,
    fontSize: 20,
    color: COLORS.text,
  },
  aboutText: {
    color: COLORS.text2,
    fontSize: 14,
    lineHeight: 20,
  },
  dangerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  dangerLinkText: {
    color: COLORS.red,
    fontWeight: '900',
    fontSize: 15,
  },
  quitBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  quitText: {
    flex: 1,
    color: COLORS.text2,
    fontSize: 14.5,
    lineHeight: 20,
  },
  field: {
    gap: 6,
  },
  fieldLabel: {
    fontWeight: '900',
    fontSize: 14,
    color: COLORS.text2,
  },
  fieldInput: {
    height: 52,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: COLORS.bg0,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 16,
  },
  formError: {
    padding: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,93,108,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,93,108,0.45)',
  },
  formErrorText: {
    color: '#ffb3bb',
    fontWeight: '700',
    fontSize: 14,
  },
});

