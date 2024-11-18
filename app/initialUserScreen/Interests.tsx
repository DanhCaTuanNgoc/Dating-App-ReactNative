import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import { initialUserInterests } from '../../store/user/userAction'
import { COLORS } from '../../constants/theme'

function Interests({ navigation }: { navigation: any }) {
   const [selectedInterests, setSelectedInterests] = useState<object[]>([])
   const [showAlert, setShowAlert] = useState(false)
   const dispatch: any = useDispatch()
   const { userId } = useSelector((state: any) => state.userState)

   const interests: object[] = [
      { name: 'Travel', id: 1, icon: 'airplane' },
      { name: 'Music', id: 2, icon: 'musical-notes' },
      { name: 'Movies', id: 3, icon: 'film' },
      { name: 'Sports', id: 4, icon: 'basketball' },
      { name: 'Food', id: 5, icon: 'restaurant' },
      { name: 'Art', id: 6, icon: 'color-palette' },
      { name: 'Reading', id: 7, icon: 'book' },
      { name: 'Gaming', id: 8, icon: 'game-controller' },
      { name: 'Fitness', id: 9, icon: 'fitness' },
      { name: 'Photography', id: 10, icon: 'camera' },
      { name: 'Dancing', id: 11, icon: 'musical-note' },
      { name: 'Cooking', id: 12, icon: 'restaurant-outline' },
      { name: 'Nature', id: 13, icon: 'leaf' },
      { name: 'Technology', id: 14, icon: 'laptop' },
      { name: 'Pets', id: 15, icon: 'paw' },
   ]

   const toggleInterest = (interest: object) => {
      if (!selectedInterests.find((item) => (item as any).id === (interest as any).id)) {
         setSelectedInterests([...selectedInterests, interest])
      } else {
         setSelectedInterests(
            selectedInterests.filter((item) => (item as any).id !== (interest as any).id),
         )
      }
   }

   const handleContinue = async () => {
      if (selectedInterests.length > 0) {
         console.log(selectedInterests, userId)
         await dispatch(initialUserInterests(userId, selectedInterests))
         navigation.navigate('Pictures')
      } else {
         setShowAlert(true)
      }
   }

   return (
      <SafeAreaView style={styles.container}>
         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
         </TouchableOpacity>

         <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Your Interests</Text>
            <Text style={styles.headerSubtitle}>Choose any interests that match you</Text>
         </View>

         <ScrollView
            style={styles.interestsContainer}
            showsVerticalScrollIndicator={false}
         >
            <View style={styles.interestsGrid}>
               {interests.map((interest: any) => (
                  <TouchableOpacity
                     key={interest.id}
                     style={[
                        styles.interestItem,
                        selectedInterests.find(
                           (item) => (item as any).id === interest.id,
                        ) && styles.selectedInterest,
                     ]}
                     onPress={() => toggleInterest(interest)}
                  >
                     <Ionicons
                        name={interest.icon}
                        size={20}
                        color={
                           selectedInterests.find(
                              (item) => (item as any).id === interest.id,
                           )
                              ? COLORS.textColor
                              : '#666'
                        }
                        style={styles.interestIcon}
                     />
                     <Text
                        style={[
                           styles.interestText,
                           selectedInterests.find(
                              (item) => (item as any).id === interest.id,
                           ) && styles.selectedInterestText,
                        ]}
                     >
                        {interest.name}
                     </Text>
                  </TouchableOpacity>
               ))}
            </View>
         </ScrollView>

         <TouchableOpacity style={[styles.continueButton]} onPress={handleContinue}>
            <Text style={styles.continueButtonText}>Continue</Text>
         </TouchableOpacity>
         <TouchableOpacity onPress={() => navigation.navigate('Pictures')}>
            <Text>Skip</Text>
         </TouchableOpacity>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: COLORS.backgroundContent,
      padding: 20,
   },
   backButton: {
      marginBottom: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.backgroundButton,
   },
   header: {
      marginTop: 0,
      marginBottom: 10,
   },
   headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 8,
      color: COLORS.textColor,
   },
   headerSubtitle: {
      fontSize: 16,
      color: '#666',
      marginBottom: 10,
   },
   selectedCount: {
      fontSize: 14,
      color: '#333',
      fontWeight: '600',
   },
   interestsContainer: {
      flex: 1,
      marginBottom: 10,
   },
   interestsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingVertical: 10,
   },
   interestItem: {
      width: '31%',
      padding: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#eee',
      marginBottom: 12,
      alignItems: 'center',
      backgroundColor: COLORS.white,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 2,
   },
   selectedInterest: {
      backgroundColor: '#f5f5f5',
      borderColor: COLORS.textColor,
   },
   interestIcon: {
      marginBottom: 6,
   },
   interestText: {
      fontSize: 12,
      color: '#666',
      fontWeight: '500',
   },
   selectedInterestText: {
      color: '#333',
      fontWeight: '600',
   },
   continueButton: {
      backgroundColor: COLORS.backgroundButton,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 30,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
   },
   disabledButton: {
      backgroundColor: '#eee',
   },
   continueButtonText: {
      color: '#333',
      fontSize: 16,
      fontWeight: 'bold',
   },
})

export default Interests
