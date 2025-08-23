"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone, Wallet, Plus, Trash2 } from "lucide-react"
import { useLinkAccount, usePrivy } from "@privy-io/react-auth"

interface PrivyLinkAccountProps {
  type: 'phone' | 'wallet'
  currentValue?: string | null
  onLinked?: (value: string) => void
  onUnlinked?: () => void
}

export function PrivyLinkAccount({ type, currentValue, onLinked, onUnlinked }: PrivyLinkAccountProps) {
  const { user, unlinkPhone, unlinkWallet } = usePrivy()
  const { linkPhone, linkWallet } = useLinkAccount({
    onSuccess: (user, linkedAccountType) => {
      console.log(`Successfully linked account. User:`, user)
      console.log(`Linked account type:`, linkedAccountType)
      
      // The callback may provide different data structures, so let's be defensive
      if (user && user.linkedAccounts) {
        // Find the newly linked account
        const newLinkedAccount = user.linkedAccounts.find(account => {
          if (type === 'phone' && account.type === 'phone') return true
          if (type === 'wallet' && account.type === 'wallet') return true
          return false
        })
        
        if (newLinkedAccount) {
          if (type === 'phone' && newLinkedAccount.type === 'phone') {
            onLinked?.(newLinkedAccount.phoneNumber)
          } else if (type === 'wallet' && newLinkedAccount.type === 'wallet') {
            onLinked?.(newLinkedAccount.address)
          }
        }
      }
    },
    onError: (error) => {
      console.error(`Error linking ${type}:`, error)
      
      // Handle specific error types
      if (error === 'disallowed_login_method') {
        alert(`This ${type} linking method is not allowed. Please check your Privy app settings or contact support.`)
      } else if (error === 'exited_link_flow') {
        // User cancelled - no need to show error
        console.log('User cancelled linking flow')
      } else {
        alert(`Failed to link ${type}: ${error || 'Unknown error'}`)
      }
    }
  })

  const handleLink = () => {
    if (type === 'phone') {
      linkPhone()
    } else {
      linkWallet()
    }
  }

  const handleUnlink = async () => {
    // Get the actual linked account from Privy user data
    const linkedAccount = type === 'phone' 
      ? linkedAccounts.find(acc => acc.type === 'phone')
      : linkedAccounts.find(acc => acc.type === 'wallet')
    
    if (!linkedAccount) {
      alert(`No ${type} is currently linked to unlink.`)
      return
    }

    const valueToShow = type === 'phone' 
      ? linkedAccount.phoneNumber 
      : `${linkedAccount.address.slice(0, 6)}...${linkedAccount.address.slice(-4)}`

    const confirmed = confirm(
      `Are you sure you want to unlink this ${type === 'phone' ? 'phone number' : 'wallet address'}?\n` +
      `${valueToShow}`
    )

    if (!confirmed) return

    try {
      if (type === 'phone') {
        await unlinkPhone(linkedAccount.phoneNumber)
      } else {
        await unlinkWallet(linkedAccount.address)
      }
      onUnlinked?.()
      alert(`✅ ${type === 'phone' ? 'Phone number' : 'Wallet address'} unlinked successfully!`)
    } catch (error: any) {
      console.error(`Error unlinking ${type}:`, error)
      alert(`Failed to unlink ${type}: ${error?.message || error || 'Unknown error'}`)
    }
  }

  // Get current linked accounts from Privy user
  const linkedAccounts = user?.linkedAccounts || []
  const linkedAccount = type === 'phone'
    ? linkedAccounts.find(acc => acc.type === 'phone')
    : linkedAccounts.find(acc => acc.type === 'wallet')
  const hasLinkedAccount = !!linkedAccount

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block flex items-center">
          {type === 'phone' ? (
            <>
              <Phone className="mr-2 h-4 w-4" />
              Phone Number
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Wallet Address
            </>
          )}
        </label>

        {hasLinkedAccount ? (
          <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
            <div>
              <span className="text-sm font-mono">
                {type === 'phone' 
                  ? linkedAccount.phoneNumber
                  : linkedAccount.address
                }
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Linked via Privy
              </p>
            </div>
            <Button
              onClick={handleUnlink}
              size="sm"
              variant="ghost"
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button onClick={handleLink} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Link {type === 'phone' ? 'Phone Number' : 'Wallet'}
            </Button>
            <p className="text-xs text-muted-foreground">
              {type === 'phone' 
                ? '📱 Link via Privy SMS verification'
                : '🔗 Link via Privy wallet connection'
              }
            </p>
          </div>
        )}
      </div>

      {/* Info about Privy account linking */}
      <div className="text-xs text-muted-foreground space-y-1 p-3 bg-blue-50 rounded-lg">
        <p className="font-medium text-blue-900">ℹ️ About Privy Account Linking</p>
        <p>
          {type === 'phone'
            ? 'Users will receive an SMS with a verification code to confirm phone ownership.'
            : 'Users will connect their wallet and sign a message to verify ownership.'
          }
        </p>
        <p>
          This uses Privy's secure account linking flow with proper verification.
        </p>
        {/* Help for common errors */}
        <div className="mt-2 pt-2 border-t border-blue-200">
          <p className="font-medium text-blue-900">⚠️ Troubleshooting</p>
          <p className="mt-1">
            If you see "disallowed_login_method" error, ensure that:
          </p>
          <ul className="list-disc list-inside mt-1">
            <li>Account linking is enabled in your Privy dashboard</li>
            <li>{type === 'phone' ? 'SMS' : 'Wallet'} login method is enabled</li>
            <li>The user has permission to link additional accounts</li>
          </ul>
        </div>
      </div>
    </div>
  )
}