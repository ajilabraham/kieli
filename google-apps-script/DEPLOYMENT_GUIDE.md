# Kieli Interview Scheduler – Deployment & Admin Guide

This guide explains how to set up the Google Sheet, deploy the Google Apps Script backend API, and configure the interview scheduler for `kieli.eu/interview`.

---

## 1. Create the Google Sheet in Google Drive

1. Go to [Google Drive](https://drive.google.com).
2. Click **+ New** > **Google Sheets** > **Blank spreadsheet**.
3. Name the spreadsheet:
   ```
   Kieli Interview Scheduler – September 2026
   ```

---

## 2. Add Google Apps Script Code

1. In the Google Sheet menu, click **Extensions** > **Apps Script**.
2. Rename the Apps Script project (top left) to:
   ```
   Kieli Scheduler API
   ```
3. In the script editor, open `Code.gs` and replace all default code with the contents of `google-apps-script/Code.gs`.
4. (Optional for Google Meet auto-links): On the left sidebar in Apps Script, click **Services (+)** > select **Google Calendar API** (`v3`) > click **Add**.

---

## 3. Run One-Click Automatic Sheet Setup

1. In the Apps Script toolbar dropdown (next to "Debug"), select **`setupScheduler`**.
2. Click **Run**.
3. When prompted, click **Review Permissions**, choose your Google account, click **Advanced**, and click **Go to Kieli Scheduler API (unsafe)** > **Allow**.
4. The script will automatically format and generate all 4 tabs in your Google Sheet:
   - **`Slots`**: Prepopulated with all 15 interview slots (S001 to S015) for September 1, 3, 8, 10, and 15, 2026, including conditional formatting and real-time summary metrics.
   - **`Candidates`**: Pre-configured headers for candidate records (C001, C002...).
   - **`Settings`**: Pre-configured settings (Timezone: `Europe/Helsinki`, Duration: `45`, Status: `Open`, Max Candidates: `12`, Panel Emails).
   - **`Log`**: Initialized audit log.

---

## 4. Configure Interview Panel Emails (Optional)

1. In your Google Sheet, switch to the **`Settings`** tab.
2. Under the `Panel Emails` row (column B), enter any comma-separated panel member email addresses (e.g. `interviewer1@kieli.eu, interviewer2@kieli.eu`).
   - When a candidate books, calendar invites will automatically be sent to both the candidate and these panel addresses.

---

## 5. Deploy as a Web App (Backend API)

1. In the Apps Script editor, click the blue **Deploy** button (top right) > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set the deployment fields:
   - **Description**: `Kieli Interview Scheduler API v1`
   - **Execute as**: `Me (your-email@kieli.eu)`
   - **Who has access**: `Anyone` *(Critical: allows candidates to fetch availability and submit their booking)*
4. Click **Deploy**.
5. Copy the **Web App URL** (it looks like: `https://script.google.com/macros/s/AKfycbx.../exec`).

---

## 6. Connect to Kieli Website

Add the Web App URL to your website environment configuration:

In your local `.env` or production deployment environment:
```env
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```

---

## 7. How to Operate & Administer

- **Source of Truth**: The `Slots` tab is the source of truth.
- **Summary Metrics**:
  - `Total Slots`: 15
  - `Target Candidates`: 12
  - `Booked`: Real-time count of booked candidates
  - `Available`: Real-time count of remaining open slots
  - `Remaining Target`: Remaining spots until 12 candidates are reached
- **Cancelling / Re-opening a Slot**:
  - To cancel a booking and reopen a slot: change column `status` (Column F) in the `Slots` tab back to `Available`, and clear candidate name/email. The slot will instantly reappear as available on the website!
- **Closing the Scheduler**:
  - In the `Settings` tab, change `Scheduler Status` to `Closed`. The website will immediately show that scheduling is closed.
