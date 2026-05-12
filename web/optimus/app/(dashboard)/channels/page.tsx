"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Search, MoreHorizontal, Power, PowerOff } from "lucide-react"

interface Channel {
  id: number
  name: string
  type: number
  key: string
  status: number
  base_url: string
  models: string
  group: string
  used_quota: number
  balance: number
  priority: number
  response_time: number
}

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchChannels = async () => {
    try {
      const res = await api.get('/api/channel/', { params: { p: 0 } })
      if (res.data.success) setChannels(res.data.data || [])
    } catch {} finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchChannels() }, [])

  const toggleChannel = async (id: number, status: number) => {
    const newStatus = status === 1 ? 2 : 1
    await api.put('/api/channel/', { id, status: newStatus })
    fetchChannels()
  }

  const filtered = channels.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-semibold tracking-tight">渠道管理</h2>
          <p className="text-sm text-muted-foreground mt-1">管理 API 转发渠道</p>
        </div>
        <Button>
          <Plus className="h-4 w-4" />
          添加渠道
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜索渠道..."
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
          {filtered.map((channel) => (
            <Card key={channel.id} className="hover-lift">
              <CardContent className="flex items-center gap-4 p-4">
                <div className={`h-2 w-2 rounded-full ${channel.status === 1 ? 'bg-green-500' : 'bg-red-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{channel.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    ID: {channel.id} · 优先级: {channel.priority} · 响应: {channel.response_time}ms
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  ${(channel.used_quota / 500000).toFixed(4)}
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleChannel(channel.id, channel.status)}
                  >
                    {channel.status === 1 ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              暂无渠道数据
            </div>
          )}
        </div>
      )}
    </div>
  )
}
