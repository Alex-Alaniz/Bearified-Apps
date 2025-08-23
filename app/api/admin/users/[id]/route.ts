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

    // Handle human-readable slugs
    let actualUserId = userId
    
    // For Alex's account (super admin)
    if (userId === "999" || userId === "super-admin" || userId === "alex") {
      const { data: privyUser, error: privyError } = await supabase
        .from('users')
        .select('*')
        .eq('email', 'alex@alexalaniz.com')
        .single()

      if (privyUser) {
        return NextResponse.json({
          success: true,
          user: {
            id: "super-admin",
            email: privyUser.email,
            name: privyUser.name || "Alex Alaniz",
            roles: privyUser.roles || ["super_admin", "admin", "user"],
            apps: ["SoleBrew", "Chimpanion", "Admin Panel"], // Static for now
            status: "active", // Static for now
            lastLogin: "Just now",
            linkedAccounts: {
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
            id: "super-admin",
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

    // Handle different ID formats
    let query = supabase.from('users').select('*')
    
    if (userId.startsWith('phone-')) {
      // Phone user slug: phone-14076698510 (full phone number)
      const phoneDigits = userId.replace('phone-', '')
      const phoneEmail = `phone_${phoneDigits}@privy.user`
      query = query.eq('email', phoneEmail)
    } else if (userId.startsWith('wallet-')) {
      // Wallet user slug: wallet-abc123
      const firstSixChars = userId.replace('wallet-', '').toLowerCase()
      query = query.like('name', `%${firstSixChars}%`)
    } else if (userId.includes('@') && !userId.startsWith('did:privy:')) {
      // Email-based slug
      const emailPrefix = userId.replace(/-/g, '.')
      query = query.like('email', `${emailPrefix}@%`)
    } else {
      // Direct ID lookup (Privy DID or database ID)
      query = query.eq('id', userId)
    }
    
    const { data: user, error } = await query.single()

    if (error) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 })
    }

    // Extract phone and wallet from user data
    let phone = null
    let wallet = null
    let displayEmail = user.email
    
    // Check if this is a phone user
    if (user.email?.startsWith('phone_') && user.email?.endsWith('@privy.user')) {
      // Extract phone number from email format: phone_14076698510@privy.user
      const phoneDigits = user.email.replace('phone_', '').replace('@privy.user', '')
      // Format phone number nicely
      if (phoneDigits.length === 11 && phoneDigits.startsWith('1')) {
        // US phone number format
        phone = `+${phoneDigits.slice(0,1)} ${phoneDigits.slice(1,4)} ${phoneDigits.slice(4,7)} ${phoneDigits.slice(7)}`
      } else {
        phone = `+${phoneDigits}`
      }
      displayEmail = null // Phone users don't have a real email
    }
    
    // Check if this is a wallet user
    if (user.email?.startsWith('wallet_') && user.email?.endsWith('@privy.user')) {
      // Extract wallet from email format: wallet_0x1234abcd@privy.user
      wallet = user.email.replace('wallet_', '').replace('@privy.user', '')
      displayEmail = null // Wallet users don't have a real email
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        email: displayEmail,
        phone: phone,
        wallet: wallet,
        apps: ["SoleBrew", "Chimpanion", "Admin Panel"].filter(app => {
          // Filter apps based on user roles
          if (user.roles?.includes("super_admin") || user.roles?.includes("admin")) return true
          if (app === "SoleBrew" && (user.roles?.includes("solebrew") || user.roles?.includes("solebrew-admin") || user.roles?.includes("solebrew-member"))) return true
          if (app === "Chimpanion" && (user.roles?.includes("chimpanion") || user.roles?.includes("chimpanion-admin") || user.roles?.includes("chimpanion-member"))) return true
          return false
        }),
        status: user.roles?.length > 0 ? "active" : "pending",
        linkedAccounts: {
          email: displayEmail,
          phone: phone,
          wallet: wallet
        }
      }
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

    // For Alex's account (super admin)
    if (userId === "999" || userId === "super-admin" || userId === "alex") {
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
        // Update existing user (only update columns that exist)
        const { data: updatedUser, error: updateError } = await supabase
          .from('users')
          .update({
            name,
            roles,
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
          user: {
            id: "super-admin",
            email: updatedUser.email,
            name: updatedUser.name,
            roles: updatedUser.roles,
            apps: ["SoleBrew", "Chimpanion", "Admin Panel"], // Static for now
            status: "active", // Static for now
            lastLogin: "Just now",
            linkedAccounts: {
              phone: null,
              wallet: null
            }
          }
        })
      } else {
        // Create new user record for Privy user (only columns that exist)
        const { data: newUser, error: createError } = await supabase
          .from('users')
          .insert({
            id: 'super-admin-uuid', // Use a fixed ID for the super admin
            email: 'alex@alexalaniz.com',
            name,
            roles,
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
          user: {
            id: "super-admin",
            email: newUser.email,
            name: newUser.name,
            roles: newUser.roles,
            apps: ["SoleBrew", "Chimpanion", "Admin Panel"], // Static for now
            status: "active", // Static for now
            lastLogin: "Just now",
            linkedAccounts: {
              phone: null,
              wallet: null
            }
          }
        })
      }
    }

    // Handle different ID formats for updates
    let updateQuery = supabase.from('users')
      .update({
        name,
        roles,
        updated_at: new Date().toISOString()
      })
    
    if (userId.startsWith('phone-')) {
      const phoneDigits = userId.replace('phone-', '')
      const phoneEmail = `phone_${phoneDigits}@privy.user`
      updateQuery = updateQuery.eq('email', phoneEmail)
    } else if (userId.startsWith('wallet-')) {
      const firstSixChars = userId.replace('wallet-', '').toLowerCase()
      updateQuery = updateQuery.like('name', `%${firstSixChars}%`)
    } else if (userId.includes('@') && !userId.startsWith('did:privy:')) {
      const emailPrefix = userId.replace(/-/g, '.')
      updateQuery = updateQuery.like('email', `${emailPrefix}@%`)
    } else {
      updateQuery = updateQuery.eq('id', userId)
    }
    
    const { data: user, error } = await updateQuery.select().single()

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`)
    }

    return NextResponse.json({
      success: true,
      message: 'User updated successfully',
      user: {
        ...user,
        apps: ["SoleBrew", "Chimpanion", "Admin Panel"].filter(app => {
          // Filter apps based on user roles
          if (user.roles?.includes("super_admin") || user.roles?.includes("admin")) return true
          if (app === "SoleBrew" && (user.roles?.includes("solebrew") || user.roles?.includes("solebrew-admin") || user.roles?.includes("solebrew-member"))) return true
          if (app === "Chimpanion" && (user.roles?.includes("chimpanion") || user.roles?.includes("chimpanion-admin") || user.roles?.includes("chimpanion-member"))) return true
          return false
        }),
        status: user.roles?.length > 0 ? "active" : "pending",
        linkedAccounts: linkedAccounts || {
          phone: null,
          wallet: null
        }
      }
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
    if (userId === "999" || userId === "super-admin" || userId === "alex") {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete super admin user'
      }, { status: 403 })
    }

    // Handle different ID formats for deletion
    let deleteQuery = supabase.from('users').delete()
    
    if (userId.startsWith('phone-')) {
      const phoneDigits = userId.replace('phone-', '')
      const phoneEmail = `phone_${phoneDigits}@privy.user`
      deleteQuery = deleteQuery.eq('email', phoneEmail)
    } else if (userId.startsWith('wallet-')) {
      const firstSixChars = userId.replace('wallet-', '').toLowerCase()
      deleteQuery = deleteQuery.like('name', `%${firstSixChars}%`)
    } else if (userId.includes('@') && !userId.startsWith('did:privy:')) {
      const emailPrefix = userId.replace(/-/g, '.')
      deleteQuery = deleteQuery.like('email', `${emailPrefix}@%`)
    } else {
      deleteQuery = deleteQuery.eq('id', userId)
    }
    
    const { error } = await deleteQuery

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