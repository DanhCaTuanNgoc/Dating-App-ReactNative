import {
   View,
   Image,
   TouchableOpacity,
   StyleSheet,
   Alert,
   Text,
   ScrollView,
   Platform,
} from 'react-native'
import { useState, useEffect, useCallback } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { useSelector, useDispatch } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'
import { deletePhoto, uploadImage, setPhotoAsPrimary } from '@/store/user/userAction'
import { LinearGradient } from 'expo-linear-gradient'
import ShowImageModal from '@/components/ShowImageModal'
import AlertModal from '@/components/AlertModal'
function ManagePhotos({ navigation }: any) {
   const { userPhotos, userId } = useSelector((state: any) => state.userState)
   const dispatch: any = useDispatch()
   const [selectedPhoto, setSelectedPhoto] = useState<any>(null)
   const [isImageViewVisible, setIsImageViewVisible] = useState(false)
   const [isAlertModalVisible, setIsAlertModalVisible] = useState(false)
   const [isAlertModalVisible2, setIsAlertModalVisible2] = useState(false)
   const [isAlertModalVisible3, setIsAlertModalVisible3] = useState(false)



   const pickImage = async () => {
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
                  setIsAlertModalVisible(true)
                  return
               }
               await uploadImage(userId, manipulatedImage.base64, false)(dispatch)
            }
         }
      } catch (error) {
         console.error('Image picker error:', error)
         Alert.alert('Error', 'Failed to pick image')
      }
   }

   const handleDeletePhoto = async (photoId: string, isPrimary: boolean) => {
      try {
         if (userPhotos.length <= 1) {
            setIsAlertModalVisible2(true)
            return
         }
         if (isPrimary) {
            setIsAlertModalVisible3(true)
            return
         }
         await deletePhoto(photoId, userId, selectedPhoto?.cloudinary_id || '')(dispatch)
      } catch (error) {
         Alert.alert('Error', 'Failed to delete photo')
      }
   }

   const handleSetPrimary = async (photoId: string) => {
      try {
         const currentPrimaryPhoto = userPhotos.find((photo: any) => photo.is_primary)
         if (currentPrimaryPhoto) {
            await setPhotoAsPrimary(photoId, currentPrimaryPhoto.id, userId)(dispatch)
         }
      } catch (error) {
         Alert.alert('Error', 'Failed to set primary photo')
      }
   }

   const handlePhotoPress = (photo: any) => {
      setSelectedPhoto(photo)
      setIsImageViewVisible(true)
   }

   const renderImageSlots = useCallback(() => {
      const slots = []
      for (let i = 0; i < 6; i++) {
         if (i < userPhotos.length) {
            const photo = userPhotos[i]
            slots.push(
               <TouchableOpacity
                  key={i}
                  style={styles.imageContainer}
                  onPress={() => handlePhotoPress(photo)}
               >
                  <Image source={{ uri: photo.photo_url }} style={styles.image} />
                  <LinearGradient
                     colors={['transparent', 'rgba(0,0,0,0.5)']}
                     style={styles.imageOverlay}
                  >
                     <View style={styles.photoActions}>
                        <TouchableOpacity
                           style={[styles.actionButton, styles.deleteButton]}
                           onPress={() => handleDeletePhoto(photo.id, photo.is_primary)}
                        >
                           <Ionicons name="trash" size={20} color={COLORS.white} />
                        </TouchableOpacity>
                        {!photo.is_primary && (
                           <TouchableOpacity
                              style={[styles.actionButton, styles.primaryButton]}
                              onPress={() => handleSetPrimary(photo.id)}
                           >
                              <Ionicons name="star" size={20} color={COLORS.white} />
                           </TouchableOpacity>
                        )}
                        {photo.is_primary && (
                           <View style={[styles.actionButton, styles.primaryBadge]}>
                              <Ionicons
                                 name="checkmark-circle"
                                 size={20}
                                 color={COLORS.white}
                              />
                           </View>
                        )}
                     </View>
                  </LinearGradient>
               </TouchableOpacity>,
            )
         } else {
            slots.push(
               <TouchableOpacity key={i} style={styles.addButton} onPress={pickImage}>
                  <Ionicons name="add" size={32} color={COLORS.secondary} />
               </TouchableOpacity>,
            )
         }
      }
      return slots
   }, [userPhotos])

   return (
      <View style={styles.container}>
         <LinearGradient
            colors={[
               COLORS.white,
               Platform.OS === 'ios' ? `${COLORS.primary}10` : `${COLORS.primary}40`,
            ]}
            style={StyleSheet.absoluteFillObject}
         />
         <View style={styles.content}>
            <View style={styles.header}>
               <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
               >
                  <Ionicons name="arrow-back" size={26} color={COLORS.white} />
               </TouchableOpacity>
               <Text style={styles.title}>Your Photos</Text>
               <Text style={styles.subtitle}>
                  Add up to 6 photos to show your best self. Tap a photo to view or edit.
               </Text>
            </View>

            <ScrollView
               showsVerticalScrollIndicator={false}
               contentContainerStyle={styles.scrollContent}
            >
               <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                     <Text style={styles.statNumber}>{userPhotos.length}/6</Text>
                     <Text style={styles.statLabel}>Photos Added</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                     <Text style={styles.statNumber}>
                        {userPhotos.find((p: any) => p.is_primary) ? 'Yes' : 'No'}
                     </Text>
                     <Text style={styles.statLabel}>Primary Set</Text>
                  </View>
               </View>

               <View style={styles.imageGrid}>{renderImageSlots()}</View>

               <View style={styles.tipsContainer}>
                  <View style={styles.tipHeader}>
                     <Ionicons name="bulb" size={24} color={COLORS.primary} />
                     <Text style={styles.tipsTitle}>Photo Tips</Text>
                  </View>
                  <View style={styles.tipsList}>
                     <View style={styles.tipItem}>
                        <Ionicons
                           name="checkmark-circle"
                           size={16}
                           color={COLORS.alertSuccess}
                        />
                        <Text style={styles.tipText}>Clear face photo as primary</Text>
                     </View>
                     <View style={styles.tipItem}>
                        <Ionicons
                           name="checkmark-circle"
                           size={16}
                           color={COLORS.alertSuccess}
                        />
                        <Text style={styles.tipText}>Mix of close-up and full body</Text>
                     </View>
                     <View style={styles.tipItem}>
                        <Ionicons
                           name="checkmark-circle"
                           size={16}
                           color={COLORS.alertSuccess}
                        />
                        <Text style={styles.tipText}>
                           Show your interests & personality
                        </Text>
                     </View>
                  </View>
               </View>
            </ScrollView>

            <ShowImageModal
               visible={isImageViewVisible}
               imageUrl={selectedPhoto?.photo_url || ''}
               photoId={selectedPhoto?.id || ''}
               onClose={() => {
                  setIsImageViewVisible(false)
                  setSelectedPhoto(null)
               }}
               onDelete={handleDeletePhoto}
               onSetAsPrimary={handleSetPrimary}
               cloudinaryId={selectedPhoto?.cloudinary_id || ''}
               isPrimary={selectedPhoto?.is_primary || false}
            />

            <AlertModal
               visible={isAlertModalVisible}
               title="Error"
               message="Image size too large. Please choose a smaller image."
               iconName="alert-circle"
               color={COLORS.alertFail}
               onClose={() => setIsAlertModalVisible(false)}
            />

            <AlertModal
               visible={isAlertModalVisible2}
               title="Sorry"
               message="Minimum 1 photo required"
               iconName="alert-circle"
               color={COLORS.alertFail}
               onClose={() => setIsAlertModalVisible2(false)}
            />

            <AlertModal
               visible={isAlertModalVisible3}
               title="Sorry"
               message="You cannot delete primary photo, change another photo as primary first"
               iconName="alert-circle"
               color={COLORS.alertFail}
               onClose={() => setIsAlertModalVisible3(false)}
            />
         </View>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: COLORS.white,
   },
   content: {
      flex: 1,
      paddingTop: 30,
      zIndex: 1,
   },
   header: {
      padding: 20,
      paddingBottom: 15,
   },
   scrollContent: {
      padding: 20,
      paddingTop: 0,
      gap: 25,
   },
   backButton: {
      marginBottom: 15,
      backgroundColor: COLORS.primary,
      borderRadius: 100,
      padding: 10,
      width: 45,
      height: 45,
      justifyContent: 'center',
      alignItems: 'center',
   },
   backButtonGradient: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
   },
   title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: COLORS.black,
      marginBottom: 10,
   },
   subtitle: {
      fontSize: 16,
      color: COLORS.textColor,
      lineHeight: 24,
   },
   statsContainer: {
      flexDirection: 'row',
      backgroundColor: COLORS.white,
      borderRadius: 16,
      padding: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
   },
   statItem: {
      flex: 1,
      alignItems: 'center',
   },
   statDivider: {
      width: 1,
      backgroundColor: COLORS.border + '30',
      marginHorizontal: 15,
   },
   statNumber: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.primary,
      marginBottom: 5,
   },
   statLabel: {
      fontSize: 14,
      color: COLORS.textColor,
   },
   imageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 12,
   },
   imageContainer: {
      width: '48%',
      aspectRatio: 1,
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      backgroundColor: COLORS.white,
   },
   image: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
   },
   imageOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: '40%',
      justifyContent: 'flex-end',
      padding: 8,
   },
   photoActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: 8,
   },
   actionButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
   },
   deleteButton: {
      backgroundColor: COLORS.alertFail + '80',
   },
   primaryButton: {
      backgroundColor: COLORS.primary + '80',
   },
   primaryBadge: {
      backgroundColor: COLORS.alertSuccess + '80',
   },
   addButton: {
      width: '48%',
      height: '30%',
      aspectRatio: 1,
      backgroundColor: COLORS.white,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 16,
      borderWidth: 2,
      borderColor: COLORS.primary,
      borderStyle: 'dashed',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 2,
   },
   tipsContainer: {
      borderRadius: 16,
      padding: 15,
      backgroundColor: COLORS.white,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginBottom: 20,
   },
   tipHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
      gap: 8,
   },
   tipsTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: COLORS.primary,
   },
   tipsList: {
      gap: 8,
   },
   tipItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
   },
   tipText: {
      fontSize: 14,
      color: COLORS.textColor,
   },
})

export default ManagePhotos
