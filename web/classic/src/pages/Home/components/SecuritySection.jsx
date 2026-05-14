import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, Eye, FileCheck } from 'lucide-react';

const securityFeatures = [
  {
    icon: Shield,
    title: '数据加密',
    description: 'AES-256 加密存储，TLS 1.3 传输加密，密钥定期轮换.',
  },
  {
    icon: Lock,
    title: '访问控制',
    description: '细粒度权限管理，支持 RBAC 和 API Key 隔离.',
  },
  {
    icon: Eye,
    title: '审计日志',
    description: '完整的操作审计追踪，实时异常检测与告警.',
  },
  {
    icon: FileCheck,
    title: '合规认证',
    description: '符合 GDPR、SOC 2 等国际安全标准.',
  },
];

const certifications = ['GDPR', 'SOC 2', 'ISO 27001', 'HIPAA', 'CCPA'];

const SecuritySection = () => {
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
    <section
      ref={sectionRef}
      className='relative py-24 lg:py-32 bg-semi-color-fill-0 overflow-hidden'
    >
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
              {t('安全与合规')}
            </span>
            <h2 className='text-4xl lg:text-6xl font-display tracking-tight mb-6 text-semi-color-text-0'>
              {t('企业级')}
              <br />
              <span className='text-semi-color-text-2'>{t('安全保障。')}</span>
            </h2>
            <p className='text-semi-color-text-2 text-lg leading-relaxed max-w-md mb-10'>
              {t('从数据加密到合规认证，我们为每一次 API 调用提供全方位的安全保障。')}
            </p>

            {/* Certifications */}
            <div className='flex flex-wrap gap-3'>
              {certifications.map((cert, index) => (
                <span
                  key={cert}
                  className={`inline-flex items-center px-4 py-2 border border-semi-color-border bg-semi-color-bg-0 text-sm font-mono-landing text-semi-color-text-0 transition-all duration-500 ${
                    isVisible
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${300 + index * 80}ms` }}
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Feature cards */}
          <div className='space-y-4'>
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className={`group flex items-start gap-5 p-6 border border-semi-color-border bg-semi-color-bg-0 transition-all duration-500 hover:border-semi-color-text-0 ${
                    isVisible
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 translate-x-8'
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className='flex-shrink-0 w-10 h-10 border border-semi-color-border bg-semi-color-fill-0 flex items-center justify-center transition-all duration-300 group-hover:bg-semi-color-text-0 group-hover:border-semi-color-text-0'>
                    <Icon
                      size={18}
                      className='text-semi-color-text-0 transition-colors duration-300 group-hover:text-semi-color-bg-0'
                    />
                  </div>
                  <div>
                    <h3 className='text-base font-display tracking-tight text-semi-color-text-0 mb-1 transition-transform duration-300 group-hover:translate-x-1'>
                      {t(feature.title)}
                    </h3>
                    <p className='text-sm text-semi-color-text-2 leading-relaxed'>
                      {t(feature.description)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
