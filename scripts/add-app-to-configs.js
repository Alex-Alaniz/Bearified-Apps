const fs = require('fs')
const path = require('path')

// Read command line arguments
const appData = JSON.parse(process.argv[2] || '{}')

if (!appData.name || !appData.id || !appData.description) {
  console.error('❌ Missing required app data: name, id, description')
  process.exit(1)
}

console.log('📝 Adding app to APP_CONFIGS:', appData.name)

// Path to the app configs file
const configPath = path.join(__dirname, '..', 'lib', 'app-configs.ts')

try {
  // Read the current file
  const currentContent = fs.readFileSync(configPath, 'utf8')
  
  // Create the new app configuration
  const newAppConfig = `  {
    id: "${appData.id}",
    name: "${appData.name}",
    description: "${appData.description}",
    icon: "${appData.icon || 'Package'}",
    color: "${appData.color || 'from-blue-500 to-purple-600'}",
    href: "/dashboard/${appData.id}",
    requiredRoles: ["super_admin", "admin", "${appData.id}-admin", "${appData.id}-member"],
    features: ${JSON.stringify(appData.features || [])},
    status: "${appData.status || 'development'}",
    isActive: true,
  },`

  // Find the position to insert the new app (before the last closing bracket and comma of the array)
  const arrayEndPattern = /,\s*\n\s*\]/
  const match = arrayEndPattern.exec(currentContent)
  
  if (!match) {
    throw new Error('Could not find proper APP_CONFIGS array ending pattern')
  }
  
  const insertPosition = match.index + 1 // After the comma
  
  // Insert the new app configuration
  const updatedContent = currentContent.slice(0, insertPosition) + '\n' + newAppConfig + currentContent.slice(insertPosition)
  
  // Write the updated file
  fs.writeFileSync(configPath, updatedContent, 'utf8')
  
  console.log('✅ Successfully added app to APP_CONFIGS')
  console.log('🔄 Please restart the development server to see the new app')
  
} catch (error) {
  console.error('❌ Error adding app to configs:', error.message)
  process.exit(1)
}