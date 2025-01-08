import {
   View,
   Text,
   StyleSheet,
   Image,
   TouchableOpacity,
   ActivityIndicator,
   Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, SIZES } from '../../constants/theme'
import { LinearGradient } from 'expo-linear-gradient'
import { useEffect, useState, useCallback, Fragment, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import React from 'react'
import {
   UpdateUserFilters,
   getMatchingListByFilters,
} from '../../store/matching/matchAction'
import { updateFiltersReducer, setMatchingList } from '@/store/matching/matchReducer'
import { useLocation } from '../../hooks/useLocation'
import MaskedView from '@react-native-masked-view/masked-view'
import {
   MatchingCard,
   GradientText,
   MatchingSwiper,
   MatchingCardSkeleton,
} from '@/components'
import FilterModal from '@/components/FilterModal'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MatchingSwiperRef } from '@/components/MatchingSwiper'

function People() {
   const { errorMsg, newLocation, requestLocationPermission } = useLocation()
   const { userId, userInfo } = useSelector((state: any) => state.userState)
   const { matchingList, defaultFilters } = useSelector((state: any) => state.matchState)
   const dispatch = useDispatch()
   const [isFilterVisible, setIsFilterVisible] = useState(false)
   const swiperRef = useRef<MatchingSwiperRef>(null)
   const [number, setNumber] = useState(0)
   const [isLoading, setIsLoading] = useState(true)
   const [isLastCardSwiped, setIsLastCardSwiped] = useState(false)

   const loadMatchingListByFilters = async () => {
      try {
         setIsLoading(true)
         const filters = await AsyncStorage.getItem('filters')
         if (filters) {
            await getMatchingListByFilters(userId)(dispatch)
            await dispatch(updateFiltersReducer(JSON.parse(filters)))
         } else {
            let isNewUser = false
            await UpdateUserFilters(defaultFilters, userId, isNewUser)(dispatch)
            await getMatchingListByFilters(userId)(dispatch)
         }
      } catch (err) {
         console.error('Error in loadMatchingListByFilters:', err)
      } finally {
         setIsLoading(false)
      }
   }

   useEffect(() => {
      if (userInfo.location) {
         loadMatchingListByFilters()
      }
   }, [userInfo])

   useEffect(() => {
      if (matchingList) {
         setNumber(matchingList.length)
      }
   }, [matchingList])

   const handleSwipedRight = useCallback(
      (cardIndex: number) => {
         const swipedUser = matchingList[cardIndex]
         console.log('Liked user:', swipedUser.id)

         if (cardIndex === matchingList.length - 1) {
            setIsLastCardSwiped(true)
         }
         setNumber((prev) => prev - 1)
      },
      [matchingList],
   )

   const handleSwipedLeft = useCallback(
      (cardIndex: number) => {
         try {
            const swipedUser = matchingList[cardIndex]
            console.log('Disliked user:', swipedUser.id)

            if (cardIndex === matchingList.length - 1) {
               setIsLastCardSwiped(true)
            }
            setNumber((prev) => prev - 1)
         } catch (error) {
            console.error('Error disliking user:', error)
         }
      },
      [matchingList],
   )

   const calculateAge = useCallback((birthDate: string) => {
      if (!birthDate) return null
      const today = new Date()
      const birth = new Date(birthDate)
      let age = today.getFullYear() - birth.getFullYear()
      const monthDiff = today.getMonth() - birth.getMonth()

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
         age--
      }
      return age
   }, [])

   const renderCard = useCallback(
      (user: any, cardIndex: number) => {
         return <MatchingCard user={user} calculateAge={calculateAge} />
      },
      [calculateAge],
   )

   const handleApplyFilters = async (filters: any) => {
      await AsyncStorage.setItem('filters', JSON.stringify(filters))
      try {
         let isNewUser = false
         await UpdateUserFilters(filters, userId, isNewUser)(dispatch)
         loadMatchingListByFilters()
      } catch (err) {
         console.log(err)
      }
   }

   const handleAddLocation = async () => {
      try {
         await requestLocationPermission()
         await loadMatchingListByFilters()
      } catch (error) {
         console.error('Error in handleAddLocation:', error)
      }
   }

   return (
      <SafeAreaView style={styles.container} edges={['top']}>
         <View style={styles.header}>
            <GradientText text="Linder" />
            <TouchableOpacity
               style={styles.filterButton}
               onPress={() => setIsFilterVisible(true)}
            >
               <Ionicons name="filter" size={24} color={COLORS.tertiary} />
            </TouchableOpacity>
         </View>

         {errorMsg ? (
            <View style={styles.noLocationContainer}>
               <Text style={styles.noLocationText}>{errorMsg}</Text>
               <TouchableOpacity
                  style={styles.locationButton}
                  onPress={handleAddLocation}
               >
                  <Ionicons name="location" size={24} color={COLORS.white} />
                  <Text style={styles.locationButtonText}>Try Again</Text>
               </TouchableOpacity>
            </View>
         ) : !userInfo.location ? (
            <View style={styles.noLocationContainer}>
               <Image
                  source={require('../../assets/images/no-location.png')}
                  style={styles.noLocationImage}
               />
               <Text style={styles.noLocationText}>
                  We need your location to show you people nearby
               </Text>
               <TouchableOpacity
                  style={styles.locationButton}
                  onPress={handleAddLocation}
               >
                  <Ionicons name="location" size={24} color={COLORS.white} />
                  <Text style={styles.locationButtonText}>Enable Location</Text>
               </TouchableOpacity>
            </View>
         ) : isLoading ? (
            <View style={styles.swiperContainer}>
               <MatchingCardSkeleton />
               <View style={styles.loadingTextContainer}>
                  <ActivityIndicator size="small" color={COLORS.textColor} />
                  <Text style={styles.loadingText}>Finding people...</Text>
               </View>
            </View>
         ) : matchingList && number >= 0 ? (
            <Fragment>
               <View style={styles.swiperContainer}>
                  <MatchingSwiper
                     matchingList={matchingList}
                     renderCard={renderCard}
                     onSwipedLeft={handleSwipedLeft}
                     onSwipedRight={handleSwipedRight}
                     ref={swiperRef}
                  />
               </View>
               <View style={styles.actionButtons}>
                  <TouchableOpacity
                     style={{ ...styles.actionButton, ...styles.dislikeButton }}
                     onPress={() => {
                        swiperRef.current?.swipeLeft()
                        setNumber(number - 1)
                     }}
                  >
                     <Ionicons name="close" size={24} color={COLORS.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                     style={{ ...styles.actionButton, ...styles.starButton }}
                  >
                     <Ionicons name="star" size={24} color={COLORS.white} />
                  </TouchableOpacity>
                  <TouchableOpacity
                     style={{ ...styles.actionButton, ...styles.likeButton }}
                     onPress={() => {
                        swiperRef.current?.swipeRight()
                        setNumber(number - 1)
                     }}
                  >
                     <Ionicons name="heart" size={24} color={COLORS.white} />
                  </TouchableOpacity>
               </View>
            </Fragment>
         ) : (
            <View style={styles.noUsersContainer}>
               <Image
                  source={require('../../assets/images/usernotfound.jpg')}
                  style={styles.noUsersImage}
               />
               <Text style={styles.noUsersText}>No users found</Text>
            </View>
         )}

         <FilterModal
            visible={isFilterVisible}
            onClose={() => setIsFilterVisible(false)}
            onApply={handleApplyFilters}
         />
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: COLORS.white,
      paddingHorizontal: SIZES.medium,
      justifyContent: 'center',
   },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: Platform.select({
         ios: 5,
         android: 15,
      }),
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
   },
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
   swiper: {
      height: '52%',
      width: '92%',
   },
   filterButton: {
      padding: SIZES.small,
   },
   noLocationContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: SIZES.large,
   },
   noLocationImage: {
      width: 150,
      height: 150,
      marginBottom: SIZES.large,
   },
   noLocationText: {
      fontSize: SIZES.large,
      color: COLORS.textColor,
      textAlign: 'center',
      marginBottom: SIZES.medium,
   },
   locationButton: {
      flexDirection: 'row',
      backgroundColor: COLORS.tertiary,
      padding: SIZES.medium,
      borderRadius: SIZES.small,
      alignItems: 'center',
   },
   locationButtonText: {
      color: COLORS.white,
      marginLeft: SIZES.small,
      fontSize: SIZES.medium,
      fontWeight: '600',
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
   actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: 'auto',
      padding: SIZES.medium,
      gap: SIZES.large,
      zIndex: 999, // Đảm bảo nút luôn ở trên cùng
   },
   actionButton: {
      width: 65,
      height: 65,
      borderRadius: 35,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
   },
   likeButton: {
      backgroundColor: COLORS.heart,
   },
   starButton: {
      backgroundColor: '#FFC629',
   },
   dislikeButton: {
      backgroundColor: COLORS.alertFail,
   },
   swiperContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      width: '100%',
      marginTop: SIZES.medium,
   },
   overlayLabel: {
      fontSize: 45,
      fontWeight: 'bold',
      padding: 10,
      color: 'red',
   },
   overlayWrapper: {
      flexDirection: 'column',
      width: '92%',
      height: Platform.select({
         ios: '62%',
         android: '68%',
      }),
      alignItems: 'flex-end',
      justifyContent: 'flex-start',
      borderWidth: 3,
      borderColor: 'red',
      borderRadius: 30,
   },
   noUsersContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: SIZES.large,
   },

   noUsersText: {
      fontSize: SIZES.medium,
      color: COLORS.textColor,
      textAlign: 'center',
      fontWeight: 'bold',
      fontStyle: 'italic',
   },
   noUsersImage: {
      width: 300,
      height: 300,
   },
   loadingText: {
      marginTop: SIZES.medium,
      fontSize: SIZES.medium,
      color: COLORS.textColor,
      fontWeight: 'bold',
   },
   loadingTextContainer: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: SIZES.small,
   },
})

export default People
