import { Modal, View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { COLORS, SIZES } from '@/constants/theme'
import { LinearGradient } from 'expo-linear-gradient'
import { useNavigation } from '@react-navigation/native'
import { useSelector } from 'react-redux'

interface MatchModalProps {
   visible: boolean
   onClose: () => void
   matchedUser: {
      name: string
      avatar_url: string
      matched_at: string
   }
   navigation: any
}

function MatchModal({ visible, onClose, matchedUser, navigation }: MatchModalProps) {
   const userPhotos = useSelector((state: any) => state.userState.userPhotos)

   // Convert ISO string back to Date when needed for display
   const matchDate = new Date(matchedUser.matched_at)

   return (
      <Modal visible={visible} transparent animationType="fade">
         <LinearGradient
            colors={[COLORS.primary + '90', COLORS.secondary + '90']}
            style={styles.container}
         >
            <View style={styles.content}>
               <Text style={styles.title}>It's a Match!</Text>
               <Text style={styles.subtitle}>
                  You and {matchedUser.name} liked each other
               </Text>

               <View style={styles.avatars}>
                  <Image source={{ uri: matchedUser.avatar_url }} style={styles.avatar} />
                  <Image
                     source={{ uri: userPhotos[0]?.photo_url }}
                     style={styles.avatar}
                  />
               </View>

               <TouchableOpacity
                  style={styles.messageButton}
                  onPress={() => {
                     onClose()
                     navigation.navigate('Chat')
                  }}
               >
                  <Text style={styles.buttonText}>Send Message</Text>
               </TouchableOpacity>

               <TouchableOpacity style={styles.keepSwipingButton} onPress={onClose}>
                  <Text style={styles.buttonText}>Keep Swiping</Text>
               </TouchableOpacity>
            </View>
         </LinearGradient>
      </Modal>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
   },
   content: {
      backgroundColor: 'white',
      padding: SIZES.large,
      borderRadius: 20,
      alignItems: 'center',
      width: '80%',
   },
   title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: COLORS.primary,
      marginBottom: SIZES.small,
   },
   subtitle: {
      fontSize: 16,
      color: COLORS.primary,
      marginBottom: SIZES.medium,
      textAlign: 'center',
   },
   avatars: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: SIZES.medium,
      marginBottom: SIZES.large,
   },
   avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      borderWidth: 2,
      borderColor: COLORS.primary,
   },
   messageButton: {
      backgroundColor: COLORS.primary,
      paddingVertical: SIZES.small,
      paddingHorizontal: SIZES.large,
      borderRadius: 25,
      width: '100%',
      marginBottom: SIZES.small,
   },
   keepSwipingButton: {
      backgroundColor: COLORS.secondary,
      paddingVertical: SIZES.small,
      paddingHorizontal: SIZES.large,
      borderRadius: 25,
      width: '100%',
   },
   buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
   },
})

export default MatchModal
