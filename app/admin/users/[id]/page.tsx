"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/privy-auth-context"
import { ArrowLeft, Save, User, Phone, Wallet, Shield, Apps, Plus, Trash2, Link } from "lucide-react"

interface UserProfile {
  id: string
  email: string
  name?: string
  phone?: string
  wallet?: string
  avatar?: string
  roles: string[]
  apps: string[]
  status: string
  lastLogin: string
  linkedAccounts: {
    phone?: string
    wallet?: string
  }
}

export default function EditUser() {
  const router = useRouter()
  const params = useParams()
  const { user: currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [newPhone, setNewPhone] = useState("")
  const [newWallet, setNewWallet] = useState("")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/admin/users/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setUser(data.user)
          } else {
            console.error('Failed to fetch user:', data.error)
          }
        } else {
          console.error('Failed to fetch user:', response.statusText)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    if (params.id) {
      fetchUser()
    }
  }, [params.id])

  const handleSave = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const updateData = {
        name: user.name,
        roles: user.roles,
        apps: user.apps,
        status: user.status,
        linkedAccounts: {
          phone: newPhone || user.linkedAccounts?.phone,
          wallet: newWallet || user.linkedAccounts?.wallet
        }
      }

      const response = await fetch(`/api/admin/users/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          alert("User profile updated successfully!")
          router.back()
        } else {
          alert(`Failed to update user: ${data.error}`)
        }
      } else {
        alert("Failed to update user profile")
      }
    } catch (error) {
      console.error("Error saving user:", error)
      alert("Failed to update user profile")
    } finally {
      setLoading(false)
    }
  }

  const handleRoleToggle = (role: string) => {
    if (!user) return
    
    const updatedRoles = user.roles.includes(role)
      ? user.roles.filter(r => r !== role)
      : [...user.roles, role]
    
    setUser({ ...user, roles: updatedRoles })
  }

  const handleAppToggle = (app: string) => {
    if (!user) return
    
    const updatedApps = user.apps.includes(app)
      ? user.apps.filter(a => a !== app)
      : [...user.apps, app]
    
    setUser({ ...user, apps: updatedApps })
  }

  const linkPhone = async () => {
    if (!newPhone.trim() || !user) return
    
    try {
      const response = await fetch('/api/privy/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          type: 'phone',
          value: newPhone
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert('SMS verification sent! In production, user would enter verification code to complete linking.')
        setUser(prev => prev ? {
          ...prev,
          phone: newPhone,
          linkedAccounts: { ...prev.linkedAccounts, phone: newPhone }
        } : null)
        setNewPhone("")
      } else {
        alert(`Failed to link phone: ${data.error}`)
      }
    } catch (error) {
      console.error('Error linking phone:', error)
      alert('Failed to link phone number')
    }
  }

  const linkWallet = async () => {
    if (!newWallet.trim() || !user) return
    
    try {
      const response = await fetch('/api/privy/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          type: 'wallet',
          value: newWallet
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert('Wallet linking initiated! In production, user would sign a message to verify ownership.')
        setUser(prev => prev ? {
          ...prev,
          wallet: newWallet,
          linkedAccounts: { ...prev.linkedAccounts, wallet: newWallet }
        } : null)
        setNewWallet("")
      } else {
        alert(`Failed to link wallet: ${data.error}`)
      }
    } catch (error) {
      console.error('Error linking wallet:', error)
      alert('Failed to link wallet address')
    }
  }

  const unlinkAccount = async (type: 'phone' | 'wallet') => {
    if (!user) return
    
    const value = type === 'phone' ? user.linkedAccounts.phone : user.linkedAccounts.wallet
    if (!value) return

    try {
      const response = await fetch('/api/privy/link', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          type,
          value
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert(`${type === 'phone' ? 'Phone number' : 'Wallet address'} unlinked successfully!`)
        setUser(prev => prev ? {
          ...prev,
          [type]: undefined,
          linkedAccounts: { 
            ...prev.linkedAccounts, 
            [type]: undefined 
          }
        } : null)
      } else {
        alert(`Failed to unlink ${type}: ${data.error}`)
      }
    } catch (error) {
      console.error(`Error unlinking ${type}:`, error)
      alert(`Failed to unlink ${type}`)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">User not found</h2>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const availableRoles = ["user", "admin", "super_admin", "solebrew-admin", "solebrew-member", "chimpanion-admin", "chimpanion-member"]
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
          <h1 className="text-3xl font-bold tracking-tight">Edit User</h1>
          <p className="text-muted-foreground">Update user profile and permissions</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="mr-2 h-4 w-4" />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Profile */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="accounts">Linked Accounts</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Basic Information</span>
                  </CardTitle>
                  <CardDescription>Update user's basic profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={user.name || ""}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        placeholder="Enter full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        type="email"
                        disabled
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed (managed by Privy)</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Account Status</Label>
                    <Select value={user.status} onValueChange={(value) => setUser({ ...user, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="accounts" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Link className="h-5 w-5" />
                    <span>Privy Linked Accounts</span>
                  </CardTitle>
                  <CardDescription>Manage phone numbers and wallet addresses linked to this account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Phone */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span>Phone Number</span>
                      </Label>
                    </div>
                    
                    {user.linkedAccounts.phone ? (
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                        <div>
                          <p className="font-medium">{user.linkedAccounts.phone}</p>
                          <p className="text-xs text-green-600">Verified via Privy</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => unlinkAccount('phone')}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Input
                            value={newPhone}
                            onChange={(e) => setNewPhone(e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            className="flex-1"
                          />
                          <Button onClick={linkPhone} disabled={!newPhone.trim()}>
                            <Plus className="mr-2 h-3 w-3" />
                            Link Phone
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Phone will be verified through Privy SMS</p>
                      </div>
                    )}
                  </div>

                  {/* Current Wallet */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center space-x-2">
                        <Wallet className="h-4 w-4" />
                        <span>Wallet Address</span>
                      </Label>
                    </div>
                    
                    {user.linkedAccounts.wallet ? (
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                        <div>
                          <p className="font-medium font-mono text-xs">
                            {user.linkedAccounts.wallet.slice(0, 6)}...{user.linkedAccounts.wallet.slice(-4)}
                          </p>
                          <p className="text-xs text-blue-600">Connected via Privy</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => unlinkAccount('wallet')}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Input
                            value={newWallet}
                            onChange={(e) => setNewWallet(e.target.value)}
                            placeholder="0x123...abc"
                            className="flex-1 font-mono text-xs"
                          />
                          <Button onClick={linkWallet} disabled={!newWallet.trim()}>
                            <Plus className="mr-2 h-3 w-3" />
                            Link Wallet
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">Wallet will be verified through Privy connection</p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Link className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800">Privy Account Linking</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          This allows users to sign in with multiple methods (email, phone, or wallet) using the same account.
                          All linked accounts will have access to the same permissions and applications.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="permissions" className="space-y-4">
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
                      <div key={role} className="flex items-center space-x-2">
                        <Checkbox
                          id={role}
                          checked={user.roles.includes(role)}
                          onCheckedChange={() => handleRoleToggle(role)}
                        />
                        <Label htmlFor={role} className="text-sm">
                          {role === "super_admin" ? "Super Administrator" : 
                           role.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
                        </Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Apps className="h-5 w-5" />
                      <span>App Access</span>
                    </CardTitle>
                    <CardDescription>Grant access to specific applications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {availableApps.map((app) => (
                      <div key={app} className="flex items-center space-x-2">
                        <Checkbox
                          id={app}
                          checked={user.apps.includes(app)}
                          onCheckedChange={() => handleAppToggle(app)}
                        />
                        <Label htmlFor={app} className="text-sm">{app}</Label>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* User Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Summary</CardTitle>
              <CardDescription>Current user information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name?.split(" ").map(n => n[0]).join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="text-center">
                  <h3 className="font-semibold">{user.name || "Unnamed User"}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>

                <Badge className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {user.status}
                </Badge>

                <div className="w-full space-y-3">
                  <div>
                    <Label className="text-xs text-muted-foreground">ROLES</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.roles.map((role) => (
                        <Badge key={role} variant="outline" className="text-xs">
                          {role === "super_admin" ? "Super Admin" : role}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">APP ACCESS</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.apps.map((app) => (
                        <Badge key={app} variant="secondary" className="text-xs">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-muted-foreground">LAST LOGIN</Label>
                    <p className="text-sm">{user.lastLogin}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}