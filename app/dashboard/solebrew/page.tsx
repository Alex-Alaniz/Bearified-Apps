"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Coffee, Users, DollarSign, Package, BarChart3, ShoppingBag, Coins, Wallet } from "lucide-react"
import { useAuth } from "@/lib/privy-auth-context"

export default function SoleBrewPage() {
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
            <h1 className="text-3xl font-bold">SoleBrew</h1>
            <p className="text-gray-600">Coffee & Sneaker Marketplace powered by Solana</p>
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
                Revolutionary platform combining Starbucks-style coffee experience with exclusive sneaker marketplace. 
                Powered by Solana blockchain and SPL tokens, launching on Believe App. Features include coffee ordering, 
                sneaker authentication, NFT receipts, and loyalty rewards in crypto.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coffee Orders</CardTitle>
            <Coffee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--</div>
            <p className="text-xs text-muted-foreground">
              Daily coffee & beverage sales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sneaker Listings</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--</div>
            <p className="text-xs text-muted-foreground">
              Authenticated sneakers for sale
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">$SOLE Token</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">SPL</div>
            <p className="text-xs text-muted-foreground">
              Solana token for rewards
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-muted-foreground">--</div>
            <p className="text-xs text-muted-foreground">
              Connected Solana wallets
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Coffee className="h-5 w-5" />
              <span>Coffee Experience</span>
            </CardTitle>
            <CardDescription>Starbucks-style ordering and loyalty</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <Coffee className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Mobile ordering & rewards coming soon</p>
                <div className="text-xs mt-2 space-y-1">
                  <p>✓ Mobile order ahead</p>
                  <p>✓ Customized drinks</p>
                  <p>✓ Crypto loyalty rewards</p>
                  <p>✓ NFT membership perks</p>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4 bg-transparent" variant="outline" disabled>
              Coffee Module in Development
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ShoppingBag className="h-5 w-5" />
              <span>Sneaker Marketplace</span>
            </CardTitle>
            <CardDescription>Authenticated sneaker trading on Solana</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Sneaker marketplace launching soon</p>
                <div className="text-xs mt-2 space-y-1">
                  <p>✓ Authentication verification</p>
                  <p>✓ P2P trading with escrow</p>
                  <p>✓ $SOLE token rewards</p>
                  <p>✓ NFT certificates</p>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4 bg-transparent" variant="outline" disabled>
              Marketplace in Development
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Platform Features */}
      <Card>
        <CardHeader>
          <CardTitle>SoleBrew Platform Architecture</CardTitle>
          <CardDescription>Unified coffee & sneaker experience powered by blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Coffee className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-semibold">Coffee Commerce</h3>
              <p className="text-sm text-gray-600 mt-1">Mobile ordering & franchise management</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <ShoppingBag className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold">Sneaker Trading</h3>
              <p className="text-sm text-gray-600 mt-1">Authenticated marketplace with escrow</p>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Coins className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold">$SOLE Token</h3>
              <p className="text-sm text-gray-600 mt-1">SPL token for rewards & transactions</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Wallet className="h-4 w-4 text-purple-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-purple-800">Solana Integration</h4>
                <p className="text-sm text-purple-700 mt-1">
                  Built on Solana blockchain for fast, low-cost transactions. $SOLE SPL token enables seamless 
                  payments for coffee orders and sneaker trades while earning rewards.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
