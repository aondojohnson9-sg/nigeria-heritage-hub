import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = () => {
    if (!form.email || !form.password || (mode === 'register' && !form.name)) {
      Alert.alert('Required Fields', 'Please fill in all required fields.');
      return;
    }

    Alert.alert(
      mode === 'login' ? 'Signed In!' : 'Account Created!',
      `Welcome to Nigeria Heritage Hub${form.name ? ', ' + form.name : ''}!`,
      [
        {
          text: 'Continue',
          onPress: () => router.replace('/(tabs)'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Close button at top right */}
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => router.back()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color={COLORS.text2} />
          </TouchableOpacity>

          <View style={styles.card}>
            {/* Logo Row */}
            <View style={styles.logoRow}>
              <View style={styles.flagRow}>
                <View style={[styles.flagStrip, { backgroundColor: COLORS.g700 }]} />
                <View style={[styles.flagStrip, { backgroundColor: COLORS.white }]} />
                <View style={[styles.flagStrip, { backgroundColor: COLORS.g700 }]} />
              </View>
              <Text style={styles.logoText}>Nigeria | Heritage Hub</Text>
            </View>

            {/* Tab Switcher */}
            <View style={styles.tabBar}>
              <TouchableOpacity
                style={[styles.tab, mode === 'login' && styles.tabActive]}
                onPress={() => setMode('login')}
              >
                <Text
                  style={[
                    styles.tabText,
                    mode === 'login' && styles.tabTextActive,
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.tab, mode === 'register' && styles.tabActive]}
                onPress={() => setMode('register')}
              >
                <Text
                  style={[
                    styles.tabText,
                    mode === 'register' && styles.tabTextActive,
                  ]}
                >
                  Register
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.form}>
              {mode === 'register' && (
                <View style={styles.field}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Chukwuemeka Obi"
                    placeholderTextColor={COLORS.text3}
                    value={form.name}
                    onChangeText={(text) =>
                      setForm((prev) => ({ ...prev, name: text }))
                    }
                    autoCapitalize="words"
                  />
                </View>
              )}

              <View style={styles.field}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor={COLORS.text3}
                  value={form.email}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, email: text }))
                  }
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor={COLORS.text3}
                  value={form.password}
                  onChangeText={(text) =>
                    setForm((prev) => ({ ...prev, password: text }))
                  }
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                activeOpacity={0.85}
              >
                <Text style={styles.submitBtnText}>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Back link */}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <Text style={styles.backBtnText}>← Back to Hub</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 8,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 10,
  },
  flagRow: {
    flexDirection: 'row',
    width: 32,
    height: 18,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#c6e8d4',
  },
  flagStrip: {
    flex: 1,
  },
  logoText: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.g900,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#e6ece8',
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 11,
  },
  tabActive: {
    backgroundColor: COLORS.white,
    ...SHADOWS.sm,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text2,
  },
  tabTextActive: {
    color: COLORS.g900,
    fontWeight: '700',
  },
  form: {
    gap: 16,
  },
  field: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text1,
  },
  input: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 14,
    color: COLORS.text1,
  },
  submitBtn: {
    backgroundColor: COLORS.g700,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  backBtn: {
    alignItems: 'center',
    marginTop: 20,
    padding: 8,
  },
  backBtnText: {
    color: COLORS.g600,
    fontSize: 13,
    fontWeight: '600',
  },
});
