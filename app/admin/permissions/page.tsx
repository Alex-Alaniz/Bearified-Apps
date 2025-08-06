"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Plus, Search, Shield, Users, Settings, Eye } from "lucide-react"

// Define available permissions
const PERMISSIONS = [
  { id: "user.read", name: "View Users", description: "Can view user profiles and information" },
  { id: "user.write", name: "Manage Users", description: "Can create, edit, and delete users" },
  { id: "user.roles", name: "Assign Roles", description: "Can assign and modify user roles" },
  { id: "app.read", name: "View Apps", description: "Can view application configurations" },
  { id: "app.write", name: "Manage Apps", description: "Can create, edit, and configure applications" },
  { id: "project.read", name: "View Projects", description: "Can view projects and tasks" },
  { id: "project.write", name: "Manage Projects", description: "Can create and edit projects" },
  { id: "system.admin", name: "System Administration", description: "Full system administrative access" },
  { id: "system.logs", name: "View Logs", description: "Can access system and audit logs" },
  { id: "system.settings", name: "System Settings", description: "Can modify system configuration" }
]

// Define roles with their permissions
const ROLES = [
  {
    id: "super_admin",
    name: "Super Administrator",
    description: "Full system access with all permissions",
    color: "bg-red-100 text-red-800 border-red-200",
    permissions: PERMISSIONS.map(p => p.id) // All permissions
  },
  {
    id: "admin",
    name: "Administrator", 
    description: "Administrative access to most system features",
    color: "bg-blue-100 text-blue-800 border-blue-200",
    permissions: ["user.read", "user.write", "app.read", "project.read", "project.write", "system.logs"]
  },
  {
    id: "user",
    name: "Standard User",
    description: "Basic user access to assigned applications",
    color: "bg-green-100 text-green-800 border-green-200", 
    permissions: ["project.read"]
  }
]

export default function RolePermissionsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState(ROLES[0])
  
  const filteredPermissions = PERMISSIONS.filter(permission =>
    permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const hasPermission = (roleId: string, permissionId: string) => {
    const role = ROLES.find(r => r.id === roleId)
    return role?.permissions.includes(permissionId) || false
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roles & Permissions</h1>
          <p className="text-muted-foreground">Manage user roles and system permissions</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>

      <Tabs defaultValue="roles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="roles">User Roles</TabsTrigger>
          <TabsTrigger value="permissions">Permission Matrix</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          {/* Role Overview */}
          <div className="grid gap-4 md:grid-cols-3">
            {ROLES.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{role.name}</CardTitle>
                    <Badge className={role.color}>{role.id}</Badge>
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Permissions:</span>
                      <span className="font-medium">{role.permissions.length} / {PERMISSIONS.length}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setSelectedRole(role)}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Role Configuration */}
          {selectedRole && (
            <Card>
              <CardHeader>
                <CardTitle>Configure {selectedRole.name}</CardTitle>
                <CardDescription>Manage permissions for this role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search permissions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>

                  {/* Permissions List */}
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{permission.name}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{permission.description}</p>
                        </div>
                        <Switch 
                          checked={hasPermission(selectedRole.id, permission.id)}
                          disabled={selectedRole.id === "super_admin"} // Super admin always has all permissions
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          {/* Permission Matrix */}
          <Card>
            <CardHeader>
              <CardTitle>Permission Matrix</CardTitle>
              <CardDescription>Overview of all roles and their permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Permission</TableHead>
                    {ROLES.map((role) => (
                      <TableHead key={role.id} className="text-center">
                        <div className="flex flex-col items-center space-y-1">
                          <span>{role.name}</span>
                          <Badge className={role.color}>{role.id}</Badge>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PERMISSIONS.map((permission) => (
                    <TableRow key={permission.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{permission.name}</div>
                          <div className="text-sm text-muted-foreground">{permission.description}</div>
                        </div>
                      </TableCell>
                      {ROLES.map((role) => (
                        <TableCell key={role.id} className="text-center">
                          {hasPermission(role.id, permission.id) ? (
                            <Badge variant="default" className="bg-green-100 text-green-800">✓</Badge>
                          ) : (
                            <Badge variant="outline" className="text-gray-400">✗</Badge>
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}