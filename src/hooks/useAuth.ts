import { useSelector } from "react-redux"
import { selectAuth, selectUser, selectIsAuthenticated } from "../features/auth/authSlice"

export const useAuth = () => {
  const auth = useSelector(selectAuth)
  const user = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  return {
    ...auth,
    user,
    isAuthenticated,
    isAdmin: user?.role === "admin",
  }
}
