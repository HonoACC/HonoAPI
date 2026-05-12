"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '@/lib/api'

interface SystemStatus {
  system_name: string
  logo: string
  footer_html: string
  home_page_content: string
  about: string
  chat_link: string
  quota_per_unit: number
  display_in_currency: boolean
  wechat_qrcode: string
  wechat_login: boolean
  github_oauth: boolean
  github_client_id: string
  turnstile_check: boolean
  turnstile_site_key: string
  email_verification: boolean
  top_up_link: string
  chat_links: string[]
}

interface StatusContextType {
  status: SystemStatus | null
  isLoading: boolean
  refresh: () => Promise<void>
}

const StatusContext = createContext<StatusContextType | null>(null)

export function StatusProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refresh = async () => {
    try {
      const res = await api.get('/api/status')
      if (res.data.success) {
        setStatus(res.data.data)
        localStorage.setItem('status', JSON.stringify(res.data.data))
      }
    } catch {
      // try cached
      const cached = localStorage.getItem('status')
      if (cached) setStatus(JSON.parse(cached))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const cached = localStorage.getItem('status')
    if (cached) {
      try { setStatus(JSON.parse(cached)) } catch {}
    }
    refresh()
  }, [])

  return (
    <StatusContext.Provider value={{ status, isLoading, refresh }}>
      {children}
    </StatusContext.Provider>
  )
}

export function useStatus() {
  const ctx = useContext(StatusContext)
  if (!ctx) throw new Error('useStatus must be used within StatusProvider')
  return ctx
}
