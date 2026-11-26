import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '../components/EmptyState';
import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import { useApp } from '../services/AppContext';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../services/theme';

export default function BookmarksScreen({ navigation }) {
  const { bookmarkedNotes, bookmarkedIds, toggleBookmark } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookmarks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return bookmarkedNotes;
    return bookmarkedNotes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.subject.toLowerCase().includes(query) ||
        note.uploader.toLowerCase().includes(query)
    );
  }, [bookmarkedNotes, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={filteredBookmarks}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={styles.titleRow}>
              <Text style={styles.screenTitle}>Bookmarks</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>
                  {bookmarkedNotes.length}
                </Text>
              </View>
            </View>
            <Text style={styles.screenSubtitle}>
              Your saved study notes, ready whenever you need to revise.
            </Text>

            {bookmarkedNotes.length > 0 ? (
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search saved notes..."
              />
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <NoteCard
              note={item}
              isBookmarked={bookmarkedIds.includes(item.id)}
              onToggleBookmark={() => toggleBookmark(item.id)}
              onPress={() =>
                navigation.navigate('NoteDetails', { noteId: item.id })
              }
            />
          </View>
        )}
        ListEmptyComponent={
          bookmarkedNotes.length === 0 ? (
            <EmptyState
              icon="bookmark-outline"
              title="No saved notes yet"
              subtitle="Tap the bookmark icon on any note card to save it here for fast access."
              actionTitle="Explore Notes"
              onAction={() => navigation.navigate('Explore')}
            />
          ) : (
            <EmptyState
              icon="search-outline"
              title="No matching bookmarks"
              subtitle="Try a different search keyword."
              actionTitle="Clear Search"
              onAction={() => setSearchQuery('')}
            />
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  headerBlock: {
    marginBottom: SPACING.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  screenTitle: {
    ...TYPOGRAPHY.h1,
  },
  countBadge: {
    backgroundColor: COLORS.primaryMuted,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  countBadgeText: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '700',
  },
  screenSubtitle: {
    ...TYPOGRAPHY.body,
    marginTop: 4,
    marginBottom: SPACING.lg,
  },
  cardWrap: {
    marginBottom: SPACING.md,
  },
});
