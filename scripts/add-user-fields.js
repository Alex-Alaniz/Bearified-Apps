const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function addUserFields() {
  console.log('🔄 Adding phone and wallet fields to users table...')
  
  try {
    // First, let's check current table structure
    const { data: existingUsers, error: checkError } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (checkError) {
      console.error('Error checking table:', checkError)
      return
    }
    
    console.log('Current columns:', existingUsers.length > 0 ? Object.keys(existingUsers[0]) : 'No users found')
    
    // Add phone field if it doesn't exist
    const { error: phoneError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.users 
        ADD COLUMN IF NOT EXISTS phone TEXT;
      `
    }).single()
    
    if (phoneError) {
      console.log('Phone column might already exist or exec_sql not available')
    } else {
      console.log('✅ Added phone column')
    }
    
    // Add wallet field if it doesn't exist
    const { error: walletError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE public.users 
        ADD COLUMN IF NOT EXISTS wallet TEXT;
      `
    }).single()
    
    if (walletError) {
      console.log('Wallet column might already exist or exec_sql not available')
    } else {
      console.log('✅ Added wallet column')
    }
    
    // Let's create the columns using a different approach if exec_sql doesn't work
    // We'll update a user with phone/wallet to force column creation
    const testUser = {
      id: 'test_column_creation_' + Date.now(),
      email: 'test@column.creation',
      name: 'Test User',
      phone: '+1234567890',
      wallet: '0x0000000000000000000000000000000000000000',
      roles: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    const { error: insertError } = await supabase
      .from('users')
      .insert(testUser)
    
    if (insertError) {
      console.log('Could not create test user:', insertError.message)
      console.log('Phone and wallet columns might need to be added manually via Supabase dashboard')
    } else {
      // Clean up test user
      await supabase
        .from('users')
        .delete()
        .eq('id', testUser.id)
      console.log('✅ Successfully verified phone and wallet columns')
    }
    
    // Check final structure
    const { data: finalCheck } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (finalCheck && finalCheck.length > 0) {
      console.log('Final columns:', Object.keys(finalCheck[0]))
    }
    
  } catch (error) {
    console.error('Error adding fields:', error)
  }
}

addUserFields()