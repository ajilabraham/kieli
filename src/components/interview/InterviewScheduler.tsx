import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Calendar as CalendarIcon, 
  Clock, 
  Globe, 
  Check, 
  ArrowRight, 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  ChevronLeft,
  User,
  Mail,
  Phone,
  CalendarCheck,
  MapPin,
  Video
} from 'lucide-react';
import type { Slot, DateGroupedSlots, CandidateFormData, BookingConfirmation, MeetingType } from '../../types/scheduler';
import { schedulerApi } from '../../services/schedulerApi';
import { ConfirmationScreen } from './ConfirmationScreen';

export const InterviewScheduler: React.FC = () => {
  // Application State
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(true);
  const [schedulerStatus, setSchedulerStatus] = useState<string>('Open');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

  // Form State
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [meetingType, setMeetingType] = useState<MeetingType>('in_person');
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Status & Error Notification State
  const [bookingError, setBookingError] = useState<{ title: string; message: string } | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingConfirmation | null>(null);

  // Fetch Slots from API
  const loadAvailableSlots = useCallback(async (isRefresh = false) => {
    if (!isRefresh) setLoadingSlots(true);
    try {
      const res = await schedulerApi.getAvailableSlots();
      if (res.success && res.slots) {
        setSlots(res.slots);
        if (res.status) setSchedulerStatus(res.status);
      } else {
        setBookingError({
          title: 'Unable to load schedule',
          message: res.message || 'Please check your connection and try refreshing.',
        });
      }
    } catch (err: any) {
      setBookingError({
        title: 'Connection Error',
        message: 'Could not connect to the booking system. Please try again.',
      });
    } finally {
      setLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    loadAvailableSlots();
  }, [loadAvailableSlots]);

  // Group Available Slots by Date
  const groupedSlots: DateGroupedSlots[] = useMemo(() => {
    const map = new Map<string, { day: string; slots: Slot[] }>();

    // Only include Available slots (Booked slots disappear completely per requirement)
    const availableOnly = slots.filter((s) => s.status === 'Available');

    // Sort chronologically by date and start_time
    const sorted = [...availableOnly].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.start_time.localeCompare(b.start_time);
    });

    sorted.forEach((slot) => {
      if (!map.has(slot.date)) {
        map.set(slot.date, { day: slot.day, slots: [] });
      }
      map.get(slot.date)!.slots.push(slot);
    });

    const groups: DateGroupedSlots[] = [];
    map.forEach((value, dateStr) => {
      let formattedDate = `${value.day}, ${dateStr}`;
      try {
        const [y, m, d] = dateStr.split('-').map(Number);
        const dateObj = new Date(y, m - 1, d);
        formattedDate = dateObj.toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      } catch (e) {}

      groups.push({
        date: dateStr,
        day: value.day,
        formattedDate,
        slots: value.slots,
      });
    });

    return groups;
  }, [slots]);

  // Handle Slot Selection
  const handleSelectSlot = (slot: Slot) => {
    setSelectedSlot(slot);
    setBookingError(null);
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        document.getElementById('candidate-details-form')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  // Handle Booking Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail) {
      setBookingError({
        title: 'Missing information',
        message: 'Please provide your full name and a valid email address.',
      });
      return;
    }

    setSubmitting(true);
    setBookingError(null);

    const payload: CandidateFormData = {
      slot_id: selectedSlot.slot_id,
      candidate_name: trimmedName,
      candidate_email: trimmedEmail,
      candidate_phone: phone.trim() || undefined,
      meeting_type: meetingType,
    };

    try {
      const response = await schedulerApi.bookSlot(payload);

      if (response.success && response.booking) {
        setConfirmedBooking(response.booking);
        setSelectedSlot(null);
      } else {
        if (response.error === 'SLOT_UNAVAILABLE' || response.error === 'SLOT_NOT_FOUND') {
          setBookingError({
            title: 'This slot is no longer available',
            message:
              'Another candidate has just selected this interview slot. Please choose another available slot.',
          });
          setSelectedSlot(null);
          await loadAvailableSlots(true);
        } else if (response.error === 'LIMIT_REACHED') {
          setBookingError({
            title: 'All interview slots filled',
            message: 'All interview positions for this round have been booked.',
          });
          setSelectedSlot(null);
          await loadAvailableSlots(true);
        } else {
          setBookingError({
            title: 'Booking could not be completed',
            message: response.message || 'Something went wrong. Please try again.',
          });
        }
      }
    } catch (err: any) {
      setBookingError({
        title: 'Network error',
        message: 'Failed to send your booking request. Please check your internet connection and try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const selectedSlotFormattedDate = useMemo(() => {
    if (!selectedSlot) return '';
    try {
      const [y, m, d] = selectedSlot.date.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      return dateObj.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch (e) {
      return selectedSlot.date;
    }
  }, [selectedSlot]);

  if (confirmedBooking) {
    return (
      <div className="min-h-screen bg-surface flex flex-col relative overflow-x-hidden">
        <header className="max-w-7xl mx-auto px-6 py-8 w-full flex items-center justify-between z-20">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-2xl bg-card shadow-soft glass-border flex items-center justify-center p-2 overflow-hidden transition-transform group-hover:scale-105">
              <img src="/Logo.png" alt="Kieli Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-brandText">Kieli</span>
          </a>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 py-8 relative z-10">
          <div className="w-full max-w-4xl">
            <ConfirmationScreen booking={confirmedBooking} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col relative overflow-x-hidden">
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradientEnd/10 rounded-full blur-[120px] pointer-events-none" />

      <header className="max-w-7xl mx-auto px-6 pt-8 pb-4 w-full flex items-center justify-between z-20">
        <a href="/" className="flex items-center gap-3 group">
          <div className="w-[52px] h-[52px] sm:w-[60px] sm:h-[60px] rounded-2xl bg-card shadow-soft glass-border flex items-center justify-center p-2 overflow-hidden transition-transform group-hover:scale-105">
            <img src="/Logo.png" alt="Kieli Logo" className="w-full h-full object-contain" />
          </div>
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-brandText">Kieli</span>
        </a>

        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-sm glass-border text-xs font-semibold text-brandText/70">
          <Globe className="w-3.5 h-3.5 text-primary" />
          <span>Finland Time (UTC+3)</span>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-6 pb-20 w-full z-10 flex-1">
        <div className="max-w-3xl mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-soft glass-border">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest text-brandText/80">
              Interview Scheduling
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brandText leading-tight">
            Select Your Interview Slot
          </h1>

          <p className="text-base sm:text-lg text-brandText/70 font-medium leading-relaxed">
            Thank you for your interest in Kieli. Please select a convenient interview slot below.
          </p>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs sm:text-sm font-semibold text-primary">
            <Clock className="w-4 h-4" />
            <span>All times are in Finland local time. (45-minute interview)</span>
          </div>
        </div>

        <AnimatePresence>
          {bookingError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-4 text-brandText"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-base font-bold text-amber-900">{bookingError.title}</h3>
                <p className="text-sm text-amber-800/90 font-medium leading-relaxed">
                  {bookingError.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setBookingError(null)}
                className="text-xs font-bold text-amber-800 hover:text-amber-950 px-2 py-1"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {loadingSlots ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-semibold text-brandText/60 tracking-wide">
              Loading available interview slots...
            </p>
          </div>
        ) : schedulerStatus.toLowerCase() !== 'open' ? (
          <div className="bg-card rounded-[32px] glass-border shadow-soft p-10 sm:p-16 text-center max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-secondary mx-auto flex items-center justify-center text-primary">
              <CalendarCheck className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold text-brandText">Interview Scheduling Closed</h2>
            <p className="text-brandText/70 font-medium">
              The interview scheduling window is currently closed. If you have any questions, please contact the Kieli team directly.
            </p>
          </div>
        ) : groupedSlots.length === 0 ? (
          <div className="bg-card rounded-[32px] glass-border shadow-soft p-10 sm:p-16 text-center max-w-xl mx-auto space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 mx-auto flex items-center justify-center">
              <CalendarIcon className="w-7 h-7" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-brandText">All Slots Currently Booked</h2>
              <p className="text-brandText/70 font-medium text-sm sm:text-base">
                All 15 interview slots have been selected by candidates. If a spot opens up, it will appear here automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={() => loadAvailableSlots(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card glass-border shadow-sm text-brandText hover:bg-surface font-semibold text-sm transition-all"
            >
              <RefreshCw className="w-4 h-4 text-primary" />
              <span>Refresh Availability</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-brandText tracking-tight">Available Dates & Times</h2>
                <button
                  type="button"
                  onClick={() => loadAvailableSlots(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="space-y-6">
                {groupedSlots.map((group) => (
                  <div
                    key={group.date}
                    className="bg-card/70 rounded-3xl p-6 glass-border shadow-sm transition-all hover:shadow-soft"
                  >
                    <div className="flex items-center gap-3 pb-4 mb-4 border-b border-brandText/10">
                      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary shrink-0">
                        <CalendarIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-brandText">{group.formattedDate}</h3>
                        <p className="text-xs font-semibold text-brandText/50">
                          {group.slots.length} available slot{group.slots.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {group.slots.map((slot) => {
                        const isSelected = selectedSlot?.slot_id === slot.slot_id;

                        return (
                          <motion.button
                            key={slot.slot_id}
                            type="button"
                            onClick={() => handleSelectSlot(slot)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-4 rounded-2xl text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                              isSelected
                                ? 'bg-signature-gradient text-white shadow-soft ring-2 ring-primary ring-offset-2'
                                : 'bg-surface hover:bg-card border border-brandText/10 hover:border-primary/30 text-brandText shadow-sm'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full mb-2">
                              <span
                                className={`text-xs font-bold uppercase tracking-wider ${
                                  isSelected ? 'text-white/80' : 'text-primary'
                                }`}
                              >
                                45 min
                              </span>
                              {isSelected && (
                                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-white">
                                  <Check className="w-3.5 h-3.5" />
                                </div>
                              )}
                            </div>

                            <p className="text-base sm:text-lg font-bold tracking-tight">
                              {slot.start_time} – {slot.end_time}
                            </p>

                            <div className="mt-3 pt-2 border-t border-current/10 flex items-center justify-between text-xs font-semibold">
                              <span>{isSelected ? 'Selected' : 'Select'}</span>
                              <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'translate-x-0.5' : ''}`} />
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="candidate-details-form" className="lg:col-span-5 lg:sticky lg:top-8">
              {selectedSlot ? (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-card rounded-3xl p-6 sm:p-8 glass-border shadow-soft space-y-6"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-brandText/10">
                    <div>
                      <h3 className="text-xl font-bold text-brandText">Your Details</h3>
                      <p className="text-xs font-medium text-brandText/60 mt-0.5">
                        Please enter your details to confirm your slot.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedSlot(null)}
                      className="text-xs font-semibold text-brandText/60 hover:text-brandText flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Change</span>
                    </button>
                  </div>

                  {/* Selected Slot Summary Card */}
                  <div className="bg-surface rounded-2xl p-4 glass-border space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-brandText/50">
                      Selected Interview
                    </p>
                    <div className="flex justify-between items-center text-sm font-bold text-brandText">
                      <span>Date:</span>
                      <span className="text-primary">{selectedSlot.day}, {selectedSlotFormattedDate}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold text-brandText">
                      <span>Time:</span>
                      <span>{selectedSlot.start_time} – {selectedSlot.end_time}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium text-brandText/70 pt-1 border-t border-brandText/5">
                      <span>Format:</span>
                      <span className="font-bold text-brandText">
                        {meetingType === 'in_person' ? 'In-Person (Helsinki)' : 'Online (Google Meet)'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs font-medium text-brandText/70">
                      <span>Timezone:</span>
                      <span>Finland time (Europe/Helsinki)</span>
                    </div>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    {/* Meeting Format Choice (Offline / Online) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold uppercase tracking-wider text-brandText/70">
                          Interview Format <span className="text-primary">*</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 gap-2.5">
                        {/* In-Person Option (Preferred) */}
                        <button
                          type="button"
                          onClick={() => setMeetingType('in_person')}
                          className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 relative ${
                            meetingType === 'in_person'
                              ? 'bg-primary/5 border-primary ring-1 ring-primary'
                              : 'bg-surface border-brandText/10 hover:border-brandText/20'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                            meetingType === 'in_person' ? 'border-primary bg-primary text-white' : 'border-brandText/30'
                          }`}>
                            {meetingType === 'in_person' && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-brandText flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-primary" />
                                In-Person Meeting (Helsinki)
                              </span>
                              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
                                Preferred
                              </span>
                            </div>
                            <p className="text-xs text-brandText/60 font-medium leading-relaxed">
                              We prefer meeting you in person in Helsinki. Exact location details will be intimated prior to the interview.
                            </p>
                          </div>
                        </button>

                        {/* Online Option */}
                        <button
                          type="button"
                          onClick={() => setMeetingType('online')}
                          className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                            meetingType === 'online'
                              ? 'bg-primary/5 border-primary ring-1 ring-primary'
                              : 'bg-surface border-brandText/10 hover:border-brandText/20'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                            meetingType === 'online' ? 'border-primary bg-primary text-white' : 'border-brandText/30'
                          }`}>
                            {meetingType === 'online' && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <div className="flex-1 space-y-0.5">
                            <span className="text-sm font-bold text-brandText flex items-center gap-1.5">
                              <Video className="w-4 h-4 text-primary" />
                              Online (Google Meet)
                            </span>
                            <p className="text-xs text-brandText/60 font-medium">
                              Video conference call via Google Meet.
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-brandText/70">
                        Full Name <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-brandText/40" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="e.g. Maria Virtanen"
                          className="w-full pl-11 pr-4 py-3.5 bg-surface rounded-2xl glass-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-brandText placeholder:text-brandText/30 font-semibold text-sm transition-all"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-brandText/70">
                        Email Address <span className="text-primary">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-brandText/40" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="e.g. maria.virtanen@example.com"
                          className="w-full pl-11 pr-4 py-3.5 bg-surface rounded-2xl glass-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-brandText placeholder:text-brandText/30 font-semibold text-sm transition-all"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-brandText/70">
                        Phone Number <span className="text-xs font-normal text-brandText/40">(optional)</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-brandText/40" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="e.g. +358 40 123 4567"
                          className="w-full pl-11 pr-4 py-3.5 bg-surface rounded-2xl glass-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-brandText placeholder:text-brandText/30 font-semibold text-sm transition-all"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-3">
                      <motion.button
                        type="submit"
                        disabled={submitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 rounded-2xl bg-signature-gradient text-white font-bold tracking-wide shadow-soft flex items-center justify-center gap-2 group transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          boxShadow: '0 10px 30px -10px rgba(57, 94, 159, 0.4)',
                        }}
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Confirming Interview...</span>
                          </>
                        ) : (
                          <>
                            <span>Confirm Interview</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </motion.button>
                    </div>

                    <p className="text-center text-[11px] font-medium text-brandText/50 pt-2">
                      Instant confirmation will be sent to your email.
                    </p>
                  </form>
                </motion.div>
              ) : (
                <div className="bg-card/50 rounded-3xl p-8 glass-border border-dashed text-center space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-secondary text-primary mx-auto flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-brandText">No Slot Selected</h3>
                  <p className="text-xs sm:text-sm text-brandText/60 font-medium max-w-xs mx-auto">
                    Please select an available interview time on the left to proceed with your booking.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
