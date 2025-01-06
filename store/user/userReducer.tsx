import { createSlice } from '@reduxjs/toolkit'

interface UserState {
   userId: string | null
   userInfo: any | null
   userPhotos: any[]
   education: any[]
   relationship: any[]
}

const initialState: UserState = {
   userId: null,
   userInfo: null,
   userPhotos: [],
   education: [],
   relationship: [],
}

const userSlice = createSlice({
   name: 'user',
   initialState,
   reducers: {
      setUserId: (state, action) => {
         state.userId = action.payload
         console.log(state.userId)
      },
      setUserInfo: (state, action) => {
         state.userInfo = action.payload
         console.log(state.userInfo)
      },
      setUserPhotos: (state, action) => {
         state.userPhotos = action.payload
      },
      addUserPhoto: (state, action) => {
         state.userPhotos.push(action.payload)
      },
      deleteUserPhoto: (state, action) => {
         state.userPhotos = state.userPhotos.filter(
            (photo) => photo.id !== action.payload,
         )
      },
      setUserPhotoAsPrimary: (state, action) => {
         state.userPhotos = state.userPhotos.map((photo) =>
            photo.id === action.payload.photoId
               ? { ...photo, is_primary: true }
               : { ...photo, is_primary: false },
         )
      },
      setEducation: (state, action) => {
         state.education = action.payload
      },
      setRelationship: (state, action) => {
         state.relationship = action.payload
      },
      clearUser: (state) => {
         state.userId = null
         state.userInfo = null
         state.userPhotos = []
      },
   },
})

export const {
   setUserId,
   setUserInfo,
   clearUser,
   setUserPhotos,
   addUserPhoto,
   deleteUserPhoto,
   setUserPhotoAsPrimary,
   setEducation,
   setRelationship,
} = userSlice.actions
export default userSlice.reducer
