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

    // For now, handle the special case of the current Privy user (ID: 999)
    if (userId === "999") {
      return NextResponse.json({
        success: true,
        user: {
          id: "999",
          email: "alex@alexalaniz.com", // This would come from Privy in production
          name: "Alex Alaniz",
          roles: ["super_admin", "admin", "user"],
          apps: ["SoleBrew", "Chimpanion", "Admin Panel"],
          status: "active",
          linkedAccounts: {
            phone: null,
            wallet: null
          }
        }
      })
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
      // In production, you would:
      // 1. Update user profile in Supabase
      // 2. Handle Privy account linking for phone/wallet
      
      console.log('Updating Privy user:', {
        userId,
        name,
        roles,
        apps,
        status,
        linkedAccounts
      })

      // Handle phone linking with Privy
      if (linkedAccounts?.phone) {
        console.log('Would link phone via Privy API:', linkedAccounts.phone)
        // await privyClient.linkPhone(userId, linkedAccounts.phone)
      }

      // Handle wallet linking with Privy
      if (linkedAccounts?.wallet) {
        console.log('Would link wallet via Privy API:', linkedAccounts.wallet)
        // await privyClient.linkWallet(userId, linkedAccounts.wallet)
      }

      return NextResponse.json({
        success: true,
        message: 'User updated successfully',
        user: {
          id: userId,
          name,
          roles,
          apps,
          status,
          linkedAccounts
        }
      })
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