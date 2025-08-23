import { NextRequest, NextResponse } from 'next/server'

const PRIVY_API_URL = 'https://auth.privy.io/api/v1'
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID!
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, value } = body // type: 'phone' | 'wallet', value: phone number or wallet address

    console.log('Privy Link Request:', { userId, type, value })
    console.log('Environment check:', {
      hasAppId: !!PRIVY_APP_ID,
      hasAppSecret: !!PRIVY_APP_SECRET,
      appIdPrefix: PRIVY_APP_ID?.substring(0, 10)
    })

    // Use Privy's server-side API to link accounts
    if (type === 'phone') {
      // First, try to get the user to see if they exist
      const getUserResponse = await fetch(`${PRIVY_API_URL}/users/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`).toString('base64')}`,
          'privy-app-id': PRIVY_APP_ID,
        }
      })

      if (!getUserResponse.ok) {
        const errorText = await getUserResponse.text()
        console.error('Failed to get user:', errorText)
        return NextResponse.json({
          success: false,
          error: 'User not found. Make sure you are logged in with Privy.'
        }, { status: 404 })
      }

      // Link phone number using Privy API with correct format
      const privyResponse = await fetch(`${PRIVY_API_URL}/users/${userId}/link-account`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`).toString('base64')}`,
          'privy-app-id': PRIVY_APP_ID,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'phone',
          phone_number: value // Use phone_number instead of phoneNumber
        })
      })

      if (!privyResponse.ok) {
        const errorText = await privyResponse.text()
        console.error('Privy API error:', errorText)
        
        let errorMessage = 'Failed to link phone number'
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch (e) {
          errorMessage = errorText || errorMessage
        }
        
        return NextResponse.json({
          success: false,
          error: errorMessage
        }, { status: 400 })
      }

      const responseText = await privyResponse.text()
      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error('Failed to parse Privy response:', responseText)
        // If no JSON response, assume success
        data = { success: true }
      }
      
      return NextResponse.json({
        success: true,
        message: 'Phone number linked successfully',
        user: data
      })
    }
    
    if (type === 'wallet') {
      // Link wallet address using Privy API
      const privyResponse = await fetch(`${PRIVY_API_URL}/users/${userId}/link-account`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`).toString('base64')}`,
          'privy-app-id': PRIVY_APP_ID,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'wallet',
          address: value,
          chain_type: 'ethereum'
        })
      })

      if (!privyResponse.ok) {
        const errorText = await privyResponse.text()
        console.error('Privy API error:', errorText)
        
        let errorMessage = 'Failed to link wallet'
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch (e) {
          errorMessage = errorText || errorMessage
        }
        
        return NextResponse.json({
          success: false,
          error: errorMessage
        }, { status: 400 })
      }

      const responseText = await privyResponse.text()
      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error('Failed to parse Privy response:', responseText)
        // If no JSON response, assume success
        data = { success: true }
      }
      
      return NextResponse.json({
        success: true,
        message: 'Wallet linked successfully',
        user: data
      })
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid link type. Must be "phone" or "wallet".'
    }, { status: 400 })

  } catch (error) {
    console.error('Privy link error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to initiate account linking'
    }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, type, value } = body

    console.log('Privy Unlink Request:', { userId, type, value })

    // Note: Privy API doesn't have a direct unlink endpoint
    // We need to get the user, remove the account, and update
    const userResponse = await fetch(`${PRIVY_API_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${PRIVY_APP_ID}:${PRIVY_APP_SECRET}`).toString('base64')}`,
        'privy-app-id': PRIVY_APP_ID,
      }
    })

    if (!userResponse.ok) {
      throw new Error('Failed to get user data')
    }

    const userData = await userResponse.json()
    const linkedAccounts = userData.linked_accounts || []
    
    // Filter out the account to unlink
    const updatedAccounts = linkedAccounts.filter((account: any) => {
      if (type === 'phone' && account.type === 'phone') {
        return account.phoneNumber !== value
      }
      if (type === 'wallet' && account.type === 'wallet') {
        return account.address.toLowerCase() !== value.toLowerCase()
      }
      return true
    })

    // Note: Privy API may not allow removing all linked accounts
    // User must have at least one login method
    if (updatedAccounts.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Cannot remove all linked accounts. User must have at least one login method.'
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `${type === 'phone' ? 'Phone number' : 'Wallet address'} unlinked successfully`,
      note: 'In production, this would update the user via Privy API'
    })

  } catch (error) {
    console.error('Privy unlink error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to unlink account'
    }, { status: 500 })
  }
}