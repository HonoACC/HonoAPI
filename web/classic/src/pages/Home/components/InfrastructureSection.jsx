import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const locations = [
  { city: 'US West', region: '硅谷', latency: '12ms' },
  { city: 'US East', region: '弗吉尼亚', latency: '18ms' },
  { city: 'Europe', region: '法兰克福', latency: '24ms' },
  { city: 'Asia Pacific', region: '东京', latency: '32ms' },
  { city: 'China', region: '香港', latency: '8ms' },
  { city: 'Oceania', region: '悉尼', latency: '45ms' },
];

const stats = [
  { value: '6', label: '个区域' },
  { value: '99.99%', label: '可用性' },
  { value: '<50ms', label: '全球延迟' },
];

const InfrastructureSection = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [activeRow, setActiveRow] = useState(0);
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
      setActiveRow((prev) => (prev + 1) % locations.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={sectionRef} className='relative py-24 lg:py-32 overflow-hidden'>
      <div className='max-w-[1400px] mx-auto px-6 lg:px-12'>
        <div className='grid lg:grid-cols-2 gap-16 lg:gap-24 items-center'>
          {/* Left */}
          <div
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <span className='inline-flex items-center gap-3 text-sm font-mono-landing text-semi-color-text-2 mb-6'>
              <span className='w-8 h-px bg-semi-color-text-0 opacity-30' />
              {t('基础设施')}
            </span>
            <h2 className='text-4xl lg:text-6xl font-display tracking-tight mb-6 text-semi-color-text-0'>
              {t('全球化部署。')}
            </h2>
            <p className='text-semi-color-text-2 text-lg leading-relaxed max-w-md mb-12'>
              {t('遍布全球的边缘节点网络，让每一次 API 请求都以最低延迟到达最近的数据中心。')}
            </p>

            {/* Stats */}
            <div className='grid grid-cols-3 gap-6'>
              {stats.map((stat) => (
                <div key={stat.label} className='border-t border-semi-color-border pt-6'>
                  <div className='text-3xl lg:text-4xl font-display tracking-tight text-semi-color-text-0 mb-1'>
                    {stat.value}
                  </div>
                  <div className='text-sm text-semi-color-text-2 font-mono-landing'>
                    {t(stat.label)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right */}
          <div
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className='border border-semi-color-border bg-semi-color-bg-0 overflow-hidden'>
              {/* Card header */}
              <div className='flex items-center justify-between px-6 py-4 border-b border-semi-color-border'>
                <span className='font-mono-landing text-sm text-semi-color-text-0'>
                  {t('Edge Network')}
                </span>
                <span className='flex items-center gap-2 text-xs font-mono-landing text-semi-color-text-2'>
                  <span className='relative flex h-2 w-2'>
                    <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75' />
                    <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500' />
                  </span>
                  {t('All operational')}
                </span>
              </div>

              {/* Table header */}
              <div className='grid grid-cols-3 px-6 py-3 border-b border-semi-color-border'>
                <span className='text-xs font-mono-landing text-semi-color-text-2 uppercase tracking-wider'>
                  {t('区域')}
                </span>
                <span className='text-xs font-mono-landing text-semi-color-text-2 uppercase tracking-wider'>
                  {t('节点')}
                </span>
                <span className='text-xs font-mono-landing text-semi-color-text-2 uppercase tracking-wider text-right'>
                  {t('延迟')}
                </span>
              </div>

              {/* Rows */}
              {locations.map((loc, index) => (
                <div
                  key={loc.city}
                  className={`grid grid-cols-3 px-6 py-4 border-b border-semi-color-border last:border-b-0 transition-all duration-500 ${
                    activeRow === index
                      ? 'bg-semi-color-fill-0'
                      : 'bg-transparent'
                  }`}
                >
                  <span
                    className={`text-sm font-mono-landing transition-colors duration-500 ${
                      activeRow === index
                        ? 'text-semi-color-text-0'
                        : 'text-semi-color-text-2'
                    }`}
                  >
                    {loc.city}
                  </span>
                  <span
                    className={`text-sm transition-colors duration-500 ${
                      activeRow === index
                        ? 'text-semi-color-text-0'
                        : 'text-semi-color-text-2'
                    }`}
                  >
                    {t(loc.region)}
                  </span>
                  <span
                    className={`text-sm font-mono-landing text-right transition-colors duration-500 ${
                      activeRow === index
                        ? 'text-semi-color-text-0'
                        : 'text-semi-color-text-2'
                    }`}
                  >
                    {loc.latency}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InfrastructureSection;
