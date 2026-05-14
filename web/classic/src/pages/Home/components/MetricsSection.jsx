import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

function AnimatedCounter({ end, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const startTime = performance.now();

          const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, hasAnimated]);

  return (
    <div ref={ref} className='text-6xl lg:text-8xl font-display tracking-tight'>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </div>
  );
}

const metrics = [
  {
    value: 1087,
    suffix: ' M',
    prefix: '',
    label: '今日 Tokens 消耗数',
  },
  {
    value: 99,
    suffix: '.99%',
    prefix: '',
    label: '本季度可用性',
  },
  {
    value: 23,
    suffix: 'ms',
    prefix: '',
    label: '平均响应时间',
  },
  {
    value: 184,
    suffix: '',
    prefix: '',
    label: '服务国家/地区',
  },
];

const MetricsSection = () => {
  const { t } = useTranslation();
  const [time, setTime] = useState(new Date());
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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
    <section
      ref={sectionRef}
      className='relative py-24 lg:py-32 border-y border-semi-color-border'
    >
      <div className='max-w-[1400px] mx-auto px-6 lg:px-12'>
        {/* Header */}
        <div className='flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-24'>
          <div>
            <span className='inline-flex items-center gap-3 text-sm font-mono-landing text-semi-color-text-2 mb-6'>
              <span className='w-8 h-px bg-semi-color-text-0 opacity-30' />
              {t('实时数据')}
            </span>
            <h2
              className={`text-4xl lg:text-6xl font-display tracking-tight transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
            >
              {t('可量化的')}
              <br />
              {t('性能表现。')}
            </h2>
          </div>
          <div className='flex items-center gap-4 font-mono-landing text-sm text-semi-color-text-2'>
            <span className='flex items-center gap-2'>
              <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse' />
              Live
            </span>
            <span className='text-semi-color-text-0 opacity-30'>|</span>
            <span>{time.toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-px bg-semi-color-border'>
          {metrics.map((metric, index) => (
            <div
              key={metric.label}
              className={`bg-semi-color-bg-0 p-8 lg:p-12 transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <AnimatedCounter
                end={typeof metric.value === 'number' ? metric.value : 0}
                suffix={metric.suffix}
                prefix={metric.prefix}
              />
              <div className='mt-4 text-lg text-semi-color-text-2'>
                {t(metric.label)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MetricsSection;
