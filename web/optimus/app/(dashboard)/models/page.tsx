"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Box } from "lucide-react"

interface Model {
  id: string
  object: string
  owned_by: string
}

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/user/models').then(res => {
      if (res.data?.data) setModels(res.data.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const filtered = models.filter(m =>
    m.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold tracking-tight">可用模型</h2>
        <p className="text-sm text-muted-foreground mt-1">查看当前可用的 AI 模型</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="搜索模型..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((model) => (
            <Card key={model.id} className="hover-lift">
              <CardContent className="flex items-center gap-3 p-4">
                <Box className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="min-w-0">
                  <div className="font-medium text-sm truncate">{model.id}</div>
                  <div className="text-xs text-muted-foreground">{model.owned_by}</div>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground text-sm">暂无模型</div>
          )}
        </div>
      )}
    </div>
  )
}
