"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Coffee,
  Smartphone,
  Package,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const expenses = [
  {
    id: 1,
    date: "2024-01-15",
    description: "Coffee beans - Premium blend",
    category: "Coffee Shop",
    amount: 450.0,
    status: "approved",
    submittedBy: "Emma Davis",
  },
  {
    id: 2,
    date: "2024-01-14",
    description: "iOS Developer License Renewal",
    category: "App Development",
    amount: 99.0,
    status: "approved",
    submittedBy: "Sarah Johnson",
  },
  {
    id: 3,
    date: "2024-01-13",
    description: "Sneaker display cases",
    category: "Coffee Shop",
    amount: 1200.0,
    status: "pending",
    submittedBy: "Mike Chen",
  },
  {
    id: 4,
    date: "2024-01-12",
    description: "Cloud hosting - AWS",
    category: "App Development",
    amount: 289.5,
    status: "approved",
    submittedBy: "Alex Rodriguez",
  },
  {
    id: 5,
    date: "2024-01-11",
    description: "Marketing materials printing",
    category: "Marketing",
    amount: 175.0,
    status: "rejected",
    submittedBy: "Emma Davis",
  },
]

const categoryTotals = {
  "Coffee Shop": 3450.0,
  "App Development": 2890.5,
  Marketing: 1250.0,
  Operations: 890.0,
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default function ExpensesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.submittedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || expense.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expense Tracker</h1>
          <p className="text-muted-foreground">Monitor budgets and track expenses across all operations</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$8,480.50</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <TrendingUp className="mr-1 h-3 w-3" />
                +3.1%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coffee Shop</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,450</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingDown className="mr-1 h-3 w-3" />
                -2.4%
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">App Development</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,890</div>
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
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,200</div>
            <p className="text-xs text-muted-foreground">1 expense awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="expenses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="expenses">All Expenses</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="budgets">Budgets</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
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
                <SelectItem value="Coffee Shop">Coffee Shop</SelectItem>
                <SelectItem value="App Development">App Development</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Expenses Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Expenses</CardTitle>
              <CardDescription>Track and manage all business expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell className="font-medium">{expense.date}</TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{expense.category}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">${expense.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(expense.status)}>{expense.status}</Badge>
                      </TableCell>
                      <TableCell>{expense.submittedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Expense by Category</CardTitle>
                <CardDescription>Monthly breakdown by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(categoryTotals).map(([category, amount]) => (
                    <div key={category} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category}</span>
                      <span className="font-bold">${amount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trends</CardTitle>
                <CardDescription>Expense trends over time</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Chart visualization would go here...</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="budgets">
          <Card>
            <CardHeader>
              <CardTitle>Budget Management</CardTitle>
              <CardDescription>Set and monitor budgets by category</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Budget management interface would go here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
