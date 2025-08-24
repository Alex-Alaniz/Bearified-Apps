"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { useBearifiedAuth } from "@/lib/privy-auth-context"
import { Mail, ArrowRight, Shield, Coffee, Bot, Globe, Settings, LogIn, Phone, Wallet } from "lucide-react"
import { APP_CONFIGS } from "@/lib/app-configs"

export default function AuthPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { login: bearifiedLogin, user: bearifiedUser, loading: bearifiedLoading } = useBearifiedAuth()
  const [redirecting, setRedirecting] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
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
    // Check if we're in the logout flow
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('logout') === 'true') {
      setIsLoggingOut(true)
      // Clear the logout param
      router.replace('/auth')
      return
    }

    // Check if we should redirect to dashboard
    if (bearifiedUser && bearifiedUser.isAuthenticated && !redirecting && !isLoggingOut) {
      setRedirecting(true)
      toast({
        title: "Welcome back!",
        description: "Successfully signed in to Bearified Apps",
      })
      router.push("/dashboard")
      return
    }

    // Handle Privy authentication integration
    if (USE_PRIVY && privyHooks?.ready && privyHooks?.authenticated && privyHooks?.user && !bearifiedUser && !bearifiedLoading && !isLoggingOut) {
      // Sync Privy user with our auth system
      bearifiedLogin(privyHooks.user.id, privyHooks.user)
    }
  }, [USE_PRIVY, privyHooks?.ready, privyHooks?.authenticated, privyHooks?.user, bearifiedUser, bearifiedLoading, bearifiedLogin, redirecting, router, toast, isLoggingOut])

  const handlePrivyLogin = () => {
    if (privyHooks?.login) {
      privyHooks.login()
    }
  }

  if ((USE_PRIVY && !privyHooks?.ready) || bearifiedLoading || redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            {redirecting ? "Redirecting to dashboard..." : "Loading authentication..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left side - Branding */}
        <div className="text-center lg:text-left space-y-8">
          <div className="flex items-center justify-center lg:justify-start space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/25">
              <span className="text-white font-bold text-2xl">B</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Bearified Apps
              </h1>
              <p className="text-gray-600 text-base font-medium">Unified Business Platform</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 leading-tight">Welcome to your business ecosystem</h2>
            <p className="text-gray-700 text-xl leading-relaxed">Access SoleBrew, Chimpanion, Golf, and more from one secure platform</p>
          </div>

          {/* App showcase - Dynamic from app configs */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto lg:mx-0">
              {APP_CONFIGS.filter(app => app.id !== 'admin' && app.isActive).map((app) => {
                const IconComponent = app.icon === 'Coffee' ? Coffee : 
                                    app.icon === 'Bot' ? Bot : 
                                    app.icon === 'Globe' ? Globe : Settings
                
                return (
                  <div key={app.id} className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="flex items-start space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${app.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-lg text-gray-900">{app.name}</h3>
                          <Badge 
                            variant={app.status === 'production' ? 'default' : 'secondary'} 
                            className={`text-xs font-medium ${
                              app.status === 'production' 
                                ? 'bg-green-100 text-green-700 border-green-200' 
                                : 'bg-amber-100 text-amber-700 border-amber-200'
                            }`}
                          >
                            {app.status === 'production' ? 'Live' : 'Beta'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{app.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right side - Auth */}
        <div className="space-y-8">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-3xl font-bold text-gray-900">Sign In</CardTitle>
              <CardDescription className="text-base text-gray-600">
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
                    className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 transition-all duration-200"
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
                    className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 hover:from-violet-700 hover:via-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 transition-all duration-200"
                    size="lg"
                  >
                    Continue to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center space-x-3 text-gray-900">
                <Shield className="h-6 w-6 text-violet-600" />
                <span>Secure Access</span>
              </CardTitle>
              <CardDescription className="text-base text-gray-600">
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