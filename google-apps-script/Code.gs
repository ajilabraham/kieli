/**
 * ============================================================================
 * KIELI INTERVIEW SCHEDULER – BACKEND API (Google Apps Script)
 * Sheet: "Kieli Interview Scheduler – September 2026"
 * Timezone: Europe/Helsinki
 * ============================================================================
 */

// Configuration Constants
const CONFIG = {
  SHEET_NAMES: {
    SLOTS: 'Slots',
    CANDIDATES: 'Candidates',
    SETTINGS: 'Settings',
    LOG: 'Log',
  },
  DEFAULT_TIMEZONE: 'Europe/Helsinki',
  LOCK_TIMEOUT_MS: 10000, // 10 seconds timeout for concurrency lock
  SLOT_DATA_START_ROW: 5, // Row where slot data begins (after summary & header)
};

/**
 * HTTP GET Handler – Fetches available interview slots and settings.
 */
function doGet(e) {
  try {
    const params = (e && e.parameter) || {};
    const action = params.action || 'getSlots';

    if (action === 'ping') {
      return createJsonResponse({ status: 'ok', timestamp: new Date().toISOString() });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const settings = getSettingsMap(ss);
    
    // Check if scheduler is open
    const schedulerStatus = settings['Scheduler Status'] || 'Open';
    if (schedulerStatus.toLowerCase() !== 'open') {
      return createJsonResponse({
        success: true,
        status: 'Closed',
        message: 'The interview scheduler is currently closed.',
        slots: [],
        settings: sanitizeSettings(settings),
      });
    }

    // Fetch available slots
    const slotsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.SLOTS);
    if (!slotsSheet) {
      return createJsonResponse({
        success: false,
        error: 'SHEET_NOT_FOUND',
        message: 'Slots sheet not found. Please run setupScheduler() first.',
      });
    }

    // Use getDisplayValues() to get exact formatted string values without timezone distortion
    const data = slotsSheet.getDataRange().getDisplayValues();
    const headerRowIndex = 3;
    if (data.length <= headerRowIndex) {
      return createJsonResponse({ success: true, slots: [], settings: sanitizeSettings(settings) });
    }

    const headers = data[headerRowIndex].map(h => String(h).trim().toLowerCase());
    const slotIdIdx = headers.indexOf('slot_id');
    const dateIdx = headers.indexOf('date');
    const dayIdx = headers.indexOf('day');
    const startTimeIdx = headers.indexOf('start_time');
    const endTimeIdx = headers.indexOf('end_time');
    const statusIdx = headers.indexOf('status');

    const availableSlots = [];

    for (let r = CONFIG.SLOT_DATA_START_ROW - 1; r < data.length; r++) {
      const row = data[r];
      const slotId = String(row[slotIdIdx] || '').trim();
      const status = String(row[statusIdx] || '').trim();

      if (!slotId) continue;

      // Only return slots whose status is strictly 'Available'
      if (status.toLowerCase() === 'available') {
        availableSlots.push({
          slot_id: slotId,
          date: String(row[dateIdx] || '').trim(),
          day: String(row[dayIdx] || '').trim(),
          start_time: String(row[startTimeIdx] || '').trim(),
          end_time: String(row[endTimeIdx] || '').trim(),
          status: 'Available',
        });
      }
    }

    return createJsonResponse({
      success: true,
      status: 'Open',
      timezone: settings['Time Zone'] || CONFIG.DEFAULT_TIMEZONE,
      slots: availableSlots,
      settings: sanitizeSettings(settings),
    });

  } catch (err) {
    logAction('GET_SLOTS', 'N/A', 'N/A', 'ERROR', err.toString());
    return createJsonResponse({
      success: false,
      error: 'SERVER_ERROR',
      message: 'Failed to retrieve available slots: ' + err.message,
    });
  }
}

