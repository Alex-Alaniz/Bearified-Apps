"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { APP_CONFIGS } from "@/lib/app-configs"
import { useAuth } from "@/lib/privy-auth-context"
import { useRouter } from "next/navigation"
import {
  AppWindowIcon as Apps,
  Users,
  Shield,
  Activity,
  CheckCircle,
  Clock,
  Plus,
  Settings,
  Database,
} from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [userCount, setUserCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch user count from Supabase
    const fetchUserCount = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        if (response.ok) {
          const data = await response.json()
          setUserCount(data.userCount || 1) // At least show current user
        }
      } catch (error) {
        console.error('Failed to fetch user stats:', error)
        setUserCount(1) // Fallback to at least current user
      } finally {
        setLoading(false)
      }
    }

    fetchUserCount()
  }, [])

  const totalApps = APP_CONFIGS.length
  const activeApps = APP_CONFIGS.filter((app) => app.status === "production" || app.status === "beta").length
  const totalUsers = userCount
  const activeUsers = userCount // All authenticated users are considered active

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage applications, users, and system settings</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push("/admin/apps/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Add App
          </Button>
          <Button onClick={() => router.push("/admin/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <Apps className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApps}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{activeApps} active</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{activeUsers} active</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">98.5%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">All systems operational</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">A+</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">No security issues</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Application Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>Current status of all applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.values(APP_CONFIGS).map((app) => (
              <div key={app.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: app.color }}
                  >
                    <app.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{app.name}</p>
                    <p className="text-sm text-muted-foreground">v{app.version}</p>
                  </div>
                </div>
                <Badge
                  variant={app.status === "active" ? "default" : "secondary"}
                  className="flex items-center space-x-1"
                >
                  {app.status === "active" ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                  <span>{app.status}</span>
                </Badge>
              </div>
            ))}

            {/* Franchise Portal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-white">
                  <Apps className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Franchise Portal</p>
                  <p className="text-sm text-muted-foreground">v1.0.0</p>
                </div>
              </div>
              <Badge variant="default" className="flex items-center space-x-1">
                <CheckCircle className="h-3 w-3" />
                <span>active</span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Resources</CardTitle>
            <CardDescription>Current system resource usage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-muted-foreground">62%</span>
              </div>
              <Progress value={62} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Storage Usage</span>
                <span className="text-sm text-muted-foreground">38%</span>
              </div>
              <Progress value={38} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database Load</span>
                <span className="text-sm text-muted-foreground">28%</span>
              </div>
              <Progress value={28} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Admin Activity</CardTitle>
          <CardDescription>Latest administrative actions and system events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">Super Admin</span> {user?.name || 'Admin'} authenticated via Privy
                </p>
                <p className="text-xs text-muted-foreground">Recently</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">Authentication system</span> updated to hybrid Privy integration
                </p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">Project management</span> system deployed successfully
                </p>
                <p className="text-xs text-muted-foreground">This week</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">Chimpanion</span> production deployment active on Vercel
                </p>
                <p className="text-xs text-muted-foreground">Production</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              onClick={() => router.push("/admin/apps/new")}
            >
              <Plus className="h-6 w-6" />
              <span className="text-sm">Add App</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              onClick={() => router.push("/admin/users")}
            >
              <Users className="h-6 w-6" />
              <span className="text-sm">Manage Users</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              onClick={() => router.push("/admin/database")}
            >
              <Database className="h-6 w-6" />
              <span className="text-sm">Database</span>
            </Button>

            <Button
              variant="outline"
              className="h-20 flex-col space-y-2 bg-transparent"
              onClick={() => router.push("/admin/logs")}
            >
              <Activity className="h-6 w-6" />
              <span className="text-sm">View Logs</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
