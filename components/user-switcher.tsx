"use client"

import { useState } from "react"
import { Check, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser, TEST_USERS } from "@/lib/user-context"

export function UserSwitcher() {
  const [open, setOpen] = useState(false)
  const { currentUser, switchUser, isAdmin } = useUser()

  // Only show user switcher to admin
  if (!isAdmin) {
    return null
  }

  const handleUserSelect = (userId: number) => {
    switchUser(userId)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="w-full justify-start px-2 py-1.5 h-auto">
          <Users className="mr-2 h-4 w-4" />
          Switch User (Testing)
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search users..." />
          <CommandList>
            <CommandEmpty>No users found.</CommandEmpty>
            <CommandGroup heading="Test Users">
              {TEST_USERS.map((user) => (
                <CommandItem key={user.id} onSelect={() => handleUserSelect(user.id)} className="p-3">
                  <div className="flex items-center space-x-3 w-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{user.name}</p>
                        <Check className={cn("h-4 w-4", currentUser.id === user.id ? "opacity-100" : "opacity-0")} />
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <Badge key={role} variant="outline" className="text-xs">
                              {role}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            No roles
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
