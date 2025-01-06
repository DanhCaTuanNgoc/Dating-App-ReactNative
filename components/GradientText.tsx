import React from 'react'
import { Text, StyleSheet } from 'react-native'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '../constants/theme'

interface GradientTextProps {
   text: string
   colors?: readonly [string, string]
   style?: any
}

const GradientText = ({
   text,
   colors = ['#ea80fc', '#8d39ec'],
   style,
}: GradientTextProps) => {
   return (
      <MaskedView
         maskElement={<Text style={[styles.headerTitleMask, style]}>{text}</Text>}
      >
         <LinearGradient
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientContainer}
         >
            <Text style={[styles.headerTitle, styles.transparentText, style]}>
               {text}
            </Text>
         </LinearGradient>
      </MaskedView>
   )
}

const styles = StyleSheet.create({
   headerTitleMask: {
      fontSize: 38,
      fontWeight: 'bold',
      textAlign: 'left',
      fontStyle: 'italic',
   },
   headerTitle: {
      fontSize: 32,
      fontWeight: 'bold',
   },
   transparentText: {
      opacity: 0,
   },
   gradientContainer: {
      height: 45,
      width: 120,
   },
})

export default GradientText
