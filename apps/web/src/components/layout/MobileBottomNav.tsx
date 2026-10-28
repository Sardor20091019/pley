'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../lib/i18n/useI18n';
import { Compass, CalendarCheck2, User, Shield } from 'lucide-react';

export function MobileBottomNav(): React.JSX.Element {
  const pathname = usePathname();
  const { isAdmin } = useAuth();
  const { t } = useI18n();

  const items = [
    { href: '/discover', label: t('navDiscover'), icon: Compass },
    { href: '/my-games', label: t('navMyGames'), icon: CalendarCheck2 },
    { href: '/profile', label: t('navProfile'), icon: User },
  ];

  if (isAdmin) {
    items.push({ href: '/admin', label: t('navAdmin'), icon: Shield });
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

