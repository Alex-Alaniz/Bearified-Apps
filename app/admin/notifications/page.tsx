"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Send,
  Settings,
  Users,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  Smartphone,
  Globe,
  BellRing
} from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
  read: boolean
  recipient: string
}

export default function NotificationsManagement() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [smsEnabled, setSmsEnabled] = useState(false)
  const [pushEnabled, setPushEnabled] = useState(true)
  
  // Mock notifications data
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New User Registration",
      message: "A new user has registered and is pending approval",
      type: "info",
      timestamp: "5 minutes ago",
      read: false,
      recipient: "admin@bearified.com"
    },
    {
      id: "2",
      title: "App Creation Successful",
      message: "TestApp has been created successfully",
      type: "success",
      timestamp: "1 hour ago",
      read: true,
      recipient: "admin@bearified.com"
    },
    {
      id: "3",
      title: "System Maintenance",
      message: "Scheduled maintenance will occur on Sunday at 2 AM UTC",
      type: "warning",
      timestamp: "2 hours ago",
      read: false,
      recipient: "all"
    }
  ])

  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    type: "info",
    recipients: "all"
  })

  const handleBroadcast = async () => {
    if (!broadcastForm.title || !broadcastForm.message) {
      alert("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      // In production, send notification via API
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert("Notification sent successfully!")
      setBroadcastForm({ title: "", message: "", type: "info", recipients: "all" })
    } catch (error) {
      alert("Failed to send notification")
    } finally {
      setLoading(false)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning": return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case "error": return <X className="h-5 w-5 text-red-600" />
      default: return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "success": return "border-green-200 bg-green-50"
      case "warning": return "border-yellow-200 bg-yellow-50"
      case "error": return "border-red-200 bg-red-50"
      default: return "border-blue-200 bg-blue-50"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground">Manage system notifications and communication preferences</p>
        </div>
        <Button onClick={() => router.push("/admin/notifications/templates")}>
          <Mail className="mr-2 h-4 w-4" />
          Email Templates
        </Button>
      </div>

      {/* Notification Settings Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-medium">Email Notifications</CardTitle>
              <CardDescription className="text-xs">Send notifications via email</CardDescription>
            </div>
            <Mail className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                checked={emailEnabled}
                onCheckedChange={setEmailEnabled}
              />
              <Label className="text-sm">{emailEnabled ? "Enabled" : "Disabled"}</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-medium">SMS Notifications</CardTitle>
              <CardDescription className="text-xs">Send notifications via SMS</CardDescription>
            </div>
            <Smartphone className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                checked={smsEnabled}
                onCheckedChange={setSmsEnabled}
              />
              <Label className="text-sm">{smsEnabled ? "Enabled" : "Disabled"}</Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-sm font-medium">Push Notifications</CardTitle>
              <CardDescription className="text-xs">In-app push notifications</CardDescription>
            </div>
            <BellRing className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                checked={pushEnabled}
                onCheckedChange={setPushEnabled}
              />
              <Label className="text-sm">{pushEnabled ? "Enabled" : "Disabled"}</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Management Tabs */}
      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Notifications</TabsTrigger>
          <TabsTrigger value="broadcast">Send Broadcast</TabsTrigger>
          <TabsTrigger value="preferences">User Preferences</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent System Notifications</CardTitle>
              <CardDescription>View and manage recent notifications sent to users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`flex items-start space-x-3 p-4 border rounded-lg ${getNotificationStyle(notification.type)}`}
                  >
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium">{notification.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span>To: {notification.recipient}</span>
                            <span>{notification.timestamp}</span>
                          </div>
                        </div>
                        <Badge variant={notification.read ? "secondary" : "default"}>
                          {notification.read ? "Read" : "Unread"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="broadcast" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send Broadcast Notification</CardTitle>
              <CardDescription>Send a notification to multiple users at once</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Notification Title *</Label>
                  <Input
                    id="title"
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                    placeholder="Enter notification title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Notification Type</Label>
                  <Select
                    value={broadcastForm.type}
                    onValueChange={(value) => setBroadcastForm({ ...broadcastForm, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Information</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  placeholder="Enter notification message"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipients">Recipients</Label>
                <Select
                  value={broadcastForm.recipients}
                  onValueChange={(value) => setBroadcastForm({ ...broadcastForm, recipients: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="admins">Admins Only</SelectItem>
                    <SelectItem value="solebrew">SoleBrew Users</SelectItem>
                    <SelectItem value="chimpanion">Chimpanion Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setBroadcastForm({ title: "", message: "", type: "info", recipients: "all" })}>
                  Clear
                </Button>
                <Button onClick={handleBroadcast} disabled={loading}>
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? "Sending..." : "Send Notification"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Notification Preferences</CardTitle>
              <CardDescription>Manage how users receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Default Preferences for New Users</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Account Updates</p>
                        <p className="text-sm text-muted-foreground">Login alerts, password changes, profile updates</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">System Announcements</p>
                        <p className="text-sm text-muted-foreground">Maintenance, new features, important updates</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">App Activity</p>
                        <p className="text-sm text-muted-foreground">Updates from apps they have access to</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing Communications</p>
                        <p className="text-sm text-muted-foreground">Product updates, tips, and promotional content</p>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">User Control</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Users can manage their own notification preferences from their account settings. 
                        These are just the default settings for new accounts.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Service Configuration</CardTitle>
              <CardDescription>Configure email, SMS, and push notification providers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Email Service (SendGrid)</h4>
                <div className="space-y-3">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email-api">API Key</Label>
                      <Input
                        id="email-api"
                        type="password"
                        placeholder="SG.xxxxxxxxxxxxxx"
                        defaultValue="SG.xxxxxxxxxxxxxx"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email-from">From Email</Label>
                      <Input
                        id="email-from"
                        type="email"
                        placeholder="noreply@bearified.com"
                        defaultValue="noreply@bearified.com"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">SMS Service (Twilio)</h4>
                <div className="space-y-3">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sms-sid">Account SID</Label>
                      <Input
                        id="sms-sid"
                        type="password"
                        placeholder="ACxxxxxxxxxxxxxx"
                        disabled={!smsEnabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sms-token">Auth Token</Label>
                      <Input
                        id="sms-token"
                        type="password"
                        placeholder="xxxxxxxxxxxxxx"
                        disabled={!smsEnabled}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Push Notifications (OneSignal)</h4>
                <div className="space-y-3">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="push-app">App ID</Label>
                      <Input
                        id="push-app"
                        placeholder="xxxxxx-xxxx-xxxx-xxxx"
                        defaultValue="123456-abcd-efgh-ijkl"
                        disabled={!pushEnabled}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="push-api">REST API Key</Label>
                      <Input
                        id="push-api"
                        type="password"
                        placeholder="xxxxxxxxxxxxxx"
                        disabled={!pushEnabled}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>
                  <Settings className="mr-2 h-4 w-4" />
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}