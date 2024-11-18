import { configureStore } from '@reduxjs/toolkit'
import  accountSlice   from './reducers/account'
import  authSlice  from './reducers/auth'

export const store =  configureStore({
  reducer: {
    account: accountSlice, 
    auth: authSlice
  }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch