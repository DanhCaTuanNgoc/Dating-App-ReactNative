import { View, StyleSheet, Text, Pressable } from 'react-native'
import { COLORS } from '../../constants/theme'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'

function Setting({ navigation }: { navigation: any }) {
   const handleLogout = async () => {
      await AsyncStorage.removeItem('filters')
      await AsyncStorage.removeItem('userId')
      navigation.navigate('Login')
   }
   return (
      <View style={styles.container}>
         <Pressable onPress={() => navigation.goBack()}>
            <Text>Go Back</Text>
         </Pressable>
         <Pressable onPress={handleLogout}>
            <Text>Logout</Text>
         </Pressable>
      </View>
   )
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: COLORS.white,
      padding: 20,
      height: '100%',
      justifyContent: 'center',
      alignContent: 'center',
   },
})

export default Setting
