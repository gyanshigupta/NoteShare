import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BrandLogo from '../components/BrandLogo';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from '../services/theme';

const HIGHLIGHTS = [
  {
    icon: 'library-outline',
    title: 'Curated by Subject & Semester',
    subtitle: 'Find structured PDFs tailored to your exact coursework.',
  },
  {
    icon: 'cloud-upload-outline',
    title: 'Share Your Study Guides',
    subtitle: 'Upload clean PDF notes and help classmates prepare faster.',
  },
  {
    icon: 'bookmark-outline',
    title: 'Save What Matters',
    subtitle: 'Bookmark top notes for quick revision before exams.',
  },
];

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          <BrandLogo size="lg" showTagline />

          <View style={styles.pill}>
            <Ionicons name="sparkles" size={14} color={COLORS.secondary} />
            <Text style={styles.pillText}>Built for modern students</Text>
          </View>

          <Text style={styles.headline}>Your Notes. Your Community.</Text>
          <Text style={styles.description}>
            Discover peer-reviewed lecture summaries, upload your own PDF study
            guides, and keep every semester organized in one calm dark workspace.
          </Text>
        </View>

        <View style={styles.highlightsCard}>
          {HIGHLIGHTS.map((item, index) => (
            <View
              key={item.title}
              style={[
                styles.highlightRow,
                index < HIGHLIGHTS.length - 1 && styles.highlightBorder,
              ]}
            >
              <View style={styles.highlightIcon}>
                <Ionicons name={item.icon} size={20} color={COLORS.secondary} />
              </View>
              <View style={styles.highlightTextWrap}>
                <Text style={styles.highlightTitle}>{item.title}</Text>
                <Text style={styles.highlightSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="Get Started"
            icon="arrow-forward"
            onPress={() => navigation.navigate('Signup')}
          />
          <PrimaryButton
            title="Login"
            variant="secondary"
            onPress={() => navigation.navigate('Login')}
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
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxl,
    gap: SPACING.xxl,
  },
  topSection: {
    gap: SPACING.lg,
  },
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.primaryMuted,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.35)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: SPACING.sm,
  },
  pillText: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '600',
  },
  headline: {
    ...TYPOGRAPHY.hero,
    fontSize: 36,
    lineHeight: 42,
  },
  description: {
    ...TYPOGRAPHY.body,
    fontSize: 15,
    lineHeight: 23,
  },
  highlightsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
  },
  highlightBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  highlightIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightTextWrap: {
    flex: 1,
  },
  highlightTitle: {
    color: COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  highlightSubtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  actions: {
    gap: SPACING.md,
  },
});
