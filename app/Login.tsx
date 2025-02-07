import { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'
import { authGoogle } from '../store/user/userAction'
import { useDispatch } from 'react-redux'
import { COLORS } from '../constants/theme'
import Ionicons from '@expo/vector-icons/Ionicons'

WebBrowser.maybeCompleteAuthSession()

export default function Login({ navigation }: any) {
   const [request, response, promptAsync] = Google.useAuthRequest({
      webClientId:
         '...',
      iosClientId:
         '...',
      androidClientId:
         '...', 
   })

   const dispatch: any = useDispatch()
   useEffect(() => {
      handleSignInResponse()
   }, [response])

   async function handleSignInResponse() {
      if (response?.type === 'success') {
         const { authentication } = response

         try {
            // Gọi Google User Info API để lấy thông tin người dùng
            // API này yêu cầu access token để xác thực và trả về thông tin cơ bản của tài khoản Google
            const userInfoResponse = await fetch(
               'https://www.googleapis.com/userinfo/v2/me', // API endpoint của Google để lấy thông tin user profile
               {
                  headers: { Authorization: `Bearer ${authentication?.accessToken}` }, // Gửi access token trong header để xác thực
               },
            )

            const user = await userInfoResponse.json()
            if (user) {
               console.log(user.id, user.email)
               const data = await dispatch(authGoogle(user.id, user.email))
               if (data.isNewUser) {
                  navigation.navigate('Infomation')
               } else {
                  navigation.navigate('Home')
               }
            } else {
               console.log('User not found')
            }
         } catch (error) {
            console.error('Error fetching user info:', error)
         }
      }
   }

   const handleGoogleLogin = async () => {
      try {
         await promptAsync()
      } catch (error) {
         console.error('Google Sign-In Error:', error)
      }
   }

   return (
      <LinearGradient
         colors={[COLORS.primary, COLORS.secondary, COLORS.tertiary]}
         style={styles.container}
      >
         <SafeAreaView style={styles.safeArea}>
            <View style={styles.content}>
               <Text style={styles.title}>Find Your Perfect Match</Text>
               <Text style={styles.subtitle}>Sign in to continue</Text>

               <TouchableOpacity
                  style={styles.loginButton}
                  onPress={handleGoogleLogin}
                  disabled={!request}
               >
                  <Text style={styles.buttonText}>Continue with Google </Text>
                  <Image
                     source={require('../assets/images/google.png')}
                     style={styles.googleImage}
                  />
               </TouchableOpacity>

               <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => navigation.navigate('PhoneLogin')}
               >
                  <Text style={styles.buttonText}>Continue with Phone Number</Text>
               </TouchableOpacity>

               <Text style={styles.terms}>
                  By continuing, you agree to our Terms of Service and Privacy Policy
               </Text>
            </View>
         </SafeAreaView>
      </LinearGradient>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   safeArea: {
      flex: 1,
   },
   content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 30,
   },
   title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FFFFFF',
      marginBottom: 10,
      textAlign: 'center',
   },
   subtitle: {
      fontSize: 16,
      color: '#FFFFFF',
      marginBottom: 40,
      textAlign: 'center',
   },
   loginButton: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      padding: 16,
      borderRadius: 25,
      width: '100%',
      maxWidth: 300,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
   },
   buttonText: {
      color: COLORS.textColor,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: '600',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
   },
   terms: {
      fontSize: 12,
      color: '#FFFFFF',
      textAlign: 'center',
      marginTop: 20,
      paddingHorizontal: 20,
   },
   googleImage: {
      width: 24,
      height: 24,
      marginLeft: 10,
   },
})
