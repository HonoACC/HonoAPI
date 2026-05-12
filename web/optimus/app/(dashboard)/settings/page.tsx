"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Save } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/option/').then(res => {
      if (res.data.success) setSettings(res.data.data || {})
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const updateSetting = async (key: string, value: string) => {
    try {
      const res = await api.put('/api/option/', { key, value })
      if (res.data.success) toast.success(`${key} 已更新`)
      else toast.error(res.data.message)
    } catch {
      toast.error('更新失败')
    }
  }

  const fields = [
    { key: 'SystemName', label: '系统名称' },
    { key: 'Logo', label: 'Logo URL' },
    { key: 'HomePageContent', label: '首页内容' },
    { key: 'About', label: '关于' },
    { key: 'Footer', label: '页脚 HTML' },
    { key: 'TopUpLink', label: '充值链接' },
    { key: 'ChatLink', label: '聊天链接' },
  ]

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold tracking-tight">系统设置</h2>
        <p className="text-sm text-muted-foreground mt-1">配置系统参数</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">基本设置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {fields.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <label className="w-24 text-sm text-muted-foreground shrink-0">{label}</label>
              <Input
                value={settings[key] || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, [key]: e.target.value }))}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateSetting(key, settings[key] || '')}
              >
                <Save className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
