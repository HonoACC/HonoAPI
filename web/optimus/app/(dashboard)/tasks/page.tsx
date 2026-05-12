"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { ListTodo, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface Task {
  id: number
  task_id: string
  platform: string
  action: string
  status: string
  progress: number
  created_at: number
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/task/', { params: { p: 0 } }).then(res => {
      if (res.data?.success) setTasks(res.data.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const statusIcon = (status: string) => {
    if (status === 'SUCCESS' || status === 'completed') return <CheckCircle className="h-4 w-4 text-green-500" />
    if (status === 'FAILURE' || status === 'failed') return <AlertCircle className="h-4 w-4 text-red-400" />
    return <Clock className="h-4 w-4 text-yellow-500 animate-pulse" />
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold tracking-tight">异步任务</h2>
        <p className="text-sm text-muted-foreground mt-1">查看异步任务执行状态</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          <ListTodo className="h-12 w-12 mx-auto mb-3 opacity-30" />
          暂无任务
        </div>
      ) : (
        <div className="grid gap-3">
          {tasks.map((task) => (
            <Card key={task.id} className="hover-lift">
              <CardContent className="flex items-center gap-4 p-4">
                {statusIcon(task.status)}
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{task.platform} · {task.action}</div>
                  <div className="text-xs text-muted-foreground font-mono mt-0.5">{task.task_id}</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  {task.progress}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(task.created_at * 1000).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
