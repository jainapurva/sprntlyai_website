# Setting up email capture — easiest possible (3 minutes, no code)

If the Google Sheets setup feels like too many steps, **use Formspree instead**. It's simpler.

## What is Formspree?

Formspree is a service that turns any HTML form into an email-collecting backend. You sign up, get an ID, paste the ID into your site, done. Submissions get emailed to you and stored in a dashboard.

**Free tier**: 50 submissions/month. Perfect for the waitlist phase.

## Setup (3 minutes total)

### Step 1 — Sign up

1. Go to [formspree.io](https://formspree.io)
2. Click **Sign up** (use Google or email — whichever)
3. Verify your email

### Step 2 — Create a form

1. In the Formspree dashboard, click **+ New Form**
2. Name it: `Sprntly waitlist`
3. Email to send notifications to: your email
4. Click **Create form**
5. You'll see a Form ID like `xpwzgkeq` (8 chars, looks random)

### Step 3 — Paste the ID into your site

Open `script.js`. Near the top you'll see:

```javascript
const EMAIL_PROVIDER = 'none';
const FORMSPREE_ID = 'YOUR_FORMSPREE_ID_HERE';
```

Change to:

```javascript
const EMAIL_PROVIDER = 'formspree';
const FORMSPREE_ID = 'xpwzgkeq'; // ← your ID from Step 2
```

Save. Reload your site. That's it.

### Step 4 — Test

1. Submit your own email through the form
2. Check Formspree dashboard — submission shows up
3. Check your email inbox — you also get an email notification

## Done.

You'll get:
- Email notifications for every signup
- A dashboard with all signups
- Export to CSV anytime
- Spam protection built in

When you're past 50/month or want email automation, migrate to Loops.so.
