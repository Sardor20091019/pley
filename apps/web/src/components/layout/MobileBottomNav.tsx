'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../lib/i18n/useI18n';
import { useAppTheme } from '../../lib/theme/ThemeContext';
import { Compass, CalendarCheck2, User, Shield } from 'lucide-react';

export function MobileBottomNav(): React.JSX.Element {
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const { t } = useI18n();
  const { theme } = useAppTheme();
  const isCartoon = theme === 'cartoon';

  const items = [
    { href: '/discover', label: t('navDiscover'), icon: Compass },
    { href: '/my-games', label: t('navMyGames'), icon: CalendarCheck2 },
    { href: '/profile', label: t('navProfile'), icon: User },
  ];

  if (isAdmin) {
    items.push({ href: '/admin', label: t('navAdmin'), icon: Shield });
  }

  if (!isCartoon) {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[rgba(7,7,15,0.92)] backdrop-blur-2xl border-t border-[rgba(118,85,247,0.25)] px-4 py-2 flex items-center justify-around shadow-[0px_-4px_20px_rgba(0,0,0,0.5)]">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
                isActive
                  ? 'bg-[rgba(118,85,247,0.25)] border border-[rgba(155,125,255,0.4)] text-[#C8FF00] shadow-[0_0_12px_rgba(118,85,247,0.3)]'
                  : 'text-[#8B80C8] hover:text-[#F0EDFF]'
              }`}
            >
              <Icon className="w-5 h-5 stroke-[2.5]" />
              <span className="text-[11px] font-black">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t-[2.5px] border-[#242424] px-4 py-2 flex items-center justify-around shadow-[0px_-4px_12px_rgba(0,0,0,0.06)]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all ${
              isActive
                ? 'bg-[#D7FF64] border-2 border-[#242424] shadow-[2px_2px_0px_#242424] text-[#242424]'
                : 'text-[#666666] hover:text-[#242424]'
            }`}
          >
            <Icon className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[11px] font-black">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
