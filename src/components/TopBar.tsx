import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SHADOWS } from '../constants/theme';

interface TopBarProps {
  onOpenDrawer?: () => void;
  query?: string;
  setQuery?: (q: string) => void;
  placeholder?: string;
  showBack?: boolean;
}

export default function TopBar({
  onOpenDrawer,
  query = '',
  setQuery,
  placeholder = 'Search modules...',
  showBack = false,
}: TopBarProps) {
  return (
    <View style={styles.container}>
      {showBack ? (
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.back()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Go back"
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.text1} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={onOpenDrawer}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityLabel="Open menu"
        >
          <Ionicons name="menu-outline" size={24} color={COLORS.text1} />
        </TouchableOpacity>
      )}

      {/* Search Input Box */}
      <View style={styles.searchBox}>
        <Ionicons
          name="search-outline"
          size={18}
          color={COLORS.text3}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.text3}
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {query.length > 0 && Platform.OS !== 'ios' && (
          <TouchableOpacity onPress={() => setQuery?.('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={16} color={COLORS.text3} />
          </TouchableOpacity>
        )}
      </View>

      {/* User Avatar linking to Auth */}
      <TouchableOpacity
        style={styles.avatarBtn}
        onPress={() => router.push('/auth')}
        accessibilityLabel="User profile and login"
      >
        <Ionicons name="person-outline" size={20} color={COLORS.g700} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 12,
    ...SHADOWS.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bg,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text1,
    paddingVertical: Platform.OS === 'ios' ? 8 : 4,
  },
  clearBtn: {
    padding: 4,
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.g100,
    borderWidth: 1.5,
    borderColor: COLORS.g200,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
