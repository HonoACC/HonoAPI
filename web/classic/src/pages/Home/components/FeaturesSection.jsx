import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const getFeatures = (t) => [
  {
    number: '01',
    title: t('实时监控'),
    description: t('按量付费，实时监控使用情况.'),
    visual: 'deploy',
  },
  {
    number: '02',
    title: t('能力聚合'),
    description: t('聚合市面上主流 AI 能力，通过一个 API Key 即可调用所有大模型.'),
    visual: 'ai',
  },
  {
    number: '03',
    title: t('团队协作'),
    description: t('多用户管理，灵活分配权限.'),
    visual: 'collab',
  },
  {
    number: '04',
    title: t('隐私保护'),
    description: t('本站以保护用户隐私为己任，提供企业级安全性，绝不收集用户数据.'),
    visual: 'security',
  },
];

function DeployVisual() {
  return (
    <svg viewBox='0 0 200 160' className='w-full h-full'>
      <defs>
        <clipPath id='deployClip'>
          <rect x='30' y='20' width='140' height='120' rx='4' />
        </clipPath>
      </defs>
      <rect
        x='30'
        y='20'
        width='140'
        height='120'
        rx='4'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
      />
      <g clipPath='url(#deployClip)'>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x='40' y={35 + i * 16} width='120' height='10' rx='2' fill='currentColor' opacity='0.15'>
            <animate attributeName='opacity' values='0.15;0.8;0.15' dur='2s' begin={`${i * 0.15}s`} repeatCount='indefinite' />
            <animate attributeName='width' values='20;120;20' dur='2s' begin={`${i * 0.15}s`} repeatCount='indefinite' />
          </rect>
        ))}
      </g>
      <circle cx='100' cy='155' r='3' fill='currentColor' opacity='0.3'>
        <animate attributeName='opacity' values='0.3;1;0.3' dur='1s' repeatCount='indefinite' />
      </circle>
    </svg>
  );
}

function AIVisual() {
  return (
    <svg viewBox='0 0 200 160' className='w-full h-full'>
      <circle cx='100' cy='80' r='12' fill='currentColor'>
        <animate attributeName='r' values='12;14;12' dur='2s' repeatCount='indefinite' />
      </circle>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * 60) * (Math.PI / 180);
        const radius = 50;
        return (
          <g key={i}>
            <line
              x1='100'
              y1='80'
              x2={100 + Math.cos(angle) * radius}
              y2={80 + Math.sin(angle) * radius}
              stroke='currentColor'
              strokeWidth='1'
              opacity='0.3'
            >
              <animate attributeName='opacity' values='0.3;0.8;0.3' dur='2s' begin={`${i * 0.3}s`} repeatCount='indefinite' />
            </line>
            <circle
              cx={100 + Math.cos(angle) * radius}
              cy={80 + Math.sin(angle) * radius}
              r='6'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
            >
              <animate attributeName='r' values='6;8;6' dur='2s' begin={`${i * 0.3}s`} repeatCount='indefinite' />
            </circle>
          </g>
        );
      })}
      <circle cx='100' cy='80' r='30' fill='none' stroke='currentColor' strokeWidth='1' opacity='0'>
        <animate attributeName='r' values='20;60' dur='2s' repeatCount='indefinite' />
        <animate attributeName='opacity' values='0.5;0' dur='2s' repeatCount='indefinite' />
      </circle>
    </svg>
  );
}

function CollabVisual() {
  return (
    <svg viewBox='0 0 200 160' className='w-full h-full'>
      <g>
        <rect x='30' y='50' width='50' height='60' rx='4' fill='none' stroke='currentColor' strokeWidth='2' />
        <text x='55' y='85' textAnchor='middle' fontSize='20' fontFamily='monospace' fill='currentColor'>A</text>
        <circle cx='55' cy='35' r='12' fill='none' stroke='currentColor' strokeWidth='2' />
      </g>
      <g>
        <rect x='120' y='50' width='50' height='60' rx='4' fill='none' stroke='currentColor' strokeWidth='2' />
        <text x='145' y='85' textAnchor='middle' fontSize='20' fontFamily='monospace' fill='currentColor'>B</text>
        <circle cx='145' cy='35' r='12' fill='none' stroke='currentColor' strokeWidth='2' />
      </g>
      <line x1='80' y1='80' x2='120' y2='80' stroke='currentColor' strokeWidth='2' strokeDasharray='4 4'>
        <animate attributeName='stroke-dashoffset' values='0;-8' dur='1s' repeatCount='indefinite' />
      </line>
      <circle cx='100' cy='80' r='4' fill='currentColor'>
        <animate attributeName='cx' values='85;115;85' dur='2s' repeatCount='indefinite' />
      </circle>
    </svg>
  );
}

function SecurityVisual() {
  return (
    <svg viewBox='0 0 200 160' className='w-full h-full'>
      <path
        d='M100 20 L140 40 L140 80 C140 110 120 130 100 140 C80 130 60 110 60 80 L60 40 Z'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
      />
      <path
        d='M100 50 L120 60 L120 80 C120 95 110 105 100 110 C90 105 80 95 80 80 L80 60 Z'
        fill='currentColor'
        opacity='0.1'
      >
        <animate attributeName='opacity' values='0.1;0.3;0.1' dur='3s' repeatCount='indefinite' />
      </path>
      <polyline
        points='88,80 96,88 112,72'
        fill='none'
        stroke='currentColor'
        strokeWidth='3'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

function AnimatedVisual({ type }) {
  switch (type) {
    case 'deploy':
      return <DeployVisual />;
    case 'ai':
      return <AIVisual />;
    case 'collab':
      return <CollabVisual />;
    case 'security':
      return <SecurityVisual />;
    default:
      return null;
  }
}

function FeatureCard({ feature, index }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group border-t border-semi-color-border py-12 lg:py-16 transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className='grid lg:grid-cols-[1fr,1fr] gap-8 lg:gap-16 items-center'>
        <div>
          <span className='font-mono-landing text-xs text-semi-color-text-2 mb-4 block'>
            {feature.number}
          </span>
          <h3 className='text-2xl lg:text-3xl font-display tracking-tight mb-4 group-hover:translate-x-2 transition-transform duration-300'>
            {feature.title}
          </h3>
          <p className='text-semi-color-text-2 text-lg leading-relaxed max-w-md'>
            {feature.description}
          </p>
        </div>
        <div className='flex justify-center lg:justify-end'>
          <div className='w-48 h-40 text-semi-color-text-0'>
            <AnimatedVisual type={feature.visual} />
          </div>
        </div>
      </div>
    </div>
  );
}

const FeaturesSection = () => {
  const { t } = useTranslation();
  const features = getFeatures(t);
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
    <section ref={sectionRef} className='relative py-24 lg:py-32'>
      <div className='max-w-[1400px] mx-auto px-6 lg:px-12'>
        {/* Header */}
        <div className='mb-16 lg:mb-24'>
          <span className='inline-flex items-center gap-3 text-sm font-mono-landing text-semi-color-text-2 mb-6'>
            <span className='w-8 h-px bg-semi-color-text-0 opacity-30' />
            {t('核 心 功 能')}
          </span>
          <h2
            className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
              isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
          >
            {t('你需要的一切。')}
            <br />
            <span className='text-semi-color-text-2'>
              {t('仅此而已。')}
            </span>
          </h2>
        </div>

        {/* Features List */}
        <div>
          {features.map((feature, index) => (
            <FeatureCard key={feature.number} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
