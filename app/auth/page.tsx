"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Mail, ArrowRight, Shield, Coffee, Bot, LogIn, Phone, Wallet } from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const { toast } = useToast()
  const USE_PRIVY = process.env.NEXT_PUBLIC_USE_PRIVY_AUTH === "true"
  
  // Privy hooks - only use when Privy is enabled
  const privyHooks = USE_PRIVY ? {
    ready: usePrivy().ready,
    authenticated: usePrivy().authenticated,
    user: usePrivy().user,
    login: usePrivy().login,
    logout: usePrivy().logout
  } : null

  useEffect(() => {
    // If using Privy and user is authenticated, redirect to dashboard
    if (USE_PRIVY && privyHooks?.authenticated && privyHooks?.user) {
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to Bearified Apps",
      })
      router.push("/dashboard")
    }
  }, [USE_PRIVY, privyHooks?.authenticated, privyHooks?.user, router, toast])

  const handlePrivyLogin = () => {
    if (privyHooks?.login) {
      privyHooks.login()
    }
  }

  if (USE_PRIVY && !privyHooks?.ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left space-y-6">
          <div className="flex items-center justify-center lg:justify-start space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Bearified Apps
              </h1>
              <p className="text-gray-600 text-sm">Unified Business Platform</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-800">Welcome to your business ecosystem</h2>
            <p className="text-gray-600 text-lg">Access SoleBrew, Chimpanion, and more from one secure platform</p>
          </div>

          {/* App showcase */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto lg:mx-0">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center mb-2">
                <Coffee className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-sm">SoleBrew</h3>
              <p className="text-xs text-gray-600">Coffee Management</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-2">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-semibold text-sm">Chimpanion</h3>
              <p className="text-xs text-gray-600">Security & Intel</p>
            </div>
          </div>
        </div>

        {/* Right side - Auth */}
        <div className="space-y-6">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>
                {USE_PRIVY 
                  ? "Use your account to access Bearified Apps" 
                  : "Development mode - Mock authentication active"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {USE_PRIVY ? (
                <div className="space-y-4">
                  <Button
                    onClick={handlePrivyLogin}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    size="lg"
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    Sign In with Privy
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground">Supported providers</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>Email</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="h-3 w-3" />
                      <span>SMS</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Wallet className="h-3 w-3" />
                      <span>Wallet</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-800">
                      <strong>Development Mode:</strong> Real authentication is disabled. 
                      Use the demo users below or set NEXT_PUBLIC_USE_PRIVY_AUTH=true for production auth.
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => router.push("/dashboard")}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    Continue to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Secure Access</span>
              </CardTitle>
              <CardDescription>
                {USE_PRIVY 
                  ? "Your account is protected with industry-standard security" 
                  : "Enable Privy authentication for production use"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✓ End-to-end encryption</p>
                <p>✓ Multi-factor authentication support</p>
                <p>✓ Role-based access control</p>
                <p>✓ Secure session management</p>
              </div>
              
              {USE_PRIVY && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    By signing in, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}