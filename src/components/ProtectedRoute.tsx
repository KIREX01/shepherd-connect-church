"use client"

import { useAuth } from "@/hooks/useAuth"
import { Navigate } from "react-router-dom"
import type { ReactNode } from "react"
import { LoadingSpinner } from "@/components/LoadingSpinner"

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: "admin" | "pastor" | "member"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, userRole } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" />
  }

  if (requiredRole && userRole !== requiredRole && userRole !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
