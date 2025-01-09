import { createSlice } from '@reduxjs/toolkit'

interface Match {
   id: string
   user: any
   matched_at: string // Store as ISO string
}

interface MatchState {
   matchingList: any[]
   matchedList: any[]
   selectedMatching: any
   filtersReducer: any
   defaultFilters: {
      age: [number, number]
      distance: number
      gender: string
      education: null | number
      relationshipGoal: null | number
      selectedInterests: any[]
   }
   matches: Match[]
   matchNotification: Match | null
}

const initialState: MatchState = {
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
   matches: [],
   matchNotification: null,
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
      setMatches: (state, action) => {
         state.matches = action.payload.map((match: Match) => ({
            ...match,
            matched_at:
               typeof match.matched_at === 'string'
                  ? match.matched_at
                  : new Date(match.matched_at).toISOString(),
         }))
      },
      addMatch: (state, action) => {
         const newMatch = {
            ...action.payload,
            matched_at:
               typeof action.payload.matched_at === 'string'
                  ? action.payload.matched_at
                  : new Date(action.payload.matched_at).toISOString(),
         }
         state.matches.unshift(newMatch)
         state.matchNotification = newMatch
      },
      clearMatchNotification: (state) => {
         state.matchNotification = null
      },
   },
})

export const {
   setMatchingList,
   setSelectedMatching,
   updateFiltersReducer,
   setMatches,
   addMatch,
   clearMatchNotification,
} = matchingSlice.actions
export default matchingSlice.reducer
