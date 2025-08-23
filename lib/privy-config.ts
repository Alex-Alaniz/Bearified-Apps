import { PrivyConfig } from "@privy-io/react-auth"

// Environment variables
export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "your-privy-app-id"
export const PRIVY_CLIENT_ID = process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID || "your-privy-client-id"

// Privy configuration for Bearified Apps
export function getPrivyConfig(): PrivyConfig {
  return {
    appId: PRIVY_APP_ID,
    // Internal app - only email, phone, and wallet authentication
    loginMethods: ["email", "sms", "wallet"],
    
    // Embedded wallet configuration
    embeddedWallets: {
      createOnLogin: "users-without-wallets",
      requireUserPasswordOnCreate: false,
      showWalletUIs: false, // Disable to prevent WalletConnect conflicts
    },

    // Supported chains for wallet authentication
    supportedChains: [
      // Ethereum mainnet
      {
        id: 1,
        name: "Ethereum",
        network: "ethereum",
        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        rpcUrls: {
          default: { http: ["https://cloudflare-eth.com"] },
          public: { http: ["https://cloudflare-eth.com"] },
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
      // Polygon
      {
        id: 137,
        name: "Polygon",
        network: "polygon",
        nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
        rpcUrls: {
          default: { http: ["https://polygon-rpc.com"] },
          public: { http: ["https://polygon-rpc.com"] },
        },
      },
    ],

    // UI customization for Bearified Apps branding
    appearance: {
      theme: "light",
      accentColor: "#3B82F6", // Blue accent matching your brand
      logo: "https://github.com/Alex-Alaniz/BearifiedLabs/blob/main/public/images/BearifiedXYZ.png?raw=true",
      showWalletLoginFirst: false,
      walletList: ["metamask", "coinbase_wallet"],
    },

    // Account linking configuration
    // This enables users to link additional login methods to their account
    accountLinking: {
      enabled: true,
      allowMultipleAccounts: true,
    },

    // Additional configuration
    intl: {
      defaultCountry: "US",
    },
    
    // Legal configuration - update with your actual URLs
    legal: {
      termsAndConditionsUrl: "https://bearified.com/terms",
      privacyPolicyUrl: "https://bearified.com/privacy",
    },

    // Customize modal appearance - disable to prevent navigation issues
    customAuth: {
      enabled: false,
    },
  }
}

// Helper function to extract user profile from Privy user object
export function extractUserProfile(user: any) {
  if (!user) return null

  const emailAccount = user.linkedAccounts?.find((account: any) => account.type === "email")
  const phoneAccount = user.linkedAccounts?.find((account: any) => account.type === "phone")

  return {
    id: user.id,
    email: emailAccount?.address || null,
    phone: phoneAccount?.number || null,
    name: emailAccount?.address?.split("@")[0] || phoneAccount?.number || "User",
    username: null,
    avatar: null,
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