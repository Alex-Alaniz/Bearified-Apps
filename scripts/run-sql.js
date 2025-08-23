const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function runSQL() {
  try {
    console.log('Adding linked_accounts column...')
    
    // Add linked_accounts column
    const { data, error } = await supabase
      .from('users')
      .select('email, linked_accounts, status')
      .eq('email', 'alex@alexalaniz.com')
      .single()
    
    if (error) {
      console.error('Error checking user:', error)
    } else {
      console.log('Current user data:', data)
    }

    // Update the user record to include linked accounts if missing
    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({
        linked_accounts: { phone: null, wallet: null },
        status: 'active'
      })
      .eq('email', 'alex@alexalaniz.com')
      .select()

    if (updateError) {
      console.error('Error updating user:', updateError)
    } else {
      console.log('User updated successfully:', updateData)
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

runSQL()