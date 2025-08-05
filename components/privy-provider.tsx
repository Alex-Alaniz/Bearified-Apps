"use client"

import { PrivyProvider } from "@privy-io/react-auth"
import { getPrivyConfig } from "@/lib/privy-config"
import { BearifiedAuthProvider } from "@/lib/privy-auth-context"

interface PrivyWrapperProps {
  children: React.ReactNode
}

export function PrivyWrapper({ children }: PrivyWrapperProps) {
  const USE_PRIVY = process.env.NEXT_PUBLIC_USE_PRIVY_AUTH === "true"

  if (!USE_PRIVY) {
    // Development mode - use mock auth only
    return (
      <BearifiedAuthProvider>
        {children}
      </BearifiedAuthProvider>
    )
  }

  // Production mode - use Privy with fallback
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={getPrivyConfig()}
    >
      <BearifiedAuthProvider>
        {children}
      </BearifiedAuthProvider>
    </PrivyProvider>
  )
}