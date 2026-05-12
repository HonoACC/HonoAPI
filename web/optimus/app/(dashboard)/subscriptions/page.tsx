"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Package } from "lucide-react"

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-display font-semibold tracking-tight">订阅管理</h2>
        <p className="text-sm text-muted-foreground mt-1">管理你的订阅计划</p>
      </div>

      <Card className="hover-lift">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            <CardTitle className="text-base">当前计划</CardTitle>
          </div>
          <CardDescription>你当前使用的是按量付费模式</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            暂无可用的订阅计划。请联系管理员了解更多信息。
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
