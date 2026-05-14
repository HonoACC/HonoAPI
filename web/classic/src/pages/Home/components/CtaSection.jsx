import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@douyinfe/semi-ui';
import { IconArrowRight } from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimatedTetrahedron from './AnimatedTetrahedron';

const CtaSection = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <section ref={sectionRef} className='relative py-24 lg:py-32 overflow-hidden'>
      <div className='max-w-[1400px] mx-auto px-6 lg:px-12'>
        <div
          className={`relative border border-semi-color-text-0 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          onMouseMove={handleMouseMove}
        >
          {/* Spotlight effect */}
          <div
            className='absolute inset-0 opacity-10 pointer-events-none transition-opacity duration-300'
            style={{
              background: `radial-gradient(600px circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(128,128,128,0.15), transparent 40%)`,
            }}
          />

          <div className='relative z-10 px-8 lg:px-16 py-16 lg:py-24'>
            <div className='flex flex-col lg:flex-row items-center justify-between gap-12'>
              {/* Left content */}
              <div className='flex-1'>
                <h2 className='text-4xl lg:text-7xl font-display tracking-tight mb-8 leading-[0.95]'>
                  {t('准备好进入')}
                  <br />
                  {t('AI 时代了吗？')}
                </h2>

                <p className='text-xl text-semi-color-text-2 mb-12 leading-relaxed max-w-xl'>
                  {t(
                    '三分钟极速接入体验。',
                  )}
                </p>

                <div className='flex flex-col sm:flex-row items-start gap-4'>
                  <Link to='/console'>
                    <Button
                      theme='solid'
                      type='tertiary'
                      size='large'
                      className='!rounded-full !px-8 !h-14 !text-base !bg-semi-color-text-0 !text-semi-color-bg-0 hover:opacity-90 !border-none group'
                      icon={
                        <IconArrowRight className='transition-transform group-hover:translate-x-1' />
                      }
                      iconPosition='right'
                    >
                      {t('即刻体验')}
                    </Button>
                  </Link>
                  <Link to='/pricing'>
                    <Button
                      size='large'
                      className='!rounded-full !h-14 !px-8 !text-base !text-semi-color-text-0 !border-semi-color-text-2 hover:!bg-semi-color-fill-0'
                    >
                      {t('查看定价')}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right: Animated Tetrahedron */}
              <div className='hidden lg:flex items-center justify-center w-[500px] h-[500px] -mr-16'>
                <AnimatedTetrahedron />
              </div>
            </div>
          </div>

          {/* Decorative corners */}
          <div className='absolute top-0 right-0 w-32 h-32 border-b border-l border-semi-color-border' />
          <div className='absolute bottom-0 left-0 w-32 h-32 border-t border-r border-semi-color-border' />
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
