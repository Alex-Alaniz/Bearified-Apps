export interface AppConfig {
  id: string
  name: string
  description: string
  icon: string
  color: string
  href: string
  requiredRole?: "super_admin" | "admin" | "user"
  features: string[]
  status: "production" | "development" | "beta"
  isActive: boolean
}

export const APP_CONFIGS: AppConfig[] = [
  {
    id: "solebrew",
    name: "SoleBrew",
    description: "Coffee shop management system with inventory, sales, and analytics",
    icon: "Coffee",
    color: "from-amber-500 to-orange-600",
    href: "/dashboard/solebrew",
    features: ["Inventory Management", "Sales Analytics", "Customer Insights", "Franchise Portal"],
    status: "development",
    isActive: true,
  },
  {
    id: "chimpanion",
    name: "Chimpanion",
    description: "Security and business intelligence platform for comprehensive monitoring",
    icon: "Shield",
    color: "from-green-500 to-teal-600",
    href: "/dashboard/chimpanion",
    features: ["Security Monitoring", "Business Intelligence", "Real-time Analytics", "Threat Detection"],
    status: "production",
    isActive: true,
  },
  {
    id: "admin",
    name: "Admin Panel",
    description: "System administration and user management",
    icon: "Settings",
    color: "from-purple-500 to-blue-600",
    href: "/admin",
    requiredRole: "admin",
    features: ["User Management", "App Configuration", "System Settings", "Audit Logs"],
    status: "production",
    isActive: true,
  },
]

// Helper functions for role-based access
export function getAccessibleApps(userRoles: string[]): AppConfig[] {
  return APP_CONFIGS.filter(app => 
    app.isActive && 
    (!app.requiredRole || userRoles.includes(app.requiredRole) || userRoles.includes("admin"))
  )
}

export function getAccessibleAdminApps(userRoles: string[]): AppConfig[] {
  return APP_CONFIGS.filter(app => 
    app.isActive && 
    app.requiredRole === "admin" && 
    (userRoles.includes("admin") || userRoles.includes("super_admin"))
  )
}

export function getStatusBadgeColor(status: AppConfig['status']): string {
  switch (status) {
    case 'production': return 'bg-green-100 text-green-700 border-green-200'
    case 'development': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'beta': return 'bg-blue-100 text-blue-700 border-blue-200'
    default: return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}