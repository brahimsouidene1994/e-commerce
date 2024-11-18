import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ACCOUNT } from '../actions';
import AccountObject from 'services/models/account';


// Define a type for the slice state
interface AccountState {
  value: AccountObject | null
}

// Define the initial state using that type
const initialState: AccountState = {
  value: null,
}

export const accountSlice = createSlice({
  name: ACCOUNT,
  initialState,
  reducers: {
    setAccount: (state, action: PayloadAction<AccountObject>) => {
        state.value = action.payload
    },
    clearAccount: state => {
        state.value = null
    }
  }
})

// Action creators are generated for each case reducer function
export const { setAccount, clearAccount } = accountSlice.actions

export default accountSlice.reducer