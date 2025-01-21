import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react'
import {
   View,
   Text,
   Modal,
   StyleSheet,
   TouchableOpacity,
   Animated,
   Dimensions,
   ScrollView,
   PanResponder,
   TouchableWithoutFeedback,
   Platform,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, SIZES } from '../constants/theme'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { getEducationAndRelationship } from '../store/user/userAction'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getUserFilters } from '../store/matching/matchAction'
import { debounce } from 'lodash'

const { height } = Dimensions.get('window')

interface FilterModalProps {
   visible: boolean
   onClose: () => void
   onApply: (filters: any) => void
}

const FilterModal = ({ visible, onClose, onApply }: FilterModalProps) => {
   const [age, setAge] = useState([18, 35])
   const [selectedInterests, setSelectedInterests] = useState<any>([])
   const [distance, setDistance] = useState(10)
   const [gender, setGender] = useState('all')
   const slideAnim = useRef(new Animated.Value(height)).current
   const panY = useRef(new Animated.Value(0)).current
   const { education: educationQuery, relationship: relationshipQuery } = useSelector(
      (state: any) => state.userState,
   )
   const dispatch: any = useDispatch()
   const [education, setEducation] = useState<number | null>(null)
   const [relationshipGoal, setRelationshipGoal] = useState<number | null>(null)
   const userId = useSelector((state: any) => state.userState.userId)
   const { filtersReducer } = useSelector((state: any) => state.matchState)

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
   const resetPositionAnim = Animated.timing(panY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
   })

   const closeAnim = Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
   })

   const panResponder = useRef(
      PanResponder.create({
         onStartShouldSetPanResponder: () => true,
         onMoveShouldSetPanResponder: () => true,
         onPanResponderMove: (_, gestureState) => {
            // Chỉ cho phép kéo xuống
            if (gestureState.dy > 0) {
               panY.setValue(gestureState.dy)
            }
         },
         onPanResponderRelease: (_, gestureState) => {
            if (gestureState.dy > 150) {
               // Nếu kéo xuống quá 150px thì đóng modal
               closeAnim.start(onClose)
            } else {
               // Nếu không thì trả về vị trí ban đầu
               resetPositionAnim.start()
            }
         },
      }),
   ).current

   const toggleInterest = (interest: any) => {
      if (!selectedInterests.find((index: any) => index === interest.id)) {
         setSelectedInterests([...selectedInterests, interest.id])
      } else {
         setSelectedInterests(
            selectedInterests.filter((index: any) => index !== interest.id),
         )
      }
   }

   useEffect(() => {
      if (visible) {
         Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
         }).start()
      } else {
         closeAnim.start()
      }
      dispatch(getUserFilters(userId))
      dispatch(getEducationAndRelationship())
      if (filtersReducer) {
         setAge([filtersReducer.min_age, filtersReducer.max_age])
         setDistance(filtersReducer.max_distance)
         setGender(filtersReducer.preferred_gender)
         setEducation(filtersReducer.education_id)
         setRelationshipGoal(filtersReducer.relationship_goal_id)
         setSelectedInterests(filtersReducer.preferred_interests)
      }
   }, [visible, userId])

   const handleApply = () => {
      const processedFilters = {
         age,
         distance,
         gender: gender,
         education: education || null,
         relationshipGoal: relationshipGoal || null,
         selectedInterests: selectedInterests.length > 0 ? selectedInterests : [],
      }

      onApply(processedFilters)
      onClose()
   }

   // Thêm useMemo để tối ưu các options
   const sliderOptions = useMemo(
      () => ({
         touchDimensions: {
            height: 30,
            width: 30,
            borderRadius: 15,
            slipDisplacement: 30,
         },
         markerStyle: styles.sliderMarker,
         selectedStyle: styles.selectedSlider,
         containerStyle: styles.sliderContainer,
         enabledOne: true,
         enabledTwo: true,
         snapped: true,
         allowOverlap: false,
         minMarkerOverlapDistance: 10,
      }),
      [],
   )

   // Tối ưu hóa callback với debounce
   const debouncedAgeChange = useCallback(
      debounce((values: number[]) => {
         setAge(values)
      }, 10),
      [],
   )

   const debouncedDistanceChange = useCallback(
      debounce((values: number[]) => {
         setDistance(values[0])
      }, 10),
      [],
   )

   return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
         <View style={styles.overlay}>
            <Animated.View
               style={[
                  styles.modalContainer,
                  {
                     transform: [{ translateY: slideAnim }, { translateY: panY }],
                  },
               ]}
            >
               <View {...panResponder.panHandlers} style={styles.dragIndicatorContainer}>
                  <View style={styles.dragIndicator} />
               </View>

               <View style={styles.header}>
                  <Text style={styles.title}>Filters</Text>
                  <TouchableOpacity onPress={onClose}>
                     <Ionicons name="close-outline" style={styles.closeButton} />
                  </TouchableOpacity>
               </View>

               <View style={{ flex: 1, pointerEvents: 'box-none' }}>
                  <ScrollView
                     style={styles.content}
                     showsVerticalScrollIndicator={false}
                     contentContainerStyle={styles.scrollContent}
                     bounces={false}
                     overScrollMode="never"
                  >
                     {/* Age Range */}
                     <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                           <Ionicons
                              name="calendar-outline"
                              size={24}
                              color={COLORS.tertiary}
                           />
                           <Text style={styles.sectionTitle}>Age Range</Text>
                        </View>
                        <Text style={styles.sectionValue}>
                           {age[0]} - {age[1]} years old
                        </Text>
                        <MultiSlider
                           values={age}
                           min={18}
                           max={100}
                           step={1}
                           sliderLength={280}
                           onValuesChange={debouncedAgeChange}
                           {...sliderOptions}
                        />
                     </View>

                     {/* Distance */}
                     <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                           <Ionicons
                              name="location-outline"
                              size={24}
                              color={COLORS.tertiary}
                           />
                           <Text style={styles.sectionTitle}>Maximum Distance</Text>
                        </View>
                        <Text style={styles.sectionValue}>
                           {distance} kilometers away
                        </Text>
                        <MultiSlider
                           values={[distance]}
                           min={1}
                           max={100}
                           step={1}
                           sliderLength={280}
                           onValuesChange={debouncedDistanceChange}
                           {...sliderOptions}
                        />
                     </View>

                     {/* Gender */}
                     <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                           <Ionicons
                              name="people-outline"
                              size={24}
                              color={COLORS.tertiary}
                           />
                           <Text style={styles.sectionTitle}>Show Me</Text>
                        </View>
                        <View style={styles.genderButtons}>
                           {['female', 'male', 'all'].map((option) => (
                              <TouchableOpacity
                                 key={option}
                                 style={[
                                    styles.genderButton,
                                    gender === option && styles.selectedGender,
                                 ]}
                                 onPress={() => setGender(option)}
                              >
                                 <Text
                                    style={[
                                       styles.genderButtonText,
                                       gender === option && styles.selectedGenderText,
                                    ]}
                                 >
                                    {option === 'all'
                                       ? 'Everyone'
                                       : option.charAt(0).toUpperCase() + option.slice(1)}
                                 </Text>
                              </TouchableOpacity>
                           ))}
                        </View>
                     </View>
                     {/* Education */}
                     <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                           <Ionicons
                              name="school-outline"
                              size={24}
                              color={COLORS.tertiary}
                           />
                           <Text style={styles.sectionTitle}>Education</Text>
                        </View>
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
                                    {edu.level === 'Prefer not to say'
                                       ? 'Any'
                                       : edu.level}
                                 </Text>
                              </TouchableOpacity>
                           ))}
                        </View>
                     </View>

                     {/* Relationship */}
                     <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                           <Ionicons
                              name="heart-outline"
                              size={24}
                              color={COLORS.tertiary}
                           />
                           <Text style={styles.sectionTitle}>Relationship</Text>
                        </View>
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
                                       relationshipGoal === rel.id &&
                                          styles.selectedOptionText,
                                    ]}
                                 >
                                    {rel.goal === 'Prefer not to say' ? 'Any' : rel.goal}
                                 </Text>
                              </TouchableOpacity>
                           ))}
                        </View>
                     </View>

                     {/* Interests */}
                     <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                           <Ionicons
                              name="people-outline"
                              size={24}
                              color={COLORS.tertiary}
                           />
                           <Text style={styles.sectionTitle}>Interests</Text>
                        </View>
                        <View style={styles.interestsGrid}>
                           {interests.map((interest: any) => (
                              <TouchableOpacity
                                 key={interest.id}
                                 style={[
                                    styles.interestItem,
                                    selectedInterests?.find(
                                       (item: any) => item == interest.id,
                                    ) && styles.selectedInterest,
                                 ]}
                                 onPress={() => toggleInterest(interest)}
                              >
                                 <Ionicons
                                    name={interest.icon}
                                    size={20}
                                    color={
                                       selectedInterests?.find(
                                          (item: any) => item == interest.id,
                                       )
                                          ? COLORS.textColor
                                          : '#666'
                                    }
                                    style={styles.interestIcon}
                                 />
                                 <Text
                                    style={[
                                       styles.interestText,
                                       selectedInterests?.find(
                                          (item: any) => item == interest.id,
                                       ) && styles.selectedInterestText,
                                    ]}
                                 >
                                    {interest.name}
                                 </Text>
                              </TouchableOpacity>
                           ))}
                        </View>
                     </View>
                  </ScrollView>
               </View>

               <View style={styles.footer}>
                  <TouchableOpacity
                     style={styles.resetButton}
                     onPress={() => {
                        setAge([18, 35])
                        setDistance(10)
                        setGender('all')
                        setEducation(26)
                        setRelationshipGoal(8)
                        setSelectedInterests([])
                     }}
                  >
                     <Text style={styles.resetButtonText}>Reset</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                     style={styles.applyButton}
                     onPress={handleApply} // Sử dụng hàm xử lý mới
                  >
                     <Text style={styles.applyButtonText}>Apply</Text>
                  </TouchableOpacity>
               </View>
            </Animated.View>
         </View>
      </Modal>
   )
}

