"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/privy-auth-context"
import { usePrivy } from "@privy-io/react-auth"
import { LogOut, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"

export function UserMenu() {
  const { user, logout, authMode } = useAuth()
  const router = useRouter()
  const USE_PRIVY = process.env.NEXT_PUBLIC_USE_PRIVY_AUTH === "true"
  
  // Only use Privy hooks when Privy is enabled
  const privyLogout = USE_PRIVY ? usePrivy().logout : null

  if (!user) return null

  const handleLogout = async () => {
    try {
      // Logout from our auth context first
      logout()
      
      // Navigate to auth page with logout flag to prevent re-authentication
      router.push("/auth?logout=true")
      
      // If using Privy, logout after navigation
      if (USE_PRIVY && authMode === "hybrid" && privyLogout) {
        // Small delay to ensure navigation happens first
        setTimeout(async () => {
          try {
            await privyLogout()
          } catch (error) {
            console.error("Privy logout error:", error)
          }
        }, 100)
      }
    } catch (error) {
      console.error("Logout error:", error)
      // Still navigate even if errors occur
      router.push("/auth?logout=true")
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "super_admin":
        return "default"
      case "admin":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Admin"
      case "admin":
        return "Admin"
      default:
        return "User"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback>
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            <Badge variant={getRoleBadgeVariant(user.role)} className="w-fit mt-1">
              {getRoleLabel(user.role)}
            </Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
