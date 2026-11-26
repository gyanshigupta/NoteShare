import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../services/theme';

export default function BrandLogo({ size = 'md', showTagline = false }) {
  const isLarge = size === 'lg';

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={[styles.badge, isLarge && styles.badgeLarge]}>
          <Ionicons
            name="documents"
            size={isLarge ? 26 : 20}
            color={COLORS.textPrimary}
          />
        </View>
        <View>
          <Text style={[styles.wordmark, isLarge && styles.wordmarkLarge]}>
            Note<Text style={styles.accent}>Share</Text>
          </Text>
          {showTagline ? (
            <Text style={styles.tagline}>Campus Study Hub</Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  badge: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLarge: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.lg,
  },
  wordmark: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.4,
    color: COLORS.textPrimary,
  },
  wordmarkLarge: {
    fontSize: 28,
  },
  accent: {
    color: COLORS.secondary,
  },
  tagline: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});
