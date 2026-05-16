import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const endpoints = [
  {
    number: 'I',
    title: 'OpenAI 兼容端点',
    description:
      '完全兼容 OpenAI Chat Completions API，无需修改现有代码即可接入.',
    code: `curl -X POST "/v1/chat/completions" \\
  -H "Authorization: Bearer sk-••••" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "stream": true,
    "messages": [
      { "role": "user", "content": "Hello" }
    ]
  }'`,
    filename: 'chat_completions',
  },
  {
    number: 'II',
    title: 'Responses 端点',
    description:
      '支持 OpenAI 最新的 Responses API，适用于需要工具调用和多步推理的场景.',
    code: `curl -X POST "/v1/responses" \\
  -H "Authorization: Bearer sk-••••" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-4o",
    "input": "Explain quantum computing",
    "tools": [{ "type": "web_search" }]
  }'`,
    filename: 'responses',
  },
  {
    number: 'III',
    title: 'Claude Messages 端点',
    description:
      '原生支持 Anthropic Messages API 格式，直接对接 Claude 系列模型.',
    code: `curl -X POST "/v1/messages" \\
  -H "x-api-key: sk-••••" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "claude-sonnet-4-20250514",
    "max_tokens": 1024,
    "messages": [
      { "role": "user", "content": "Hello" }
    ]
  }'`,
    filename: 'messages',
  },
  {
    number: 'IV',
    title: 'Gemini 端点',
    description:
      '兼容 Google Gemini API 格式，支持多模态输入和长上下文.',
    code: `curl -X POST "/v1/chat/completions" \\
  -H "Authorization: Bearer sk-••••" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-2.5-pro",
    "messages": [
      { "role": "user", "content": [
        { "type": "text", "text": "Describe this" },
        { "type": "image_url", "image_url": {...} }
      ]}
    ]
  }'`,
    filename: 'gemini',
  },
];

const HowItWorksSection = () => {
  const { t } = useTranslation();
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
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

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % endpoints.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className='relative py-24 lg:py-32 border-y border-semi-color-border overflow-hidden'
    >
      {/* Subtle grid pattern */}
      <div className='absolute inset-0 opacity-[0.03] pointer-events-none'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 40px,
              currentColor 40px,
              currentColor 41px
            )`,
          }}
        />
      </div>

      <div className='relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12'>
        {/* Header */}
        <div className='mb-16 lg:mb-24'>
          <span className='inline-flex items-center gap-3 text-sm font-mono-landing text-semi-color-text-2 mb-6'>
            <span className='w-8 h-px bg-semi-color-text-0 opacity-30' />
            {t('端点接入')}
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            {t('一个地址，')}
            <br />
            <span className='text-semi-color-text-2'>{t('所有格式.')}</span>
          </h2>
        </div>

        {/* Steps */}
        <div className='grid lg:grid-cols-[1fr,1.2fr] gap-12 lg:gap-24'>
          {/* Left: Step list */}
          <div className='space-y-0'>
            {endpoints.map((endpoint, index) => (
              <button
                key={endpoint.number}
                onClick={() => setActiveStep(index)}
                className={`group w-full text-left py-6 border-t border-semi-color-border transition-all duration-500 ${
                  activeStep === index ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                }`}
              >
                <div className='flex items-start gap-6'>
                  <span className='font-mono-landing text-sm mt-1 text-semi-color-text-2'>
                    {endpoint.number}
                  </span>
                  <div>
                    <h3 className='text-xl lg:text-2xl font-display mb-2 group-hover:translate-x-1 transition-transform duration-300'>
                      {t(endpoint.title)}
                    </h3>
                    <p className='text-sm leading-relaxed text-semi-color-text-2'>
                      {t(endpoint.description)}
                    </p>
                  </div>
                </div>
                {/* Progress bar */}
                <div className='mt-4 ml-10 h-px bg-semi-color-border overflow-hidden'>
                  <div
                    key={activeStep === index ? `active-${activeStep}` : `idle-${index}`}
                    className='h-full bg-semi-color-text-0'
                    style={
                      activeStep === index
                        ? { animation: 'progress 6s linear forwards' }
                        : { width: '0%' }
                    }
                  />
                </div>
              </button>
            ))}
          </div>

          {/* Right: Code preview */}
          <div className='relative'>
            <div className='sticky top-32 rounded-lg border border-semi-color-border overflow-hidden bg-semi-color-fill-0'>
              {/* Terminal header */}
              <div className='flex items-center gap-2 px-4 py-3 border-b border-semi-color-border'>
                <div className='w-3 h-3 rounded-full bg-semi-color-fill-2' />
                <div className='w-3 h-3 rounded-full bg-semi-color-fill-2' />
                <div className='w-3 h-3 rounded-full bg-semi-color-fill-2' />
                <span className='ml-4 text-xs font-mono-landing text-semi-color-text-2'>
                  {endpoints[activeStep].filename}
                </span>
              </div>
              {/* Code content */}
              <div className='p-6 font-mono-landing text-sm leading-relaxed'>
                {endpoints[activeStep].code.split('\n').map((line, i) => (
                  <div
                    key={`${activeStep}-${i}`}
                    className='code-line-reveal'
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <span className='inline-block w-6 text-semi-color-text-2 opacity-50 select-none'>
                      {i + 1}
                    </span>
                    {line.split('').map((char, j) => (
                      <span
                        key={j}
                        className='code-char-reveal'
                        style={{ animationDelay: `${i * 80 + j * 20}ms` }}
                      >
                        {char === ' ' ? ' ' : char}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .code-line-reveal {
          opacity: 0;
          transform: translateX(-8px);
          animation: lineReveal 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes lineReveal {
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .code-char-reveal {
          opacity: 0;
          filter: blur(8px);
          animation: charReveal 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes charReveal {
          to {
            opacity: 1;
            filter: blur(0);
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorksSection;
