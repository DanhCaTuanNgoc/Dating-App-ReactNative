export const useAge = (birth: Date | string) => {
   if (!birth) return null
   const bd = new Date(birth)
   const today = new Date()
   let age = today.getFullYear() - bd.getFullYear()
   const monthDiff = today.getMonth() - bd.getMonth()
   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < bd.getDate())) {
      return age--
   }
   return age
}
