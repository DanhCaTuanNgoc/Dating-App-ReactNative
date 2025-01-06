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
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS, SIZES } from '../../constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import { deletePhoto, setPhotoAsPrimary, uploadImage } from '../../store/user/userAction'
import { ShowImageModal } from '../../components'
import { useAge } from '../../hooks/useAge'
function Profile({ navigation }: { navigation: any }) {
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

   const renderPhotoItem = ({ item }: { item: any }) => (
      <TouchableOpacity
         style={styles.photoItem}
         onPress={() => {
            setSelectedPhoto({ photo_url: item.photo_url, id: item.id })
            setIsImageViewVisible(true)
         }}
      >
         <Image
            source={{ uri: item.photo_url }}
            style={styles.photo}
            resizeMode="cover"
         />
      </TouchableOpacity>
   )

   const handleAddPhoto = async () => {
      try {
         const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
         })

         if (!result.canceled) {
            const manipulatedImage = await ImageManipulator.manipulateAsync(
               result.assets[0].uri,
               [{ resize: { width: 500, height: 500 } }],
               { compress: 0.1, format: ImageManipulator.SaveFormat.JPEG, base64: true },
            )

            if (manipulatedImage.base64) {
               if (manipulatedImage.base64.length > 10000000) {
                  Alert.alert(
                     'Error',
                     'Image size too large. Please choose a smaller image.',
                  )
                  return
               }
               await uploadImage(userId, manipulatedImage.base64, false)(dispatch)
            }
         }
      } catch (error) {
         Alert.alert('Error', 'Failed to add photo')
      }
   }

   const handleDeletePhoto = async (photoId: string) => {
      try {
         if (userPhotos.length <= 4) {
            Alert.alert('Sorry', 'You need to have at least 4 photos')
            return
         }
         await deletePhoto(photoId, userId)(dispatch)
      } catch (error) {
         Alert.alert('Error', 'Failed to delete photo')
      }
   }

   const handleSetAsPrimary = async (photoId: string) => {
      try {
         await setPhotoAsPrimary(
            photoId,
            userPhotos?.find((photo: any) => photo.is_primary).id,
            userId,
         )(dispatch)
      } catch (error) {
         Alert.alert('Error', 'Failed to set as primary')
      }
   }

   const handleEditProfile = () => {
      navigation.navigate('EditProfile')
   }

   return (
      <View style={styles.container}>
         <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity
               style={styles.filterButton}
               onPress={() => navigation.navigate('Setting')}
            >
               <Ionicons name="settings-outline" size={24} color={COLORS.black} />
            </TouchableOpacity>
         </View>

         <View style={styles.profileInfo}>
            <Image
               style={styles.profileImage}
               source={{
                  uri:
                     userPhotos?.length > 0
                        ? userPhotos?.find((photo: any) => photo.is_primary)?.photo_url ||
                          userPhotos[0].photo_url
                        : 'https://via.placeholder.com/150',
               }}
            />
            <View style={styles.nameContainer}>
               <Text style={styles.profileName}>{userInfo.name}</Text>
            </View>
         </View>

         <View style={styles.profileBio}>
            <Text style={styles.profileBioText}>{userInfo.bio || 'No bio yet'}</Text>
         </View>

         <View style={styles.profileTabs}>
            <TouchableOpacity
               style={[styles.tab, screen === 'profile' && styles.activeTab]}
               onPress={() => setScreen('profile')}
            >
               <Text
                  style={[
                     styles.profileTabText,
                     screen === 'profile' && styles.activeTabText,
                  ]}
               >
                  Info
               </Text>
            </TouchableOpacity>
            <TouchableOpacity
               style={[styles.tab, screen === 'photos' && styles.activeTab]}
               onPress={() => setScreen('photos')}
            >
               <Text
                  style={[
                     styles.profileTabText,
                     screen === 'photos' && styles.activeTabText,
                  ]}
               >
                  Photos
               </Text>
            </TouchableOpacity>
         </View>

         <View style={styles.profileContainer}>
            {screen === 'profile' ? (
               <ScrollView style={styles.profileDetails}>
                  <View style={[styles.detailItem, { marginBottom: SIZES.medium }]}>
                     <View style={styles.iconContainer}>
                        <Ionicons
                           name="calendar-outline"
                           size={24}
                           color={COLORS.tertiary}
                        />
                     </View>
                     <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Age</Text>
                        <Text style={styles.detailValue}>{age || 'Not specified'}</Text>
                     </View>
                  </View>
                  <View style={[styles.detailItem, { marginBottom: SIZES.medium }]}>
                     <View style={styles.iconContainer}>
                        <Ionicons
                           name="person-outline"
                           size={24}
                           color={COLORS.tertiary}
                        />
                     </View>
                     <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Gender</Text>
                        <Text style={styles.detailValue}>
                           {userInfo.gender || 'Not specified'}
                        </Text>
                     </View>
                  </View>
                  <View style={[styles.detailItem, { marginBottom: SIZES.medium }]}>
                     <View style={styles.iconContainer}>
                        <Ionicons
                           name="briefcase-outline"
                           size={24}
                           color={COLORS.tertiary}
                        />
                     </View>
                     <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Job Title</Text>
                        <Text style={styles.detailValue}>
                           {userInfo.job_title || 'Not specified'}
                        </Text>
                     </View>
                  </View>
                  <View style={[styles.detailItem, { marginBottom: SIZES.medium }]}>
                     <View style={styles.iconContainer}>
                        <Ionicons
                           name="school-outline"
                           size={24}
                           color={COLORS.tertiary}
                        />
                     </View>
                     <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Education</Text>
                        <Text style={styles.detailValue}>
                           {education.find((edu: any) => edu.id == userInfo.education_id)
                              ?.level || 'Not specified'}
                        </Text>
                     </View>
                  </View>
                  <View style={[styles.detailItem, { marginBottom: SIZES.medium }]}>
                     <View style={styles.iconContainer}>
                        <Ionicons
                           name="heart-outline"
                           size={24}
                           color={COLORS.tertiary}
                        />
                     </View>
                     <View style={styles.detailContent}>
                        <Text style={styles.detailLabel}>Relationship Goal</Text>
                        <Text style={styles.detailValue}>
                           {relationship.find(
                              (rel: any) => rel.id === userInfo.relationship_goal_id,
                           )?.goal || 'Not specified'}
                        </Text>
                     </View>
                  </View>
               </ScrollView>
            ) : (
               <View style={styles.profilePhotos}>
                  <FlatList
                     data={userPhotos ? [...userPhotos].reverse() : []}
                     renderItem={renderPhotoItem}
                     keyExtractor={(item) => item.id}
                     numColumns={2}
                     columnWrapperStyle={styles.photoRow}
                     showsVerticalScrollIndicator={false}
                     contentContainerStyle={styles.photoList}
                  />
               </View>
            )}
         </View>

         <ShowImageModal
            visible={isImageViewVisible}
            imageUrl={selectedPhoto.photo_url}
            onClose={() => setIsImageViewVisible(false)}
            onDelete={() => handleDeletePhoto(selectedPhoto.id)}
            onSetAsPrimary={() => handleSetAsPrimary(selectedPhoto.id)}
            photoId={selectedPhoto.id}
         />

         <TouchableOpacity
            style={styles.bottomButton}
            onPress={screen === 'profile' ? handleEditProfile : handleAddPhoto}
         >
            <Ionicons
               name={screen === 'profile' ? 'create-outline' : 'camera-outline'}
               size={32}
               color={COLORS.white}
            />
         </TouchableOpacity>
      </View>
   )
}

