"use client"

import { useAuth } from "@/hooks/use-auth"
import { useStatus } from "@/hooks/use-status"

export function Header() {
  const { user } = useAuth()
  const { status } = useStatus()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-background/80 backdrop-blur-sm px-6">
      <h1 className="text-sm font-medium">
        {status?.system_name || 'HonoAPI'}
      </h1>
      <div className="ml-auto flex items-center gap-4">
        {user && (
          <span className="text-xs text-muted-foreground">
            {user.display_name || user.username}
          </span>
        )}
      </div>
    </header>
  )
}
