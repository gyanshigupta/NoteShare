import React, { useMemo, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ChipList from '../components/ChipList';
import EmptyState from '../components/EmptyState';
import NoteCard from '../components/NoteCard';
import SearchBar from '../components/SearchBar';
import { useApp } from '../services/AppContext';
import { SEMESTERS, SUBJECTS } from '../services/mockData';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../services/theme';

export default function ExploreScreen({ navigation }) {
  const { notes, bookmarkedIds, toggleBookmark } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [sortBy, setSortBy] = useState('recent');

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedSubject !== 'All' ||
    selectedSemester !== 'All';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSubject('All');
    setSelectedSemester('All');
  };

  const filteredAndSortedNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = notes.filter((note) => {
      const matchesSubject =
        selectedSubject === 'All' || note.subject === selectedSubject;
      const matchesSemester =
        selectedSemester === 'All' || note.semester === selectedSemester;
      const matchesQuery =
        !query ||
        note.title.toLowerCase().includes(query) ||
        note.description.toLowerCase().includes(query) ||
        note.subject.toLowerCase().includes(query) ||
        note.uploader.toLowerCase().includes(query);

      return matchesSubject && matchesSemester && matchesQuery;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'popular') {
        return b.popularityScore - a.popularityScore;
      }
      return b.uploadedAt - a.uploadedAt;
    });
  }, [notes, searchQuery, selectedSubject, selectedSemester, sortBy]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <FlatList
        data={filteredAndSortedNotes}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerBlock}>
            <View style={styles.sectionPadding}>
              <Text style={styles.screenTitle}>Explore Notes</Text>
              <Text style={styles.screenSubtitle}>
                Filter community study guides by subject, semester, and
                popularity.
              </Text>

              <View style={styles.searchWrap}>
                <SearchBar
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search title, topic, or author..."
                />
              </View>

              <Text style={styles.filterLabel}>Subject</Text>
            </View>

            <View style={styles.chipRow}>
              <ChipList
                items={SUBJECTS}
                selectedItem={selectedSubject}
                onSelect={setSelectedSubject}
                contentContainerStyle={styles.chipContentPadding}
              />
            </View>

            <View style={styles.sectionPadding}>
              <Text style={styles.filterLabel}>Semester</Text>
            </View>

            <View style={styles.chipRow}>
              <ChipList
                items={SEMESTERS}
                selectedItem={selectedSemester}
                onSelect={setSelectedSemester}
                contentContainerStyle={styles.chipContentPadding}
              />
            </View>

            <View style={styles.sectionPadding}>
              <View style={styles.sortToolbar}>
              <View style={styles.resultsRow}>
                <Text style={styles.resultsText}>
                  {filteredAndSortedNotes.length}{' '}
                  {filteredAndSortedNotes.length === 1 ? 'note' : 'notes'}
                </Text>
                {hasActiveFilters ? (
                  <TouchableOpacity onPress={resetFilters}>
                    <Text style={styles.clearLink}>Clear</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              <View style={styles.sortToggle}>
                <TouchableOpacity
                  onPress={() => setSortBy('recent')}
                  style={[
                    styles.sortPill,
                    sortBy === 'recent' && styles.sortPillActive,
                  ]}
                >
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={
                      sortBy === 'recent'
                        ? COLORS.textPrimary
                        : COLORS.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.sortText,
                      sortBy === 'recent' && styles.sortTextActive,
                    ]}
                  >
                    Recent
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSortBy('popular')}
                  style={[
                    styles.sortPill,
                    sortBy === 'popular' && styles.sortPillActive,
                  ]}
                >
                  <Ionicons
                    name="flame-outline"
                    size={14}
                    color={
                      sortBy === 'popular'
                        ? COLORS.textPrimary
                        : COLORS.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.sortText,
                      sortBy === 'popular' && styles.sortTextActive,
                    ]}
                  >
                    Popular
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            </View>
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
          <View style={styles.sectionPadding}>
            <EmptyState
              icon="folder-open-outline"
              title="No notes match your filters"
              subtitle="Try broadening your subject or semester selection."
              actionTitle="Reset Filters"
              onAction={resetFilters}
            />
          </View>
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
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  sectionPadding: {
    paddingHorizontal: SPACING.xl,
  },
  chipContentPadding: {
    paddingHorizontal: SPACING.xl,
  },
  headerBlock: {
    marginBottom: SPACING.md,
  },
  screenTitle: {
    ...TYPOGRAPHY.h1,
  },
  screenSubtitle: {
    ...TYPOGRAPHY.body,
    marginTop: 4,
    marginBottom: SPACING.lg,
  },
  searchWrap: {
    marginBottom: SPACING.lg,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
  chipRow: {
    marginBottom: SPACING.md,
  },
  sortToolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  resultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  resultsText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  clearLink: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '700',
  },
  sortToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 3,
    gap: 4,
  },
  sortPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.sm,
  },
  sortPillActive: {
    backgroundColor: COLORS.primary,
  },
  sortText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  sortTextActive: {
    color: COLORS.textPrimary,
  },
  cardWrap: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
});
