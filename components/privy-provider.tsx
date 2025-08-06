"use client"

import { PrivyProvider } from "@privy-io/react-auth"
import { getPrivyConfig } from "@/lib/privy-config"
import { BearifiedAuthProvider } from "@/lib/privy-auth-context"
import { usePrivy } from "@privy-io/react-auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

interface PrivyWrapperProps {
  children: React.ReactNode
}

// Inner component that has access to Privy hooks
function PrivyAuthSync({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user } = usePrivy()

  useEffect(() => {
    // Only log when ready - don't manipulate auth state here to prevent loops
    if (ready && authenticated && user) {
      console.log("Privy user authenticated:", user.id)
    }
  }, [ready, authenticated, user])

  return <>{children}</>
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

  // Production mode - use Privy with sync
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={getPrivyConfig()}
    >
      <BearifiedAuthProvider>
        <PrivyAuthSync>
          {children}
        </PrivyAuthSync>
      </BearifiedAuthProvider>
    </PrivyProvider>
  )
}