import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import ChipList from '../components/ChipList';
import FormInput from '../components/FormInput';
import ImageViewerModal from '../components/ImageViewerModal';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../services/AppContext';
import { formatFileSize, openPdfDocument } from '../services/fileService';
import { UPLOAD_SEMESTERS, UPLOAD_SUBJECTS } from '../services/mockData';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../services/theme';

const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/jpg', 'image/png'];
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

function isSupportedImageAsset(asset) {
  const mime = (asset.mimeType || '').toLowerCase();
  const name = (asset.fileName || asset.uri || '').toLowerCase();

  if (mime) {
    return ALLOWED_IMAGE_MIMES.includes(mime);
  }
  if (name.includes('.')) {
    return ALLOWED_IMAGE_EXTENSIONS.some((ext) => name.endsWith(ext));
  }
  return true;
}

export default function UploadScreen({ navigation }) {
  const { addNote } = useApp();
  const [uploadType, setUploadType] = useState('pdf');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [errors, setErrors] = useState({});

  const handleSwitchUploadType = (nextType) => {
    setUploadType(nextType);
    if (errors.attachment) {
      setErrors((prev) => ({ ...prev, attachment: '' }));
    }
  };

  const handlePickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const picked = result.assets[0];
        setSelectedPdf(picked);
        if (errors.attachment) {
          setErrors((prev) => ({ ...prev, attachment: '' }));
        }
      }
    } catch {
      Alert.alert(
        'Could not open file picker',
        'Please try selecting a PDF document again.'
      );
    }
  };

  const handlePreviewSelectedPdf = async () => {
    if (!selectedPdf?.uri) return;
    try {
      await openPdfDocument({
        id: 'draft-pdf',
        title: title.trim() || selectedPdf.name,
        fileName: selectedPdf.name,
        fileUri: selectedPdf.uri,
      });
    } catch (error) {
      Alert.alert(
        'Cannot Open PDF',
        error?.message || 'No compatible PDF viewer was found on this device.'
      );
    }
  };

  const handlePickImages = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to attach images of your notes.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsMultipleSelection: true,
        orderedSelection: true,
        quality: 0.9,
        preferredAssetRepresentationMode:
          ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Compatible,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const validAssets = result.assets.filter(isSupportedImageAsset);
      const skippedCount = result.assets.length - validAssets.length;

      if (skippedCount > 0) {
        Alert.alert(
          'Unsupported Format Skipped',
          'Only JPG, JPEG, and PNG images are supported.'
        );
      }

      if (validAssets.length === 0) return;

      setSelectedImages((prev) => {
        const existingUris = new Set(prev.map((item) => item.uri));
        const nextItems = validAssets
          .filter((asset) => !existingUris.has(asset.uri))
          .map((asset, index) => {
            const fallbackName =
              asset.uri.split('/').pop() ||
              `note_image_${prev.length + index + 1}.jpg`;
            return {
              id: `${asset.assetId || asset.uri}-${Date.now()}-${index}`,
              uri: asset.uri,
              fileName: asset.fileName || fallbackName,
              mimeType: asset.mimeType || 'image/jpeg',
              fileSize: asset.fileSize || 0,
              width: asset.width || 0,
              height: asset.height || 0,
            };
          });
        return [...prev, ...nextItems];
      });

      if (errors.attachment) {
        setErrors((prev) => ({ ...prev, attachment: '' }));
      }
    } catch {
      Alert.alert(
        'Could not open image picker',
        'Please try selecting images again.'
      );
    }
  };

  const handleRemoveImage = (imageId) => {
    setSelectedImages((prev) => prev.filter((item) => item.id !== imageId));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (uploadType === 'pdf' && !selectedPdf) {
      nextErrors.attachment = 'Please select a PDF file to upload.';
    }
    if (uploadType === 'images' && selectedImages.length === 0) {
      nextErrors.attachment = 'Please select at least one JPG or PNG image.';
    }
    if (!title.trim()) {
      nextErrors.title = 'Note title is required.';
    } else if (title.trim().length < 4) {
      nextErrors.title = 'Title must be at least 4 characters.';
    }
    if (!description.trim()) {
      nextErrors.description = 'A brief description is required.';
    } else if (description.trim().length < 10) {
      nextErrors.description = 'Description must be at least 10 characters.';
    }
    if (!subject) {
      nextErrors.subject = 'Please choose a subject.';
    }
    if (!semester) {
      nextErrors.semester = 'Please choose a semester.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSubject('');
    setSemester('');
    setSelectedPdf(null);
    setSelectedImages([]);
    setErrors({});
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const createdNote = addNote({
      title,
      description,
      subject,
      semester,
      fileType: uploadType,
      file: uploadType === 'pdf' ? selectedPdf : null,
      images: uploadType === 'images' ? selectedImages : [],
    });

    resetForm();

    Alert.alert(
      'Notes Added!',
      `"${createdNote.title}" is now saved locally and visible in Home, Explore, and your Profile uploads.`,
      [
        { text: 'Upload Another', style: 'cancel' },
        {
          text: 'View Note',
          onPress: () =>
            navigation.navigate('NoteDetails', { noteId: createdNote.id }),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.screenTitle}>Upload Notes</Text>
          <Text style={styles.screenSubtitle}>
            Share a PDF document or photos of handwritten notes with your
            classmates.
          </Text>

          <View style={styles.typeToggleCard}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleSwitchUploadType('pdf')}
              style={[
                styles.typeOption,
                uploadType === 'pdf' && styles.typeOptionActive,
              ]}
            >
              <Ionicons
                name="document-text-outline"
                size={18}
                color={
                  uploadType === 'pdf'
                    ? COLORS.textPrimary
                    : COLORS.textSecondary
                }
              />
              <Text
                style={[
                  styles.typeOptionText,
                  uploadType === 'pdf' && styles.typeOptionTextActive,
                ]}
              >
                Upload PDF
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleSwitchUploadType('images')}
              style={[
                styles.typeOption,
                uploadType === 'images' && styles.typeOptionActive,
              ]}
            >
              <Ionicons
                name="images-outline"
                size={18}
                color={
                  uploadType === 'images'
                    ? COLORS.textPrimary
                    : COLORS.textSecondary
                }
              />
              <Text
                style={[
                  styles.typeOptionText,
                  uploadType === 'images' && styles.typeOptionTextActive,
                ]}
              >
                Upload Images
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.fieldLabel}>
              {uploadType === 'pdf' ? 'PDF Document' : 'Note Images (JPG / PNG)'}
            </Text>

            {uploadType === 'pdf' ? (
              selectedPdf ? (
                <View style={styles.selectedFileCard}>
                  <View style={styles.fileIconBox}>
                    <Ionicons
                      name="document-text"
                      size={22}
                      color={COLORS.secondary}
                    />
                  </View>
                  <View style={styles.fileDetails}>
                    <Text style={styles.fileName} numberOfLines={1}>
                      {selectedPdf.name}
                    </Text>
                    <Text style={styles.fileMeta}>
                      {selectedPdf.size
                        ? formatFileSize(selectedPdf.size)
                        : 'PDF Document'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={handlePreviewSelectedPdf}
                    style={styles.smallActionButton}
                  >
                    <Text style={styles.smallActionText}>Open</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handlePickPdf}
                    style={styles.smallActionButton}
                  >
                    <Text style={styles.smallActionText}>Change</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setSelectedPdf(null)}
                    hitSlop={8}
                    accessibilityLabel="Remove selected PDF"
                  >
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={COLORS.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={handlePickPdf}
                  style={[
                    styles.uploadBox,
                    Boolean(errors.attachment) && styles.uploadBoxError,
                  ]}
                >
                  <View style={styles.uploadIconCircle}>
                    <Ionicons
                      name="cloud-upload-outline"
                      size={26}
                      color={COLORS.secondary}
                    />
                  </View>
                  <Text style={styles.uploadTitle}>Select PDF Document</Text>
                  <Text style={styles.uploadHint}>
                    Tap to choose a .pdf file from your device
                  </Text>
                </TouchableOpacity>
              )
            ) : selectedImages.length > 0 ? (
              <View style={styles.imagesContainerCard}>
                <View style={styles.imagesHeaderRow}>
                  <Text style={styles.imagesCountText}>
                    {selectedImages.length}{' '}
                    {selectedImages.length === 1
                      ? 'image selected'
                      : 'images selected'}
                  </Text>
                  <TouchableOpacity
                    onPress={handlePickImages}
                    style={styles.addMoreButton}
                  >
                    <Ionicons
                      name="add"
                      size={16}
                      color={COLORS.secondary}
                    />
                    <Text style={styles.addMoreText}>Add More</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.thumbnailsRow}
                >
                  {selectedImages.map((img, index) => (
                    <View key={img.id} style={styles.thumbnailCard}>
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => {
                          setViewerIndex(index);
                          setViewerVisible(true);
                        }}
                      >
                        <Image
                          source={{ uri: img.uri }}
                          style={styles.thumbnailImage}
                        />
                        <View style={styles.pageTag}>
                          <Text style={styles.pageTagText}>{index + 1}</Text>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleRemoveImage(img.id)}
                        style={styles.removeImageButton}
                        hitSlop={8}
                        accessibilityLabel={`Remove ${img.fileName}`}
                      >
                        <Ionicons
                          name="close-circle"
                          size={22}
                          color={COLORS.error}
                        />
                      </TouchableOpacity>

                      <Text style={styles.thumbFileName} numberOfLines={1}>
                        {img.fileName}
                      </Text>
                      {img.fileSize > 0 ? (
                        <Text style={styles.thumbFileSize}>
                          {formatFileSize(img.fileSize)}
                        </Text>
                      ) : null}
                    </View>
                  ))}
                </ScrollView>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.82}
                onPress={handlePickImages}
                style={[
                  styles.uploadBox,
                  Boolean(errors.attachment) && styles.uploadBoxError,
                ]}
              >
                <View style={styles.uploadIconCircle}>
                  <Ionicons
                    name="images-outline"
                    size={26}
                    color={COLORS.secondary}
                  />
                </View>
                <Text style={styles.uploadTitle}>Select Note Photos</Text>
                <Text style={styles.uploadHint}>
                  Pick multiple JPG, JPEG, or PNG images of handwritten notes or
                  diagrams
                </Text>
              </TouchableOpacity>
            )}

            {errors.attachment ? (
              <View style={styles.errorRow}>
                <Ionicons
                  name="alert-circle-outline"
                  size={14}
                  color={COLORS.error}
                />
                <Text style={styles.errorText}>{errors.attachment}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.formCard}>
            <FormInput
              label="Title"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: '' }));
                }
              }}
              placeholder="e.g., Operating Systems Midterm Summary"
              icon="create-outline"
              error={errors.title}
            />

            <FormInput
              label="Description"
              value={description}
              onChangeText={(text) => {
                setDescription(text);
                if (errors.description) {
                  setErrors((prev) => ({ ...prev, description: '' }));
                }
              }}
              placeholder="Briefly describe topics, chapters, or exam coverage..."
              icon="reader-outline"
              multiline
              error={errors.description}
            />

            <View style={styles.selectorGroup}>
              <Text style={styles.fieldLabel}>Subject</Text>
              <ChipList
                items={UPLOAD_SUBJECTS}
                selectedItem={subject}
                horizontal={false}
                onSelect={(value) => {
                  setSubject(value);
                  if (errors.subject) {
                    setErrors((prev) => ({ ...prev, subject: '' }));
                  }
                }}
              />
              {errors.subject ? (
                <View style={styles.errorRow}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={14}
                    color={COLORS.error}
                  />
                  <Text style={styles.errorText}>{errors.subject}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.selectorGroup}>
              <Text style={styles.fieldLabel}>Semester</Text>
              <ChipList
                items={UPLOAD_SEMESTERS}
                selectedItem={semester}
                horizontal={false}
                onSelect={(value) => {
                  setSemester(value);
                  if (errors.semester) {
                    setErrors((prev) => ({ ...prev, semester: '' }));
                  }
                }}
              />
              {errors.semester ? (
                <View style={styles.errorRow}>
                  <Ionicons
                    name="alert-circle-outline"
                    size={14}
                    color={COLORS.error}
                  />
                  <Text style={styles.errorText}>{errors.semester}</Text>
                </View>
              ) : null}
            </View>

            <PrimaryButton
              title="Publish Note"
              icon="checkmark-circle-outline"
              onPress={handleSubmit}
              style={styles.submitButton}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <ImageViewerModal
        visible={viewerVisible}
        images={selectedImages}
        initialIndex={viewerIndex}
        onClose={() => setViewerVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  screenTitle: {
    ...TYPOGRAPHY.h1,
  },
  screenSubtitle: {
    ...TYPOGRAPHY.body,
    marginTop: 4,
    marginBottom: SPACING.xl,
  },
  typeToggleCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
    gap: 4,
    marginBottom: SPACING.lg,
  },
  typeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: 11,
    borderRadius: RADIUS.md,
  },
  typeOptionActive: {
    backgroundColor: COLORS.primary,
  },
  typeOptionText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  typeOptionTextActive: {
    color: COLORS.textPrimary,
    fontWeight: '700',
  },
  sectionBlock: {
    marginBottom: SPACING.lg,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  uploadBox: {
    backgroundColor: COLORS.surface,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
  },
  uploadBoxError: {
    borderColor: COLORS.error,
  },
  uploadIconCircle: {
    width: 54,
    height: 54,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  uploadTitle: {
    color: COLORS.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  uploadHint: {
    color: COLORS.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  selectedFileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  fileIconBox: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileDetails: {
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
  smallActionButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  smallActionText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  imagesContainerCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
  },
  imagesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  imagesCountText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  addMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.primaryMuted,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addMoreText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '700',
  },
  thumbnailsRow: {
    gap: SPACING.md,
    paddingVertical: 2,
  },
  thumbnailCard: {
    width: 118,
  },
  thumbnailImage: {
    width: 118,
    height: 142,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pageTag: {
    position: 'absolute',
    left: 6,
    bottom: 6,
    backgroundColor: 'rgba(11, 11, 15, 0.82)',
    borderRadius: RADIUS.sm,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  pageTagText: {
    color: COLORS.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.full,
  },
  thumbFileName: {
    color: COLORS.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  thumbFileSize: {
    color: COLORS.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
  },
  selectorGroup: {
    marginBottom: SPACING.lg,
  },
  submitButton: {
    marginTop: SPACING.xs,
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
