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
import { useEffect, useState, useCallback, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
   getEducationAndRelationship,
   updateUserInfo,
   getUserInfo,
} from '../../store/user/userAction'
import DateTimePicker from '@react-native-community/datetimepicker'
import AlertModal from '@/components/AlertModal'

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
   const [popup, setPopup] = useState(false)
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

   const formatDate = useCallback(
      (date: Date) => {
         return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
         })
      },
      [birthDate],
   )

   const handleDateChange = useCallback((event: any, selectedDate?: Date) => {
      if (Platform.OS === 'android') {
         setShowDatePicker(false)
      }

      if (selectedDate) {
         setBirthDate(selectedDate)
      }
   }, [])

   const handleSave = async () => {
      try {
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
         await dispatch(getUserInfo(userId))
         setPopup(true)
      } catch (error) {
         console.error('Error saving user info:', error)
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
                  placeholderTextColor={'#999'}
                  multiline
                  numberOfLines={4}
                  maxLength={60}
               />
            </View>

            <View style={styles.inputContainer}>
               <Text style={styles.label}>Occupation</Text>
               <TextInput
                  style={styles.input}
                  value={occupation}
                  onChangeText={setOccupation}
                  placeholder="Enter your occupation"
                  placeholderTextColor={'#999'}
               />
            </View>
            <View style={styles.inputContainer}>
               <Text style={styles.label}>Birth date</Text>
               <View style={styles.dateInputContainer}>
                  {Platform.OS === 'ios' ? (
                     <Fragment>
                        <TextInput
                           style={styles.dateInput}
                           value={formatDate(birthDate)}
                           editable={false}
                           placeholder="DD/MM/YYYY"
                           placeholderTextColor="#999"
                        />
                        <DateTimePicker
                           value={birthDate}
                           mode="date"
                           display="default"
                           onChange={handleDateChange}
                           maximumDate={new Date()}
                           style={styles.iosDatePicker}
                           themeVariant="light"
                        />
                     </Fragment>
                  ) : (
                     <Fragment>
                        <TextInput
                           style={styles.dateInput}
                           value={formatDate(birthDate)}
                           editable={false}
                           placeholder="DD/MM/YYYY"
                           placeholderTextColor="#999"
                        />
                        <TouchableOpacity
                           style={styles.dateButton}
                           onPress={() => setShowDatePicker(true)}
                        >
                           <Ionicons
                              name="calendar-outline"
                              size={24}
                              color={COLORS.tertiary}
                           />
                        </TouchableOpacity>

                        {showDatePicker && (
                           <DateTimePicker
                              value={birthDate}
                              mode="date"
                              display="default"
                              onChange={handleDateChange}
                              maximumDate={new Date()}
                           />
                        )}
                     </Fragment>
                  )}
               </View>
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

         <AlertModal
            visible={popup}
            onClose={() => setPopup(false)}
            title="Success"
            message="User info updated successfully"
            iconName="checkmark-circle"
            color={COLORS.alertSuccess}
         />
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
      position: 'relative',
   },
   dateInput: {
      flex: 1,
      height: 50,
      borderWidth: 1,
      borderColor: COLORS.border,
      borderRadius: 12,
      paddingHorizontal: 15,
      fontSize: 16,
      position: 'relative',
      backgroundColor: COLORS.white,
   },
   dateText: {
      color: COLORS.black,
      fontSize: 16,
   },
   placeholderText: {
      color: '#999',
   },
   dateButton: {
      padding: 10,
      position: 'absolute',
      right: 10,
   },
   iosDatePicker: {
      position: 'absolute',
      right: 10,
      width: '100%',
      height: 120,
      marginTop: 10,
   },
})

export default EditProfile
