import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Calendar, Clock, Video, Globe, Mail, ArrowRight, User, MapPin } from 'lucide-react';
import type { BookingConfirmation } from '../../types/scheduler';

interface ConfirmationScreenProps {
  booking: BookingConfirmation;
}

export const ConfirmationScreen: React.FC<ConfirmationScreenProps> = ({ booking }) => {
  const isInPerson = booking.meetingType === 'in_person';

  // Format human-friendly display date e.g. "Tuesday, 1 September 2026"
  const formattedDateString = React.useMemo(() => {
    try {
      const [year, month, day] = booking.date.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      return dateObj.toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return `${booking.day}, ${booking.date}`;
    }
  }, [booking.date, booking.day]);

  // Generate Google Calendar Link
  const googleCalendarUrl = React.useMemo(() => {
    try {
      const [year, month, day] = booking.date.split('-');
      const [startHour, startMin] = booking.startTime.split(':');
      const [endHour, endMin] = booking.endTime.split(':');

      const startIso = `${year}${month}${day}T${startHour}${startMin}00`;
      const endIso = `${year}${month}${day}T${endHour}${endMin}00`;

      const title = encodeURIComponent(`Kieli Interview – ${booking.candidateName} (${isInPerson ? 'In-Person Helsinki' : 'Online'})`);
      const details = encodeURIComponent(
        `Kieli Interview Session\nFormat: ${isInPerson ? 'In-Person (Helsinki - venue to be confirmed prior to meeting)' : 'Online (Google Meet)'}\nTime: ${booking.startTime} - ${booking.endTime} (Finland time / Europe/Helsinki)\n${booking.meetLink ? 'Meeting Link: ' + booking.meetLink : ''}`
      );
      const location = encodeURIComponent(isInPerson ? 'Helsinki, Finland (Exact venue to be intimated)' : (booking.meetLink || 'Google Meet (Online)'));

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&ctz=Europe/Helsinki&details=${details}&location=${location}`;
    } catch {
      return '#';
    }
  }, [booking, isInPerson]);

  // Generate .ics file download for Apple Calendar / Outlook
  const handleDownloadIcs = () => {
    try {
      const [year, month, day] = booking.date.split('-');
      const [startHour, startMin] = booking.startTime.split(':');
      const [endHour, endMin] = booking.endTime.split(':');

      const startFormatted = `${year}${month}${day}T${startHour}${startMin}00`;
      const endFormatted = `${year}${month}${day}T${endHour}${endMin}00`;

      const locationStr = isInPerson ? 'Helsinki, Finland (Venue to be intimated)' : (booking.meetLink || 'Online (Google Meet)');

      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Kieli//Interview Scheduler//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:REQUEST',
        'BEGIN:VEVENT',
        `UID:kieli-${booking.slotId}-${Date.now()}@kieli.eu`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART;TZID=Europe/Helsinki:${startFormatted}`,
        `DTEND;TZID=Europe/Helsinki:${endFormatted}`,
        `SUMMARY:Kieli Interview – ${booking.candidateName} (${isInPerson ? 'In-Person Helsinki' : 'Online'})`,
        `DESCRIPTION:Kieli Interview with ${booking.candidateName}\\nFormat: ${isInPerson ? 'In-Person (Helsinki)' : 'Online'}\\nTimezone: Europe/Helsinki`,
        `LOCATION:${locationStr}`,
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR',
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', `kieli-interview-${booking.date}.ics`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Failed to download .ics', e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="w-full max-w-2xl mx-auto bg-card rounded-[32px] glass-border shadow-[0_20px_60px_-15px_rgba(57,94,159,0.12)] p-8 sm:p-12 relative overflow-hidden"
    >
      {/* Top Gradient Ribbon */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-signature-gradient" />

      {/* Success Badge */}
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 mb-2">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-brandText">
          Interview Confirmed
        </h2>
        
        <p className="text-base sm:text-lg text-brandText/70 font-medium max-w-md">
          Your interview has been successfully scheduled. We look forward to meeting you!
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="mt-8 bg-surface rounded-2xl p-6 sm:p-8 glass-border space-y-5">
        <div className="flex items-start gap-4 pb-4 border-b border-brandText/10">
          <div className="w-10 h-10 rounded-xl bg-card glass-border shadow-sm flex items-center justify-center text-primary shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brandText/50">Date</p>
            <p className="text-lg font-bold text-brandText mt-0.5">{formattedDateString}</p>
          </div>
        </div>

        <div className="flex items-start gap-4 pb-4 border-b border-brandText/10">
          <div className="w-10 h-10 rounded-xl bg-card glass-border shadow-sm flex items-center justify-center text-primary shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brandText/50">Time</p>
            <p className="text-lg font-bold text-brandText mt-0.5">
              {booking.startTime} – {booking.endTime}
            </p>
            <p className="text-xs font-medium text-brandText/60 mt-0.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-primary" />
              Finland local time (Europe/Helsinki) &bull; 45 minutes
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 pb-4 border-b border-brandText/10">
          <div className="w-10 h-10 rounded-xl bg-card glass-border shadow-sm flex items-center justify-center text-primary shrink-0">
            {isInPerson ? <MapPin className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brandText/50">Meeting Format</p>
            <p className="text-base font-bold text-brandText mt-0.5">
              {isInPerson ? 'In-Person (Helsinki)' : 'Online (Google Meet)'}
            </p>
            {isInPerson ? (
              <p className="text-xs font-medium text-primary mt-0.5">
                Exact location in Helsinki will be intimated prior to the interview.
              </p>
            ) : (
              <p className="text-xs font-medium text-brandText/60 mt-0.5">
                Video conference via Google Meet.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-card glass-border shadow-sm flex items-center justify-center text-primary shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-brandText/50">Candidate</p>
            <p className="text-base font-bold text-brandText mt-0.5">{booking.candidateName}</p>
            <p className="text-xs font-medium text-brandText/60 mt-0.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-primary" />
              {booking.candidateEmail}
            </p>
          </div>
        </div>
      </div>

      {/* Format Callout Box */}
      {isInPerson ? (
        <div className="mt-6 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-700 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-800">In-Person Meeting in Helsinki</p>
            <p className="text-sm text-emerald-900/90 font-medium leading-relaxed">
              We look forward to meeting you in person in Helsinki! The exact venue address and directions will be emailed to you well before the scheduled time.
            </p>
          </div>
        </div>
      ) : booking.meetLink ? (
        <div className="mt-6 p-6 rounded-2xl bg-primary/5 border border-primary/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">Meeting Platform</p>
              <p className="text-sm font-bold text-brandText">Google Meet</p>
            </div>
          </div>

          <a
            href={booking.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-soft hover:bg-primary/90 flex items-center justify-center gap-2 transition-all"
          >
            <span>Join Interview</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      ) : null}

      {/* Confirmation Message */}
      <div className="mt-6 flex items-center justify-center gap-2 text-center text-sm font-semibold text-brandText/70">
        <Mail className="w-4 h-4 text-primary" />
        <span>A confirmation email with your booking details has been sent to your inbox.</span>
      </div>

      {/* Action Buttons: Add to Calendar */}
      <div className="mt-8 pt-6 border-t border-brandText/10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <a
          href={googleCalendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-card glass-border shadow-sm text-brandText hover:bg-surface font-semibold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <Calendar className="w-4 h-4 text-primary" />
          <span>Add to Google Calendar</span>
        </a>

        <button
          type="button"
          onClick={handleDownloadIcs}
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-card glass-border shadow-sm text-brandText hover:bg-surface font-semibold text-sm flex items-center justify-center gap-2 transition-all"
        >
          <Calendar className="w-4 h-4 text-primary" />
          <span>Download .ics file (Apple / Outlook)</span>
        </button>
      </div>

      {/* Return to Home link */}
      <div className="mt-8 text-center">
        <a
          href="/"
          className="text-xs font-bold uppercase tracking-widest text-primary hover:underline"
        >
          &larr; Back to Kieli Homepage
        </a>
      </div>
    </motion.div>
  );
};
