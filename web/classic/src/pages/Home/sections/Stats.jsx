import React from 'react';
import { useTranslation } from 'react-i18next';
import Counter from '../../../components/common/Counter';

const Stats = () => {
  const { t } = useTranslation();

  const stats = [
    { end: 50, suffix: '+', label: t('上游服务集成') },
    { end: 100, suffix: '+', label: t('模型计费支持') },
    { end: 50, suffix: '+', label: t('兼容 API 路由') },
    { end: 10, suffix: '+', label: t('调度策略') },
  ];

  return (
    <div className='relative z-10 border-t border-b border-semi-color-border'>
      <div className='mx-auto max-w-6xl px-6 py-10 md:py-12'>
        <div className='grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12'>
          {stats.map((s) => (
            <div key={s.label} className='flex flex-col items-center text-center'>
              <span className='text-2xl font-bold tracking-tight md:text-3xl text-semi-color-text-0'>
                <Counter end={s.end} suffix={s.suffix} />
              </span>
              <span className='text-semi-color-text-2 mt-1.5 text-xs'>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
