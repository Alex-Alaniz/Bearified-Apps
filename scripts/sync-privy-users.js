const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const PRIVY_API_URL = 'https://auth.privy.io/api/v1'
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET

async function fetchPrivyUser(userId) {
  try {
    const response = await fetch(`${PRIVY_API_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`).toString('base64')}`,
        'privy-app-id': PRIVY_APP_ID,
      }
    })

    if (!response.ok) {
      console.error(`Failed to fetch Privy user ${userId}:`, await response.text())
      return null
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching Privy user ${userId}:`, error)
    return null
  }
}

async function syncPrivyUsers() {
  console.log('🔄 Starting Privy user sync...')

  // Get all users from database
  const { data: users, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching users:', error)
    return
  }

  console.log(`Found ${users.length} users in database`)

  for (const user of users) {
    // Skip if user doesn't have a Privy ID
    if (!user.id.startsWith('did:privy:')) {
      console.log(`⏭️  Skipping non-Privy user: ${user.email}`)
      continue
    }

    console.log(`\n📋 Processing user: ${user.id}`)
    console.log(`  Current data: email=${user.email}, phone=${user.phone || 'none'}`)
    
    // Fetch user details from Privy
    const privyUser = await fetchPrivyUser(user.id)
    
    if (!privyUser) {
      console.log(`❌ Could not fetch Privy user details`)
      continue
    }
    
    console.log(`  Privy response:`, JSON.stringify(privyUser, null, 2))

    // Extract user details from linked_accounts
    const updates = {}
    let hasUpdates = false
    
    // Process linked accounts
    const emailAccount = privyUser.linked_accounts?.find(acc => acc.type === 'email')
    const phoneAccount = privyUser.linked_accounts?.find(acc => acc.type === 'phone')
    const walletAccount = privyUser.linked_accounts?.find(acc => acc.type === 'wallet')

    // Check for email
    if (emailAccount && emailAccount.address) {
      if (user.email !== emailAccount.address) {
        updates.email = emailAccount.address
        updates.name = emailAccount.address.split('@')[0]
        hasUpdates = true
        console.log(`  📧 Email: ${emailAccount.address}`)
      }
    }

    // Check for phone
    if (phoneAccount && (phoneAccount.number || phoneAccount.phoneNumber)) {
      const phoneNumber = phoneAccount.number || phoneAccount.phoneNumber
      console.log(`  📱 Phone: ${phoneNumber}`)
      
      // If no email, update name and email for phone user
      if (!emailAccount) {
        updates.name = `Phone User (${phoneNumber})`
        // Fix the email to use phone format
        const phoneDigits = phoneNumber.replace(/\D/g, '')
        updates.email = `phone_${phoneDigits}@privy.user`
        hasUpdates = true
      }
    }

    // Check for wallet
    if (walletAccount && walletAccount.address) {
      console.log(`  💰 Wallet: ${walletAccount.address}`)
      
      // For wallet-only users, create appropriate name and email
      if (!emailAccount && !phoneAccount) {
        updates.email = `wallet_${walletAccount.address.slice(0, 8).toLowerCase()}@privy.user`
        if (!user.name?.startsWith('Wallet User')) {
          updates.name = `Wallet User (${walletAccount.address.slice(0, 6)}...${walletAccount.address.slice(-4)})`
          hasUpdates = true
        }
      }
      
      // Note: We'll rely on the API to extract wallet addresses from Privy data
      // instead of storing them in user names
    }

    // We don't store linked_accounts in the database schema
    // Just use the phone/email fields directly

    // Update user if there are changes
    if (hasUpdates) {
      updates.updated_at = new Date().toISOString()
      
      const { error: updateError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

      if (updateError) {
        console.error(`  ❌ Error updating user:`, updateError)
      } else {
        console.log(`  ✅ Updated user successfully`)
      }
    } else {
      console.log(`  ℹ️  No updates needed`)
    }
  }

  console.log('\n✅ Privy user sync complete!')
}

// Run the sync
syncPrivyUsers().catch(console.error)