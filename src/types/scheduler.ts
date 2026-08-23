export type SlotStatus = 'Available' | 'Booked' | 'Cancelled';

export type MeetingType = 'in_person' | 'online';

export interface Slot {
  slot_id: string;
  date: string; // e.g. "2026-09-01"
  day: string;  // e.g. "Tuesday"
  start_time: string; // e.g. "17:00"
  end_time: string;   // e.g. "17:45"
  status: SlotStatus;
}

export interface DateGroupedSlots {
  date: string;
  day: string;
  formattedDate: string; // e.g. "Tuesday, 1 September 2026"
  slots: Slot[];
}

export interface CandidateFormData {
  candidate_name: string;
  candidate_email: string;
  candidate_phone?: string;
  slot_id: string;
  meeting_type: MeetingType;
}

export interface BookingConfirmation {
  candidateId: string;
  slotId: string;
  candidateName: string;
  candidateEmail: string;
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  timezone: string;
  meetingType: MeetingType;
  meetLink?: string;
  calendarEventId?: string;
  confirmationSent?: boolean;
}

export interface SchedulerSettings {
  interviewTitle: string;
  durationMinutes: number;
  timezone: string;
  location: string;
  platform: string;
  status: string;
}

export interface GetSlotsResponse {
  success: boolean;
  status?: string;
  timezone?: string;
  slots?: Slot[];
  settings?: SchedulerSettings;
  message?: string;
  error?: string;
}

export interface BookSlotResponse {
  success: boolean;
  booking?: BookingConfirmation;
  error?: string;
  message?: string;
}
