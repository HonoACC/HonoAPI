export default function AboutPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 noise-overlay">
      <div className="max-w-2xl text-center space-y-4">
        <h1 className="text-4xl font-display font-semibold">关于</h1>
        <p className="text-muted-foreground">
          HonoAPI 是一个开源的 AI API 管理和分发平台，支持多种大语言模型接口的统一管理、负载均衡和用量监控。
        </p>
      </div>
    </main>
  )
}
