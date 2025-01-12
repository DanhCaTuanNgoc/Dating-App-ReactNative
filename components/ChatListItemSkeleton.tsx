import React from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { COLORS } from '@/constants/theme'

const ChatListItemSkeleton = () => {
   const animatedValue = new Animated.Value(0)

   React.useEffect(() => {
      Animated.loop(
         Animated.sequence([
            Animated.timing(animatedValue, {
               toValue: 1,
               duration: 1000,
               useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
               toValue: 0,
               duration: 1000,
               useNativeDriver: true,
            }),
         ]),
      ).start()
   }, [])

   const opacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
   })

   return (
      <View style={styles.container}>
         <Animated.View style={[styles.avatar, { opacity }]} />
         <View style={styles.content}>
            <Animated.View style={[styles.nameSkeleton, { opacity }]} />
            <Animated.View style={[styles.messageSkeleton, { opacity }]} />
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flexDirection: 'row',
      padding: 16,
      alignItems: 'center',
      backgroundColor: COLORS.white,
   },
   avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: '#E1E9EE',
   },
   content: {
      flex: 1,
      marginLeft: 12,
   },
   nameSkeleton: {
      width: '40%',
      height: 20,
      backgroundColor: '#E1E9EE',
      borderRadius: 4,
      marginBottom: 8,
   },
   messageSkeleton: {
      width: '70%',
      height: 16,
      backgroundColor: '#E1E9EE',
      borderRadius: 4,
   },
})

export default ChatListItemSkeleton
