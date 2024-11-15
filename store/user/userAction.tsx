import { API_BASE_URL } from '../IPv4'
import { setUserId } from './userReducer'

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
      dispatch(setUserId(data.userId))
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
         const response = await fetch(`${API_BASE_URL}/userInfo/initial/interests`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, interests }),
         })
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
