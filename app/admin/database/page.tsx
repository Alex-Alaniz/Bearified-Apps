"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { 
  Database, 
  Server, 
  HardDrive, 
  Activity, 
  Shield, 
  Cloud,
  RefreshCw,
  Download,
  Upload,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react"

export default function DatabaseManagement() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [dbStatus, setDbStatus] = useState({
    connected: true,
    latency: "12ms",
    version: "15.1",
    size: "256 MB",
    connections: 5,
    maxConnections: 100
  })

  // Mock table data - in production, fetch from Supabase
  const tables = [
    { name: "users", rowCount: 25, size: "128 KB", lastModified: "2 hours ago" },
    { name: "apps", rowCount: 3, size: "8 KB", lastModified: "1 day ago" },
    { name: "projects", rowCount: 42, size: "256 KB", lastModified: "3 hours ago" },
    { name: "tasks", rowCount: 156, size: "512 KB", lastModified: "30 minutes ago" },
  ]

  const backups = [
    { id: 1, date: "2024-01-10 03:00 UTC", size: "1.2 GB", status: "completed", type: "automatic" },
    { id: 2, date: "2024-01-09 03:00 UTC", size: "1.1 GB", status: "completed", type: "automatic" },
    { id: 3, date: "2024-01-08 15:30 UTC", size: "1.1 GB", status: "completed", type: "manual" },
  ]

  const handleBackup = async () => {
    setLoading(true)
    try {
      // In production, trigger Supabase backup
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert("Backup initiated successfully!")
    } catch (error) {
      alert("Failed to initiate backup")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Database Management</h1>
          <p className="text-muted-foreground">Monitor and manage your Supabase database</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleBackup} disabled={loading}>
            <Download className="mr-2 h-4 w-4" />
            {loading ? "Backing up..." : "Backup Now"}
          </Button>
        </div>
      </div>

      {/* Database Status Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connection Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-2xl font-bold">Connected</span>
            </div>
            <p className="text-xs text-muted-foreground">Latency: {dbStatus.latency}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Database Size</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStatus.size}</div>
            <p className="text-xs text-muted-foreground">PostgreSQL v{dbStatus.version}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbStatus.connections}/{dbStatus.maxConnections}</div>
            <p className="text-xs text-muted-foreground">Connection pool usage</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold">RLS Active</span>
            </div>
            <p className="text-xs text-muted-foreground">Row Level Security enabled</p>
          </CardContent>
        </Card>
      </div>

      {/* Database Management Tabs */}
      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="backups">Backups</TabsTrigger>
          <TabsTrigger value="policies">RLS Policies</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="tables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables</CardTitle>
              <CardDescription>Overview of all tables in your Supabase database</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table Name</TableHead>
                    <TableHead>Row Count</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tables.map((table) => (
                    <TableRow key={table.name}>
                      <TableCell className="font-mono">{table.name}</TableCell>
                      <TableCell>{table.rowCount.toLocaleString()}</TableCell>
                      <TableCell>{table.size}</TableCell>
                      <TableCell className="text-muted-foreground">{table.lastModified}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          View Schema
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Backups</CardTitle>
              <CardDescription>Manage and restore database backups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800">Automatic Backups</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Your database is automatically backed up daily at 3:00 AM UTC. 
                        Backups are retained for 30 days.
                      </p>
                    </div>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Backup Date</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backups.map((backup) => (
                      <TableRow key={backup.id}>
                        <TableCell>{backup.date}</TableCell>
                        <TableCell>{backup.size}</TableCell>
                        <TableCell>
                          <Badge variant={backup.type === "automatic" ? "default" : "secondary"}>
                            {backup.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            {backup.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Restore
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Row Level Security Policies</CardTitle>
              <CardDescription>Manage database access control policies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Users Table</h4>
                    <p className="text-sm text-muted-foreground">
                      Users can only read and update their own records
                    </p>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Apps Table</h4>
                    <p className="text-sm text-muted-foreground">
                      Read access for all authenticated users, write for admins only
                    </p>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Projects Table</h4>
                    <p className="text-sm text-muted-foreground">
                      Access based on user roles and project membership
                    </p>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-amber-800">Security Notice</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Always test RLS policies thoroughly before deploying to production. 
                      Incorrect policies can expose sensitive data.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Database Configuration</CardTitle>
              <CardDescription>Connection settings and performance tuning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Connection String</h4>
                  <div className="p-3 bg-gray-100 rounded-md font-mono text-xs">
                    postgresql://[user]:[password]@[host]:[port]/[database]
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Connection details are stored securely in environment variables
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Performance Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Max Connections</span>
                      <span className="font-mono text-sm">{dbStatus.maxConnections}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Statement Timeout</span>
                      <span className="font-mono text-sm">30s</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Connection Pool Mode</span>
                      <span className="font-mono text-sm">Transaction</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Provider Information</h4>
                  <div className="flex items-center space-x-3">
                    <Cloud className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="font-medium">Supabase</p>
                      <p className="text-sm text-muted-foreground">
                        Managed PostgreSQL database with built-in Auth, Storage, and Realtime
                      </p>
                    </div>
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