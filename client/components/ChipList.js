import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../services/theme';

export default function ChipList({
  items,
  selectedItem,
  onSelect,
  horizontal = true,
  contentContainerStyle,
}) {
  const renderChips = () =>
    items.map((item) => {
      const isSelected = item === selectedItem;
      return (
        <TouchableOpacity
          key={item}
          activeOpacity={0.8}
          onPress={() => onSelect(item)}
          style={[styles.chip, isSelected && styles.chipSelected]}
        >
          <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
            {item}
          </Text>
        </TouchableOpacity>
      );
    });

  if (!horizontal) {
    return <View style={styles.wrapContainer}>{renderChips()}</View>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
    >
      {renderChips()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: 2,
  },
  wrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipSelected: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: COLORS.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  chipTextSelected: {
    color: COLORS.secondary,
  },
});
