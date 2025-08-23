// Utility functions for user management

export function getUserAuthMethod(user: any): 'email' | 'phone' | 'wallet' | 'unknown' {
  // Check if email looks like a real email
  if (user.email && user.email.includes('@') && !user.email.startsWith('did:privy:')) {
    return 'email'
  }
  
  // Check if user has phone
  if (user.phone) {
    return 'phone'
  }
  
  // Check if email is a Privy DID (phone or wallet user)
  if (user.email?.startsWith('did:privy:')) {
    // If name contains phone pattern
    if (user.name?.includes('Phone User')) {
      return 'phone'
    }
    if (user.name?.includes('Wallet User')) {
      return 'wallet'
    }
  }
  
  return 'unknown'
}

export function getUserDisplayEmail(user: any): string {
  const authMethod = getUserAuthMethod(user)
  
  if (authMethod === 'phone' && user.phone) {
    return user.phone
  }
  
  if (authMethod === 'wallet' && user.name?.includes('Wallet User')) {
    // Extract wallet address from name if available
    const match = user.name.match(/\((0x[a-fA-F0-9]+\.{3}[a-fA-F0-9]+)\)/)
    if (match) {
      return match[1]
    }
  }
  
  return user.email
}

export function getUserSlug(user: any): string {
  // Generate a human-readable slug for URLs
  if (user.email && !user.email.startsWith('did:privy:')) {
    // For email users, use the part before @
    return user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')
  }
  
  if (user.phone) {
    // For phone users, use last 4 digits
    const digits = user.phone.replace(/\D/g, '')
    return `phone-${digits.slice(-4)}`
  }
  
  if (user.name?.includes('Wallet User')) {
    // For wallet users, use first 6 chars of address
    const match = user.name.match(/\(0x([a-fA-F0-9]{6})/)
    if (match) {
      return `wallet-${match[1].toLowerCase()}`
    }
  }
  
  // Fallback to ID
  return user.id
}

export function getUserIdentifier(user: any): string {
  const authMethod = getUserAuthMethod(user)
  
  switch (authMethod) {
    case 'email':
      return user.email
    case 'phone':
      return user.phone || user.email
    case 'wallet':
      const match = user.name?.match(/\((0x[a-fA-F0-9]+\.{3}[a-fA-F0-9]+)\)/)
      return match ? match[1] : user.email
    default:
      return user.email
  }
}