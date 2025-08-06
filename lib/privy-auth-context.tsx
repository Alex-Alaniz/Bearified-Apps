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
    // Extract email from Privy user
    const emailAccount = privyUser.linkedAccounts?.find((account: any) => account.type === "email")
    const phoneAccount = privyUser.linkedAccounts?.find((account: any) => account.type === "phone")
    
    const userEmail = emailAccount?.address || fallbackEmail

    // For Privy authentication, always create user from Privy data
    // Don't fall back to mock auth for any users when using Privy

    // Create user profile from Privy data
    // Check if this is the super admin email to assign proper role
    const isSuperAdmin = userEmail === "alex@alexalaniz.com"
    
    const userData: User = {
      id: privyUser.id,
      email: userEmail,
      name: userEmail.split("@")[0] || phoneAccount?.number || "User",
      role: isSuperAdmin ? "super_admin" : "user",
      roles: isSuperAdmin ? ["user", "admin", "super_admin"] : ["user"],
      apps: isSuperAdmin ? ["solebrew", "chimpanion", "admin"] : ["solebrew", "chimpanion"],
      isAuthenticated: true
    }

    return userData
  } catch (error) {
    console.error("Error authenticating Privy user:", error)
    // Fallback to mock auth if Privy processing fails
    return await authenticateUser(fallbackEmail)
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
    
    // If using Privy, also logout from Privy
    if (authMode === "hybrid" && typeof window !== 'undefined') {
      // We'll handle Privy logout in the components that have access to Privy hooks
      window.location.href = "/auth"
    }
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