"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Save,
  Eye,
  Users,
  Shield,
  Database,
  Smartphone,
  Globe,
  Brain,
  Coffee,
  Building,
  Zap,
  Package,
} from "lucide-react"

const availableIcons = [
  { name: "Coffee", icon: Coffee, value: "Coffee" },
  { name: "Brain", icon: Brain, value: "Brain" },
  { name: "Building", icon: Building, value: "Building" },
  { name: "Smartphone", icon: Smartphone, value: "Smartphone" },
  { name: "Globe", icon: Globe, value: "Globe" },
  { name: "Zap", icon: Zap, value: "Zap" },
  { name: "Package", icon: Package, value: "Package" },
  { name: "Users", icon: Users, value: "Users" },
  { name: "Shield", icon: Shield, value: "Shield" },
  { name: "Database", icon: Database, value: "Database" },
]

const availableFeatures = [
  "project-management",
  "expense-tracking",
  "inventory-management",
  "user-management",
  "analytics",
  "notifications",
  "mobile-app",
  "web-app",
  "api-integration",
  "real-time-sync",
  "multi-tenant",
  "franchise-support",
  "ai-integration",
  "blockchain",
  "security-compliance",
]

const colorOptions = [
  "#8B5CF6", // Purple
  "#10B981", // Green
  "#F59E0B", // Yellow
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#8B5CF6", // Indigo
  "#EC4899", // Pink
  "#6B7280", // Gray
]

export default function NewApp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    icon: "Coffee",
    color: "#8B5CF6",
    status: "development",
    features: [] as string[],
    requiredRoles: [] as string[],
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null,
    message: string,
    requiresRestart?: boolean
  }>({ type: null, message: '', requiresRestart: false })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '', requiresRestart: false })
    
    try {
      const response = await fetch('/api/admin/apps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: data.message || 'Application created successfully!',
          requiresRestart: data.note?.includes('restart')
        })
        
        // Redirect after showing success message
        setTimeout(() => {
          router.push("/admin/apps")
        }, 3000)
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Failed to create application'
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to create application'
      })
    } finally {
      setIsSubmitting(false)
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const selectedIcon = availableIcons.find((icon) => icon.value === formData.icon)?.icon || Coffee

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Application</h1>
          <p className="text-muted-foreground">Add a new application to your platform</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Configure the basic details of your application</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Application Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="My Awesome App"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                      placeholder="my-awesome-app"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what your application does..."
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize how your application appears in the launcher</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {availableIcons.map((icon) => (
                      <Button
                        key={icon.value}
                        type="button"
                        variant={formData.icon === icon.value ? "default" : "outline"}
                        className="h-12 w-12 p-0"
                        onClick={() => setFormData((prev) => ({ ...prev, icon: icon.value }))}
                      >
                        <icon.icon className="h-5 w-5" />
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Color Theme</Label>
                  <div className="flex space-x-2">
                    {colorOptions.map((color) => (
                      <Button
                        key={color}
                        type="button"
                        className="h-8 w-8 p-0 rounded-full border-2"
                        style={{
                          backgroundColor: color,
                          borderColor: formData.color === color ? "#000" : "transparent",
                        }}
                        onClick={() => setFormData((prev) => ({ ...prev, color }))}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>Select the features your application will include</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {availableFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={formData.features.includes(feature)}
                        onCheckedChange={() => handleFeatureToggle(feature)}
                      />
                      <Label htmlFor={feature} className="text-sm">
                        {feature.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
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
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </CardTitle>
                <CardDescription>How your app will appear in the launcher</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Grid View Preview */}
                <div className="space-y-4">
                  <div className="text-sm font-medium">Grid View</div>
                  <Card className="relative overflow-hidden transition-all duration-200 border-2">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center space-y-4">
                        <div
                          className="flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-lg"
                          style={{ backgroundColor: formData.color }}
                        >
                          {React.createElement(selectedIcon, { className: "h-8 w-8" })}
                        </div>
                        <div className="text-center space-y-2">
                          <h3 className="font-semibold text-lg">{formData.name || "App Name"}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {formData.description || "App description will appear here..."}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          <Badge variant={formData.status === "active" ? "default" : "secondary"} className="text-xs">
                            {formData.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            v1.0.0
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Selected Features */}
                {formData.features.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <div className="text-sm font-medium">Selected Features</div>
                    <div className="flex flex-wrap gap-1">
                      {formData.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature.replace("-", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Status Messages */}
                  {submitStatus.type && (
                    <div className={`p-4 rounded-lg ${
                      submitStatus.type === 'success' 
                        ? 'bg-green-50 border border-green-200 text-green-800' 
                        : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                      <div className="text-sm font-medium">
                        {submitStatus.type === 'success' ? '✅ Success!' : '❌ Error'}
                      </div>
                      <div className="text-sm mt-1">{submitStatus.message}</div>
                      {submitStatus.requiresRestart && (
                        <div className="text-xs mt-2 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800">
                          <strong>Important:</strong> Please restart the development server to see the new app in the dashboard.
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSubmitting ? 'Creating Application...' : 'Create Application'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => router.back()}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
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
