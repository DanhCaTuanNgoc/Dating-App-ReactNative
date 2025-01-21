import {
   View,
   Modal,
   StyleSheet,
   TouchableOpacity,
   Dimensions,
   Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ImageViewer from 'react-native-image-zoom-viewer'

function ShowImageModal({
   visible,
   imageUrl,
   onClose,
   onDelete,
   onSetAsPrimary,
   photoId,
   cloudinaryId,
   isPrimary,
}: {
   visible: boolean
   imageUrl: string
   onClose: () => void
   onDelete: (photoId: string, isPrimary: boolean) => void
   onSetAsPrimary: (photoId: string) => void
   photoId: string
   cloudinaryId: string
   isPrimary: boolean
}) {
   const screenWidth = Dimensions.get('window').width
   const screenHeight = Dimensions.get('window').height

   const handleDelete = (isPrimary: boolean) => {
      Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
         {
            text: 'Cancel',
            style: 'cancel',
         },
         {
            text: 'Delete',
            onPress: () => {
               onClose()
               onDelete(photoId, isPrimary)
            },
            style: 'destructive',
         },
      ])
   }

   const handleSetAsProfile = () => {
      Alert.alert(
         'Set as Profile Photo',
         'Do you want to set this as your profile photo?',
         [
            {
               text: 'Cancel',
               style: 'cancel',
            },
            {
               text: 'Set',
               onPress: () => {
                  onClose()
                  onSetAsPrimary(photoId)
               },
            },
         ],
      )
   }

   return (
      <Modal
         visible={visible}
         transparent={true}
         animationType="fade"
         onRequestClose={onClose}
      >
         <View style={styles.container}>
            <TouchableOpacity
               style={styles.settingsButton}
               onPress={() => {
                  Alert.alert('Photo Options', 'Choose an action', [
                     {
                        text: 'Delete Photo',
                        onPress: () => handleDelete(isPrimary),
                        style: 'destructive',
                     },
                     {
                        text: 'Set as Profile Photo',
                        onPress: handleSetAsProfile,
                     },
                     {
                        text: 'Cancel',
                        style: 'cancel',
                     },
                  ])
               }}
            >
               <Ionicons name="ellipsis-vertical" size={26} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
               <Ionicons name="close" size={26} color="#fff" />
            </TouchableOpacity>

            <ImageViewer
               imageUrls={[{ url: imageUrl }]}
               enableSwipeDown={true}
               onSwipeDown={onClose}
               swipeDownThreshold={50}
               enablePreload
               saveToLocalByLongPress={false}
               backgroundColor="black"
               renderIndicator={() => <></>}
               renderHeader={() => <></>}
               renderFooter={() => <></>}
               style={{
                  width: screenWidth,
                  height: screenHeight,
               }}
            />
         </View>
      </Modal>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: 'black',
   },
   closeButton: {
      position: 'absolute',
      top: 50,
      left: 20,
      padding: 10,
      zIndex: 2,
   },
   settingsButton: {
      position: 'absolute',
      top: 50,
      right: 20,
      padding: 10,
      zIndex: 2,
   },
})

export default ShowImageModal
