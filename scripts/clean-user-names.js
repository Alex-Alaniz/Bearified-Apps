const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function cleanUserNames() {
  console.log('🧹 Cleaning up user names by removing wallet addresses...')
  
  try {
    // Get all users
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) {
      console.error('Error fetching users:', error)
      return
    }
    
    console.log(`Found ${users.length} users to process`)
    
    for (const user of users) {
      let needsUpdate = false
      const updates = {}
      
      // Check if name contains a wallet address [0x...]
      const walletMatch = user.name?.match(/\s*\[0x[a-fA-F0-9]{40}\]/)
      if (walletMatch) {
        // Remove wallet address from name
        const cleanName = user.name.replace(/\s*\[0x[a-fA-F0-9]{40}\]/, '').trim()
        updates.name = cleanName
        needsUpdate = true
        
        console.log(`🔧 Cleaning name for ${user.id}:`)
        console.log(`  Before: ${user.name}`)
        console.log(`  After:  ${cleanName}`)
      }
      
      // Update user if needed
      if (needsUpdate) {
        updates.updated_at = new Date().toISOString()
        
        const { error: updateError } = await supabase
          .from('users')
          .update(updates)
          .eq('id', user.id)
        
        if (updateError) {
          console.error(`❌ Error updating user ${user.id}:`, updateError)
        } else {
          console.log(`✅ Updated user ${user.id}`)
        }
      }
    }
    
    console.log('\n✅ User name cleanup complete!')
    
    // Show final user names
    const { data: cleanUsers } = await supabase
      .from('users')
      .select('id, name, email')
      .order('created_at')
    
    console.log('\nFinal user names:')
    for (const user of cleanUsers || []) {
      console.log(`- ${user.name} (${user.email})`)
    }
    
  } catch (error) {
    console.error('Error cleaning user names:', error)
  }
}

cleanUserNames()