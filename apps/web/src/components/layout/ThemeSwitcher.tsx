'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppTheme } from '../../lib/theme/ThemeContext';
import { Sparkles, BookOpen } from 'lucide-react';

export function ThemeSwitcher(): React.JSX.Element {
  const { theme, toggleTheme, isTransitioning } = useAppTheme();
  const isCartoon = theme === 'cartoon';

  return (
    <button
      onClick={toggleTheme}
      disabled={isTransitioning}
      title={isCartoon ? "Switch to Editorial Gazette" : "Switch to Cartoon Playful Mode"}
      className="relative flex items-center select-none outline-none group cursor-pointer"
    >
      <AnimatePresence mode="wait">
        {isCartoon ? (
          <motion.div
            key="cartoon-btn"
            initial={{ opacity: 0, scale: 0.92, y: -2 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 2 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D7FF64] border-2 border-[#242424] shadow-[2px_2px_0px_#242424] text-xs font-black text-[#242424] hover:bg-[#cbf556] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7655F7]" />
            <span className="tracking-tight uppercase">Cartoon</span>
          </motion.div>
        ) : (
          <motion.div
            key="editorial-btn"
            initial={{ opacity: 0, scale: 0.92, y: -2 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 2 }}
            transition={{ duration: 0.18 }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#EDE6D5] border-[1.5px] border-[#2D2926] shadow-[2px_2px_0px_#8B7355] text-xs font-bold text-[#1A1510] hover:bg-[#E5DDC9] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#8B7355]" />
            <span className="tracking-wider uppercase text-[11px] font-extrabold text-[#1A1510]">Editorial</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
