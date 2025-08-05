"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Filter, Package, Coffee, AlertTriangle, TrendingUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const inventory = [
  {
    id: 1,
    name: "Air Jordan 1 Retro High OG",
    category: "Sneakers",
    sku: "AJ1-001",
    quantity: 12,
    minStock: 5,
    price: 170.0,
    status: "in-stock",
    lastUpdated: "2024-01-15",
  },
  {
    id: 2,
    name: "Premium Coffee Beans - Ethiopian",
    category: "Coffee",
    sku: "COF-ETH-001",
    quantity: 25,
    minStock: 10,
    price: 18.99,
    status: "in-stock",
    lastUpdated: "2024-01-14",
  },
  {
    id: 3,
    name: "Nike Dunk Low Panda",
    category: "Sneakers",
    sku: "NK-DL-002",
    quantity: 3,
    minStock: 8,
    price: 110.0,
    status: "low-stock",
    lastUpdated: "2024-01-13",
  },
  {
    id: 4,
    name: "Espresso Cups - Ceramic",
    category: "Supplies",
    sku: "SUP-CUP-001",
    quantity: 0,
    minStock: 20,
    price: 12.5,
    status: "out-of-stock",
    lastUpdated: "2024-01-12",
  },
  {
    id: 5,
    name: "Yeezy Boost 350 V2",
    category: "Sneakers",
    sku: "YZ-350-003",
    quantity: 8,
    minStock: 5,
    price: 220.0,
    status: "in-stock",
    lastUpdated: "2024-01-11",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "in-stock":
      return "bg-green-100 text-green-800"
    case "low-stock":
      return "bg-yellow-100 text-yellow-800"
    case "out-of-stock":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "in-stock":
      return <Package className="h-3 w-3" />
    case "low-stock":
      return <AlertTriangle className="h-3 w-3" />
    case "out-of-stock":
      return <AlertTriangle className="h-3 w-3" />
    default:
      return <Package className="h-3 w-3" />
  }
}

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0)
  const lowStockItems = inventory.filter((item) => item.quantity <= item.minStock).length
  const outOfStockItems = inventory.filter((item) => item.quantity === 0).length
  const totalValue = inventory.reduce((sum, item) => sum + item.quantity * item.price, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
          <p className="text-muted-foreground">Track sneakers, coffee products, and supplies</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Package className="mr-2 h-4 w-4" />
            Bulk Update
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                +5.2%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items below minimum stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">Items requiring restock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12.3%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">All Items</TabsTrigger>
          <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Sneakers">Sneakers</SelectItem>
                <SelectItem value="Coffee">Coffee</SelectItem>
                <SelectItem value="Supplies">Supplies</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Items</CardTitle>
              <CardDescription>Manage all products and supplies</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{item.quantity}</span>
                          <span className="text-xs text-muted-foreground">Min: {item.minStock}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${item.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusIcon(item.status)}
                          <span className="ml-1">{item.status.replace("-", " ")}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>{item.lastUpdated}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Stock Alerts</CardTitle>
              <CardDescription>Items requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inventory
                  .filter((item) => item.quantity <= item.minStock)
                  .map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <AlertTriangle
                          className={`h-5 w-5 ${item.quantity === 0 ? "text-red-600" : "text-yellow-600"}`}
                        />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {item.quantity === 0 ? "Out of Stock" : `Low Stock: ${item.quantity}`}
                        </p>
                        <p className="text-sm text-muted-foreground">Min: {item.minStock}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory by Category</CardTitle>
                <CardDescription>Distribution of items by category</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Chart visualization would go here...</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stock Movement</CardTitle>
                <CardDescription>Inventory changes over time</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Stock movement chart would go here...</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
