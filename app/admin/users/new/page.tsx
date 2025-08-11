"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, User, Mail, Shield, AppWindow } from "lucide-react"

interface NewUserForm {
  email: string
  name: string
  roles: string[]
  apps: string[]
  status: string
}

export default function NewUser() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<NewUserForm>({
    email: "",
    name: "",
    roles: ["user"],
    apps: [],
    status: "active"
  })

  const handleSave = async () => {
    if (!formData.email || !formData.name) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      // In production, this would create the user via API
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("User created successfully! They will receive an invitation email to set up their account.")
        router.push('/admin/users')
      } else {
        const error = await response.json()
        alert(`Failed to create user: ${error.message || 'Unknown error'}`)
      }
    } catch (error) {
      console.error("Error creating user:", error)
      alert("Failed to create user")
    } finally {
      setLoading(false)
    }
  }

  const handleRoleToggle = (role: string) => {
    const updatedRoles = formData.roles.includes(role)
      ? formData.roles.filter(r => r !== role)
      : [...formData.roles, role]
    
    setFormData({ ...formData, roles: updatedRoles })
  }

  const handleAppToggle = (app: string) => {
    const updatedApps = formData.apps.includes(app)
      ? formData.apps.filter(a => a !== app)
      : [...formData.apps, app]
    
    setFormData({ ...formData, apps: updatedApps })
  }

  const availableRoles = [
    { id: "user", label: "User", description: "Basic access" },
    { id: "admin", label: "Admin", description: "Administrative access" },
    { id: "super_admin", label: "Super Admin", description: "Full system access" },
    { id: "solebrew-admin", label: "SoleBrew Admin", description: "Full SoleBrew access" },
    { id: "solebrew-member", label: "SoleBrew Member", description: "SoleBrew team member" },
    { id: "chimpanion-admin", label: "Chimpanion Admin", description: "Full Chimpanion access" },
    { id: "chimpanion-member", label: "Chimpanion Member", description: "Chimpanion team member" }
  ]

  const availableApps = ["SoleBrew", "Chimpanion", "Admin Panel"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Add New User</h1>
          <p className="text-muted-foreground">Create a new user account and send invitation</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Creating..." : "Create User"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>User Information</span>
              </CardTitle>
              <CardDescription>Enter the new user's basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    type="email"
                    placeholder="john@example.com"
                    required
                  />
                  <p className="text-xs text-muted-foreground">User will receive invitation at this email</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Initial Account Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active - Can login immediately</SelectItem>
                    <SelectItem value="pending">Pending - Awaiting email verification</SelectItem>
                    <SelectItem value="inactive">Inactive - Cannot login</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>User Roles</span>
                </CardTitle>
                <CardDescription>Assign system roles to the user</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableRoles.map((role) => (
                  <div key={role.id} className="flex items-start space-x-2">
                    <Checkbox
                      id={role.id}
                      checked={formData.roles.includes(role.id)}
                      onCheckedChange={() => handleRoleToggle(role.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <Label htmlFor={role.id} className="text-sm font-medium cursor-pointer">
                        {role.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AppWindow className="h-5 w-5" />
                  <span>App Access</span>
                </CardTitle>
                <CardDescription>Grant access to specific applications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableApps.map((app) => (
                  <div key={app} className="flex items-center space-x-2">
                    <Checkbox
                      id={app}
                      checked={formData.apps.includes(app)}
                      onCheckedChange={() => handleAppToggle(app)}
                    />
                    <Label htmlFor={app} className="text-sm cursor-pointer">{app}</Label>
                  </div>
                ))}
                <div className="pt-2 text-xs text-muted-foreground">
                  Note: App access is also controlled by user roles. Users need both app access and the required role.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privy Integration</CardTitle>
              <CardDescription>How user creation works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium mb-1">1. User Creation</h4>
                  <p className="text-muted-foreground">User account is created in your database with the roles and permissions you assign.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">2. Email Invitation</h4>
                  <p className="text-muted-foreground">An invitation email is sent to the user's email address with a link to set up their account.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">3. Privy Authentication</h4>
                  <p className="text-muted-foreground">User clicks the link and authenticates via Privy using their email. They can later add phone and wallet.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">4. Access Control</h4>
                  <p className="text-muted-foreground">User must be on the Privy allowlist to complete authentication. Add them to your Privy dashboard.</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Mail className="h-4 w-4 text-blue-600 mb-2" />
                <p className="text-sm text-blue-800">
                  Remember to add the user's email to your Privy Access Control List in the Privy dashboard for them to authenticate.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}