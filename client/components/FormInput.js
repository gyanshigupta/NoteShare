import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../services/theme';

export default function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  error,
  secureTextEntry = false,
  multiline = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoCorrect = true,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const shouldHideText = secureTextEntry && !isPasswordVisible;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View
        style={[
          styles.inputContainer,
          multiline && styles.multilineContainer,
          isFocused && styles.inputFocused,
          Boolean(error) && styles.inputError,
        ]}
      >
        {icon ? (
          <Ionicons
            name={icon}
            size={18}
            color={
              error
                ? COLORS.error
                : isFocused
                ? COLORS.secondary
                : COLORS.textMuted
            }
            style={[styles.leftIcon, multiline && styles.leftIconMultiline]}
          />
        ) : null}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          secureTextEntry={shouldHideText}
          multiline={multiline}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[styles.input, multiline && styles.multilineInput]}
          selectionColor={COLORS.primary}
        />

        {secureTextEntry ? (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible((prev) => !prev)}
            hitSlop={10}
            style={styles.eyeButton}
            accessibilityLabel={
              isPasswordVisible ? 'Hide password' : 'Show password'
            }
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {error ? (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle-outline" size={14} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    minHeight: 50,
  },
  multilineContainer: {
    alignItems: 'flex-start',
    paddingVertical: SPACING.md,
    minHeight: 112,
  },
  inputFocused: {
    borderColor: COLORS.borderFocused,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  leftIcon: {
    marginRight: SPACING.sm,
  },
  leftIconMultiline: {
    marginTop: 2,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 15,
    paddingVertical: 12,
  },
  multilineInput: {
    paddingVertical: 0,
    minHeight: 86,
    textAlignVertical: 'top',
  },
  eyeButton: {
    paddingLeft: SPACING.sm,
    paddingVertical: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: '500',
  },
});
