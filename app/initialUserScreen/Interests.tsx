import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { useDispatch, useSelector } from 'react-redux'
import { initialUserInterests } from '../../store/user/userAction'

function Interests({ navigation }: { navigation: any }) {
   const [selectedInterests, setSelectedInterests] = useState<object[]>([])
   const dispatch: any = useDispatch()
   const { userId } = useSelector((state: any) => state.userState)

   const interests: object[] = [
      { name: "Travel", id: 1 },
      { name: "Music", id: 2 },
      { name: "Movies", id: 3 },
      { name: "Sports", id: 4 },
      { name: "Food", id: 5 },
      { name: "Art", id: 6 },
      { name: "Reading", id: 7 },
      { name: "Gaming", id: 8 },
      { name: "Fitness", id: 9 },
      { name: "Photography", id: 10 },
      { name: "Dancing", id: 11 },
      { name: "Cooking", id: 12 },
      { name: "Nature", id: 13 },
      { name: "Technology", id: 14 },
      { name: "Pets", id: 15 }
   ]

   const toggleInterest = (interest: object) => {
      if (selectedInterests.find((item: any) => item.id === (interest as any).id)) {
         setSelectedInterests(selectedInterests.filter((item: any) => item.id !== (interest as any).id))
      } else {
         if (selectedInterests.length < 5) {
            setSelectedInterests([...selectedInterests, interest])
         } else {
            Alert.alert('Maximum 5 interests allowed')
         }
      }
   }

   const handleContinue = async () => {
      if (selectedInterests.length > 0) {
         await dispatch(initialUserInterests(userId, selectedInterests))
         navigation.navigate('Home')
      } else {
         Alert.alert('Please select at least one interest')
      }
   }

   return (
      <SafeAreaView style={styles.container}>
         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
         </TouchableOpacity>

         <View style={styles.header}>
            <Text style={styles.headerTitle}>Select Your Interests</Text>
            <Text style={styles.headerSubtitle}>Choose up to 5 interests that match you</Text>
         </View>

         <ScrollView style={styles.interestsContainer}>
            <View style={styles.interestsGrid}>
               {interests.map((interest: any) => (
                  <TouchableOpacity
                     key={interest.id}
                     style={[
                        styles.interestItem,
                        selectedInterests.find(item => (item as any).id === interest.id) && styles.selectedInterest
                     ]}
                     onPress={() => toggleInterest(interest)}
                  >
                     <Text style={[
                        styles.interestText,
                        selectedInterests.find(item => (item as any).id === interest.id) && styles.selectedInterestText
                     ]}>
                        {interest.name}
                     </Text>
                  </TouchableOpacity>
               ))}
            </View>
         </ScrollView>

         <TouchableOpacity 
            style={[styles.continueButton, selectedInterests.length === 0 && styles.disabledButton]} 
            onPress={handleContinue}
            disabled={selectedInterests.length === 0}
         >
            <Text style={styles.continueButtonText}>Continue</Text>
         </TouchableOpacity>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#FFFAF0',
      padding: 20,
   },
   backButton: {
      position: 'absolute',
      top: 50,
      left: 20,
      zIndex: 1,
   },
   header: {
      marginTop: 60,
      marginBottom: 30,
   },
   headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFA07A',
      marginBottom: 10,
   },
   headerSubtitle: {
      fontSize: 16,
      color: '#FFB6C1',
   },
   interestsContainer: {
      flex: 1,
      marginBottom: 20,
   },
   interestsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingVertical: 10,
   },
   interestItem: {
      width: '48%',
      padding: 15,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#FFE4B5',
      marginBottom: 15,
      alignItems: 'center',
      backgroundColor: '#FFF5EE',
   },
   selectedInterest: {
      backgroundColor: '#FFA07A',
      borderColor: '#FFA07A',
   },
   interestText: {
      fontSize: 16,
      color: '#FFA07A',
   },
   selectedInterestText: {
      color: '#fff',
   },
   continueButton: {
      backgroundColor: '#FFA07A',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: 20,
   },
   disabledButton: {
      backgroundColor: '#FFE4E1',
   },
   continueButtonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
   },
})

export default Interests