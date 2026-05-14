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

import React, { useState, useEffect } from 'react';
import { useHeaderBar } from '../../../hooks/common/useHeaderBar';
import { useNotifications } from '../../../hooks/common/useNotifications';
import { useNavigation } from '../../../hooks/common/useNavigation';
import NoticeModal from '../NoticeModal';
import MobileMenuButton from './MobileMenuButton';
import HeaderLogo from './HeaderLogo';
import Navigation from './Navigation';
import ActionButtons from './ActionButtons';

const HeaderBar = ({ onMobileMenuToggle, drawerOpen }) => {
  const {
    userState,
    statusState,
    isMobile,
    collapsed,
    logoLoaded,
    currentLang,
    isLoading,
    systemName,
    logo,
    isNewYear,
    isSelfUseMode,
    docsLink,
    isDemoSiteMode,
    isConsoleRoute,
    theme,
    headerNavModules,
    pricingRequireAuth,
    logout,
    handleLanguageChange,
    handleThemeToggle,
    handleMobileMenuToggle,
    navigate,
    t,
  } = useHeaderBar({ onMobileMenuToggle, drawerOpen });

  const {
    noticeVisible,
    unreadCount,
    handleNoticeOpen,
    handleNoticeClose,
    getUnreadKeys,
  } = useNotifications(statusState);

  const { mainNavLinks } = useNavigation(t, docsLink, headerNavModules);

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // 控制台路由下，body 不可滚动，强制保持非滚动态
    if (isConsoleRoute) {
      setIsScrolled(false);
      return;
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isConsoleRoute]);

  return (
    <header
      className={`fixed z-[100] transition-all duration-500 ${
        isScrolled
          ? 'top-4 left-4 right-4'
          : 'top-0 left-0 right-0'
      }`}
    >
      <NoticeModal
        visible={noticeVisible}
        onClose={handleNoticeClose}
        isMobile={isMobile}
        defaultTab={unreadCount > 0 ? 'system' : 'inApp'}
        unreadKeys={getUnreadKeys()}
      />

      <nav
        className={`mx-auto transition-all duration-500 ${
          isScrolled
            ? 'bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-2xl max-w-[1200px]'
            : 'bg-transparent max-w-[1400px]'
        }`}
        style={isScrolled ? { boxShadow: '0 0 0 1px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.04)' } : undefined}
      >
        <div
          className={`flex items-center justify-between transition-all duration-500 px-4 lg:px-6 ${
            isScrolled ? 'h-14' : 'h-16'
          }`}
        >
          <div className='flex items-center'>
            <MobileMenuButton
              isConsoleRoute={isConsoleRoute}
              isMobile={isMobile}
              drawerOpen={drawerOpen}
              collapsed={collapsed}
              onToggle={handleMobileMenuToggle}
              t={t}
            />

            <HeaderLogo
              isMobile={isMobile}
              isConsoleRoute={isConsoleRoute}
              logo={logo}
              logoLoaded={logoLoaded}
              isLoading={isLoading}
              systemName={systemName}
              isSelfUseMode={isSelfUseMode}
              isDemoSiteMode={isDemoSiteMode}
              t={t}
            />
          </div>

          <Navigation
            mainNavLinks={mainNavLinks}
            isMobile={isMobile}
            isLoading={isLoading}
            userState={userState}
            pricingRequireAuth={pricingRequireAuth}
          />

          <ActionButtons
            isNewYear={isNewYear}
            unreadCount={unreadCount}
            onNoticeOpen={handleNoticeOpen}
            theme={theme}
            onThemeToggle={handleThemeToggle}
            currentLang={currentLang}
            onLanguageChange={handleLanguageChange}
            userState={userState}
            isLoading={isLoading}
            isMobile={isMobile}
            isSelfUseMode={isSelfUseMode}
            logout={logout}
            navigate={navigate}
            t={t}
          />
        </div>
      </nav>
    </header>
  );
};

export default HeaderBar;
