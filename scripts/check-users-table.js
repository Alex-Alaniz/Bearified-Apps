const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkUsersTable() {
  try {
    console.log('Checking users table structure...')
    
    // Check what columns exist in the users table
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('Error querying users table:', error)
    } else {
      console.log('Users table data sample:', data)
      if (data && data[0]) {
        console.log('Available columns:', Object.keys(data[0]))
      }
    }

    // Try to get the super admin user specifically
    const { data: superUser, error: superError } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'alex@alexalaniz.com')
      .single()
    
    if (superError) {
      console.error('Error getting super admin user:', superError)
    } else {
      console.log('Super admin user:', superUser)
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

checkUsersTable()