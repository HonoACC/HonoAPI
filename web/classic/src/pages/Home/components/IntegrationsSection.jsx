import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as LobeIcons from '@lobehub/icons';

const {
  OpenAI,
  Claude,
  Gemini,
  DeepSeek,
  Qwen,
  Zhipu,
  Mistral,
  Moonshot,
  Perplexity,
  Doubao,
  XAI,
  Cohere,
  Minimax,
  Meta,
  Ollama,
  OpenRouter,
  Hunyuan,
  Yi,
  SiliconCloud,
  Spark,
} = LobeIcons;

const providers = [
  { name: 'OpenAI', Icon: OpenAI },
  { name: 'Claude', Icon: Claude },
  { name: 'Gemini', Icon: Gemini },
  { name: 'DeepSeek', Icon: DeepSeek },
  { name: 'Qwen', Icon: Qwen },
  { name: 'Zhipu', Icon: Zhipu },
  { name: 'Mistral', Icon: Mistral },
  { name: 'Moonshot', Icon: Moonshot },
  { name: 'Perplexity', Icon: Perplexity },
  { name: 'Doubao', Icon: Doubao },
  { name: 'xAI', Icon: XAI },
  { name: 'Cohere', Icon: Cohere },
  { name: 'MiniMax', Icon: Minimax },
  { name: 'Meta', Icon: Meta },
  { name: 'Ollama', Icon: Ollama },
  { name: 'OpenRouter', Icon: OpenRouter },
  { name: 'Hunyuan', Icon: Hunyuan },
  { name: 'Yi', Icon: Yi },
  { name: 'SiliconCloud', Icon: SiliconCloud },
  { name: 'Spark', Icon: Spark },
];

const IntegrationsSection = () => {
  const { t } = useTranslation();
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

  return (
    <section ref={sectionRef} className='relative py-24 lg:py-32 overflow-hidden'>
      <div className='max-w-[1400px] mx-auto px-6 lg:px-12'>
        {/* Header */}
        <div
          className={`text-center max-w-3xl mx-auto mb-16 lg:mb-24 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className='inline-flex items-center gap-3 text-sm font-mono-landing text-semi-color-text-2 mb-6'>
            <span className='w-8 h-px bg-semi-color-text-0 opacity-30' />
            {t('生态集成')}
            <span className='w-8 h-px bg-semi-color-text-0 opacity-30' />
          </span>
          <h2 className='text-4xl lg:text-6xl font-display tracking-tight mb-6'>
            {t('支持众多的')}
            <br />
            {t('大模型供应商。')}
          </h2>
          <p className='text-xl text-semi-color-text-2'>
            {t('30+ 预置集成，几秒内连接全球 AI 大模型。')}
          </p>
        </div>
      </div>

      {/* Full-width marquees */}
      <div className='w-full mb-6'>
        <div className='flex gap-6 marquee'>
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className='flex gap-6 shrink-0'>
              {providers.slice(0, 10).map((provider) => (
                <div
                  key={`${provider.name}-${setIndex}`}
                  className='shrink-0 px-8 py-6 border border-semi-color-border hover:border-semi-color-text-2 transition-all duration-300 group flex items-center gap-4'
                >
                  <provider.Icon size={24} className='opacity-60 group-hover:opacity-100 transition-opacity grayscale' />
                  <span className='text-lg font-medium text-semi-color-text-0 group-hover:translate-x-1 transition-transform'>
                    {provider.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Reverse marquee */}
      <div className='w-full'>
        <div className='flex gap-6 marquee-reverse'>
          {[...Array(2)].map((_, setIndex) => (
            <div key={setIndex} className='flex gap-6 shrink-0'>
              {providers.slice(10).map((provider) => (
                <div
                  key={`${provider.name}-reverse-${setIndex}`}
                  className='shrink-0 px-8 py-6 border border-semi-color-border hover:border-semi-color-text-2 transition-all duration-300 group flex items-center gap-4'
                >
                  <provider.Icon size={24} className='opacity-60 group-hover:opacity-100 transition-opacity grayscale' />
                  <span className='text-lg font-medium text-semi-color-text-0 group-hover:translate-x-1 transition-transform'>
                    {provider.name}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
