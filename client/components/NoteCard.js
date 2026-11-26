import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../services/theme';

export default function NoteCard({
  note,
  isBookmarked,
  onToggleBookmark,
  onPress,
  compact = false,
}) {
  const isImages = note.fileType === 'images';
  const imageCount = note.images ? note.images.length : note.pages || 0;
  const initials = note.uploader
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.card, compact && styles.compactCard]}
    >
      <View style={styles.bodyContent}>
        <View style={styles.topRow}>
          <View style={styles.badgesRow}>
            <View style={styles.subjectBadge}>
              <Text style={styles.subjectText} numberOfLines={1}>
                {note.subject}
              </Text>
            </View>
            <View style={styles.semesterBadge}>
              <Text style={styles.semesterText}>{note.semester}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={onToggleBookmark}
            hitSlop={10}
            style={[
              styles.bookmarkButton,
              isBookmarked && styles.bookmarkButtonActive,
            ]}
            accessibilityLabel={
              isBookmarked ? 'Remove bookmark' : 'Bookmark note'
            }
          >
            <Ionicons
              name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
              size={18}
              color={isBookmarked ? COLORS.primary : COLORS.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {note.title}
        </Text>

        {!compact && note.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {note.description}
          </Text>
        ) : null}
      </View>

      <View>
        <View style={styles.divider} />

        <View style={styles.footer}>
          <View style={styles.uploaderRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials}</Text>
            </View>
            <View style={styles.uploaderMeta}>
              <Text style={styles.uploaderName} numberOfLines={1}>
                {note.uploader}
              </Text>
              <Text style={styles.uploadDate}>{note.uploadDate}</Text>
            </View>
          </View>

          <View style={styles.pdfPill}>
            <Ionicons
              name={isImages ? 'images-outline' : 'document-text-outline'}
              size={13}
              color={COLORS.secondary}
            />
            <Text style={styles.pdfText}>
              {isImages ? `${imageCount} img` : `${note.pages}p`}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    justifyContent: 'space-between',
  },
  compactCard: {
    width: 272,
    minHeight: 184,
  },
  bodyContent: {
    flexShrink: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  subjectBadge: {
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    maxWidth: 150,
  },
  subjectText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '700',
  },
  semesterBadge: {
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
  },
  semesterText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  bookmarkButton: {
    width: 34,
    height: 34,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkButtonActive: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: COLORS.primary,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
    lineHeight: 22,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  uploaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.secondary,
    fontSize: 11,
    fontWeight: '700',
  },
  uploaderMeta: {
    flex: 1,
  },
  uploaderName: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  uploadDate: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  pdfPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  pdfText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
});
