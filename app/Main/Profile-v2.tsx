import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   Image,
   FlatList,
   ScrollView,
   Modal,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES } from '../../constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import { deletePhoto, setPhotoAsPrimary, uploadImage } from '../../store/user/userAction'
import { ShowImageModal } from '../../components'
import { useAge } from '../../hooks/useAge'
import { BlurView } from 'expo-blur'
import Animated, {
   useAnimatedStyle,
   withSpring,
   useSharedValue,
   withSequence,
   withDelay,
   FadeInUp,
} from 'react-native-reanimated'

function ProfileV2({ navigation }: { navigation: any }) {
   const [screen, setScreen] = useState<'profile' | 'photos'>('profile')
   const {
      userInfo,
      userId,
      userPhotos = [],
      education,
      relationship,
   } = useSelector((state: any) => state.userState)
   const dispatch: any = useDispatch()
   const [selectedPhoto, setSelectedPhoto] = useState<any>({})
   const [isImageViewVisible, setIsImageViewVisible] = useState(false)
   const [isEditMode, setIsEditMode] = useState(false)
   const age = useAge(userInfo.birth_date)
   const scaleAnim = useSharedValue(0)

   useEffect(() => {
      scaleAnim.value = withSequence(withSpring(1.1), withDelay(100, withSpring(1)))
   }, [])

   const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scaleAnim.value }],
   }))

   return (
      <View style={styles.container}>
         <LinearGradient
            colors={[COLORS.secondary, COLORS.primary, COLORS.tertiary]}
            style={styles.circle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
         >
            <Animated.View style={[styles.profileHeader, animatedStyle]}>
               <View style={styles.imageContainer}>
                  <Image
                     source={{
                        uri: userPhotos?.find((photo: any) => photo.is_primary)
                           ?.photo_url,
                     }}
                     style={styles.profileImage}
                  />
                  <BlurView intensity={80} style={styles.blurBadge}>
                     {userInfo.is_verified === true ? (
                        <Ionicons
                           name="checkmark-circle"
                           size={20}
                           color={COLORS.primary}
                        />
                     ) : (
                        <Ionicons
                           name="close-circle"
                           size={20}
                           color={COLORS.alertFail}
                        />
                     )}
                  </BlurView>
               </View>
               <Text style={styles.userName}>
                  {userInfo.name}, {age}
               </Text>
            </Animated.View>
         </LinearGradient>

         <View style={styles.buttonContainer}>
            <TouchableOpacity
               style={styles.button}
               onPress={() => navigation.navigate('EditProfile')}
            >
               <LinearGradient
                  colors={[COLORS.white, COLORS.primary + '20']}
                  style={styles.buttonGradient}
               >
                  <Ionicons name="pencil" size={32} color={COLORS.primary} />
               </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
               style={[styles.button, { marginTop: 35 }]}
               onPress={() => navigation.navigate('Photo')}
            >
               <LinearGradient
                  colors={[COLORS.white, COLORS.secondary + '20']}
                  style={styles.buttonGradient}
               >
                  <Ionicons name="camera" size={32} color={COLORS.secondary} />
               </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
               style={styles.button}
               onPress={() => navigation.navigate('Setting')}
            >
               <LinearGradient
                  colors={[COLORS.white, COLORS.tertiary + '20']}
                  style={styles.buttonGradient}
               >
                  <Ionicons name="settings" size={32} color={COLORS.tertiary} />
               </LinearGradient>
            </TouchableOpacity>
         </View>

         <View style={styles.notificationContainer}>
            <View style={styles.warningBox}>
               <Text style={styles.warningText}>Bạn chưa xác thực !</Text>
               <TouchableOpacity style={styles.verifyButton}>
                  <Text style={styles.verifyButtonText}>Xác thực ngay</Text>
               </TouchableOpacity>
            </View>

            <LinearGradient
               colors={['#FFF9C4', '#FFE082', '#FFD54F']}
               start={{ x: 0, y: 0 }}
               end={{ x: 1, y: 1 }}
               style={[
                  styles.warningBox,
                  {
                     borderRadius: 12,
                     borderWidth: 1,
                     borderColor: '#FFB300',
                     padding: 16,
                     shadowColor: '#FFB300',
                     shadowOffset: { width: 0, height: 4 },
                     shadowOpacity: 0.25,
                     shadowRadius: 8,
                     elevation: 5,
                     justifyContent: 'space-between',
                     alignItems: 'center',
                     flexDirection: 'row',
                  },
               ]}
            >
               <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="star" size={24} color="#FFB300" />
                  <Text
                     style={[
                        styles.vipText,
                        {
                           color: '#795548',
                           fontWeight: 'bold',
                           fontSize: 16,
                        },
                     ]}
                  >
                     Nâng cấp gói VIP
                  </Text>
               </View>
               <TouchableOpacity
                  style={[
                     styles.upgradeButton,
                     styles.vipButton,
                     {
                        backgroundColor: '#FFB300',
                        paddingVertical: 12,
                        paddingHorizontal: 14,
                        borderRadius: 8,
                        elevation: 3,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                     },
                  ]}
               >
                  <LinearGradient
                     colors={['#FFB300', '#FFA000']}
                     start={{ x: 0, y: 0 }}
                     end={{ x: 1, y: 1 }}
                     style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        borderRadius: 8,
                     }}
                  />
                  <Text
                     style={[
                        styles.upgradeButtonText,
                        {
                           color: COLORS.white,
                           fontSize: 14,
                           fontWeight: '600',
                           textShadowColor: 'rgba(0, 0, 0, 0.2)',
                           textShadowOffset: { width: 1, height: 1 },
                           textShadowRadius: 2,
                        },
                     ]}
                  >
                     Nâng cấp ngay
                  </Text>
               </TouchableOpacity>
            </LinearGradient>
         </View>
      </View>
   )
}
const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: COLORS.white,
      paddingHorizontal: 0,
   },
   circle: {
      width: '100%',
      height: '50%',
      borderBottomLeftRadius: 500,
      borderBottomRightRadius: 500,
      paddingTop: SIZES.xxLarge,
   },
   profileHeader: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 55,
   },
   profileImage: {
      width: 150,
      height: 150,
      borderRadius: 100,
      marginBottom: SIZES.medium,
      borderWidth: 3,
      borderColor: COLORS.white,
   },
   userName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.white,
      marginBottom: SIZES.small,
   },
   userAge: {
      fontSize: 16,
      color: COLORS.white,
   },
   buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      width: '100%',
      height: 'auto',
      padding: SIZES.medium + 1,
      gap: SIZES.large,
      zIndex: 999,
   },
   button: {
      width: 80,
      height: 80,
      borderRadius: 45,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      backgroundColor: COLORS.white,
   },
   notificationContainer: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      padding: SIZES.medium,
      gap: SIZES.medium,
      marginTop: 0,
   },
   warningBox: {
      backgroundColor: COLORS.white,
      padding: SIZES.medium,
      borderRadius: SIZES.small,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      alignItems: 'center',
      width: '100%',
      gap: SIZES.small,
      justifyContent: 'space-between',
      flexDirection: 'row',
   },
   warningText: {
      fontSize: 16,
      color: COLORS.black,
      fontWeight: '500',
   },
   verifyButton: {
      backgroundColor: COLORS.primary,
      padding: SIZES.small,
      borderRadius: SIZES.small,
      width: 'auto',
      alignItems: 'center',
   },
   verifyButtonText: {
      fontSize: 16,
      color: COLORS.white,
      fontWeight: 'bold',
   },
   vipBox: {
      backgroundColor: COLORS.white,
      padding: SIZES.medium,
      borderRadius: SIZES.small,
      elevation: 5,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      alignItems: 'center',
      width: '100%',
      gap: SIZES.small,
   },
   vipText: {
      fontSize: 16,
      color: COLORS.black,
      fontWeight: '500',
   },
   upgradeButton: {
      backgroundColor: COLORS.primary,
      padding: SIZES.small,
      borderRadius: SIZES.small,
      width: 'auto',
      alignItems: 'center',
   },
   upgradeButtonText: {
      fontSize: 16,
      color: COLORS.white,
      fontWeight: 'bold',
   },
   imageContainer: {
      position: 'relative',
   },
   blurBadge: {
      position: 'absolute',
      bottom: 25,
      right: 5,
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
   },
   buttonGradient: {
      width: '100%',
      height: '100%',
      borderRadius: 45,
      justifyContent: 'center',
      alignItems: 'center',
   },
   gradientBox: {
      width: '100%',
      height: '100%',
      borderRadius: SIZES.small,
      padding: SIZES.medium,
      alignItems: 'center',
   },
   iconCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SIZES.small,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
   },
   vipIconCircle: {
      backgroundColor: COLORS.primary + '10',
   },
   gradientButton: {
      width: '100%',
      height: '100%',
      borderRadius: SIZES.small,
      justifyContent: 'center',
      alignItems: 'center',
   },
   vipButton: {
      overflow: 'hidden',
   },
   scrollContainer: {
      flex: 1,
      width: '100%',
   },
})

export default ProfileV2
