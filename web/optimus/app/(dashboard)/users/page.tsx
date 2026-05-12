"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, MoreHorizontal, Shield, User as UserIcon } from "lucide-react"

interface UserData {
  id: number
  username: string
  display_name: string
  email: string
  role: number
  status: number
  quota: number
  used_quota: number
  group: string
  created_time: number
}

const roleMap: Record<number, string> = {
  1: '普通用户',
  10: '管理员',
  100: '超级管理员',
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const res = await api.get('/api/user/', { params: { p: 0 } })
      if (res.data.success) setUsers(res.data.data || [])
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsers() }, [])

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold tracking-tight">用户管理</h2>
          <p className="text-sm text-muted-foreground mt-1">管理系统用户</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索用户..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((user) => (
            <Card key={user.id} className="hover-lift">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-medium">
                  {user.display_name?.[0] || user.username[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{user.display_name || user.username}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {user.email || '无邮箱'} · {user.group || '默认分组'}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {user.role >= 10 && <Shield className="h-3.5 w-3.5" />}
                  <span>{roleMap[user.role] || '用户'}</span>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>余额: ${(user.quota / 500000).toFixed(2)}</div>
                  <div>已用: ${(user.used_quota / 500000).toFixed(2)}</div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
