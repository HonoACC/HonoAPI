"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Search, Copy, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface Redemption {
  id: number
  name: string
  key: string
  status: number
  quota: number
  count: number
  used_count: number
  created_time: number
}

export default function RedemptionsPage() {
  const [items, setItems] = useState<Redemption[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const fetch = async () => {
    try {
      const res = await api.get('/api/redemption/', { params: { p: 0 } })
      if (res.data.success) setItems(res.data.data || [])
    } catch {} finally { setLoading(false) }
  }

  useEffect(() => { fetch() }, [])

  const filtered = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold tracking-tight">兑换码</h2>
          <p className="text-sm text-muted-foreground mt-1">管理额度兑换码</p>
        </div>
        <Button><Plus className="h-4 w-4" />创建兑换码</Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="搜索..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((item) => (
            <Card key={item.id} className="hover-lift">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`h-2 w-2 rounded-full ${item.status === 1 ? 'bg-green-500' : item.status === 2 ? 'bg-yellow-500' : 'bg-red-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{item.name}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">{item.key}</div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  <div>额度: ${(item.quota / 500000).toFixed(2)}</div>
                  <div>已用: {item.used_count}/{item.count}</div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => { navigator.clipboard.writeText(item.key); toast.success("已复制") }}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={async () => { await api.delete(`/api/redemption/${item.id}`); fetch(); toast.success("已删除") }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground text-sm">暂无数据</div>}
        </div>
      )}
    </div>
  )
}
