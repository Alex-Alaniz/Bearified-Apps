"use client"

import type React from "react"

import { useAuth } from "@/lib/privy-auth-context"
import { usePrivy } from "@privy-io/react-auth"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Coffee, Bot, Settings, Users, LogOut, Menu, X, Globe } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { ThemeToggleSimple } from "@/components/theme-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, logout, hasRole, isSuperAdmin, authMode } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  // Hide main sidebar on app-specific routes
  const isAppSpecificRoute = pathname && (
    pathname.startsWith('/dashboard/solebrew') ||
    pathname.startsWith('/dashboard/chimpanion') ||
    pathname.startsWith('/dashboard/golf')
  )
  const USE_PRIVY = process.env.NEXT_PUBLIC_USE_PRIVY_AUTH === "true"
  
  // Only use Privy hooks when Privy is enabled
  const privyLogout = USE_PRIVY ? usePrivy().logout : null

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    try {
      logout()
      router.push("/auth?logout=true")
      
      if (USE_PRIVY && authMode === "hybrid" && privyLogout) {
        setTimeout(async () => {
          try {
            await privyLogout()
          } catch (error) {
            console.error("Privy logout error:", error)
          }
        }, 100)
      }
    } catch (error) {
      console.error("Logout error:", error)
      router.push("/auth?logout=true")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile menu button and theme toggle - only show on main dashboard route */}
      {!isAppSpecificRoute && (
        <div className="lg:hidden fixed top-4 left-4 z-50 flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-white dark:bg-gray-800 shadow-md"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-md">
            <ThemeToggleSimple />
          </div>
        </div>
      )}

      {/* Sidebar - hide on app-specific routes */}
      {!isAppSpecificRoute && (
        <div
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">B</span>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Bearified Apps
                  </span>
                </div>
                <div className="hidden lg:block">
                  <ThemeToggleSimple />
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 p-4 space-y-2">
              <Link
                href="/dashboard"
                className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span>Dashboard</span>
              </Link>

              <div className="pt-4">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Applications</h3>

                <Link
                  href="/dashboard/solebrew"
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    hasRole("solebrew") || hasRole("solebrew-admin") || hasRole("solebrew-member") || hasRole("admin") || hasRole("super_admin") ? "hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-700 dark:text-amber-400" : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Coffee className="h-5 w-5" />
                    <span>SoleBrew</span>
                  </div>
                  {hasRole("solebrew") || hasRole("solebrew-admin") || hasRole("solebrew-member") || hasRole("admin") || hasRole("super_admin") ? (
                    <Badge variant="default" className="text-xs">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      No Access
                    </Badge>
                  )}
                </Link>

                <Link
                  href="/dashboard/chimpanion"
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    hasRole("chimpanion") || hasRole("chimpanion-admin") || hasRole("chimpanion-member") || hasRole("admin") || hasRole("super_admin") ? "hover:bg-green-50 dark:hover:bg-green-900/20 text-green-700 dark:text-green-400" : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Bot className="h-5 w-5" />
                    <span>Chimpanion</span>
                  </div>
                  {hasRole("chimpanion") || hasRole("chimpanion-admin") || hasRole("chimpanion-member") || hasRole("admin") || hasRole("super_admin") ? (
                    <Badge variant="default" className="text-xs">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      No Access
                    </Badge>
                  )}
                </Link>

                <Link
                  href="/dashboard/golf"
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    hasRole("golf") || hasRole("golf-admin") || hasRole("golf-member") || hasRole("admin") || hasRole("super_admin") ? "hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-700 dark:text-blue-400" : "text-gray-400 dark:text-gray-600 cursor-not-allowed"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5" />
                    <span>Golf App</span>
                  </div>
                  {hasRole("golf") || hasRole("golf-admin") || hasRole("golf-member") || hasRole("admin") || hasRole("super_admin") ? (
                    <Badge variant="default" className="text-xs">
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      No Access
                    </Badge>
                  )}
                </Link>
              </div>

              {isSuperAdmin() && (
                <div className="pt-4">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Administration</h3>
                  <Link
                    href="/admin"
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-700 dark:text-purple-400 transition-colors"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Users className="h-5 w-5" />
                    <span>Admin Panel</span>
                  </Link>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="p-4 border-t dark:border-gray-700">
              <Card className="dark:bg-gray-700/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {user.role.replace("_", " ").toUpperCase()}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleLogout}
                      className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Mobile overlay - only show when main sidebar is active */}
      {!isAppSpecificRoute && sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className={`min-h-screen ${isAppSpecificRoute ? '' : 'lg:ml-64'}`}>
        <main className={isAppSpecificRoute ? '' : 'p-6 lg:p-8'}>{children}</main>
      </div>
    </div>
  )
}