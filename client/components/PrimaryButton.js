import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../services/theme';

export default function PrimaryButton({
  title,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
  style,
}) {
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        isSecondary && styles.secondaryButton,
        isDanger && styles.dangerButton,
        disabled && styles.disabledButton,
        style,
      ]}
    >
      <View style={styles.content}>
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={
              isSecondary
                ? COLORS.textPrimary
                : isDanger
                ? COLORS.error
                : COLORS.textPrimary
            }
          />
        ) : null}
        <Text
          style={[
            styles.label,
            isSecondary && styles.secondaryLabel,
            isDanger && styles.dangerLabel,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingVertical: 15,
    paddingHorizontal: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
  },
  dangerButton: {
    backgroundColor: COLORS.errorMuted,
    borderColor: 'rgba(248, 113, 113, 0.3)',
  },
  disabledButton: {
    opacity: 0.55,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  label: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  secondaryLabel: {
    color: COLORS.textPrimary,
  },
  dangerLabel: {
    color: COLORS.error,
  },
});
