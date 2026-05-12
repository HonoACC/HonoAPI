import React, { useContext } from 'react';
import { Button } from '@douyinfe/semi-ui';
import { IconPlay } from '@douyinfe/semi-icons';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { StatusContext } from '../../../context/Status';
import AnimateInView from '../../../components/common/AnimateInView';

const CTA = () => {
  const { t } = useTranslation();
  const [statusState] = useContext(StatusContext);
  const docsLink = statusState?.status?.docs_link || '';

  return (
    <section className='relative z-10 overflow-hidden px-6 py-24 md:py-32'>
      {/* Gradient background */}
      <div
        aria-hidden='true'
        className='absolute inset-0 -z-10 opacity-20 pointer-events-none'
        style={{
          background: [
            'radial-gradient(ellipse 50% 50% at 30% 50%, rgba(99,102,241,0.7) 0%, transparent 70%)',
            'radial-gradient(ellipse 40% 40% at 70% 40%, rgba(59,130,246,0.5) 0%, transparent 70%)',
          ].join(', '),
        }}
      />

      <AnimateInView className='mx-auto max-w-2xl text-center' animation='scale-in'>
        <h2 className='text-2xl leading-tight font-bold tracking-tight md:text-4xl text-semi-color-text-0'>
          {t('准备好简化')}
          <br />
          <span
            style={{
              background: 'linear-gradient(to right, #60a5fa, #a78bfa, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {t('你的 AI 集成了吗？')}
          </span>
        </h2>
        <p className='text-semi-color-text-2 mx-auto mt-5 max-w-md text-sm leading-relaxed md:text-base'>
          {t('部署你自己的网关，开始通过配置的上游服务路由请求。')}
        </p>
        <div className='mt-8 flex items-center justify-center gap-3'>
          <Link to='/console'>
            <Button
              theme='solid'
              type='primary'
              size='large'
              className='!rounded-lg'
              icon={<IconPlay />}
            >
              {t('立即开始')}
            </Button>
          </Link>
          {docsLink && (
            <Button
              size='large'
              className='!rounded-lg'
              onClick={() => window.open(docsLink, '_blank')}
            >
              {t('查看文档')}
            </Button>
          )}
        </div>
      </AnimateInView>
    </section>
  );
};

export default CTA;
