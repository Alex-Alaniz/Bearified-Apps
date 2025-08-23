const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function addPhoneColumn() {
  try {
    console.log('Adding phone column to users table...')
    
    const { data, error } = await supabase.rpc('query', {
      query: `
        ALTER TABLE public.users 
        ADD COLUMN IF NOT EXISTS phone TEXT;
      `
    })
    
    if (error) {
      console.error('Error adding phone column:', error)
      // Try direct SQL approach
      const result = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/rpc/query`, {
        method: 'POST',
        headers: {
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone TEXT;`
        })
      })
      
      if (!result.ok) {
        console.log('Direct SQL approach also failed, phone column might already exist')
      }
    } else {
      console.log('Phone column added successfully!')
    }
    
    // Check if column exists now
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('id, email, phone')
      .limit(1)
    
    if (testError) {
      console.error('Error checking for phone column:', testError)
    } else {
      console.log('Phone column check:', testData)
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

addPhoneColumn()