"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { APP_CONFIGS } from "@/lib/app-configs"
import { useRouter } from "next/navigation"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Settings,
  Users,
  Activity,
  CheckCircle,
  Clock,
  AlertCircle,
  Coffee,
  Shield,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AppManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [apps, setApps] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch apps and users in parallel
        const [appsResponse, usersResponse] = await Promise.all([
          fetch('/api/admin/apps'),
          fetch('/api/admin/users')
        ])
        
        if (appsResponse.ok) {
          const appsData = await appsResponse.json()
          const appsWithIcons = appsData.apps.map(app => ({
            ...app,
            version: "1.0.0",
            icon: app.icon === "Coffee" ? Coffee : app.icon === "Shield" ? Shield : Settings,
            color: typeof app.color === 'string' ? app.color : 
                   app.color?.includes("amber") ? "#f59e0b" : 
                   app.color?.includes("green") ? "#10b981" : 
                   app.color?.includes("purple") ? "#8b5cf6" : "#6b7280"
          }))
          setApps(appsWithIcons)
        } else {
          // Fallback to APP_CONFIGS if API fails
          const fallbackApps = APP_CONFIGS.map(app => ({
            ...app,
            version: "1.0.0",
            icon: app.icon === "Coffee" ? Coffee : app.icon === "Shield" ? Shield : Settings,
            color: app.color.includes("amber") ? "#f59e0b" : 
                   app.color.includes("green") ? "#10b981" : 
                   app.color.includes("purple") ? "#8b5cf6" : "#6b7280"
          }))
          setApps(fallbackApps)
        }
        
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setUsers(usersData.users || [])
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const allApps = apps

  // Function to count users for a specific app based on roles
  const getUserCountForApp = (appId: string) => {
    if (!users.length) return 0
    
    return users.filter(user => {
      const userRoles = user.roles || []
      
      // Super admin and admin have access to all apps
      if (userRoles.includes('super_admin') || userRoles.includes('admin')) {
        return true
      }
      
      // Check app-specific roles
      switch (appId) {
        case 'solebrew':
          return userRoles.some(role => role.includes('solebrew'))
        case 'chimpanion':
          return userRoles.some(role => role.includes('chimpanion'))
        case 'admin':
          return false // Only admin/super_admin counted above
        default:
          return false
      }
    }).length
  }

  const filteredApps = allApps.filter(
    (app) =>
      app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "production":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "development":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "beta":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "production":
        return "bg-green-100 text-green-800"
      case "development":
        return "bg-yellow-100 text-yellow-800"
      case "beta":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">App Management</h1>
            <p className="text-muted-foreground">Loading applications...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">App Management</h1>
          <p className="text-muted-foreground">Manage all applications and their configurations</p>
        </div>
        <Button onClick={() => router.push("/admin/apps/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add New App
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Apps</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allApps.length}</div>
            <p className="text-xs text-muted-foreground">
              {allApps.filter((app) => app.status === "production").length} in production
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Production Apps</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {allApps.filter((app) => app.status === "production").length}
            </div>
            <p className="text-xs text-muted-foreground">Live and running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Development</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {allApps.filter((app) => app.status === "development").length}
            </div>
            <p className="text-xs text-muted-foreground">Under development</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Across all apps</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Apps Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>Manage all applications and their settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApps.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
                        style={{ backgroundColor: app.color }}
                      >
                        <app.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">{app.name}</p>
                        <p className="text-sm text-muted-foreground">{app.description}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{app.version}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(app.status)}>
                      {getStatusIcon(app.status)}
                      <span className="ml-1">{app.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">
                      {getUserCountForApp(app.id)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {app.features?.slice(0, 2).map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature.replace(/[-_]/g, " ")}
                        </Badge>
                      ))}
                      {app.features && app.features.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{app.features.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">2 hours ago</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit App
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Users className="mr-2 h-4 w-4" />
                          Manage Users
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Activity className="mr-2 h-4 w-4" />
                          View Logs
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete App
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}