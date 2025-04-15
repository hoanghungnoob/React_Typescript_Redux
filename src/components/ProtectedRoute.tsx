"use client"

import type React from "react"

import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

interface ProtectedRouteProps {
  requireAuth?: boolean
  requireAdmin?: boolean
  redirectPath?: string
  children?: React.ReactNode
}

export const ProtectedRoute = ({
  requireAuth = true,
  requireAdmin = false,
  redirectPath = "/login",
  children,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  // Check if user is authenticated when required
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectPath} state={{ from: location }} replace />
  }

  // Check if user is NOT authenticated when authentication should NOT be required
  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  // Check if user is admin when admin role is required
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  // If there are children, render them, otherwise render the Outlet
  return children ? <>{children}</> : <Outlet />
}
