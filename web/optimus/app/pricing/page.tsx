"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface PricingModel {
  model: string
  type: string
  input: number
  output: number
}

export default function PricingPage() {
  const [models, setModels] = useState<PricingModel[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/pricing').then(res => {
      if (res.data?.data) setModels(res.data.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen px-6 py-24 noise-overlay">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-semibold mb-3">模型定价</h1>
          <p className="text-muted-foreground">按量计费，用多少付多少</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        ) : models.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">暂无定价数据</div>
        ) : (
          <div className="grid gap-3">
            <div className="grid grid-cols-4 gap-4 px-4 text-xs font-medium text-muted-foreground">
              <span>模型</span>
              <span>类型</span>
              <span className="text-right">输入 ($/1M tokens)</span>
              <span className="text-right">输出 ($/1M tokens)</span>
            </div>
            {models.map((m, i) => (
              <Card key={i}>
                <CardContent className="grid grid-cols-4 gap-4 p-4 items-center">
                  <span className="font-medium text-sm truncate">{m.model}</span>
                  <span className="text-xs text-muted-foreground">{m.type}</span>
                  <span className="text-right text-sm">${m.input?.toFixed(2)}</span>
                  <span className="text-right text-sm">${m.output?.toFixed(2)}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/register">
            <Button size="lg" className="hover-lift">立即注册</Button>
          </Link>
        </div>
      </div>
    </main>
  )
}
