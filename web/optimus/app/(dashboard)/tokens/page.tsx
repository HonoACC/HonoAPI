"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, Copy, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Token {
  id: number
  name: string
  key: string
  status: number
  used_quota: number
  remain_quota: number
  unlimited_quota: boolean
  created_time: number
  expired_time: number
}

export default function TokensPage() {
  const [tokens, setTokens] = useState<Token[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchTokens = async () => {
    try {
      const res = await api.get('/api/token/', { params: { p: 0 } })
      if (res.data.success) setTokens(res.data.data || [])
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTokens() }, [])

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(`sk-${key}`)
    toast.success("已复制到剪贴板")
  }

  const deleteToken = async (id: number) => {
    await api.delete(`/api/token/${id}`)
    fetchTokens()
    toast.success("已删除")
  }

  const filtered = tokens.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold tracking-tight">令牌管理</h2>
          <p className="text-sm text-muted-foreground mt-1">管理 API 访问令牌</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          创建令牌
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索令牌..."
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
          {filtered.map((token) => (
            <Card key={token.id} className="hover-lift">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`h-2 w-2 rounded-full ${token.status === 1 ? 'bg-green-500' : 'bg-red-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{token.name}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">
                    sk-{token.key.slice(0, 8)}...
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>已用: ${(token.used_quota / 500000).toFixed(4)}</div>
                  <div>{token.unlimited_quota ? '无限额度' : `剩余: $${(token.remain_quota / 500000).toFixed(4)}`}</div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => copyKey(token.key)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteToken(token.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              暂无令牌数据
            </div>
          )}
        </div>
      )}
    </div>
  )
}
