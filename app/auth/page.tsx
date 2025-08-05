"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/privy-auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Mail, ArrowRight, Shield, Coffee, Bot } from "lucide-react"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)

    try {
      const success = await login(email)
      if (success) {
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to Bearified Apps",
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Authentication failed",
          description: "Please check your email address and try again",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const demoUsers = [
    {
      email: "alex@alexalaniz.com",
      name: "Alex Alaniz",
      role: "Super Admin",
      description: "Full system access",
      color: "bg-red-500",
    },
    {
      email: "admin@company.com",
      name: "Admin User",
      role: "Admin",
      description: "App management access",
      color: "bg-blue-500",
    },
    {
      email: "user@company.com",
      name: "Regular User",
      role: "User",
      description: "Limited app access",
      color: "bg-green-500",
    },
  ]

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

        {/* Right side - Auth form */}
        <div className="space-y-6">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription>Enter your email to access your applications</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo users */}
          <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Demo Users</span>
              </CardTitle>
              <CardDescription>Click any email below to sign in as that user</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoUsers.map((user) => (
                <div
                  key={user.email}
                  className="flex items-center justify-between p-3 rounded-lg border bg-white/50 hover:bg-white/80 transition-colors cursor-pointer"
                  onClick={() => setEmail(user.email)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${user.color} rounded-full flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-xs">
                      {user.role}
                    </Badge>
                    <p className="text-xs text-gray-500 mt-1">{user.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
