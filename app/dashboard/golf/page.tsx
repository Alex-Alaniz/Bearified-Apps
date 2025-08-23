"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Globe, Calendar, Users, MapPin, Trophy, Clock, TrendingUp, Star } from "lucide-react"
import { useAuth } from "@/lib/privy-auth-context"

export default function GolfAppPage() {
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
            <h1 className="text-3xl font-bold">Golf App</h1>
            <p className="text-gray-600">Golf course management and booking system</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          Development
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+8 new this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Course Utilization</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">Optimal capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,430</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Booking */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-600" />
              <CardTitle>Course Booking</CardTitle>
            </div>
            <CardDescription>Manage tee times and course reservations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">9:00 AM - Front Nine</p>
                    <p className="text-sm text-gray-500">John Smith, Mike Johnson</p>
                  </div>
                </div>
                <Badge variant="default">Confirmed</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">10:30 AM - Championship Course</p>
                    <p className="text-sm text-gray-500">Sarah Wilson, Tom Brown</p>
                  </div>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
            </div>
            
            <Button className="w-full">
              <Calendar className="mr-2 h-4 w-4" />
              New Booking
            </Button>
          </CardContent>
        </Card>

        {/* Score Tracking */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <CardTitle>Score Tracking</CardTitle>
            </div>
            <CardDescription>Track scores and handicaps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Best Round: 72</p>
                    <p className="text-sm text-gray-500">Championship Course</p>
                  </div>
                </div>
                <span className="text-sm text-green-600 font-medium">Par</span>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Current Handicap: 12</p>
                    <p className="text-sm text-gray-500">Improving trend</p>
                  </div>
                </div>
                <span className="text-sm text-blue-600 font-medium">↗ +2</span>
              </div>
            </div>
            
            <Button className="w-full" variant="outline">
              <Trophy className="mr-2 h-4 w-4" />
              Enter Score
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tournament Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-purple-600" />
              <div>
                <CardTitle>Tournament Management</CardTitle>
                <CardDescription>Organize and manage golf tournaments</CardDescription>
              </div>
            </div>
            <Button>
              <Trophy className="mr-2 h-4 w-4" />
              Create Tournament
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Spring Championship</h3>
              <p className="text-sm text-gray-600 mb-3">April 15-16, 2024</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">32 Players</span>
                <Badge>Active</Badge>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Member's Cup</h3>
              <p className="text-sm text-gray-600 mb-3">May 20, 2024</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">16 Players</span>
                <Badge variant="outline">Planning</Badge>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Charity Open</h3>
              <p className="text-sm text-gray-600 mb-3">June 10, 2024</p>
              <div className="flex items-center justify-between">
                <span className="text-sm">64 Players</span>
                <Badge variant="secondary">Draft</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Development Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-yellow-800">Development Mode</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-yellow-700 mb-4">
            The Golf App is currently in development. Features shown are mockups for demonstration purposes.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            <Badge variant="outline" className="text-center justify-center">Course Booking ✓</Badge>
            <Badge variant="outline" className="text-center justify-center">Score Tracking ✓</Badge>
            <Badge variant="outline" className="text-center justify-center">Tournament Management ✓</Badge>
            <Badge variant="secondary" className="text-center justify-center">Payment Processing</Badge>
            <Badge variant="secondary" className="text-center justify-center">Mobile App</Badge>
            <Badge variant="secondary" className="text-center justify-center">Pro Shop Integration</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}