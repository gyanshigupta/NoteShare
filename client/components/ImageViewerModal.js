import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING } from '../services/theme';

export default function ImageViewerModal({
  visible,
  images = [],
  initialIndex = 0,
  onClose,
}) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (!visible || images.length === 0) return;
    const clampedIndex = Math.max(0, Math.min(initialIndex, images.length - 1));
    setCurrentIndex(clampedIndex);

    const timer = setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: clampedIndex,
        animated: false,
      });
    }, 0);

    return () => clearTimeout(timer);
  }, [visible, initialIndex, images.length]);

  const goToIndex = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= images.length) return;
    setCurrentIndex(nextIndex);
    flatListRef.current?.scrollToIndex({
      index: nextIndex,
      animated: true,
    });
  };

  const handleMomentumEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / Math.max(width, 1));
    if (index >= 0 && index < images.length) {
      setCurrentIndex(index);
    }
  };

  const currentImage = images[currentIndex];
  const hasMultiple = images.length > 1;
  const topPadding = Math.max(insets.top, 16);
  const bottomPadding = Math.max(insets.bottom, 16);

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.topBar, { paddingTop: topPadding }]}>
          <View style={styles.titleMeta}>
            <Text style={styles.counterText}>
              {images.length > 0 ? `${currentIndex + 1} / ${images.length}` : ''}
            </Text>
            {currentImage?.fileName ? (
              <Text style={styles.fileNameText} numberOfLines={1}>
                {currentImage.fileName}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={styles.closeButton}
            accessibilityLabel="Close image viewer"
          >
            <Ionicons name="close" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => item.id || `${item.uri}-${index}`}
          onMomentumScrollEnd={handleMomentumEnd}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          renderItem={({ item }) => (
            <View style={[styles.slide, { width, height: height * 0.72 }]}>
              <Image
                source={{ uri: item.uri }}
                style={styles.fullImage}
                resizeMode="contain"
              />
            </View>
          )}
        />

        <View style={[styles.bottomBar, { paddingBottom: bottomPadding }]}>
          <TouchableOpacity
            onPress={() => goToIndex(currentIndex - 1)}
            disabled={!hasMultiple || currentIndex === 0}
            style={[
              styles.navButton,
              (!hasMultiple || currentIndex === 0) && styles.navButtonDisabled,
            ]}
          >
            <Ionicons
              name="chevron-back"
              size={18}
              color={COLORS.textPrimary}
            />
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>

          <View style={styles.dotsRow}>
            {images.map((item, idx) => (
              <View
                key={item.id || `${item.uri}-${idx}`}
                style={[
                  styles.dot,
                  idx === currentIndex && styles.dotActive,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={() => goToIndex(currentIndex + 1)}
            disabled={!hasMultiple || currentIndex === images.length - 1}
            style={[
              styles.navButton,
              (!hasMultiple || currentIndex === images.length - 1) &&
                styles.navButtonDisabled,
            ]}
          >
            <Text style={styles.navButtonText}>Next</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.md,
  },
  titleMeta: {
    flex: 1,
  },
  counterText: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '700',
  },
  fileNameText: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.md,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  navButtonDisabled: {
    opacity: 0.35,
  },
  navButtonText: {
    color: COLORS.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 1,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 16,
    backgroundColor: COLORS.primary,
  },
});
