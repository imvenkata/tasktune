export interface ColorPalette {
  bg: string;
  accent: string;
  name: string;
}

export const lightPalettes: ColorPalette[] = [
  { bg: '#FEE2E2', accent: '#F87171', name: 'coral' },
  { bg: '#FEF3C7', accent: '#FBBF24', name: 'sunshine' },
  { bg: '#D1FAE5', accent: '#34D399', name: 'mint' },
  { bg: '#DBEAFE', accent: '#60A5FA', name: 'sky' },
  { bg: '#EDE9FE', accent: '#A78BFA', name: 'lavender' },
  { bg: '#FCE7F3', accent: '#F472B6', name: 'rose' },
  { bg: '#E0E7FF', accent: '#818CF8', name: 'periwinkle' },
  { bg: '#CCFBF1', accent: '#2DD4BF', name: 'teal' },
];

export const darkPalettes: ColorPalette[] = [
  { bg: '#450A0A', accent: '#F87171', name: 'coral' },
  { bg: '#451A03', accent: '#FBBF24', name: 'sunshine' },
  { bg: '#052E16', accent: '#34D399', name: 'mint' },
  { bg: '#0C1929', accent: '#60A5FA', name: 'sky' },
  { bg: '#1E1B4B', accent: '#A78BFA', name: 'lavender' },
  { bg: '#4A0D2C', accent: '#F472B6', name: 'rose' },
  { bg: '#1E1B4B', accent: '#818CF8', name: 'periwinkle' },
  { bg: '#042F2E', accent: '#2DD4BF', name: 'teal' },
];

export const restoreColor = (colorName: string, isDark: boolean): ColorPalette => {
  const palettes = isDark ? darkPalettes : lightPalettes;
  const found = palettes.find(p => p.name === colorName);
  return found || palettes[0];
};
