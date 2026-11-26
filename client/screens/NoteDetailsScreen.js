import React, { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ImageViewerModal from '../components/ImageViewerModal';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../services/AppContext';
import { formatFileSize, openPdfDocument } from '../services/fileService';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../services/theme';

export default function NoteDetailsScreen({ route, navigation }) {
  const { noteId } = route.params;
  const { notes, bookmarkedIds, toggleBookmark } = useApp();
  const [isOpeningPdf, setIsOpeningPdf] = useState(false);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const note = notes.find((item) => item.id === noteId);

  if (!note) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.missingContainer}>
          <Text style={styles.missingTitle}>Note not found</Text>
          <PrimaryButton title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  const isImagesNote = note.fileType === 'images' && note.images?.length > 0;
  const isBookmarked = bookmarkedIds.includes(note.id);
  const initials = note.uploader
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleOpenPdf = async () => {
    setIsOpeningPdf(true);
    try {
      await openPdfDocument(note);
    } catch (error) {
      Alert.alert(
        'Cannot Open PDF',
        error?.message ||
          'No compatible PDF viewer was found on this device.'
      );
    } finally {
      setIsOpeningPdf(false);
    }
  };

  const openImageAtIndex = (index) => {
    setViewerIndex(index);
    setViewerVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
          accessibilityLabel="Back"
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Note Details</Text>

        <TouchableOpacity
          onPress={() => toggleBookmark(note.id)}
          style={[
            styles.iconButton,
            isBookmarked && styles.iconButtonActive,
          ]}
          accessibilityLabel={
            isBookmarked ? 'Remove bookmark' : 'Bookmark note'
          }
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={isBookmarked ? COLORS.primary : COLORS.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.badgesRow}>
          <View style={styles.subjectBadge}>
            <Text style={styles.subjectText}>{note.subject}</Text>
          </View>
          <View style={styles.semesterBadge}>
            <Text style={styles.semesterText}>{note.semester}</Text>
          </View>
        </View>

        <Text style={styles.title}>{note.title}</Text>

        <View style={styles.uploaderCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.uploaderInfo}>
            <Text style={styles.uploaderName}>{note.uploader}</Text>
            <Text style={styles.uploadDate}>Uploaded {note.uploadDate}</Text>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <Text style={styles.sectionLabel}>Description</Text>
          <Text style={styles.description}>{note.description}</Text>
        </View>

        {isImagesNote ? (
          <View style={styles.sectionCard}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionLabel}>
                Attached Images ({note.images.length})
              </Text>
              <Text style={styles.sectionMetaText}>{note.fileSize}</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imagesList}
            >
              {note.images.map((img, index) => (
                <TouchableOpacity
                  key={img.id || `${img.uri}-${index}`}
                  activeOpacity={0.85}
                  onPress={() => openImageAtIndex(index)}
                  style={styles.imageThumbCard}
                >
                  <View style={styles.imageThumbWrap}>
                    <Image
                      source={{ uri: img.uri }}
                      style={styles.imageThumb}
                    />
                    <View style={styles.imageIndexBadge}>
                      <Text style={styles.imageIndexText}>
                        {index + 1}/{note.images.length}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.imageFileName} numberOfLines={1}>
                    {img.fileName}
                  </Text>
                  {img.fileSize > 0 ? (
                    <Text style={styles.imageFileSize}>
                      {formatFileSize(img.fileSize)}
                    </Text>
                  ) : null}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionLabel}>Document Info</Text>

            <View style={styles.fileRow}>
              <View style={styles.fileIconBox}>
                <Ionicons
                  name="document-text"
                  size={22}
                  color={COLORS.secondary}
                />
              </View>
              <View style={styles.fileTextWrap}>
                <Text style={styles.fileName} numberOfLines={1}>
                  {note.fileName}
                </Text>
                <Text style={styles.fileMeta}>
                  PDF • {note.fileSize} • {note.pages} pages
                </Text>
              </View>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Ionicons
                  name="download-outline"
                  size={16}
                  color={COLORS.secondary}
                />
                <Text style={styles.statValue}>{note.downloads}</Text>
                <Text style={styles.statLabel}>Downloads</Text>
              </View>
              <View style={styles.statBox}>
                <Ionicons
                  name="flame-outline"
                  size={16}
                  color={COLORS.secondary}
                />
                <Text style={styles.statValue}>{note.popularityScore}</Text>
                <Text style={styles.statLabel}>Popularity</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          onPress={() => toggleBookmark(note.id)}
          style={[
            styles.bookmarkAction,
            isBookmarked && styles.bookmarkActionActive,
          ]}
        >
          <Ionicons
            name={isBookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={isBookmarked ? COLORS.primary : COLORS.textPrimary}
          />
        </TouchableOpacity>

        {isImagesNote ? (
          <PrimaryButton
            title={`View Images (${note.images.length})`}
            icon="images-outline"
            onPress={() => openImageAtIndex(0)}
            style={styles.previewButton}
          />
        ) : (
          <PrimaryButton
            title={isOpeningPdf ? 'Opening PDF...' : 'Open PDF'}
            icon="document-outline"
            disabled={isOpeningPdf}
            onPress={handleOpenPdf}
            style={styles.previewButton}
          />
        )}
      </View>

      {isImagesNote ? (
        <ImageViewerModal
          visible={viewerVisible}
          images={note.images}
          initialIndex={viewerIndex}
          onClose={() => setViewerVisible(false)}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonActive: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: COLORS.primary,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  subjectBadge: {
    backgroundColor: COLORS.primaryMuted,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  subjectText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  semesterBadge: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: RADIUS.full,
  },
  semesterText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    ...TYPOGRAPHY.h1,
    fontSize: 24,
    lineHeight: 31,
    marginBottom: SPACING.lg,
  },
  uploaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '700',
  },
  uploaderInfo: {
    flex: 1,
  },
  uploaderName: {
    color: COLORS.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  uploadDate: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  sectionMetaText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  description: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
    lineHeight: 22,
  },
  imagesList: {
    gap: SPACING.md,
  },
  imageThumbCard: {
    width: 132,
  },
  imageThumbWrap: {
    position: 'relative',
  },
  imageThumb: {
    width: 132,
    height: 164,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageIndexBadge: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    backgroundColor: 'rgba(11, 11, 15, 0.82)',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  imageIndexText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  imageFileName: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  imageFileSize: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  fileIconBox: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileTextWrap: {
    flex: 1,
  },
  fileName: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  fileMeta: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.md,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  bookmarkAction: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookmarkActionActive: {
    backgroundColor: COLORS.primaryMuted,
    borderColor: COLORS.primary,
  },
  previewButton: {
    flex: 1,
  },
  missingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
    gap: SPACING.lg,
  },
  missingTitle: {
    ...TYPOGRAPHY.h2,
  },
});
