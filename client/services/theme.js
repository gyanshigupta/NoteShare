export const COLORS = {
  background: '#0B0B0F',
  surface: '#17171F',
  surfaceElevated: '#1E1E28',
  primary: '#8B5CF6',
  primaryMuted: 'rgba(139, 92, 246, 0.16)',
  secondary: '#A78BFA',
  textPrimary: '#FFFFFF',
  textSecondary: '#9CA3AF',
  textMuted: '#6B7280',
  border: '#272734',
  borderFocused: '#8B5CF6',
  error: '#F87171',
  errorMuted: 'rgba(248, 113, 113, 0.14)',
  success: '#34D399',
  successMuted: 'rgba(52, 211, 153, 0.14)',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
};

export const TYPOGRAPHY = {
  hero: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.6,
    color: COLORS.textPrimary,
  },
  h1: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: COLORS.textPrimary,
  },
  h2: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
    color: COLORS.textPrimary,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.textSecondary,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    color: COLORS.textMuted,
  },
};
