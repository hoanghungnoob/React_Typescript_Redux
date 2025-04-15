import { configureStore } from "@reduxjs/toolkit"
import userReducer from "../features/user/userSlice"
import authReducer from "../features/auth/authSlice"
import productReducer  from "../features/product/productSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    product: productReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
