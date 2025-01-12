import React, { useEffect, useRef } from 'react'
import { Modal, Text, StyleSheet, Animated, Dimensions } from 'react-native'
import LottieView from 'lottie-react-native'
import ConfettiCannon from 'react-native-confetti-cannon'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS } from '@/constants/theme'

const { width, height } = Dimensions.get('window')

interface MatchCelebrationProps {
   visible: boolean
   onAnimationComplete: () => void
}

const MatchCelebration = ({ visible, onAnimationComplete }: MatchCelebrationProps) => {
   const fadeAnim = useRef(new Animated.Value(0)).current
   const scaleAnim = useRef(new Animated.Value(0.3)).current
   const confettiRef = useRef<any>(null)
   const textScaleAnim = useRef(new Animated.Value(0)).current

   useEffect(() => {
      if (visible) {
         // Reset animations
         fadeAnim.setValue(0)
         scaleAnim.setValue(0.3)
         textScaleAnim.setValue(0)

         // Sequence của animations
         Animated.sequence([
            // 1. Fade in background
            Animated.timing(fadeAnim, {
               toValue: 1,
               duration: 400,
               useNativeDriver: true,
            }),

            // 2. Text animation với scale spring effect
            Animated.spring(textScaleAnim, {
               toValue: 1,
               friction: 8,
               tension: 40,
               useNativeDriver: true,
            }),
         ]).start()

         // Trigger multiple confetti bursts
         setTimeout(() => {
            confettiRef.current?.start()
         }, 300)

         // Second confetti burst
         setTimeout(() => {
            if (confettiRef.current) {
               confettiRef.current.start()
            }
         }, 1000)

         // Auto hide
         setTimeout(onAnimationComplete, 3500)
      }
   }, [visible])

   if (!visible) return null

   return (
      <Modal transparent visible={visible}>
         <LinearGradient
            colors={['rgba(0,0,0,0.95)', `${COLORS.primary}90`, 'rgba(0,0,0,0.95)']}
            style={styles.container}
         >
            <ConfettiCannon
               ref={confettiRef}
               count={100}
               origin={{ x: width / 2, y: height }}
               autoStart={false}
               fadeOut={true}
               colors={[
                  COLORS.primary,
                  COLORS.secondary,
                  '#FFD700',
                  '#FF69B4',
                  '#00FF00',
               ]}
               explosionSpeed={350}
            />

            <Animated.View
               style={[
                  styles.content,
                  {
                     opacity: fadeAnim,
                  },
               ]}
            >
               <LottieView
                  source={require('@/assets/animations/celebrate.json')}
                  autoPlay
                  loop={false}
                  style={styles.lottieAnimation}
               />

               <Animated.Text
                  style={[
                     styles.matchText,
                     {
                        transform: [{ scale: textScaleAnim }],
                     },
                  ]}
               >
                  It's a Match!
               </Animated.Text>
            </Animated.View>
         </LinearGradient>
      </Modal>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
   },
   content: {
      alignItems: 'center',
      justifyContent: 'center',
   },
   lottieAnimation: {
      width: 300,
      height: 300,
      position: 'absolute',
   },
   matchText: {
      fontSize: 48,
      fontWeight: 'bold',
      color: '#fff',
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 2, height: 2 },
      // Thêm glow effect
      textShadowRadius: 15,
      elevation: 5,
      // Thêm gradient text nếu platform hỗ trợ
      backgroundColor: 'transparent',
   },
})

export default MatchCelebration
