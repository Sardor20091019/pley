'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useI18n } from '../../lib/i18n/useI18n';
import { fetchAchievements, updateProfile } from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Mascot } from '../../components/mascot/Mascot';
import {
  User,
  Medal,
  CheckCircle2,
  Bell,
  Sparkles,
  Shield,
  Layers,
} from 'lucide-react';

export default function ProfilePage(): React.JSX.Element {
  const { user, loginAs, isAdmin, refreshProfile } = useAuth();
  const { t } = useI18n();

  const [achievements, setAchievements] = useState<any[]>([]);
  const [firstName, setFirstName] = useState<string>('');
  const [skillLevel, setSkillLevel] = useState<string>('BEGINNER');
  const [ageBracket, setAgeBracket] = useState<string>('18-24');
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

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

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-2">
        <Badge variant="lime" size="md">
          Sportchi profili
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-[#242424]">
          PROFIL VA SOZLAMALAR
        </h1>
        <p className="text-sm sm:text-base font-semibold text-[#555555]">
          Oʻyin darajangiz, sevimli zonalaringiz va yutuqlaringiz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="white" className="md:col-span-1 text-center space-y-4 p-6">
          <div className="relative inline-block">
            <Mascot size="lg" mood="happy" />
          </div>

          <div>
            <h3 className="text-xl font-black text-[#242424]">
              {user?.first_name || 'Sportchi'} {user?.last_name || ''}
            </h3>
            <div className="text-xs font-bold text-[#7655F7] mt-0.5">
              @{user?.telegram_username || 'pley_user'}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1">
            <Badge variant="purple" size="sm">
              {user?.role === 'ADMIN' ? 'Administrator' : 'Oʻyinchi'}
            </Badge>
            <Badge variant="lime" size="sm">
              {user?.skill_level || 'BEGINNER'}
            </Badge>
          </div>

          <div className="pt-4 border-t border-[#EEEEEE] space-y-2">
            <div className="text-[11px] font-black uppercase text-[#888888]">
              Hisob almashtirish (Demo)
            </div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => loginAs('usr_admin_1')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                  user?.id === 'usr_admin_1'
                    ? 'bg-[#7655F7] text-white border-[#242424]'
                    : 'bg-[#FFF9EF] hover:bg-white border-[#E0E0E0]'
                }`}
              >
                Jasur (Admin)
              </button>
              <button
                onClick={() => loginAs('usr_demo_1')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                  user?.id === 'usr_demo_1'
                    ? 'bg-[#D7FF64] text-[#242424] border-[#242424]'
                    : 'bg-[#FFF9EF] hover:bg-white border-[#E0E0E0]'
                }`}
              >
                Timur (Player)
              </button>
              <button
                onClick={() => loginAs('usr_demo_2')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                  user?.id === 'usr_demo_2'
                    ? 'bg-[#D7FF64] text-[#242424] border-[#242424]'
                    : 'bg-[#FFF9EF] hover:bg-white border-[#E0E0E0]'
                }`}
              >
                Madina (Player)
              </button>
            </div>
          </div>
        </Card>

        <Card variant="white" className="md:col-span-2 space-y-6 p-6 sm:p-8">
          <div>
            <h3 className="text-xl font-black text-[#242424]">
              Maʼlumotlarni tahrirlash
            </h3>
            <p className="text-xs text-[#777777]">
              Ism va sport darajangiz zalda boshqa ishtirokchilarga koʻrinadi.
            </p>
          </div>

          {saveSuccess && (
            <div className="p-3 bg-[#D7FF64] border-2 border-[#242424] rounded-xl text-xs font-black text-[#242424] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#7655F7]" />
              <span>Oʻzgarishlar muvaffaqiyatli saqlandi!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                Ism
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
                  Sport darajasi
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
                  Yosh toifasi
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
                {saving ? 'Saqlanmoqda...' : 'Saqlash'}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Medal className="w-5 h-5 text-[#7655F7]" />
          <h2 className="text-2xl font-black text-[#242424]">Yutuqlar</h2>
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
                    Ochilgan ✨
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-[#888888]">
                    Qulflangan 🔒
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

