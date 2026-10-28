'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../lib/types';
import { fetchMyProfile } from '../lib/api';
import { getCookie, deleteCookie } from '../lib/cookies';

export interface UseAuthReturn {
  user: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadProfile = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      const profile = await fetchMyProfile();
      setUser(profile);
    } catch {
      setUser(null);
      deleteCookie('pley_token');
      localStorage.removeItem('pley_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    async function init(): Promise<void> {
      const token = getCookie('pley_token') || localStorage.getItem('pley_token');
      if (token) {
        await loadProfile();
      } else {
        setUser(null);
        setLoading(false);
      }
    }

    init();
  }, [loadProfile]);

  const logout = useCallback((): void => {
    deleteCookie('pley_token');
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
    logout,
    refreshProfile,
  };
}
