import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const testimonials = [
  {
    quote: '接入只花了 5 分钟，完全兼容现有代码，体验非常丝滑.',
    author: 'Alex W.',
    role: '独立开发者',
    company: '',
    metric: '迁移耗时 5 分钟',
  },
  {
    quote: '终于不用为每个模型单独对接了，一个 Key 搞定所有.',
    author: '某技术团队',
    role: '后端工程师',
    company: '',
    metric: '对接效率提升 10x',
  },
  {
    quote: '稳定性超出预期，上线半年零故障，省心.',
    author: 'Kevin L.',
    role: '全栈开发者',
    company: '',
    metric: '99.99% 可用性',
  },
  {
    quote: '按量计费很透明，成本比直接调用官方 API 还低.',
    author: '匿名用户',
    role: 'AI 创业者',
    company: '',
    metric: '成本降低 40%',
  },
];

const companies = [
  'Team Alpha',
  'Studio X',
  'DevLab',
  'AI Works',
  'CodeFlow',
  'NextGen',
  'BuildKit',
  'OpenStack',
];

const TestimonialsSection = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [fading, setFading] = useState(false);
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
      setFading(true);
      setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
        setFading(false);
      }, 300);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (index) => {
    if (index === activeIndex) return;
    setFading(true);
    setTimeout(() => {
      setActiveIndex(index);
      setFading(false);
    }, 300);
  };

  const current = testimonials[activeIndex];

  return (
    <section
      ref={sectionRef}
      className='relative py-32 lg:py-40 border-t border-semi-color-border overflow-hidden'
    >
      <div className='max-w-[1400px] mx-auto px-6 lg:px-12'>
        {/* Header */}
        <div className='flex items-center gap-4 mb-16'>
          <span className='font-mono-landing text-xs tracking-widest text-semi-color-text-2 uppercase'>
            {t('用户评价')}
          </span>
          <div className='flex-1 h-px bg-semi-color-border' />
          <span className='font-mono-landing text-xs text-semi-color-text-2'>
            {String(activeIndex + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
          </span>
        </div>

        {/* Main testimonial */}
        <div
          className={`transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className='grid lg:grid-cols-12 gap-12 lg:gap-20'>
            {/* Quote + author (8 cols) */}
            <div className='lg:col-span-8'>
              <blockquote
                className={`transition-all duration-300 ${
                  fading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
              >
                <p className='font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight text-semi-color-text-0'>
                  "{t(current.quote)}"
                </p>
              </blockquote>

              {/* Author */}
              <div
                className={`mt-12 flex items-center gap-6 transition-all duration-300 delay-100 ${
                  fading ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <div className='w-16 h-16 rounded-full bg-semi-color-fill-0 border border-semi-color-border flex items-center justify-center'>
                  <span className='font-display text-2xl text-semi-color-text-0'>
                    {current.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className='text-lg font-medium text-semi-color-text-0'>
                    {t(current.author)}
                  </p>
                  <p className='text-semi-color-text-2'>
                    {t(current.role)}{current.company ? `，${t(current.company)}` : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Metric + nav dots (4 cols) */}
            <div className='lg:col-span-4 flex flex-col justify-center'>
              <div
                className={`p-8 border border-semi-color-border transition-all duration-300 ${
                  fading ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                }`}
              >
                <span className='font-mono-landing text-xs tracking-widest text-semi-color-text-2 uppercase block mb-4'>
                  {t('Key Result')}
                </span>
                <p className='font-display text-3xl md:text-4xl text-semi-color-text-0'>
                  {t(current.metric)}
                </p>
              </div>

              {/* Navigation dots */}
              <div className='flex gap-2 mt-8'>
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goTo(index)}
                    className={`h-2 transition-all duration-300 bg-semi-color-text-0 ${
                      activeIndex === index ? 'w-8 opacity-100' : 'w-2 opacity-20 hover:opacity-40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Trusted by label */}
        <div className='mt-24 pt-12 border-t border-semi-color-border'>
          <p className='font-mono-landing text-xs tracking-widest text-semi-color-text-2 uppercase mb-8 text-center'>
            {t('值得信赖的合作伙伴')}
          </p>
        </div>
      </div>

      {/* Full-width marquee outside container */}
      <div className='w-full overflow-hidden'>
        <div className='flex gap-16 items-center marquee'>
          {[...Array(2)].map((_, setIdx) => (
            <div key={setIdx} className='flex gap-16 items-center shrink-0'>
              {companies.map((company) => (
                <span
                  key={`${setIdx}-${company}`}
                  className='font-display text-xl md:text-2xl text-semi-color-text-2 whitespace-nowrap hover:text-semi-color-text-0 transition-colors duration-300'
                >
                  {t(company)}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
