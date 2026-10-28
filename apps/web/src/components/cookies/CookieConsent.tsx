'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, Shield, Sliders, Check, X, Lock, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../lib/i18n/useI18n';
import { useAppTheme } from '../../lib/theme/ThemeContext';
import {
  CookieConsentPreferences,
  getCookieConsent,
  saveCookieConsent,
} from '../../lib/cookies';

export function CookieConsent(): React.JSX.Element {
  const { t } = useI18n();
  const { theme } = useAppTheme();
  const isCartoon = theme === 'cartoon';

  const [hasConsent, setHasConsent] = useState<boolean>(true);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  const [preferences, setPreferences] = useState<CookieConsentPreferences>({
    necessary: true,
    preferences: true,
    analytics: true,
    updatedAt: new Date().toISOString(),
  });

  useEffect(() => {
    const consent = getCookieConsent();
    if (consent) {
      setPreferences(consent);
      setHasConsent(true);
      setShowBanner(false);
    } else {
      setHasConsent(false);
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = useCallback((): void => {
    const updated = saveCookieConsent({
      necessary: true,
      preferences: true,
      analytics: true,
    });
    setPreferences(updated);
    setHasConsent(true);
    setShowBanner(false);
    setIsModalOpen(false);
    showFeedback();
  }, []);

  const handleSaveCustom = useCallback((): void => {
    const updated = saveCookieConsent(preferences);
    setPreferences(updated);
    setHasConsent(true);
    setShowBanner(false);
    setIsModalOpen(false);
    showFeedback();
  }, [preferences]);

  const handleRejectOptional = useCallback((): void => {
    const updated = saveCookieConsent({
      necessary: true,
      preferences: false,
      analytics: false,
    });
    setPreferences(updated);
    setHasConsent(true);
    setShowBanner(false);
    setIsModalOpen(false);
    showFeedback();
  }, []);

  const showFeedback = (): void => {
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
    }, 2800);
  };

  return (
    <>
      <div className="fixed bottom-20 md:bottom-6 left-4 sm:left-6 z-40">
        <button
          onClick={() => setIsModalOpen(true)}
          title={t('cookieStickyLabel')}
          className={`group relative flex items-center gap-2 select-none cursor-pointer transition-all duration-150 ${
            isCartoon
              ? 'p-3 rounded-full bg-[#FFF9EF] border-[2.5px] border-[#242424] shadow-[3px_3px_0px_#242424] hover:shadow-[4px_4px_0px_#242424] hover:bg-[#D7FF64] text-[#242424] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#242424]'
              : 'p-2.5 bg-[#EDE6D5] border-[1.5px] border-[#2D2926] shadow-[2px_2px_0px_#8B7355] hover:bg-[#E5DDC9] text-[#1A1510] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
          }`}
        >
          <Cookie className="w-5 h-5 text-[#8B7355] group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline-block text-xs font-black tracking-tight max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300">
            {t('cookieStickyLabel')}
          </span>
          {!hasConsent && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#FF795D] border-2 border-white rounded-full animate-ping" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {savedNotice && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className={`fixed bottom-24 md:bottom-20 left-4 sm:left-6 z-50 flex items-center gap-2 px-4 py-2.5 text-xs font-bold ${
              isCartoon
                ? 'rounded-2xl border-2 border-[#242424] bg-[#D7FF64] text-[#242424] shadow-[4px_4px_0px_#242424]'
                : 'border border-[#2D2926] bg-[#EDE6D5] text-[#1A1510] shadow-[2px_2px_0px_#8B7355]'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
            <span>{t('cookieSavedNotice')}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBanner && !isModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-20 md:bottom-6 right-4 sm:right-6 max-w-md z-40 p-5 sm:p-6 ${
              isCartoon
                ? 'rounded-[28px] border-[2.5px] border-[#242424] bg-[#FFF9EF] shadow-[6px_6px_0px_#242424]'
                : 'border-[1.5px] border-[#2D2926] bg-[#F5F0E8] shadow-[4px_4px_0px_#8B7355]'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <div
                  className={`p-2 rounded-xl ${
                    isCartoon
                      ? 'bg-[#D7FF64] border-2 border-[#242424]'
                      : 'bg-[#EDE6D5] border border-[#2D2926]'
                  }`}
                >
                  <Cookie className="w-5 h-5 text-[#1A1510]" />
                </div>
                <h4
                  className={`text-base font-black ${
                    isCartoon ? 'text-[#242424]' : 'text-[#1A1510]'
                  }`}
                  style={{ fontFamily: isCartoon ? 'inherit' : 'Georgia, serif' }}
                >
                  {t('cookieBannerTitle')}
                </h4>
              </div>
              <button
                onClick={() => setShowBanner(false)}
                className="text-[#888888] hover:text-[#242424] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#555555] font-medium leading-relaxed mb-4">
              {t('cookieBannerDesc')}
            </p>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={handleAcceptAll}
                className={`flex-1 py-2 px-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isCartoon
                    ? 'rounded-xl border-2 border-[#242424] bg-[#D7FF64] hover:bg-[#cbf556] text-[#242424] shadow-[2px_2px_0px_#242424] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                    : 'bg-[#1A1510] text-[#F5F0E8] border border-[#1A1510] hover:bg-[#332B24]'
                }`}
              >
                {t('cookieAcceptAll')}
              </button>

              <button
                onClick={() => {
                  setShowBanner(false);
                  setIsModalOpen(true);
                }}
                className={`py-2 px-3 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  isCartoon
                    ? 'rounded-xl border-2 border-[#242424] bg-white hover:bg-[#FFF9EF] text-[#242424] shadow-[2px_2px_0px_#242424] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                    : 'bg-[#EDE6D5] text-[#1A1510] border border-[#2D2926] hover:bg-[#E5DDC9]'
                }`}
              >
                {t('cookieCustomize')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-lg z-10 overflow-hidden max-h-[90vh] flex flex-col p-6 sm:p-8 ${
                isCartoon
                  ? 'bg-[#FFF9EF] border-[2.5px] border-[#242424] rounded-[32px] shadow-[6px_6px_0px_#242424]'
                  : 'bg-[#F5F0E8] border-[1.5px] border-[#2D2926] shadow-[4px_4px_0px_#8B7355]'
              }`}
            >
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#242424]/10 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-2xl ${
                      isCartoon
                        ? 'bg-[#D7FF64] border-2 border-[#242424]'
                        : 'bg-[#EDE6D5] border border-[#2D2926]'
                    }`}
                  >
                    <Sliders className="w-5 h-5 text-[#1A1510]" />
                  </div>
                  <div>
                    <h3
                      className={`text-xl sm:text-2xl font-black ${
                        isCartoon ? 'text-[#242424]' : 'text-[#1A1510]'
                      }`}
                      style={{ fontFamily: isCartoon ? 'inherit' : 'Georgia, serif' }}
                    >
                      {t('cookieModalTitle')}
                    </h3>
                    <p className="text-xs text-[#777777] font-medium mt-0.5">
                      {t('cookieModalSubtitle')}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`p-1.5 transition-colors cursor-pointer shrink-0 ${
                    isCartoon
                      ? 'border-2 border-[#242424] bg-white rounded-full hover:bg-[#D7FF64] text-[#242424]'
                      : 'border border-[#2D2926] bg-[#EDE6D5] hover:bg-[#E5DDC9] text-[#1A1510]'
                  }`}
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>

              <div className="overflow-y-auto space-y-4 pr-1 flex-1">
                <div
                  className={`p-4 transition-all ${
                    isCartoon
                      ? 'bg-white rounded-2xl border-2 border-[#242424]'
                      : 'bg-[#EDE6D5] border border-[#2D2926]/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#7655F7]" />
                      <span className="text-sm font-black text-[#242424]">
                        {t('cookieCategoryNecessary')}
                      </span>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                        isCartoon
                          ? 'rounded-full bg-[#EADEFF] border border-[#242424] text-[#7655F7]'
                          : 'border border-[#2D2926] bg-[#F5F0E8] text-[#1A1510]'
                      }`}
                    >
                      <Lock className="w-3 h-3" />
                      <span>{t('cookieAlwaysActive')}</span>
                    </span>
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    {t('cookieCategoryNecessaryDesc')}
                  </p>
                </div>

                <div
                  className={`p-4 transition-all ${
                    isCartoon
                      ? 'bg-white rounded-2xl border-2 border-[#242424]'
                      : 'bg-[#EDE6D5] border border-[#2D2926]/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-black text-[#242424]">
                      {t('cookieCategoryPreferences')}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPreferences({
                          ...preferences,
                          preferences: !preferences.preferences,
                        })
                      }
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                        preferences.preferences
                          ? isCartoon
                            ? 'bg-[#7655F7] border border-[#242424]'
                            : 'bg-[#1A1510]'
                          : 'bg-[#CCCCCC]'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          preferences.preferences ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    {t('cookieCategoryPreferencesDesc')}
                  </p>
                </div>

                <div
                  className={`p-4 transition-all ${
                    isCartoon
                      ? 'bg-white rounded-2xl border-2 border-[#242424]'
                      : 'bg-[#EDE6D5] border border-[#2D2926]/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-black text-[#242424]">
                      {t('cookieCategoryAnalytics')}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setPreferences({
                          ...preferences,
                          analytics: !preferences.analytics,
                        })
                      }
                      className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                        preferences.analytics
                          ? isCartoon
                            ? 'bg-[#7655F7] border border-[#242424]'
                            : 'bg-[#1A1510]'
                          : 'bg-[#CCCCCC]'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                          preferences.analytics ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    {t('cookieCategoryAnalyticsDesc')}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-4 border-t border-[#242424]/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                <button
                  type="button"
                  onClick={handleRejectOptional}
                  className={`py-2.5 px-4 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                    isCartoon
                      ? 'rounded-2xl border-2 border-[#242424] bg-white hover:bg-[#FFF9EF] text-[#242424] shadow-[2px_2px_0px_#242424] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                      : 'bg-[#EDE6D5] text-[#1A1510] border border-[#2D2926] hover:bg-[#E5DDC9]'
                  }`}
                >
                  {t('cookieRejectOptional')}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveCustom}
                    className={`flex-1 sm:flex-none py-2.5 px-4 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      isCartoon
                        ? 'rounded-2xl border-2 border-[#242424] bg-[#FFF9EF] hover:bg-[#FFE5B4] text-[#242424] shadow-[2px_2px_0px_#242424] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                        : 'bg-[#F5F0E8] text-[#1A1510] border border-[#2D2926] hover:bg-[#E5DDC9]'
                    }`}
                  >
                    {t('cookieSavePreferences')}
                  </button>

                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className={`flex-1 sm:flex-none py-2.5 px-5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                      isCartoon
                        ? 'rounded-2xl border-2 border-[#242424] bg-[#D7FF64] hover:bg-[#cbf556] text-[#242424] shadow-[2px_2px_0px_#242424] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
                        : 'bg-[#1A1510] text-[#F5F0E8] border border-[#1A1510] hover:bg-[#332B24]'
                    }`}
                  >
                    {t('cookieAcceptAll')}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

