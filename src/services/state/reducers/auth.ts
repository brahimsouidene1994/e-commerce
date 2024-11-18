import { createSlice } from '@reduxjs/toolkit'
import { AUTH } from '../actions';

// Define a type for the slice state
interface AuthState {
  value: boolean
}

// Define the initial state using that type
const initialState = {
  value: false
} as AuthState

export const authSlice = createSlice({
  name: AUTH,
  initialState,
  reducers: {
    enableAuth: state => {
        state.value = true
    },
    disableAuth: state => {
        state.value = false
    }
  }
})

// Action creators are generated for each case reducer function
export const { enableAuth, disableAuth } = authSlice.actions

export default authSlice.reducer