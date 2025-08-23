"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { APP_CONFIGS } from "@/lib/app-configs"
import { getUserAuthMethod, getUserSlug, getUserDisplayEmail } from "@/lib/user-utils"
import {
  ArrowLeft,
  Plus,
  Search,
  Users,
  Mail,
  Phone,
  Wallet,
  Edit,
  Shield,
} from "lucide-react"

interface AppUsersPageProps {
  params: { id: string }
}

export default function AppUsersPage({ params }: AppUsersPageProps) {
  const router = useRouter()
  const [app, setApp] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Find the app in APP_CONFIGS
        const foundApp = APP_CONFIGS.find(a => a.id === params.id)
        if (foundApp) {
          setApp(foundApp)
        }

        // Fetch all users and filter by app roles
        const response = await fetch('/api/admin/users')
        if (response.ok) {
          const data = await response.json()
          const allUsers = data.users || []
          
          // Filter users who have roles for this app
          const appUsers = allUsers.filter((user: any) => {
            const userRoles = user.roles || []
            return userRoles.some((role: string) => 
              role.includes(params.id) || 
              role === 'super_admin' || 
              role === 'admin'
            )
          }).map((user: any) => ({
            ...user,
            avatar: user.avatar || "/placeholder.svg?height=40&width=40&text=" + (user.name || user.email || 'U').charAt(0).toUpperCase(),
            status: user.avatar?.startsWith('status:') ? user.avatar.replace('status:', '') : (user.roles?.length > 0 ? "active" : "pending"),
            lastLogin: user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : "Never",
          }))
          
          setUsers(appUsers)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAppRoleForUser = (user: any) => {
    const userRoles = user.roles || []
    const appRole = userRoles.find((role: string) => role.includes(params.id))
    
    if (userRoles.includes('super_admin')) return 'Super Admin'
    if (userRoles.includes('admin')) return 'Platform Admin'
    if (appRole?.includes('-admin')) return 'App Admin'
    if (appRole?.includes('-member')) return 'App Member'
    return 'No App Role'
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loading...</h1>
            <p className="text-muted-foreground">Loading app users</p>
          </div>
        </div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">App Not Found</h1>
            <p className="text-muted-foreground">The requested application could not be found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{app.name} Users</h1>
            <p className="text-muted-foreground">Manage users with access to {app.name}</p>
          </div>
        </div>
        <Button onClick={() => router.push("/admin/users/new")}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              With access to {app.name}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">App Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.roles?.some((r: string) => r.includes(`${params.id}-admin`))).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Admin access level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">App Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(u => u.roles?.some((r: string) => r.includes(`${params.id}-member`))).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Member access level
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users with Access</CardTitle>
          <CardDescription>All users who have access to {app.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>App Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {(user.name || user.email || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          {getUserAuthMethod(user) === 'email' && <Mail className="h-3 w-3 mr-1" />}
                          {getUserAuthMethod(user) === 'phone' && <Phone className="h-3 w-3 mr-1" />}
                          {getUserAuthMethod(user) === 'wallet' && <Wallet className="h-3 w-3 mr-1" />}
                          {getUserDisplayEmail(user)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getAppRoleForUser(user).includes('Admin') ? 'default' : 'secondary'}>
                      {getAppRoleForUser(user)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/admin/users/${getUserSlug(user)}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-6">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No users found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? "No users match your search criteria."
                  : `No users have access to ${app.name} yet.`
                }
              </p>
              <div className="mt-6">
                <Button onClick={() => router.push("/admin/users/new")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First User
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}