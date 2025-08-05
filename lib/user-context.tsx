"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: number
  name: string
  email: string
  avatar: string
  roles: string[]
}

export const TEST_USERS: User[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@company.com",
    avatar: "/placeholder.svg?height=40&width=40&text=AU",
    roles: ["admin", "solebrew-admin", "chimpanion-admin"],
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@solebrew.com",
    avatar: "/placeholder.svg?height=40&width=40&text=SJ",
    roles: ["solebrew-admin"],
  },
  {
    id: 3,
    name: "Mike Chen",
    email: "mike@chimpanion.com",
    avatar: "/placeholder.svg?height=40&width=40&text=MC",
    roles: ["chimpanion-member"],
  },
  {
    id: 4,
    name: "Emma Davis",
    email: "emma@solebrew.com",
    avatar: "/placeholder.svg?height=40&width=40&text=ED",
    roles: ["solebrew-member"],
  },
  {
    id: 5,
    name: "Alex Rodriguez",
    email: "alex@company.com",
    avatar: "/placeholder.svg?height=40&width=40&text=AR",
    roles: ["solebrew-member", "chimpanion-member"],
  },
  {
    id: 6,
    name: "Lisa Thompson",
    email: "lisa@company.com",
    avatar: "/placeholder.svg?height=40&width=40&text=LT",
    roles: [], // No roles - should have no access
  },
]

interface UserContextType {
  currentUser: User
  switchUser: (userId: number) => void
  isAdmin: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(TEST_USERS[0]) // Default to admin

  const switchUser = (userId: number) => {
    const user = TEST_USERS.find((u) => u.id === userId)
    if (user) {
      setCurrentUser(user)
      // In a real app, you'd also update authentication state here
      localStorage.setItem("currentUserId", userId.toString())
    }
  }

  const isAdmin = currentUser.roles.includes("admin")

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUserId = localStorage.getItem("currentUserId")
    if (savedUserId) {
      const user = TEST_USERS.find((u) => u.id === Number.parseInt(savedUserId))
      if (user) {
        setCurrentUser(user)
      }
    }
  }, [])

  return <UserContext.Provider value={{ currentUser, switchUser, isAdmin }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
