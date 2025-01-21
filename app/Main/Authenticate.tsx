import { View, Text, TouchableOpacity } from 'react-native'
import { useSelector } from 'react-redux'
import { COLORS, SIZES } from '../../constants/theme'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { StyleSheet } from 'react-native'
import AlertModal from '@/components/AlertModal'
import { useState } from 'react'
function Authenticate({ navigation }: { navigation: any }) {
   const { userInfo, userId } = useSelector((state: any) => state.userState)
   const [popup, setPopup] = useState(false)

   return (
      <View style={styles.container}>
         <LinearGradient
            colors={[COLORS.white, `${COLORS.primary}20`]}
            style={StyleSheet.absoluteFillObject}
         />

         <View style={styles.header}>
            <TouchableOpacity
               style={styles.backButton}
               onPress={() => navigation.goBack()}
            >
               <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Authentication</Text>
         </View>

         <View style={styles.content}>
            <TouchableOpacity style={styles.menuItem} disabled={!!userInfo.phone_number}>
               <Ionicons name="call-outline" size={24} color={COLORS.primary} />
               <Text style={styles.menuText}>
                  Your phone number : {userInfo.phone_number}
               </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => setPopup(true)}>
               <Ionicons name="mail-outline" size={24} color={COLORS.primary} />
               <Text style={styles.menuText}>
                  Your email :{' '}
                  {userInfo.email || (
                     <Text style={{ color: COLORS.alertFail }}>
                        Press to set your email...
                     </Text>
                  )}
               </Text>
            </TouchableOpacity>
         </View>
         <AlertModal
            visible={popup}
            onClose={() => setPopup(false)}
            title="Oops!"
            message="We are working on this feature, please wait for the update"
            iconName="sad"
            color={COLORS.primary}
         />
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: COLORS.white,
      paddingTop: 30,
   },
   header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SIZES.medium,
      paddingVertical: SIZES.xSmall,
      borderBottomWidth: 1,
      borderBottomColor: `${COLORS.textColor}20`,
   },
   backButton: {
      padding: 8,
   },
   headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: COLORS.primary,
      marginLeft: 12,
   },
   content: {
      flex: 1,
      padding: 20,
   },
   menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: COLORS.white,
      padding: 16,
      borderRadius: 12,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: {
         width: 0,
         height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
   },
   menuText: {
      flex: 1,
      fontSize: 14,
      color: COLORS.textColor,
      marginLeft: 12,
      fontWeight: 500,
   },
   logoutButton: {
      marginTop: 'auto',
      backgroundColor: COLORS.white,
      borderWidth: 1,
      borderColor: COLORS.alertFail,
   },
   logoutText: {
      color: COLORS.alertFail,
   },
})

export default Authenticate
