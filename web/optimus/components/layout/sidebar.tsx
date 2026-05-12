"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import {
  LayoutDashboard,
  Radio,
  Key,
  Users,
  ScrollText,
  Ticket,
  CreditCard,
  Settings,
  Box,
  MessageSquare,
  Image,
  ListTodo,
  Package,
  LogOut,
  Moon,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"

const navItems = [
  { href: "/dashboard", label: "仪表盘", icon: LayoutDashboard },
  { href: "/channels", label: "渠道", icon: Radio },
  { href: "/tokens", label: "令牌", icon: Key },
  { href: "/logs", label: "日志", icon: ScrollText },
  { href: "/redemptions", label: "兑换码", icon: Ticket, admin: true },
  { href: "/users", label: "用户", icon: Users, admin: true },
  { href: "/models", label: "模型", icon: Box },
  { href: "/subscriptions", label: "订阅", icon: Package },
  { href: "/topup", label: "充值", icon: CreditCard },
  { href: "/chat", label: "聊天", icon: MessageSquare },
  { href: "/midjourney", label: "绘图", icon: Image },
  { href: "/tasks", label: "任务", icon: ListTodo },
  { href: "/settings", label: "设置", icon: Settings, admin: true },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, isAdmin, logout } = useAuth()
  const { theme, setTheme } = useTheme()

  const filteredItems = navItems.filter(item => !item.admin || isAdmin)

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius)] bg-sidebar-primary text-sidebar-primary-foreground text-xs font-bold">
            H
          </div>
          <span className="font-semibold text-sm">HonoAPI</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-[var(--radius)] px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="border-t border-sidebar-border p-3 space-y-2">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="flex w-full items-center gap-3 rounded-[var(--radius)] px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 transition-colors"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === 'dark' ? '浅色模式' : '深色模式'}
        </button>
        {user && (
          <div className="flex items-center gap-3 rounded-[var(--radius)] px-3 py-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sidebar-accent text-xs">
              {user.display_name?.[0] || user.username[0]}
            </div>
            <span className="flex-1 truncate text-xs">{user.display_name || user.username}</span>
            <button onClick={logout} className="text-sidebar-foreground/50 hover:text-sidebar-foreground">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
