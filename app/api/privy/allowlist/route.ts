import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const PRIVY_API_URL = 'https://auth.privy.io/api/v1'
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID!
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET!

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface AllowlistEntry {
  type: 'email' | 'phone_number' | 'wallet_address'
  value: string
  app_id: string
}

export async function GET() {
  try {
    // Fetch allowlist from Privy
    const privyResponse = await fetch(`${PRIVY_API_URL}/apps/${PRIVY_APP_ID}/allowlist`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`).toString('base64')}`,
        'privy-app-id': PRIVY_APP_ID,
      }
    })

    if (!privyResponse.ok) {
      const errorText = await privyResponse.text()
      console.error('Failed to fetch Privy allowlist:', errorText)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch allowlist from Privy'
      }, { status: 500 })
    }

    const allowlist: AllowlistEntry[] = await privyResponse.json()
    console.log(`Fetched ${allowlist.length} entries from Privy allowlist`)

    // Sync with our database
    const syncResults = {
      total: allowlist.length,
      synced: 0,
      created: 0,
      updated: 0,
      errors: 0
    }

    for (const entry of allowlist) {
      try {
        // Determine email based on entry type
        let email: string
        let name: string
        
        if (entry.type === 'email') {
          email = entry.value
          name = entry.value.split('@')[0]
        } else if (entry.type === 'phone_number') {
          // For phone numbers, create a placeholder email
          email = `phone_${entry.value.replace(/\D/g, '')}@privy.user`
          name = `Phone User (${entry.value})`
        } else if (entry.type === 'wallet_address') {
          // For wallets, create a placeholder email
          email = `wallet_${entry.value.slice(0, 8).toLowerCase()}@privy.user`
          name = `Wallet User (${entry.value.slice(0, 6)}...${entry.value.slice(-4)})`
        } else {
          continue // Skip unknown types
        }

        // Check if user already exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single()

        if (!existingUser) {
          // Create new user from allowlist
          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert({
              id: `privy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              email,
              name,
              roles: [], // No roles by default - admin must grant access
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single()

          if (createError) {
            console.error(`Error creating user for ${email}:`, createError)
            syncResults.errors++
          } else {
            console.log(`Created new user: ${email}`)
            syncResults.created++
            syncResults.synced++
          }
        } else {
          // User already exists
          syncResults.synced++
          
          // Update name if it's still a placeholder
          if (existingUser.name.startsWith('Phone User') || existingUser.name.startsWith('Wallet User')) {
            const { error: updateError } = await supabase
              .from('users')
              .update({
                name: entry.type === 'email' ? entry.value.split('@')[0] : existingUser.name,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingUser.id)

            if (!updateError) {
              syncResults.updated++
            }
          }
        }
      } catch (error) {
        console.error(`Error syncing allowlist entry ${entry.value}:`, error)
        syncResults.errors++
      }
    }

    // Get all users from database to show full list
    const { data: allUsers, error: fetchError } = await supabase
      .from('users')
      .select('id, email, name, roles, created_at')
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching users:', fetchError)
    }

    return NextResponse.json({
      success: true,
      allowlist,
      syncResults,
      users: allUsers || [],
      message: `Synced ${syncResults.synced} of ${syncResults.total} allowlist entries`
    })

  } catch (error) {
    console.error('Allowlist sync error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to sync allowlist'
    }, { status: 500 })
  }
}

// Add user to Privy allowlist
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, value } = body // type: 'email' | 'phone_number' | 'wallet_address'

    // Add to Privy allowlist
    const privyResponse = await fetch(`${PRIVY_API_URL}/apps/${PRIVY_APP_ID}/allowlist`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`).toString('base64')}`,
        'privy-app-id': PRIVY_APP_ID,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type,
        value
      })
    })

    if (!privyResponse.ok) {
      const errorText = await privyResponse.text()
      console.error('Failed to add to Privy allowlist:', errorText)
      return NextResponse.json({
        success: false,
        error: 'Failed to add to allowlist'
      }, { status: 400 })
    }

    // Also create user in our database
    let email: string
    let name: string
    
    if (type === 'email') {
      email = value
      name = value.split('@')[0]
    } else if (type === 'phone_number') {
      email = `phone_${value.replace(/\D/g, '')}@privy.user`
      name = `Phone User (${value})`
    } else {
      email = `wallet_${value.slice(0, 8).toLowerCase()}@privy.user`
      name = `Wallet User (${value.slice(0, 6)}...${value.slice(-4)})`
    }

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        id: `privy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        name,
        roles: [], // No roles by default
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createError && !createError.message.includes('duplicate')) {
      console.error('Error creating user:', createError)
    }

    return NextResponse.json({
      success: true,
      message: 'Added to allowlist and created user',
      user: newUser
    })

  } catch (error) {
    console.error('Add to allowlist error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add to allowlist'
    }, { status: 500 })
  }
}