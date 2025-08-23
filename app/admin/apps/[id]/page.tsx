"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { APP_CONFIGS } from "@/lib/app-configs"
import {
  ArrowLeft,
  Save,
  Trash2,
  Users,
  Settings,
  Coffee,
  Bot,
  Globe,
  Package,
} from "lucide-react"

const availableIcons = [
  { name: "Coffee", icon: Coffee, value: "Coffee" },
  { name: "Bot", icon: Bot, value: "Bot" },
  { name: "Globe", icon: Globe, value: "Globe" },
  { name: "Package", icon: Package, value: "Package" },
  { name: "Users", icon: Users, value: "Users" },
  { name: "Settings", icon: Settings, value: "Settings" },
]

const availableFeatures = [
  "Course Booking",
  "Score Tracking", 
  "Tournament Management",
  "Coffee Ordering",
  "Sneaker Marketplace",
  "Solana Integration",
  "AI Wallet Management",
  "Natural Language Interface",
  "Multi-Chain Support",
  "Portfolio Analytics",
  "User Management",
  "App Configuration",
  "System Settings",
  "Audit Logs",
]

interface EditAppPageProps {
  params: { id: string }
}

export default function EditAppPage({ params }: EditAppPageProps) {
  const router = useRouter()
  const [app, setApp] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "Package",
    color: "#8B5CF6",
    status: "development",
    features: [] as string[],
  })

  useEffect(() => {
    // Find the app in APP_CONFIGS
    const foundApp = APP_CONFIGS.find(a => a.id === params.id)
    if (foundApp) {
      setApp(foundApp)
      setFormData({
        name: foundApp.name,
        description: foundApp.description,
        icon: foundApp.icon,
        color: foundApp.color.includes("amber") ? "#f59e0b" : 
               foundApp.color.includes("green") ? "#10b981" : 
               foundApp.color.includes("purple") ? "#8b5cf6" : 
               foundApp.color.includes("blue") ? "#3b82f6" : "#6b7280",
        status: foundApp.status,
        features: foundApp.features || [],
      })
    }
    setLoading(false)
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Since we don't have a database table, we can't actually update the app
      // In a real system, you would update the database here
      alert("⚠️ App editing is not fully implemented yet.\n\nTo edit apps, you need to manually update lib/app-configs.ts")
      
      // Simulate save
      setTimeout(() => {
        setSaving(false)
        // Don't redirect, stay on page
      }, 1000)
      
    } catch (error) {
      console.error('Error updating app:', error)
      setSaving(false)
    }
  }

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const selectedIcon = availableIcons.find((icon) => icon.value === formData.icon)?.icon || Package

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Loading...</h1>
            <p className="text-muted-foreground">Loading application details</p>
          </div>
        </div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">App Not Found</h1>
            <p className="text-muted-foreground">The requested application could not be found</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit {app.name}</h1>
            <p className="text-muted-foreground">Update application configuration and settings</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => router.push(`/admin/apps/${params.id}/users`)}>
            <Users className="mr-2 h-4 w-4" />
            Manage Users
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update the basic details of your application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Application Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      placeholder="Enter application name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, status: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="beta">Beta</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Describe what your application does..."
                    rows={3}
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Select
                      value={formData.icon}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, icon: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            <div className="flex items-center space-x-2">
                              <icon.icon className="h-4 w-4" />
                              <span>{icon.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Theme Color</Label>
                    <Input
                      id="color"
                      type="color"
                      value={formData.color}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, color: e.target.value }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>
                  Select the features available in this application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {availableFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={formData.features.includes(feature)}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                      <Label htmlFor={feature} className="text-sm">
                        {feature.replace(/[-_]/g, " ")}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  See how your app will appear to users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg text-white"
                      style={{ backgroundColor: formData.color }}
                    >
                      <selectedIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{formData.name || "App Name"}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formData.description || "App description"}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {formData.status}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-1">
                      {formData.features.slice(0, 4).map((feature) => (
                        <Badge key={feature} variant="secondary" className="text-xs">
                          {feature.replace(/[-_]/g, " ")}
                        </Badge>
                      ))}
                      {formData.features.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{formData.features.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>App Info</CardTitle>
                <CardDescription>Current application details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">App ID:</span> {app.id}
                </div>
                <div>
                  <span className="font-medium">URL:</span> {app.href}
                </div>
                <div>
                  <span className="font-medium">Required Roles:</span>
                  <div className="mt-1 space-y-1">
                    {app.requiredRoles?.map((role: string) => (
                      <Badge key={role} variant="outline" className="text-xs mr-1">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}