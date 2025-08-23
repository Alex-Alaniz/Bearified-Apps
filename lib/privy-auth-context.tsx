"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type User, type App, authenticateUser, getUserApps } from "./mock-auth"

// Environment flag to control auth mode
const USE_PRIVY_AUTH = process.env.NEXT_PUBLIC_USE_PRIVY_AUTH === "true"

interface AuthContextType {
  user: User | null
  apps: App[]
  loading: boolean
  authMode: "mock" | "privy" | "hybrid"
  login: (identifier: string, privyUser?: any) => Promise<boolean>
  logout: () => void
  hasRole: (role: string) => boolean
  isSuperAdmin: () => boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Function to authenticate Privy users and map to our User type
async function authenticatePrivyUser(privyUser: any, fallbackEmail: string): Promise<User | null> {
  try {
    // Extract email and phone from Privy user
    const emailAccount = privyUser.linkedAccounts?.find((account: any) => account.type === "email")
    const phoneAccount = privyUser.linkedAccounts?.find((account: any) => account.type === "phone")
    
    const userEmail = emailAccount?.address || fallbackEmail
    const userPhone = phoneAccount?.phoneNumber || phoneAccount?.number

    // Fetch or create user data from database
    try {
      const response = await fetch('/api/auth/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          privyId: privyUser.id,
          email: userEmail,
          phone: userPhone
        })
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          // Map database user to our User type
          const userData: User = {
            id: privyUser.id,
            email: data.user.email,
            name: data.user.name || userEmail?.split("@")[0] || userPhone || "User",
            role: data.user.roles?.includes("super_admin") ? "super_admin" : 
                  data.user.roles?.includes("admin") ? "admin" : "user",
            roles: data.user.roles || [],
            apps: data.user.apps || [],
            isAuthenticated: true
          }

          // Log if this is a new user
          if (data.created) {
            console.log("New user created:", userData.email, "Status:", data.user.status)
          }

          return userData
        }
      }
    } catch (fetchError) {
      console.error("Could not fetch/create user in database:", fetchError)
    }

    // If database operation fails, return minimal access
    console.warn("Database operation failed, returning user with no access")
    const userData: User = {
      id: privyUser.id,
      email: userEmail || `phone_${userPhone}@privy.user`,
      name: userEmail?.split("@")[0] || userPhone || "User",
      role: "user",
      roles: [], // No roles = no access
      apps: [], // No apps = no access
      isAuthenticated: true
    }

    return userData
  } catch (error) {
    console.error("Error authenticating Privy user:", error)
    return null
  }
}

export function BearifiedAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [authMode] = useState<"mock" | "privy" | "hybrid">(
    USE_PRIVY_AUTH ? "hybrid" : "mock"
  )

  useEffect(() => {
    // Check for stored user on mount - only once
    const storedUser = localStorage.getItem("bearified_user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        // Validate the stored user data
        if (userData && userData.id && userData.email) {
          setUser(userData)
          setApps(getUserApps(userData))
        } else {
          localStorage.removeItem("bearified_user")
        }
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("bearified_user")
      }
    }
    setLoading(false)
  }, []) // Empty dependency array - run only once

  const login = async (identifier: string, privyUser?: any): Promise<boolean> => {
    setLoading(true)
    try {
      let userData: User | null = null

      if (authMode === "hybrid" && privyUser) {
        // Privy user with fallback to test users
        userData = await authenticatePrivyUser(privyUser, identifier)
      } else if (authMode === "mock") {
        // Mock authentication for development only
        userData = await authenticateUser(identifier)
      } else {
        // Privy auth mode - no mock login allowed
        console.error("Privy authentication required. Please use the Privy login.")
        return false
      }

      if (userData) {
        setUser(userData)
        setApps(getUserApps(userData))
        localStorage.setItem("bearified_user", JSON.stringify(userData))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setApps([])
    localStorage.removeItem("bearified_user")
    
    // Don't redirect here - let the components handle navigation after Privy logout
  }

  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) || false
  }

  const isSuperAdmin = (): boolean => {
    return user?.role === "super_admin" || false
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        apps,
        loading,
        authMode,
        login,
        logout,
        hasRole,
        isSuperAdmin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}


export function useBearifiedAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useBearifiedAuth must be used within a BearifiedAuthProvider")
  }
  return context
}

// Alias for backward compatibility
export const useAuth = useBearifiedAuth
export const AuthProvider = BearifiedAuthProvider