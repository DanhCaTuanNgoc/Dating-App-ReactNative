import React from 'react'
import { View, Text, Image, StyleSheet, Dimensions, Platform } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, SIZES } from '../constants/theme'
import { useAge } from '../hooks/useAge'

interface matchingCardProps {
   user: {
      name: string
      birth_date: string
      bio: string
      photo_url: string
      distance: number
   }
}

const MatchingCard = ({ user }: matchingCardProps) => {
   if (!user) return null

    const age = useAge(user.birth_date)

   return (
      <View style={styles.cardContainer}>
         <Image source={{ uri: user?.photo_url }} style={styles.cardImage} />
         <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
            locations={[0, 0.4, 1]}
            style={styles.cardInfo}
         >
            <Text style={styles.userName}>
               {user.name}
               {age ? `, ${age}` : ''}
            </Text>
            <Text style={styles.userBio}>{user.bio || 'No bio yet'}</Text>
            <View style={styles.locationContainer}>
               <Ionicons name="location" size={16} color={COLORS.white} />
               <Text style={styles.locationText}>{user.distance} km away</Text>
            </View>
         </LinearGradient>
      </View>
   )
}
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')
const styles = StyleSheet.create({
   cardContainer: {
      width: SCREEN_WIDTH * 0.92,
      height: Platform.select({
         ios: SCREEN_HEIGHT * 0.62,
         android: SCREEN_HEIGHT * 0.68,
      }),
      borderRadius: 30,
      justifyContent: 'center',
      alignItems: 'center',
   },
   cardImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
      borderRadius: 30,
      resizeMode: 'cover',
   },
   cardInfo: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: '60%',
      borderBottomRightRadius: 30,
      borderBottomLeftRadius: 30,
      padding: SIZES.medium,
      justifyContent: 'flex-end',
   },
   userName: {
      fontSize: SIZES.xLarge,
      fontWeight: 'bold',
      color: COLORS.white,
      marginBottom: SIZES.small,
   },
   userBio: {
      fontSize: SIZES.medium,
      color: COLORS.white,
      marginBottom: SIZES.small,
   },
   locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   locationText: {
      marginLeft: SIZES.xSmall,
      fontSize: SIZES.medium,
      color: COLORS.white,
   },
})

export default MatchingCard
