"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/privy-auth-context"
import { 
  Activity, 
  Search, 
  Filter, 
  Download,
  RefreshCw,
  User,
  Shield,
  Database,
  Settings,
  Eye,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

interface LogEntry {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  details: string
  level: "info" | "warning" | "error" | "success"
  ip: string
}

// Mock log data - in production this would come from your logging system
const mockLogs: LogEntry[] = [
  {
    id: "1",
    timestamp: new Date().toISOString(),
    user: "alex@alexalaniz.com",
    action: "LOGIN_SUCCESS",
    resource: "Authentication",
    details: "Privy authentication successful",
    level: "success",
    ip: "192.168.1.1"
  },
  {
    id: "2", 
    timestamp: new Date(Date.now() - 300000).toISOString(),
    user: "alex@alexalaniz.com",
    action: "PROJECT_CREATE",
    resource: "Projects",
    details: "Created project: SoleBrew MVP",
    level: "info",
    ip: "192.168.1.1"
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 600000).toISOString(),
    user: "alex@alexalaniz.com", 
    action: "USER_UPDATE",
    resource: "Users",
    details: "Updated user roles and permissions",
    level: "info",
    ip: "192.168.1.1"
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 900000).toISOString(),
    user: "system",
    action: "DATABASE_BACKUP",
    resource: "Database",
    details: "Daily backup completed successfully",
    level: "success",
    ip: "internal"
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 1200000).toISOString(),
    user: "alex@alexalaniz.com",
    action: "SETTINGS_UPDATE",
    resource: "System Settings",
    details: "Updated authentication configuration",
    level: "warning",
    ip: "192.168.1.1"
  }
]

export default function ActivityLogsPage() {
  const { user } = useAuth()
  const [logs, setLogs] = useState<LogEntry[]>(mockLogs)
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>(mockLogs)
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [userFilter, setUserFilter] = useState<string>("all")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Add current user's recent activity
    const recentActivity: LogEntry = {
      id: "current",
      timestamp: new Date().toISOString(),
      user: user?.email || "admin@bearified.com",
      action: "PAGE_VIEW",
      resource: "Admin Logs",
      details: "Viewed activity logs page",
      level: "info",
      ip: "current"
    }
    
    setLogs(prev => [recentActivity, ...prev.slice(1)])
  }, [user])

  useEffect(() => {
    let filtered = logs

    if (searchTerm) {
      filtered = filtered.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (levelFilter !== "all") {
      filtered = filtered.filter(log => log.level === levelFilter)
    }

    if (userFilter !== "all") {
      filtered = filtered.filter(log => log.user === userFilter)
    }

    setFilteredLogs(filtered)
  }, [logs, searchTerm, levelFilter, userFilter])

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      default:
        return <Activity className="h-4 w-4 text-blue-600" />
    }
  }

  const getLevelBadge = (level: string) => {
    const variants = {
      success: "bg-green-100 text-green-800 border-green-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200", 
      error: "bg-red-100 text-red-800 border-red-200",
      info: "bg-blue-100 text-blue-800 border-blue-200"
    }
    
    return <Badge className={variants[level as keyof typeof variants] || variants.info}>{level}</Badge>
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const refreshLogs = () => {
    setLoading(true)
    // In production, this would fetch fresh logs from the server
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const exportLogs = () => {
    // In production, this would generate and download a log file
    console.log('Exporting logs...', filteredLogs)
  }

  const uniqueUsers = [...new Set(logs.map(log => log.user))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
          <p className="text-muted-foreground">Monitor system activity and user actions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={exportLogs}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={refreshLogs} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter logs by user, level, or search terms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by user" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {uniqueUsers.map((user) => (
                  <SelectItem key={user} value={user}>
                    {user === "system" ? "System" : user}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recent" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recent">Recent Activity</TabsTrigger>
          <TabsTrigger value="security">Security Events</TabsTrigger>
          <TabsTrigger value="system">System Events</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Log</CardTitle>
              <CardDescription>
                Showing {filteredLogs.length} of {logs.length} total log entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-sm">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{log.user === "system" ? "System" : log.user}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getLevelIcon(log.level)}
                          <span className="font-medium">{log.action}</span>
                        </div>
                      </TableCell>
                      <TableCell>{log.resource}</TableCell>
                      <TableCell>{getLevelBadge(log.level)}</TableCell>
                      <TableCell className="max-w-md truncate">{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Events</CardTitle>
              <CardDescription>Authentication and authorization events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLogs
                  .filter(log => log.action.includes('LOGIN') || log.action.includes('AUTH') || log.action.includes('PERMISSION'))
                  .map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      {getLevelIcon(log.level)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{log.action}</span>
                          {getLevelBadge(log.level)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {log.user} • {formatTimestamp(log.timestamp)} • {log.ip}
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Events</CardTitle>
              <CardDescription>System operations and maintenance events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredLogs
                  .filter(log => log.user === "system" || log.action.includes('SYSTEM') || log.action.includes('DATABASE'))
                  .map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <Database className="h-4 w-4 text-gray-600 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{log.action}</span>
                          {getLevelBadge(log.level)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimestamp(log.timestamp)}
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}