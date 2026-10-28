'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../lib/i18n/useI18n';
import { useAppTheme } from '../../lib/theme/ThemeContext';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Mascot } from '../mascot/Mascot';
import { GoogleSignInButton } from '../auth/GoogleSignInButton';
import { Globe, Shield, User, ChevronDown, LogOut } from 'lucide-react';

export function Navbar(): React.JSX.Element {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useI18n();
  const { theme } = useAppTheme();
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
      <header className="sticky top-0 z-40 bg-[rgba(7,7,15,0.85)] backdrop-blur-2xl border-b border-[rgba(118,85,247,0.2)] px-4 sm:px-8 py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Mascot size="sm" mood="bouncing" className="group-hover:rotate-6 transition-transform" />
            <div className="flex items-baseline font-black tracking-tight text-2xl sm:text-3xl text-[#F0EDFF]">
              <span>PLEY</span>
              <span className="text-[#9B7DFF]">.UZ</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-full font-bold text-xs tracking-wider uppercase transition-all ${
                    isActive
                      ? 'bg-[rgba(118,85,247,0.25)] text-[#C8FF00] border border-[rgba(155,125,255,0.4)] shadow-[0_0_16px_rgba(118,85,247,0.3)]'
                      : 'text-[#8B80C8] hover:text-[#F0EDFF] hover:bg-[rgba(118,85,247,0.1)]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {isDbAdmin && (
              <Link
                href="/admin"
                className={`px-3.5 py-1.5 rounded-full font-extrabold text-xs flex items-center gap-1.5 border transition-all ${
                  pathname === '/admin'
                    ? 'bg-[#FF6B52] text-white border-[rgba(255,107,82,0.5)] shadow-[0_0_16px_rgba(255,107,82,0.4)]'
                    : 'bg-[rgba(200,255,0,0.1)] text-[#C8FF00] border-[rgba(200,255,0,0.3)]'
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
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[rgba(118,85,247,0.12)] border border-[rgba(118,85,247,0.3)] text-xs font-bold text-[#C8C0F0] hover:bg-[rgba(118,85,247,0.2)] transition-all"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="uppercase">{language}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-28 bg-[#10101E] border border-[rgba(118,85,247,0.3)] rounded-2xl shadow-[0_16px_32px_rgba(0,0,0,0.6)] p-1.5 z-50">
                  {(['uz', 'ru', 'en'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setShowLangMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-semibold ${
                        language === lang
                          ? 'bg-[rgba(118,85,247,0.2)] text-[#9B7DFF]'
                          : 'text-[#8B80C8] hover:bg-[rgba(118,85,247,0.1)]'
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
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(118,85,247,0.15)] border border-[rgba(118,85,247,0.4)] text-xs font-extrabold text-[#F0EDFF] hover:bg-[rgba(118,85,247,0.25)]"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.first_name}
                      className="w-5 h-5 rounded-full object-cover border border-[rgba(118,85,247,0.4)]"
                    />
                  ) : (
                    <User className="w-3.5 h-3.5 text-[#9B7DFF]" />
                  )}
                  <span className="max-w-[80px] sm:max-w-[120px] truncate">{user.first_name}</span>
                  <ChevronDown className="w-3 h-3 text-[#8B80C8]" />
                </button>
              ) : (
                <GoogleSignInButton className="py-2 px-3.5 text-xs shadow-none border border-[rgba(118,85,247,0.3)]" />
              )}

              {showAccountMenu && user && (
                <div className="absolute right-0 mt-2 w-64 bg-[#10101E] border border-[rgba(118,85,247,0.3)] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-3 z-50 space-y-3">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-[rgba(118,85,247,0.15)]">
                    {user.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.first_name}
                        className="w-8 h-8 rounded-full object-cover border border-[rgba(118,85,247,0.4)]"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[rgba(118,85,247,0.2)] text-[#9B7DFF] border border-[rgba(118,85,247,0.3)] flex items-center justify-center font-black text-xs">
                        {user.first_name[0]}
                      </div>
                    )}
                    <div className="truncate">
                      <div className="text-xs font-black text-[#F0EDFF] truncate">
                        {user.first_name} {user.last_name || ''}
                      </div>
                      <div className="text-[10px] text-[#9B7DFF] font-semibold truncate">
                        {user.email || `@${user.telegram_username || 'pley_user'}`}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/profile"
                      onClick={() => setShowAccountMenu(false)}
                      className="block px-3 py-1.5 rounded-xl text-xs font-semibold text-[#C8C0F0] hover:bg-[rgba(118,85,247,0.15)]"
                    >
                      Profil
                    </Link>
                    <Link
                      href="/my-games"
                      onClick={() => setShowAccountMenu(false)}
                      className="block px-3 py-1.5 rounded-xl text-xs font-semibold text-[#C8C0F0] hover:bg-[rgba(118,85,247,0.15)]"
                    >
                      Mening oʻyinlarim
                    </Link>
                  </div>

                  <div className="pt-2 border-t border-[rgba(118,85,247,0.15)]">
                    <button
                      onClick={() => {
                        logout();
                        setShowAccountMenu(false);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold text-[#FF6B52] hover:bg-[rgba(255,107,82,0.1)] transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Chiqish</span>
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
              <GoogleSignInButton className="py-2 px-3.5 text-xs shadow-[2px_2px_0px_#242424]" />
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
                    Profil va fotosurat
                  </Link>
                  <Link
                    href="/my-games"
                    onClick={() => setShowAccountMenu(false)}
                    className="block px-3 py-1.5 rounded-xl text-xs font-bold text-[#242424] hover:bg-[#FFF9EF] transition-colors"
                  >
                    Mening oʻyinlarim
                  </Link>
                  {isDbAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setShowAccountMenu(false)}
                      className="block px-3 py-1.5 rounded-xl text-xs font-bold text-[#7655F7] hover:bg-[#FFF9EF] transition-colors"
                    >
                      Admin boshqaruv markazi
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
                    <span>Chiqish</span>
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
