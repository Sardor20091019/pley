'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppTheme } from '../../lib/theme/ThemeContext';
import { Sparkles, Zap } from 'lucide-react';

export function ThemeSwitcher(): React.JSX.Element {
  const { theme, toggleTheme, isTransitioning } = useAppTheme();
  const isCartoon = theme === 'cartoon';

  return (
    <button
      onClick={toggleTheme}
      disabled={isTransitioning}
      title={isCartoon ? "Switch to Kinetic Studio Mode" : "Switch to Cartoon Playful Mode"}
      className="relative flex items-center select-none outline-none group transition-all"
    >
      <AnimatePresence mode="wait">
        {isCartoon ? (
          <motion.div
            key="cartoon-btn"
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#D7FF64] border-2 border-[#242424] shadow-[2px_2px_0px_#242424] text-xs font-black text-[#242424] hover:bg-[#cbf556] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#7655F7]" />
            <span className="tracking-tight uppercase">Cartoon</span>
          </motion.div>
        ) : (
          <motion.div
            key="kinetic-btn"
            initial={{ opacity: 0, scale: 0.9, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[rgba(118,85,247,0.18)] border border-[rgba(155,125,255,0.5)] shadow-[0_0_16px_rgba(118,85,247,0.35)] text-xs font-extrabold text-[#F0EDFF] hover:bg-[rgba(118,85,247,0.3)]"
          >
            <Zap className="w-3.5 h-3.5 text-[#C8FF00]" />
            <span className="tracking-wider uppercase text-[#C8FF00]">Kinetic</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

