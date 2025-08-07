"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coffee, Users, DollarSign, Package, BarChart3 } from "lucide-react"
import { useAuth } from "@/lib/privy-auth-context"

export default function SoleBrewPage() {
  const { user, hasRole } = useAuth()

  if (!hasRole("solebrew") && !hasRole("admin") && !hasRole("super_admin")) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="text-center p-8">
          <CardContent>
            <Coffee className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access SoleBrew.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
            <Coffee className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">SoleBrew</h1>
            <p className="text-gray-600">Coffee shop management platform</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          In Development
        </Badge>
      </div>

      {/* Development Notice */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
            <div>
              <h3 className="font-semibold text-yellow-800">SoleBrew is Under Development</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Coffee shop management platform preparing to launch on Believe App. Features include point-of-sale, 
                inventory management, customer loyalty, and franchise support for coffee shop owners.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--</div>
            <p className="text-xs text-muted-foreground">
              Coming soon in beta release
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--</div>
            <p className="text-xs text-muted-foreground">
              Coming soon in beta release
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--</div>
            <p className="text-xs text-muted-foreground">
              Coming soon in beta release
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--</div>
            <p className="text-xs text-muted-foreground">
              Coming soon in beta release
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Sales Analytics</span>
            </CardTitle>
            <CardDescription>Track your coffee shop performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Sales analytics dashboard coming soon</p>
                <p className="text-xs mt-2">Track best-selling items, revenue trends, and performance metrics</p>
              </div>
            </div>
            <Button className="w-full mt-4 bg-transparent" variant="outline" disabled>
              Feature in Development
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Inventory Management</span>
            </CardTitle>
            <CardDescription>Monitor your stock levels</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Inventory management system coming soon</p>
                <p className="text-xs mt-2">Track stock levels, set reorder alerts, and manage suppliers</p>
              </div>
            </div>
            <Button className="w-full mt-4 bg-transparent" variant="outline" disabled>
              Feature in Development
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Latest customer orders from your coffee shop</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Coffee className="h-16 w-16 mx-auto mb-6 opacity-50" />
            <h3 className="text-lg font-medium mb-2">Order Management System</h3>
            <p className="text-sm mb-4">Point-of-sale and order tracking coming in beta release</p>
            <div className="space-y-2 text-xs">
              <p>✓ Real-time order processing</p>
              <p>✓ Customer management</p>
              <p>✓ Payment integration</p>
              <p>✓ Kitchen display system</p>
            </div>
          </div>
          <Button className="w-full mt-4 bg-transparent" variant="outline" disabled>
            Feature in Development
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
