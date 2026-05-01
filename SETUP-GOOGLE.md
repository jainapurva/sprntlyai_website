# Setting up Google Sheets email capture (5 minutes, free, no code)

This connects your landing-page email form to a Google Sheet so every submission gets logged automatically.

## Step 1 — Create a Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **+ Blank**
3. In **A1, B1, C1**, type these column headers:
   - A1: `Timestamp`
   - B1: `Email`
   - C1: `Source`
4. Rename the sheet (top-left) to "Sprntly waitlist"

## Step 2 — Open Apps Script

1. Inside your sheet, click **Extensions → Apps Script**
2. A new tab opens with a code editor
3. Delete whatever code is in there

## Step 3 — Paste this script

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      data.ts || new Date().toISOString(),
      data.email,
      data.source || 'unknown'
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click the floppy-disk **Save** icon (or Cmd+S)
5. Name the project anything — e.g. "Sprntly waitlist capture"

## Step 4 — Deploy as a Web App

1. Click **Deploy → New deployment** (top-right blue button)
2. Click the gear icon ⚙️ next to "Select type" → choose **Web app**
3. Fill in:
   - Description: `Sprntly waitlist`
   - Execute as: **Me**
   - Who has access: **Anyone** ← this is critical — must say "Anyone" not "Anyone with Google account"
4. Click **Deploy**
5. Google will ask for permissions. Click **Authorize access** → choose your account → click **Advanced** → click **Go to [project name] (unsafe)** → click **Allow**
   (This warning is normal — it's your own script, not actually unsafe.)
6. Copy the **Web app URL** that appears. It looks like:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

## Step 5 — Paste the URL into your site

Open `script.js` in your sprntly-site folder. Find these two lines near the top:

```javascript
const EMAIL_PROVIDER = 'none';
const GOOGLE_SHEETS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```

Change them to:

```javascript
const EMAIL_PROVIDER = 'google';
const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycb.../exec'; // ← your URL from Step 4
```

Save the file. Refresh your site. Submit a test email.

## Verifying it works

1. Open your site
2. Type an email and hit submit
3. Open the Google Sheet — within 1-2 seconds a new row should appear with timestamp, email, source

## Troubleshooting

**No row appears in the sheet?**
- Open browser DevTools → Console. Look for `[Sprntly waitlist]` log entries.
- If you see "backend error" with a CORS message, your deployment access is wrong. Re-deploy and make sure "Who has access" is set to **Anyone**.
- If you see no error but the sheet stays empty, your Apps Script needs to be re-deployed after editing. Each time you change the script, click Deploy → Manage deployments → pencil icon → Version: New version → Deploy.

**The Apps Script editor says "Authorization required"?**
- Run the `doPost` function manually once: select `doPost` from the dropdown above the code, click ▶ Run, accept the auth prompts.

**Can other people see my Google Sheet?**
- No. The sheet is private to you. The Apps Script has permission to write to it, but the URL itself doesn't expose the data.

## Limits

- Google Apps Script: 20K writes/day on free tier (more than enough for a waitlist)
- Google Sheets: 10M cells per sheet — basically unlimited for emails

## When to upgrade

Once you have ~500+ signups and want to:
- Send a welcome email automatically
- Tag and segment subscribers
- Send broadcast emails when you launch

→ Migrate to **Loops.so** (export your sheet to CSV, import to Loops, switch `EMAIL_PROVIDER` to `'loops'`).

## Why not Loops from day one?

You can! Loops is great. But Google Sheets is:
- Free forever, regardless of volume
- Already familiar to you
- Easy to share with co-founders
- Easy to export

Use it for the waitlist phase. Migrate when you actually need email automation.
