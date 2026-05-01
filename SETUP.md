# Sprntly landing page

Single-page marketing site, three files: `index.html`, `style.css`, `script.js`.

## Run locally

Just open `index.html` in a browser. No build step.

For a local dev server (recommended for testing):
```bash
cd sprntly-site
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Drop the three files on Vercel, Netlify, Cloudflare Pages, or any static host. No build config needed.

---

## Email capture — Google Sheets backend (already wired up)

Your form is connected to:
```
https://script.google.com/macros/s/AKfycby2oADTTVWCKtTh9vimTfNPPcKBjlm_df9Lc6AvvsSO8HEbpHksDU1KjULZGsvj8TQO/exec
```

When someone submits an email, it sends a POST request to this URL, which is your Google Apps Script Web App. The script appends a new row to your Google Sheet.

### Apps Script code (paste into your Apps Script project)

If you haven't yet, here's the exact code to paste into Extensions → Apps Script:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse the incoming JSON
    const data = JSON.parse(e.postData.contents);

    // Append a row: timestamp, email, source, userAgent, referrer
    sheet.appendRow([
      new Date(),
      data.email || '',
      data.source || 'unknown',
      data.userAgent || '',
      data.referrer || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput('Sprntly waitlist endpoint is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}
```

### Recommended Google Sheet column headers

Add these headers in row 1 of your sheet:

| A | B | C | D | E |
|---|---|---|---|---|
| Timestamp | Email | Source | User Agent | Referrer |

The Apps Script appends data in this order automatically.

### Testing

To test that everything works:
1. Open your deployed landing page
2. Submit an email in either the hero or footer form
3. Check your Google Sheet — a new row should appear within a few seconds

### About `no-cors` mode

The fetch in `script.js` uses `mode: 'no-cors'`. This means:
- ✅ The data still gets sent to your Google Sheet
- ✅ Emails get captured
- ❌ The browser can't read the response (no error confirmation)
- ✅ The popup still shows the user "Thank you" because we assume success

This is the right tradeoff for a Google Apps Script endpoint. For waitlist capture during pre-launch, `no-cors` to Apps Script is perfectly fine.

---

## Files

- `index.html` — page structure
- `style.css` — all styles, responsive breakpoints at 480, 720, 880, 980, 1080px
- `script.js` — tabs, hero demo, briefing animation, on-call/on-demand, email capture
- `SETUP.md` — this file
