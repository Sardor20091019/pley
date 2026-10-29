'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useAppTheme } from '../../lib/theme/ThemeContext';
import {
  fetchAdminMetrics,
  fetchAdminBookings,
  fetchAdminAuditLogs,
  fetchAdminPartnershipInquiries,
  fetchVenues,
  fetchSports,
  fetchSessions,
  createAdminSession,
  createAdminVenue,
  cancelAdminSession,
  uploadImage,
  updateAdminInquiryStatus,
  deleteAdminInquiry,
} from '../../lib/api';
import { compressImage } from '../../lib/image';
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
  Handshake,
  Phone,
  Image as ImageIcon,
  Trash2,
  ExternalLink,
  Check,
  X,
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
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [convertingInquiryId, setConvertingInquiryId] = useState<string | null>(null);
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED'>('ALL');
  const [sessionsList, setSessionsList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [uploadingSessionPic, setUploadingSessionPic] = useState<boolean>(false);
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
    imageUrl: '',
  });

  const loadData = async (): Promise<void> => {
    try {
      setLoading(true);
      const [m, b, a, vList, sList, inqList, sessList] = await Promise.all([
        fetchAdminMetrics(),
        fetchAdminBookings(),
        fetchAdminAuditLogs(),
        fetchVenues(),
        fetchSports(),
        fetchAdminPartnershipInquiries(),
        fetchSessions(),
      ]);
      setMetrics(m);
      setBookings(b);
      setAuditLogs(a);
      setVenues(vList);
      setSports(sList);
      setInquiries(inqList || []);
      setSessionsList(sessList || []);
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

      if (convertingInquiryId) {
        await updateAdminInquiryStatus(convertingInquiryId, 'ACCEPTED');
        setConvertingInquiryId(null);
      }

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

  const handleConvertInquiryToVenue = (inq: any): void => {
    setConvertingInquiryId(inq.id);
    setVenueForm({
      name: inq.venue_name || '',
      district: inq.district || 'Chilonzor',
      address: inq.venue_name ? `${inq.district}, ${inq.venue_name}` : '',
      description: inq.message || `${inq.contact_name} tomonidan qoldirilgan ariza`,
      supportedSports: [inq.sport_types || 'table-tennis'],
      hourlyRate: 150000,
      contactPhone: inq.phone || '+998 71 200 00 00',
      amenities: 'Dush, Kiyinish xonasi, Bepul suv',
    });
    setShowCreateVenueModal(true);
  };

  const handleUploadSessionPic = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    setUploadingSessionPic(true);
    setCreateError(null);
    try {
      const { file, dataUrl } = await compressImage(rawFile);
      if (dataUrl) {
        setSessionForm((prev) => ({ ...prev, imageUrl: dataUrl }));
      }
      const res = await uploadImage(file);
      if (res?.url) {
        setSessionForm((prev) => ({ ...prev, imageUrl: res.url }));
      }
    } catch {
    } finally {
      setUploadingSessionPic(false);
    }
  };

  const handleConvertInquiryToSession = (inq: any): void => {
    setConvertingInquiryId(inq.id);
    const matchingSport = sports.find(
      (s: any) =>
        s.slug === inq.sport_types ||
        s.name?.toLowerCase().includes(inq.sport_types?.toLowerCase()),
    );
    setSessionForm((prev) => ({
      ...prev,
      title: inq.venue_name ? `${inq.venue_name} - Maxsus oʻyin` : 'Pley oʻyin',
      sportId: matchingSport?.id || prev.sportId,
      scheduledAt: inq.scheduled_at
        ? new Date(inq.scheduled_at).toISOString().slice(0, 16)
        : new Date(Date.now() + 86400000).toISOString().slice(0, 16),
      pricePerSlot: inq.price_per_slot ? Number(inq.price_per_slot) : 28000,
      imageUrl: inq.image_url || '',
    }));
    setShowCreateModal(true);
  };

  const handleAcceptInquiry = async (id: string): Promise<void> => {
    try {
      await updateAdminInquiryStatus(id, 'ACCEPTED');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  const handleRejectInquiry = async (id: string): Promise<void> => {
    try {
      await updateAdminInquiryStatus(id, 'REJECTED');
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  const handleDeleteInquiry = async (id: string): Promise<void> => {
    if (!confirm('Ushbu arizani roʻyxatdan butunlay oʻchirishni xohlaysizmi?')) return;
    try {
      await deleteAdminInquiry(id);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
    }
  };

  const handleCancelSession = async (sessionId: string): Promise<void> => {
    if (!confirm('Ushbu sessiyani bekor qilishni tasdiqlaysizmi?')) return;
    try {
      await cancelAdminSession(sessionId);
      await loadData();
    } catch (err: any) {
      alert(err.message || 'Xatolik yuz berdi');
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

      if (convertingInquiryId) {
        await updateAdminInquiryStatus(convertingInquiryId, 'ACCEPTED');
        setConvertingInquiryId(null);
      }

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
                ? `Siz '${user.role}' toifasidagi hisob bilan kirdingiz. Ushbu list faqat role = 'ADMIN'  uchun ochiq.`
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

  const pendingInquiriesCount = inquiries.filter(
    (inq) => !inq.status || inq.status === 'PENDING',
  ).length;
  const acceptedInquiriesCount = inquiries.filter(
    (inq) => inq.status === 'ACCEPTED',
  ).length;
  const rejectedInquiriesCount = inquiries.filter(
    (inq) => inq.status === 'REJECTED',
  ).length;

  const filteredInquiries = inquiries.filter((inq) => {
    const st = inq.status || 'PENDING';
    if (inquiryStatusFilter === 'ALL') return true;
    return st === inquiryStatusFilter;
  });

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
                JAMI ZALLAR
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

                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-widest text-[#1A1510] mb-1">
                    Sessiya rasmi / Banner (Pics)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      id="admin-session-pic-editorial"
                      className="hidden"
                      onChange={handleUploadSessionPic}
                      disabled={uploadingSessionPic}
                    />
                    <label
                      htmlFor="admin-session-pic-editorial"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-[#2D2926] bg-[#F5F0E8] text-xs font-sans font-bold tracking-widest uppercase hover:bg-white cursor-pointer transition-colors"
                    >
                      <ImageIcon className="w-4 h-4 text-[#8B7355]" />
                      <span>{uploadingSessionPic ? 'Yuklanmoqda...' : 'Rasm yuklash (Fayl)'}</span>
                    </label>
                  </div>
                  {sessionForm.imageUrl && (
                    <div className="mt-2 relative w-28 h-16 rounded border border-[#2D2926] overflow-hidden">
                      <img
                        src={sessionForm.imageUrl}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setSessionForm({ ...sessionForm, imageUrl: '' })
                        }
                        className="absolute top-0 right-0 bg-[#1A1510] text-[#F5F0E8] text-[9px] px-1 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  )}
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

        <div className="bg-[#EDE6D5] border border-[#2D2926] p-5 sm:p-6 shadow-[2px_2px_0px_#8B7355] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2D2926]/20 pb-3">
            <div className="flex items-center gap-2">
              <Handshake className="w-5 h-5 text-[#8B7355]" />
              <h3
                className="text-xl font-bold text-[#1A1510]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Hamkorlik arizalari (Zal egalari)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-sans font-bold text-[#8B7355] uppercase tracking-wider">
                {pendingInquiriesCount} ta kutilmoqda ({inquiries.length} jami)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 border-b border-[#2D2926]/10 pb-2 flex-wrap">
            <button
              type="button"
              onClick={() => setInquiryStatusFilter('ALL')}
              className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                inquiryStatusFilter === 'ALL'
                  ? 'bg-[#1A1510] text-[#F5F0E8]'
                  : 'text-[#8B7355] hover:text-[#1A1510]'
              }`}
            >
              Barchasi ({inquiries.length})
            </button>
            <button
              type="button"
              onClick={() => setInquiryStatusFilter('PENDING')}
              className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                inquiryStatusFilter === 'PENDING'
                  ? 'bg-[#1A1510] text-[#F5F0E8]'
                  : 'text-[#8B7355] hover:text-[#1A1510]'
              }`}
            >
              Kutilmoqda ({pendingInquiriesCount})
            </button>
            <button
              type="button"
              onClick={() => setInquiryStatusFilter('ACCEPTED')}
              className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                inquiryStatusFilter === 'ACCEPTED'
                  ? 'bg-[#1A1510] text-[#F5F0E8]'
                  : 'text-[#8B7355] hover:text-[#1A1510]'
              }`}
            >
              Qabul qilingan ({acceptedInquiriesCount})
            </button>
            <button
              type="button"
              onClick={() => setInquiryStatusFilter('REJECTED')}
              className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                inquiryStatusFilter === 'REJECTED'
                  ? 'bg-[#1A1510] text-[#F5F0E8]'
                  : 'text-[#8B7355] hover:text-[#1A1510]'
              }`}
            >
              Rad etilgan ({rejectedInquiriesCount})
            </button>
          </div>

          {filteredInquiries.length === 0 ? (
            <p className="text-xs font-sans text-[#8B7355] py-4 text-center italic">
              {inquiryStatusFilter === 'ALL'
                ? 'Hozircha yangi hamkorlik arizalari yoʻq.'
                : 'Ushbu toifadagi arizalar topilmadi.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-[#2D2926]/20 text-[#8B7355] uppercase tracking-wider text-[10px]">
                    <th className="py-2">Turi</th>
                    <th className="py-2">Holat</th>
                    <th className="py-2">Vaqt</th>
                    <th className="py-2">Masʼul shaxs</th>
                    <th className="py-2">Zal / Oʻyin nomi</th>
                    <th className="py-2">Tuman & Sport</th>
                    <th className="py-2">Rasm</th>
                    <th className="py-2">Izoh</th>
                    <th className="py-2 text-right">Amal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D2926]/10">
                  {filteredInquiries.map((inq) => {
                    const st = inq.status || 'PENDING';
                    return (
                      <tr key={inq.id}>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 border text-[9px] font-bold uppercase tracking-wider ${
                              inq.inquiry_type === 'SESSION'
                                ? 'bg-[#1A1510] text-[#F5F0E8] border-[#2D2926]'
                                : 'bg-[#F5F0E8] text-[#8B7355] border-[#2D2926]/40'
                            }`}
                          >
                            {inq.inquiry_type === 'SESSION' ? 'Sessiya' : 'Majmua'}
                          </span>
                        </td>
                        <td className="py-2.5">
                          {st === 'ACCEPTED' ? (
                            <span className="px-2 py-0.5 border text-[9px] font-bold uppercase tracking-wider bg-[#E6F4EA] text-[#137333] border-[#137333]/30">
                              Qabul qilingan
                            </span>
                          ) : st === 'REJECTED' ? (
                            <span className="px-2.5 py-0.5 border text-[9px] font-bold uppercase tracking-wider bg-[#FCE8E6] text-[#C5221F] border-[#C5221F]/30">
                              Rad etilgan
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 border text-[9px] font-bold uppercase tracking-wider bg-[#FEF7E0] text-[#B06000] border-[#B06000]/30">
                              Kutilmoqda
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 text-[#8B7355] text-[10px] whitespace-nowrap">
                          {new Date(inq.created_at).toLocaleDateString()}{' '}
                          {new Date(inq.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                        <td className="py-2.5">
                          <div className="font-bold text-[#1A1510]">{inq.contact_name}</div>
                          <a
                            href={`tel:${inq.phone}`}
                            className="text-[11px] text-[#8B7355] hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{inq.phone}</span>
                          </a>
                        </td>
                        <td className="py-2.5 font-bold text-[#1A1510]">
                          {inq.venue_name}
                        </td>
                        <td className="py-2.5 text-[#1A1510]">
                          <div>{inq.district}</div>
                          <div className="text-[10px] text-[#8B7355] uppercase font-bold">
                            {inq.sport_types}
                          </div>
                        </td>
                        <td className="py-2.5">
                          {inq.image_url ? (
                            <div className="w-10 h-8 rounded border border-[#2D2926] overflow-hidden">
                              <img
                                src={inq.image_url}
                                alt="pic"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <span className="text-[10px] text-[#8B7355]">—</span>
                          )}
                        </td>
                        <td className="py-2.5 text-[#555555] max-w-xs truncate text-[11px]">
                          {inq.message || '—'}
                        </td>
                        <td className="py-2.5 text-right whitespace-nowrap">
                          {st === 'ACCEPTED' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <span className="text-[10px] text-[#137333] font-bold flex items-center gap-1 mr-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Bajarildi</span>
                              </span>
                              <button
                                type="button"
                                title="Oʻchirish"
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-1.5 border border-[#2D2926]/20 text-[#8B7355] hover:text-[#C5221F] hover:border-[#C5221F] transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : st === 'REJECTED' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleAcceptInquiry(inq.id)}
                                className="px-2.5 py-1 border border-[#2D2926]/40 text-[10px] font-bold uppercase text-[#1A1510] hover:bg-[#1A1510] hover:text-[#F5F0E8] cursor-pointer"
                              >
                                Qayta qabul qilish
                              </button>
                              <button
                                type="button"
                                title="Oʻchirish"
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-1.5 border border-[#2D2926]/20 text-[#8B7355] hover:text-[#C5221F] hover:border-[#C5221F] transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {inq.inquiry_type === 'SESSION' ? (
                                <button
                                  type="button"
                                  onClick={() => handleConvertInquiryToSession(inq)}
                                  className="px-2.5 py-1.5 bg-[#1A1510] text-[#F5F0E8] text-[10px] font-bold uppercase tracking-wider hover:bg-[#332B24] cursor-pointer"
                                >
                                  + Sessiyaga aylantirish
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleConvertInquiryToVenue(inq)}
                                  className="px-2.5 py-1.5 bg-[#1A1510] text-[#F5F0E8] text-[10px] font-bold uppercase tracking-wider hover:bg-[#332B24] cursor-pointer"
                                >
                                  + Majmuaga qoʻshish
                                </button>
                              )}
                              <button
                                type="button"
                                title="Toʻgʻridan-toʻgʻri qabul qilish"
                                onClick={() => handleAcceptInquiry(inq.id)}
                                className="p-1.5 border border-[#137333]/40 text-[#137333] hover:bg-[#E6F4EA] transition-colors cursor-pointer"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Rad etish"
                                onClick={() => handleRejectInquiry(inq.id)}
                                className="p-1.5 border border-[#C5221F]/40 text-[#C5221F] hover:bg-[#FCE8E6] transition-colors cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                title="Oʻchirish"
                                onClick={() => handleDeleteInquiry(inq.id)}
                                className="p-1.5 border border-[#2D2926]/20 text-[#8B7355] hover:text-[#C5221F] hover:border-[#C5221F] transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-[#EDE6D5] border border-[#2D2926] p-5 sm:p-6 shadow-[2px_2px_0px_#8B7355] space-y-4">
          <div className="flex items-center justify-between border-b border-[#2D2926]/20 pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#8B7355]" />
              <h3
                className="text-xl font-bold text-[#1A1510]"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Faol Sessiyalar Reyestri
              </h3>
            </div>
            <span className="text-xs font-sans font-bold text-[#8B7355] uppercase tracking-wider">
              {sessionsList.length} ta sessiya
            </span>
          </div>

          {sessionsList.length === 0 ? (
            <p className="text-xs font-sans text-[#8B7355] py-4 text-center italic">
              Bazada faol sessiyalar mavjud emas.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-[#2D2926]/20 text-[#8B7355] uppercase tracking-wider text-[10px]">
                    <th className="py-2">Rasm</th>
                    <th className="py-2">Sessiya nomi</th>
                    <th className="py-2">Sport & Majmua</th>
                    <th className="py-2">Sana va vaqt</th>
                    <th className="py-2">Bandlik</th>
                    <th className="py-2">Narx</th>
                    <th className="py-2 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2D2926]/10">
                  {sessionsList.map((s) => (
                    <tr key={s.id}>
                      <td className="py-2.5">
                        <div className="w-12 h-9 rounded overflow-hidden border border-[#2D2926] bg-[#D8CFBC]">
                          {s.imageUrl ? (
                            <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[10px] text-[#8B7355]">
                              Pley
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-2.5 font-bold text-[#1A1510]">
                        <div>{s.title}</div>
                        <div className="text-[10px] text-[#8B7355] uppercase font-bold">{s.skillLevel} · {s.sessionVibe}</div>
                      </td>
                      <td className="py-2.5">
                        <div className="font-semibold text-[#1A1510]">{s.venue?.name}</div>
                        <div className="text-[10px] text-[#8B7355]">{s.sport?.name} · {s.venue?.district}</div>
                      </td>
                      <td className="py-2.5 text-[#1A1510] whitespace-nowrap text-[11px]">
                        {new Date(s.scheduledAt).toLocaleDateString()} {new Date(s.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-2.5">
                        <span className="font-bold text-[#1A1510]">{s.bookedSlots}</span> / {s.maxSlots}
                      </td>
                      <td className="py-2.5 font-bold text-[#1A1510] whitespace-nowrap">
                        {s.totalPrice?.toLocaleString()} UZS
                      </td>
                      <td className="py-2.5 text-right whitespace-nowrap space-x-2">
                        <a
                          href={`/sessions/${s.id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#EDE6D5] border border-[#2D2926] text-[10px] font-bold uppercase tracking-wider text-[#1A1510] hover:bg-white"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Ochish</span>
                        </a>
                        <button
                          type="button"
                          onClick={() => handleCancelSession(s.id)}
                          className="px-2.5 py-1 bg-[#F2DDD9] border border-[#8B2E2E] text-[#8B2E2E] text-[10px] font-bold uppercase tracking-wider hover:bg-[#E8C5C0] cursor-pointer"
                        >
                          Bekor qilish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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

              <div>
                <label className="block text-xs font-black uppercase text-[#242424] mb-1">
                  Sessiya rasmi / Banner (Pics)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    id="admin-session-pic-cartoon"
                    className="hidden"
                    onChange={handleUploadSessionPic}
                    disabled={uploadingSessionPic}
                  />
                  <label
                    htmlFor="admin-session-pic-cartoon"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-[#242424] bg-[#FFF9EF] hover:bg-[#EADEFF] font-black text-xs uppercase cursor-pointer transition-colors"
                  >
                    <ImageIcon className="w-4 h-4 text-[#7655F7]" />
                    <span>{uploadingSessionPic ? 'Yuklanmoqda...' : 'Rasm yuklash (Fayl)'}</span>
                  </label>
                </div>
                {sessionForm.imageUrl && (
                  <div className="mt-2 relative w-28 h-16 rounded-xl border-2 border-[#242424] overflow-hidden">
                    <img
                      src={sessionForm.imageUrl}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSessionForm({ ...sessionForm, imageUrl: '' })
                      }
                      className="absolute top-1 right-1 bg-[#242424] text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-black"
                    >
                      ✕
                    </button>
                  </div>
                )}
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

      <Card variant="white" className="space-y-4 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EEEEEE] pb-3">
          <div className="flex items-center gap-2">
            <Handshake className="w-5 h-5 text-[#7655F7]" />
            <h3 className="text-xl font-black text-[#242424]">
              Hamkorlik arizalari (Zal egalari)
            </h3>
          </div>
          <span className="text-xs font-black text-[#7655F7] px-2.5 py-1 rounded-full bg-[#EADEFF] border border-[#242424]">
            {pendingInquiriesCount} ta kutilmoqda ({inquiries.length} jami)
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setInquiryStatusFilter('ALL')}
            className={`px-3 py-1 rounded-full text-xs font-black border border-[#242424] transition-all cursor-pointer ${
              inquiryStatusFilter === 'ALL'
                ? 'bg-[#242424] text-white'
                : 'bg-white text-[#242424] hover:bg-[#F2F2F2]'
            }`}
          >
            Barchasi ({inquiries.length})
          </button>
          <button
            type="button"
            onClick={() => setInquiryStatusFilter('PENDING')}
            className={`px-3 py-1 rounded-full text-xs font-black border border-[#242424] transition-all cursor-pointer ${
              inquiryStatusFilter === 'PENDING'
                ? 'bg-[#7655F7] text-white shadow-[2px_2px_0px_#242424]'
                : 'bg-white text-[#242424] hover:bg-[#F2F2F2]'
            }`}
          >
            Kutilmoqda ({pendingInquiriesCount})
          </button>
          <button
            type="button"
            onClick={() => setInquiryStatusFilter('ACCEPTED')}
            className={`px-3 py-1 rounded-full text-xs font-black border border-[#242424] transition-all cursor-pointer ${
              inquiryStatusFilter === 'ACCEPTED'
                ? 'bg-[#D7FF64] text-[#242424] shadow-[2px_2px_0px_#242424]'
                : 'bg-white text-[#242424] hover:bg-[#F2F2F2]'
            }`}
          >
            Qabul qilingan ({acceptedInquiriesCount})
          </button>
          <button
            type="button"
            onClick={() => setInquiryStatusFilter('REJECTED')}
            className={`px-3 py-1 rounded-full text-xs font-black border border-[#242424] transition-all cursor-pointer ${
              inquiryStatusFilter === 'REJECTED'
                ? 'bg-[#FFD1D1] text-[#D9383A] shadow-[2px_2px_0px_#242424]'
                : 'bg-white text-[#242424] hover:bg-[#F2F2F2]'
            }`}
          >
            Rad etilgan ({rejectedInquiriesCount})
          </button>
        </div>

        {filteredInquiries.length === 0 ? (
          <p className="text-xs font-bold text-[#888888] py-4 text-center">
            {inquiryStatusFilter === 'ALL'
              ? 'Hozircha yangi hamkorlik arizalari mavjud emas.'
              : 'Ushbu toifadagi arizalar topilmadi.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead>
                <tr className="border-b border-[#EEEEEE] text-[#888888]">
                  <th className="py-2">Turi</th>
                  <th className="py-2">Holat</th>
                  <th className="py-2">Vaqt</th>
                  <th className="py-2">Masʼul shaxs</th>
                  <th className="py-2">Zal / Oʻyin nomi</th>
                  <th className="py-2">Tuman & Sport</th>
                  <th className="py-2">Rasm</th>
                  <th className="py-2">Izoh</th>
                  <th className="py-2 text-right">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F2]">
                {filteredInquiries.map((inq) => {
                  const st = inq.status || 'PENDING';
                  return (
                    <tr key={inq.id}>
                      <td className="py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${
                            inq.inquiry_type === 'SESSION'
                              ? 'bg-[#D7FF64] border-[#242424] text-[#242424]'
                              : 'bg-[#FFF9EF] border-[#242424] text-[#7655F7]'
                          }`}
                        >
                          {inq.inquiry_type === 'SESSION' ? 'Sessiya' : 'Majmua'}
                        </span>
                      </td>
                      <td className="py-2.5">
                        {st === 'ACCEPTED' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black border border-[#242424] bg-[#D7FF64] text-[#242424]">
                            Qabul qilingan
                          </span>
                        ) : st === 'REJECTED' ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black border border-[#242424] bg-[#FFD1D1] text-[#D9383A]">
                            Rad etilgan
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black border border-[#242424] bg-[#FFF275] text-[#242424]">
                            Kutilmoqda
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 text-[#888888] text-[10px] whitespace-nowrap">
                        {new Date(inq.created_at).toLocaleDateString()}{' '}
                        {new Date(inq.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-2.5">
                        <div className="font-extrabold text-[#242424]">{inq.contact_name}</div>
                        <a
                          href={`tel:${inq.phone}`}
                          className="text-[11px] text-[#7655F7] hover:underline flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3" />
                          <span>{inq.phone}</span>
                        </a>
                      </td>
                      <td className="py-2.5 font-black text-[#242424]">
                        {inq.venue_name}
                      </td>
                      <td className="py-2.5 text-[#242424]">
                        <div>{inq.district}</div>
                        <div className="text-[10px] text-[#888888] font-extrabold uppercase">
                          {inq.sport_types}
                        </div>
                      </td>
                      <td className="py-2.5">
                        {inq.image_url ? (
                          <div className="w-10 h-8 rounded-lg overflow-hidden border border-[#242424]">
                            <img
                              src={inq.image_url}
                              alt="pic"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#888888]">—</span>
                        )}
                      </td>
                      <td className="py-2.5 text-[#555555] max-w-xs truncate text-[11px]">
                        {inq.message || '—'}
                      </td>
                      <td className="py-2.5 text-right whitespace-nowrap">
                        {st === 'ACCEPTED' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-[11px] text-[#242424] font-black flex items-center gap-1 bg-[#D7FF64] px-2.5 py-1 rounded-xl border border-[#242424] mr-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Qoʻshildi</span>
                            </span>
                            <button
                              type="button"
                              title="Oʻchirish"
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1.5 rounded-xl border border-[#242424] bg-white text-[#D9383A] hover:bg-[#FFD1D1] transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : st === 'REJECTED' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="white"
                              size="sm"
                              onClick={() => handleAcceptInquiry(inq.id)}
                            >
                              Qayta qabul qilish
                            </Button>
                            <button
                              type="button"
                              title="Oʻchirish"
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1.5 rounded-xl border border-[#242424] bg-white text-[#D9383A] hover:bg-[#FFD1D1] transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {inq.inquiry_type === 'SESSION' ? (
                              <Button
                                variant="lime"
                                size="sm"
                                onClick={() => handleConvertInquiryToSession(inq)}
                              >
                                + Sessiyaga aylantirish
                              </Button>
                            ) : (
                              <Button
                                variant="purple"
                                size="sm"
                                onClick={() => handleConvertInquiryToVenue(inq)}
                              >
                                + Majmuaga qoʻshish
                              </Button>
                            )}
                            <button
                              type="button"
                              title="Toʻgʻridan-toʻgʻri qabul qilish"
                              onClick={() => handleAcceptInquiry(inq.id)}
                              className="p-1.5 rounded-xl border border-[#242424] bg-[#D7FF64] text-[#242424] hover:brightness-95 transition-colors cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Rad etish"
                              onClick={() => handleRejectInquiry(inq.id)}
                              className="p-1.5 rounded-xl border border-[#242424] bg-[#FFD1D1] text-[#D9383A] hover:brightness-95 transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              title="Oʻchirish"
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className="p-1.5 rounded-xl border border-[#242424] bg-white text-[#D9383A] hover:bg-[#FFD1D1] transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card variant="white" className="space-y-4 p-5 sm:p-6">
        <div className="flex items-center justify-between border-b border-[#EEEEEE] pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#7655F7]" />
            <h3 className="text-xl font-black text-[#242424]">
              Faol Sessiyalar Reyestri
            </h3>
          </div>
          <span className="text-xs font-black text-[#242424] px-2.5 py-1 rounded-full bg-[#D7FF64] border border-[#242424]">
            {sessionsList.length} ta sessiya
          </span>
        </div>

        {sessionsList.length === 0 ? (
          <p className="text-xs font-bold text-[#888888] py-4 text-center">
            Bazada faol sessiyalar mavjud emas.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-bold">
              <thead>
                <tr className="border-b border-[#EEEEEE] text-[#888888]">
                  <th className="py-2">Rasm</th>
                  <th className="py-2">Sessiya nomi</th>
                  <th className="py-2">Sport & Majmua</th>
                  <th className="py-2">Sana va vaqt</th>
                  <th className="py-2">Bandlik</th>
                  <th className="py-2">Narx</th>
                  <th className="py-2 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F2]">
                {sessionsList.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2.5">
                      <div className="w-12 h-9 rounded-lg overflow-hidden border-2 border-[#242424] bg-[#FFEED5]">
                        {s.imageUrl ? (
                          <img src={s.imageUrl} alt={s.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-[#7655F7] font-black">
                            Pley
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5">
                      <div className="font-extrabold text-[#242424]">{s.title}</div>
                      <div className="text-[10px] text-[#7655F7] font-black uppercase">{s.skillLevel} · {s.sessionVibe}</div>
                    </td>
                    <td className="py-2.5">
                      <div className="text-[#242424]">{s.venue?.name}</div>
                      <div className="text-[10px] text-[#888888]">{s.sport?.name} · {s.venue?.district}</div>
                    </td>
                    <td className="py-2.5 text-[#242424] whitespace-nowrap text-[11px]">
                      {new Date(s.scheduledAt).toLocaleDateString()} {new Date(s.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5">
                      <span className="font-black text-[#242424]">{s.bookedSlots}</span> / {s.maxSlots}
                    </td>
                    <td className="py-2.5 font-black text-[#242424] whitespace-nowrap">
                      {s.totalPrice?.toLocaleString()} UZS
                    </td>
                    <td className="py-2.5 text-right whitespace-nowrap space-x-2">
                      <a
                        href={`/sessions/${s.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border-2 border-[#242424] bg-white text-[10px] font-black uppercase text-[#242424] hover:bg-[#FFF9EF]"
                      >
                        <ExternalLink className="w-3 h-3 text-[#7655F7]" />
                        <span>Ochish</span>
                      </a>
                      <Button
                        variant="coral"
                        size="sm"
                        onClick={() => handleCancelSession(s.id)}
                      >
                        Bekor qilish
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
