import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../../app/store"
import { loginUser, logoutUser } from "../../api/authApi"

// Define types
export interface User {
  id: string
  email: string
  role: "admin" | "user"
  name: string
  created_at: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// Get user from localStorage
const getUserFromStorage = (): User | null => {
  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch (error) {
    console.error("Error parsing user from localStorage:", error)
    return null
  }
}

// Initial state
const initialState: AuthState = {
  user: getUserFromStorage(),
  token: localStorage.getItem("token"),
  isAuthenticated: !!(localStorage.getItem("token") && getUserFromStorage()),
  isLoading: false,
  error: null,
}

// Async thunks
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await loginUser(credentials)
      const token = data.token

      // Store both token and user in localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(data.user))

      return {
        user: data.user,
        token,
      }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : "Đăng nhập thất bại")
    }
  },
)

export const logout = createAsyncThunk("auth/logout", async () => {
  await logoutUser()
  // Clear both token and user from localStorage
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  return null
})

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
  },
})

// Export actions and reducer
export const { clearError } = authSlice.actions
export const selectAuth = (state: RootState) => state.auth
export const selectUser = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated

export default authSlice.reducer
