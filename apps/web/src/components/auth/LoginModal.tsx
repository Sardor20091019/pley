'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TurnstileWidget } from './TurnstileWidget';
import { Mascot } from '../mascot/Mascot';
import { fetchGoogleAuthUrl } from '../../lib/api';
import { useAppTheme } from '../../lib/theme/ThemeContext';
import { useI18n } from '../../lib/i18n/useI18n';
import { X, ShieldCheck, ShieldAlert } from 'lucide-react';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectPath?: string;
}

export function LoginModal({
  isOpen,
  onClose,
  redirectPath = '/discover',
}: LoginModalProps): React.JSX.Element | null {
  const { theme } = useAppTheme();
  const { t } = useI18n();
  const isCartoon = theme === 'cartoon';

  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async (): Promise<void> => {
    if (!turnstileToken) {
      setError(t('loginTurnstileError'));
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pley_turnstile_token', turnstileToken);
        sessionStorage.setItem('pley_post_login_redirect', redirectPath);
        const redirectUri = `${window.location.origin}/auth/callback`;
        const url = await fetchGoogleAuthUrl(redirectUri);
        window.location.href = url;
      }
    } catch (err: any) {
      setError(err.message || 'Google tizimiga ulanishda xatolik yuz berdi.');
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-md z-10 overflow-hidden ${
              isCartoon
                ? 'bg-[#FFF9EF] border-[2.5px] border-[#242424] rounded-[32px] shadow-[6px_6px_0px_#242424] p-6 sm:p-8'
                : 'bg-[#F5F0E8] border-[1.5px] border-[#2D2926] shadow-[4px_4px_0px_#8B7355] p-6 sm:p-8'
            }`}
          >
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-1.5 transition-colors cursor-pointer ${
                isCartoon
                  ? 'border-2 border-[#242424] bg-white rounded-full hover:bg-[#D7FF64] text-[#242424]'
                  : 'border border-[#2D2926] bg-[#EDE6D5] hover:bg-[#E5DDC9] text-[#1A1510]'
              }`}
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="text-center space-y-3 pt-2">
              <div className="flex justify-center">
                <Mascot size="md" mood="happy" className={isCartoon ? 'animate-bounce' : ''} />
              </div>

              <div>
                <h3
                  className={`text-2xl font-black ${
                    isCartoon ? 'text-[#242424]' : 'text-[#1A1510]'
                  }`}
                  style={!isCartoon ? { fontFamily: 'Georgia, serif' } : undefined}
                >
                  {isCartoon ? t('loginModalTitleCartoon') : t('loginModalTitleEditorial')}
                </h3>
                <p
                  className={`text-xs mt-1 leading-relaxed ${
                    isCartoon ? 'text-[#666666] font-semibold' : 'text-[#4A3F30] italic font-sans'
                  }`}
                >
                  {t('loginModalSubtitle')}
                </p>
              </div>
            </div>

            <div
              className={`my-5 p-3.5 rounded-2xl border text-center space-y-2 ${
                isCartoon
                  ? 'bg-white border-2 border-[#242424]'
                  : 'bg-[#EDE6D5] border border-[rgba(45,41,38,0.25)]'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold">
                {turnstileToken ? (
                  <span className="flex items-center gap-1.5 text-[#2E7D32]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{t('loginSecurityProtected')}</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[#8B7355]">
                    <ShieldAlert className="w-4 h-4" />
                    <span>{t('loginSecurityVerify')}</span>
                  </span>
                )}
              </div>

              <TurnstileWidget
                onVerify={(token) => {
                  setTurnstileToken(token);
                  setError(null);
                }}
                className="my-1 scale-95 origin-center"
              />
            </div>

            {error && (
              <div className="mb-4 p-2.5 rounded-xl bg-[#FFF0ED] border border-[#FF795D] text-xs font-bold text-[#FF795D] text-center">
                {error}
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleGoogleLogin}
                disabled={loading || !turnstileToken}
                className={`w-full flex items-center justify-center gap-3 py-3.5 px-4 text-sm font-black transition-all cursor-pointer select-none ${
                  isCartoon
                    ? 'rounded-2xl border-2 border-[#242424] bg-white text-[#242424] shadow-[3px_3px_0px_#242424] hover:shadow-[4px_4px_0px_#242424] hover:bg-[#FFF9EF] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#242424] disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-x-0 disabled:translate-y-0'
                    : 'bg-[#1A1510] text-[#F5F0E8] border border-[#1A1510] tracking-wider uppercase font-sans text-xs hover:bg-[#332B24] disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>
                  {loading
                    ? t('loginConnecting')
                    : !turnstileToken
                    ? t('loginSecurityVerify')
                    : t('loginGoogleBtn')}
                </span>
              </button>

              <p
                className={`text-[10px] text-center leading-tight ${
                  isCartoon ? 'text-[#888888] font-semibold' : 'text-[#8B7355] font-sans'
                }`}
              >
                {t('loginSecurityNotice')}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

