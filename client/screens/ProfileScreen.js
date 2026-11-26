import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import EmptyState from '../components/EmptyState';
import NoteCard from '../components/NoteCard';
import PrimaryButton from '../components/PrimaryButton';
import { useApp } from '../services/AppContext';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../services/theme';

export default function ProfileScreen({ navigation }) {
  const {
    user,
    myUploads,
    bookmarkedNotes,
    bookmarkedIds,
    toggleBookmark,
    logout,
  } = useApp();
  const [activeTab, setActiveTab] = useState('uploads');

  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const displayedNotes =
    activeTab === 'uploads' ? myUploads : bookmarkedNotes;

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out of NoteShare?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Profile</Text>

        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials || 'ST'}</Text>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <View style={styles.metaPill}>
                <Ionicons
                  name="school-outline"
                  size={13}
                  color={COLORS.secondary}
                />
                <Text style={styles.metaText}>
                  {user.major} • {user.semester}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{myUploads.length}</Text>
              <Text style={styles.statLabel}>My Uploads</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{bookmarkedNotes.length}</Text>
              <Text style={styles.statLabel}>Saved Notes</Text>
            </View>
          </View>
        </View>

        <View style={styles.segmentedControl}>
          <TouchableOpacity
            onPress={() => setActiveTab('uploads')}
            style={[
              styles.segmentButton,
              activeTab === 'uploads' && styles.segmentButtonActive,
            ]}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={16}
              color={
                activeTab === 'uploads'
                  ? COLORS.textPrimary
                  : COLORS.textSecondary
              }
            />
            <Text
              style={[
                styles.segmentText,
                activeTab === 'uploads' && styles.segmentTextActive,
              ]}
            >
              My Uploads ({myUploads.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('saved')}
            style={[
              styles.segmentButton,
              activeTab === 'saved' && styles.segmentButtonActive,
            ]}
          >
            <Ionicons
              name="bookmark-outline"
              size={16}
              color={
                activeTab === 'saved'
                  ? COLORS.textPrimary
                  : COLORS.textSecondary
              }
            />
            <Text
              style={[
                styles.segmentText,
                activeTab === 'saved' && styles.segmentTextActive,
              ]}
            >
              Saved Notes ({bookmarkedNotes.length})
            </Text>
          </TouchableOpacity>
        </View>

        {displayedNotes.length === 0 ? (
          activeTab === 'uploads' ? (
            <EmptyState
              icon="cloud-upload-outline"
              title="No uploads yet"
              subtitle="Share your first PDF study guide with the NoteShare community."
              actionTitle="Upload Notes"
              onAction={() => navigation.navigate('Upload')}
            />
          ) : (
            <EmptyState
              icon="bookmark-outline"
              title="No saved notes"
              subtitle="Bookmark notes while browsing to keep them in your library."
              actionTitle="Explore Notes"
              onAction={() => navigation.navigate('Explore')}
            />
          )
        ) : (
          <View style={styles.notesList}>
            {displayedNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isBookmarked={bookmarkedIds.includes(note.id)}
                onToggleBookmark={() => toggleBookmark(note.id)}
                onPress={() =>
                  navigation.navigate('NoteDetails', { noteId: note.id })
                }
              />
            ))}
          </View>
        )}

        <View style={styles.logoutSection}>
          <PrimaryButton
            title="Log Out"
            icon="log-out-outline"
            variant="danger"
            onPress={handleLogout}
          />
        </View>
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
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  screenTitle: {
    ...TYPOGRAPHY.h1,
    marginBottom: SPACING.lg,
  },
  profileCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primaryMuted,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.secondary,
    fontSize: 20,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: COLORS.textPrimary,
    fontSize: 19,
    fontWeight: '700',
  },
  userEmail: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginTop: 2,
    marginBottom: 8,
  },
  metaPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  metaText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surfaceElevated,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: SPACING.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: COLORS.border,
  },
  statValue: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 4,
    gap: 4,
    marginBottom: SPACING.lg,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: RADIUS.sm,
  },
  segmentButtonActive: {
    backgroundColor: COLORS.primary,
  },
  segmentText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: COLORS.textPrimary,
  },
  notesList: {
    gap: SPACING.md,
  },
  logoutSection: {
    marginTop: SPACING.xxl,
  },
});
