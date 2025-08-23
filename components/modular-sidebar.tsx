"use client"

import { Coffee, Bot, Home, Users, BarChart3, Settings, LogOut, Globe, Package } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useAuth } from "@/lib/privy-auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggleSimple } from "@/components/theme-toggle"
import { getAccessibleApps } from "@/lib/app-configs"

const iconMap = {
  Coffee,
  Bot,
  Settings,
  Globe,
  Package,
}

const staticNavigation = [
  {
    title: "Overview",
    items: [{ title: "Dashboard", url: "/dashboard", icon: Home }],
  },
  {
    title: "Administration",
    items: [
      { title: "User Management", url: "/admin/users", icon: Users, adminOnly: true },
      { title: "App Analytics", url: "/admin/apps", icon: BarChart3, adminOnly: true },
      { title: "Settings", url: "/admin", icon: Settings, adminOnly: true },
    ],
  },
]

export function ModularSidebar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()

  const userRoles = user?.roles || []
  const isAdmin = userRoles.includes('super_admin') || userRoles.includes('admin')
  
  // Get accessible apps dynamically
  const accessibleApps = getAccessibleApps(userRoles).filter(app => app.id !== 'admin')
  
  // Create dynamic applications section
  const applicationsSection = {
    title: "Applications",
    items: accessibleApps.map(app => ({
      title: app.name,
      url: app.href,
      icon: iconMap[app.icon as keyof typeof iconMap] || Settings,
    })),
  }
  
  // Combine static navigation with dynamic applications
  const navigation = [
    staticNavigation[0], // Overview
    ...(applicationsSection.items.length > 0 ? [applicationsSection] : []), // Applications (if any)
    staticNavigation[1], // Administration
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Bearified Apps
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items
                  .filter((item) => !item.adminOnly || isAdmin)
                  .map((item) => {
                    const IconComponent = item.icon
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={pathname === item.url}>
                          <Link href={item.url}>
                            <IconComponent className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    )
                  })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {user?.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <ThemeToggleSimple />
            <Button variant="ghost" size="icon" onClick={logout} className="h-8 w-8">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
