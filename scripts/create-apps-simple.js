const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function createAppsTable() {
  try {
    console.log('Creating apps table with direct SQL...')
    
    // Create table using SQL
    const { data, error } = await supabase
      .from('_temp')
      .select('1')
      .limit(1)
    
    // Since we can't execute arbitrary SQL, let's create the table through the API POST
    // But first, we need to make sure the apps table exists
    
    console.log('Testing Supabase connection...')
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('Connection error:', testError)
      return
    }
    
    console.log('Supabase connected successfully')
    
    // Try to access the apps table directly
    const { data: appsData, error: appsError } = await supabase
      .from('apps')
      .select('*')
      .limit(1)
    
    if (appsError && appsError.code === '42P01') {
      console.log('Apps table does not exist, creating via SQL API...')
      
      // Use raw SQL to create the table
      const { data: createResult, error: createError } = await supabase.rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS apps (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            slug VARCHAR(100) UNIQUE NOT NULL,
            icon VARCHAR(100),
            color VARCHAR(100),
            status VARCHAR(50) DEFAULT 'development',
            features JSONB DEFAULT '[]',
            required_roles JSONB DEFAULT '[]',
            is_active BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `
      })
      
      if (createError) {
        console.error('Error creating table:', createError)
        console.log('Trying alternative approach...')
      } else {
        console.log('Table created successfully')
      }
    }
    
    // Now try to insert data
    const apps = [
      {
        name: 'SoleBrew',
        description: 'Coffee & Sneaker Marketplace powered by Solana SPL tokens',
        slug: 'solebrew',
        icon: 'Coffee',
        color: 'from-amber-500 to-orange-600',
        status: 'development',
        features: ['Coffee Ordering', 'Sneaker Marketplace', 'Solana Integration', '$SOLE Token', 'NFT Receipts'],
        required_roles: ['super_admin', 'admin', 'solebrew-admin', 'solebrew-member'],
        is_active: true
      },
      {
        name: 'Chimpanion',
        description: 'Blockchain AI companion app for managing crypto wallets through natural language',
        slug: 'chimpanion',
        icon: 'Bot',
        color: 'from-purple-500 to-pink-600',
        status: 'production',
        features: ['AI Wallet Management', 'Natural Language Interface', 'Multi-Chain Support', 'Portfolio Analytics'],
        required_roles: ['super_admin', 'admin', 'chimpanion-admin', 'chimpanion-member'],
        is_active: true
      }
    ]

    const { data: insertData, error: insertError } = await supabase
      .from('apps')
      .insert(apps)
      .select()

    if (insertError) {
      console.error('Error inserting apps:', insertError)
    } else {
      console.log('Apps inserted successfully:', insertData)
      console.log('Database now contains 2 apps')
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

createAppsTable()