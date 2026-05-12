import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 h-14 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius)] bg-primary text-primary-foreground text-xs font-bold">
            H
          </div>
          <span className="font-semibold text-sm">HonoAPI</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/pricing">
            <Button variant="ghost" size="sm">定价</Button>
          </Link>
          <Link href="/about">
            <Button variant="ghost" size="sm">关于</Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm">登录</Button>
          </Link>
          <Link href="/register">
            <Button size="sm">注册</Button>
          </Link>
        </div>
      </nav>

      <section className="flex flex-col items-center justify-center min-h-screen px-6 pt-14">
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-display font-semibold tracking-tight leading-[1.1]">
            AI API
            <br />
            <span className="text-muted-foreground">管理平台</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            统一管理多个 AI 模型接口，智能负载均衡，实时监控用量，一站式 API 转发服务。
          </p>
          <div className="flex items-center justify-center gap-3 pt-4">
            <Link href="/register">
              <Button size="lg" className="hover-lift">
                开始使用
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="hover-lift">
                查看定价
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-display font-semibold text-center mb-12">核心特性</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { title: "多渠道管理", desc: "支持 OpenAI、Claude、Gemini 等多种 AI 模型接口统一管理" },
              { title: "智能负载均衡", desc: "自动分配请求到最优渠道，确保高可用和低延迟" },
              { title: "用量监控", desc: "实时追踪 Token 消耗和费用，精细化额度管理" },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-[var(--radius)] border border-border bg-card hover-lift">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 px-6 border-t border-border text-center text-sm text-muted-foreground">
        Powered by HonoAPI
      </footer>
    </main>
  )
}
