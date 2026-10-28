'use client';

import { useEffect, useState, useCallback } from 'react';

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
}

export interface UseTelegramReturn {
  isTelegram: boolean;
  user: TelegramUser | null;
  initData: string;
  hapticFeedback: (type: 'light' | 'medium' | 'heavy' | 'success' | 'error') => void;
  openTelegramShare: (url: string, text: string) => void;
  closeApp: () => void;
}

export function useTelegram(): UseTelegramReturn {
  const [isTelegram, setIsTelegram] = useState<boolean>(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [initData, setInitData] = useState<string>('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const tg = (window as any).Telegram?.WebApp;
    if (tg && tg.initData) {
      setIsTelegram(true);
      setInitData(tg.initData);
      tg.ready();
      tg.expand();

      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user);
      }
    }
  }, []);

  const hapticFeedback = useCallback(
    (type: 'light' | 'medium' | 'heavy' | 'success' | 'error'): void => {
      if (typeof window === 'undefined') return;
      const tg = (window as any).Telegram?.WebApp;
      if (!tg?.HapticFeedback) return;

      if (type === 'success' || type === 'error') {
        tg.HapticFeedback.notificationOccurred(type);
      } else {
        tg.HapticFeedback.impactOccurred(type);
      }
    },
    [],
  );

  const openTelegramShare = useCallback(
    (url: string, text: string): void => {
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
      if (typeof window !== 'undefined') {
        const tg = (window as any).Telegram?.WebApp;
        if (tg?.openTelegramLink) {
          tg.openTelegramLink(shareUrl);
        } else {
          window.open(shareUrl, '_blank');
        }
      }
    },
    [],
  );

  const closeApp = useCallback((): void => {
    if (typeof window !== 'undefined') {
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.close) {
        tg.close();
      }
    }
  }, []);

  return {
    isTelegram,
    user,
    initData,
    hapticFeedback,
    openTelegramShare,
    closeApp,
  };
}

