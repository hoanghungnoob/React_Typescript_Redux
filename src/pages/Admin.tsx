"use client"

import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { selectUser } from "../features/auth/authSlice"

export default function Admin() {
  const user = useSelector(selectUser)
  const navigate = useNavigate()

  useEffect(() => {
    // Double-check that the user has admin role
    if (user?.role !== "admin") {
      navigate("/")
    }
  }, [user, navigate])

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <p>Welcome to the admin area. This page is only accessible to administrators.</p>

      {/* Admin functionality would go here */}
      <div className="admin-section">
        <h2>User Management</h2>
        <p>Here you can manage users...</p>
      </div>
    </div>
  )
}
