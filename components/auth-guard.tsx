"use client"

import type React from "react"

import { useAuth } from "@/lib/privy-auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "super_admin" | "admin" | "user"
  requiredApp?: string
}

export function AuthGuard({ children, requiredRole, requiredApp }: AuthGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth")
      return
    }

    if (user && requiredRole) {
      const roleHierarchy = { super_admin: 3, admin: 2, user: 1 }
      const userLevel = roleHierarchy[user.role]
      const requiredLevel = roleHierarchy[requiredRole]

      if (userLevel < requiredLevel) {
        router.push("/dashboard")
        return
      }
    }

    if (user && requiredApp && !user.apps.includes(requiredApp)) {
      router.push("/dashboard")
      return
    }
  }, [user, isLoading, isAuthenticated, requiredRole, requiredApp, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  if (requiredRole && user) {
    const roleHierarchy = { super_admin: 3, admin: 2, user: 1 }
    const userLevel = roleHierarchy[user.role]
    const requiredLevel = roleHierarchy[requiredRole]

    if (userLevel < requiredLevel) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">You don't have permission to access this page.</p>
          </div>
        </div>
      )
    }
  }

  if (requiredApp && user && !user.apps.includes(requiredApp)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">App Access Required</h1>
          <p className="text-gray-600">You don't have access to this application.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
