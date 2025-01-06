import { API_BASE_URL } from '../IPv4'
import {
   setMatchingList,
   setSelectedMatching,
   updateFiltersReducer,
} from './matchReducer'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const getMatchingListByFilters = (userId: string) => async (dispatch: any) => {
   try {
      console.log('Sending request with userId:', userId)

      const response = await fetch(
         `${API_BASE_URL}/userMatch/matching-list-by-filters?userId=${userId}`,
         {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
               Accept: 'application/json',
            },
         },
      )

      const text = await response.text()

      try {
         const data = JSON.parse(text)
         if (!response.ok) {
            throw new Error(data.error || 'Failed to get matching list by filters')
         }

         let dataaa = []
         for (const user of data) {
            dataaa.push(user.id)
         }
         console.log(dataaa)

         dispatch(setMatchingList(data))
         return data
      } catch (parseError) {
         console.error('Parse error:', parseError)
         console.error('Response text:', text)
         throw new Error('Invalid JSON response from server')
      }
   } catch (error) {
      console.error('Network error:', error)
      throw error
   }
}

export const UpdateUserFilters = (filters: any, userId: any) => async (dispatch: any) => {
   try {
      const response = await fetch(`${API_BASE_URL}/userMatch/update-filters`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
         },
         body: JSON.stringify({ filters, userId }),
      })
      const data = await response.json()
      if (!response.ok) {
         throw new Error(data.error || 'Failed to add user filters')
      }
      dispatch(updateFiltersReducer(filters))
      console.log(data)
      return data
   } catch (error) {
      console.error('Error adding user filters:', error)
      throw error
   }
}

export const getUserFilters = (userId: any) => async (dispatch: any) => {
   const response = await fetch(`${API_BASE_URL}/userMatch/get-filters?userId=${userId}`)
   const data = await response.json()
   dispatch(updateFiltersReducer(data))
   return data
}
