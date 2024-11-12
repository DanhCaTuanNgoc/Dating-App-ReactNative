import API_BASE_URL from '../IPv4'
import { setUserId } from './userReducer'
import { useDispatch } from 'react-redux'

export const addPhoneNumber = (phoneNumber) => async (dispatch) => {
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
