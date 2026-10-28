'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../lib/i18n/useI18n';
import { Mascot } from '../mascot/Mascot';
import { GoogleSignInButton } from '../auth/GoogleSignInButton';
import { Globe, Shield, User, ChevronDown, LogOut } from 'lucide-react';

export function Navbar(): React.JSX.Element {
  const pathname = usePathname();
  const { user, loginAs, logout } = useAuth();
  const { language, setLanguage, t } = useI18n();
  const [showAccountMenu, setShowAccountMenu] = useState<boolean>(false);
  const [showLangMenu, setShowLangMenu] = useState<boolean>(false);

  const isDbAdmin = user?.role === 'ADMIN';

  const navLinks = [
    { href: '/discover', label: t('navDiscover') },
    { href: '/my-games', label: t('navMyGames') },
    { href: '/profile', label: t('navProfile') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9EF] border-b-[2.5px] border-[#242424] px-4 sm:px-8 py-3">
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

                <div className="space-y-1.5">
                  <div className="text-[10px] font-black uppercase text-[#888888] px-1">
                    Google bilan ulanish
                  </div>
                  <GoogleSignInButton className="w-full text-xs py-2 shadow-none border" />
                </div>

                <div className="pt-2 border-t border-[#EEEEEE] space-y-1.5">
                  <div className="text-[10px] font-black uppercase text-[#888888] px-1">
                    Demo hisoblarni almashtirish
                  </div>
                  <button
                    onClick={async () => {
                      await loginAs('usr_admin_1');
                      setShowAccountMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold border ${
                      user.id === 'usr_admin_1'
                        ? 'bg-[#7655F7] text-white border-[#242424]'
                        : 'bg-[#FFF9EF] border-[#E5E5E5] hover:border-[#242424]'
                    }`}
                  >
                    <div className="font-extrabold flex items-center justify-between">
                      <span>Jasur (Admin)</span>
                      <span className="text-[9px] px-1 rounded bg-[#D7FF64] text-[#242424]">role=ADMIN</span>
                    </div>
                  </button>
                  <button
                    onClick={async () => {
                      await loginAs('usr_demo_1');
                      setShowAccountMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-bold border ${
                      user.id === 'usr_demo_1'
                        ? 'bg-[#D7FF64] text-[#242424] border-[#242424]'
                        : 'bg-[#FFF9EF] border-[#E5E5E5] hover:border-[#242424]'
                    }`}
                  >
                    <div className="font-extrabold flex items-center justify-between">
                      <span>Timur (Player)</span>
                      <span className="text-[9px] px-1 rounded bg-white text-[#888888]">role=USER</span>
                    </div>
                  </button>
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
