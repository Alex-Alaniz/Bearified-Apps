"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coffee, Bot, Users, Activity, TrendingUp, Shield, Settings, Globe, Package } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/privy-auth-context"
import { APP_CONFIGS, getAccessibleApps } from "@/lib/app-configs"

const iconMap = {
  Coffee,
  Bot,
  Settings,
  Globe,
  Package,
}

export default function DashboardPage() {
  const { user, hasRole, isSuperAdmin } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Get accessible apps dynamically
  const userRoles = user.roles || []
  const accessibleApps = getAccessibleApps(userRoles).filter(app => app.id !== 'admin')
  
  // Calculate real stats
  const activeApps = accessibleApps.length
  const userAccess = accessibleApps.length

  // Check if user has no access
  if (!user.roles || user.roles.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <Shield className="h-16 w-16 text-gray-400 mx-auto" />
          <h2 className="text-2xl font-semibold">Access Pending</h2>
          <p className="text-gray-600 max-w-md">
            Your account is pending approval. Please contact an administrator to grant you access to applications.
          </p>
          <p className="text-sm text-gray-500">
            Logged in as: {user.email}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-gray-600 mt-2">Here's what's happening across your applications</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Apps</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeApps}</div>
            <p className="text-xs text-muted-foreground">Applications available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Access</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userAccess}</div>
            <p className="text-xs text-muted-foreground">Apps you can access</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">Uptime this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Applications Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Your Applications</h2>
        {accessibleApps.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Applications Available</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                You don't have access to any applications yet. Contact an administrator to request access.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {accessibleApps.map((app) => {
              const Icon = iconMap[app.icon as keyof typeof iconMap] || Settings
              const hasAppAccess = app.requiredRoles?.some(role => userRoles.includes(role)) || userRoles.includes('super_admin') || userRoles.includes('admin')
              const gradientColor = app.color.includes('gradient') ? app.color : `bg-gradient-to-br ${app.color}`
              
              return (
                <Card key={app.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${gradientColor} rounded-lg flex items-center justify-center`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{app.name}</CardTitle>
                          <CardDescription>{app.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        {hasAppAccess ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">No Access</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {app.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {app.features?.length > 0 
                        ? `Features: ${app.features.slice(0, 3).join(', ')}${app.features.length > 3 ? '...' : ''}` 
                        : 'Application features and capabilities.'}
                    </p>
                    <div className="flex space-x-2">
                      {hasAppAccess ? (
                        <Button asChild>
                          <Link href={app.href}>Open App</Link>
                        </Button>
                      ) : (
                        <Button disabled>No Access</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Admin Section */}
      {isSuperAdmin() && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Administration</h2>
          <Card>
            <CardHeader>
              <CardTitle>System Administration</CardTitle>
              <CardDescription>Manage users, applications, and system settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button asChild>
                  <Link href="/admin">Admin Panel</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/users">Manage Users</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/admin/apps">Manage Apps</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <Card>
          <CardHeader>
            <CardTitle>System Events</CardTitle>
            <CardDescription>Latest activity across your applications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">System startup completed</p>
                  <p className="text-xs text-gray-500">All applications are running normally</p>
                </div>
                <span className="text-xs text-gray-500">2 minutes ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">User authentication successful</p>
                  <p className="text-xs text-gray-500">Welcome back to Bearified Apps</p>
                </div>
                <span className="text-xs text-gray-500">5 minutes ago</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Database connection established</p>
                  <p className="text-xs text-gray-500">All data services are operational</p>
                </div>
                <span className="text-xs text-gray-500">10 minutes ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}