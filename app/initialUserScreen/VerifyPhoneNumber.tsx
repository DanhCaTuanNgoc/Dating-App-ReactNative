import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import { useState, useRef } from 'react'
import { initializeApp } from 'firebase/app'
import {
   getAuth,
   PhoneAuthProvider,
   signInWithCredential,
   initializeAuth,
} from 'firebase/auth'
import { getReactNativePersistence } from '@firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { authPhoneNumber } from '../../store/user/userAction'
import { useDispatch } from 'react-redux'
import { setUserId } from '../../store/user/userReducer'
function VerifyPhoneNumber({ route, navigation }: { route: any; navigation: any }) {
   const { verificationId, verificationCode: initialCode, phoneNumber } = route.params
   const [verificationCode, setVerificationCode] = useState(initialCode || '')
   const [isLoading, setIsLoading] = useState(false)
   const dispatch = useDispatch()

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

   // Xác nhận mã OTP
   const confirmCode = async () => {
      // try {
      //    if (!verificationId || !verificationCode) {
      //       Alert.alert('Error', 'Please enter verification code')
      //       return
      //    }

      //    // Hiển thị loading state nếu cần
      //    setIsLoading(true)

      //    const credential = PhoneAuthProvider.credential(verificationId, verificationCode)

      //    // Thêm timeout cho signInWithCredential
      //    const signInPromise = signInWithCredential(auth, credential)
      //    const timeoutPromise = new Promise((_, reject) =>
      //       setTimeout(() => reject(new Error('Timeout')), 30000),
      //    )

      //    const result = await Promise.race([signInPromise, timeoutPromise])

      //    const data = await authPhoneNumber(phoneNumber)(dispatch)
      //    if (data.isNewUser) {
      //       navigation.navigate('Infomation')
      //    } else {
      //       navigation.navigate('Home')
      //    }
      // } catch (error: any) {
      //    console.error('Verification error:', error)

      //    // Xử lý các loại lỗi cụ thể
      //    let errorMessage = 'Verification failed. Please try again.'
      //    if (error.message === 'Timeout') {
      //       errorMessage = 'Connection timed out. Please check your internet connection.'
      //    } else if (error.code === 'auth/invalid-verification-code') {
      //       errorMessage = 'Invalid verification code. Please try again.'
      //    } else if (error.code === 'auth/network-request-failed') {
      //       errorMessage = 'Network error. Please check your internet connection.'
      //    }

      //    Alert.alert('Error', errorMessage)
      // } finally {
      //    setIsLoading(false) // Tắt loading state
      // }
      dispatch(setUserId('4'))
      navigation.navigate('Infomation')
   }

   return (
      <SafeAreaView style={styles.container}>
         <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
         </TouchableOpacity>

         <View style={styles.header}>
            <Text style={styles.headerTitle}>Enter verification code</Text>
            <Text style={styles.headerSubtitle}>
               We've sent a verification code to your phone number
            </Text>
         </View>

         <View style={styles.inputContainer}>
            <TextInput
               style={styles.codeInput}
               value={verificationCode}
               onChangeText={setVerificationCode}
               keyboardType="number-pad"
               maxLength={6}
               placeholder="Enter 6-digit code"
               placeholderTextColor="#999"
            />

            <TouchableOpacity style={styles.verifyButton} onPress={confirmCode}>
               <Text style={styles.verifyButtonText}>Verify Code</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendContainer}>
               <Text style={styles.resendText}>Didn't receive code? </Text>
               <Text style={styles.resendLink}>Resend</Text>
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
   backButtonText: {
      fontSize: 18,
      color: '#000',
   },
   header: {
      marginBottom: 20,
   },
   headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
   },
   headerSubtitle: {
      fontSize: 16,
      color: '#666',
      lineHeight: 22,
   },
   inputContainer: {
      alignItems: 'center',
   },
   codeInput: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      paddingHorizontal: 15,
      fontSize: 18,
      marginBottom: 20,
      backgroundColor: '#f8f8f8',
   },
   verifyButton: {
      width: '100%',
      height: 50,
      backgroundColor: '#FFC629',
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
   },
   verifyButtonText: {
      color: '#333',
      fontSize: 18,
      fontWeight: '600',
   },
   resendContainer: {
      flexDirection: 'row',
      marginTop: 0,
   },
   resendText: {
      color: '#333',
      fontSize: 16,
   },
   resendLink: {
      color: '#FFC629',
      fontSize: 16,
      fontWeight: '600',
      textDecorationLine: 'underline',
   },
})

export default VerifyPhoneNumber
