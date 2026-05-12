"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import { Activity, CreditCard, Radio, Key } from "lucide-react"

interface DashboardData {
  current_quota: number
  used_quota: number
  request_count: number
  token_count: number
  channel_count: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    api.get('/api/dashboard').then(res => {
      if (res.data.success) setData(res.data.data)
    }).catch(() => {})
  }, [])

  const stats = [
    {
      title: "当前余额",
      value: data ? `$${(data.current_quota / 500000).toFixed(2)}` : '...',
      icon: CreditCard,
    },
    {
      title: "已用额度",
      value: data ? `$${(data.used_quota / 500000).toFixed(2)}` : '...',
      icon: Activity,
    },
    {
      title: "请求次数",
      value: data?.request_count?.toLocaleString() || '...',
      icon: Radio,
    },
    {
      title: "令牌数量",
      value: data?.token_count?.toLocaleString() || '...',
      icon: Key,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold tracking-tight">
          欢迎回来{user?.display_name ? `，${user.display_name}` : ''}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          以下是你的账户概览
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
