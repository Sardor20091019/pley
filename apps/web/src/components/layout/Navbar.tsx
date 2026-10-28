'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../lib/i18n/useI18n';
import { useAppTheme } from '../../lib/theme/ThemeContext';
import { useAuthModal } from '../../lib/auth/AuthModalContext';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Mascot } from '../mascot/Mascot';
import { Globe, Shield, User, ChevronDown, LogOut } from 'lucide-react';

export function Navbar(): React.JSX.Element {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useI18n();
  const { theme } = useAppTheme();
  const { openLoginModal } = useAuthModal();
  const [showAccountMenu, setShowAccountMenu] = useState<boolean>(false);
  const [showLangMenu, setShowLangMenu] = useState<boolean>(false);

  const isCartoon = theme === 'cartoon';
  const isDbAdmin = user?.role === 'ADMIN';

  const navLinks = [
    { href: '/discover', label: t('navDiscover') },
    { href: '/my-games', label: t('navMyGames') },
    { href: '/profile', label: t('navProfile') },
  ];

  if (!isCartoon) {
    return (
      <header className="sticky top-0 z-40 bg-[#F5F0E8] border-b border-[#2D2926] px-4 sm:px-8 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <Mascot size="sm" mood="bouncing" className="group-hover:rotate-6 transition-transform" />
            <div className="flex items-baseline font-black tracking-tight text-2xl sm:text-3xl text-[#1A1510]" style={{ fontFamily: 'Georgia, serif' }}>
              <span>PLEY</span>
              <span className="text-[#8B7355]">.UZ</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 font-sans font-bold text-xs tracking-widest uppercase transition-all ${
                    isActive
                      ? 'text-[#1A1510] border-b-2 border-[#1A1510]'
                      : 'text-[#8B7355] hover:text-[#1A1510]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isDbAdmin && (
              <Link
                href="/admin"
                className={`px-3 py-1 font-sans font-extrabold text-xs flex items-center gap-1.5 border border-[#1A1510] tracking-wider uppercase ${
                  pathname === '/admin'
                    ? 'bg-[#1A1510] text-[#F5F0E8]'
                    : 'bg-[#EDE6D5] text-[#1A1510]'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>{t('navAdmin')}</span>
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeSwitcher />

            <div className="relative">
              <button
                onClick={() => {
                  setShowLangMenu(!showLangMenu);
                  setShowAccountMenu(false);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-[#EDE6D5] border border-[#2D2926] text-xs font-bold text-[#1A1510] font-sans uppercase tracking-wider"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>{language}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-28 bg-[#F5F0E8] border border-[#2D2926] p-1.5 z-50 shadow-md">
                  {(['uz', 'ru', 'en'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs font-bold font-sans ${
                        language === lang
                          ? 'bg-[#EDE6D5] text-[#1A1510]'
                          : 'text-[#8B7355] hover:bg-[#EDE6D5]'
                      }`}
                    >
                      {lang === 'uz' ? "O'zbek" : lang === 'ru' ? 'Русский' : 'English'}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              {user ? (
                <button
                  onClick={() => {
                    setShowAccountMenu(!showAccountMenu);
                    setShowLangMenu(false);
                  }}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#EDE6D5] border border-[#2D2926] text-xs font-bold text-[#1A1510] font-sans tracking-wide"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.first_name}
                      className="w-5 h-5 rounded-full object-cover border border-[#2D2926]"
                    />
                  ) : (
                    <User className="w-3.5 h-3.5 text-[#1A1510]" />
                  )}
                  <span className="max-w-[80px] sm:max-w-[120px] truncate">{user.first_name}</span>
                  <ChevronDown className="w-3 h-3 text-[#8B7355]" />
                </button>
              ) : (
                <button
                  onClick={() => openLoginModal()}
                  className="px-3.5 py-1.5 text-xs font-bold font-sans uppercase tracking-wider bg-[#1A1510] text-[#F5F0E8] hover:bg-[#332B24] transition-all cursor-pointer"
                >
                  {t('navLogin')}
                </button>
              )}

              {showAccountMenu && user && (
                <div className="absolute right-0 mt-2 w-64 bg-[#F5F0E8] border border-[#2D2926] p-3 z-50 space-y-3 shadow-lg">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-[rgba(45,41,38,0.15)]">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.first_name}
                        className="w-8 h-8 rounded-full object-cover border border-[#2D2926]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#EDE6D5] border border-[#2D2926] flex items-center justify-center font-bold text-xs text-[#1A1510]">
                        {user.first_name[0]}
                      </div>
                    )}
                    <div className="truncate">
                      <div className="text-xs font-bold text-[#1A1510] truncate" style={{ fontFamily: 'Georgia, serif' }}>
                        {user.first_name} {user.last_name || ''}
                      </div>
                      <div className="text-[10px] text-[#8B7355] font-sans truncate">
                        {user.email || `@${user.telegram_username || 'pley_user'}`}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 font-sans text-xs">
                    <Link
                      href="/profile"
                      onClick={() => setShowAccountMenu(false)}
                      className="block px-3 py-1.5 font-bold text-[#1A1510] hover:bg-[#EDE6D5]"
                    >
                      {t('navProfilePhoto')}
                    </Link>
                    <Link
                      href="/my-games"
                      onClick={() => setShowAccountMenu(false)}
                      className="block px-3 py-1.5 font-bold text-[#1A1510] hover:bg-[#EDE6D5]"
                    >
                      {t('navMyGames')}
                    </Link>
                    {isDbAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setShowAccountMenu(false)}
                        className="block px-3 py-1.5 font-bold text-[#8B7355] hover:bg-[#EDE6D5]"
                      >
                        {t('navAdminCenter')}
                      </Link>
                    )}
                  </div>

                  <div className="pt-2 border-t border-[rgba(45,41,38,0.15)]">
                    <button
                      onClick={() => {
                        logout();
                        setShowAccountMenu(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold font-sans text-[#B85450] hover:bg-[#EDE6D5]"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('navLogout')}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9EF] border-b-[2.5px] border-[#242424] px-4 sm:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <Mascot size="sm" mood="bouncing" className="group-hover:rotate-6 transition-transform" />
          <div className="flex items-baseline font-black tracking-tight text-2xl sm:text-3xl text-[#242424]">
            <span>PLEY</span>
            <span className="text-[#7655F7]">.UZ</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full font-bold text-sm border-2 transition-all ${
                  isActive
                    ? 'bg-[#7655F7] text-white border-[#242424] shadow-[2px_2px_0px_#242424]'
                    : 'bg-white text-[#242424] border-transparent hover:border-[#242424]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {isDbAdmin && (
            <Link
              href="/admin"
              className={`px-3.5 py-1.5 rounded-full font-extrabold text-xs flex items-center gap-1.5 border-2 border-[#242424] ${
                pathname === '/admin'
                  ? 'bg-[#FF795D] text-white shadow-[2px_2px_0px_#242424]'
                  : 'bg-[#D7FF64] text-[#242424]'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{t('navAdmin')}</span>
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeSwitcher />

          <div className="relative">
            <button
              onClick={() => {
                setShowLangMenu(!showLangMenu);
                setShowAccountMenu(false);
              }}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white border-2 border-[#242424] text-xs font-black shadow-[2px_2px_0px_#242424]"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="uppercase">{language}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showLangMenu && (
              <div className="absolute right-0 mt-2 w-28 bg-white border-2 border-[#242424] rounded-2xl shadow-[4px_4px_0px_#242424] p-1.5 z-50">
                {(['uz', 'ru', 'en'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-bold ${
                      language === lang
                        ? 'bg-[#D7FF64] text-[#242424]'
                        : 'hover:bg-[#FFF9EF]'
                    }`}
                  >
                    {lang === 'uz' ? "O'zbek" : lang === 'ru' ? 'Русский' : 'English'}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            {user ? (
              <button
                onClick={() => {
                  setShowAccountMenu(!showAccountMenu);
                  setShowLangMenu(false);
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D7FF64] border-2 border-[#242424] shadow-[2px_2px_0px_#242424] text-xs font-extrabold hover:bg-[#cbf556]"
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.first_name}
                    className="w-5 h-5 rounded-full object-cover border border-[#242424]"
                  />
                ) : (
                  <User className="w-3.5 h-3.5 text-[#242424]" />
                )}
                <span className="max-w-[80px] sm:max-w-[120px] truncate">
                  {user.first_name}
                </span>
                {isDbAdmin && (
                  <span className="px-1.5 py-0.2 rounded bg-[#7655F7] text-white text-[9px] font-black uppercase">
                    Admin
                  </span>
                )}
                <ChevronDown className="w-3 h-3 text-[#242424]" />
              </button>
            ) : (
              <button
                onClick={() => openLoginModal()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D7FF64] hover:bg-[#cbf556] text-[#242424] font-black text-xs border-2 border-[#242424] shadow-[2px_2px_0px_#242424] hover:shadow-[3px_3px_0px_#242424] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
              >
                <span>{t('navLogin')}</span>
              </button>
            )}

            {showAccountMenu && user && (
              <div className="absolute right-0 mt-2 w-64 bg-white border-2 border-[#242424] rounded-2xl shadow-[4px_4px_0px_#242424] p-3 z-50 space-y-3">
                <div className="flex items-center gap-2.5 pb-2 border-b border-[#EEEEEE]">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.first_name}
                      className="w-8 h-8 rounded-full object-cover border border-[#242424]"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-[#D7FF64] border border-[#242424] flex items-center justify-center font-black text-xs">
                      {user.first_name[0]}
                    </div>
                  )}
                  <div className="truncate">
                    <div className="text-xs font-black text-[#242424] truncate">
                      {user.first_name} {user.last_name || ''}
                    </div>
                    <div className="text-[10px] text-[#7655F7] font-semibold truncate">
                      {user.email || `@${user.telegram_username || 'pley_user'}`}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <Link
                    href="/profile"
                    onClick={() => setShowAccountMenu(false)}
                    className="block px-3 py-1.5 rounded-xl text-xs font-bold text-[#242424] hover:bg-[#FFF9EF] transition-colors"
                  >
                    {t('navProfilePhoto')}
                  </Link>
                  <Link
                    href="/my-games"
                    onClick={() => setShowAccountMenu(false)}
                    className="block px-3 py-1.5 rounded-xl text-xs font-bold text-[#242424] hover:bg-[#FFF9EF] transition-colors"
                  >
                    {t('navMyGames')}
                  </Link>
                  {isDbAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setShowAccountMenu(false)}
                      className="block px-3 py-1.5 rounded-xl text-xs font-bold text-[#7655F7] hover:bg-[#FFF9EF] transition-colors"
                    >
                      {t('navAdminCenter')}
                    </Link>
                  )}
                </div>

                <div className="pt-2 border-t border-[#EEEEEE]">
                  <button
                    onClick={() => {
                      logout();
                      setShowAccountMenu(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold text-[#FF795D] hover:bg-[#FFF9EF] transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('navLogout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
