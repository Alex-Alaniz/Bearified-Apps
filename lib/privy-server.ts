// Server-side Privy API functions
const PRIVY_API_URL = 'https://auth.privy.io/api/v1'
const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID!
const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET!

export async function fetchPrivyUser(userId: string) {
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

    const privyUser = await response.json()
    
    // Extract wallet address from linked accounts
    const walletAccount = privyUser.linked_accounts?.find((acc: any) => acc.type === 'wallet')
    const phoneAccount = privyUser.linked_accounts?.find((acc: any) => acc.type === 'phone')
    const emailAccount = privyUser.linked_accounts?.find((acc: any) => acc.type === 'email')
    
    return {
      id: privyUser.id,
      email: emailAccount?.address || null,
      phone: phoneAccount?.number || phoneAccount?.phoneNumber || null,
      wallet: walletAccount?.address || null,
      linkedAccounts: privyUser.linked_accounts || []
    }
  } catch (error) {
    console.error(`Error fetching Privy user ${userId}:`, error)
    return null
  }
}

export function getUserAuthMethod(user: any): 'email' | 'phone' | 'wallet' | 'unknown' {
  if (user.email && !user.email.includes('@privy.user')) {
    return 'email'
  }
  
  if (user.email?.startsWith('phone_') && user.email.endsWith('@privy.user')) {
    return 'phone'
  }
  
  if (user.email?.startsWith('wallet_') && user.email.endsWith('@privy.user')) {
    return 'wallet'
  }
  
  return 'unknown'
}