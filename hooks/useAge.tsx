import { useMemo } from 'react'

export const useAge = (birthDate: string | Date | null) => {
   return useMemo(() => {
      if (!birthDate) return null

      try {
         const today = new Date()
         const birth = new Date(birthDate)

         // Validate birth date
         if (isNaN(birth.getTime())) return null

         let age = today.getFullYear() - birth.getFullYear()
         const monthDiff = today.getMonth() - birth.getMonth()

         if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--
         }

         // Validate age range
         return age >= 0 && age <= 120 ? age : null
      } catch (error) {
         console.error('Error calculating age:', error)
         return null
      }
   }, [birthDate])
}
