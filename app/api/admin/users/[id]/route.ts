import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { fetchPrivyUser } from '@/lib/privy-server'

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
    console.log('GET user request for ID:', userId)

    // Handle human-readable slugs
    let actualUserId = userId
    
    // For Alex's account (super admin) - but only for old IDs, not the new slug
    if (userId === "999" || userId === "super-admin") {
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
            apps: ["SoleBrew", "Chimpanion", "Golf App", "Admin Panel"], // Static for now
            status: "active",
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
            apps: ["SoleBrew", "Chimpanion", "Golf App", "Admin Panel"],
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
    } else if (!userId.startsWith('did:privy:') && !userId.includes('-')) {
      // Simple username slug like "alex" -> alex@alexalaniz.com
      query = query.like('email', `${userId}@%`)
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

    // Get real-time data from Privy for users with Privy IDs
    let phone = null
    let wallet = null
    let displayEmail = user.email
    
    if (user.id.startsWith('did:privy:')) {
      const privyData = await fetchPrivyUser(user.id)
      if (privyData) {
        phone = privyData.phone
        wallet = privyData.wallet
        // Use real email from Privy if available, otherwise use our stored email
        if (privyData.email) {
          displayEmail = privyData.email
        }
      }
    }
    
    // Fallback: Extract from our stored email format if Privy data not available
    if (!phone && user.email?.startsWith('phone_') && user.email?.endsWith('@privy.user')) {
      const phoneDigits = user.email.replace('phone_', '').replace('@privy.user', '')
      if (phoneDigits.length === 11 && phoneDigits.startsWith('1')) {
        phone = `+${phoneDigits.slice(0,1)} ${phoneDigits.slice(1,4)} ${phoneDigits.slice(4,7)} ${phoneDigits.slice(7)}`
      } else {
        phone = `+${phoneDigits}`
      }
      displayEmail = null
    }
    
    if (!wallet && user.email?.startsWith('wallet_') && user.email?.endsWith('@privy.user')) {
      wallet = user.email.replace('wallet_', '').replace('@privy.user', '')
      displayEmail = null
    }

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        email: displayEmail,
        phone: phone,
        wallet: wallet,
        apps: ["SoleBrew", "Chimpanion", "Golf App", "Admin Panel"].filter(app => {
          // Filter apps based on user roles
          if (user.roles?.includes("super_admin") || user.roles?.includes("admin")) return true
          if (app === "SoleBrew" && (user.roles?.includes("solebrew") || user.roles?.includes("solebrew-admin") || user.roles?.includes("solebrew-member"))) return true
          if (app === "Chimpanion" && (user.roles?.includes("chimpanion") || user.roles?.includes("chimpanion-admin") || user.roles?.includes("chimpanion-member"))) return true
          if (app === "Golf App" && (user.roles?.includes("golf") || user.roles?.includes("golf-admin") || user.roles?.includes("golf-member"))) return true
          return false
        }),
        // Check if status is stored in avatar field (workaround for missing status column)
        status: user.avatar?.startsWith('status:') ? user.avatar.replace('status:', '') : (user.roles?.includes('super_admin') || user.roles?.includes('admin') ? "active" : (user.roles?.length > 0 ? "active" : "pending")),
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
    
    // Map apps to their corresponding roles
    let finalRoles = roles || []
    
    // Auto-activate users with admin or super_admin roles
    let finalStatus = status
    if ((finalRoles.includes('super_admin') || finalRoles.includes('admin')) && (!status || status === 'pending')) {
      finalStatus = 'active'
    }
    
    // Handle app-based role assignments
    if (apps && Array.isArray(apps)) {
      // Remove all app-specific roles first
      finalRoles = finalRoles.filter(role => 
        !['solebrew', 'solebrew-admin', 'solebrew-member', 
          'chimpanion', 'chimpanion-admin', 'chimpanion-member',
          'golf', 'golf-admin', 'golf-member'].includes(role)
      )
      
      // Add back roles based on selected apps
      if (apps.includes('SoleBrew')) {
        // If user is admin, give them admin role for the app, otherwise member
        if (finalRoles.includes('admin') || finalRoles.includes('super_admin')) {
          finalRoles.push('solebrew-admin')
        } else {
          finalRoles.push('solebrew-member')
        }
      }
      
      if (apps.includes('Chimpanion')) {
        if (finalRoles.includes('admin') || finalRoles.includes('super_admin')) {
          finalRoles.push('chimpanion-admin')
        } else {
          finalRoles.push('chimpanion-member')
        }
      }
      
      if (apps.includes('Golf App') || apps.includes('Golf')) {
        if (finalRoles.includes('admin') || finalRoles.includes('super_admin')) {
          finalRoles.push('golf-admin')
        } else {
          finalRoles.push('golf-member')
        }
      }
      
      // Admin Panel requires admin or super_admin role
      if (apps.includes('Admin Panel') && !finalRoles.includes('admin') && !finalRoles.includes('super_admin')) {
        finalRoles.push('admin')
      }
    }
    
    // Re-check for auto-activation after app-based role assignments
    if ((finalRoles.includes('super_admin') || finalRoles.includes('admin')) && (!finalStatus || finalStatus === 'pending')) {
      finalStatus = 'active'
    }

    // For Alex's account (super admin)
    if (userId === "999" || userId === "super-admin" || userId === "alex") {
      console.log('Updating Privy user:', {
        userId,
        name,
        roles: finalRoles,
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
            roles: finalRoles,
            // Store status in avatar field as workaround for missing status column
            avatar: finalStatus ? `status:${finalStatus}` : existingUser.avatar,
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
            apps: apps || ["SoleBrew", "Chimpanion", "Golf App", "Admin Panel"].filter(app => {
              // Filter apps based on updated roles
              if (updatedUser.roles?.includes("super_admin") || updatedUser.roles?.includes("admin")) return true
              if (app === "SoleBrew" && (updatedUser.roles?.includes("solebrew") || updatedUser.roles?.includes("solebrew-admin") || updatedUser.roles?.includes("solebrew-member"))) return true
              if (app === "Chimpanion" && (updatedUser.roles?.includes("chimpanion") || updatedUser.roles?.includes("chimpanion-admin") || updatedUser.roles?.includes("chimpanion-member"))) return true
              if (app === "Golf App" && (updatedUser.roles?.includes("golf") || updatedUser.roles?.includes("golf-admin") || updatedUser.roles?.includes("golf-member"))) return true
              return false
            }),
            status: finalStatus || "active",
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
            roles: finalRoles,
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
            apps: apps || ["SoleBrew", "Chimpanion", "Golf App", "Admin Panel"].filter(app => {
              // Filter apps based on updated roles
              if (newUser.roles?.includes("super_admin") || newUser.roles?.includes("admin")) return true
              if (app === "SoleBrew" && (newUser.roles?.includes("solebrew") || newUser.roles?.includes("solebrew-admin") || newUser.roles?.includes("solebrew-member"))) return true
              if (app === "Chimpanion" && (newUser.roles?.includes("chimpanion") || newUser.roles?.includes("chimpanion-admin") || newUser.roles?.includes("chimpanion-member"))) return true
              if (app === "Golf App" && (newUser.roles?.includes("golf") || newUser.roles?.includes("golf-admin") || newUser.roles?.includes("golf-member"))) return true
              return false
            }),
            status: finalStatus || "active",
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
        roles: finalRoles,
        // Store status in avatar field as workaround for missing status column
        avatar: finalStatus ? `status:${finalStatus}` : null,
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
    } else if (!userId.startsWith('did:privy:') && !userId.includes('-')) {
      // Simple username slug like "alex" -> alex@alexalaniz.com
      updateQuery = updateQuery.like('email', `${userId}@%`)
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
        apps: apps || ["SoleBrew", "Chimpanion", "Golf App", "Admin Panel"].filter(app => {
          // Filter apps based on user roles
          if (user.roles?.includes("super_admin") || user.roles?.includes("admin")) return true
          if (app === "SoleBrew" && (user.roles?.includes("solebrew") || user.roles?.includes("solebrew-admin") || user.roles?.includes("solebrew-member"))) return true
          if (app === "Chimpanion" && (user.roles?.includes("chimpanion") || user.roles?.includes("chimpanion-admin") || user.roles?.includes("chimpanion-member"))) return true
          if (app === "Golf App" && (user.roles?.includes("golf") || user.roles?.includes("golf-admin") || user.roles?.includes("golf-member"))) return true
          return false
        }),
        // Use stored status from avatar field, or compute from roles
        status: user.avatar?.startsWith('status:') ? user.avatar.replace('status:', '') : (user.roles?.includes('super_admin') || user.roles?.includes('admin') ? "active" : (user.roles?.length > 0 ? "active" : "pending")),
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
    } else if (!userId.startsWith('did:privy:') && !userId.includes('-')) {
      // Simple username slug like "alex" -> alex@alexalaniz.com
      deleteQuery = deleteQuery.like('email', `${userId}@%`)
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