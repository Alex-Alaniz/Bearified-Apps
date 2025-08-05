"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Building,
  DollarSign,
  Globe,
  TrendingUp,
  Users,
  UserCheck,
  MapPin,
  Star,
  AlertCircle,
  CheckCircle,
  Clock,
} from "lucide-react"

const franchiseLocations = [
  {
    id: 1,
    name: "SoleBrew Downtown LA",
    owner: "Maria Rodriguez",
    status: "active",
    revenue: 28500,
    growth: 12.5,
    location: "Los Angeles, CA",
    rating: 4.8,
  },
  {
    id: 2,
    name: "SoleBrew Brooklyn Heights",
    owner: "James Wilson",
    status: "active",
    revenue: 31200,
    growth: 8.3,
    location: "Brooklyn, NY",
    rating: 4.9,
  },
  {
    id: 3,
    name: "SoleBrew Miami Beach",
    owner: "Sofia Martinez",
    status: "pending",
    revenue: 0,
    growth: 0,
    location: "Miami, FL",
    rating: 0,
  },
]

const pendingApplications = [
  {
    id: 1,
    applicant: "David Chen",
    location: "Austin, TX",
    investment: 150000,
    experience: "5 years F&B",
    status: "review",
    submittedDate: "2024-01-10",
  },
  {
    id: 2,
    applicant: "Lisa Thompson",
    location: "Seattle, WA",
    investment: 175000,
    experience: "8 years retail",
    status: "interview",
    submittedDate: "2024-01-08",
  },
  {
    id: 3,
    applicant: "Michael Brown",
    location: "Chicago, IL",
    investment: 160000,
    experience: "3 years coffee shop",
    status: "pending",
    submittedDate: "2024-01-12",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "review":
      return "bg-blue-100 text-blue-800"
    case "interview":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function SoleBrewFranchisePage() {
  const totalRevenue = franchiseLocations.reduce((sum, location) => sum + location.revenue, 0)
  const activeLocations = franchiseLocations.filter((loc) => loc.status === "active").length
  const avgGrowth =
    franchiseLocations.filter((loc) => loc.status === "active").reduce((sum, loc) => sum + loc.growth, 0) /
    activeLocations

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SoleBrew Franchise Management</h1>
          <p className="text-muted-foreground">Manage franchise operations and onboard new locations</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Globe className="mr-2 h-4 w-4" />
            Location Map
          </Button>
          <Button>
            <UserCheck className="mr-2 h-4 w-4" />
            Review Applications
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Franchise Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Locations</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeLocations}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2 new</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApplications.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgGrowth.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Across all locations</p>
          </CardContent>
        </Card>
      </div>

      {/* Franchise Locations */}
      <Card>
        <CardHeader>
          <CardTitle>Franchise Locations</CardTitle>
          <CardDescription>Overview of all franchise locations and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Location</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Monthly Revenue</TableHead>
                <TableHead>Growth</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {franchiseLocations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{location.name}</p>
                        <p className="text-sm text-muted-foreground">{location.location}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{location.owner}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(location.status)}>
                      {location.status === "active" && <CheckCircle className="mr-1 h-3 w-3" />}
                      {location.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                      {location.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {location.revenue > 0 ? `$${location.revenue.toLocaleString()}` : "N/A"}
                  </TableCell>
                  <TableCell>
                    {location.growth > 0 ? (
                      <span className="text-green-600 flex items-center">
                        <TrendingUp className="mr-1 h-3 w-3" />+{location.growth}%
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {location.rating > 0 ? (
                      <div className="flex items-center">
                        <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {location.rating}
                      </div>
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pending Applications */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Franchise Applications</CardTitle>
          <CardDescription>Review and manage new franchise applications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Proposed Location</TableHead>
                <TableHead>Investment</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell className="font-medium">{application.applicant}</TableCell>
                  <TableCell>{application.location}</TableCell>
                  <TableCell className="font-medium">${application.investment.toLocaleString()}</TableCell>
                  <TableCell>{application.experience}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(application.status)}>
                      {application.status === "review" && <AlertCircle className="mr-1 h-3 w-3" />}
                      {application.status === "interview" && <Users className="mr-1 h-3 w-3" />}
                      {application.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                      {application.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{application.submittedDate}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        Review
                      </Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Franchise Performance Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Location</CardTitle>
            <CardDescription>Monthly performance comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {franchiseLocations
                .filter((loc) => loc.status === "active")
                .map((location) => (
                  <div key={location.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{location.name}</span>
                      <span className="font-bold">${location.revenue.toLocaleString()}</span>
                    </div>
                    <Progress value={(location.revenue / 35000) * 100} className="h-2" />
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Franchise Support Tickets</CardTitle>
            <CardDescription>Recent support requests from franchise owners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">Equipment Issue</span> - Brooklyn Heights location
                  </p>
                  <p className="text-xs text-muted-foreground">Espresso machine maintenance required</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">Training Request</span> - Downtown LA location
                  </p>
                  <p className="text-xs text-muted-foreground">New staff onboarding assistance</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">Inventory Question</span> - Miami Beach location
                  </p>
                  <p className="text-xs text-muted-foreground">Sneaker authentication process clarification</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
