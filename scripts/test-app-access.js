const fs = require('fs')
const path = require('path')

// Read the APP_CONFIGS
const configPath = path.join(__dirname, '..', 'lib', 'app-configs.ts')
const content = fs.readFileSync(configPath, 'utf8')

console.log('🔍 Testing App Access for Different User Roles\n')

// Mock users for testing
const testUsers = [
  { name: 'Super Admin', roles: ['super_admin'] },
  { name: 'Admin', roles: ['admin'] },
  { name: 'Golf Member', roles: ['golf-member'] },
  { name: 'Regular User', roles: ['user'] },
]

// Extract APP_CONFIGS from the file (simple regex approach)
const configMatch = content.match(/export const APP_CONFIGS.*?=\s*(\[[\s\S]*?\])/m)
if (!configMatch) {
  console.error('❌ Could not find APP_CONFIGS in the file')
  process.exit(1)
}

// This is a simplified version for testing
const apps = [
  { id: 'solebrew', name: 'SoleBrew', requiredRoles: ['super_admin', 'admin', 'solebrew-admin', 'solebrew-member'] },
  { id: 'chimpanion', name: 'Chimpanion', requiredRoles: ['super_admin', 'admin', 'chimpanion-admin', 'chimpanion-member'] },
  { id: 'golf', name: 'Golf App', requiredRoles: ['super_admin', 'admin', 'golf-admin', 'golf-member'] },
  { id: 'admin', name: 'Admin Panel', requiredRole: 'admin' },
]

function getAccessibleApps(userRoles) {
  return apps.filter(app => {
    // Check old requiredRole field for backwards compatibility
    if (app.requiredRole) {
      return userRoles.includes(app.requiredRole) || 
             userRoles.includes('admin') || 
             userRoles.includes('super_admin')
    }
    
    // Check new requiredRoles array
    if (app.requiredRoles && app.requiredRoles.length > 0) {
      return app.requiredRoles.some(role => userRoles.includes(role))
    }
    
    // If no roles specified, app is accessible to all
    return true
  }).filter(app => app.id !== 'admin') // Filter out admin from regular apps
}

testUsers.forEach(user => {
  console.log(`👤 ${user.name} (${user.roles.join(', ')}):`);
  const accessibleApps = getAccessibleApps(user.roles)
  if (accessibleApps.length === 0) {
    console.log('   ❌ No apps accessible')
  } else {
    accessibleApps.forEach(app => {
      console.log(`   ✅ ${app.name}`)
    })
  }
  console.log('')
})

console.log('📋 Summary:')
console.log('- Super admins should see: SoleBrew, Chimpanion, Golf App')
console.log('- Golf app requires: super_admin, admin, golf-admin, or golf-member roles')
console.log('- Check your user roles in the browser console or user management page')