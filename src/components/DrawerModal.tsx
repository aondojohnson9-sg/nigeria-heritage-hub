import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SHADOWS } from '../constants/theme';
import { MODULES, ModuleItem } from '../constants/data';

interface DrawerModalProps {
  visible: boolean;
  onClose: () => void;
  activeRoute?: string;
}

export default function DrawerModal({ visible, onClose, activeRoute }: DrawerModalProps) {
  const handleNavigate = (route: string) => {
    onClose();
    router.push(route as any);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.drawerContainer}>
          {/* Drawer Header with Nigerian Flag Strip */}
          <View style={styles.drawerHeader}>
            <View style={styles.flagRow}>
              <View style={[styles.flagStrip, { backgroundColor: COLORS.g700 }]} />
              <View style={[styles.flagStrip, { backgroundColor: COLORS.white }]} />
              <View style={[styles.flagStrip, { backgroundColor: COLORS.g700 }]} />
            </View>
            <Text style={styles.drawerTitle}>Nigeria Hub</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close" size={24} color={COLORS.text2} />
            </TouchableOpacity>
          </View>

          {/* Navigation Items */}
          <ScrollView style={styles.navScroll} showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.navItem,
                activeRoute === '/' && styles.navItemActive,
              ]}
              onPress={() => handleNavigate('/(tabs)')}
            >
              <Ionicons
                name="grid-outline"
                size={20}
                color={activeRoute === '/' ? COLORS.g700 : COLORS.text2}
                style={styles.navIcon}
              />
              <Text
                style={[
                  styles.navLabel,
                  activeRoute === '/' && styles.navLabelActive,
                ]}
              >
                Overview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navItem,
                activeRoute === '/loading' && styles.navItemActive,
              ]}
              onPress={() => handleNavigate('/loading')}
            >
              <Ionicons
                name="paw-outline"
                size={20}
                color={COLORS.gold}
                style={styles.navIcon}
              />
              <Text style={styles.navLabel}>
                Loading Screen
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navItem,
                activeRoute === '/onboarding' && styles.navItemActive,
              ]}
              onPress={() => handleNavigate('/onboarding')}
            >
              <Ionicons
                name="compass-outline"
                size={20}
                color={COLORS.g700}
                style={styles.navIcon}
              />
              <Text style={styles.navLabel}>
                History Journey (Onboarding)
              </Text>
            </TouchableOpacity>

            {MODULES.map((item: ModuleItem) => {
              const isActive = activeRoute === item.route;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.navItem,
                    isActive && styles.navItemActive,
                  ]}
                  onPress={() => handleNavigate(item.route)}
                >
                  <Ionicons
                    name={item.iconName as any}
                    size={20}
                    color={isActive ? COLORS.g700 : COLORS.text2}
                    style={styles.navIcon}
                  />
                  <Text
                    style={[
                      styles.navLabel,
                      isActive && styles.navLabelActive,
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* National Motto Quote */}
          <View style={styles.drawerQuote}>
            <Text style={styles.quoteMark}>“</Text>
            <Text style={styles.quoteText}>Unity and Faith, Peace and Progress</Text>
            <Text style={styles.quoteAuthor}>– National Motto</Text>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 20, 10, 0.45)',
  },
  drawerContainer: {
    width: '80%',
    maxWidth: 320,
    backgroundColor: COLORS.white,
    height: '100%',
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 20,
    ...SHADOWS.lg,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  flagRow: {
    flexDirection: 'row',
    width: 28,
    height: 18,
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#d1ded6',
    marginRight: 10,
  },
  flagStrip: {
    flex: 1,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text1,
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  navScroll: {
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    marginBottom: 6,
  },
  navItemActive: {
    backgroundColor: COLORS.g100,
  },
  navIcon: {
    marginRight: 14,
  },
  navLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.text2,
  },
  navLabelActive: {
    fontWeight: '700',
    color: COLORS.g700,
  },
  drawerQuote: {
    backgroundColor: COLORS.g50,
    borderWidth: 1,
    borderColor: COLORS.g200,
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
  },
  quoteMark: {
    fontSize: 24,
    color: COLORS.g500,
    lineHeight: 24,
    marginBottom: -4,
  },
  quoteText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.g900,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  quoteAuthor: {
    fontSize: 11,
    color: COLORS.text2,
    marginTop: 4,
  },
});
