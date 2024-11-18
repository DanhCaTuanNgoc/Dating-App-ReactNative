export const COLORS = {
   primary: '#FFD93D', // Bright yellow
   secondary: '#FF9F29', // Light orange
   tertiary: '#FF8E3C', // Soft orange

   // Additional shades
   lightYellow: '#FFE169',
   paleOrange: '#FFBB5C',

   // Common colors
   white: '#FFFFFF',
   black: '#000000',
   border: '#ddd',
   backgroundContent: '#FFFAF0', // Light cream background
   backgroundButton: '#FFC629',
   textColor: '#333',
}

export const SIZES = {
   xSmall: 10,
   small: 12,
   medium: 16,
   large: 20,
   xLarge: 24,
   xxLarge: 32,
}

export const FONTS = {
   regular: {
      fontFamily: 'System',
      fontWeight: '400',
   },
   medium: {
      fontFamily: 'System',
      fontWeight: '500',
   },
   bold: {
      fontFamily: 'System',
      fontWeight: '700',
   },
}

const theme = { COLORS, SIZES, FONTS }

export default theme
