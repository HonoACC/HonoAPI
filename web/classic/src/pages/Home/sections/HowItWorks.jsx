import React from 'react';
import { useTranslation } from 'react-i18next';
import { IconSetting, IconBolt, IconMonitorStroked } from '@douyinfe/semi-icons';
import AnimateInView from '../../../components/common/AnimateInView';

const HowItWorks = () => {
  const { t } = useTranslation();

  const steps = [
    {
      num: '1',
      title: t('配置'),
      desc: t('添加 API 密钥，设置渠道并配置访问权限'),
      icon: <IconSetting style={{ fontSize: 24 }} />,
    },
    {
      num: '2',
      title: t('连接'),
      desc: t('通过 OpenAI、Claude、Gemini 等兼容 API 路由连接'),
      icon: <IconBolt style={{ fontSize: 24 }} />,
    },
    {
      num: '3',
      title: t('监控'),
      desc: t('通过实时分析跟踪使用量、成本和性能'),
      icon: <IconMonitorStroked style={{ fontSize: 24 }} />,
    },
  ];

  return (
    <section className='relative z-10 border-t border-semi-color-border px-6 py-24 md:py-32'>
      <div className='mx-auto max-w-6xl'>
        <AnimateInView className='mb-16 text-center md:mb-20'>
          <p className='text-semi-color-text-2 mb-3 text-xs font-medium tracking-widest uppercase'>
            {t('使用流程')}
          </p>
          <h2 className='text-2xl font-bold tracking-tight md:text-3xl text-semi-color-text-0'>
            {t('三步开始使用')}
          </h2>
        </AnimateInView>

        <div className='grid gap-8 md:grid-cols-3 md:gap-12'>
          {steps.map((step, i) => (
            <AnimateInView
              key={step.num}
              delay={i * 150}
              animation='fade-up'
              className='relative flex flex-col items-center text-center'
            >
              <div className='relative mb-6'>
                <div
                  className='flex w-16 h-16 items-center justify-center rounded-2xl border border-semi-color-border text-semi-color-text-2'
                >
                  {step.icon}
                </div>
                <div
                  className='absolute -top-2 -right-2 flex w-6 h-6 items-center justify-center rounded-full text-xs font-bold'
                  style={{ background: 'var(--semi-color-text-0)', color: 'var(--semi-color-bg-0)' }}
                >
                  {step.num}
                </div>
              </div>
              <h3 className='mb-2 text-base font-semibold text-semi-color-text-0'>{step.title}</h3>
              <p className='text-semi-color-text-2 max-w-[240px] text-sm leading-relaxed'>
                {step.desc}
              </p>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
