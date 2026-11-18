import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect, router } from 'expo-router';
import { COLORS, RADII } from '../constants/theme';
import { useToast } from '../lib/hooks';
import { useAuth } from '../state/auth';
import Logo from '../components/Logo';
import Mascot from '../components/Mascot';
import { BackButton, Button } from '../components/ui';

export default function AuthScreen() {
  const toast = useToast();
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (user) {
    return <Redirect href="/profile" />;
  }

  async function submit() {
    if (!form.email.trim() || !form.password || (mode === 'register' && !form.name.trim())) {
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      if (mode === 'login') await login(form.email.trim(), form.password);
      else await register(form.name.trim(), form.email.trim(), form.password);
      toast({
        emoji: mode === 'login' ? '👋' : '🎉',
        text: mode === 'login' ? 'Welcome back!' : 'Account created!',
      });
      router.replace('/profile');
    } catch (err: unknown) {
      setError((err as Error).message || 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.top}>
            <BackButton to="/profile" />
          </View>

          <View style={styles.hero}>
            <Mascot mood="wave" size={104} />
            <Logo size={38} tagline />
          </View>

          <Text style={styles.pitch}>
            Back up your progress, play on any device and join the national leaderboard.
          </Text>

          <View style={styles.seg}>
            <Pressable
              onPress={() => {
                setMode('login');
                setError('');
              }}
              style={[styles.segBtn, mode === 'login' && styles.segBtnOn]}
            >
              <Text style={[styles.segText, mode === 'login' && styles.segTextOn]}>
                Sign In
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setMode('register');
                setError('');
              }}
              style={[styles.segBtn, mode === 'register' && styles.segBtnOn]}
            >
              <Text style={[styles.segText, mode === 'register' && styles.segTextOn]}>
                Register
              </Text>
            </Pressable>
          </View>

          <View style={styles.form}>
            {mode === 'register' && (
              <View style={styles.field}>
                <Text style={styles.label}>Display name</Text>
                <TextInput
                  value={form.name}
                  onChangeText={(name) => setForm((f) => ({ ...f, name }))}
                  placeholder="e.g. Chika"
                  placeholderTextColor={COLORS.text3}
                  maxLength={18}
                  style={styles.input}
                />
              </View>
            )}

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={form.email}
                onChangeText={(email) => setForm((f) => ({ ...f, email }))}
                placeholder="you@example.com"
                placeholderTextColor={COLORS.text3}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={form.password}
                onChangeText={(password) => setForm((f) => ({ ...f, password }))}
                placeholder="At least 6 characters"
                placeholderTextColor={COLORS.text3}
                secureTextEntry
                style={styles.input}
              />
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <Button
              variant="primary"
              size="lg"
              block
              disabled={busy}
              onPress={submit}
            >
              {busy
                ? 'Please wait…'
                : mode === 'login'
                  ? 'Sign In'
                  : 'Create Account'}
            </Button>
          </View>

          <Text style={styles.note}>
            Only your display name appears on the leaderboard — never your email.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hero: {
    alignItems: 'center',
    gap: 10,
    marginTop: 6,
    marginBottom: 18,
  },
  pitch: {
    textAlign: 'center',
    color: COLORS.text2,
    fontSize: 15,
    marginBottom: 18,
    paddingHorizontal: 8,
    lineHeight: 21,
  },
  seg: {
    flexDirection: 'row',
    padding: 5,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    marginBottom: 18,
  },
  segBtn: {
    flex: 1,
    paddingVertical: 11,
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
    color: COLORS.text2,
  },
  segTextOn: {
    color: COLORS.onBright,
  },
  form: {
    gap: 14,
  },
  field: {
    gap: 6,
  },
  label: {
    fontWeight: '900',
    fontSize: 14,
    color: COLORS.text2,
  },
  input: {
    height: 54,
    paddingHorizontal: 16,
    borderRadius: RADII.md,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.lineStrong,
    color: COLORS.text,
    fontWeight: '700',
    fontSize: 16,
  },
  errorBox: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,93,108,0.14)',
    borderWidth: 1,
    borderColor: 'rgba(255,93,108,0.45)',
  },
  errorText: {
    color: '#ffb3bb',
    fontWeight: '700',
    fontSize: 14,
  },
  note: {
    textAlign: 'center',
    color: COLORS.text3,
    fontSize: 13,
    marginTop: 18,
  },
});
