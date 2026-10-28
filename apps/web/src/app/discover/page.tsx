'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '../../lib/i18n/useI18n';
import { fetchSessions } from '../../lib/api';
import { SessionItem } from '../../lib/types';
import { SessionCard } from '../../components/session/SessionCard';
import { EmptyStateIllustration } from '../../components/illustrations/EmptyStateIllustration';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function DiscoverPage(): React.JSX.Element {
  const { t } = useI18n();
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedSkill, setSelectedSkill] = useState<string>('ALL_LEVELS');
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);

  useEffect(() => {
    async function load(): Promise<void> {
      setLoading(true);
      try {
        const data = await fetchSessions({
          sport: selectedSport || undefined,
          district: selectedDistrict || undefined,
          search: search || undefined,
          skillLevel: selectedSkill || undefined,
        });
        setSessions(data);
      } catch {
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [selectedSport, selectedDistrict, search, selectedSkill]);

  const sportsList = [
    { id: '', label: t('allSports'), icon: '⚡' },
    { id: 'table-tennis', label: t('tableTennis'), icon: '🏓' },
    { id: 'basketball-3x3', label: t('basketball'), icon: '🏀' },
  ];

  const districtsList = [
    { id: '', label: t('allDistricts') },
    { id: 'Chilonzor', label: 'Chilonzor' },
    { id: 'Yunusobod', label: 'Yunusobod' },
    { id: 'Mirzo Ulugʻbek', label: 'Mirzo Ulugʻbek' },
  ];

  const filteredSessions = sessions.filter((s) => {
    if (onlyAvailable && s.remainingSlots <= 0) return false;
    return true;
  });

  const resetFilters = (): void => {
    setSearch('');
    setSelectedSport('');
    setSelectedDistrict('');
    setSelectedSkill('ALL_LEVELS');
    setOnlyAvailable(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-2 text-center sm:text-left">
        <Badge variant="lime" size="md">
          {t('brandTagline')}
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-[#242424]">
          BUGUN NIMA OʻYNAYMIZ?
        </h1>
        <p className="text-sm sm:text-base font-semibold text-[#555555]">
          Oʻzingizga qulay vaqt, sport va zalni tanlang — jamoa zaldan topiladi.
        </p>
      </div>

      <div className="bg-white border-[2.5px] border-[#242424] rounded-3xl p-5 sm:p-6 shadow-[4px_4px_0px_#242424] space-y-5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#888888]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#FFF9EF] border-2 border-[#242424] font-bold text-sm outline-none focus:bg-white transition-colors"
          />
        </div>

        <div className="space-y-2">
          <div className="text-xs font-black uppercase text-[#888888]">
            Sport turi
          </div>
          <div className="flex flex-wrap gap-2">
            {sportsList.map((sport) => {
              const isSelected = selectedSport === sport.id;
              return (
                <button
                  key={sport.id}
                  onClick={() => setSelectedSport(sport.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-extrabold border-2 border-[#242424] transition-all ${
                    isSelected
                      ? 'bg-[#7655F7] text-white shadow-[2px_2px_0px_#242424]'
                      : 'bg-[#FFF9EF] text-[#242424] hover:bg-white'
                  }`}
                >
                  <span>{sport.icon}</span>
                  <span>{sport.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#EEEEEE]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black uppercase text-[#888888] mr-1">
              Tuman:
            </span>
            {districtsList.map((dist) => {
              const isSelected = selectedDistrict === dist.id;
              return (
                <button
                  key={dist.id}
                  onClick={() => setSelectedDistrict(dist.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                    isSelected
                      ? 'bg-[#D7FF64] border-[#242424] text-[#242424] shadow-[2px_2px_0px_#242424]'
                      : 'bg-white border-[#E0E0E0] hover:border-[#242424] text-[#444444]'
                  }`}
                >
                  {dist.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-xs font-bold text-[#242424] cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 rounded accent-[#7655F7]"
              />
              <span>Faqat boʻsh joyli</span>
            </label>

            {(search || selectedSport || selectedDistrict || onlyAvailable) && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-black text-[#FF795D] hover:underline"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Tozalash</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-64 rounded-3xl bg-white border-2 border-[#242424] animate-pulse p-6"
              />
            ))}
          </div>
        ) : filteredSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 space-y-4">
            <EmptyStateIllustration />
            <h3 className="text-2xl font-black text-[#242424]">
              {t('emptyGamesTitle')}
            </h3>
            <p className="text-sm font-semibold text-[#666666] max-w-sm mx-auto">
              {t('emptyGamesSubtitle')}
            </p>
            <Button size="sm" variant="lime" onClick={resetFilters}>
              Barcha oʻyinlarni koʻrsatish
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

