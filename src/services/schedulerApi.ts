import type { Slot, CandidateFormData, GetSlotsResponse, BookSlotResponse } from '../types/scheduler';

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

// Pre-seeded initial 18 slots for September 2026 (Europe/Helsinki)
const INITIAL_SLOTS: Slot[] = [
  { slot_id: 'S001', date: '2026-09-01', day: 'Tuesday',  start_time: '17:00', end_time: '17:45', status: 'Available' },
  { slot_id: 'S002', date: '2026-09-01', day: 'Tuesday',  start_time: '18:00', end_time: '18:45', status: 'Available' },
  { slot_id: 'S003', date: '2026-09-01', day: 'Tuesday',  start_time: '19:00', end_time: '19:45', status: 'Available' },
  { slot_id: 'S004', date: '2026-09-03', day: 'Thursday', start_time: '17:00', end_time: '17:45', status: 'Available' },
  { slot_id: 'S005', date: '2026-09-03', day: 'Thursday', start_time: '18:00', end_time: '18:45', status: 'Available' },
  { slot_id: 'S006', date: '2026-09-03', day: 'Thursday', start_time: '19:00', end_time: '19:45', status: 'Available' },
  { slot_id: 'S007', date: '2026-09-08', day: 'Tuesday',  start_time: '17:00', end_time: '17:45', status: 'Available' },
  { slot_id: 'S008', date: '2026-09-08', day: 'Tuesday',  start_time: '18:00', end_time: '18:45', status: 'Available' },
  { slot_id: 'S009', date: '2026-09-08', day: 'Tuesday',  start_time: '19:00', end_time: '19:45', status: 'Available' },
  { slot_id: 'S010', date: '2026-09-10', day: 'Thursday', start_time: '17:00', end_time: '17:45', status: 'Available' },
  { slot_id: 'S011', date: '2026-09-10', day: 'Thursday', start_time: '18:00', end_time: '18:45', status: 'Available' },
  { slot_id: 'S012', date: '2026-09-10', day: 'Thursday', start_time: '19:00', end_time: '19:45', status: 'Available' },
  { slot_id: 'S013', date: '2026-09-15', day: 'Tuesday',  start_time: '17:00', end_time: '17:45', status: 'Available' },
  { slot_id: 'S014', date: '2026-09-15', day: 'Tuesday',  start_time: '18:00', end_time: '18:45', status: 'Available' },
  { slot_id: 'S015', date: '2026-09-15', day: 'Tuesday',  start_time: '19:00', end_time: '19:45', status: 'Available' },
  { slot_id: 'S016', date: '2026-09-17', day: 'Thursday', start_time: '17:00', end_time: '17:45', status: 'Available' },
  { slot_id: 'S017', date: '2026-09-17', day: 'Thursday', start_time: '18:00', end_time: '18:45', status: 'Available' },
  { slot_id: 'S018', date: '2026-09-17', day: 'Thursday', start_time: '19:00', end_time: '19:45', status: 'Available' },
];

const STORAGE_KEY = 'kieli_scheduler_mock_slots';
const CANDIDATES_STORAGE_KEY = 'kieli_scheduler_mock_candidates';

function getLocalSlots(): Slot[] {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // sessionStorage not available
  }
  return [...INITIAL_SLOTS];
}

function saveLocalSlots(slots: Slot[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(slots));
  } catch (e) {}
}

export const schedulerApi = {
  /**
   * Fetch all available slots from Google Apps Script backend API (or local mock store).
   */
  async getAvailableSlots(): Promise<GetSlotsResponse> {
    if (APPS_SCRIPT_URL) {
      try {
        const response = await fetch(`${APPS_SCRIPT_URL}?action=getSlots`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          redirect: 'follow',
        });

        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}`);
        }

        const data: GetSlotsResponse = await response.json();
        return data;
      } catch (err: any) {
        console.error('Failed to fetch slots from Apps Script API:', err);
        return {
          success: false,
          error: 'NETWORK_ERROR',
          message: 'Unable to connect to the scheduling service. Please check your internet connection or try again.',
        };
      }
    }

    // Local Mock Mode Simulation (with realistic latency)
    await new Promise((resolve) => setTimeout(resolve, 400));
    const allSlots = getLocalSlots();
    const availableOnly = allSlots.filter((s) => s.status === 'Available');

    return {
      success: true,
      status: 'Open',
      timezone: 'Europe/Helsinki',
      slots: availableOnly,
      settings: {
        interviewTitle: 'Kieli Interview',
        durationMinutes: 45,
        timezone: 'Europe/Helsinki',
        location: 'Helsinki / Online',
        platform: 'In-Person (Preferred) / Google Meet',
        status: 'Open',
      },
    };
  },

  /**
   * Book an interview slot atomically.
   */
  async bookSlot(data: CandidateFormData): Promise<BookSlotResponse> {
    if (APPS_SCRIPT_URL) {
      try {
        const response = await fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: JSON.stringify(data),
          redirect: 'follow',
        });

        if (!response.ok) {
          throw new Error(`Server returned HTTP ${response.status}`);
        }

        const result: BookSlotResponse = await response.json();
        return result;
      } catch (err: any) {
        console.error('Booking failed via Apps Script API:', err);
        return {
          success: false,
          error: 'NETWORK_ERROR',
          message: 'Network request failed. Please check your connection and try again.',
        };
      }
    }

    // Local Mock Mode Simulation
    await new Promise((resolve) => setTimeout(resolve, 700));
    const allSlots = getLocalSlots();
    const slotIndex = allSlots.findIndex((s) => s.slot_id === data.slot_id);

    if (slotIndex === -1) {
      return {
        success: false,
        error: 'SLOT_NOT_FOUND',
        message: 'The requested interview slot was not found.',
      };
    }

    const slot = allSlots[slotIndex];
    if (slot.status !== 'Available') {
      return {
        success: false,
        error: 'SLOT_UNAVAILABLE',
        message: 'Another candidate has just selected this interview slot. Please choose another available slot.',
      };
    }

    // Mark as booked in mock store
    allSlots[slotIndex] = { ...slot, status: 'Booked' };
    saveLocalSlots(allSlots);

    // Generate Candidate ID
    let candidateCount = 1;
    try {
      const existingCandidates = JSON.parse(sessionStorage.getItem(CANDIDATES_STORAGE_KEY) || '[]');
      candidateCount = existingCandidates.length + 1;
      existingCandidates.push({
        candidateId: `C${String(candidateCount).padStart(3, '0')}`,
        ...data,
        bookedAt: new Date().toISOString(),
      });
      sessionStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(existingCandidates));
    } catch (e) {}

    const candidateId = `C${String(candidateCount).padStart(3, '0')}`;
    const isOnline = data.meeting_type === 'online';

    return {
      success: true,
      booking: {
        candidateId: candidateId,
        slotId: slot.slot_id,
        candidateName: data.candidate_name,
        candidateEmail: data.candidate_email,
        date: slot.date,
        day: slot.day,
        startTime: slot.start_time,
        endTime: slot.end_time,
        timezone: 'Europe/Helsinki',
        meetingType: data.meeting_type,
        meetLink: isOnline ? 'https://meet.google.com/kie-inte-rwv' : undefined,
        calendarEventId: 'mock_cal_' + Date.now(),
        confirmationSent: true,
      },
    };
  },

  /**
   * Helper for development/testing: reset mock data back to initial 18 available slots.
   */
  resetMockSlots() {
    saveLocalSlots([...INITIAL_SLOTS]);
    try {
      sessionStorage.removeItem(CANDIDATES_STORAGE_KEY);
    } catch (e) {}
  },
};
