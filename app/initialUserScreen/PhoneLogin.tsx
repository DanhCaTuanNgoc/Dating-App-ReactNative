import {
   View,
   Text,
   TextInput,
   TouchableOpacity,
   StyleSheet,
   Alert,
   LogBox,
   Platform,
} from 'react-native'
import { useState, useRef } from 'react'
import { initializeApp } from 'firebase/app'
import {
   getAuth,
   signInWithPhoneNumber,
   PhoneAuthProvider,
   signInWithCredential,
   initializeAuth,
} from 'firebase/auth'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import { getReactNativePersistence } from '@firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '../../constants'

LogBox.ignoreLogs([
   'Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.',
   'No native ExpoFirebaseCore module found, are you sure the expo-firebase-core module is linked properly?',
   'Warning: FirebaseRecaptcha: Support for defaultProps will be removed from function components',
])

function PhoneLogin({ navigation }: { navigation: any }) {
   const [phoneNumber, setPhoneNumber] = useState('')
   const [verificationId, setVerificationId] = useState(null)
   const [verificationCode, setVerificationCode] = useState('')
   const [showVerificationInput, setShowVerificationInput] = useState(false)
   const [countryCode, setCountryCode] = useState('+84')
   const recaptchaVerifier = useRef(null)

   let auth: any
   const firebaseConfig = require('../../backend/config/firebase-config')
   try {
      const app = initializeApp(firebaseConfig)
      auth = initializeAuth(app, {
         persistence: getReactNativePersistence(AsyncStorage),
      })
   } catch (error: any) {
      if (error.code === 'auth/already-initialized') {
         auth = getAuth()
      } else {
         console.error('Firebase initialization error:', error)
      }
   }

   const sendVerificationCode = async () => {
      // try {
      //    const phoneProvider = new PhoneAuthProvider(auth)
      //    const formattedPhoneNumber = `${countryCode}${phoneNumber.replace(/^0+/, '')}`
      //    const verificationId = await phoneProvider.verifyPhoneNumber(
      //       formattedPhoneNumber,
      //       recaptchaVerifier.current as any,
      //    )
      setVerificationId(verificationId as any)
      setShowVerificationInput(true)
      navigation.navigate('VerifyPhoneNumber', {
         verificationId,
         verificationCode,
         phoneNumber,
      })
      //    Alert.alert('Success', 'Verification code sent successfully.')
      // } catch (error) {
      //    console.error('Error sending SMS verification:', error)
      //    Alert.alert('Failed to send verification code.')
      // }
   }

   return (
      <SafeAreaView style={styles.container}>
         <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
            attemptInvisibleVerification={Platform.OS === 'ios'}
         />

         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
         </TouchableOpacity>

         <View style={styles.header}>
            <Text style={styles.headerTitle}>Can we get your number, please?</Text>
            <Text style={styles.headerSubtitle}>
               We only use phone numbers to make sure everyone on Linder is real.
            </Text>
         </View>

         <View style={styles.inputContainer}>
            <View style={styles.phoneInputWrapper}>
               <TouchableOpacity style={styles.countrySelect}>
                  <Text style={styles.countryCode}>VN {countryCode}</Text>
                  <Ionicons name="chevron-down" size={16} color="#666" />
               </TouchableOpacity>
               <TextInput
                  style={styles.phoneInput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  placeholder="Enter your phone number"
                  placeholderTextColor="#999"
               />
            </View>

            <View style={styles.privacyNote}>
               <Ionicons name="shield-checkmark-outline" size={20} color="#666" />
               <Text style={styles.privacyText}>
                  Your information is securely encrypted and will never be shared
               </Text>
            </View>

            <TouchableOpacity
               style={[
                  styles.sendCodeButton,
                  phoneNumber.length > 8 && styles.sendCodeButtonActive,
               ]}
               onPress={sendVerificationCode}
               disabled={phoneNumber.length < 9}
            >
               <Text style={styles.sendCodeButtonText}>Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity
               onPress={() =>
                  navigation.navigate('VerifyPhoneNumber', {
                     verificationId,
                     verificationCode,
                     phoneNumber,
                  })
               }
            >
               <Text>SKIP</Text>
            </TouchableOpacity>
         </View>
      </SafeAreaView>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#FFFAF0',
      paddingHorizontal: 24,
      paddingVertical: 20,
   },
   backButton: {
      marginBottom: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#FFC629',
   },
   header: {
      paddingBottom: 10,
   },
   headerTitle: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 8,
      color: '#333',
   },
   headerSubtitle: {
      fontSize: 16,
      color: '#666',
      lineHeight: 24,
   },
   inputContainer: {
      padding: 0,
   },
   phoneInputWrapper: {
      flexDirection: 'row',
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 12,
      padding: 12,
      backgroundColor: '#f8f8f8',
   },
   countrySelect: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 12,
      borderRightWidth: 1,
      borderRightColor: '#ddd',
   },
   countryCode: {
      fontSize: 16,
      color: '#333',
      marginRight: 4,
   },
   phoneInput: {
      flex: 1,
      fontSize: 16,
      paddingLeft: 12,
      color: '#333',
   },
   privacyNote: {
      marginTop: 16,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.white,
      padding: 12,
      borderRadius: 12,
   },
   privacyText: {
      fontSize: 14,
      color: '#666',
      marginLeft: 8,
      flex: 1,
   },
   verificationContainer: {
      padding: 24,
   },
   input: {
      backgroundColor: '#f8f8f8',
      padding: 16,
      borderRadius: 12,
      fontSize: 16,
      color: '#333',
      textAlign: 'center',
      letterSpacing: 8,
   },
   sendCodeButton: {
      backgroundColor: '#ddd',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 24,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
   },
   sendCodeButtonActive: {
      backgroundColor: '#FFC629',
   },
   sendCodeButtonText: {
      color: '#333',
      fontSize: 16,
      fontWeight: '600',
   },
})

export default PhoneLogin
