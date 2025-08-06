"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle, Database, Users, FolderOpen, FileText } from 'lucide-react'

interface DatabaseStatus {
  status: string
  database?: {
    supabaseUrl: string
    connection: string
  }
  tables?: {
    users: {
      exists: boolean
      count?: number
      error?: string
    }
    projects: {
      exists: boolean
      error?: string
    }
    tasks: {
      exists: boolean
      error?: string
    }
  }
  sampleUsers?: Array<{
    id: string
    email: string
    name: string
    role: string
  }>
  error?: string
  message?: string
}

export default function DebugPage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [setupLoading, setSetupLoading] = useState(false)
  const [setupResult, setSetupResult] = useState<any>(null)

  const checkStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/debug/status')
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      setStatus({
        status: 'error',
        error: error instanceof Error ? error.message : 'Failed to fetch status'
      })
    } finally {
      setLoading(false)
    }
  }

  const runDatabaseSetup = async () => {
    setSetupLoading(true)
    setSetupResult(null)
    try {
      const response = await fetch('/api/debug/setup-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      setSetupResult(data)
      
      // Refresh status after setup
      setTimeout(() => {
        checkStatus()
      }, 1000)
    } catch (error) {
      setSetupResult({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to run database setup'
      })
    } finally {
      setSetupLoading(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  const getStatusIcon = (exists: boolean | undefined, error?: string) => {
    if (error) return <XCircle className="h-5 w-5 text-red-500" />
    if (exists) return <CheckCircle className="h-5 w-5 text-green-500" />
    return <AlertCircle className="h-5 w-5 text-yellow-500" />
  }

  const getStatusBadge = (exists: boolean | undefined, error?: string) => {
    if (error) return <Badge variant="destructive">Error</Badge>
    if (exists) return <Badge variant="default">Exists</Badge>
    return <Badge variant="secondary">Missing</Badge>
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Database Status</h1>
          <p className="text-muted-foreground">Check Supabase connection and table structure</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={runDatabaseSetup} disabled={setupLoading} variant="default">
            {setupLoading ? 'Setting up...' : 'Run Database Setup'}
          </Button>
          <Button onClick={checkStatus} disabled={loading} variant="outline">
            {loading ? 'Checking...' : 'Refresh Status'}
          </Button>
        </div>
      </div>

      {setupResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database Setup Results</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Overall Status</span>
                <Badge variant={setupResult.success ? "default" : "destructive"}>
                  {setupResult.success ? "Success" : "Failed"}
                </Badge>
              </div>
              
              {setupResult.message && (
                <p className="text-sm text-muted-foreground">{setupResult.message}</p>
              )}
              
              {setupResult.instruction && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                  <p className="text-sm text-blue-800">{setupResult.instruction}</p>
                </div>
              )}

              {setupResult.results && setupResult.results.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Setup Steps:</h4>
                  {setupResult.results.map((result: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{result.step.replace(/_/g, ' ')}</span>
                      <div className="flex items-center space-x-2">
                        {result.success ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {result.message || result.error}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {status && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Database Connection</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Status</span>
                <Badge variant={status.status === 'connected' ? 'default' : 'destructive'}>
                  {status.status}
                </Badge>
              </div>
              
              {status.database && (
                <>
                  <div className="flex items-center justify-between">
                    <span>Supabase URL</span>
                    <Badge variant={status.database.supabaseUrl === 'valid' ? 'default' : 'destructive'}>
                      {status.database.supabaseUrl}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Connection</span>
                    <Badge variant={status.database.connection === 'OK' ? 'default' : 'destructive'}>
                      {status.database.connection}
                    </Badge>
                  </div>
                </>
              )}

              {status.error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{status.error}</p>
                  {status.message && (
                    <p className="text-xs text-red-500 mt-1">{status.message}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tables Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Database Tables</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {status.tables ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(status.tables.users.exists, status.tables.users.error)}
                      <span>users</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(status.tables.users.exists, status.tables.users.error)}
                      {status.tables.users.count !== undefined && (
                        <Badge variant="outline">{status.tables.users.count} records</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(status.tables.projects.exists, status.tables.projects.error)}
                      <span>projects</span>
                    </div>
                    {getStatusBadge(status.tables.projects.exists, status.tables.projects.error)}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(status.tables.tasks.exists, status.tables.tasks.error)}
                      <span>tasks</span>
                    </div>
                    {getStatusBadge(status.tables.tasks.exists, status.tables.tasks.error)}
                  </div>

                  {/* Show errors if any */}
                  {(status.tables.users.error || status.tables.projects.error || status.tables.tasks.error) && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <p className="text-sm font-medium text-yellow-800 mb-2">Table Errors:</p>
                      {status.tables.users.error && (
                        <p className="text-xs text-yellow-600">users: {status.tables.users.error}</p>
                      )}
                      {status.tables.projects.error && (
                        <p className="text-xs text-yellow-600">projects: {status.tables.projects.error}</p>
                      )}
                      {status.tables.tasks.error && (
                        <p className="text-xs text-yellow-600">tasks: {status.tables.tasks.error}</p>
                      )}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">No table information available</p>
              )}
            </CardContent>
          </Card>

          {/* Sample Users */}
          {status.sampleUsers && status.sampleUsers.length > 0 && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Sample Users</span>
                </CardTitle>
                <CardDescription>Existing users in the database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {status.sampleUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-2 border rounded-md">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-sm mb-2">If projects/tasks tables are missing:</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Go to your Supabase SQL Editor</li>
                <li>Copy contents of <code>scripts/project-management-schema.sql</code></li>
                <li>Execute the SQL to create missing tables</li>
                <li>Refresh this page to verify</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-2">If users table is missing:</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Copy contents of <code>scripts/bearified-auth-schema.sql</code></li>
                <li>Execute in Supabase SQL Editor first</li>
                <li>Then run the project management schema</li>
                <li>Refresh this page to verify</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}