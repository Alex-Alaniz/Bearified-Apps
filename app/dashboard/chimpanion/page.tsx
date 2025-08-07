"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, Shield, Activity, AlertTriangle, Eye, Lock, Wallet, MessageCircle, Smartphone, Globe } from "lucide-react"
import { useAuth } from "@/lib/privy-auth-context"

export default function ChimpanionPage() {
  const { user, hasRole } = useAuth()

  if (!hasRole("chimpanion-admin") && !hasRole("chimpanion-member") && !hasRole("admin") && !hasRole("super_admin")) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="text-center p-8">
          <CardContent>
            <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600">You don't have permission to access Chimpanion.</p>
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
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Chimpanion</h1>
            <p className="text-gray-600">Blockchain AI companion app</p>
          </div>
        </div>
        <Badge variant="default" className="bg-green-100 text-green-800">
          Production V1
        </Badge>
      </div>

      {/* Production Status */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <h3 className="font-semibold text-green-800">Chimpanion V1 is Live in Production</h3>
              <p className="text-green-700 text-sm mt-1">
                Blockchain AI companion app helping users manage their wallets in natural language. 
                Available on Vercel web platform and Apple TestFlight beta program.
              </p>
              <div className="flex space-x-4 mt-3">
                <Button size="sm" variant="outline" className="bg-white">
                  <Globe className="mr-2 h-3 w-3" />
                  View Web App
                </Button>
                <Button size="sm" variant="outline" className="bg-white">
                  <Smartphone className="mr-2 h-3 w-3" />
                  TestFlight Beta
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">Beta</div>
            <p className="text-xs text-muted-foreground">
              Growing user base in TestFlight
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wallet Connections</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Multi-chain</div>
            <p className="text-xs text-muted-foreground">
              Supports multiple blockchains
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Natural</div>
            <p className="text-xs text-muted-foreground">
              Language-based wallet management
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Live</div>
            <p className="text-xs text-muted-foreground">Production deployment active</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>AI Chat Features</span>
            </CardTitle>
            <CardDescription>Natural language blockchain interaction capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg bg-purple-50">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Wallet Management</p>
                    <p className="text-xs text-gray-600">Natural language wallet operations</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-purple-100 text-purple-800">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Transaction Support</p>
                    <p className="text-xs text-gray-600">Multi-chain transaction processing</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-blue-100 text-blue-800">Live</Badge>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">ElizaOS Integration</p>
                    <p className="text-xs text-gray-600">AI agent framework powering conversations</p>
                  </div>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">Production</Badge>
              </div>
            </div>
            <Button className="w-full mt-4 bg-transparent" variant="outline" disabled>
              Chat Interface (Production App)
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span>Blockchain Integration</span>
            </CardTitle>
            <CardDescription>Multi-chain wallet and transaction support</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Ethereum</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <Badge variant="default" className="bg-blue-100 text-blue-800">Supported</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Base Chain</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <Badge variant="default" className="bg-blue-100 text-blue-800">Supported</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Solana</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <Badge variant="default" className="bg-purple-100 text-purple-800">Supported</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Wallet Connect</span>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <Badge variant="default" className="bg-green-100 text-green-800">Integrated</Badge>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4 bg-transparent" variant="outline" disabled>
              Production Blockchain Features
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Production Architecture */}
      <Card>
        <CardHeader>
          <CardTitle>Production Architecture Overview</CardTitle>
          <CardDescription>Chimpanion V1 technical implementation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Globe className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">Vercel Deployment</h3>
              <p className="text-sm text-gray-600 mt-1">Web platform live in production</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Smartphone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold">iOS TestFlight</h3>
              <p className="text-sm text-gray-600 mt-1">Beta mobile app on Apple platform</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">ElizaOS Framework</h3>
              <p className="text-sm text-gray-600 mt-1">AI agent powering natural language chat</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
