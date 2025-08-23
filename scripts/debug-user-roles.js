const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkUserRoles() {
  console.log('🔍 Checking User Roles in Database\n')
  
  try {
    // Get all users
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('❌ Error fetching users:', error.message)
      return
    }
    
    if (!users || users.length === 0) {
      console.log('❌ No users found in database')
      return
    }
    
    console.log(`Found ${users.length} users:\n`)
    
    users.forEach(user => {
      console.log(`👤 ${user.name || 'Unnamed'} (${user.email})`)
      console.log(`   ID: ${user.id}`)
      console.log(`   Roles: ${user.roles ? user.roles.join(', ') : 'None'}`)
      console.log(`   Status: ${user.avatar?.startsWith('status:') ? user.avatar.replace('status:', '') : 'unknown'}`)
      console.log(`   Created: ${new Date(user.created_at).toLocaleDateString()}`)
      console.log('')
    })
    
    // Check specifically for alex@alexalaniz.com
    const alexUser = users.find(u => u.email === 'alex@alexalaniz.com')
    if (alexUser) {
      console.log('🎯 Alex\'s User Details:')
      console.log(`   Roles: ${alexUser.roles ? alexUser.roles.join(', ') : 'None'}`)
      console.log(`   Should see Golf App: ${alexUser.roles && (
        alexUser.roles.includes('super_admin') || 
        alexUser.roles.includes('admin') ||
        alexUser.roles.includes('golf-admin') ||
        alexUser.roles.includes('golf-member')
      ) ? 'YES ✅' : 'NO ❌'}`)
    } else {
      console.log('❌ User alex@alexalaniz.com not found in database')
    }
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message)
  }
}

checkUserRoles()