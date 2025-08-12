import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    // For Privy user, fetch from Supabase by email
    if (userId === "999") {
      const { data: privyUser, error: privyError } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'alex@alexalaniz.com')
        .single()

      if (privyUser) {
        return NextResponse.json({
          success: true,
          user: {
            id: "999",
            email: privyUser.email,
            name: privyUser.name || "Alex Alaniz",
            roles: privyUser.roles || ["super_admin", "admin", "user"],
            apps: privyUser.apps || ["SoleBrew", "Chimpanion", "Admin Panel"],
            status: privyUser.status || "active",
            lastLogin: "Just now",
            linkedAccounts: privyUser.linked_accounts || {
              phone: null,
              wallet: null
            }
          }
        })
      } else {
        // Return default data for new Privy user
        return NextResponse.json({
          success: true,
          user: {
            id: "999",
            email: "alex@alexalaniz.com",
            name: "Alex Alaniz",
            roles: ["super_admin", "admin", "user"],
            apps: ["SoleBrew", "Chimpanion", "Admin Panel"],
            status: "active",
            lastLogin: "Just now",
            linkedAccounts: {
              phone: null,
              wallet: null
            }
          }
        })
      }
    }

    // In production, fetch from Supabase users table
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user
    })

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch user'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id
    const body = await request.json()
    const { name, roles, apps, status, linkedAccounts } = body

    // For Privy users, we need to handle account linking differently
    if (userId === "999") {
      console.log('Updating Privy user:', {
        userId,
        name,
        roles,
        apps,
        status,
        linkedAccounts
      })

      // First, check if user exists in Supabase
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'alex@alexalaniz.com')
        .single()

      if (existingUser) {
        // Update existing user
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            name,
            roles,
            apps,
            status,
            linked_accounts: linkedAccounts,
            updated_at: new Date().toISOString()
          })
          .eq('email', 'alex@alexalaniz.com')
          .select()
          .single()

        if (updateError) {
          console.error('Error updating Privy user:', updateError)
          throw new Error(`Failed to update user: ${updateError.message}`)
        }

        return NextResponse.json({
          success: true,
          message: 'User updated successfully',
          user: updatedUser
        })
      } else {
        // Create new user record for Privy user
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            email: 'alex@alexalaniz.com',
            name,
            roles,
            apps,
            status,
            linked_accounts: linkedAccounts,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (createError) {
          console.error('Error creating Privy user record:', createError)
          throw new Error(`Failed to create user record: ${createError.message}`)
        }

        return NextResponse.json({
          success: true,
          message: 'User created and updated successfully',
          user: newUser
        })
      }
    }

    // Update user in Supabase
    const { data: user, error } = await supabase
      .from('users')
      .update({
        name,
        roles,
        apps,
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user
    })

  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update user'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id

    // Prevent deleting the super admin user
    if (userId === "999") {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete super admin user'
      }, { status: 403 })
    }

    // Delete user from Supabase
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)

    if (error) {
      throw new Error(`Failed to delete user: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })

  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete user'
    }, { status: 500 })
  }
}