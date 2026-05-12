"use client"

import { useState, useRef, useEffect } from "react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState("gpt-4o-mini")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg: Message = { role: "user", content: input }
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setLoading(true)

    try {
      const res = await api.post('/api/v1/chat/completions', {
        model,
        messages: [...messages, userMsg],
        stream: false,
      })
      const content = res.data.choices?.[0]?.message?.content || '无响应'
      setMessages(prev => [...prev, { role: "assistant", content }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "请求失败，请重试" }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-display font-semibold tracking-tight">聊天</h2>
        <Input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="w-48"
          placeholder="模型名称"
        />
      </div>

      <Card className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            开始对话吧
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-[var(--radius)] px-4 py-2 text-sm ${
              msg.role === 'user'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground'
            }`}>
              <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-[var(--radius)] px-4 py-2">
              <div className="flex gap-1">
                <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0.1s]" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0.2s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </Card>

      <form onSubmit={sendMessage} className="flex gap-2 mt-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入消息..."
          className="flex-1"
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}
