"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type User, type App, authenticateUser, getUserApps } from "./mock-auth"

interface AuthContextType {
  user: User | null
  apps: App[]
  loading: boolean
  login: (email: string) => Promise<boolean>
  logout: () => void
  hasRole: (role: string) => boolean
  isSuperAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)

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

  const login = async (email: string): Promise<boolean> => {
    setLoading(true)
    try {
      const userData = await authenticateUser(email)
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
    return user?.roles.includes(role) || false
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
        login,
        logout,
        hasRole,
        isSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
