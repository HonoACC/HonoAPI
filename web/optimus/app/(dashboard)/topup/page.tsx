"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { CreditCard, Gift } from "lucide-react"

export default function TopUpPage() {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    try {
      const res = await api.post('/api/user/topup', { key: code })
      if (res.data.success) {
        toast.success(`充值成功！获得 $${(res.data.data / 500000).toFixed(2)} 额度`)
        setCode("")
      } else {
        toast.error(res.data.message || '兑换失败')
      }
    } catch {
      toast.error('兑换失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold tracking-tight">充值</h2>
        <p className="text-sm text-muted-foreground mt-1">使用兑换码充值额度</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5" />
              <CardTitle className="text-base">兑换码充值</CardTitle>
            </div>
            <CardDescription>输入兑换码获取额度</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRedeem} className="flex gap-2">
              <Input
                placeholder="输入兑换码"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={loading}>
                {loading ? '兑换中...' : '兑换'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              <CardTitle className="text-base">在线充值</CardTitle>
            </div>
            <CardDescription>通过支付方式充值</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">请联系管理员获取充值方式</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