export default Profile

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: COLORS.white,
      paddingHorizontal: SIZES.medium,
   },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 5,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
      marginTop: 40,
   },
   headerTitle: {
      fontSize: 30,
      fontWeight: '800',
      color: COLORS.tertiary,
      fontStyle: 'italic',
      textShadowColor: COLORS.secondary,
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
      backgroundColor: 'transparent',
      textDecorationLine: 'none',
      textTransform: 'uppercase',
      letterSpacing: 1,
   },
   filterButton: {
      padding: SIZES.small,
      borderRadius: 12,
   },
   profileContainer: {
      flex: 1,
      backgroundColor: COLORS.white,
   },
   profileTabs: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginTop: SIZES.medium,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
   },
   tab: {
      paddingVertical: SIZES.small,
      paddingHorizontal: SIZES.medium,
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
   },
   activeTab: {
      borderBottomColor: COLORS.tertiary,
   },
   profileInfo: {
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: SIZES.large,
      paddingHorizontal: 0,
   },
   nameContainer: {
      marginLeft: SIZES.medium,
   },
   profileTabText: {
      fontSize: 18,
      fontWeight: '600',
      color: COLORS.textColor,
   },
   activeTabText: {
      color: COLORS.tertiary,
   },
   profileImage: {
      width: 100,
      height: 100,
      borderRadius: 60,
      borderWidth: 3,
      borderColor: COLORS.border,
   },
   profileName: {
      fontSize: 21,
      fontWeight: 'bold',
      color: COLORS.textColor,
      marginBottom: 4,
   },
   profileAge: {
      fontSize: 16,
      color: COLORS.textColor,
   },
   sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: COLORS.textColor,
      marginBottom: SIZES.small,
   },
   profileBio: {
      marginTop: SIZES.xSmall,
      paddingHorizontal: SIZES.xSmall,
   },
   profileBioText: {
      fontSize: 16,
      lineHeight: 24,
      color: COLORS.textColor,
   },
   profileDetails: {
      marginTop: SIZES.large,
      padding: SIZES.xSmall,
      backgroundColor: COLORS.white,
   },
   detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F8F9FA',
      padding: SIZES.small,
      borderRadius: 8,
   },
   iconContainer: {
      width: 40,
      height: 40,
      backgroundColor: '#E9ECEF',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
   },
   detailContent: {
      marginLeft: SIZES.small,
      flex: 1,
   },
   detailLabel: {
      fontSize: 14,
      color: '#6C757D',
      marginBottom: 2,
   },
   detailValue: {
      fontSize: 16,
      color: COLORS.textColor,
      fontWeight: '500',
   },
   profilePhotos: {
      backgroundColor: COLORS.white,
      marginTop: 15,
      flex: 1,
      marginBottom: 0,
      paddingHorizontal: 0,
      borderRadius: 16,
   },
   photoList: {
      paddingTop: SIZES.small,
   },
   photoRow: {
      justifyContent: 'space-between',
   },
   photoItem: {
      width: '48%',
      aspectRatio: 1,
      marginBottom: SIZES.medium,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      position: 'relative',
   },
   photo: {
      width: '100%',
      height: '100%',
      borderRadius: 12,
   },
   deleteButton: {
      position: 'absolute',
      top: 5,
      right: 5,
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 2,
   },
   addPhotoButton: {
      backgroundColor: '#8FBC8F',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: SIZES.medium,
      borderRadius: 12,
      marginBottom: SIZES.medium,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   addPhotoText: {
      color: COLORS.white,
      fontSize: 17,
      fontWeight: '700',
      marginLeft: SIZES.small,
   },
   bottomButton: {
      position: 'absolute',
      bottom: 30,
      right: 30,
      backgroundColor: COLORS.tertiary,
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 8,
   },
})
