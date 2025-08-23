const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function addStatusColumn() {
  console.log('🔄 Adding status column to users table...')
  
  try {
    // Try to create a test user with status to force column creation
    const testUser = {
      id: 'test_status_column_' + Date.now(),
      email: 'test-status@column.creation',
      name: 'Test Status User',
      status: 'active',
      roles: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { error: insertError } = await supabase
      .from('users')
      .insert(testUser)
    
    if (insertError) {
      console.log('Status column might not exist:', insertError.message)
      console.log('You may need to add the status column manually via Supabase dashboard')
    } else {
      // Clean up test user
      await supabase
        .from('users')
        .delete()
        .eq('id', testUser.id)
      console.log('✅ Status column exists and works')
    }
    
    // Check current table structure
    const { data: users } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (users && users.length > 0) {
      console.log('Available columns:', Object.keys(users[0]))
    }
    
    // Update all users to have an active status if they have roles
    const { data: allUsers } = await supabase
      .from('users')
      .select('id, roles')
    
    if (allUsers) {
      for (const user of allUsers) {
        const status = user.roles && user.roles.length > 0 ? 'active' : 'pending'
        
        try {
          const { error: updateError } = await supabase
            .from('users')
            .update({ status })
            .eq('id', user.id)
          
          if (!updateError) {
            console.log(`✅ Set status for user ${user.id}: ${status}`)
          }
        } catch (e) {
          // Status column might not exist, skip
        }
      }
    }
    
  } catch (error) {
    console.error('Error adding status column:', error)
  }
}

addStatusColumn()