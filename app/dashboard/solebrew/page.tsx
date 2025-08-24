"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Coffee, 
  GitBranch, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Code,
  Database,
  Smartphone,
  Settings,
  TrendingUp,
  Calendar,
  Star,
  Target
} from "lucide-react"
import { useAuth } from "@/lib/privy-auth-context"

export default function SoleBrewProjectDashboard() {
  const { user, hasRole } = useAuth()

  if (!hasRole("solebrew-admin") && !hasRole("solebrew-member") && !hasRole("admin") && !hasRole("super_admin")) {
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
            <h1 className="text-3xl font-bold">SoleBrew Project Hub</h1>
            <p className="text-gray-600">Coffee & Sneaker Marketplace Development | Bearified.co Agency Project</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Development Phase
          </Badge>
          <Button>
            <GitBranch className="mr-2 h-4 w-4" />
            Sprint Planning
          </Button>
        </div>
      </div>

      {/* Project KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Development Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">MVP Features Complete</p>
            <Progress value={68} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 critical, 9 medium priority</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Velocity</CardTitle>
            <Target className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground">Story points this sprint</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Launch Timeline</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6w</div>
            <p className="text-xs text-muted-foreground">Estimated beta release</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Sprint & Roadmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Sprint */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <GitBranch className="h-5 w-5 text-amber-600" />
                <CardTitle>Sprint 5: Solana Integration</CardTitle>
              </div>
              <Badge variant="outline">6 days left</Badge>
            </div>
            <CardDescription>Implementing $SOLE token and NFT receipt system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="font-medium">Solana Wallet Integration</p>
                    <p className="text-sm text-gray-500">Connect Phantom, Solflare wallets</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">AS</AvatarFallback>
                  </Avatar>
                  <Badge variant="default">Done</Badge>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="font-medium">$SOLE Token Smart Contract</p>
                    <p className="text-sm text-gray-500">SPL token deployment & testing</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">AA</AvatarFallback>
                  </Avatar>
                  <Badge variant="outline">In Progress</Badge>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <div>
                    <p className="font-medium">NFT Receipt System</p>
                    <p className="text-sm text-gray-500">Generate NFTs for coffee purchases</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">AA</AvatarFallback>
                  </Avatar>
                  <Badge variant="secondary">Blocked</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack & Architecture */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Code className="h-5 w-5 text-purple-600" />
              <CardTitle>Technical Architecture</CardTitle>
            </div>
            <CardDescription>SoleBrew technology stack and integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Coffee className="h-4 w-4 text-amber-600" />
                <span className="text-sm">Next.js 14</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Database className="h-4 w-4 text-green-600" />
                <span className="text-sm">Supabase</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Code className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Solana Web3</span>
              </div>
              <div className="flex items-center space-x-2 p-2 border rounded">
                <Smartphone className="h-4 w-4 text-pink-600" />
                <span className="text-sm">PWA Ready</span>
              </div>
            </div>
            
            <div className="pt-2">
              <h4 className="font-medium mb-2">Key Integrations:</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Believe App Platform</span>
                  <Badge variant="outline">Connected</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Solana Blockchain</span>
                  <Badge variant="outline">In Progress</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Sneaker Marketplace API</span>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Roadmap */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5 text-gray-600" />
              <div>
                <CardTitle>SoleBrew Development Roadmap</CardTitle>
                <CardDescription>Quarterly milestones for coffee & sneaker marketplace</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center">
                <Badge className="mr-2 bg-green-600">Q1 2024</Badge>
                MVP Launch
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Coffee Ordering System</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">User Authentication</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-sm">Payment Processing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-sm">Store Locator</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center">
                <Badge variant="outline" className="mr-2">Q2 2024</Badge>
                Blockchain Integration
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">$SOLE Token Launch</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">NFT Receipt System</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Loyalty Rewards</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Solana Wallet Connect</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center">
                <Badge variant="outline" className="mr-2">Q3 2024</Badge>
                Sneaker Marketplace
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Sneaker Catalog</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">P2P Trading</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Authentication System</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Escrow Service</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-lg flex items-center">
                <Badge variant="outline" className="mr-2">Q4 2024</Badge>
                Scale & Expand
              </h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Franchise System</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Mobile App Launch</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Multi-Chain Support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500">Enterprise Dashboard</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Development Team</CardTitle>
            <CardDescription>SoleBrew project contributors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>AA</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Alex Alaniz</p>
                    <p className="text-sm text-gray-500">Project Lead & Full-Stack Dev</p>
                  </div>
                </div>
                <Badge>Lead</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Anson</p>
                    <p className="text-sm text-gray-500">Developer</p>
                  </div>
                </div>
                <Badge variant="outline">Developer</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common development tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-auto flex-col items-start p-3">
                <GitBranch className="h-4 w-4 mb-1" />
                <span className="text-sm">Create Feature Branch</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-start p-3">
                <Code className="h-4 w-4 mb-1" />
                <span className="text-sm">Open VS Code</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-start p-3">
                <Database className="h-4 w-4 mb-1" />
                <span className="text-sm">DB Console</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col items-start p-3">
                <Settings className="h-4 w-4 mb-1" />
                <span className="text-sm">Deploy Staging</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}