import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Provider } from "react-redux"
import { useSelector } from "react-redux"
import { store } from "./app/store"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { Home } from "./pages/Home"
import LoginForm from "./components/LoginForm"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Dashboard } from "./pages/Dashboard"
import { Profile } from "./pages/Profile"
import NotFound from "./pages/NotFound"
import "./App.css"
import { selectIsAuthenticated } from "./features/auth/authSlice"
import ProductPage from "./pages/Product"

// Layout component that conditionally renders Header and Footer
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  return (
    <div className="app">
      {isAuthenticated && <Header />}
      <main className="main-content" style={{paddingTop:'70px'}} >{children}</main>
      {<Footer />}
    </div>
  )
}

// Wrapper for the Provider to use the AppLayout
function AppWithProvider() {
  return (
    <Provider store={store}>
      <Router>
        <AppLayout>
          <Routes>
            {/* Auth routes - only for non-authenticated users */}
            <Route element={<ProtectedRoute requireAuth={false} redirectPath="/dashboard" />}>
              <Route path="/login" element={<LoginForm />} />
            </Route>

            {/* Redirect root to dashboard or login based on auth status */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route element={<ProtectedRoute requireAuth={true} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/user" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/product" element={<ProductPage />} />
            </Route>

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </Router>
    </Provider>
  )
}

function App() {
  return <AppWithProvider />
}

export default App
