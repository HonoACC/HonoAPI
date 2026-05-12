"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { api } from "@/lib/api"
import { toast } from "sonner"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [password2, setPassword2] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== password2) {
      toast.error("两次密码不一致")
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/api/user/register', { username, password, email })
      if (res.data.success) {
        toast.success("注册成功，请登录")
        router.push('/login')
      } else {
        toast.error(res.data.message || '注册失败')
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || '注册失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background noise-overlay">
      <Card className="w-full max-w-sm mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-display">注册</CardTitle>
          <CardDescription>创建新账号</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="用户名"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="邮箱"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="password"
              placeholder="密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="确认密码"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '注册中...' : '注册'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            已有账号？
            <Link href="/login" className="text-primary hover:underline ml-1">
              登录
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
