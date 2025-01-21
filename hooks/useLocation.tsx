import { useState, useEffect } from 'react'
import * as Location from 'expo-location'
import { Alert, Platform, Linking } from 'react-native'
import { updateUserLocation } from '../store/user/userAction'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { getUserInfo } from '../store/user/userAction'

export const useLocation = () => {
   const [newLocation, setNewLocation] = useState<any>(null)
   const [errorMsg, setErrorMsg] = useState<string | null>(null)
   const dispatch = useDispatch()
   const { userId } = useSelector((state: any) => state.userState)

   const requestLocationPermission = async () => {
      console.log('Cấp vị trị thiết bị !')
      try {
         let { status } = await Location.getForegroundPermissionsAsync()
         if (status === 'denied') {
            Alert.alert(
               'Cần quyền truy cập vị trí',
               'Vui lòng vào Settings để cấp quyền truy cập vị trí cho ứng dụng',
               [
                  {
                     text: 'Đi tới Settings',
                     onPress: () => {
                        if (Platform.OS === 'ios') {
                           Linking.openURL('app-settings:')
                        } else {
                           Linking.openSettings()
                        }
                     },
                  },
                  {
                     text: 'Hủy',
                     style: 'cancel',
                  },
               ],
            )
            return
         }

         if (status !== 'granted') {
            const { status: newStatus } =
               await Location.requestForegroundPermissionsAsync()
            if (newStatus !== 'granted') {
               setErrorMsg('Permission to access location was denied')
               return
            }
         }

         const location: any = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 5000,
            distanceInterval: 10,
         })
         setNewLocation(location)
         await updateUserLocation(userId, location)(dispatch)
         await getUserInfo(userId)(dispatch)
      } catch (error) {
         console.error('Error getting location:', error)
         setErrorMsg('Error getting location')
      }
   }
   return { newLocation, errorMsg, requestLocationPermission }
}

export default useLocation
