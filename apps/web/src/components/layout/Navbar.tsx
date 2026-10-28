'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../lib/i18n/useI18n';
import { Mascot } from '../mascot/Mascot';
import { Button } from '../ui/Button';
import { Globe, Shield, User, ChevronDown } from 'lucide-react';

export function Navbar(): React.JSX.Element {
  const pathname = usePathname();
  const { user, loginAs, isAdmin } = useAuth();
  const { language, setLanguage, t } = useI18n();
  const [showAccountMenu, setShowAccountMenu] = useState<boolean>(false);
  const [showLangMenu, setShowLangMenu] = useState<boolean>(false);

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

          {isAdmin && (
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
            <button
              onClick={() => {
                setShowAccountMenu(!showAccountMenu);
                setShowLangMenu(false);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#D7FF64] border-2 border-[#242424] shadow-[2px_2px_0px_#242424] text-xs font-extrabold hover:bg-[#cbf556]"
            >
              <User className="w-3.5 h-3.5 text-[#242424]" />
              <span className="max-w-[80px] sm:max-w-[120px] truncate">
                {user?.first_name || 'Mehmon'}
              </span>
              <ChevronDown className="w-3 h-3 text-[#242424]" />
            </button>

            {showAccountMenu && (
              <div className="absolute right-0 mt-2 w-60 bg-white border-2 border-[#242424] rounded-2xl shadow-[4px_4px_0px_#242424] p-3 z-50 space-y-2">
                <div className="text-[11px] font-black uppercase text-[#888888] px-1">
                  Demo profilni tanlash
                </div>
                <button
                  onClick={async () => {
                    await loginAs('usr_admin_1');
                    setShowAccountMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold border ${
                    user?.id === 'usr_admin_1'
                      ? 'bg-[#7655F7] text-white border-[#242424]'
                      : 'bg-[#FFF9EF] border-[#E5E5E5] hover:border-[#242424]'
                  }`}
                >
                  <div className="font-extrabold">Jasur (Admin)</div>
                  <div className="text-[10px] opacity-80">Full access & metrics</div>
                </button>
                <button
                  onClick={async () => {
                    await loginAs('usr_demo_1');
                    setShowAccountMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold border ${
                    user?.id === 'usr_demo_1'
                      ? 'bg-[#D7FF64] text-[#242424] border-[#242424]'
                      : 'bg-[#FFF9EF] border-[#E5E5E5] hover:border-[#242424]'
                  }`}
                >
                  <div className="font-extrabold">Timur (Player)</div>
                  <div className="text-[10px] opacity-80">Chilonzor · Table Tennis</div>
                </button>
                <button
                  onClick={async () => {
                    await loginAs('usr_demo_2');
                    setShowAccountMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold border ${
                    user?.id === 'usr_demo_2'
                      ? 'bg-[#D7FF64] text-[#242424] border-[#242424]'
                      : 'bg-[#FFF9EF] border-[#E5E5E5] hover:border-[#242424]'
                  }`}
                >
                  <div className="font-extrabold">Madina (Player)</div>
                  <div className="text-[10px] opacity-80">Yunusobod · Basketball</div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

