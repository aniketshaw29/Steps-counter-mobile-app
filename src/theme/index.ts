// Material You colour tokens — light + dark variants
export const LightColors = {
  primary: '#6750A4',
  primaryContainer: '#EADDFF',
  onPrimary: '#FFFFFF',
  onPrimaryContainer: '#21005D',
  secondary: '#625B71',
  surface: '#FFFBFE',
  surfaceVariant: '#E7E0EC',
  background: '#FFFBFE',
  onBackground: '#1C1B1F',
  onSurface: '#1C1B1F',
  onSurfaceVariant: '#49454F',
  outline: '#79747E',
  error: '#B3261E',
  success: '#386A20',
  warning: '#7D5700',
  ringTrack: '#E7E0EC',
  ringFill: '#6750A4',
  ringGoalMet: '#FFD700',
  barActive: '#6750A4',
  barInactive: '#CAC4D0',
  barGoalLine: '#B3261E',
};

export const DarkColors = {
  primary: '#D0BCFF',
  primaryContainer: '#4F378B',
  onPrimary: '#381E72',
  onPrimaryContainer: '#EADDFF',
  secondary: '#CCC2DC',
  surface: '#1C1B1F',
  surfaceVariant: '#49454F',
  background: '#1C1B1F',
  onBackground: '#E6E1E5',
  onSurface: '#E6E1E5',
  onSurfaceVariant: '#CAC4D0',
  outline: '#938F99',
  error: '#F2B8B5',
  success: '#8FCE6A',
  warning: '#FFB951',
  ringTrack: '#49454F',
  ringFill: '#D0BCFF',
  ringGoalMet: '#FFD700',
  barActive: '#D0BCFF',
  barInactive: '#49454F',
  barGoalLine: '#F2B8B5',
};

export type ColorScheme = typeof LightColors;

// Default export stays as LightColors for components that don't use the hook
export const Colors = LightColors;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const FontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 28,
  hero: 64,
};