/**
 * HTTP POST Handler – Books an interview slot with atomic lock.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  let lockAcquired = false;

  try {
    // 1. Parse Request Payload
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const slotId = String(payload.slot_id || '').trim();
    const candidateName = String(payload.candidate_name || '').trim();
    const candidateEmail = String(payload.candidate_email || '').trim().toLowerCase();
    const candidatePhone = String(payload.candidate_phone || '').trim();
    const meetingType = String(payload.meeting_type || 'in_person').trim();

    // 2. Server-side Validation
    if (!slotId) {
      return createJsonResponse({ success: false, error: 'INVALID_SLOT', message: 'Slot ID is required.' });
    }
    if (!candidateName) {
      return createJsonResponse({ success: false, error: 'INVALID_NAME', message: 'Candidate full name is required.' });
    }
    if (!candidateEmail || !isValidEmail(candidateEmail)) {
      return createJsonResponse({ success: false, error: 'INVALID_EMAIL', message: 'A valid email address is required.' });
    }

    // 3. Acquire Script Lock (Atomic Concurrency Protection)
    lockAcquired = lock.tryLock(CONFIG.LOCK_TIMEOUT_MS);
    if (!lockAcquired) {
      logAction('BOOK_SLOT', slotId, candidateEmail, 'LOCK_TIMEOUT', 'Server busy. Could not acquire script lock in time.');
      return createJsonResponse({
        success: false,
        error: 'SERVER_BUSY',
        message: 'The scheduler is currently processing another request. Please try again in a moment.',
      });
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const slotsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.SLOTS);
    const candidatesSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.CANDIDATES);
    const settings = getSettingsMap(ss);

    if (!slotsSheet || !candidatesSheet) {
      return createJsonResponse({
        success: false,
        error: 'SHEET_NOT_CONFIGURED',
        message: 'System sheets not initialized. Please run setupScheduler().',
      });
    }

    // Check Scheduler Status
    const schedulerStatus = (settings['Scheduler Status'] || 'Open').toLowerCase();
    if (schedulerStatus !== 'open') {
      return createJsonResponse({
        success: false,
        error: 'SCHEDULER_CLOSED',
        message: 'The interview scheduler is currently closed.',
      });
    }

    // Check Maximum Candidates limit
    const maxCandidates = parseInt(settings['Maximum Candidates'] || '12', 10);
    const candidateRowsCount = Math.max(0, candidatesSheet.getLastRow() - 1);
    if (candidateRowsCount >= maxCandidates) {
      logAction('BOOK_SLOT', slotId, candidateEmail, 'LIMIT_REACHED', 'Maximum candidate limit reached (' + maxCandidates + ').');
      return createJsonResponse({
        success: false,
        error: 'LIMIT_REACHED',
        message: 'All interview positions for this round have been filled. Thank you for your interest.',
      });
    }

    // 4. Find and Verify Slot in Sheet
    const data = slotsSheet.getDataRange().getDisplayValues();
    const headerRowIndex = 3;
    const headers = data[headerRowIndex].map(h => String(h).trim().toLowerCase());

    const slotIdIdx = headers.indexOf('slot_id');
    const dateIdx = headers.indexOf('date');
    const dayIdx = headers.indexOf('day');
    const startTimeIdx = headers.indexOf('start_time');
    const endTimeIdx = headers.indexOf('end_time');
    const statusIdx = headers.indexOf('status');
    const nameIdx = headers.indexOf('candidate_name');
    const emailIdx = headers.indexOf('candidate_email');
    const phoneIdx = headers.indexOf('candidate_phone');
    const bookedAtIdx = headers.indexOf('booked_at');
    const calendarEventIdIdx = headers.indexOf('calendar_event_id');
    const confSentIdx = headers.indexOf('confirmation_sent');

    let targetRowIndex = -1;
    let slotData = null;

    for (let r = CONFIG.SLOT_DATA_START_ROW - 1; r < data.length; r++) {
      if (String(data[r][slotIdIdx] || '').trim() === slotId) {
        targetRowIndex = r + 1;
        slotData = data[r];
        break;
      }
    }

    if (targetRowIndex === -1 || !slotData) {
      logAction('BOOK_SLOT', slotId, candidateEmail, 'NOT_FOUND', 'Slot ID does not exist.');
      return createJsonResponse({
        success: false,
        error: 'SLOT_NOT_FOUND',
        message: 'The requested interview slot was not found.',
      });
    }

    const currentStatus = String(slotData[statusIdx] || '').trim();

    // 5. Double-Booking Check
    if (currentStatus.toLowerCase() !== 'available') {
      logAction('BOOK_SLOT', slotId, candidateEmail, 'DOUBLE_BOOKING_PREVENTED', 'Slot was already ' + currentStatus);
      return createJsonResponse({
        success: false,
        error: 'SLOT_UNAVAILABLE',
        message: 'Another candidate has just selected this interview slot. Please choose another available slot.',
      });
    }

    // 6. Atomically Mark Slot as Booked
    const nowIso = new Date().toISOString();
    const formattedDate = String(slotData[dateIdx] || '').trim();
    const formattedStartTime = String(slotData[startTimeIdx] || '').trim();
    const formattedEndTime = String(slotData[endTimeIdx] || '').trim();
    const dayName = String(slotData[dayIdx] || '').trim();
    const meetingTypeDisplay = meetingType === 'in_person' ? 'In-Person (Helsinki)' : 'Online (Google Meet)';

    slotsSheet.getRange(targetRowIndex, statusIdx + 1).setValue('Booked');
    slotsSheet.getRange(targetRowIndex, nameIdx + 1).setValue(candidateName);
    slotsSheet.getRange(targetRowIndex, emailIdx + 1).setValue(candidateEmail);
    slotsSheet.getRange(targetRowIndex, phoneIdx + 1).setValue(candidatePhone);
    slotsSheet.getRange(targetRowIndex, bookedAtIdx + 1).setValue(nowIso);

    // 7. Generate Candidate ID (C001, C002, ...)
    const nextCandidateNumber = candidateRowsCount + 1;
    const candidateId = 'C' + String(nextCandidateNumber).padStart(3, '0');

    // Append to Candidates Tab
    candidatesSheet.appendRow([
      candidateId,
      candidateName,
      candidateEmail,
      candidatePhone,
      slotId,
      formattedDate,
      formattedStartTime + ' - ' + formattedEndTime,
      'Confirmed',
      nowIso,
      '', // calendar_event_id
      '', // confirmation_sent
      meetingTypeDisplay,
    ]);
    const candidateRowIndex = candidatesSheet.getLastRow();

    SpreadsheetApp.flush();
    lock.releaseLock();
    lockAcquired = false;

    // 8. Google Calendar Integration
    let calendarEventId = '';
    let meetLink = '';

    try {
      const calendarResult = createInterviewCalendarEvent({
        candidateName: candidateName,
        candidateEmail: candidateEmail,
        dateStr: formattedDate,
        startTimeStr: formattedStartTime,
        endTimeStr: formattedEndTime,
        timezone: settings['Time Zone'] || CONFIG.DEFAULT_TIMEZONE,
        panelEmails: settings['Panel Emails'] || '',
        titlePrefix: settings['Interview Title'] || 'Kieli Interview',
        meetingType: meetingType,
      });

      calendarEventId = calendarResult.eventId || '';
      meetLink = calendarResult.meetLink || '';

      if (calendarEventId) {
        slotsSheet.getRange(targetRowIndex, calendarEventIdIdx + 1).setValue(calendarEventId);
        candidatesSheet.getRange(candidateRowIndex, 10).setValue(calendarEventId);
        logAction('CALENDAR_EVENT', slotId, candidateEmail, 'SUCCESS', 'Created event ID: ' + calendarEventId);
      }
    } catch (calErr) {
      logAction('CALENDAR_EVENT', slotId, candidateEmail, 'ERROR', 'Calendar event failed: ' + calErr.toString());
    }

    // 9. Email Confirmation
    let emailSent = false;
    try {
      sendBookingConfirmationEmail({
        candidateName: candidateName,
        candidateEmail: candidateEmail,
        dateStr: formattedDate,
        dayStr: dayName,
        startTimeStr: formattedStartTime,
        endTimeStr: formattedEndTime,
        timezone: settings['Time Zone'] || CONFIG.DEFAULT_TIMEZONE,
        meetingType: meetingType,
        meetLink: meetLink,
      });

      emailSent = true;
      slotsSheet.getRange(targetRowIndex, confSentIdx + 1).setValue('Yes');
      candidatesSheet.getRange(candidateRowIndex, 11).setValue('Yes');
      logAction('EMAIL_CONFIRMATION', slotId, candidateEmail, 'SUCCESS', 'Confirmation email sent.');
    } catch (mailErr) {
      logAction('EMAIL_CONFIRMATION', slotId, candidateEmail, 'ERROR', 'Email send failed: ' + mailErr.toString());
      slotsSheet.getRange(targetRowIndex, confSentIdx + 1).setValue('Failed');
      candidatesSheet.getRange(candidateRowIndex, 11).setValue('Failed');
    }

    SpreadsheetApp.flush();
    logAction('BOOK_SLOT', slotId, candidateEmail, 'SUCCESS', 'Slot booked for candidate ' + candidateId + ' (' + meetingTypeDisplay + ')');

    // 10. Return Confirmation Response
    return createJsonResponse({
      success: true,
      booking: {
        candidateId: candidateId,
        slotId: slotId,
        candidateName: candidateName,
        candidateEmail: candidateEmail,
        date: formattedDate,
        day: dayName,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        timezone: settings['Time Zone'] || CONFIG.DEFAULT_TIMEZONE,
        meetingType: meetingType,
        meetLink: meetingType === 'online' ? meetLink : undefined,
        calendarEventId: calendarEventId,
        confirmationSent: emailSent,
      },
    });

  } catch (err) {
    if (lockAcquired) {
      try { lock.releaseLock(); } catch (e) {}
    }
    logAction('BOOK_SLOT', 'UNKNOWN', 'UNKNOWN', 'ERROR', err.toString());
    return createJsonResponse({
      success: false,
      error: 'SERVER_ERROR',
      message: 'An unexpected error occurred while booking. Please try again: ' + err.message,
    });
  }
}

/**
 * Creates Google Calendar Event with attendees and format details.
 */
