"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Settings, 
  Shield, 
  Database, 
  Key, 
  Bell, 
  Palette, 
  Globe, 
  Save,
  RefreshCw,
  AlertTriangle
} from "lucide-react"

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState({
    // General Settings
    siteName: "Bearified Apps",
    siteDescription: "Unified Business Platform",
    maintenanceMode: false,
    registrationEnabled: false,
    
    // Authentication Settings
    privyAuthEnabled: true,
    sessionTimeout: "24", // hours
    passwordPolicy: "strong",
    twoFactorRequired: false,
    
    // Security Settings
    corsEnabled: true,
    rateLimitEnabled: true,
    auditLoggingEnabled: true,
    encryptionEnabled: true,
    
    // Notification Settings
    emailNotifications: true,
    pushNotifications: true,
    slackIntegration: false,
    webhooksEnabled: false,
    
    // Database Settings
    backupFrequency: "daily",
    retentionPeriod: "30", // days
    compressionEnabled: true,
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Saving settings:', settings)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
          <p className="text-muted-foreground">Configure system-wide settings and preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>General Configuration</span>
              </CardTitle>
              <CardDescription>Basic system configuration and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Description</Label>
                  <Input
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="text-base font-medium">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Temporarily disable the site for maintenance
                  </p>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => handleSettingChange('maintenanceMode', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="text-base font-medium">User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to create accounts
                  </p>
                </div>
                <Switch
                  checked={settings.registrationEnabled}
                  onCheckedChange={(checked) => handleSettingChange('registrationEnabled', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Authentication Settings</span>
              </CardTitle>
              <CardDescription>Configure authentication and session management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="text-base font-medium">Privy Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Use Privy for user authentication
                  </p>
                  <Badge className="mt-1 bg-green-100 text-green-800">Production Ready</Badge>
                </div>
                <Switch
                  checked={settings.privyAuthEnabled}
                  onCheckedChange={(checked) => handleSettingChange('privyAuthEnabled', checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (hours)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordPolicy">Password Policy</Label>
                  <Select value={settings.passwordPolicy} onValueChange={(value) => handleSettingChange('passwordPolicy', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="strong">Strong</SelectItem>
                      <SelectItem value="enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="text-base font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for all admin users
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactorRequired}
                  onCheckedChange={(checked) => handleSettingChange('twoFactorRequired', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Configuration</span>
              </CardTitle>
              <CardDescription>Configure security policies and protections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">CORS Protection</Label>
                    <p className="text-sm text-muted-foreground">Cross-origin request filtering</p>
                  </div>
                  <Switch
                    checked={settings.corsEnabled}
                    onCheckedChange={(checked) => handleSettingChange('corsEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">Rate Limiting</Label>
                    <p className="text-sm text-muted-foreground">API request rate limiting</p>
                  </div>
                  <Switch
                    checked={settings.rateLimitEnabled}
                    onCheckedChange={(checked) => handleSettingChange('rateLimitEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">Audit Logging</Label>
                    <p className="text-sm text-muted-foreground">Log all admin actions</p>
                  </div>
                  <Switch
                    checked={settings.auditLoggingEnabled}
                    onCheckedChange={(checked) => handleSettingChange('auditLoggingEnabled', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">Data Encryption</Label>
                    <p className="text-sm text-muted-foreground">Encrypt sensitive data</p>
                  </div>
                  <Switch
                    checked={settings.encryptionEnabled}
                    onCheckedChange={(checked) => handleSettingChange('encryptionEnabled', checked)}
                  />
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Security Notice</h4>
                    <p className="text-sm text-yellow-700">
                      Disabling security features may expose your system to vulnerabilities. Only modify these settings if you understand the implications.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>Configure system notifications and integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send system emails</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">Slack Integration</Label>
                    <p className="text-sm text-muted-foreground">Send alerts to Slack</p>
                    <Badge variant="secondary" className="mt-1">Coming Soon</Badge>
                  </div>
                  <Switch
                    checked={settings.slackIntegration}
                    onCheckedChange={(checked) => handleSettingChange('slackIntegration', checked)}
                    disabled
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label className="text-base font-medium">Webhooks</Label>
                    <p className="text-sm text-muted-foreground">HTTP webhook notifications</p>
                    <Badge variant="secondary" className="mt-1">Coming Soon</Badge>
                  </div>
                  <Switch
                    checked={settings.webhooksEnabled}
                    onCheckedChange={(checked) => handleSettingChange('webhooksEnabled', checked)}
                    disabled
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Database Configuration</span>
              </CardTitle>
              <CardDescription>Configure database backup and maintenance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select value={settings.backupFrequency} onValueChange={(value) => handleSettingChange('backupFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retentionPeriod">Retention Period (days)</Label>
                  <Input
                    id="retentionPeriod"
                    type="number"
                    value={settings.retentionPeriod}
                    onChange={(e) => handleSettingChange('retentionPeriod', e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label className="text-base font-medium">Backup Compression</Label>
                  <p className="text-sm text-muted-foreground">
                    Compress backup files to save storage
                  </p>
                </div>
                <Switch
                  checked={settings.compressionEnabled}
                  onCheckedChange={(checked) => handleSettingChange('compressionEnabled', checked)}
                />
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Database className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Supabase Integration</h4>
                    <p className="text-sm text-blue-700">
                      Your database is hosted on Supabase with automatic backups and scaling. Advanced backup settings are managed through Supabase dashboard.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}