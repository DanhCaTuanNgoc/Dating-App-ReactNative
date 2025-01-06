import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userReducer'
import matchingReducer from './matching/matchReducer'

export const store = configureStore({
   reducer: {
      userState: userReducer,
      matchState: matchingReducer,
   },
})
