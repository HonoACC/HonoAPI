"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { Navigation } from "@/components/landing/navigation"
import { AnimatedSphere } from "@/components/landing/animated-sphere"

const words = ["manage", "scale", "deploy", "build"]

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <main className="relative min-h-screen overflow-x-hidden noise-overlay">
      <Navigation />

      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[800px] lg:h-[800px] opacity-40 pointer-events-none">
          <AnimatedSphere />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          {[...Array(8)].map((_, i) => (
            <div
              key={`h-${i}`}
              className="absolute h-px bg-foreground/10"
              style={{ top: `${12.5 * (i + 1)}%`, left: 0, right: 0 }}
            />
          ))}
          {[...Array(12)].map((_, i) => (
            <div
              key={`v-${i}`}
              className="absolute w-px bg-foreground/10"
              style={{ left: `${8.33 * (i + 1)}%`, top: 0, bottom: 0 }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 py-32 lg:py-40">
          <div className={`mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground">
              <span className="w-8 h-px bg-foreground/30" />
              The platform for modern teams
            </span>
          </div>

          <div className="mb-12">
            <h1 className={`text-[clamp(3rem,12vw,10rem)] font-display leading-[0.9] tracking-tight transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <span className="block">The platform</span>
              <span className="block">
                to{" "}
                <span className="relative inline-block">
                  <span key={wordIndex} className="inline-flex">
                    {words[wordIndex].split("").map((char, i) => (
                      <span
                        key={`${wordIndex}-${i}`}
                        className="inline-block animate-char-in"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        {char}
                      </span>
                    ))}
                  </span>
                  <span className="absolute -bottom-2 left-0 right-0 h-3 bg-foreground/10" />
                </span>
              </span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-end">
            <p className={`text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-xl transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              统一管理多个 AI 模型接口，智能负载均衡，实时监控用量，一站式 API 转发服务。
            </p>

            <div className={`flex flex-col sm:flex-row items-start gap-4 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
              <Link href="/register">
                <Button size="lg" className="bg-foreground hover:bg-foreground/90 text-background px-8 h-14 text-base rounded-full group">
                  Start free trial
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base rounded-full border-foreground/20 hover:bg-foreground/5">
                  View pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className={`absolute bottom-24 left-0 right-0 transition-all duration-700 delay-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <div className="flex gap-16 marquee whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-16">
                {[
                  { value: "99.9%", label: "uptime SLA", company: "GUARANTEED" },
                  { value: "40+", label: "AI providers", company: "SUPPORTED" },
                  { value: "23ms", label: "avg response", company: "LATENCY" },
                  { value: "10M+", label: "requests daily", company: "PROCESSED" },
                ].map((stat) => (
                  <div key={`${stat.company}-${i}`} className="flex items-baseline gap-4">
                    <span className="text-4xl lg:text-5xl font-display">{stat.value}</span>
                    <span className="text-sm text-muted-foreground">
                      {stat.label}
                      <span className="block font-mono text-xs mt-1">{stat.company}</span>
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24 lg:py-32 border-y border-foreground/10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <span className="inline-flex items-center gap-3 text-sm font-mono text-muted-foreground mb-6">
              <span className="w-8 h-px bg-foreground/30" />
              Core features
            </span>
            <h2 className="text-4xl lg:text-6xl font-display tracking-tight">
              Everything you need
              <br />
              to ship AI products.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-foreground/10">
            {[
              { title: "Multi-channel routing", desc: "支持 OpenAI、Claude、Gemini 等 40+ AI 模型接口统一管理和智能路由" },
              { title: "Load balancing", desc: "自动分配请求到最优渠道，基于延迟、成本和可用性智能调度" },
              { title: "Usage analytics", desc: "实时追踪 Token 消耗和费用，精细化额度管理和用量告警" },
            ].map((item, index) => (
              <div key={item.title} className="bg-background p-8 lg:p-12">
                <div className="text-sm font-mono text-muted-foreground mb-4">0{index + 1}</div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-foreground/10">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between">
          <span className="font-display text-lg">HonoAPI</span>
          <span className="text-sm text-muted-foreground">Powered by HonoAPI</span>
        </div>
      </footer>
    </main>
  )
}
