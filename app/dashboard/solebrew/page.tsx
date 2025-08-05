"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coffee, Users, DollarSign, Package, BarChart3 } from "lucide-react"
import { useAuth } from "@/lib/privy-auth-context"

export default function SoleBrewPage() {
  const { user, hasRole } = useAuth()

  if (!hasRole("solebrew")) {
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
        <Badge variant="default" className="bg-amber-500">
          Active
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,234</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders Today</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+8%</span> from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5%</span> this week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-orange-600">3 low stock</span> items
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
              <div className="flex items-center justify-between">
                <span className="text-sm">Espresso</span>
                <span className="text-sm font-medium">$456 (37%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Latte</span>
                <span className="text-sm font-medium">$321 (26%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cappuccino</span>
                <span className="text-sm font-medium">$234 (19%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Other</span>
                <span className="text-sm font-medium">$223 (18%)</span>
              </div>
            </div>
            <Button className="w-full mt-4 bg-transparent" variant="outline">
              View Detailed Analytics
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
              <div className="flex items-center justify-between">
                <span className="text-sm">Coffee Beans</span>
                <Badge variant="default">In Stock</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Milk</span>
                <Badge variant="secondary">Low Stock</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cups</span>
                <Badge variant="default">In Stock</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sugar</span>
                <Badge variant="destructive">Out of Stock</Badge>
              </div>
            </div>
            <Button className="w-full mt-4 bg-transparent" variant="outline">
              Manage Inventory
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
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Coffee className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Large Latte</p>
                  <p className="text-sm text-gray-600">Customer: Sarah J.</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$4.50</p>
                <p className="text-sm text-gray-600">2 min ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Coffee className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Cappuccino + Croissant</p>
                  <p className="text-sm text-gray-600">Customer: Mike R.</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$7.25</p>
                <p className="text-sm text-gray-600">5 min ago</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                  <Coffee className="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p className="font-medium">Espresso Shot</p>
                  <p className="text-sm text-gray-600">Customer: Alex K.</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">$2.00</p>
                <p className="text-sm text-gray-600">8 min ago</p>
              </div>
            </div>
          </div>
          <Button className="w-full mt-4 bg-transparent" variant="outline">
            View All Orders
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
