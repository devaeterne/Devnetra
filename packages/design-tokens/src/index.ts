export const designSystemVersion = '1.0.0' as const;
export const tokens = {
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 },
  radius: { sm: 8, md: 12, lg: 18, xl: 24, pill: 9999 },
  iconSize: { sm: 16, md: 20, lg: 24, xl: 32 },
  minTouchTarget: { kids: 48, adult: 44 },
  typography: { family: 'system-ui, -apple-system, Segoe UI, sans-serif', weight: { regular: 400, medium: 500, bold: 700 } },
  themes: {
    kids: {
      background: '#F5FAFF', surface: '#FFFFFF', surfaceRaised: '#EAF4FF',
      text: '#152A4D', muted: '#445A78',
      primary: '#2453CC', primaryText: '#FFFFFF', accent: '#7A37D5',
      success: '#137A44', warning: '#9F5300', reward: '#FFD35B',
      border: '#C8DCF3', focus: '#2453CC',
    },
    adult: {
      background: '#F8FAFC', surface: '#FFFFFF', surfaceRaised: '#EFF4FC',
      text: '#0F172A', muted: '#475569',
      primary: '#2453CC', primaryText: '#FFFFFF', accent: '#6D28D9',
      success: '#15803D', warning: '#A16207', reward: '#FBBF24',
      border: '#CBD5E1', focus: '#2453CC',
    },
  },
} as const;
export type ThemeName = keyof typeof tokens.themes;
