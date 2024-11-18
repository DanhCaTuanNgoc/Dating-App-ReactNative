import { View, Image, TouchableOpacity, StyleSheet, Alert, Text } from 'react-native'
import { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'
import { useSelector } from 'react-redux'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants/theme'
import { uploadImage } from '../../store/user/userAction'

function Pictures({ navigation }: any) {
   const [images, setImages] = useState<string[]>([])
   const { userId } = useSelector((state: any) => state.userState)

   const pickImage = async () => {
      try {
         const result: any = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
            base64: true,
         })

         if (!result.canceled) {
            const uploadResult = await uploadImage(userId, result.assets[0].base64)
            if (uploadResult && uploadResult.photo_url) {
               setImages([...images, uploadResult.photo_url])
            } else {
               throw new Error('Invalid upload response')
            }
         }
      } catch (error) {
         console.error('Upload error:', error)
         Alert.alert('Error', 'Failed to upload image')
      }
   }

   const renderImageSlots = () => {
      const slots = []
      for (let i = 0; i < 6; i++) {
         if (i < images.length) {
            slots.push(
               <View key={i} style={styles.imageContainer}>
                  <Image source={{ uri: images[i] }} style={styles.image} />
               </View>,
            )
         } else {
            slots.push(
               <TouchableOpacity key={i} style={styles.addButton} onPress={pickImage}>
                  <Ionicons name="add" size={24} color="#999" />
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
               <TouchableOpacity style={styles.photoTipsButton}>
                  <Ionicons name="camera" size={24} color="black" />
                  <View style={styles.tipsTextContainer}>
                     <Text style={styles.tipsText}>
                        Want to make sure you really shine?
                     </Text>
                     <Text style={styles.tipsLink}>Check out our photo tips</Text>
                  </View>
               </TouchableOpacity>
               <TouchableOpacity
                  style={[styles.nextButton]}
                  onPress={() => navigation.navigate('NextScreen')}
               >
                  <Ionicons name="chevron-forward" size={30} color="white" />
               </TouchableOpacity>
            </View>
         </View>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: COLORS.backgroundContent,
      paddingHorizontal: 20,
      paddingVertical: 20,
   },
   content: {
      flex: 1,
   },
   header: {
      marginBottom: 30,
   },
   title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 10,
   },
   subtitle: {
      fontSize: 16,
      color: '#666',
      lineHeight: 22,
   },
   imageGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 20,
   },
   imageContainer: {
      width: '31%',
      aspectRatio: 1,
      marginBottom: 12,
      borderRadius: 12,
      overflow: 'hidden',
   },
   image: {
      width: '100%',
      height: '100%',
   },
   addButton: {
      width: '31%',
      aspectRatio: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: '#ddd',
   },
   footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
   },
   photoTipsButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 10,
   },
   tipsTextContainer: {
      marginLeft: 15,
   },
   tipsText: {
      fontSize: 14,
      color: '#666',
   },
   tipsLink: {
      fontSize: 14,
      fontWeight: 'bold',
      color: 'black',
   },
   nextButton: {
      backgroundColor: COLORS.backgroundButton,
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
   },
   disabledButton: {
      backgroundColor: '#ddd',
   },
})

export default Pictures
