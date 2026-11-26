import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../services/theme';

export default function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search notes, subjects, or authors...',
  onSubmitEditing,
}) {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={18} color={COLORS.textMuted} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={onSubmitEditing}
        selectionColor={COLORS.primary}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value ? (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          hitSlop={10}
          accessibilityLabel="Clear search"
        >
          <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 48,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: 14,
    paddingVertical: 8,
  },
});
