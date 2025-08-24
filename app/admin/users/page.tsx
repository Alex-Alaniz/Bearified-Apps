"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Shield, Users, UserCheck, UserX, Mail, RefreshCw, Phone, Wallet } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/privy-auth-context"
import { getUserAuthMethod, getUserSlug, getUserDisplayEmail } from "@/lib/user-utils"

// Users will be loaded from Supabase database
const mockUsers: any[] = []

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()
  const { user: currentUser } = useAuth()
  
  // State for all users from database
  const [allUsers, setAllUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  
  // Fetch all users from the database
  const fetchUsers = async () => {
      try {
        const response = await fetch('/api/admin/users')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.users) {
            // Transform database users to match the UI format
            const transformedUsers = data.users.map((user: any) => ({
              id: user.id,
              name: user.name || user.email?.split('@')[0] || 'User',
              email: user.email,
              phone: user.phone,
              avatar: user.avatar || "/placeholder.svg?height=40&width=40&text=" + (user.name || user.email || 'U').charAt(0).toUpperCase(),
              roles: user.roles || [],
              // Use same status logic as individual user page - check avatar field first
              status: user.avatar?.startsWith('status:') ? user.avatar.replace('status:', '') : (user.roles?.length > 0 ? "active" : "pending"),
              lastLogin: user.last_login_at ? new Date(user.last_login_at).toLocaleDateString() : "Never",
              apps: ["SoleBrew", "Chimpanion", "Golf App", "Admin Panel"].filter(app => {
                // Filter apps based on user roles
                if (user.roles?.includes("super_admin") || user.roles?.includes("admin")) return true
                if (app === "SoleBrew" && (user.roles?.includes("solebrew") || user.roles?.includes("solebrew-admin") || user.roles?.includes("solebrew-member"))) return true
                if (app === "Chimpanion" && (user.roles?.includes("chimpanion") || user.roles?.includes("chimpanion-admin") || user.roles?.includes("chimpanion-member"))) return true
                if (app === "Golf App" && (user.roles?.includes("golf") || user.roles?.includes("golf-admin") || user.roles?.includes("golf-member"))) return true
                return false
              }),
            }))
            setAllUsers(transformedUsers)
          }
        } else {
          // Fallback to showing just the current user
          if (currentUser) {
            const currentUserData = {
              id: "super-admin",
              name: currentUser.name || "Unknown User",
              email: currentUser.email || "no-email@bearified.com",
              avatar: currentUser.avatar || "/placeholder.svg?height=40&width=40&text=U",
              roles: currentUser.roles || [],
              status: "active",
              lastLogin: "Just now",
              apps: currentUser.apps || [],
            }
            setAllUsers([currentUserData])
          }
        }
      } catch (error) {
        console.error('Failed to fetch users:', error)
        // Fallback to current user
        if (currentUser) {
          const currentUserData = {
            id: "super-admin",
            name: currentUser.name || "Unknown User",
            email: currentUser.email || "no-email@bearified.com",
            avatar: currentUser.avatar || "/placeholder.svg?height=40&width=40&text=U",
            roles: currentUser.roles || [],
            status: "active",
            lastLogin: "Just now",
            apps: currentUser.apps || [],
          }
          setAllUsers([currentUserData])
        }
      } finally {
        setLoading(false)
      }
    }
  
  useEffect(() => {
    fetchUsers()
  }, [currentUser])

  const syncWithPrivy = async () => {
    setSyncing(true)
    try {
      const response = await fetch('/api/privy/allowlist')
      if (response.ok) {
        const data = await response.json()
        console.log('Privy sync results:', data.syncResults)
        
        // Refresh the user list
        await fetchUsers()
        
        // Show success message (you could use a toast here)
        alert(`✅ Synced with Privy allowlist!\n\nCreated: ${data.syncResults.created} new users\nTotal synced: ${data.syncResults.synced}`)
      } else {
        alert('Failed to sync with Privy allowlist')
      }
    } catch (error) {
      console.error('Sync error:', error)
      alert('Error syncing with Privy allowlist')
    } finally {
      setSyncing(false)
    }
  }

  const filteredUsers = allUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">Manage users, roles, and permissions across all applications</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={syncWithPrivy} 
            variant="outline"
            disabled={syncing}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            Sync with Privy
          </Button>
          <Button onClick={() => router.push('/admin/users/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allUsers.length}</div>
            <p className="text-xs text-muted-foreground">
              {allUsers.filter((u) => u.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {allUsers.filter((u) => u.status === "active").length}
            </div>
            <p className="text-xs text-muted-foreground">Currently online</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {allUsers.filter((u) => u.roles.includes("admin") || u.roles.includes("super_admin")).length}
            </div>
            <p className="text-xs text-muted-foreground">System administrators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Users</CardTitle>
            <UserX className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {allUsers.filter((u) => u.status === "inactive").length}
            </div>
            <p className="text-xs text-muted-foreground">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
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
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Apps Access</TableHead>
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
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          {getUserAuthMethod(user) === 'email' && <Mail className="h-3 w-3" />}
                          {getUserAuthMethod(user) === 'phone' && <Phone className="h-3 w-3" />}
                          {getUserAuthMethod(user) === 'wallet' && <Wallet className="h-3 w-3" />}
                          {getUserDisplayEmail(user)}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <Badge 
                          key={role} 
                          variant={role === "admin" || role === "super_admin" ? "default" : "secondary"} 
                          className="text-xs"
                        >
                          {role === "super_admin" ? "Super Admin" : role}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.apps.slice(0, 2).map((app) => (
                        <Badge key={app} variant="outline" className="text-xs">
                          {app}
                        </Badge>
                      ))}
                      {user.apps.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{user.apps.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/users/${getUserSlug(user)}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/users/${getUserSlug(user)}?tab=permissions`)}>
                          <Shield className="mr-2 h-4 w-4" />
                          Manage Roles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="mr-2 h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
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
