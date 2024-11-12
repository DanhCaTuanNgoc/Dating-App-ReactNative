import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window')

// theme.js
export const themes = {
   light: {
      backgroundColor: '#FFFFFF',
      primaryColor: '#FFA500', // Changed to orange
      textColor: '#000',
   },
   dark: {
      backgroundColor: '#1c1c1c', 
      backgroundContent: '#363636',
      backgroundTabBar: '#202020',
      primaryColor: '#FFB74D', // Changed to light orange
      textColor: '#FFFFFF',
   },
}

export const COLORS = {
   primary: '#FFA500', // Changed to orange
   white: '#FFFFFF',
   background: '#FFF8E1', // Changed to light cream
   gray: '#BEC2C2',
   main: '#FFB74D', // Changed to light orange
   secondary: '#FFCC80', // Changed to pale orange
   thirdary: '#FFE0B2', // Changed to very light orange
   tertiary: '#FFF3E0', // Changed to cream
}

export const SIZES = {
   // Global SIZES
   base: 8,
   font: 14,
   radius: 30,
   padding: 8,
   padding2: 12,
   padding3: 16,

   // FONTS Sizes
   largeTitle: 50,
   h1: 30,
   h2: 22,
   h3: 20,
   h4: 18,
   body1: 30,
   body2: 20,
   body3: 16,
   body4: 14,

   // App Dimensions
   width,
   height,
}

export const FONTS = {
   largeTitle: {
      fontFamily: 'black',
      fontSize: SIZES.largeTitle,
      lineHeight: 55,
   },
   h1: { fontFamily: 'bold', fontSize: SIZES.h1, lineHeight: 36 },
   h2: { fontFamily: 'bold', fontSize: SIZES.h2, lineHeight: 30 },
   h3: { fontFamily: 'bold', fontSize: SIZES.h3, lineHeight: 22 },
   h4: { fontFamily: 'bold', fontSize: SIZES.h4, lineHeight: 20 },
   body1: { fontFamily: 'regular', fontSize: SIZES.body1, lineHeight: 36 },
   body2: { fontFamily: 'regular', fontSize: SIZES.body2, lineHeight: 30 },
   body3: { fontFamily: 'regular', fontSize: SIZES.body3, lineHeight: 22 },
   body4: { fontFamily: 'regular', fontSize: SIZES.body4, lineHeight: 20 },
}

const appTheme = { COLORS, SIZES, FONTS, themes }

export default appTheme
