'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../lib/types';
import { devLogin, fetchMyProfile, telegramAuth } from '../lib/api';
import { useTelegram } from './useTelegram';

export interface UseAuthReturn {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loginAs: (userId: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { initData, isTelegram } = useTelegram();

  const loadProfile = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const profile = await fetchMyProfile();
      setUser(profile);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function init(): Promise<void> {
      if (isTelegram && initData) {
        try {
          const res = await telegramAuth(initData);
          setUser(res.user);
          setLoading(false);
          return;
        } catch {
          // fallback to standard auth
        }
      }

      const token = localStorage.getItem('pley_token');
      const devUserId = localStorage.getItem('pley_dev_user_id');

      if (token || devUserId) {
        await loadProfile();
      } else {
        await devLogin('usr_demo_1');
        await loadProfile();
      }
    }

    init();
  }, [isTelegram, initData, loadProfile]);

  const loginAs = useCallback(
    async (userId: string): Promise<void> => {
      setLoading(true);
      try {
        const res = await devLogin(userId);
        setUser(res.user);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const logout = useCallback((): void => {
    localStorage.removeItem('pley_token');
    localStorage.removeItem('pley_dev_user_id');
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async (): Promise<void> => {
    await loadProfile();
  }, [loadProfile]);

  return {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    loginAs,
    logout,
    refreshProfile,
  };
}

