'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '../../lib/i18n/useI18n';
import { useAppTheme } from '../../lib/theme/ThemeContext';
import { fetchSessions } from '../../lib/api';
import { SessionItem } from '../../lib/types';
import { SessionCard } from '../../components/session/SessionCard';
import { EmptyStateIllustration } from '../../components/illustrations/EmptyStateIllustration';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Search, RotateCcw, Filter, BookOpen } from 'lucide-react';

export default function DiscoverPage(): React.JSX.Element {
  const { t } = useI18n();
  const { theme } = useAppTheme();
  const isEditorial = theme === 'editorial';

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

  if (isEditorial) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
        <div className="border-b-2 border-double border-[#2D2926] pb-6 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-sans font-bold tracking-widest uppercase text-[#8B7355]">
            <span>SPORT JADVALLARI BOʻLIMI</span>
            <span>TOM XXIV · TOSHKENT SHAHRIDA</span>
            <span>BOB № 12</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pt-2">
            <div>
              <h1
                className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1A1510]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                OʻYINLAR MAʼLUMOTNOMASI
              </h1>
              <p className="text-sm font-serif italic text-[#8B7355] mt-1 max-w-2xl">
                Oʻzingizga mos vaqt, sport turi va zalni tanlang. Ishtirokchilar roʻyxati transactional tartibda
                yuritiladi.
              </p>
            </div>

            <div className="border border-[#2D2926] bg-[#EDE6D5] p-3 text-right shrink-0">
              <div className="text-[10px] font-sans font-extrabold uppercase tracking-widest text-[#8B7355]">
                ROʻYXATDAGI OʻYINLAR
              </div>
              <div
                className="text-2xl font-bold text-[#1A1510]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {filteredSessions.length} TA SANA
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#EDE6D5] border border-[#2D2926] p-5 sm:p-7 shadow-[2px_2px_0px_#8B7355] space-y-6">
          <div className="flex items-center justify-between border-b border-[#2D2926]/20 pb-3">
            <div className="flex items-center gap-2 text-xs font-sans font-bold tracking-widest uppercase text-[#1A1510]">
              <Filter className="w-3.5 h-3.5 text-[#C5A55A]" />
              <span>SARALASH VA QIDIRUV MEZONLARI</span>
            </div>
            {(search || selectedSport || selectedDistrict || onlyAvailable) && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-sans font-bold uppercase tracking-wider text-[#8B7355] hover:text-[#1A1510] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Qayta tiklash</span>
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B7355]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Zal nomi, tuman yoki sport turi boʻyicha qidiring..."
              className="w-full pl-11 pr-4 py-3 bg-[#F5F0E8] border border-[#2D2926] font-sans text-xs sm:text-sm text-[#1A1510] placeholder:text-[#8B7355]/60 outline-none focus:border-[#1A1510]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <div className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">
                § I SPORT TURI
              </div>
              <div className="flex flex-wrap gap-2">
                {sportsList.map((sport) => {
                  const isSelected = selectedSport === sport.id;
                  return (
                    <button
                      key={sport.id}
                      onClick={() => setSelectedSport(sport.id)}
                      className={`px-3.5 py-1.5 text-xs font-sans font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1A1510] text-[#F5F0E8] border-[#1A1510]'
                          : 'bg-[#F5F0E8] text-[#1A1510] border-[#2D2926]/40 hover:border-[#1A1510]'
                      }`}
                    >
                      {sport.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">
                § II HUDUD VA TUMAN
              </div>
              <div className="flex flex-wrap gap-2">
                {districtsList.map((dist) => {
                  const isSelected = selectedDistrict === dist.id;
                  return (
                    <button
                      key={dist.id}
                      onClick={() => setSelectedDistrict(dist.id)}
                      className={`px-3.5 py-1.5 text-xs font-sans font-bold tracking-wider uppercase border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#1A1510] text-[#F5F0E8] border-[#1A1510]'
                          : 'bg-[#F5F0E8] text-[#1A1510] border-[#2D2926]/40 hover:border-[#1A1510]'
                      }`}
                    >
                      {dist.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#2D2926]/20 flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-xs font-sans font-bold uppercase tracking-wider text-[#1A1510] cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={(e) => setOnlyAvailable(e.target.checked)}
                className="w-4 h-4 accent-[#1A1510] rounded-none border-[#2D2926]"
              />
              <span>Faqat boʻsh oʻrinli oʻyinlar</span>
            </label>
            <div className="text-[11px] font-sans text-[#8B7355] italic">
              * Barcha joylar individual kafolat bilan taqdim etiladi
            </div>
          </div>
        </div>

        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-64 bg-[#EDE6D5] border border-[#2D2926] animate-pulse p-6"
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
            <div className="text-center py-16 px-4 bg-[#EDE6D5] border border-[#2D2926] space-y-4">
              <BookOpen className="w-10 h-10 text-[#8B7355] mx-auto" />
              <h3
                className="text-2xl font-bold text-[#1A1510]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Hozircha oʻyinlar topilmadi
              </h3>
              <p className="text-xs sm:text-sm font-serif italic text-[#8B7355] max-w-md mx-auto">
                Kiritilgan filtrlar boʻyicha mos keluvchi oʻyin topilmadi. Qidiruvni tozalab barcha roʻyxatni koʻrishingiz mumkin.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2 text-xs font-sans font-bold tracking-widest uppercase bg-[#1A1510] text-[#F5F0E8] border border-[#2D2926] hover:bg-[#332B24]"
              >
                Barcha oʻyinlarni koʻrsatish
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

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
                className="inline-flex items-center gap-1 text-xs font-black text-[#FF795D] hover:underline cursor-pointer"
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
