const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://uxslmztmovzuolycireg.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4c2xtenRtb3Z6dW9seWNpcmVnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDE2OTgzMCwiZXhwIjoyMDY5NzQ1ODMwfQ.qdUsy15xkBIEv36PVyxzVDNz9z9iBq9cCpyQa7zA7EY'
)

async function createAppsTable() {
  try {
    console.log('Creating apps via API...')

    // First, let's try to create the table using direct SQL
    const { data: sqlResult, error: sqlError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'apps')
      .eq('table_schema', 'public')

    console.log('Table check result:', sqlResult, sqlError)

    // Insert the actual apps directly
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

    // Try to insert using the API
    console.log('Making API call to create apps...')
    
    for (const app of apps) {
      const response = await fetch('http://localhost:3000/api/admin/apps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(app),
      })

      const result = await response.json()
      console.log(`App ${app.name}:`, result)
    }
    
  } catch (error) {
    console.error('Error:', error)
  }
}

createAppsTable()