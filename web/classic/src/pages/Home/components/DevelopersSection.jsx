import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const codeExamples = [
  {
    label: 'Python',
    code: `from openai import OpenAI

client = OpenAI(
  api_key="sk-••••",
  base_url="https://api.example.com/v1"
)

response = client.chat.completions.create(
  model="gpt-4o",
  messages=[{"role": "user", "content": "Hi"}]
)`,
  },
  {
    label: 'Node.js',
    code: `import OpenAI from 'openai'

const client = new OpenAI({
  apiKey: 'sk-••••',
  baseURL: 'https://api.example.com/v1'
})

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hi' }]
})`,
  },
  {
    label: 'cURL',
    code: `curl -X POST "https://api.example.com/v1/chat/completions" \\
  -H "Authorization: Bearer sk-••••" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": "Hi"}
    ]
  }'`,
  },
];

const features = [
  { title: 'OpenAI 兼容', description: '完全兼容 OpenAI API 格式.' },
  { title: '零配置迁移', description: '只需修改 base_url 即可接入.' },
  { title: '多语言 SDK', description: '支持 Python、Node.js、Go 等.' },
  { title: '流式响应', description: '原生支持 SSE 流式输出.' },
];

const DevelopersSection = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeExamples[activeTab].code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <section ref={sectionRef} className='relative py-24 lg:py-32 overflow-hidden'>
      <div className='max-w-[1400px] mx-auto px-6 lg:px-12'>
        <div className='grid lg:grid-cols-2 gap-16 lg:gap-24 items-start'>
          {/* Left */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <span className='inline-flex items-center gap-3 text-sm font-mono-landing text-semi-color-text-2 mb-6'>
              <span className='w-8 h-px bg-semi-color-text-0 opacity-30' />
              {t('开发者优先')}
            </span>
            <h2 className='text-4xl lg:text-6xl font-display tracking-tight mb-6 text-semi-color-text-0'>
              {t('为开发者')}
              <br />
              <span className='text-semi-color-text-2'>{t('而生。')}</span>
            </h2>
            <p className='text-semi-color-text-2 text-lg leading-relaxed max-w-md mb-12'>
              {t('完全兼容 OpenAI SDK，无需修改业务代码，只需更换 base_url 即可无缝接入。')}
            </p>

            {/* Feature grid */}
            <div className='grid grid-cols-2 gap-6 mb-10'>
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={`transition-all duration-500 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${200 + index * 80}ms` }}
                >
                  <h4 className='text-sm font-display tracking-tight text-semi-color-text-0 mb-1'>
                    {t(feature.title)}
                  </h4>
                  <p className='text-xs text-semi-color-text-2 leading-relaxed'>
                    {t(feature.description)}
                  </p>
                </div>
              ))}
            </div>

            {/* Docs links */}
            <div className='flex items-center gap-6 text-sm'>
              <a
                href='/docs'
                className='text-semi-color-text-0 hover:underline underline-offset-4'
              >
                {t('查看文档')}
              </a>
              <span className='text-semi-color-text-2 opacity-30'>|</span>
              <a
                href='https://github.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-semi-color-text-2 hover:text-semi-color-text-0 transition-colors'
              >
                GitHub
              </a>
            </div>
          </div>

          {/* Right: Code block */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className='border border-semi-color-border bg-semi-color-bg-0 overflow-hidden'>
              {/* Tab bar */}
              <div className='flex items-center justify-between border-b border-semi-color-border px-4'>
                <div className='flex'>
                  {codeExamples.map((example, index) => (
                    <button
                      key={example.label}
                      onClick={() => setActiveTab(index)}
                      className={`relative px-4 py-3 text-xs font-mono-landing transition-all duration-200 ${
                        activeTab === index
                          ? 'text-semi-color-text-0'
                          : 'text-semi-color-text-2 hover:text-semi-color-text-0'
                      }`}
                    >
                      {example.label}
                      {activeTab === index && (
                        <span className='absolute bottom-0 left-0 right-0 h-px bg-semi-color-text-0' />
                      )}
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleCopy}
                  className='text-xs font-mono-landing text-semi-color-text-2 hover:text-semi-color-text-0 transition-colors duration-200 py-3'
                >
                  {copied ? t('已复制') : t('复制')}
                </button>
              </div>

              {/* Code content */}
              <div className='p-6 font-mono-landing text-sm leading-relaxed overflow-x-auto min-h-[220px] bg-semi-color-fill-0'>
                {codeExamples[activeTab].code.split('\n').map((line, i) => (
                  <div
                    key={`${activeTab}-${i}`}
                    className='code-line-reveal'
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <span className='inline-block w-6 text-semi-color-text-2 opacity-40 select-none text-xs'>
                      {i + 1}
                    </span>
                    <span className='text-semi-color-text-0'>
                      {line.split('').map((char, j) => (
                        <span
                          key={j}
                          className='code-char-reveal'
                          style={{ animationDelay: `${i * 60 + j * 15}ms` }}
                        >
                          {char === ' ' ? ' ' : char}
                        </span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .code-line-reveal {
          opacity: 0;
          transform: translateX(-8px);
          animation: devLineReveal 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes devLineReveal {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .code-char-reveal {
          opacity: 0;
          filter: blur(8px);
          animation: devCharReveal 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes devCharReveal {
          to {
            opacity: 1;
            filter: blur(0);
          }
        }
      `}</style>
    </section>
  );
};

export default DevelopersSection;
