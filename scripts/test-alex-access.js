// Test the exact app access logic with Alex's actual roles
const userRoles = ['super_admin', 'admin', 'solebrew', 'chimpanion']

const apps = [
  {
    id: "solebrew",
    name: "SoleBrew", 
    requiredRoles: ["super_admin", "admin", "solebrew-admin", "solebrew-member"],
    isActive: true
  },
  {
    id: "chimpanion", 
    name: "Chimpanion",
    requiredRoles: ["super_admin", "admin", "chimpanion-admin", "chimpanion-member"],
    isActive: true
  },
  {
    id: "golf",
    name: "Golf App",
    requiredRoles: ["super_admin", "admin", "golf-admin", "golf-member"],
    isActive: true
  },
  {
    id: "admin",
    name: "Admin Panel",
    requiredRole: "admin",
    isActive: true
  }
]

function getAccessibleApps(userRoles) {
  return apps.filter(app => {
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

console.log('🧪 Testing Alex\'s App Access')
console.log(`User roles: [${userRoles.join(', ')}]\n`)

const accessibleApps = getAccessibleApps(userRoles)
const filteredApps = accessibleApps.filter(app => app.id !== 'admin')

console.log('✅ Apps Alex should see:')
accessibleApps.forEach(app => {
  console.log(`   - ${app.name} (${app.id})`)
  if (app.requiredRoles) {
    const hasRole = app.requiredRoles.some(role => userRoles.includes(role))
    console.log(`     Required: [${app.requiredRoles.join(', ')}]`)
    console.log(`     Has access: ${hasRole ? 'YES' : 'NO'}`)
  }
  if (app.requiredRole) {
    const hasRole = userRoles.includes(app.requiredRole) || userRoles.includes("admin") || userRoles.includes("super_admin")
    console.log(`     Required: ${app.requiredRole}`)
    console.log(`     Has access: ${hasRole ? 'YES' : 'NO'}`)
  }
  console.log('')
})

console.log(`📱 Apps for sidebar (excluding admin): ${filteredApps.length}`)
filteredApps.forEach(app => {
  console.log(`   - ${app.name}`)
})

// Test the Golf app specifically
const golfApp = apps.find(app => app.id === 'golf')
console.log('\n🏌️ Golf App Test:')
console.log(`Name: ${golfApp.name}`)
console.log(`Required roles: [${golfApp.requiredRoles.join(', ')}]`)
console.log(`User has 'super_admin': ${userRoles.includes('super_admin')}`)
console.log(`Should have access: ${golfApp.requiredRoles.some(role => userRoles.includes(role))}`)