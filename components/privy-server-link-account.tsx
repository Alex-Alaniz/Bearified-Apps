"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Phone, Wallet, Plus, Trash2 } from "lucide-react"
import { usePrivy } from "@privy-io/react-auth"

interface PrivyServerLinkAccountProps {
  userId: string
  type: 'phone' | 'wallet'
  currentValue?: string | null
  onLinked?: (value: string) => void
  onUnlinked?: () => void
}

export function PrivyServerLinkAccount({ userId, type, currentValue, onLinked, onUnlinked }: PrivyServerLinkAccountProps) {
  const { user } = usePrivy()
  const [inputValue, setInputValue] = useState("")
  const [linking, setLinking] = useState(false)
  const [unlinking, setUnlinking] = useState(false)

  // Use currentValue instead of the logged-in user's linked accounts
  // This ensures we show the wallet/phone for the user being edited, not the admin
  const hasLinkedAccount = !!currentValue
  const linkedAccount = hasLinkedAccount ? {
    phoneNumber: type === 'phone' ? currentValue : undefined,
    address: type === 'wallet' ? currentValue : undefined
  } : null

  const handleLink = async () => {
    if (!inputValue.trim()) return

    setLinking(true)
    try {
      // Call our server-side API to link account
      const response = await fetch('/api/privy/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id || userId,
          type,
          value: inputValue
        }),
      })

      const data = await response.json()
      if (data.success) {
        onLinked?.(inputValue)
        setInputValue("")
        alert(`✅ ${type === 'phone' ? 'Phone number' : 'Wallet'} linked successfully!`)
        
        // Refresh the page to show updated linked accounts
        window.location.reload()
      } else {
        alert(`Failed to link ${type}: ${data.error}`)
      }
    } catch (error) {
      console.error(`Error linking ${type}:`, error)
      alert(`Failed to link ${type}`)
    } finally {
      setLinking(false)
    }
  }

  const handleUnlink = async () => {
    const value = type === 'phone' 
      ? linkedAccount?.phoneNumber 
      : linkedAccount?.address
    
    if (!value) return

    const valueToShow = type === 'phone' 
      ? value
      : `${value.slice(0, 6)}...${value.slice(-4)}`

    const confirmed = confirm(
      `Are you sure you want to unlink this ${type === 'phone' ? 'phone number' : 'wallet address'}?\n` +
      `${valueToShow}`
    )

    if (!confirmed) return

    setUnlinking(true)
    try {
      const response = await fetch('/api/privy/link', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id || userId,
          type,
          value
        }),
      })

      const data = await response.json()
      if (data.success) {
        onUnlinked?.()
        alert(`✅ ${type === 'phone' ? 'Phone number' : 'Wallet address'} unlinked successfully!`)
        
        // Refresh the page to show updated linked accounts
        window.location.reload()
      } else {
        alert(`Failed to unlink ${type}: ${data.error}`)
      }
    } catch (error) {
      console.error(`Error unlinking ${type}:`, error)
      alert(`Failed to unlink ${type}`)
    } finally {
      setUnlinking(false)
    }
  }

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
          <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <div>
              <span className="text-sm font-mono">
                {type === 'phone' 
                  ? linkedAccount.phoneNumber
                  : linkedAccount.address
                }
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Linked via Privy
              </p>
            </div>
            <Button
              onClick={handleUnlink}
              size="sm"
              variant="ghost"
              className="text-red-600 hover:text-red-700"
              disabled={unlinking}
            >
              {unlinking ? 'Unlinking...' : <Trash2 className="h-4 w-4" />}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={type === 'phone' ? "+1 (555) 123-4567" : "0x..."}
                className={type === 'wallet' ? "font-mono text-xs" : ""}
                type={type === 'phone' ? "tel" : "text"}
              />
              <Button 
                onClick={handleLink} 
                disabled={!inputValue.trim() || linking}
              >
                {linking ? 'Linking...' : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Link
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {type === 'phone' 
                ? '📱 Phone will be linked using Privy server-side API'
                : '🔗 Wallet will be linked using Privy server-side API'
              }
            </p>
          </div>
        )}
      </div>

      {/* Info about server-side linking */}
      <div className="text-xs text-muted-foreground space-y-1 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
        <p className="font-medium text-green-900 dark:text-green-300">✅ Server-Side Linking Enabled</p>
        <p className="dark:text-gray-300">
          This uses Privy's server-side API to link accounts, which supports:
        </p>
        <ul className="list-disc list-inside mt-1 dark:text-gray-300">
          <li>Multiple linked accounts per user</li>
          <li>Social login methods</li>
          <li>No client-side restrictions</li>
        </ul>
        {!hasLinkedAccount && (
          <p className="mt-2 text-green-800 dark:text-green-400">
            {type === 'phone' 
              ? 'Enter a phone number to link it to this account.'
              : 'Enter a wallet address to link it to this account.'
            }
          </p>
        )}
      </div>
    </div>
  )
}