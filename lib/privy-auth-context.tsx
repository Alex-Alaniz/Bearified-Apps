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
async function authenticatePrivyUser(privyUser: any, identifier: string): Promise<User | null> {
  try {
    // First, check if it's a test user email (for hybrid mode)
    const testUser = await authenticateUser(identifier)
    if (testUser) {
      return testUser
    }

    // Otherwise, create a user from Privy data
    const email = privyUser.email?.address || privyUser.google?.email || privyUser.twitter?.username || identifier
    const name = privyUser.google?.name || privyUser.twitter?.name || email.split('@')[0]
    
    // In production, you would fetch user data from your database using the Privy user ID
    // For now, we'll create a basic user object
    const user: User = {
      id: privyUser.id,
      email: email,
      name: name,
      role: "user", // Default role - in production, fetch from your database
      roles: ["user"],
      apps: ["solebrew", "chimpanion"], // Default apps - in production, fetch from your database
      isAuthenticated: true
    }

    return user
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
    // Check for stored user on mount
    const storedUser = localStorage.getItem("bearified_user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setApps(getUserApps(userData))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("bearified_user")
      }
    }
    setLoading(false)
  }, [])

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

// Helper function to authenticate Privy users with fallback to test users
async function authenticatePrivyUser(privyUser: any, fallbackEmail: string): Promise<User | null> {
  try {
    // Extract email from Privy user
    const emailAccount = privyUser.linkedAccounts?.find((account: any) => account.type === "email")
    const twitterAccount = privyUser.linkedAccounts?.find((account: any) => account.type === "twitter_oauth")
    const googleAccount = privyUser.linkedAccounts?.find((account: any) => account.type === "google_oauth")
    
    const userEmail = emailAccount?.address || googleAccount?.email || fallbackEmail

    // Check if this is a test user (still use mock auth for testing)
    const testEmails = [
      "admin@bearified.com",
      "user@bearified.com", 
      "solebrew@bearified.com",
      "chimpanion@bearified.com"
    ]

    if (testEmails.includes(userEmail)) {
      // Use mock authentication for test users
      return await authenticateUser(userEmail)
    }

    // For real Privy users, create a basic user profile
    const userData: User = {
      id: privyUser.id,
      email: userEmail,
      name: twitterAccount?.name || googleAccount?.name || userEmail.split("@")[0],
      role: "user", // Default role for new Privy users
      roles: ["user"],
      avatar: twitterAccount?.profilePictureUrl || googleAccount?.profilePictureUrl || null,
      createdAt: new Date().toISOString(),
      walletAddress: privyUser.linkedAccounts?.find((account: any) => 
        account.type === "wallet" || account.type === "smart_wallet"
      )?.address || null,
    }

    return userData
  } catch (error) {
    console.error("Error authenticating Privy user:", error)
    // Fallback to mock auth if Privy processing fails
    return await authenticateUser(fallbackEmail)
  }
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