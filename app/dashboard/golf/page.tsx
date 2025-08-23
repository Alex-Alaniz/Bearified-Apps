"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Globe, 
  GitBranch, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Code,
  Database,
  Smartphone,
  Settings
} from "lucide-react"
import { useAuth } from "@/lib/privy-auth-context"

export default function GolfAppDevelopmentPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Globe className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Golf App Development</h1>
            <p className="text-gray-600">Project management dashboard for Golf App development</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Development
          </Badge>
          <Button>
            <Code className="mr-2 h-4 w-4" />
            View Code
          </Button>
        </div>
      </div>

      {/* Project Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Project Progress</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25%</div>
            <p className="text-xs text-muted-foreground">MVP Features Complete</p>
            <Progress value={25} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 in progress, 5 pending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Developers assigned</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Milestone</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2w</div>
            <p className="text-xs text-muted-foreground">Beta release target</p>
          </CardContent>
        </Card>
      </div>

      {/* Development Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Sprint */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <GitBranch className="h-5 w-5 text-blue-600" />
              <CardTitle>Current Sprint</CardTitle>
            </div>
            <CardDescription>Sprint 3: Core Features Implementation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Database Schema Design</p>
                    <p className="text-sm text-gray-500">Users, courses, bookings tables</p>
                  </div>
                </div>
                <Badge variant="default">Done</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium">Authentication System</p>
                    <p className="text-sm text-gray-500">User registration and login</p>
                  </div>
                </div>
                <Badge variant="outline">In Progress</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="font-medium">Booking System API</p>
                    <p className="text-sm text-gray-500">Backend endpoints for reservations</p>
                  </div>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Stack */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-purple-600" />
              <CardTitle>Technical Stack</CardTitle>
            </div>
            <CardDescription>Technologies and frameworks in use</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Globe className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Next.js 14</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Database className="h-4 w-4 text-green-600" />
                <span className="text-sm">Supabase</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Code className="h-4 w-4 text-blue-500" />
                <span className="text-sm">TypeScript</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Smartphone className="h-4 w-4 text-pink-600" />
                <span className="text-sm">React Native</span>
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="font-medium mb-2">Development Tools:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Git</Badge>
                <Badge variant="outline">Docker</Badge>
                <Badge variant="outline">Vercel</Badge>
                <Badge variant="outline">Figma</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Roadmap */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-gray-600" />
              <div>
                <CardTitle>Feature Roadmap</CardTitle>
                <CardDescription>Planned features and development phases</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center">
                <Badge className="mr-2">Phase 1</Badge>
                MVP (Current)
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Project Setup</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Database Schema</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">User Authentication</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Basic UI Components</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center">
                <Badge variant="outline" className="mr-2">Phase 2</Badge>
                Core Features
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Course Management</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Booking System</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Score Tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">User Profiles</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center">
                <Badge variant="outline" className="mr-2">Phase 3</Badge>
                Advanced
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Tournament System</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Mobile App</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Payment Integration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Analytics Dashboard</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common development tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline">
              <GitBranch className="mr-2 h-4 w-4" />
              Create Branch
            </Button>
            <Button variant="outline">
              <Code className="mr-2 h-4 w-4" />
              Open VS Code
            </Button>
            <Button variant="outline">
              <Database className="mr-2 h-4 w-4" />
              Database Console
            </Button>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Deploy to Staging
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}