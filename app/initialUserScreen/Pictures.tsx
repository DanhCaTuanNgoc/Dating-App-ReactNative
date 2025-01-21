import { View, Image, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { useSelector } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/theme'
import { getUserInfo, getUserPhotos, uploadImage } from '../../store/user/userAction'
import { setUserInfo } from '@/store/user/userReducer'
import { setUserPhotos } from '@/store/user/userReducer'
import { UseDispatch } from 'react-redux'
import { useDispatch } from 'react-redux'

function Pictures({ navigation }: any) {
   const [localImages, setLocalImages] = useState<{ uri: string; base64: string }[]>([])
   const { userId } = useSelector((state: any) => state.userState)
   const dispatch: any = useDispatch()
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
                  Alert.alert(
                     'Error',
                     'Image size too large. Please choose a smaller image.',
                  )
                  return
               }

               setLocalImages([
                  ...localImages,
                  {
                     uri: manipulatedImage.uri,
                     base64: manipulatedImage.base64,
                  },
               ])
            }
         }
      } catch (error) {
         console.error('Image picker error:', error)
         Alert.alert('Error', 'Failed to pick image. Please try again.')
      }
   }

   const handleNext = async () => {
      if (localImages.length < 1) {
         Alert.alert('Error', 'Please add at least 1 photo')
         return
      }

      try {
         navigation.navigate('HomeTab')
         // Upload tất cả ảnh
         await Promise.all(
            localImages.map(async (image, index) => {
               await uploadImage(userId, image.base64, index === 0)(dispatch)
            }),
         )
         // Lấy thông tin user và photos mới, cập nhật state
         await getUserInfo(userId)(dispatch)
         await getUserPhotos(userId)(dispatch)
      } catch (error) {
         console.error('Upload error:', error)
         Alert.alert('Error', 'Failed to upload images. Please try again.')
      }
   }

   const removeImage = (index: number) => {
      const newImages = [...localImages]
      newImages.splice(index, 1)
      setLocalImages(newImages)
   }

   const renderImageSlots = () => {
      const slots = []
      for (let i = 0; i < 6; i++) {
         if (i < localImages.length) {
            slots.push(
               <View key={i} style={styles.imageContainer}>
                  <Image source={{ uri: localImages[i].uri }} style={styles.image} />
                  <TouchableOpacity
                     style={styles.removeButton}
                     onPress={() => removeImage(i)}
                  >
                     <Ionicons name="close-circle" size={24} color="white" />
                  </TouchableOpacity>
               </View>,
            )
         } else {
            slots.push(
               <TouchableOpacity key={i} style={styles.addButton} onPress={pickImage}>
                  <Ionicons name="add" size={32} color={COLORS.primary} />
               </TouchableOpacity>,
            )
         }
      }
      return slots
   }

   return (
      <SafeAreaView style={styles.container}>
         <View style={styles.content}>
            <View style={styles.header}>
               <Text style={styles.title}>Time to put a face to the name</Text>
               <Text style={styles.subtitle}>
                  You do you! Add at least 4 photos, whether it's you with your pet,
                  eating your fave food, or in a place you love.
               </Text>
            </View>

            <View style={styles.imageGrid}>{renderImageSlots()}</View>

            <View style={styles.footer}>
               <View style={styles.footerContent}>
                  <TouchableOpacity style={styles.photoTipsButton}>
                     <View style={styles.iconContainer}>
                        <Ionicons name="camera" size={24} color={COLORS.primary} />
                     </View>
                     <View style={styles.tipsTextContainer}>
                        <Text style={styles.tipsText}>
                           Want to make sure you really shine?
                        </Text>
                        <Text style={styles.tipsLink}>Check out our photo tips</Text>
                     </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                     style={[
                        styles.nextButton,
                        localImages.length < 1 && styles.disabledButton,
                     ]}
                     onPress={handleNext}
                  >
                     <Ionicons name="chevron-forward" size={30} color="white" />
                  </TouchableOpacity>
               </View>
            </View>
         </View>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: COLORS.white,
      paddingHorizontal: 20,
      paddingVertical: 50,
   },
   content: {
      flex: 1,
   },
   header: {
      marginBottom: 35,
   },
   title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 15,
      color: '#333',
   },
   subtitle: {
      fontSize: 16,
      color: '#666',
      lineHeight: 24,
   },
   imageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 20,
   },
   imageContainer: {
      width: '31%',
      height: 200,
      aspectRatio: 1,
      marginBottom: 15,
      borderRadius: 16,
      overflow: 'hidden',
      position: 'relative',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
   },
   image: {
      width: '100%',
      height: '100%',
   },
   removeButton: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 12,
      padding: 4,
   },
   addButton: {
      width: '31%',
      height: 200,
      aspectRatio: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 16,
      marginBottom: 15,
      borderWidth: 2,
      borderColor: COLORS.tertiary,
      borderStyle: 'dashed',
   },
   footer: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      paddingVertical: 20,
   },
   footerContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   photoTipsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      paddingLeft: 0,
      borderRadius: 12,
      flex: 1,
      marginRight: 15,
   },
   iconContainer: {
      backgroundColor: 'white',
      padding: 8,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
   },
   tipsTextContainer: {
      marginLeft: 15,
      flex: 1,
   },
   tipsText: {
      fontSize: 14,
      color: '#666',
      marginBottom: 2,
   },
   tipsLink: {
      fontSize: 14,
      fontWeight: 'bold',
      color: COLORS.primary,
   },
   nextButton: {
      backgroundColor: COLORS.primary,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
   },
   disabledButton: {
      backgroundColor: '#ddd',
   },
})

export default Pictures
