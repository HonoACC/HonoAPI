import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ArrowRight } from 'lucide-react';

const plans = [
  {
    number: '01',
    name: '免费版',
    description: '适合个人开发者和小型项目',
    price: { monthly: 0, annual: 0 },
    features: [
      '每日 100 次请求',
      '3 个 API Key',
      '社区支持',
      '基础模型访问',
      '请求日志 7 天',
    ],
    cta: '免费开始',
    popular: false,
  },
  {
    number: '02',
    name: '专业版',
    description: '适合成长中的团队和企业',
    price: { monthly: 99, annual: 79 },
    features: [
      '无限请求',
      '无限 API Key',
      '优先支持',
      '全部模型访问',
      '请求日志 90 天',
      '团队协作',
      '自定义限速',
    ],
    cta: '开始试用',
    popular: true,
  },
  {
    number: '03',
    name: '企业版',
    description: '适合大规模部署',
    price: { monthly: null, annual: null },
    features: [
      '专业版全部功能',
      '私有化部署',
      '7×24 专属支持',
      '自定义集成',
      'SLA 保障',
      '安全审计',
      '专属客户经理',
      '定制合同',
    ],
    cta: '联系销售',
    popular: false,
  },
];

const PricingSection = () => {
  const { t } = useTranslation();
  const [isAnnual, setIsAnnual] = useState(false);
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
        <div className='mb-16 lg:mb-20'>
          <span className='inline-flex items-center gap-3 text-sm font-mono-landing text-semi-color-text-2 mb-6'>
            <span className='w-8 h-px bg-semi-color-text-0 opacity-30' />
            {t('定价')}
          </span>
          <div className='flex flex-col sm:flex-row sm:items-end gap-6 justify-between'>
            <h2
              className={`text-4xl lg:text-6xl font-display tracking-tight text-semi-color-text-0 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {t('简单透明的')}
              <br />
              <span className='text-semi-color-text-2'>{t('定价方案。')}</span>
            </h2>

            {/* Toggle */}
            <div className='flex items-center gap-3 flex-shrink-0'>
              <span
                className={`text-sm font-mono-landing transition-colors duration-200 ${
                  !isAnnual ? 'text-semi-color-text-0' : 'text-semi-color-text-2'
                }`}
              >
                {t('月付')}
              </span>
              <button
                onClick={() => setIsAnnual((v) => !v)}
                className={`relative w-12 h-6 rounded-full border transition-colors duration-300 ${
                  isAnnual
                    ? 'bg-semi-color-text-0 border-semi-color-text-0'
                    : 'bg-transparent border-semi-color-border'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${
                    isAnnual
                      ? 'left-6 bg-semi-color-bg-0'
                      : 'left-0.5 bg-semi-color-text-0'
                  }`}
                />
              </button>
              <span
                className={`text-sm font-mono-landing transition-colors duration-200 ${
                  isAnnual ? 'text-semi-color-text-0' : 'text-semi-color-text-2'
                }`}
              >
                {t('年付')}
              </span>
              {isAnnual && (
                <span className='text-xs font-mono-landing px-2 py-0.5 rounded-full bg-semi-color-text-0 text-semi-color-bg-0'>
                  {t('Save 17%')}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Plans grid */}
        <div className='grid md:grid-cols-3 gap-6 items-stretch'>
          {plans.map((plan, index) => {
            const price = isAnnual ? plan.price.annual : plan.price.monthly;
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-xl border transition-all duration-700 ${
                  plan.popular
                    ? 'border-2 border-semi-color-text-0 -my-4 bg-semi-color-bg-0 shadow-lg'
                    : 'border-semi-color-border bg-semi-color-bg-0'
                } ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
                    <span className='px-4 py-1 rounded-full bg-semi-color-text-0 text-semi-color-bg-0 text-xs font-mono-landing whitespace-nowrap'>
                      {t('Most Popular')}
                    </span>
                  </div>
                )}

                <div className='p-8 flex flex-col flex-1'>
                  {/* Plan header */}
                  <div className='mb-8'>
                    <span className='text-xs font-mono-landing text-semi-color-text-2 mb-3 block'>
                      {plan.number}
                    </span>
                    <h3 className='text-xl font-display tracking-tight text-semi-color-text-0 mb-2'>
                      {t(plan.name)}
                    </h3>
                    <p className='text-sm text-semi-color-text-2'>
                      {t(plan.description)}
                    </p>
                  </div>

                  {/* Price */}
                  <div className='mb-8 border-t border-semi-color-border pt-8'>
                    {price === null ? (
                      <div className='text-3xl font-display tracking-tight text-semi-color-text-0'>
                        {t('定制')}
                      </div>
                    ) : (
                      <div className='flex items-end gap-1'>
                        <span className='text-4xl font-display tracking-tight text-semi-color-text-0'>
                          {price === 0 ? t('免费') : `¥${price}`}
                        </span>
                        {price !== 0 && (
                          <span className='text-sm text-semi-color-text-2 mb-1 font-mono-landing'>
                            /{t('月')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className='space-y-3 mb-10 flex-1'>
                    {plan.features.map((feature) => (
                      <li key={feature} className='flex items-start gap-3'>
                        <Check
                          size={14}
                          className='text-semi-color-text-0 flex-shrink-0 mt-0.5'
                        />
                        <span className='text-sm text-semi-color-text-2'>
                          {t(feature)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-mono-landing transition-all duration-200 ${
                      plan.popular
                        ? 'bg-semi-color-text-0 text-semi-color-bg-0 hover:opacity-90'
                        : 'border border-semi-color-border text-semi-color-text-0 hover:border-semi-color-text-0 hover:bg-semi-color-fill-0'
                    }`}
                  >
                    {t(plan.cta)}
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer note */}
        <p className='text-center text-sm text-semi-color-text-2 font-mono-landing mt-12'>
          {t('所有套餐均含 14 天免费试用，无需绑定信用卡。')}
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