function createInterviewCalendarEvent(params) {
  const { candidateName, candidateEmail, dateStr, startTimeStr, endTimeStr, timezone, panelEmails, titlePrefix, meetingType } = params;
  
  const startDateTime = parseDateTimeInTimezone(dateStr, startTimeStr, timezone);
  const endDateTime = parseDateTimeInTimezone(dateStr, endTimeStr, timezone);

  const isInPerson = meetingType === 'in_person';
  const formatTag = isInPerson ? 'In-Person (Helsinki)' : 'Online';
  const eventTitle = titlePrefix + ' – ' + candidateName + ' (' + formatTag + ')';
  
  const location = isInPerson
    ? 'Helsinki, Finland (Exact venue to be intimated prior to meeting)'
    : 'Online (Google Meet)';

  const descriptionLines = [
    'Kieli Interview',
    '----------------------------------------',
    'Candidate: ' + candidateName,
    'Email: ' + candidateEmail,
    'Format: ' + formatTag,
    'Date: ' + dateStr,
    'Time: ' + startTimeStr + ' – ' + endTimeStr + ' (' + timezone + ')',
    'Duration: 45 minutes',
    'Location: ' + location,
    '',
  ];

  if (isInPerson) {
    descriptionLines.push('Note: This is an in-person meeting in Helsinki. Detailed location/venue directions will be sent to the candidate prior to the interview.');
  }

  const description = descriptionLines.join('\n');

  const guests = [candidateEmail];
  if (panelEmails) {
    const panels = panelEmails.split(',').map(e => e.trim()).filter(e => isValidEmail(e));
    guests.push(...panels);
  }

  let eventId = '';
  let meetLink = '';

  try {
    if (!isInPerson && typeof Calendar !== 'undefined' && Calendar.Events) {
      const eventResource = {
        summary: eventTitle,
        description: description,
        location: location,
        start: { dateTime: startDateTime.toISOString(), timeZone: timezone },
        end: { dateTime: endDateTime.toISOString(), timeZone: timezone },
        attendees: guests.map(email => ({ email: email })),
        conferenceData: {
          createRequest: {
            requestId: 'kieli-' + Date.now(),
            conferenceSolutionKey: { type: 'hangoutsMeet' },
          },
        },
      };

      const createdEvent = Calendar.Events.insert(eventResource, 'primary', { conferenceDataVersion: 1 });
      eventId = createdEvent.id;
      meetLink = (createdEvent.conferenceData && createdEvent.conferenceData.entryPoints && createdEvent.conferenceData.entryPoints[0])
        ? createdEvent.conferenceData.entryPoints[0].uri
        : (createdEvent.hangoutLink || '');
    }
  } catch (advancedErr) {
    Logger.log('Advanced Calendar API note: ' + advancedErr.message);
  }

  if (!eventId) {
    const calendar = CalendarApp.getDefaultCalendar();
    const event = calendar.createEvent(eventTitle, startDateTime, endDateTime, {
      description: description,
      location: location,
      guests: guests.join(','),
      sendInvites: true,
    });
    eventId = event.getId();
    meetLink = '';
  }

  return { eventId: eventId, meetLink: meetLink };
}

