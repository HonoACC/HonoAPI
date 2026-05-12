"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthProvider, useAuth } from "@/hooks/use-auth"
import { StatusProvider } from "@/hooks/use-status"
import { Sidebar } from "./sidebar"
import { Header } from "./header"

function DashboardGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 pl-60">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <StatusProvider>
      <AuthProvider>
        <DashboardGuard>{children}</DashboardGuard>
      </AuthProvider>
    </StatusProvider>
  )
}
