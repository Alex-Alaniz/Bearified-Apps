"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Zap, Users, Coffee, Bot } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/privy-auth-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/dashboard")
      } else {
        router.push("/auth")
      }
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Bearified Apps...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">B</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Bearified Apps
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <Button asChild>
                <Link href="/dashboard">
                  Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/auth">
                  Sign In <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            🚀 Now Available
          </Badge>
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-teal-600 bg-clip-text text-transparent">
            Unified Business Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your operations with our integrated suite of business applications. From coffee shop management
            to security analytics, we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            ) : (
              <>
                <Button size="lg" asChild>
                  <Link href="/auth">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#features">Learn More</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Applications</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform brings together essential business tools in one unified interface
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
                  <Coffee className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">SoleBrew</CardTitle>
                <CardDescription>
                  Complete coffee shop management system with inventory, sales, and customer analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2" />
                    Inventory Management
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2" />
                    Sales Analytics
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-2" />
                    Customer Insights
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl">Chimpanion</CardTitle>
                <CardDescription>
                  Advanced security and business intelligence platform for comprehensive monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                    Security Monitoring
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                    Business Intelligence
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                    Real-time Analytics
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Bearified?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Built for modern businesses that need reliable, scalable solutions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Enterprise Security</h3>
              <p className="text-gray-600">Bank-level security with role-based access control and audit trails</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Optimized performance with real-time updates and instant synchronization</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Team Collaboration</h3>
              <p className="text-gray-600">Built for teams with advanced user management and collaboration tools</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-purple-100">Uptime</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-purple-100">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-purple-100">Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2</div>
              <div className="text-purple-100">Core Apps</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses already using Bearified Apps to streamline their operations
          </p>
          {!user && (
            <Button size="lg" asChild>
              <Link href="/auth">
                Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Bearified Apps
              </span>
            </div>
            <div className="text-gray-600 text-sm">© 2024 Bearified Apps. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