/**
 * Sends a branded booking confirmation email to the candidate.
 */
function sendBookingConfirmationEmail(params) {
  const { candidateName, candidateEmail, dateStr, dayStr, startTimeStr, endTimeStr, timezone, meetingType, meetLink } = params;

  const isInPerson = meetingType === 'in_person';
  const formatTag = isInPerson ? 'In-Person (Helsinki)' : 'Online';
  const subject = 'Kieli Interview Confirmation – ' + dateStr + ' at ' + startTimeStr + ' (' + formatTag + ')';

  const formatSectionHtml = isInPerson
    ? `<div style="margin: 24px 0; padding: 18px; background-color: #ecfdf5; border-radius: 14px; border: 1px solid #a7f3d0;">
         <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #065f46;">In-Person Meeting in Helsinki</p>
         <p style="margin: 0; font-size: 14px; color: #064e3b; line-height: 1.5;">
           We look forward to meeting you in person in Helsinki! The exact venue address and directions will be emailed to you prior to the interview date.
         </p>
       </div>`
    : (meetLink
        ? `<div style="margin: 24px 0; padding: 16px; background-color: #f0f4f7; border-radius: 12px; border: 1px solid #e2e8f0;">
             <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #395e9f;">Meeting Link</p>
             <a href="${meetLink}" style="display: inline-block; padding: 10px 20px; background-color: #395e9f; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">Join Google Meet</a>
             <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">Link: ${meetLink}</p>
           </div>`
        : `<div style="margin: 24px 0; padding: 16px; background-color: #f0f4f7; border-radius: 12px; border: 1px solid #e2e8f0;">
             <p style="margin: 0; font-size: 14px; color: #2c3437;">A calendar invitation with the online meeting link has been sent to your email.</p>
           </div>`);

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f7f9fb; color: #2c3437; margin: 0; padding: 24px; }
    .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 20px; border: 1px solid #e5e7eb; padding: 36px; box-shadow: 0 10px 30px -10px rgba(57, 94, 159, 0.08); }
    .logo-badge { display: inline-block; font-size: 22px; font-weight: 800; color: #395e9f; margin-bottom: 20px; }
    .title { font-size: 24px; font-weight: 700; color: #2c3437; margin: 0 0 12px 0; }
    .subtitle { font-size: 15px; color: #4b5563; line-height: 1.6; margin: 0 0 24px 0; }
    .details-box { background: #f7f9fb; border-radius: 14px; padding: 20px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #edf2f7; font-size: 14px; }
    .detail-row:last-child { border-bottom: none; }
    .label { color: #64748b; font-weight: 500; }
    .value { color: #1e293b; font-weight: 700; text-align: right; }
    .footer { margin-top: 32px; padding-top: 20px; border-top: 1px solid #edf2f7; font-size: 13px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo-badge">Kieli</div>
    <h1 class="title">Interview Confirmed</h1>
    <p class="subtitle">Hi ${escapeHtml(candidateName)},</p>
    <p class="subtitle">Thank you for scheduling your interview with Kieli. We are looking forward to speaking with you. Here are your confirmed interview details:</p>
    
    <div class="details-box">
      <div class="detail-row">
        <span class="label">Date:</span>
        <span class="value">${escapeHtml(dayStr)}, ${escapeHtml(dateStr)}</span>
      </div>
      <div class="detail-row">
        <span class="label">Time:</span>
        <span class="value">${escapeHtml(startTimeStr)} – ${escapeHtml(endTimeStr)}</span>
      </div>
      <div class="detail-row">
        <span class="label">Format:</span>
        <span class="value">${escapeHtml(formatTag)}</span>
      </div>
      <div class="detail-row">
        <span class="label">Timezone:</span>
        <span class="value">Finland local time (${escapeHtml(timezone)})</span>
      </div>
      <div class="detail-row">
        <span class="label">Duration:</span>
        <span class="value">45 minutes</span>
      </div>
    </div>

    ${formatSectionHtml}

    <p style="font-size: 14px; color: #4b5563; line-height: 1.6;">
      If you have any questions or need to reschedule, please reply directly to this email.
    </p>

    <div class="footer">
      <p style="margin: 0;">Kieli &bull; kieli.eu</p>
    </div>
  </div>
</body>
</html>`;

  MailApp.sendEmail({
    to: candidateEmail,
    subject: subject,
    htmlBody: htmlBody,
    name: 'Kieli Team',
  });
}

/**
 * One-Click Setup & Initializer for the Google Sheet.
 * Prepares all 18 slots across 6 interview dates in September 2026.
 */
function setupScheduler() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // 1. Setup Tab 1: Slots
  let slotsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.SLOTS);
  if (!slotsSheet) {
    slotsSheet = ss.insertSheet(CONFIG.SHEET_NAMES.SLOTS);
  }
  slotsSheet.clear();

  // Set all columns to Plain Text format to avoid unwanted timezone mutations
  slotsSheet.getRange('A1:L40').setNumberFormat('@');

  // Summary Metrics Section (Rows 1-2)
  slotsSheet.getRange('A1:E1').merge()
    .setValue('KIELI INTERVIEW SCHEDULER – OVERVIEW')
    .setFontWeight('bold')
    .setFontSize(11)
    .setBackground('#1e293b')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  slotsSheet.getRange('A2').setValue('Total Slots');
  slotsSheet.getRange('B2').setValue('Target Candidates');
  slotsSheet.getRange('C2').setValue('Booked');
  slotsSheet.getRange('D2').setValue('Available');
  slotsSheet.getRange('E2').setValue('Remaining Target');
  slotsSheet.getRange('A2:E2').setFontWeight('bold').setBackground('#f1f5f9');

  // Summary Formulas for 18 Slots (Rows 5 to 22)
  slotsSheet.getRange('A3').setValue('18');
  slotsSheet.getRange('B3').setValue('12');
  slotsSheet.getRange('C3').setFormula('=COUNTIF(F5:F22, "Booked")');
  slotsSheet.getRange('D3').setFormula('=COUNTIF(F5:F22, "Available")');
  slotsSheet.getRange('E3').setFormula('=B3-C3');
  slotsSheet.getRange('A3:E3').setFontWeight('bold').setFontSize(13).setHorizontalAlignment('center');

  // Slots Table Header (Row 4)
  const slotHeaders = [
    'slot_id', 'date', 'day', 'start_time', 'end_time', 'status',
    'candidate_name', 'candidate_email', 'candidate_phone',
    'booked_at', 'calendar_event_id', 'confirmation_sent'
  ];
  const slotHeaderRange = slotsSheet.getRange(4, 1, 1, slotHeaders.length);
  slotHeaderRange.setValues([slotHeaders])
    .setFontWeight('bold')
    .setBackground('#395e9f')
    .setFontColor('#ffffff')
    .setHorizontalAlignment('center');

  // 18 Predefined Slots for September 2026 (Including 17 Sept 2026)
  const initialSlots = [
    ['S001', '2026-09-01', 'Tuesday',  '17:00', '17:45', 'Available', '', '', '', '', '', ''],
    ['S002', '2026-09-01', 'Tuesday',  '18:00', '18:45', 'Available', '', '', '', '', '', ''],
    ['S003', '2026-09-01', 'Tuesday',  '19:00', '19:45', 'Available', '', '', '', '', '', ''],
    ['S004', '2026-09-03', 'Thursday', '17:00', '17:45', 'Available', '', '', '', '', '', ''],
    ['S005', '2026-09-03', 'Thursday', '18:00', '18:45', 'Available', '', '', '', '', '', ''],
    ['S006', '2026-09-03', 'Thursday', '19:00', '19:45', 'Available', '', '', '', '', '', ''],
    ['S007', '2026-09-08', 'Tuesday',  '17:00', '17:45', 'Available', '', '', '', '', '', ''],
    ['S008', '2026-09-08', 'Tuesday',  '18:00', '18:45', 'Available', '', '', '', '', '', ''],
    ['S009', '2026-09-08', 'Tuesday',  '19:00', '19:45', 'Available', '', '', '', '', '', ''],
    ['S010', '2026-09-10', 'Thursday', '17:00', '17:45', 'Available', '', '', '', '', '', ''],
    ['S011', '2026-09-10', 'Thursday', '18:00', '18:45', 'Available', '', '', '', '', '', ''],
    ['S012', '2026-09-10', 'Thursday', '19:00', '19:45', 'Available', '', '', '', '', '', ''],
    ['S013', '2026-09-15', 'Tuesday',  '17:00', '17:45', 'Available', '', '', '', '', '', ''],
    ['S014', '2026-09-15', 'Tuesday',  '18:00', '18:45', 'Available', '', '', '', '', '', ''],
    ['S015', '2026-09-15', 'Tuesday',  '19:00', '19:45', 'Available', '', '', '', '', '', ''],
    ['S016', '2026-09-17', 'Thursday', '17:00', '17:45', 'Available', '', '', '', '', '', ''],
    ['S017', '2026-09-17', 'Thursday', '18:00', '18:45', 'Available', '', '', '', '', '', ''],
    ['S018', '2026-09-17', 'Thursday', '19:00', '19:45', 'Available', '', '', '', '', '', ''],
  ];

  slotsSheet.getRange(5, 1, initialSlots.length, slotHeaders.length).setValues(initialSlots);

  // Apply Conditional Formatting for Status column (Column F: F5:F22)
  const statusRange = slotsSheet.getRange('F5:F22');
  const ruleAvailable = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Available')
    .setBackground('#d1fae5')
    .setFontColor('#065f46')
    .setRanges([statusRange])
    .build();

  const ruleBooked = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Booked')
    .setBackground('#dbeafe')
    .setFontColor('#1e40af')
    .setRanges([statusRange])
    .build();

  const ruleCancelled = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo('Cancelled')
    .setBackground('#fee2e2')
    .setFontColor('#991b1b')
    .setRanges([statusRange])
    .build();

  slotsSheet.setConditionalFormatRules([ruleAvailable, ruleBooked, ruleCancelled]);
  slotsSheet.autoResizeColumns(1, slotHeaders.length);

  // 2. Setup Tab 2: Candidates
  let candidatesSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.CANDIDATES);
  if (!candidatesSheet) {
    candidatesSheet = ss.insertSheet(CONFIG.SHEET_NAMES.CANDIDATES);
  }
  candidatesSheet.clear();
  candidatesSheet.getRange('A1:L100').setNumberFormat('@');
  const candidateHeaders = [
    'candidate_id', 'candidate_name', 'email', 'phone',
    'slot_id', 'interview_date', 'interview_time',
    'status', 'booked_at', 'calendar_event_id', 'confirmation_sent', 'meeting_format'
  ];
  candidatesSheet.getRange(1, 1, 1, candidateHeaders.length)
    .setValues([candidateHeaders])
    .setFontWeight('bold')
    .setBackground('#395e9f')
    .setFontColor('#ffffff');
  candidatesSheet.autoResizeColumns(1, candidateHeaders.length);

  // 3. Setup Tab 3: Settings
  let settingsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.SETTINGS);
  if (!settingsSheet) {
    settingsSheet = ss.insertSheet(CONFIG.SHEET_NAMES.SETTINGS);
  }
  settingsSheet.clear();
  settingsSheet.getRange('A1:B20').setNumberFormat('@');
  settingsSheet.getRange(1, 1, 1, 2)
    .setValues([['Setting', 'Value']])
    .setFontWeight('bold')
    .setBackground('#395e9f')
    .setFontColor('#ffffff');

  const defaultSettings = [
    ['Interview Title', 'Kieli Interview'],
    ['Interview Duration', '45'],
    ['Time Zone', 'Europe/Helsinki'],
    ['Interview Location', 'Helsinki / Online'],
    ['Meeting Platform', 'In-Person (Preferred) / Google Meet'],
    ['Maximum Candidates', '12'],
    ['Scheduler Status', 'Open'],
    ['Panel Emails', ''],
  ];
  settingsSheet.getRange(2, 1, defaultSettings.length, 2).setValues(defaultSettings);
  settingsSheet.autoResizeColumns(1, 2);

  // 4. Setup Tab 4: Log
  let logSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.LOG);
  if (!logSheet) {
    logSheet = ss.insertSheet(CONFIG.SHEET_NAMES.LOG);
  }
  logSheet.clear();
  logSheet.getRange('A1:F500').setNumberFormat('@');
  const logHeaders = ['timestamp', 'action', 'slot_id', 'candidate_email', 'result', 'message'];
  logSheet.getRange(1, 1, 1, logHeaders.length)
    .setValues([logHeaders])
    .setFontWeight('bold')
    .setBackground('#395e9f')
    .setFontColor('#ffffff');
  logSheet.autoResizeColumns(1, logHeaders.length);

  logSheet.appendRow([new Date().toISOString(), 'SETUP', 'ALL', 'SYSTEM', 'SUCCESS', 'Scheduler sheets initialized successfully with 18 slots.']);

  SpreadsheetApp.flush();
  Logger.log('Kieli Interview Scheduler setup complete (18 slots)!');
}

// ----------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------

function getSettingsMap(ss) {
  const settingsSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.SETTINGS);
  const map = {};
  if (!settingsSheet) return map;
  const data = settingsSheet.getDataRange().getDisplayValues();
  for (let i = 1; i < data.length; i++) {
    const key = String(data[i][0] || '').trim();
    const val = String(data[i][1] || '').trim();
    if (key) map[key] = val;
  }
  return map;
}

function sanitizeSettings(settings) {
  return {
    interviewTitle: settings['Interview Title'] || 'Kieli Interview',
    durationMinutes: parseInt(settings['Interview Duration'] || '45', 10),
    timezone: settings['Time Zone'] || CONFIG.DEFAULT_TIMEZONE,
    location: settings['Interview Location'] || 'Helsinki / Online',
    platform: settings['Meeting Platform'] || 'In-Person / Google Meet',
    status: settings['Scheduler Status'] || 'Open',
  };
}

function logAction(action, slotId, candidateEmail, result, message) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const logSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.LOG);
    if (logSheet) {
      logSheet.appendRow([
        new Date().toISOString(),
        action,
        slotId,
        candidateEmail,
        result,
        message,
      ]);
    }
  } catch (e) {
    Logger.log('Log write failed: ' + e.message);
  }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim());
}

function parseDateTimeInTimezone(dateStr, timeStr, tz) {
  const fullStr = dateStr + 'T' + timeStr + ':00';
  return Utilities.parseDate(fullStr, tz, "yyyy-MM-dd'T'HH:mm:ss");
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
