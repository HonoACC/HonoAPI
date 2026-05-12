import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconBolt, IconShield, IconGlobe, IconCode, IconMonitorStroked, IconPriceTag, IconUserGroup, IconLikeHeart } from '@douyinfe/semi-icons';
import AnimateInView from '../../../components/common/AnimateInView';

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      id: 'fast',
      title: t('极速响应'),
      desc: t('优化的网络架构确保毫秒级响应时间'),
      span: 'md:col-span-2',
      icon: <IconBolt style={{ color: '#60a5fa' }} />,
      visual: (
        <div className='mt-4 grid grid-cols-3 gap-2'>
          {['OpenAI', 'Claude', 'Gemini', 'DeepSeek', 'Qwen', 'Llama'].map((name) => (
            <div
              key={name}
              className='flex items-center justify-center rounded-lg border border-semi-color-border px-3 py-2 text-xs text-semi-color-text-2 transition-colors hover:border-blue-500/30'
            >
              {name}
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'secure',
      title: t('安全可靠'),
      desc: t('企业级安全性，全面的权限管理'),
      span: 'md:col-span-1',
      icon: <IconShield style={{ color: '#10b981' }} />,
      visual: (
        <div className='mt-4 flex items-center justify-center'>
          <div className='flex w-16 h-16 items-center justify-center rounded-2xl' style={{ background: 'rgba(16,185,129,0.05)' }}>
            <IconShield style={{ fontSize: 28, color: 'rgba(16,185,129,0.7)' }} />
          </div>
        </div>
      ),
    },
    {
      id: 'global',
      title: t('全球覆盖'),
      desc: t('多区域部署，智能路由确保最佳连接'),
      span: 'md:col-span-1',
      icon: <IconGlobe style={{ color: '#f59e0b' }} />,
      visual: null,
    },
    {
      id: 'compatible',
      title: t('广泛兼容'),
      desc: t('兼容 OpenAI、Claude、Gemini 等主流 API 格式'),
      span: 'md:col-span-2',
      icon: <IconCode style={{ color: '#8b5cf6' }} />,
      visual: (
        <div className='mt-4 flex gap-2 flex-wrap'>
          {['/v1/chat/completions', '/v1/embeddings', '/v1/images', '/v1/audio'].map((route) => (
            <span
              key={route}
              className='rounded-md px-2 py-1 text-xs font-mono text-semi-color-text-2 border border-semi-color-border'
            >
              {route}
            </span>
          ))}
        </div>
      ),
    },
  ];

  const additionalFeatures = [
    { icon: <IconMonitorStroked style={{ fontSize: 20 }} />, title: t('实时监控'), desc: t('全面的使用分析和日志') },
    { icon: <IconPriceTag style={{ fontSize: 20 }} />, title: t('灵活计费'), desc: t('按量计费，支持多种定价策略') },
    { icon: <IconUserGroup style={{ fontSize: 20 }} />, title: t('多用户管理'), desc: t('团队协作，权限分级') },
    { icon: <IconLikeHeart style={{ fontSize: 20 }} />, title: t('开源免费'), desc: t('AGPL 开源，社区驱动') },
  ];

  return (
    <section className='relative z-10 px-6 py-24 md:py-32'>
      <div className='mx-auto max-w-6xl'>
        <AnimateInView className='mb-16 text-center md:mb-20'>
          <p className='text-semi-color-text-2 mb-3 text-xs font-medium tracking-widest uppercase'>
            {t('核心功能')}
          </p>
          <h2 className='text-2xl font-bold tracking-tight md:text-3xl text-semi-color-text-0'>
            {t('为什么选择我们')}
          </h2>
        </AnimateInView>

        {/* Bento grid */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6'>
          {features.map((f, i) => (
            <AnimateInView
              key={f.id}
              delay={i * 100}
              animation='fade-up'
              className={`group rounded-2xl border border-semi-color-border p-6 transition-colors hover:border-blue-500/20 ${f.span}`}
            >
              <div className='flex items-center gap-3 mb-2'>
                <span className='flex items-center justify-center w-8 h-8 rounded-lg border border-semi-color-border'>
                  {f.icon}
                </span>
                <h3 className='text-sm font-semibold text-semi-color-text-0'>{f.title}</h3>
              </div>
              <p className='text-semi-color-text-2 text-sm leading-relaxed'>{f.desc}</p>
              {f.visual}
            </AnimateInView>
          ))}
        </div>

        {/* Additional features */}
        <div className='mt-12 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12'>
          {additionalFeatures.map((f, i) => (
            <AnimateInView
              key={f.title}
              delay={i * 100}
              animation='fade-up'
              className='flex flex-col items-center text-center'
            >
              <div className='text-semi-color-text-2 mb-3 flex w-12 h-12 items-center justify-center rounded-xl border border-semi-color-border'>
                {f.icon}
              </div>
              <h3 className='mb-1.5 text-sm font-semibold text-semi-color-text-0'>{f.title}</h3>
              <p className='text-semi-color-text-2 max-w-[200px] text-xs leading-relaxed'>{f.desc}</p>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
