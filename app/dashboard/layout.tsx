"use client"

import type React from "react"

import { useAuth } from "@/lib/privy-auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Coffee, Bot, Settings, Users, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, logout, hasRole, isSuperAdmin } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  const handleLogout = () => {
    logout()
    router.push("/auth")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white shadow-md"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Bearified Apps
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-4 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <Settings className="h-5 w-5 text-gray-600" />
              <span>Dashboard</span>
            </Link>

            <div className="pt-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Applications</h3>

              <Link
                href="/dashboard/solebrew"
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                  hasRole("solebrew") ? "hover:bg-amber-50 text-amber-700" : "text-gray-400 cursor-not-allowed"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <Coffee className="h-5 w-5" />
                  <span>SoleBrew</span>
                </div>
                {hasRole("solebrew") ? (
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
                  hasRole("chimpanion") ? "hover:bg-green-50 text-green-700" : "text-gray-400 cursor-not-allowed"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className="flex items-center space-x-3">
                  <Bot className="h-5 w-5" />
                  <span>Chimpanion</span>
                </div>
                {hasRole("chimpanion") ? (
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
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Administration</h3>
                <Link
                  href="/admin"
                  className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-purple-50 text-purple-700 transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  <span>Admin Panel</span>
                </Link>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="p-4 border-t">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {user.role.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen">
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
