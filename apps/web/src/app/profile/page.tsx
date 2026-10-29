'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../lib/i18n/useI18n';
import { useAppTheme } from '../../lib/theme/ThemeContext';
import { fetchAchievements, updateProfile, uploadAvatar } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Mascot } from '../../components/mascot/Mascot';
import { useAuthModal } from '../../lib/auth/AuthModalContext';
import {
  User,
  Medal,
  CheckCircle2,
  Camera,
  Shield,
  Check,
  Award,
  Scroll,
} from 'lucide-react';

export default function ProfilePage(): React.JSX.Element {
  const { user, refreshProfile } = useAuth();
  const { openLoginModal } = useAuthModal();
  const { t } = useI18n();
  const { theme } = useAppTheme();
  const isEditorial = theme === 'editorial';

  const [achievements, setAchievements] = useState<any[]>([]);
  const [firstName, setFirstName] = useState<string>('');
  const [skillLevel, setSkillLevel] = useState<string>('BEGINNER');
  const [ageBracket, setAgeBracket] = useState<string>('18-24');
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setSkillLevel(user.skill_level || 'BEGINNER');
      setAgeBracket(user.age_bracket || '18-24');
    }
  }, [user]);

  useEffect(() => {
    async function loadAchievements(): Promise<void> {
      const data = await fetchAchievements();
      setAchievements(data);
    }
    loadAchievements();
  }, []);

  const handleAvatarSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    setUploadError(null);

    try {
      await uploadAvatar(file);
      await refreshProfile();
    } catch (err: any) {
      setUploadError(err.message || 'Rasm yuklashda xatolik yuz berdi');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await updateProfile({
        first_name: firstName,
        skill_level: skillLevel as any,
        age_bracket: ageBracket,
      });
      await refreshProfile();
      setSaveSuccess(true);
    } finally {
      setSaving(false);
    }
  };

  const isDbAdmin = user?.role === 'ADMIN';

  if (!user) {
    if (isEditorial) {
      return (
        <div className="max-w-xl mx-auto my-16 px-4">
          <div className="bg-[#EDE6D5] border-2 border-[#2D2926] p-8 text-center space-y-5 shadow-[3px_3px_0px_#2D2926]">
            <Scroll className="w-10 h-10 text-[#8B7355] mx-auto" />
            <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">
              {t('profileRegisterTitle')}
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold text-[#1A1510]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {t('profileDossierTitle')}
            </h2>
            <p className="text-xs font-serif italic text-[#8B7355] max-w-sm mx-auto">
              Profil sozlamalarini boshqarish va oʻyinlarga yozilish uchun rasmiy Google hisobi orqali autentifikatsiyadan oʻting.
            </p>
            <div className="pt-2">
              <button
                onClick={() => openLoginModal('/profile')}
                className="w-full py-3 text-xs font-sans font-bold tracking-widest uppercase bg-[#1A1510] text-[#F5F0E8] border border-[#2D2926] hover:bg-[#332B24] transition-all cursor-pointer"
              >
                {t('myGamesGoogleLogin')}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto my-16 px-4 text-center space-y-4">
        <Mascot size="lg" mood="happy" />
        <h2 className="text-2xl font-black text-[#242424]">
          {t('navProfile')}
        </h2>
        <p className="text-sm font-semibold text-[#666666]">
          Profil sozlamalarini boshqarish va oʻyinlarga yozilish uchun Google hisobingiz bilan kiring.
        </p>
        <div className="pt-2">
          <Button
            variant="purple"
            size="md"
            onClick={() => openLoginModal('/profile')}
            fullWidth
            className="text-sm font-black"
          >
            {t('myGamesGoogleLogin')}
          </Button>
        </div>
      </div>
    );
  }

  if (isEditorial) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
        <div className="border-b-2 border-double border-[#2D2926] pb-6 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-sans font-bold tracking-widest uppercase text-[#8B7355]">
            <span>SPORTCHI DOSYESI VA KARTASI</span>
            <span>№ {user.id ? user.id.slice(0, 8).toUpperCase() : 'PLY-001'}</span>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold text-[#1A1510]"
            style={{ fontFamily: 'Georgia, serif' }}
          >
            {t('profileDossierTitle')}
          </h1>
          <p className="text-sm font-serif italic text-[#8B7355]">
            Jamoaviy oʻyinlardagi rasmiy koʻrsatkichlaringiz, sport toifangiz va qaydnoma maʼlumotlari.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="bg-[#EDE6D5] border-2 border-[#2D2926] p-6 text-center space-y-4 shadow-[3px_3px_0px_#2D2926]">
              <div className="relative inline-block">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.first_name}
                    className="w-24 h-24 object-cover border-2 border-[#2D2926] mx-auto"
                  />
                ) : (
                  <div className="w-24 h-24 bg-[#F5F0E8] border-2 border-[#2D2926] flex items-center justify-center text-3xl font-bold font-serif text-[#1A1510] mx-auto">
                    {user.first_name[0]}
                  </div>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="absolute bottom-0 right-0 p-2 bg-[#1A1510] text-[#F5F0E8] border border-[#2D2926] hover:bg-[#332B24] transition-all cursor-pointer"
                  title="Suratni yangilash"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarSelect}
                  className="hidden"
                />
              </div>

              {uploadingAvatar && (
                <div className="text-[11px] font-sans font-bold text-[#8B7355] animate-pulse">
                  {t('profilePhotoUploading')}
                </div>
              )}

              {uploadError && (
                <div className="text-[11px] font-sans font-bold text-[#8B2E2E]">
                  {uploadError}
                </div>
              )}

              <div>
                <h3
                  className="text-xl font-bold text-[#1A1510]"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {user.first_name} {user.last_name || ''}
                </h3>
                <div className="text-xs text-[#8B7355] font-sans mt-0.5">
                  {user.email || 'Google hisobi'}
                </div>
              </div>

              <div className="pt-2 border-t border-[#2D2926]/20 flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-1 bg-[#1A1510] text-[#F5F0E8] border border-[#2D2926]">
                  {t('profileRoleLabel')}: {user.role}
                </span>
                <span className="text-[10px] font-sans font-bold uppercase tracking-wider px-2.5 py-0.5 bg-[#F5F0E8] border border-[#2D2926]/40 text-[#8B7355]">
                  {t('profileLevelLabel')}: {user.skill_level}
                </span>
              </div>

              <div className="pt-3 border-t border-[#2D2926]/20 space-y-1 text-left">
                <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">
                  {t('profileEmailLabel')}
                </div>
                <div className="p-2 bg-[#F5F0E8] border border-[#2D2926]/30 flex items-center gap-2 text-xs font-sans text-[#1A1510]">
                  <Check className="w-3.5 h-3.5 text-[#C5A55A]" />
                  <span className="truncate">{user.email || 'Google hisobi tasdiqlangan'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-6">
            <div className="bg-[#EDE6D5] border border-[#2D2926] p-6 sm:p-8 shadow-[2px_2px_0px_#8B7355] space-y-6">
              <div className="border-b border-[#2D2926]/20 pb-3">
                <h3
                  className="text-xl font-bold text-[#1A1510]"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {t('profileEditTitle')}
                </h3>
                <p className="text-xs font-serif italic text-[#8B7355]">
                  Ism va toifangiz oyinlar hisobotida boshqa foydalanuvchilarga ko'rinadi.
                </p>
              </div>

              {saveSuccess && (
                <div className="p-3 bg-[#F5F0E8] border border-[#2D2926] text-xs font-sans font-bold uppercase tracking-wider text-[#1A1510] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C5A55A]" />
                  <span>{t('profileSavedNotice')}</span>
                </div>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1.5">
                    {t('profileFirstNameLabel')}
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-[#F5F0E8] border border-[#2D2926] font-sans text-xs sm:text-sm text-[#1A1510] outline-none focus:border-[#1A1510]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1.5">
                      {t('profileLevelLabel')}
                    </label>
                    <select
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F5F0E8] border border-[#2D2926] font-sans text-xs sm:text-sm text-[#1A1510] outline-none"
                    >
                      <option value="BEGINNER">{t('beginner')}</option>
                      <option value="CASUAL">{t('casual')}</option>
                      <option value="INTERMEDIATE">{t('intermediate')}</option>
                      <option value="ADVANCED">{t('advanced')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1.5">
                      {t('profileAgeLabel')}
                    </label>
                    <select
                      value={ageBracket}
                      onChange={(e) => setAgeBracket(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#F5F0E8] border border-[#2D2926] font-sans text-xs sm:text-sm text-[#1A1510] outline-none"
                    >
                      <option value="18-24">18–24 yosh</option>
                      <option value="25-34">25–34 yosh</option>
                      <option value="35+">35+ yosh</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 text-xs font-sans font-bold tracking-widest uppercase bg-[#1A1510] text-[#F5F0E8] border border-[#2D2926] hover:bg-[#332B24] transition-all cursor-pointer"
                  >
                    {saving ? t('profileSavingBtn') : t('profileSaveBtn')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t border-[#2D2926]/30">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#C5A55A]" />
            <h2
              className="text-2xl font-bold text-[#1A1510]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {t('profileAchievementsTitle')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-4 space-y-2 text-center border transition-all ${
                  ach.isUnlocked
                    ? 'bg-[#EDE6D5] border-[#2D2926] shadow-[2px_2px_0px_#8B7355]'
                    : 'bg-[#F5F0E8] border-[#2D2926]/30 opacity-60'
                }`}
              >
                <div className="text-3xl">{ach.badge}</div>
                <h4
                  className="text-sm font-bold text-[#1A1510]"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {ach.title}
                </h4>
                <p className="text-xs text-[#8B7355] font-serif italic leading-tight">
                  {ach.description}
                </p>
                <div className="pt-1">
                  {ach.isUnlocked ? (
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#1A1510] bg-[#F5F0E8] border border-[#2D2926] px-2 py-0.5">
                      {t('profileUnlocked')} ★
                    </span>
                  ) : (
                    <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">
                      {t('profileLocked')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-2">
        <Badge variant="lime" size="md">
          {t('navProfile')}
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-[#242424]">
          {t('navProfile')}
        </h1>
        <p className="text-sm sm:text-base font-semibold text-[#555555]">
          Oʻyin darajangiz, fotosuratingiz va Google hisobingiz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="white" className="md:col-span-1 text-center space-y-4 p-6">
          <div className="relative inline-block">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.first_name}
                className="w-24 h-24 rounded-full object-cover border-[3px] border-[#242424] shadow-[4px_4px_0px_#242424] mx-auto"
              />
            ) : (
              <Mascot size="lg" mood="happy" />
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-[#D7FF64] border-2 border-[#242424] shadow-[2px_2px_0px_#242424] hover:bg-[#cbf556] transition-transform active:translate-y-0.5 cursor-pointer"
              title="Suratni yangilash"
            >
              <Camera className="w-4 h-4 text-[#242424]" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarSelect}
              className="hidden"
            />
          </div>

          {uploadingAvatar && (
            <div className="text-xs font-black text-[#7655F7] animate-pulse">
              {t('profilePhotoUploading')}
            </div>
          )}

          {uploadError && (
            <div className="text-[11px] font-bold text-[#FF795D]">
              {uploadError}
            </div>
          )}

          <div>
            <h3 className="text-xl font-black text-[#242424]">
              {user.first_name} {user.last_name || ''}
            </h3>
            <div className="text-xs font-bold text-[#7655F7] mt-0.5">
              {user.email || 'Google hisobi'}
            </div>
          </div>

          <div className="flex flex-col items-center gap-1.5 pt-1">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black uppercase border-2 border-[#242424] shadow-[2px_2px_0px_#242424] ${
                isDbAdmin
                  ? 'bg-[#7655F7] text-white'
                  : 'bg-[#FFF9EF] text-[#242424]'
              }`}
            >
              {t('profileRoleLabel')}: {user.role}
            </span>
            <Badge variant="lime" size="sm">
              {user.skill_level}
            </Badge>
          </div>

          <div className="pt-4 border-t border-[#EEEEEE] space-y-2">
            <div className="text-[11px] font-black uppercase text-[#888888]">
              {t('profileEmailLabel')}
            </div>
            <div className="p-2.5 bg-[#FFF9EF] border-2 border-[#242424] rounded-2xl flex items-center justify-center gap-2 text-xs font-black text-[#242424]">
              <Check className="w-4 h-4 text-[#34A853]" />
              <span>{user.email || 'Google hisobi tasdiqlangan'}</span>
            </div>
          </div>
        </Card>

        <Card variant="white" className="md:col-span-2 space-y-6 p-6 sm:p-8">
          <div>
            <h3 className="text-xl font-black text-[#242424]">
              {t('profileEditTitle')}
            </h3>
            <p className="text-xs text-[#777777]">
              Ism va sport darajangiz zalda boshqa ishtirokchilarga koʻrinadi.
            </p>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-[#D7FF64] border-2 border-[#242424] rounded-xl text-xs font-black text-[#242424] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7655F7]" />
              <span>{t('profileSavedNotice')}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                {t('profileFirstNameLabel')}
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl bg-[#FFF9EF] border-2 border-[#242424] font-bold text-sm outline-none focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                  {t('profileLevelLabel')}
                </label>
                <select
                  value={skillLevel}
                  onChange={(e) => setSkillLevel(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FFF9EF] border-2 border-[#242424] font-bold text-sm outline-none focus:bg-white"
                >
                  <option value="BEGINNER">{t('beginner')}</option>
                  <option value="CASUAL">{t('casual')}</option>
                  <option value="INTERMEDIATE">{t('intermediate')}</option>
                  <option value="ADVANCED">{t('advanced')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                  {t('profileAgeLabel')}
                </label>
                <select
                  value={ageBracket}
                  onChange={(e) => setAgeBracket(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-[#FFF9EF] border-2 border-[#242424] font-bold text-sm outline-none focus:bg-white"
                >
                  <option value="18-24">18–24 yosh</option>
                  <option value="25-34">25–34 yosh</option>
                  <option value="35+">35+ yosh</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="lime"
                size="md"
                disabled={saving}
                className="w-full sm:w-auto"
              >
                {saving ? t('profileSavingBtn') : t('profileSaveBtn')}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Medal className="w-5 h-5 text-[#7655F7]" />
          <h2 className="text-2xl font-black text-[#242424]">{t('profileAchievementsTitle')}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {achievements.map((ach) => (
            <Card
              key={ach.id}
              variant={ach.isUnlocked ? 'white' : 'cream'}
              className={`p-4 space-y-2 text-center transition-all ${
                ach.isUnlocked ? 'border-[#7655F7]' : 'opacity-60 border-dashed'
              }`}
            >
              <div className="text-3xl sm:text-4xl">{ach.badge}</div>
              <h4 className="text-sm font-black text-[#242424]">
                {ach.title}
              </h4>
              <p className="text-xs text-[#666666] leading-tight">
                {ach.description}
              </p>
              <div className="pt-1">
                {ach.isUnlocked ? (
                  <span className="text-[10px] font-black uppercase text-[#7655F7] bg-[#EBE5FF] px-2 py-0.5 rounded-full">
                    {t('profileUnlocked')} ✨
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-[#888888]">
                    {t('profileLocked')} 🔒
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
