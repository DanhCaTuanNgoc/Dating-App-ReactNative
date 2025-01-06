import {
   View,
   Text,
   StyleSheet,
   TouchableOpacity,
   TextInput,
   ScrollView,
   KeyboardAvoidingView,
   Platform,
   Alert,
} from 'react-native'
import { COLORS, SIZES } from '../../constants/theme'
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getEducationAndRelationship, updateUserInfo } from '../../store/user/userAction'
import DateTimePicker from '@react-native-community/datetimepicker'

function EditProfile({ navigation }: { navigation: any }) {
   const {
      education: educationQuery,
      relationship: relationshipQuery,
      userInfo,
      userId,
   } = useSelector((state: any) => state.userState)

   const [name, setName] = useState(userInfo?.name)
   const [bio, setBio] = useState(userInfo?.bio)
   const [education, setEducation] = useState(userInfo?.education_id)
   const [relationshipGoal, setRelationshipGoal] = useState(
      userInfo?.relationship_goal_id,
   )
   const [occupation, setOccupation] = useState(userInfo?.job_title)
   const [birthDate, setBirthDate] = useState(new Date(userInfo?.birth_date))
   const [showDatePicker, setShowDatePicker] = useState(false)
   const [gender, setGender] = useState(userInfo?.gender)
   const dispatch: any = useDispatch()

   const genderOptions = [
      { id: 1, name: 'Male' },
      { id: 2, name: 'Female' },
      { id: 3, name: 'Other' },
      { id: 4, name: 'Prefer not to say' },
   ]

   useEffect(() => {
      dispatch(getEducationAndRelationship())
   }, [])

   const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-GB', {
         day: '2-digit',
         month: '2-digit',
         year: 'numeric',
      })
   }

   const handleDateChange = (event: any, selectedDate?: Date) => {
      if (selectedDate) {
         setBirthDate(selectedDate)
      }
   }

   const handleSave = async () => {
      try {
         console.log(
            userId,
            name,
            birthDate,
            gender,
            bio,
            education,
            occupation,
            relationshipGoal,
         )
         await dispatch(
            updateUserInfo(
               userId,
               name,
               birthDate,
               gender,
               bio,
               education,
               occupation,
               relationshipGoal,
            ),
         )
         navigation.goBack()
         Alert.alert('Success', 'User info updated successfully')
      } catch (error) {
         console.error('Error saving user info:', error)
      }
   }

   const onDateChange = (event: any, selectedDate?: Date) => {
      setShowDatePicker(false)
      if (selectedDate) {
         setBirthDate(selectedDate)
      }
   }

   return (
      <KeyboardAvoidingView
         style={styles.container}
         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
         keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
         <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
               <Ionicons name="arrow-back" size={24} color={COLORS.black} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSave}>
               <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
         </View>

         <ScrollView style={styles.form}>
            <View style={styles.inputContainer}>
               <Text style={styles.label}>Name</Text>
               <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
               />
            </View>

            <View style={styles.inputContainer}>
               <Text style={styles.label}>Bio</Text>
               <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Write something about yourself"
                  placeholderTextColor={COLORS.border}
                  multiline
                  numberOfLines={4}
               />
            </View>

            <View style={styles.inputContainer}>
               <Text style={styles.label}>Occupation</Text>
               <TextInput
                  style={styles.input}
                  value={occupation}
                  onChangeText={setOccupation}
                  placeholder="Enter your occupation"
               />
            </View>
            <Text style={styles.label}>Birth date</Text>
            <View style={styles.dateInputContainer}>
               <TextInput
                  style={styles.dateInput}
                  value={formatDate(birthDate)}
                  placeholder="Select your birth date"
                  placeholderTextColor="#999"
                  editable={false}
               />
               <DateTimePicker
                  style={styles.calendarButton}
                  value={birthDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
               />
            </View>

            <View style={styles.inputContainer}>
               <Text style={styles.label}>Gender</Text>
               <View style={styles.optionsContainer}>
                  {genderOptions.map((gen) => (
                     <TouchableOpacity
                        key={gen.id}
                        style={[
                           styles.optionButton,
                           gender === gen.name && styles.selectedOption,
                        ]}
                        onPress={() => setGender(gen.name)}
                     >
                        <Text
                           style={[
                              styles.optionText,
                              gender === gen.name && styles.selectedOptionText,
                           ]}
                        >
                           {gen.name}
                        </Text>
                     </TouchableOpacity>
                  ))}
               </View>
            </View>

            <View style={styles.inputContainer}>
               <Text style={styles.label}>Education</Text>
               <View style={styles.optionsContainer}>
                  {educationQuery.map((edu: any) => (
                     <TouchableOpacity
                        key={edu.id}
                        style={[
                           styles.optionButton,
                           education == edu.id && styles.selectedOption,
                        ]}
                        onPress={() => {
                           setEducation(edu.id)
                        }}
                     >
                        <Text
                           style={[
                              styles.optionText,
                              education == edu.id && styles.selectedOptionText,
                           ]}
                        >
                           {edu.level}
                        </Text>
                     </TouchableOpacity>
                  ))}
               </View>
            </View>

            <View style={styles.inputContainer}>
               <Text style={styles.label}>Relationship Goal</Text>
               <View style={styles.optionsContainer}>
                  {relationshipQuery.map((rel: any) => (
                     <TouchableOpacity
                        key={rel.id}
                        style={[
                           styles.optionButton,
                           relationshipGoal === rel.id && styles.selectedOption,
                        ]}
                        onPress={() => {
                           setRelationshipGoal(rel.id)
                        }}
                     >
                        <Text
                           style={[
                              styles.optionText,
                              relationshipGoal === rel.id && styles.selectedOptionText,
                           ]}
                        >
                           {rel.goal}
                        </Text>
                     </TouchableOpacity>
                  ))}
               </View>
            </View>
         </ScrollView>
      </KeyboardAvoidingView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: COLORS.white,
   },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: SIZES.medium,
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
      marginTop: 40,
   },
   headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: COLORS.black,
   },
   saveButton: {
      color: COLORS.tertiary,
      fontSize: 16,
      fontWeight: '600',
   },
   form: {
      padding: SIZES.medium,
   },
   inputContainer: {
      marginBottom: SIZES.medium,
   },
   label: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
      color: COLORS.black,
   },
   input: {
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: 8,
      padding: SIZES.small,
      fontSize: 16,
   },
   bioInput: {
      height: 100,
      textAlignVertical: 'top',
   },
   optionsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      paddingVertical: 5,
   },
   optionButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.border,
      backgroundColor: COLORS.white,
      marginBottom: 8,
   },
   selectedOption: {
      backgroundColor: COLORS.tertiary,
      borderColor: COLORS.tertiary,
   },
   optionText: {
      color: COLORS.black,
      fontSize: 14,
   },
   selectedOptionText: {
      color: COLORS.white,
   },

   dateInputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
   },
   dateInput: {
      flex: 1,
      height: 50,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: 12,
      paddingHorizontal: 15,
      fontSize: 16,
      backgroundColor: COLORS.white,
   },
   calendarButton: {
      position: 'absolute',
      right: 12,
      paddingHorizontal: 8,
   },
})

export default EditProfile
