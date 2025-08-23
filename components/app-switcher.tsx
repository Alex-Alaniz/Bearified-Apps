"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/privy-auth-context"
import { getAccessibleApps, getAccessibleAdminApps, type AppConfig } from "@/lib/app-configs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Grid3X3, Coffee, Bot, Settings, Lock, Globe, Package } from "lucide-react"
import Link from "next/link"

const iconMap = {
  Coffee,
  Bot,
  Settings,
  Globe,
  Package,
  Grid3X3,
}

export function AppSwitcher() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  if (!user) return null

  const userRoles = user.roles || []
  const isAdmin = userRoles.includes('admin') || userRoles.includes('super_admin')
  
  // Get all accessible apps from APP_CONFIGS
  const accessibleApps = getAccessibleApps(userRoles)
  const accessibleAdminApps = isAdmin ? getAccessibleAdminApps(userRoles) : []
  const allApps = [...accessibleApps, ...accessibleAdminApps]

  const hasAccess = (app: AppConfig) => {
    return userRoles.includes('super_admin') || 
           userRoles.includes('admin') || 
           app.requiredRoles?.some((role) => userRoles.includes(role)) ||
           (app.requiredRole && userRoles.includes(app.requiredRole))
  }

  const hasAnyAccess = allApps.length > 0

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Grid3X3 className="h-4 w-4" />
          <span className="sr-only">Switch applications</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bearified Apps</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!hasAnyAccess && (
            <div className="text-center py-8">
              <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Access Pending</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your account has been created but you don't have access to any applications yet.
              </p>
              <p className="text-xs text-muted-foreground">
                Please contact your administrator to request access to the applications you need.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 gap-3">
            {allApps.map((app) => {
              const Icon = iconMap[app.icon as keyof typeof iconMap] || Grid3X3
              const accessible = hasAccess(app)
              const gradientColor = app.color.includes('gradient') ? app.color : `bg-gradient-to-br ${app.color}`

              if (accessible) {
                return (
                  <Link
                    key={app.id}
                    href={app.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className={`p-2 rounded-md ${gradientColor} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{app.name}</div>
                      <div className="text-sm text-muted-foreground">{app.description}</div>
                    </div>
                  </Link>
                )
              } else {
                return (
                  <div
                    key={app.id}
                    className="flex items-center gap-3 p-3 rounded-lg border opacity-50 cursor-not-allowed"
                  >
                    <div className="p-2 rounded-md bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-muted-foreground">{app.name}</div>
                      <div className="text-sm text-muted-foreground">{app.description}</div>
                    </div>
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  </div>
                )
              }
            })}
          </div>

          {!hasAnyAccess && (
            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Signed in as <strong>{user.email}</strong>
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
