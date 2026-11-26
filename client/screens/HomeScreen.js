import React, { useMemo, useState } from 'react';
import {
  ScrollView,
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
import { SUBJECTS } from '../services/mockData';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../services/theme';

export default function HomeScreen({ navigation }) {
  const { user, notes, bookmarkedIds, toggleBookmark } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return notes.filter((note) => {
      const matchesSubject =
        selectedSubject === 'All' || note.subject === selectedSubject;
      const matchesQuery =
        !query ||
        note.title.toLowerCase().includes(query) ||
        note.subject.toLowerCase().includes(query) ||
        note.uploader.toLowerCase().includes(query) ||
        note.semester.toLowerCase().includes(query);

      return matchesSubject && matchesQuery;
    });
  }, [notes, searchQuery, selectedSubject]);

  const popularNotes = useMemo(
    () =>
      [...filteredNotes]
        .sort((a, b) => b.popularityScore - a.popularityScore)
        .slice(0, 5),
    [filteredNotes]
  );

  const recentNotes = useMemo(
    () => [...filteredNotes].sort((a, b) => b.uploadedAt - a.uploadedAt),
    [filteredNotes]
  );

  const openNoteDetails = (noteId) => {
    navigation.navigate('NoteDetails', { noteId });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={styles.greetingWrap}>
            <Text style={styles.greeting}>Hey, Student!</Text>
            <Text style={styles.subGreeting}>
              Welcome back, {user.name.split(' ')[0]}. Ready to study?
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Profile')}
            style={styles.settingsButton}
            activeOpacity={0.8}
            accessibilityLabel="Open profile settings"
          >
            <Ionicons
              name="settings-outline"
              size={20}
              color={COLORS.secondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search notes, subjects, or uploaders..."
          />
        </View>

        <View style={styles.chipsSection}>
          <ChipList
            items={SUBJECTS}
            selectedItem={selectedSubject}
            onSelect={setSelectedSubject}
            contentContainerStyle={styles.horizontalEdgePadding}
          />
        </View>

        {filteredNotes.length === 0 ? (
          <View style={styles.sectionPadding}>
            <EmptyState
              icon="search-outline"
              title="No matching notes"
              subtitle="Try clearing your search or choosing a different subject."
              actionTitle="Reset Filters"
              onAction={() => {
                setSearchQuery('');
                setSelectedSubject('All');
              }}
            />
          </View>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons
                  name="flame-outline"
                  size={18}
                  color={COLORS.secondary}
                />
                <Text style={styles.sectionTitle}>Popular Notes</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('Explore')}
                hitSlop={8}
              >
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              decelerationRate="fast"
              contentContainerStyle={styles.horizontalList}
            >
              {popularNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  compact
                  isBookmarked={bookmarkedIds.includes(note.id)}
                  onToggleBookmark={() => toggleBookmark(note.id)}
                  onPress={() => openNoteDetails(note.id)}
                />
              ))}
            </ScrollView>

            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons
                  name="time-outline"
                  size={18}
                  color={COLORS.secondary}
                />
                <Text style={styles.sectionTitle}>Recently Uploaded</Text>
              </View>
              <Text style={styles.countText}>{recentNotes.length} notes</Text>
            </View>

            <View style={styles.verticalList}>
              {recentNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  isBookmarked={bookmarkedIds.includes(note.id)}
                  onToggleBookmark={() => toggleBookmark(note.id)}
                  onPress={() => openNoteDetails(note.id)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  sectionPadding: {
    paddingHorizontal: SPACING.xl,
  },
  horizontalEdgePadding: {
    paddingHorizontal: SPACING.xl,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  greetingWrap: {
    flex: 1,
  },
  greeting: {
    ...TYPOGRAPHY.h1,
  },
  subGreeting: {
    ...TYPOGRAPHY.body,
    marginTop: 4,
  },
  settingsButton: {
    width: 42,
    height: 42,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  chipsSection: {
    marginBottom: SPACING.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sectionTitle: {
    ...TYPOGRAPHY.h2,
    fontSize: 18,
  },
  seeAll: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '600',
  },
  countText: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  horizontalList: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xxl,
    gap: SPACING.md,
  },
  verticalList: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
});
