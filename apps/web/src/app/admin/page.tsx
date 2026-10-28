'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAppTheme } from '../../lib/theme/ThemeContext';
import {
  fetchAdminMetrics,
  fetchAdminBookings,
  fetchAdminAuditLogs,
  fetchVenues,
  fetchSports,
  createAdminSession,
  createAdminVenue,
} from '../../lib/api';
import { AdminMetrics } from '../../lib/types';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuthModal } from '../../lib/auth/AuthModalContext';
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
  FileSpreadsheet,
  Building,
  MapPin,
} from 'lucide-react';

export default function AdminPage(): React.JSX.Element {
  const { user, isAdmin } = useAuth();
  const { openLoginModal } = useAuthModal();
  const { theme } = useAppTheme();
  const isEditorial = theme === 'editorial';

  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [venues, setVenues] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);

  const [showCreateVenueModal, setShowCreateVenueModal] = useState<boolean>(false);
  const [venueSubmitting, setVenueSubmitting] = useState<boolean>(false);
  const [venueSuccess, setVenueSuccess] = useState<string | null>(null);
  const [venueError, setVenueError] = useState<string | null>(null);

  const [venueForm, setVenueForm] = useState({
    name: '',
    district: 'Chilonzor',
    address: '',
    description: '',
    supportedSports: ['table-tennis'],
    hourlyRate: 150000,
    contactPhone: '+998 71 200 00 00',
    amenities: 'Dush, Kiyinish xonasi, Bepul suv',
  });

  const [sessionForm, setSessionForm] = useState({
    venueId: '',
    sportId: '',
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
      const [m, b, a, vList, sList] = await Promise.all([
        fetchAdminMetrics(),
        fetchAdminBookings(),
        fetchAdminAuditLogs(),
        fetchVenues(),
        fetchSports(),
      ]);
      setMetrics(m);
      setBookings(b);
      setAuditLogs(a);
      setVenues(vList);
      setSports(sList);
      if (vList && vList.length > 0) {
        setSessionForm((prev) => ({
          ...prev,
          venueId: vList.some((v: any) => v.id === prev.venueId) ? prev.venueId : vList[0].id,
        }));
      }
      if (sList && sList.length > 0) {
        setSessionForm((prev) => ({
          ...prev,
          sportId: sList.some((s: any) => s.id === prev.sportId) ? prev.sportId : sList[0].id,
        }));
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const handleCreateVenue = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setVenueSubmitting(true);
    setVenueSuccess(null);
    setVenueError(null);

    try {
      const amenitiesArray = venueForm.amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

      const created = await createAdminVenue({
        name: venueForm.name,
        district: venueForm.district,
        address: venueForm.address,
        description: venueForm.description,
        supportedSports: JSON.stringify(venueForm.supportedSports),
        hourlyRate: Number(venueForm.hourlyRate),
        contactPhone: venueForm.contactPhone || null,
        amenities: JSON.stringify(amenitiesArray),
        isPartner: true,
      });

      setVenueSuccess('Sport majmuasi muvaffaqiyatli saqlandi!');
      setShowCreateVenueModal(false);
      setVenueForm({
        name: '',
        district: 'Chilonzor',
        address: '',
        description: '',
        supportedSports: ['table-tennis'],
        hourlyRate: 150000,
        contactPhone: '+998 71 200 00 00',
        amenities: 'Dush, Kiyinish xonasi, Bepul suv',
      });
      await loadData();
      if (created?.id) {
        setSessionForm((prev) => ({ ...prev, venueId: created.id }));
      }
    } catch (err: any) {
      setVenueError(err.message || 'Majmuani saqlashda xatolik yuz berdi');
    } finally {
      setVenueSubmitting(false);
    }
  };

  const handleCreateSession = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setCreateSuccess(null);
    setCreateError(null);

    if (!sessionForm.venueId) {
      setCreateError('Iltimos, avval sport majmuasini tanlang yoki yangi majmua qoʻshing');
      return;
    }
    if (!sessionForm.sportId) {
      setCreateError('Iltimos, sport turini tanlang');
      return;
    }

    setFormSubmitting(true);
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
    if (isEditorial) {
      return (
        <div className="max-w-xl mx-auto my-16 px-4">
          <div className="bg-[#EDE6D5] border-2 border-[#2D2926] p-8 text-center space-y-4 shadow-[3px_3px_0px_#2D2926]">
            <Shield className="w-10 h-10 mx-auto text-[#8B7355]" />
            <div className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#8B7355]">
              MAXSUS MAQOM TALAB ETILADI
            </div>
            <h2
              className="text-2xl font-bold text-[#1A1510]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Administrator huquqi
            </h2>
            <p className="text-xs font-serif italic text-[#8B7355]">
              {user
                ? `Siz '${user.role}' toifasidagi hisob bilan kirdingiz. Ushbu reyestr faqat role = 'ADMIN' atletlar uchun ochiq.`
                : 'Ushbu sahifaga kirish uchun administrator Google hisobi bilan avtorizatsiyadan oʻting.'}
            </p>
            {!user && (
              <div className="pt-2">
                <button
                  onClick={() => openLoginModal('/admin')}
                  className="w-full py-3 text-xs font-sans font-bold tracking-widest uppercase bg-[#1A1510] text-[#F5F0E8] border border-[#2D2926] hover:bg-[#332B24] cursor-pointer"
                >
                  Google bilan kirish
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <Shield className="w-12 h-12 mx-auto text-[#FF795D]" />
        <h2 className="text-2xl font-black text-[#242424]">
          Administrator huquqi talab qilinadi
        </h2>
        <p className="text-sm font-semibold text-[#666666]">
          {user
            ? `Siz tizimga ${user.email || user.first_name} sifatida kirgansiz. Maʼlumotlar bazasida (users table) rolingiz: '${user.role}'. Ushbu sahifa faqat role = 'ADMIN' boʻlgan hisoblar uchun ochiq.`
            : 'Ushbu sahifaga kirish uchun administrator Google hisobi bilan avtorizatsiyadan oʻtishingiz kerak.'}
        </p>
        {!user && (
          <div className="pt-2">
            <Button
              variant="purple"
              size="md"
              onClick={() => openLoginModal('/admin')}
              fullWidth
              className="text-sm font-black"
            >
              Google bilan kirish
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (isEditorial) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
        <div className="border-b-2 border-double border-[#2D2926] pb-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[11px] font-sans font-bold tracking-widest uppercase text-[#8B7355]">
              <span>PLEY OPERATSIYALAR REYESTRI</span>
              <span>·</span>
              <span>ADMINISTRATIV KABINET</span>
            </div>
            <h1
              className="text-3xl sm:text-5xl font-bold text-[#1A1510]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              BOSHQARUV MARKAZI
            </h1>
            <p className="text-sm font-serif italic text-[#8B7355]">
              Real koʻrsatkichlar, sessiyalarni rejalashtirish va tizim operatsion auditi.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowCreateVenueModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-sans font-bold tracking-widest uppercase bg-[#EDE6D5] text-[#1A1510] border-2 border-[#2D2926] hover:bg-[#DDD4C0] cursor-pointer shadow-[2px_2px_0px_#2D2926]"
            >
              <Building className="w-4 h-4 text-[#8B7355]" />
              <span>Yangi majmua qoʻshish</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-sans font-bold tracking-widest uppercase bg-[#1A1510] text-[#F5F0E8] border border-[#2D2926] hover:bg-[#332B24] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-[#C5A55A]" />
              <span>Yangi sessiya ochish</span>
            </button>
          </div>
        </div>

        {venueSuccess && (
          <div className="p-4 bg-[#EDE6D5] border-2 border-[#1A1510] text-[#1A1510] flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-[#C5A55A]" />
            <span>{venueSuccess}</span>
          </div>
        )}

        {createSuccess && (
          <div className="p-4 bg-[#EDE6D5] border-2 border-[#1A1510] text-[#1A1510] flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4 text-[#C5A55A]" />
            <span>{createSuccess}</span>
          </div>
        )}

        {metrics && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#EDE6D5] border border-[#2D2926] p-5 space-y-1 shadow-[2px_2px_0px_#8B7355]">
              <div className="text-[10px] font-sans font-bold text-[#8B7355] uppercase tracking-widest">
                JAMI ATLETLAR
              </div>
              <div
                className="text-2xl sm:text-3xl font-bold text-[#1A1510]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {metrics.totalUsers}
              </div>
              <div className="text-[11px] font-sans text-[#8B7355]">
                {metrics.totalVenues} ta zal ulangan
              </div>
            </div>

            <div className="bg-[#EDE6D5] border border-[#2D2926] p-5 space-y-1 shadow-[2px_2px_0px_#8B7355]">
              <div className="text-[10px] font-sans font-bold text-[#8B7355] uppercase tracking-widest">
                KUTILAYOTGAN OʻYINLAR
              </div>
              <div
                className="text-2xl sm:text-3xl font-bold text-[#1A1510]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {metrics.upcomingSessions}
              </div>
              <div className="text-[11px] font-sans text-[#8B7355]">
                {metrics.totalSessions} jami qaydlar
              </div>
            </div>

            <div className="bg-[#EDE6D5] border border-[#2D2926] p-5 space-y-1 shadow-[2px_2px_0px_#8B7355]">
              <div className="text-[10px] font-sans font-bold text-[#8B7355] uppercase tracking-widest">
                JAMI AYLANMA
              </div>
              <div
                className="text-xl sm:text-2xl font-bold text-[#1A1510]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {metrics.grossBookingVolumeUz.toLocaleString()} UZS
              </div>
              <div className="text-[11px] font-sans text-[#8B7355]">
                {metrics.confirmedBookings} tasdiqlangan joy
              </div>
            </div>

            <div className="bg-[#EDE6D5] border border-[#2D2926] p-5 space-y-1 shadow-[2px_2px_0px_#8B7355]">
              <div className="text-[10px] font-sans font-bold text-[#8B7355] uppercase tracking-widest">
                PLATFORMA HAQI
              </div>
              <div
                className="text-xl sm:text-2xl font-bold text-[#1A1510]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {metrics.platformRevenueUz.toLocaleString()} UZS
              </div>
              <div className="text-[11px] font-sans text-[#8B7355]">
                Toʻldirilish: {metrics.averageFillRatePercentage}%
              </div>
            </div>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-[#1A1510]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#EDE6D5] border-2 border-[#2D2926] p-6 sm:p-8 space-y-6 shadow-[4px_4px_0px_#2D2926]">
              <div className="flex items-center justify-between border-b border-[#2D2926]/20 pb-3">
                <h3
                  className="text-xl sm:text-2xl font-bold text-[#1A1510]"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Yangi sessiya qaydnomasi
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-2 py-0.5 border border-[#2D2926] bg-[#F5F0E8] text-xs font-sans font-bold hover:bg-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {createError && (
                <div className="p-3 bg-[#F2DDD9] border border-[#8B2E2E] text-[#8B2E2E] text-xs font-sans font-bold">
                  {createError}
                </div>
              )}

              <form onSubmit={handleCreateSession} className="space-y-4">
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1">
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
                    className="w-full px-4 py-2.5 border border-[#2D2926] bg-[#F5F0E8] text-xs sm:text-sm font-sans text-[#1A1510] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510]">
                        Sport majmuasi
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowCreateVenueModal(true)}
                        className="text-[10px] font-sans font-bold text-[#8B7355] hover:text-[#1A1510] underline cursor-pointer"
                      >
                        + Majmua qoʻshish
                      </button>
                    </div>
                    {venues.length > 0 ? (
                      <select
                        value={sessionForm.venueId}
                        onChange={(e) =>
                          setSessionForm({ ...sessionForm, venueId: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-[#2D2926] bg-[#F5F0E8] text-xs sm:text-sm font-sans text-[#1A1510] outline-none"
                      >
                        {venues.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.name} ({v.district})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-3 border border-dashed border-[#8B7355] bg-[#F5F0E8] text-xs font-sans text-[#8B7355] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span>Majmualar mavjud emas.</span>
                        <button
                          type="button"
                          onClick={() => setShowCreateVenueModal(true)}
                          className="px-2.5 py-1 bg-[#1A1510] text-[#F5F0E8] text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                        >
                          + Majmua qoʻshish
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1">
                      Sport turi
                    </label>
                    {sports.length > 0 ? (
                      <select
                        value={sessionForm.sportId}
                        onChange={(e) =>
                          setSessionForm({ ...sessionForm, sportId: e.target.value })
                        }
                        className="w-full px-4 py-2.5 border border-[#2D2926] bg-[#F5F0E8] text-xs sm:text-sm font-sans text-[#1A1510] outline-none"
                      >
                        {sports.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="p-3 border border-dashed border-[#8B7355] bg-[#F5F0E8] text-xs font-sans text-[#8B7355]">
                        Sport turlari yuklanmadi.
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1">
                      Boshlanish vaqti
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={sessionForm.scheduledAt}
                      onChange={(e) =>
                        setSessionForm({ ...sessionForm, scheduledAt: e.target.value })
                      }
                      className="w-full px-4 py-2.5 border border-[#2D2926] bg-[#F5F0E8] text-xs sm:text-sm font-sans text-[#1A1510] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1">
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
                      className="w-full px-4 py-2.5 border border-[#2D2926] bg-[#F5F0E8] text-xs sm:text-sm font-sans text-[#1A1510] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1">
                      Joylar soni
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
                      className="w-full px-4 py-2.5 border border-[#2D2926] bg-[#F5F0E8] text-xs sm:text-sm font-sans text-[#1A1510] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1">
                      Zal narxi (UZS)
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
                      className="w-full px-4 py-2.5 border border-[#2D2926] bg-[#F5F0E8] text-xs sm:text-sm font-sans text-[#1A1510] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1">
                      Platforma haqi (UZS)
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
                      className="w-full px-4 py-2.5 border border-[#2D2926] bg-[#F5F0E8] text-xs sm:text-sm font-sans text-[#1A1510] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1">
                      Toifa
                    </label>
                    <select
                      value={sessionForm.skillLevel}
                      onChange={(e) =>
                        setSessionForm({
                          ...sessionForm,
                          skillLevel: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-[#2D2926] bg-[#F5F0E8] text-xs sm:text-sm font-sans text-[#1A1510] outline-none"
                    >
                      <option value="ALL_LEVELS">Barcha toifalar</option>
                      <option value="BEGINNER">Boshlangʻich</option>
                      <option value="CASUAL">Havaskor</option>
                      <option value="INTERMEDIATE">Oʻrta</option>
                      <option value="ADVANCED">Ilgʻor</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1">
                      Atmosfera
                    </label>
                    <select
                      value={sessionForm.sessionVibe}
                      onChange={(e) =>
                        setSessionForm({
                          ...sessionForm,
                          sessionVibe: e.target.value as any,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-[#2D2926] bg-[#F5F0E8] text-xs sm:text-sm font-sans text-[#1A1510] outline-none"
                    >
                      <option value="FRIENDLY">Doʻstona va erkin</option>
                      <option value="SOCIAL">Ijtimoiy va muloqot</option>
                      <option value="LEARNING">Oʻrganish va mashq</option>
                      <option value="COMPETITIVE">Raqobatbardosh</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3 border-t border-[#2D2926]/20">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-xs font-sans font-bold tracking-widest uppercase bg-[#F5F0E8] border border-[#2D2926] text-[#1A1510] cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="px-5 py-2 text-xs font-sans font-bold tracking-widest uppercase bg-[#1A1510] text-[#F5F0E8] border border-[#2D2926] hover:bg-[#332B24] cursor-pointer"
                  >
                    {formSubmitting ? 'Yaratilmoqda...' : 'Sessiyani tasdiqlash'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showCreateVenueModal && (
          <div className="fixed inset-0 z-50 bg-[#1A1510]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto bg-[#EDE6D5] border-2 border-[#2D2926] p-6 sm:p-8 space-y-6 shadow-[4px_4px_0px_#2D2926]">
              <div className="flex items-center justify-between border-b border-[#2D2926]/20 pb-3">
                <h3
                  className="text-xl sm:text-2xl font-bold text-[#1A1510]"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  Yangi sport majmuasi qoʻshish
                </h3>
                <button
                  onClick={() => setShowCreateVenueModal(false)}
                  className="px-2 py-0.5 border border-[#2D2926] bg-[#F5F0E8] text-xs font-sans font-bold hover:bg-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {venueError && (
                <div className="p-3 bg-[#F2DDD9] border border-[#8B2E2E] text-[#8B2E2E] text-xs font-sans font-bold">
                  {venueError}
                </div>
              )}

              <form onSubmit={handleCreateVenue} className="space-y-4">
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1">
                    Majmua nomi
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan, Chilonzor Sports Club"
                    value={venueForm.name}
                    onChange={(e) =>
                      setVenueForm({ ...venueForm, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#2D2926] bg-[#F5F0E8] text-sm font-sans text-[#1A1510] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1">
                      Tuman
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Masalan, Chilonzor"
                      value={venueForm.district}
                      onChange={(e) =>
                        setVenueForm({ ...venueForm, district: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-[#2D2926] bg-[#F5F0E8] text-sm font-sans text-[#1A1510] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1">
                      Soatlik narxi (UZS)
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="10000"
                      value={venueForm.hourlyRate}
                      onChange={(e) =>
                        setVenueForm({
                          ...venueForm,
                          hourlyRate: parseInt(e.target.value, 10) || 0,
                        })
                      }
                      className="w-full px-4 py-2 border border-[#2D2926] bg-[#F5F0E8] text-sm font-sans text-[#1A1510] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1">
                    Toʻliq manzil
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan, Chilonzor 9-mavze, 21-uy"
                    value={venueForm.address}
                    onChange={(e) =>
                      setVenueForm({ ...venueForm, address: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#2D2926] bg-[#F5F0E8] text-sm font-sans text-[#1A1510] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1">
                    Tavsif
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Majmua sharoitlari, pol qoplamasi va imkoniyatlari haqida qisqacha..."
                    value={venueForm.description}
                    onChange={(e) =>
                      setVenueForm({ ...venueForm, description: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-[#2D2926] bg-[#F5F0E8] text-sm font-sans text-[#1A1510] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1">
                      Telefon raqami
                    </label>
                    <input
                      type="text"
                      placeholder="+998 71 200 00 00"
                      value={venueForm.contactPhone}
                      onChange={(e) =>
                        setVenueForm({ ...venueForm, contactPhone: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-[#2D2926] bg-[#F5F0E8] text-sm font-sans text-[#1A1510] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1">
                      Qulayliklar (vergul bilan)
                    </label>
                    <input
                      type="text"
                      placeholder="Dush, Kiyinish xonasi, Bepul suv"
                      value={venueForm.amenities}
                      onChange={(e) =>
                        setVenueForm({ ...venueForm, amenities: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-[#2D2926] bg-[#F5F0E8] text-sm font-sans text-[#1A1510] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3 font-sans">
                  <button
                    type="button"
                    onClick={() => setShowCreateVenueModal(false)}
                    className="px-4 py-2 border border-[#2D2926] bg-[#F5F0E8] text-xs font-bold uppercase text-[#1A1510] hover:bg-white cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    disabled={venueSubmitting}
                    className="px-5 py-2 bg-[#1A1510] text-[#F5F0E8] border border-[#2D2926] text-xs font-bold uppercase hover:bg-[#332B24] cursor-pointer disabled:opacity-50"
                  >
                    {venueSubmitting ? 'Saqlanmoqda...' : 'Majmuani saqlash'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-[#EDE6D5] border border-[#2D2926] p-5 sm:p-6 shadow-[2px_2px_0px_#8B7355] space-y-4">
            <h3
              className="text-xl font-bold text-[#1A1510]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Soʻnggi bandliklar reyestri
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-[#2D2926]/20 text-[#8B7355] uppercase tracking-wider text-[10px]">
                    <th className="py-2">Oʻyinchi</th>
                    <th className="py-2">Sessiya</th>
                    <th className="py-2">Narx</th>
                    <th className="py-2">Holat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D2926]/10">
                  {bookings.map((b) => (
                    <tr key={b.booking_id}>
                      <td className="py-2.5">
                        <div className="font-bold text-[#1A1510]">
                          {b.user_name}
                        </div>
                        <div className="text-[10px] text-[#8B7355]">
                          {b.user_email || b.user_name}
                        </div>
                      </td>
                      <td className="py-2.5">
                        <div className="text-[#1A1510]">{b.session_title}</div>
                        <div className="text-[10px] text-[#8B7355]">{b.venue_name}</div>
                      </td>
                      <td className="py-2.5 text-[#1A1510] font-semibold">
                        {(b.price + b.service_fee).toLocaleString()} UZS
                      </td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 border border-[#2D2926] bg-[#F5F0E8] text-[10px] uppercase font-bold text-[#1A1510]">
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-[#EDE6D5] border border-[#2D2926] p-5 sm:p-6 shadow-[2px_2px_0px_#8B7355] space-y-4">
            <h3
              className="text-xl font-bold text-[#1A1510]"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Operatsion Audit Loglari
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-[#2D2926]/20 text-[#8B7355] uppercase tracking-wider text-[10px]">
                    <th className="py-2">Vaqt</th>
                    <th className="py-2">Amal</th>
                    <th className="py-2">Nishon</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D2926]/10">
                  {auditLogs.slice(0, 8).map((log) => (
                    <tr key={log.id}>
                      <td className="py-2.5 text-[#8B7355] text-[10px]">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </td>
                      <td className="py-2.5 font-bold uppercase tracking-wider text-[#1A1510]">
                        {log.action}
                      </td>
                      <td className="py-2.5 text-[#8B7355] text-[11px]">
                        {log.target_type}: {log.target_id}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
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

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="white"
            size="md"
            onClick={() => setShowCreateVenueModal(true)}
            className="shrink-0"
          >
            <Building className="w-5 h-5 text-[#7655F7]" />
            <span>Yangi majmua</span>
          </Button>
          <Button
            variant="lime"
            size="md"
            onClick={() => setShowCreateModal(true)}
            className="shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Yangi sessiya</span>
          </Button>
        </div>
      </div>

      {venueSuccess && (
        <div className="p-4 bg-[#D7FF64] border-2 border-[#242424] rounded-2xl flex items-center gap-2 font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 text-[#7655F7]" />
          <span>{venueSuccess}</span>
        </div>
      )}

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
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-black uppercase text-[#242424]">
                      Sport majmuasi
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCreateVenueModal(true)}
                      className="text-xs font-black text-[#7655F7] hover:underline cursor-pointer"
                    >
                      + Majmua qoʻshish
                    </button>
                  </div>
                  {venues.length > 0 ? (
                    <select
                      value={sessionForm.venueId}
                      onChange={(e) =>
                        setSessionForm({ ...sessionForm, venueId: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                    >
                      {venues.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} ({v.district})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 rounded-xl border-2 border-dashed border-[#242424] bg-[#FFE5E5] text-xs font-bold text-[#D03030] flex items-center justify-between">
                      <span>Bazada sport majmuasi yoʻq</span>
                      <button
                        type="button"
                        onClick={() => setShowCreateVenueModal(true)}
                        className="px-2 py-1 bg-[#242424] text-white rounded text-[11px] font-black uppercase cursor-pointer"
                      >
                        Qoʻshish
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                    Sport turi
                  </label>
                  {sports.length > 0 ? (
                    <select
                      value={sessionForm.sportId}
                      onChange={(e) =>
                        setSessionForm({ ...sessionForm, sportId: e.target.value })
                      }
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                    >
                      {sports.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 rounded-xl border-2 border-dashed border-[#242424] bg-[#FFE5E5] text-xs font-bold text-[#D03030]">
                      Sport turlari topilmadi
                    </div>
                  )}
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
                  disabled={formSubmitting || venues.length === 0}
                >
                  {formSubmitting ? 'Yaratilmoqda...' : 'Eʼlon qilish'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {showCreateVenueModal && (
        <div className="fixed inset-0 z-50 bg-[#242424]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <Card
            variant="cream"
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border-4 border-[#242424] shadow-[8px_8px_0px_#242424]"
          >
            <div className="flex items-center justify-between border-b-2 border-[#242424] pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#7655F7] px-2 py-0.5 rounded-full bg-[#EADEFF] border border-[#242424]">
                  Baza boshqaruvi
                </span>
                <h3 className="text-xl font-black text-[#242424] mt-1">
                  Yangi sport majmuasi qoʻshish
                </h3>
              </div>
              <Button
                variant="white"
                size="sm"
                onClick={() => setShowCreateVenueModal(false)}
              >
                ✕
              </Button>
            </div>

            {venueError && (
              <div className="p-3 rounded-xl border-2 border-[#242424] bg-[#FFE5E5] text-[#D03030] text-xs font-black">
                {venueError}
              </div>
            )}

            <form onSubmit={handleCreateVenue} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                  Majmua nomi
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan, Chilonzor Sports Club"
                  value={venueForm.name}
                  onChange={(e) =>
                    setVenueForm({ ...venueForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                    Tuman
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan, Chilonzor"
                    value={venueForm.district}
                    onChange={(e) =>
                      setVenueForm({ ...venueForm, district: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                    Soatlik narxi (UZS)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="10000"
                    value={venueForm.hourlyRate}
                    onChange={(e) =>
                      setVenueForm({
                        ...venueForm,
                        hourlyRate: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                  Toʻliq manzil
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan, Chilonzor 9-mavze, 21-uy"
                  value={venueForm.address}
                  onChange={(e) =>
                    setVenueForm({ ...venueForm, address: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                  Tavsif
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Majmua sharoitlari, pol qoplamasi va imkoniyatlari haqida qisqacha..."
                  value={venueForm.description}
                  onChange={(e) =>
                    setVenueForm({ ...venueForm, description: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                    Telefon raqami
                  </label>
                  <input
                    type="text"
                    placeholder="+998 71 200 00 00"
                    value={venueForm.contactPhone}
                    onChange={(e) =>
                      setVenueForm({ ...venueForm, contactPhone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                    Qulayliklar (vergul bilan)
                  </label>
                  <input
                    type="text"
                    placeholder="Dush, Kiyinish xonasi, Bepul suv"
                    value={venueForm.amenities}
                    onChange={(e) =>
                      setVenueForm({ ...venueForm, amenities: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] text-sm font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="white"
                  size="sm"
                  onClick={() => setShowCreateVenueModal(false)}
                >
                  Bekor qilish
                </Button>
                <Button
                  type="submit"
                  variant="lime"
                  size="sm"
                  disabled={venueSubmitting}
                >
                  {venueSubmitting ? 'Saqlanmoqda...' : 'Majmuani saqlash'}
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
                        {b.user_email || b.user_name}
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