const styles = StyleSheet.create({
   overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
   },
   modalContainer: {
      backgroundColor: COLORS.white,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: 20,
      height: '80%',
      maxHeight: '90%',
   },
   dragIndicatorContainer: {
      width: '100%',
      height: 34,
      justifyContent: 'center',
      alignItems: 'center',
   },
   dragIndicator: {
      width: 150,
      height: 4,
      backgroundColor: '#DEDEDE',
      borderRadius: 2,
   },
   header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
   },
   title: {
      fontSize: SIZES.xLarge,
      fontWeight: 'bold',
      color: COLORS.textColor,
   },
   closeButton: {
      padding: 8,
      borderRadius: 20,
      fontSize: 24,
   },
   content: {
      flex: 1,
      width: '100%',
   },
   scrollContent: {
      paddingBottom: 20,
      flexGrow: 1,
   },
   section: {
      marginBottom: 0,
      backgroundColor: 'white',
      padding: 15,
      borderRadius: 12,
   },
   sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
   },
   sectionTitle: {
      fontSize: SIZES.medium,
      fontWeight: '600',
      marginLeft: 10,
      color: COLORS.textColor,
   },
   sectionValue: {
      fontSize: SIZES.medium,
      color: COLORS.tertiary,
      marginBottom: 10,
   },
   sliderContainer: {
      marginTop: 10,
   },
   selectedSlider: {
      backgroundColor: COLORS.tertiary,
   },
   sliderMarker: {
      backgroundColor: COLORS.white,
      height: 24,
      width: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: COLORS.tertiary,
      elevation: 3,
   },
   genderButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
   },
   genderButton: {
      flex: 1,
      paddingVertical: 15,
      paddingHorizontal: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.border,
      marginHorizontal: 5,
      alignItems: 'center',
      backgroundColor: COLORS.white,
   },
   selectedGender: {
      backgroundColor: COLORS.tertiary,
      borderColor: COLORS.tertiary,
   },
   genderButtonText: {
      color: COLORS.textColor,
      fontSize: Platform.OS === 'ios' ? 16 : 14,
      fontWeight: '500',
   },
   selectedGenderText: {
      color: COLORS.white,
   },
   footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 20,
      borderTopWidth: 1,
      borderTopColor: COLORS.border,
   },
   resetButton: {
      padding: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: COLORS.tertiary,
      width: '48%',
      backgroundColor: COLORS.white,
   },
   resetButtonText: {
      color: COLORS.tertiary,
      fontSize: SIZES.medium,
      textAlign: 'center',
      fontWeight: '600',
   },
   applyButton: {
      padding: 15,
      borderRadius: 8,
      backgroundColor: COLORS.tertiary,
      width: '48%',
   },
   applyButtonText: {
      color: COLORS.white,
      fontSize: SIZES.medium,
      textAlign: 'center',
      fontWeight: '600',
   },

   interestsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      paddingVertical: 10,
   },
   interestItem: {
      width: '47%',
      padding: 17,
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
      fontSize: 14,
      color: '#666',
      fontWeight: '500',
   },
   selectedInterestText: {
      color: '#333',
      fontWeight: '600',
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
})

export default FilterModal
