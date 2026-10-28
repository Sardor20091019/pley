'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useI18n } from '../lib/i18n/useI18n';
import { useAppTheme } from '../lib/theme/ThemeContext';
import { fetchSessions, submitPartnershipInquiry } from '../lib/api';
import { SessionItem } from '../lib/types';
import { CartoonHomePage } from '../components/world/CartoonHomePage';
import { EditorialHomePage } from '../components/world/EditorialHomePage';

export default function HomePage(): React.JSX.Element {
  const { t } = useI18n();
  const { theme } = useAppTheme();
  const [upcomingSessions, setUpcomingSessions] = useState<SessionItem[]>([]);
  const [partnerForm, setPartnerForm] = useState({
    contactName: '',
    phone: '',
    venueName: '',
    district: 'Yunusobod',
    sportTypes: 'table-tennis',
    message: '',
  });
  const [partnerSubmitting, setPartnerSubmitting] = useState<boolean>(false);
  const [partnerSuccess, setPartnerSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function load(): Promise<void> {
      try {
        const data = await fetchSessions();
        setUpcomingSessions(data.slice(0, 3));
      } catch {}
    }
    load();
  }, []);

  const handlePartnerSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setPartnerSubmitting(true);
    try {
      await submitPartnershipInquiry(partnerForm);
      setPartnerSuccess(true);
    } finally {
      setPartnerSubmitting(false);
    }
  };

  const isCartoon = theme === 'cartoon';

  return (
    <AnimatePresence mode="wait">
      {isCartoon ? (
        <motion.div
          key="cartoon-mode"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <CartoonHomePage
            t={t}
            upcomingSessions={upcomingSessions}
            partnerForm={partnerForm}
            setPartnerForm={setPartnerForm}
            partnerSubmitting={partnerSubmitting}
            partnerSuccess={partnerSuccess}
            handlePartnerSubmit={handlePartnerSubmit}
          />
        </motion.div>
      ) : (
        <motion.div
          key="editorial-mode"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <EditorialHomePage
            t={t}
            upcomingSessions={upcomingSessions}
            partnerForm={partnerForm}
            setPartnerForm={setPartnerForm}
            partnerSubmitting={partnerSubmitting}
            partnerSuccess={partnerSuccess}
            handlePartnerSubmit={handlePartnerSubmit}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
