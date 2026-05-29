// ============================================================
// src/theme/index.ts  —  Complete theme system
// ============================================================

export const DARK = {
  // Backgrounds
  bg:       '#08080F',
  surface1: '#0D0E18',
  surface2: '#111220',
  surface3: '#161728',
  surface4: '#1C1D2E',
  surface5: '#222336',
  // Borders
  border1:  'rgba(255,255,255,0.06)',
  border2:  'rgba(255,255,255,0.10)',
  border3:  'rgba(255,255,255,0.16)',
  // Text
  text1:    '#F0F1FF',
  text2:    '#9294B0',
  text3:    '#52546E',
  // Accents
  lime:     '#C4FF38',
  limeD:    '#A8E020',
  teal:     '#2DD4BF',
  amber:    '#FFA820',
  rose:     '#FF5C7A',
  violet:   '#8B7FEE',
  sky:      '#38BDF8',
  // Semantic
  success:  '#22C55E',
  warning:  '#F59E0B',
  error:    '#EF4444',
  info:     '#3B82F6',
};

export const LIGHT = {
  bg:       '#F8F9FF',
  surface1: '#FFFFFF',
  surface2: '#F2F3FC',
  surface3: '#E8EAFA',
  surface4: '#DEE0F5',
  surface5: '#D4D6F0',
  border1:  'rgba(0,0,0,0.06)',
  border2:  'rgba(0,0,0,0.10)',
  border3:  'rgba(0,0,0,0.16)',
  text1:    '#0A0B18',
  text2:    '#4A4C68',
  text3:    '#8A8CA8',
  lime:     '#7CB800',
  limeD:    '#5E8C00',
  teal:     '#0D9488',
  amber:    '#D97706',
  rose:     '#E11D48',
  violet:   '#6D28D9',
  sky:      '#0284C7',
  success:  '#16A34A',
  warning:  '#D97706',
  error:    '#DC2626',
  info:     '#2563EB',
};

export type Theme = typeof DARK;

export const ZONE_COLORS = (T: Theme) => ({
  kothrud:  { solid: T.teal,   bg: T.teal   + '22', border: T.teal   + '66' },
  baner:    { solid: T.violet, bg: T.violet + '22', border: T.violet + '66' },
  aundh:    { solid: T.amber,  bg: T.amber  + '22', border: T.amber  + '66' },
  viman:    { solid: T.rose,   bg: T.rose   + '22', border: T.rose   + '66' },
  wakad:    { solid: T.sky,    bg: T.sky    + '22', border: T.sky    + '66' },
  kp:       { solid: T.lime,   bg: T.lime   + '22', border: T.lime   + '66' },
  hadapsar: { solid: T.teal,   bg: T.teal   + '22', border: T.teal   + '66' },
  hinjewadi:{ solid: T.violet, bg: T.violet + '22', border: T.violet + '66' },
});

// Typography scale
export const TYPE = {
  h1:   { fontSize: 28, fontWeight: '800' as const, letterSpacing: -0.8, lineHeight: 34 },
  h2:   { fontSize: 22, fontWeight: '800' as const, letterSpacing: -0.5, lineHeight: 28 },
  h3:   { fontSize: 18, fontWeight: '700' as const, letterSpacing: -0.3, lineHeight: 24 },
  h4:   { fontSize: 15, fontWeight: '700' as const, letterSpacing: -0.2, lineHeight: 20 },
  body: { fontSize: 14, fontWeight: '400' as const, letterSpacing:  0.1, lineHeight: 22 },
  sm:   { fontSize: 13, fontWeight: '400' as const, letterSpacing:  0.1, lineHeight: 20 },
  xs:   { fontSize: 11, fontWeight: '500' as const, letterSpacing:  0.3, lineHeight: 16 },
  label:{ fontSize: 10, fontWeight: '700' as const, letterSpacing:  0.8, lineHeight: 14 },
};

// Spacing
export const S = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32,
};

// Border radius
export const R = {
  sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, full: 999,
};

// Shadows
export const shadow = (T: Theme) => ({
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.24,
    shadowRadius: 20,
    elevation: 10,
  },
  lime: {
    shadowColor: T.lime,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
});
