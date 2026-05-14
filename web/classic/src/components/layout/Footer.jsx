/*
Copyright (C) 2025 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/

import React, { useEffect, useState, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { getFooterHTML, getLogo, getSystemName } from '../../helpers';
import { StatusContext } from '../../context/Status';
import AnimatedWave from '../../pages/Home/components/AnimatedWave';

const FooterBar = () => {
  const { t } = useTranslation();
  const [footer, setFooter] = useState(getFooterHTML());
  const systemName = getSystemName();
  const logo = getLogo();
  const attributionPrefix = t('基于');
  const attributionSuffix = t('开发');
  const [statusState] = useContext(StatusContext);
  const isDemoSiteMode = statusState?.status?.demo_site_enabled || false;

  const loadFooter = () => {
    let footer_html = localStorage.getItem('footer_html');
    if (footer_html) {
      setFooter(footer_html);
    }
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = useMemo(
    () => ({
      [t('产品')]: [
        { name: t('功能'), href: '#features' },
        { name: t('使用流程'), href: '#how-it-works' },
        { name: t('定价'), href: '/pricing' },
        { name: t('集成'), href: '#integrations' },
      ],
      [t('开发者')]: [
        { name: t('文档'), href: '/docs' },
        { name: 'API Reference', href: '/docs' },
        { name: 'SDK', href: '/docs' },
        { name: t('状态'), href: '#' },
      ],
      [t('公司')]: [
        { name: t('关于'), href: '#' },
        { name: t('博客'), href: '#' },
        { name: t('联系我们'), href: '#' },
      ],
      [t('法律')]: [
        { name: t('隐私政策'), href: '#' },
        { name: t('服务条款'), href: '#' },
        { name: t('安全'), href: '#' },
      ],
    }),
    [t],
  );

  const socialLinks = [
    { name: 'Twitter', href: '#' },
    { name: 'GitHub', href: 'https://github.com/QuantumNous/new-api' },
  ];

  const customFooter = useMemo(
    () => (
      <footer className='relative border-t border-semi-color-border'>
        {/* Animated wave background */}
        <div className='absolute inset-0 opacity-20 pointer-events-none overflow-hidden'>
          <AnimatedWave />
        </div>

        <div className='relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12'>
          {/* Main Footer */}
          <div className='py-8 lg:py-12'>
            <div className='grid grid-cols-2 md:grid-cols-6 gap-12 lg:gap-8'>
              {/* Brand Column */}
              <div className='col-span-2'>
                <a href='/' className='inline-flex items-center gap-2 mb-6'>
                  <img
                    src={logo}
                    alt={systemName}
                    className='hono-site-logo w-8 h-8 rounded-full object-contain'
                  />
                  <span className='text-2xl font-display'>{systemName}</span>
                </a>

                <p className='text-semi-color-text-2 leading-relaxed mb-8 max-w-xs'>
                  {t(
                    'The platform for teams who ship. Build, deploy, and scale with unprecedented velocity.',
                  )}
                </p>

                {/* Social Links */}
                <div className='flex gap-6'>
                  {socialLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-sm text-semi-color-text-2 hover:text-semi-color-text-0 transition-colors flex items-center gap-1 group'
                    >
                      {link.name}
                      <svg
                        className='w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                      >
                        <path d='M7 17L17 7M17 7H7M17 7V17' />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Link Columns */}
              {Object.entries(footerLinks).map(([title, links]) => (
                <div key={title}>
                  <h3 className='text-sm font-medium mb-6'>{title}</h3>
                  <ul className='space-y-4'>
                    {links.map((link) => (
                      <li key={link.name}>
                        <a
                          href={link.href}
                          className='text-sm text-semi-color-text-2 hover:text-semi-color-text-0 transition-colors'
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>
      </footer>
    ),
    [
      logo,
      systemName,
      t,
      currentYear,
      footerLinks,
      attributionPrefix,
      attributionSuffix,
    ],
  );

  useEffect(() => {
    loadFooter();
  }, []);

  return (
    <div className='w-full'>
      {footer ? (
        <footer className='relative h-auto py-4 px-6 md:px-24 w-full flex items-center justify-center overflow-hidden'>
          <div className='flex flex-col md:flex-row items-center justify-between w-full max-w-[1110px] gap-4'>
            <div
              className='custom-footer na-cb6feafeb3990c78 text-sm !text-semi-color-text-1'
              dangerouslySetInnerHTML={{ __html: footer }}
            ></div>
            <div className='text-sm flex-shrink-0'>
              <span className='!text-semi-color-text-1'>
                {attributionPrefix}{' '}
              </span>
              <a
                href='https://github.com/QuantumNous/new-api'
                target='_blank'
                rel='noopener noreferrer'
                className='!text-semi-color-primary font-medium'
              >
                New API
              </a>
              <span className='!text-semi-color-text-1'>
                {' '}
                {attributionSuffix}
              </span>
            </div>
          </div>
        </footer>
      ) : (
        customFooter
      )}
    </div>
  );
};

export default FooterBar;
