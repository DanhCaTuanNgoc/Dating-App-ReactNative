import { createSlice } from '@reduxjs/toolkit'

const initialState: any = {
   matchingList: [],
   matchedList: [],
   selectedMatching: null,
   filtersReducer: null,
   defaultFilters: {
      age: [18, 35],
      distance: 10,
      gender: 'all',
      education: null,
      relationshipGoal: null,
      selectedInterests: [],
   },
}

const matchingSlice = createSlice({
   name: 'matching',
   initialState,
   reducers: {
      setMatchingList: (state, action) => {
         state.matchingList = action.payload
      },
      setSelectedMatching: (state, action) => {
         state.selectedMatching = action.payload
      },
      updateFiltersReducer: (state, action) => {
         state.filtersReducer = action.payload
      },
   },
})

export const { setMatchingList, setSelectedMatching, updateFiltersReducer } =
   matchingSlice.actions
export default matchingSlice.reducer
