import { PrivyConfig } from "@privy-io/react-auth"

// Environment variables
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "your-privy-app-id"
export const PRIVY_CLIENT_ID = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || "your-privy-client-id"

// Privy configuration for Bearified Apps
export function getPrivyConfig(): PrivyConfig {
  return {
    appId: PRIVY_APP_ID,
    // Enable multiple login methods for broader accessibility
    loginMethods: ["email", "twitter", "google", "apple", "discord"],
    
    // Embedded wallet configuration
    embeddedWallets: {
      createOnLogin: "users-without-wallets",
      requireUserPasswordOnCreate: false,
      // Server control for AI agent transactions
      showWalletUIs: false,
    },

    // Supported chains for multi-chain functionality
    supportedChains: [
      // Ethereum mainnet
      {
        id: 1,
        name: "Ethereum",
        network: "ethereum",
        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        rpcUrls: {
          default: { http: ["https://eth-mainnet.g.alchemy.com/v2/your-key"] },
          public: { http: ["https://eth-mainnet.g.alchemy.com/v2/your-key"] },
        },
      },
      // Base
      {
        id: 8453,
        name: "Base",
        network: "base",
        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        rpcUrls: {
          default: { http: ["https://mainnet.base.org"] },
          public: { http: ["https://mainnet.base.org"] },
        },
      },
      // Solana (via custom integration)
    ],

    // UI customization for Bearified Apps branding
    appearance: {
      theme: "dark",
      accentColor: "#6366f1", // Indigo accent
      logo: "/placeholder-logo.svg",
      showWalletLoginFirst: false,
    },

    // Additional configuration
    intl: {
      defaultCountry: "US",
    },
    
    // Legal configuration
    legal: {
      termsAndConditionsUrl: "/terms",
      privacyPolicyUrl: "/privacy",
    },
  }
}

// Helper function to extract user profile from Privy user object
export function extractUserProfile(user: any) {
  if (!user) return null

  const twitterAccount = user.linkedAccounts?.find((account: any) => account.type === "twitter_oauth")
  const emailAccount = user.linkedAccounts?.find((account: any) => account.type === "email")
  const googleAccount = user.linkedAccounts?.find((account: any) => account.type === "google_oauth")

  return {
    id: user.id,
    email: emailAccount?.address || googleAccount?.email || null,
    name: twitterAccount?.name || googleAccount?.name || emailAccount?.address?.split("@")[0] || "User",
    username: twitterAccount?.username || null,
    avatar: twitterAccount?.profilePictureUrl || googleAccount?.profilePictureUrl || null,
    wallets: user.linkedAccounts?.filter((account: any) => 
      account.type === "wallet" || account.type === "smart_wallet"
    ) || [],
  }
}

// Helper function to extract wallet information
export function extractWalletInfo(user: any) {
  if (!user?.linkedAccounts) return []

  return user.linkedAccounts
    .filter((account: any) => account.type === "wallet" || account.type === "smart_wallet")
    .map((wallet: any) => ({
      address: wallet.address,
      type: wallet.walletClientType || wallet.type,
      chainType: wallet.chainType || "ethereum",
      connectorType: wallet.connectorType,
    }))
}