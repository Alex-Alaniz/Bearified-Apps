export interface AppConfig {
  id: string
  name: string
  description: string
  icon: string
  color: string
  href: string
  requiredRole?: "super_admin" | "admin" | "user"
  requiredRoles?: string[]
  features: string[]
  status: "production" | "development" | "beta"
  isActive: boolean
}

export const APP_CONFIGS: AppConfig[] = [
  {
    id: "solebrew",
    name: "SoleBrew",
    description: "Coffee & Sneaker Marketplace powered by Solana SPL tokens",
    icon: "Coffee",
    color: "from-amber-500 to-orange-600",
    href: "/dashboard/solebrew",
    requiredRoles: ["super_admin", "admin", "solebrew-admin", "solebrew-member"],
    features: ["Coffee Ordering", "Sneaker Marketplace", "Solana Integration", "$SOLE Token", "NFT Receipts"],
    status: "development",
    isActive: true,
  },
  {
    id: "chimpanion",
    name: "Chimpanion",
    description: "Blockchain AI companion app for managing crypto wallets through natural language",
    icon: "Bot",
    color: "from-purple-500 to-pink-600",
    href: "/dashboard/chimpanion",
    requiredRoles: ["super_admin", "admin", "chimpanion-admin", "chimpanion-member"],
    features: ["AI Wallet Management", "Natural Language Interface", "Multi-Chain Support", "Portfolio Analytics"],
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
  return APP_CONFIGS.filter(app => {
    if (!app.isActive) return false
    
    // Check old requiredRole field for backwards compatibility
    if (app.requiredRole) {
      return userRoles.includes(app.requiredRole) || 
             userRoles.includes("admin") || 
             userRoles.includes("super_admin")
    }
    
    // Check new requiredRoles array
    if (app.requiredRoles && app.requiredRoles.length > 0) {
      return app.requiredRoles.some(role => userRoles.includes(role))
    }
    
    // If no roles specified, app is accessible to all
    return true
  })
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