"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
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
import { ArrowLeft, Save, User, Phone, Wallet, Shield, AppWindow, Plus, Trash2, Link, Mail } from "lucide-react"
import { PrivyServerLinkAccount } from "@/components/privy-server-link-account"
import { getUserAuthMethod, getUserDisplayEmail, getUserIdentifier } from "@/lib/user-utils"

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
  const searchParams = useSearchParams()
  const { user: currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [fetchingUser, setFetchingUser] = useState(true)
  const [user, setUser] = useState<UserProfile | null>(null)
  const [newPhone, setNewPhone] = useState("")
  const [newWallet, setNewWallet] = useState("")
  
  // Get the initial tab from URL params
  const initialTab = searchParams.get('tab') || 'profile'

  useEffect(() => {
    const fetchUser = async () => {
      setFetchingUser(true)
      try {
        const response = await fetch(`/api/admin/users/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setUser(data.user)
          } else {
            console.error('Failed to fetch user:', data.error)
            setUser(null)
          }
        } else {
          console.error('Failed to fetch user:', response.statusText)
          setUser(null)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
        setUser(null)
      } finally {
        setFetchingUser(false)
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
        linkedAccounts: user.linkedAccounts
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
          // Update local state with the saved data
          if (data.user) {
            setUser(data.user)
          }
          alert("User profile updated successfully!")
          // Don't navigate away, stay on the page
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
        // Simulate the Privy verification flow
        const verificationCode = prompt(
          `🔐 Privy SMS Verification\n\n` +
          `A verification code has been sent to ${newPhone}.\n` +
          `In production, this would be a real SMS.\n\n` +
          `For demo purposes, enter any 6-digit code to continue:`
        )
        
        if (verificationCode && verificationCode.length === 6) {
          // Simulate verification success
          const updatedUser = user ? {
            ...user,
            phone: newPhone,
            linkedAccounts: { ...user.linkedAccounts, phone: newPhone }
          } : null
          
          if (updatedUser) {
            setUser(updatedUser)
            setNewPhone("")
            
            // Auto-save the linked account
            try {
              const response = await fetch(`/api/admin/users/${params.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: updatedUser.name,
                  roles: updatedUser.roles,
                  apps: updatedUser.apps,
                  status: updatedUser.status,
                  linkedAccounts: updatedUser.linkedAccounts
                }),
              })
              
              if (response.ok) {
                const data = await response.json()
                if (data.success && data.user) {
                  setUser(data.user)
                  alert('✅ Phone number linked and saved successfully!')
                }
              }
            } catch (error) {
              console.error('Error saving linked phone:', error)
              alert('✅ Phone number linked (save manually to persist)')
            }
          }
        } else if (verificationCode !== null) {
          alert('❌ Invalid verification code. Please try again.')
        }
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
        // Simulate the Privy wallet signature flow
        const confirmed = confirm(
          `🔗 Privy Wallet Verification\n\n` +
          `To verify ownership of wallet:\n${newWallet}\n\n` +
          `In production, you would:\n` +
          `1. Connect your wallet (MetaMask, etc.)\n` +
          `2. Sign a verification message\n` +
          `3. Complete the linking process\n\n` +
          `For demo purposes, click OK to simulate successful verification.`
        )
        
        if (confirmed) {
          // Simulate signature verification success
          const updatedUser = user ? {
            ...user,
            wallet: newWallet,
            linkedAccounts: { ...user.linkedAccounts, wallet: newWallet }
          } : null
          
          if (updatedUser) {
            setUser(updatedUser)
            setNewWallet("")
            
            // Auto-save the linked account
            try {
              const response = await fetch(`/api/admin/users/${params.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: updatedUser.name,
                  roles: updatedUser.roles,
                  apps: updatedUser.apps,
                  status: updatedUser.status,
                  linkedAccounts: updatedUser.linkedAccounts
                }),
              })
              
              if (response.ok) {
                const data = await response.json()
                if (data.success && data.user) {
                  setUser(data.user)
                  alert('✅ Wallet linked and saved successfully!')
                }
              }
            } catch (error) {
              console.error('Error saving linked wallet:', error)
              alert('✅ Wallet linked (save manually to persist)')
            }
          }
        }
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

    // Confirm unlinking action
    const confirmed = confirm(
      `🔓 Unlink ${type === 'phone' ? 'Phone Number' : 'Wallet'}\n\n` +
      `Are you sure you want to unlink this ${type === 'phone' ? 'phone number' : 'wallet address'}?\n` +
      `${value}\n\n` +
      `This will remove it from the user's Privy account.`
    )

    if (!confirmed) return

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
        alert(`✅ ${type === 'phone' ? 'Phone number' : 'Wallet address'} unlinked successfully!`)
        setUser(prev => prev ? {
          ...prev,
          [type]: undefined,
          linkedAccounts: { 
            ...prev.linkedAccounts, 
            [type]: null 
          }
        } : null)
      } else {
        alert(`❌ Failed to unlink ${type}: ${data.error}`)
      }
    } catch (error) {
      console.error(`Error unlinking ${type}:`, error)
      alert(`❌ Failed to unlink ${type}`)
    }
  }

  if (fetchingUser) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading user...</h2>
        </div>
      </div>
    )
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

  const availableRoles = ["user", "admin", "super_admin", "solebrew-admin", "solebrew-member", "chimpanion-admin", "chimpanion-member", "golf-admin", "golf-member"]
  const availableApps = ["SoleBrew", "Chimpanion", "Golf App", "Admin Panel"]

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
          <Tabs defaultValue={initialTab} className="space-y-4">
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
                  <div className="space-y-4">
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
                        <Label htmlFor="privy-id">Privy ID</Label>
                        <Input
                          id="privy-id"
                          value={user.id}
                          disabled
                          className="bg-gray-50 font-mono text-xs"
                        />
                      </div>
                    </div>
                    
                    {/* Authentication Method */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-2">
                          {getUserAuthMethod(user) === 'email' && <Mail className="h-4 w-4" />}
                          {getUserAuthMethod(user) === 'phone' && <Phone className="h-4 w-4" />}
                          {getUserAuthMethod(user) === 'wallet' && <Wallet className="h-4 w-4" />}
                          Primary Authentication Method
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          {getUserAuthMethod(user).toUpperCase()} AUTH
                        </Badge>
                      </div>
                      
                      {/* Email Field */}
                      {user.email && (
                        <div className="space-y-1">
                          <Label htmlFor="email" className="text-sm">Email Address</Label>
                          <Input
                            id="email"
                            value={user.email}
                            disabled
                            className="bg-white dark:bg-gray-900"
                          />
                        </div>
                      )}
                      
                      {/* Phone Field */}
                      {user.phone && (
                        <div className="space-y-1">
                          <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                          <Input
                            id="phone"
                            value={user.phone}
                            disabled
                            className="bg-white dark:bg-gray-900"
                          />
                        </div>
                      )}
                      
                      {/* Wallet Field */}
                      {user.wallet && (
                        <div className="space-y-1">
                          <Label htmlFor="wallet" className="text-sm">Wallet Address</Label>
                          <Input
                            id="wallet"
                            value={user.wallet}
                            disabled
                            className="bg-white dark:bg-gray-900 font-mono text-xs"
                          />
                        </div>
                      )}
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
                  {/* Phone Linking via Privy Server API */}
                  <PrivyServerLinkAccount
                    userId={user.id}
                    type="phone"
                    currentValue={user.linkedAccounts?.phone || null}
                    onLinked={async (phone) => {
                      // Update local state
                      const updatedUser = {
                        ...user,
                        linkedAccounts: { ...(user.linkedAccounts || {}), phone }
                      }
                      setUser(updatedUser)
                      
                      // Save to database
                      try {
                        const response = await fetch(`/api/admin/users/${params.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            name: updatedUser.name,
                            roles: updatedUser.roles,
                            apps: updatedUser.apps,
                            status: updatedUser.status,
                            linkedAccounts: updatedUser.linkedAccounts
                          }),
                        })
                        
                        if (response.ok) {
                          const data = await response.json()
                          if (data.success && data.user) {
                            setUser(data.user)
                          }
                        }
                      } catch (error) {
                        console.error('Error saving linked phone:', error)
                      }
                    }}
                    onUnlinked={async () => {
                      // Update local state
                      const updatedUser = {
                        ...user,
                        linkedAccounts: { ...user.linkedAccounts, phone: null }
                      }
                      setUser(updatedUser)
                      
                      // Save to database
                      try {
                        const response = await fetch(`/api/admin/users/${params.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            name: updatedUser.name,
                            roles: updatedUser.roles,
                            apps: updatedUser.apps,
                            status: updatedUser.status,
                            linkedAccounts: updatedUser.linkedAccounts
                          }),
                        })
                        
                        if (response.ok) {
                          const data = await response.json()
                          if (data.success && data.user) {
                            setUser(data.user)
                          }
                        }
                      } catch (error) {
                        console.error('Error saving unlinked phone:', error)
                      }
                    }}
                  />

                  {/* Wallet Linking via Privy Server API */}
                  <PrivyServerLinkAccount
                    userId={user.id}
                    type="wallet"
                    currentValue={user.linkedAccounts?.wallet || null}
                    onLinked={async (wallet) => {
                      // Update local state
                      const updatedUser = {
                        ...user,
                        linkedAccounts: { ...(user.linkedAccounts || {}), wallet }
                      }
                      setUser(updatedUser)
                      
                      // Save to database
                      try {
                        const response = await fetch(`/api/admin/users/${params.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            name: updatedUser.name,
                            roles: updatedUser.roles,
                            apps: updatedUser.apps,
                            status: updatedUser.status,
                            linkedAccounts: updatedUser.linkedAccounts
                          }),
                        })
                        
                        if (response.ok) {
                          const data = await response.json()
                          if (data.success && data.user) {
                            setUser(data.user)
                          }
                        }
                      } catch (error) {
                        console.error('Error saving linked wallet:', error)
                      }
                    }}
                    onUnlinked={async () => {
                      // Update local state
                      const updatedUser = {
                        ...user,
                        linkedAccounts: { ...user.linkedAccounts, wallet: null }
                      }
                      setUser(updatedUser)
                      
                      // Save to database
                      try {
                        const response = await fetch(`/api/admin/users/${params.id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            name: updatedUser.name,
                            roles: updatedUser.roles,
                            apps: updatedUser.apps,
                            status: updatedUser.status,
                            linkedAccounts: updatedUser.linkedAccounts
                          }),
                        })
                        
                        if (response.ok) {
                          const data = await response.json()
                          if (data.success && data.user) {
                            setUser(data.user)
                          }
                        }
                      } catch (error) {
                        console.error('Error saving unlinked wallet:', error)
                      }
                    }}
                  />

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Link className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-blue-800">Privy Server-Side API Integration</h4>
                        <p className="text-sm text-blue-700 mt-1">
                          This page now uses Privy's server-side API for account linking, which supports multiple linked accounts.
                        </p>
                        <div className="mt-2 p-2 bg-green-50 rounded border border-green-200">
                          <p className="text-xs font-medium text-green-800">✅ Server-Side Benefits:</p>
                          <ul className="text-xs text-green-700 mt-1 list-disc list-inside">
                            <li>Link multiple accounts of the same type</li>
                            <li>No "disallowed_login_method" errors</li>
                            <li>Support for social login methods</li>
                            <li>Direct API access without client restrictions</li>
                          </ul>
                        </div>
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
                  <h3 className="font-semibold">{user.name || user.email?.split('@')[0] || "Unnamed User"}</h3>
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