import { API_BASE_URL } from '../IPv4'
import {
   setUserId,
   setUserInfo,
   setUserPhotos,
   addUserPhoto,
   deleteUserPhoto,
   setUserPhotoAsPrimary,
   setEducation,
   setRelationship,
} from './userReducer'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const authPhoneNumber = (phoneNumber: string) => async (dispatch: any) => {
   try {
      const response = await fetch(`${API_BASE_URL}/userInfo/auth/phone`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
         },
         body: JSON.stringify({ phoneNumber }),
      })

      const data = await response.json()
      if (!response.ok) {
         throw new Error(data.error || 'Failed to add phone number')
      }

      await dispatch(setUserId(data.userId))
      await AsyncStorage.setItem('userId', data.userId)

      return data
   } catch (error) {
      console.error('Error adding phone number:', error)
      throw error
   }
}

export const authGoogle = (googleId: string, email: string) => async (dispatch: any) => {
   try {
      const response = await fetch(`${API_BASE_URL}/userInfo/auth/google`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ googleId, email }),
      })
      const data = await response.json()
      if (!response.ok) {
         throw new Error(data.error || 'Failed to add phone number')
      }
      dispatch(setUserId(data.userId))
      return data
   } catch (error) {
      console.error('Error adding GG:', error)
      throw error
   }
}

export const initialUserInfo =
   (userId: string, name: string, gender: string, birthDate: Date) =>
   async (dispatch: any) => {
      try {
         const formattedDate = new Date(birthDate).toISOString().split('T')[0]

         const response = await fetch(`${API_BASE_URL}/userInfo/initial`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               userId,
               name,
               gender,
               birthDate: formattedDate,
            }),
         })

         const contentType = response.headers.get('content-type')
         if (!contentType || !contentType.includes('application/json')) {
            throw new Error("Server didn't return JSON")
         }

         const data = await response.json()
         if (!response.ok) {
            throw new Error(data.error || 'Failed to get user info')
         }
         return data
      } catch (error) {
         console.error('Error getting user info:', error)
         throw error
      }
   }

export const initialUserInterests =
   (userId: string, interests: object[]) => async (dispatch: any) => {
      try {
         const response = await fetch(`${API_BASE_URL}/userInterests/initial`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, interests }),
         })

         const contentType = response.headers.get('content-type')
         if (!contentType || !contentType.includes('application/json')) {
            throw new Error("Server didn't return JSON")
         }

         const data = await response.json()
         if (!response.ok) {
            throw new Error(data.error || 'Failed to get user interests')
         }
         return data
      } catch (error) {
         console.error('Error getting user interests:', error)
         throw error
      }
   }

export const uploadImage =
   (userId: string, base64Image: string, isPrimary: boolean = false) =>
   async (dispatch: any) => {
      try {
         const response = await fetch(`${API_BASE_URL}/userPhotos/upload`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               userId,
               photoData: `data:image/jpeg;base64,${base64Image}`,
               isPrimary,
            }),
         })

         if (!response.ok) {
            throw new Error('Upload failed')
         }

         const data = await response.json()
         console.log(data.photo_url)
         await dispatch(addUserPhoto(data))
         return data
      } catch (error) {
         console.error('Action Upload error:', error)
         throw error
      }
   }

export const getUserInfo = (userId: string) => async (dispatch: any) => {
   try {
      const response = await fetch(`${API_BASE_URL}/userInfo/get/${userId}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
         },
      })
      const data = await response.json()
      if (!response.ok) {
         throw new Error(data.error || 'Failed to get user info')
      }
      await dispatch(setUserInfo(data))
      return data
   } catch (error) {
      console.error('Error getting user info:', error)
      throw error
   }
}

export const getUserPhotos = (userId: string) => async (dispatch: any) => {
   try {
      const response = await fetch(`${API_BASE_URL}/userPhotos/get/${userId}`, {
         method: 'GET',
         headers: {
            'Content-Type': 'application/json',
         },
      })
      const data = await response.json()
      if (!response.ok) {
         throw new Error(data.error || 'Failed to get user photos')
      }
      await dispatch(setUserPhotos(data))
      return data
   } catch (error) {
      console.error('Error getting user photos:', error)
      throw error
   }
}

export const deletePhoto =
   (photoId: string, userId: string, cloudinaryId: string) => async (dispatch: any) => {
      try {
         const response = await fetch(`${API_BASE_URL}/userPhotos/delete/${photoId}`, {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ photoId, userId, cloudinaryId }),
         })
         const data = await response.json()
         if (!response.ok) {
            throw new Error(data.error || 'Failed to delete user photo')
         }
         await dispatch(deleteUserPhoto(photoId))
         return data
      } catch (error) {
         console.error('Error deleting user photo:', error)
         throw error
      }
   }

export const setPhotoAsPrimary =
   (photoId: string, currentPrimary: string, userId: string) => async (dispatch: any) => {
      try {
         const response = await fetch(
            `${API_BASE_URL}/userPhotos/set-primary/${photoId}`,
            {
               method: 'PUT',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({ photoId, currentPrimary, userId }),
            },
         )
         const data = await response.json()
         if (!response.ok) {
            throw new Error(data.error || 'Failed to set user photo as primary')
         }
         await dispatch(setUserPhotoAsPrimary({ photoId, currentPrimary, userId }))
         return data
      } catch (error) {
         console.error('Error setting user photo as primary:', error)
         throw error
      }
   }

export const getEducationAndRelationship = () => async (dispatch: any) => {
   try {
      const response = await fetch(
         `${API_BASE_URL}/userInfo/get-education-and-relationship`,
         {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
         },
      )
      const data = await response.json()
      if (!response.ok) {
         throw new Error(data.error || 'Failed to get education and relationship')
      }
      await dispatch(setEducation(data.education))
      await dispatch(setRelationship(data.relationship))
      return data
   } catch (error) {
      console.error('Error getting education and relationship:', error)
      throw error
   }
}

export const updateUserInfo =
   (
      userId: string,
      name: string,
      birthDate: Date,
      gender: string,
      bio: string,
      educationId: number,
      jobTitle: string,
      relationshipGoalId: number,
   ) =>
   async (dispatch: any) => {
      const formattedDate = new Date(birthDate).toISOString().split('T')[0]
      try {
         const response = await fetch(`${API_BASE_URL}/userInfo/update`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               userId,
               name,
               formattedDate,
               gender,
               bio,
               educationId,
               jobTitle,
               relationshipGoalId,
            }),
         })
         const data = await response.json()
         if (!response.ok) {
            throw new Error(data.error || 'Failed to update user info')
         }
         await dispatch(setUserInfo(data))
         return data
      } catch (error) {
         console.error('Error updating user info:', error)
         throw error
      }
   }

export const updateUserLocation =
   (userId: string, location: any) => async (dispatch: any) => {
      try {
         const response = await fetch(`${API_BASE_URL}/userInfo/update-location`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, location }),
         })
         const data = await response.json()
         if (!response.ok) {
            throw new Error(data.error || 'Failed to update user location')
         }
         return data
      } catch (error) {
         console.error('Error updating user location:', error)
         throw error
      }
   }

export const getUserInterest = (userId: string) => async (dispatch: any) => {}
