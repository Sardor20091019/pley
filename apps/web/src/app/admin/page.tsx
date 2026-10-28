'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import {
  fetchAdminMetrics,
  fetchAdminBookings,
  fetchAdminAuditLogs,
  createAdminSession,
} from '../../lib/api';
import { AdminMetrics } from '../../lib/types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  Shield,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function AdminPage(): React.JSX.Element {
  const { user, isAdmin, loginAs } = useAuth();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const [sessionForm, setSessionForm] = useState({
    venueId: 'ven_chilonzor_arena',
    sportId: 'sport_tt',
    title: '',
    scheduledAt: '',
    durationMinutes: 90,
    maxSlots: 6,
    minParticipants: 2,
    pricePerSlot: 28000,
    serviceFee: 3000,
    skillLevel: 'BEGINNER',
    sessionVibe: 'FRIENDLY',
    equipmentProvided: true,
    equipmentDetails: 'Rackets and balls included',
    rulesNotes: 'Rotating round robin games',
    bookingDeadline: '',
    cancellationDeadlineHours: 4,
  });

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      const [m, b, a] = await Promise.all([
        fetchAdminMetrics(),
        fetchAdminBookings(),
        fetchAdminAuditLogs(),
      ]);
      setMetrics(m);
      setBookings(b);
      setAuditLogs(a);
    } catch {
      // access or network error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const handleCreateSession = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setFormSubmitting(true);
    setCreateSuccess(null);
    setCreateError(null);

    try {
      const scheduledIso = new Date(sessionForm.scheduledAt).toISOString();
      const deadlineIso = sessionForm.bookingDeadline
        ? new Date(sessionForm.bookingDeadline).toISOString()
        : new Date(new Date(sessionForm.scheduledAt).getTime() - 2 * 3600 * 1000).toISOString();

      await createAdminSession({
        ...sessionForm,
        scheduledAt: scheduledIso,
        bookingDeadline: deadlineIso,
      });

      setCreateSuccess('Sessiya muvaffaqiyatli yaratildi va eʼlon qilindi!');
      setShowCreateModal(false);
      await loadData();
    } catch (err: any) {
      setCreateError(err.message || 'Xatolik yuz berdi');
    } finally {
      setFormSubmitting(false);
    }
  };

  const isDbAdmin = user?.role === 'ADMIN';

  if (!isDbAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <Shield className="w-12 h-12 mx-auto text-[#FF795D]" />
        <h2 className="text-2xl font-black text-[#242424]">
          Administrator huquqi talab qilinadi
        </h2>
        <p className="text-sm font-semibold text-[#666666]">
          Ushbu sahifa faqat maʼlumotlar bazasida (users table) role = &apos;ADMIN&apos; boʻlgan hisoblar uchun ochiq. Sizning joriy rolingiz: <span className="font-black text-[#7655F7]">{user?.role || 'Nomaʼlum'}</span>.
        </p>
        <Button
          variant="lime"
          size="sm"
          onClick={async () => {
            await loginAs('usr_admin_1');
          }}
        >
          Jasur (Admin, db role=ADMIN) hisobiga oʻtish
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Badge variant="purple" size="md">
            Pley Operatsion Markazi
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-[#242424]">
            BOSHQARUV PANELI
          </h1>
          <p className="text-sm font-semibold text-[#555555]">
            Haqiqiy metrikalar, sessiyalarni rejalashtirish va audit loglari.
          </p>
        </div>

        <Button
          variant="lime"
          size="md"
          onClick={() => setShowCreateModal(true)}
          className="shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Yangi sessiya ochish</span>
        </Button>
      </div>

      {createSuccess && (
        <div className="p-4 bg-[#D7FF64] border-2 border-[#242424] rounded-2xl flex items-center gap-2 font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 text-[#7655F7]" />
          <span>{createSuccess}</span>
        </div>
      )}

      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <Card variant="white" className="p-5 space-y-1">
            <div className="text-xs font-bold text-[#888888] uppercase">
              Jami foydalanuvchilar
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#242424]">
              {metrics.totalUsers}
            </div>
            <div className="text-[11px] font-semibold text-[#7655F7]">
              {metrics.totalVenues} ta zal ulangan
            </div>
          </Card>

          <Card variant="white" className="p-5 space-y-1">
            <div className="text-xs font-bold text-[#888888] uppercase">
              Kutilayotgan oʻyinlar
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#7655F7]">
              {metrics.upcomingSessions}
            </div>
            <div className="text-[11px] font-semibold text-[#555555]">
              {metrics.totalSessions} jami oʻyin
            </div>
          </Card>

          <Card variant="white" className="p-5 space-y-1">
            <div className="text-xs font-bold text-[#888888] uppercase">
              Jami aylanma (UZS)
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#242424]">
              {metrics.grossBookingVolumeUz.toLocaleString()}
            </div>
            <div className="text-[11px] font-semibold text-[#FF795D]">
              {metrics.confirmedBookings} tasdiqlangan joy
            </div>
          </Card>

          <Card variant="lime" className="p-5 space-y-1">
            <div className="text-xs font-bold text-[#242424] uppercase">
              Platforma daromadi (UZS)
            </div>
            <div className="text-xl sm:text-2xl font-black text-[#242424]">
              {metrics.platformRevenueUz.toLocaleString()}
            </div>
            <div className="text-[11px] font-black text-[#7655F7]">
              Toʻldirilish darajasi: {metrics.averageFillRatePercentage}%
            </div>
          </Card>
        </div>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-[#242424]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <Card
            variant="white"
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6"
          >
            <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3">
              <h3 className="text-xl sm:text-2xl font-black text-[#242424]">
                Yangi sessiya yaratish
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-8 h-8 rounded-full bg-[#FFF9EF] border-2 border-[#242424] font-black text-sm"
              >
                ✕
              </button>
            </div>

            {createError && (
              <div className="p-3 bg-[#FF795D] text-white rounded-xl text-xs font-bold">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateSession} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                  Sessiya sarlavhasi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan, Saturday Evening Reflex Rally"
                  value={sessionForm.title}
                  onChange={(e) =>
                    setSessionForm({ ...sessionForm, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                    Sport majmuasi
                  </label>
                  <select
                    value={sessionForm.venueId}
                    onChange={(e) =>
                      setSessionForm({ ...sessionForm, venueId: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                  >
                    <option value="ven_chilonzor_arena">Chilonzor Sports Club</option>
                    <option value="ven_yunusobod_hub">Yunusobod PingPong & Hoops</option>
                    <option value="ven_mirzo_court">Mirzo Ulugʻbek Community Court</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                    Sport turi
                  </label>
                  <select
                    value={sessionForm.sportId}
                    onChange={(e) =>
                      setSessionForm({ ...sessionForm, sportId: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                  >
                    <option value="sport_tt">Stol tennisi</option>
                    <option value="sport_bball">3x3 Basketbol</option>
                    <option value="sport_badmin">Badminton</option>
                    <option value="sport_vball">Voleybol</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                    Boshlanish sanasi va vaqti
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={sessionForm.scheduledAt}
                    onChange={(e) =>
                      setSessionForm({ ...sessionForm, scheduledAt: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                    Davomiyligi (daqiqa)
                  </label>
                  <input
                    type="number"
                    min="30"
                    step="15"
                    value={sessionForm.durationMinutes}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        durationMinutes: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                    Maksimal joy (Slot)
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="30"
                    value={sessionForm.maxSlots}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        maxSlots: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                    Zal narxi / joy (UZS)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={sessionForm.pricePerSlot}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        pricePerSlot: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                    Xizmat haqi (UZS)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={sessionForm.serviceFee}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        serviceFee: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                    Daraja
                  </label>
                  <select
                    value={sessionForm.skillLevel}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        skillLevel: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                  >
                    <option value="ALL_LEVELS">Barcha darajalar</option>
                    <option value="BEGINNER">Boshlangʻich</option>
                    <option value="CASUAL">Havaskor</option>
                    <option value="INTERMEDIATE">Oʻrta</option>
                    <option value="ADVANCED">Ilgʻor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                    Atmosfera / Vibe
                  </label>
                  <select
                    value={sessionForm.sessionVibe}
                    onChange={(e) =>
                      setSessionForm({
                        ...sessionForm,
                        sessionVibe: e.target.value as any,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                  >
                    <option value="FRIENDLY">Doʻstona va erkin</option>
                    <option value="SOCIAL">Ijtimoiy va muloqot</option>
                    <option value="LEARNING">Oʻrganish va mashq</option>
                    <option value="COMPETITIVE">Raqobatbardosh</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="white"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  Bekor qilish
                </Button>
                <Button
                  type="submit"
                  variant="lime"
                  size="sm"
                  disabled={formSubmitting}
                >
                  {formSubmitting ? 'Yaratilmoqda...' : 'Eʼlon qilish'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card variant="white" className="space-y-4 p-5 sm:p-6">
          <h3 className="text-xl font-black text-[#242424]">
            Soʻnggi bandliklar
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead>
                <tr className="border-b border-[#EEEEEE] text-[#888888]">
                  <th className="py-2">Oʻyinchi</th>
                  <th className="py-2">Sessiya</th>
                  <th className="py-2">Narx</th>
                  <th className="py-2">Holat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F2]">
                {bookings.map((b) => (
                  <tr key={b.booking_id}>
                    <td className="py-2.5">
                      <div className="font-extrabold text-[#242424]">
                        {b.user_name}
                      </div>
                      <div className="text-[10px] text-[#7655F7]">
                        @{b.user_telegram || 'unknown'}
                      </div>
                    </td>
                    <td className="py-2.5">
                      <div className="text-[#242424]">{b.session_title}</div>
                      <div className="text-[10px] text-[#888888]">{b.venue_name}</div>
                    </td>
                    <td className="py-2.5 text-[#242424]">
                      {(b.price + b.service_fee).toLocaleString()} UZS
                    </td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full bg-[#D7FF64] border border-[#242424] text-[10px]">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card variant="white" className="space-y-4 p-5 sm:p-6">
          <h3 className="text-xl font-black text-[#242424]">
            Audit Loglari
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead>
                <tr className="border-b border-[#EEEEEE] text-[#888888]">
                  <th className="py-2">Vaqt</th>
                  <th className="py-2">Amal</th>
                  <th className="py-2">Nishon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F2]">
                {auditLogs.slice(0, 8).map((log) => (
                  <tr key={log.id}>
                    <td className="py-2.5 text-[#888888] text-[10px]">
                      {new Date(log.created_at).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 font-extrabold text-[#7655F7]">
                      {log.action}
                    </td>
                    <td className="py-2.5 text-[#242424] text-[11px]">
                      {log.target_type}: {log.target_id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

