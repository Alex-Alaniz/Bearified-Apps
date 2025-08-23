import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { privyId, email, phone } = body

    console.log('Auth user lookup:', { privyId, email, phone })

    // First try to find user by Privy ID
    let user = null
    
    if (privyId) {
      const { data: privyUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', privyId)
        .single()
      
      if (privyUser) {
        user = privyUser
      }
    }

    // If not found by Privy ID, try by email
    if (!user && email) {
      const { data: emailUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
      
      if (emailUser) {
        user = emailUser
      }
    }
    
    // If not found by email and phone provided, try by phone
    if (!user && phone) {
      const phoneDigits = phone.replace(/\D/g, '')
      const phoneEmail = `phone_${phoneDigits}@privy.user`
      
      const { data: phoneUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', phoneEmail)
        .single()
      
      if (phoneUser) {
        user = phoneUser
      }
    }

    // If user exists, return their data
    if (user) {
      // Update Privy ID and phone if different (user might have been pre-created from allowlist)
      if ((user.id !== privyId && privyId) || (phone && !user.phone)) {
        const updates: any = {
          last_login_at: new Date().toISOString()
        }
        
        if (user.id !== privyId && privyId) {
          updates.id = privyId
        }
        
        if (phone && !user.phone) {
          updates.phone = phone
        }
        
        await supabase
          .from('users')
          .update(updates)
          .eq('id', user.id)
      }
      
      return NextResponse.json({
        success: true,
        user: {
          id: privyId || user.id,
          email: user.email,
          name: user.name,
          roles: user.roles || [],
          apps: [], // Apps derived from roles
          status: 'active'
        }
      })
    }

    // User not found in database - create new user with NO ACCESS
    // Only alex@alexalaniz.com gets super_admin on first login
    const isAlex = email === 'alex@alexalaniz.com'
    
    // Generate appropriate email for different auth methods
    let userEmail = email
    if (!email && phone) {
      // For phone users, create a consistent email format
      const phoneDigits = phone.replace(/\D/g, '')
      userEmail = `phone_${phoneDigits}@privy.user`
    } else if (!email && !phone) {
      // Wallet user
      userEmail = privyId
    }
    
    const newUser = {
      id: privyId,
      email: userEmail,
      name: email?.split('@')[0] || (phone ? `Phone User (${phone})` : 'User'),
      phone: phone || null,
      roles: isAlex ? ['super_admin', 'admin', 'solebrew', 'chimpanion'] : [], // Empty roles = no access
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      last_login_at: new Date().toISOString()
    }

    const { data: createdUser, error: createError } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single()

    if (createError) {
      console.error('Error creating user:', createError)
      // Return minimal access if we can't create in DB
      return NextResponse.json({
        success: false,
        user: {
          id: privyId,
          email: email || `phone_${phone}@privy.user`,
          name: email?.split('@')[0] || phone || 'User',
          roles: [], // No roles
          apps: [], // No apps
          status: 'pending'
        }
      })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        name: createdUser.name,
        roles: createdUser.roles || [],
        apps: [], // Apps derived from roles
        status: 'active'
      },
      created: true
    })

  } catch (error) {
    console.error('Auth user lookup error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user',
      user: null
    }, { status: 500 })
  }
}