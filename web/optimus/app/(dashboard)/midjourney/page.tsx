"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Image, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface MjTask {
  id: number
  mj_id: string
  action: string
  prompt: string
  status: string
  progress: string
  image_url: string
  created_at: number
}

export default function MidjourneyPage() {
  const [tasks, setTasks] = useState<MjTask[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/mj/image/list', { params: { p: 0 } }).then(res => {
      if (res.data?.data) setTasks(res.data.data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const statusIcon = (status: string) => {
    if (status === 'SUCCESS') return <CheckCircle className="h-4 w-4 text-green-500" />
    if (status === 'FAILURE') return <AlertCircle className="h-4 w-4 text-red-400" />
    return <Clock className="h-4 w-4 text-yellow-500" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold tracking-tight">绘图</h2>
        <p className="text-sm text-muted-foreground mt-1">Midjourney 绘图任务</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          <Image className="h-12 w-12 mx-auto mb-3 opacity-30" />
          暂无绘图任务
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card key={task.id} className="hover-lift overflow-hidden">
              {task.image_url && (
                <div className="aspect-square bg-muted">
                  <img src={task.image_url} alt={task.prompt} className="w-full h-full object-cover" />
                </div>
              )}
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1">
                  {statusIcon(task.status)}
                  <span className="text-xs text-muted-foreground">{task.action} · {task.progress}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{task.prompt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
