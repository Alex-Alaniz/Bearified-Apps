import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Get all users from the database
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({
        success: false,
        users: [],
        error: error.message
      })
    }

    // Transform users to include computed status
    const transformedUsers = (users || []).map(user => ({
      ...user,
      // Compute status same way as individual user page
      status: user.avatar?.startsWith('status:') ? user.avatar.replace('status:', '') : (user.roles?.length > 0 ? 'active' : 'pending')
    }))

    return NextResponse.json({
      success: true,
      users: transformedUsers
    })

  } catch (error) {
    console.error('Users fetch error:', error)
    return NextResponse.json({
      success: false,
      users: [],
      error: error instanceof Error ? error.message : 'Failed to fetch users'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, roles, apps, status } = body

    if (!email || !name) {
      return NextResponse.json({
        success: false,
        error: 'Email and name are required'
      }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User with this email already exists'
      }, { status: 409 })
    }

    // Create new user in database
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({
        email,
        name,
        roles: roles || ['user'],
        apps: apps || [],
        status: status || 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) {
      throw new Error(`Failed to create user: ${createError.message}`)
    }

    // In production, you would:
    // 1. Send invitation email via your email service
    // 2. Add user to Privy allowlist via Privy API
    // 3. Create any necessary related records
    
    console.log('User created:', newUser)
    console.log('Would send invitation email to:', email)
    console.log('Would add to Privy allowlist:', email)

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: newUser
    })

  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create user'
    }, { status: 500 })
  }
}