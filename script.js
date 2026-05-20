// ============================================
// SPRNTLY — Interactive script
// ============================================

const wait = ms => new Promise(r => setTimeout(r, ms));

// ──────── FAQ ────────
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// ──────── EMAIL CAPTURE ────────
//
// CHOOSE ONE PROVIDER BELOW. Set EMAIL_PROVIDER to one of:
//   'formspree' — easiest. Free 50/month. Sign up at formspree.io.
//   'google'    — free, unlimited, but requires Apps Script setup.
//   'loops'     — best for waitlists w/ automation. Free up to 1K. loops.so.
//   'none'      — no backend. Just shows the thank-you popup. Useful for testing.
//
// Whatever you pick, fill in the matching credential below.

const EMAIL_PROVIDER = 'none'; // ← change this to 'formspree' / 'google' / 'loops' when ready

// FORMSPREE — paste your form ID (looks like 'xpwzgkeq'). From formspree.io dashboard.
const FORMSPREE_ID = 'YOUR_FORMSPREE_ID_HERE';

// GOOGLE APPS SCRIPT — paste the deployed Web App URL.
const GOOGLE_SHEETS_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

// LOOPS — paste your form endpoint URL from loops.so dashboard.
const LOOPS_FORM_URL = 'YOUR_LOOPS_FORM_URL_HERE';

const emailPopup = document.getElementById('emailPopup');

function showEmailPopup() {
  if (!emailPopup) return;
  emailPopup.classList.add('show');
  setTimeout(() => emailPopup.classList.remove('show'), 5000);
}

async function captureEmail(payload, source) {
  // Normalize: handler may pass either an email string (legacy) or a full payload object
  const data = typeof payload === 'string' ? { email: payload } : { ...payload };
  const email = data.email;

  // Always log locally so you see something even if the backend fails
  console.log('[Sprntly waitlist]', { ...data, source, ts: new Date().toISOString() });

  try {
    if (EMAIL_PROVIDER === 'formspree') {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...data, source })
      });
      if (!res.ok) throw new Error(`Formspree ${res.status}`);
      return { ok: true };
    }

    if (EMAIL_PROVIDER === 'google') {
      // Apps Script + no-cors — request goes through but we can't read the response
      await fetch(GOOGLE_SHEETS_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify({ ...data, source, ts: new Date().toISOString() })
      });
      return { ok: true };
    }

    if (EMAIL_PROVIDER === 'loops') {
      const formData = new FormData();
      formData.append('email', email);
      if (data.firstName) formData.append('firstName', data.firstName);
      if (data.lastName) formData.append('lastName', data.lastName);
      if (data.company) formData.append('company', data.company);
      formData.append('source', source);
      const res = await fetch(LOOPS_FORM_URL, { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`Loops ${res.status}`);
      return { ok: true };
    }

    // EMAIL_PROVIDER === 'none' — just succeed silently
    return { ok: true, note: 'no backend configured' };
  } catch (err) {
    // Don't surface this to the user — the popup still shows; we just log it
    console.warn('[Sprntly waitlist] backend error (falling back to local log):', err.message);
    return { ok: false, error: err.message };
  }
}

// Wire up all .email-capture forms
document.querySelectorAll('.email-capture').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    if (!emailInput || !emailInput.value) return;

    const getVal = (name) => {
      const el = form.querySelector(`input[name="${name}"]`);
      return el ? el.value.trim() : '';
    };

    const payload = {
      email: emailInput.value.trim(),
      firstName: getVal('firstName'),
      lastName: getVal('lastName'),
      company: getVal('company')
    };
    // Required fields: email always; firstName/lastName when present on the form
    const firstNameEl = form.querySelector('input[name="firstName"]');
    const lastNameEl = form.querySelector('input[name="lastName"]');
    if ((firstNameEl && !payload.firstName) || (lastNameEl && !payload.lastName)) {
      (firstNameEl && !payload.firstName ? firstNameEl : lastNameEl).focus();
      return;
    }

    const source = form.id || 'unknown';
    const originalLabel = button ? button.textContent : '';

    if (button) {
      button.disabled = true;
      button.style.opacity = '0.7';
      button.textContent = 'Sending...';
    }

    await captureEmail(payload, source);

    form.querySelectorAll('input').forEach(i => { i.value = ''; });
    if (button) {
      button.disabled = false;
      button.style.opacity = '';
      button.textContent = originalLabel || "I'm interested →";
    }
    showEmailPopup();
  });
});

// ──────── HERO DEMO ────────
const demoBody = document.getElementById('demoBody');
const demoInput = document.getElementById('demoInput');
const demoInputText = document.getElementById('demoInputText');
const demoSend = document.getElementById('demoSend');

function append(html) {
  const wrap = document.createElement('div');
  wrap.innerHTML = html;
  const el = wrap.firstElementChild;
  demoBody.appendChild(el);
  setTimeout(() => {
    el.classList.add('in');
    demoBody.scrollTop = demoBody.scrollHeight;
  }, 50);
  return el;
}

async function typeIntoInput(text) {
  demoInput.classList.add('typing');
  demoInputText.classList.remove('empty');
  demoInputText.innerHTML = '<span class="cursor"></span>';
  for (let i = 0; i < text.length; i++) {
    demoInputText.innerHTML = text.slice(0, i + 1) + '<span class="cursor"></span>';
    demoBody.scrollTop = demoBody.scrollHeight;
    await wait(35 + Math.random() * 50);
  }
  await wait(400);
}

async function sendTypedMessage(text) {
  demoSend.classList.add('pressed');
  await wait(180);
  demoSend.classList.remove('pressed');
  demoInputText.innerHTML = '';
  demoInputText.classList.add('empty');
  demoInputText.textContent = 'Ask anything about your product...';
  demoInput.classList.remove('typing');
  append(`
    <div class="msg user-msg">
      <div class="msg-avatar user">K</div>
      <div class="msg-content">
        <div class="msg-author">You</div>
        <div class="msg-text">${text}</div>
      </div>
    </div>
  `);
  await wait(500);
}

function aiThinking(text) {
  return append(`
    <div class="msg ai-msg">
      <div class="msg-avatar ai">S</div>
      <div class="msg-content">
        <div class="msg-author">Sprntly</div>
        <div class="thinking-line"><div class="spinner"></div>${text}</div>
      </div>
    </div>
  `);
}

function aiMsg(content) {
  return append(`
    <div class="msg ai-msg">
      <div class="msg-avatar ai">S</div>
      <div class="msg-content">
        <div class="msg-author">Sprntly</div>
        ${content}
      </div>
    </div>
  `);
}

// Types the leading text into an AI message char-by-char, then reveals the rest
async function aiMsgTyped(leadingText, restHtml = '') {
  const msgEl = append(`
    <div class="msg ai-msg">
      <div class="msg-avatar ai">S</div>
      <div class="msg-content">
        <div class="msg-author">Sprntly</div>
        <div class="msg-text" data-typed=""></div>
      </div>
    </div>
  `);
  const textEl = msgEl.querySelector('.msg-text');
  // Type the leading text
  for (let i = 0; i < leadingText.length; i++) {
    textEl.innerHTML = leadingText.slice(0, i + 1) + '<span class="msg-typing-cursor"></span>';
    if (demoBody) demoBody.scrollTop = demoBody.scrollHeight;
    await wait(14 + Math.random() * 22);
  }
  textEl.innerHTML = leadingText;
  // Then reveal the rest
  if (restHtml) {
    await wait(300);
    const restWrap = document.createElement('div');
    restWrap.innerHTML = restHtml;
    while (restWrap.firstChild) {
      msgEl.querySelector('.msg-content').appendChild(restWrap.firstChild);
    }
    if (demoBody) demoBody.scrollTop = demoBody.scrollHeight;
  }
  return msgEl;
}

async function typeIntroQuestion(text) {
  const introText = document.getElementById('demoIntroText');
  if (!introText) return;
  introText.classList.add('has-text');
  introText.innerHTML = '<span class="cursor"></span>';
  for (let i = 0; i < text.length; i++) {
    introText.innerHTML = text.slice(0, i + 1) + '<span class="cursor"></span>';
    await wait(40 + Math.random() * 40);
  }
  await wait(400);
}

async function runHeroDemo() {
  const intro = document.getElementById('demoIntro');
  const introSend = document.getElementById('demoIntroSend');

  // Start: type the question into the centered intro box
  await wait(1000);
  await typeIntroQuestion("What are the ways I can drive retention?");

  // Press send button on intro
  if (introSend) {
    introSend.classList.add('pressed');
    await wait(200);
    introSend.classList.remove('pressed');
  }

  // Hide intro overlay (slides up out of the way)
  if (intro) intro.classList.add('hidden');
  await wait(450);

  // Now show the user's message in the chat body
  append(`
    <div class="msg user-msg">
      <div class="msg-avatar user">K</div>
      <div class="msg-content">
        <div class="msg-author">You</div>
        <div class="msg-text">What are the ways I can drive retention?</div>
      </div>
    </div>
  `);

  await wait(800);
  const t1 = aiThinking('Pulling 90 days of cohort data...');
  await wait(1800);
  t1.querySelector('.thinking-line').innerHTML = '<div class="spinner"></div>Cross-referencing with sales calls and feature usage...';
  await wait(2000);
  t1.querySelector('.thinking-line').innerHTML = '<div class="spinner"></div>Found a strong pattern.';
  await wait(1300);
  t1.remove();

  await aiMsgTyped(
    "Looked at your last 90 days. The single biggest driver of retention is Workflows. Users who discover it in week one retain 4.2× longer than users who don't.",
    `<div class="ai-card">
      <div class="ai-card-eyebrow">Cohort retention by feature usage</div>
      <div class="ai-card-title">Workflows users retain 4.2× longer.</div>
      <div class="ai-card-body">Users who use Workflows in week 1 are still active at week 12. Users who don't churn fast.</div>
      <div class="mini-chart">
        <div class="mini-chart-label">30-day retention</div>
        <div class="bar-row" id="bars1">
          <div class="bar highlighted" style="height: 88%"></div>
          <div class="bar muted" style="height: 21%"></div>
        </div>
        <div class="bar-labels"><span>With Workflows</span><span>Without</span></div>
      </div>
      <div class="evi-row">
        <span class="evi-pill">Amplitude · <span class="v">4.2× retention</span></span>
        <span class="evi-pill">Mixpanel · <span class="v">11% discovery</span></span>
      </div>
    </div>`
  );
  await wait(200);
  document.querySelectorAll('#bars1 .bar').forEach((b, i) => {
    setTimeout(() => b.classList.add('in'), i * 200);
  });
  await wait(2200);

  await aiMsgTyped(
    "Here's the catch — only 11% of users discover Workflows in their first 30 days. The feature works. Discoverability is the bottleneck."
  );

  await wait(2800);
  await typeIntoInput("Why is discoverability so low?");
  await sendTypedMessage("Why is discoverability so low?");

  await wait(400);
  const t2 = aiThinking('Pulling product navigation analytics...');
  await wait(1500);
  t2.querySelector('.thinking-line').innerHTML = '<div class="spinner"></div>Analyzing UI surface area...';
  await wait(1200);
  t2.remove();

  await aiMsgTyped(
    "Workflows is three levels deep in the sidebar. The dashboard empty-state pushes users to \"Create campaign\" instead. Look:",
    `<div class="app-mockup">
      <div class="app-mockup-header">
        <div class="app-dot"></div><div class="app-dot"></div><div class="app-dot"></div>
        <span style="margin-left:8px">app.youbrand.com/dashboard</span>
      </div>
      <div class="app-mockup-body">
        <div class="app-sidebar">
          <div class="app-nav-item active"><span class="nav-dot"></span>Dashboard</div>
          <div class="app-nav-item"><span class="nav-dot"></span>Campaigns</div>
          <div class="app-nav-item"><span class="nav-dot"></span>Reports</div>
          <div class="app-nav-item"><span class="nav-dot"></span>Settings</div>
          <div class="app-nav-item buried"><span class="nav-dot"></span>Workflows</div>
        </div>
        <div class="app-main">
          <div class="app-main-title">Welcome back 👋</div>
          <div class="app-empty-state">
            <div class="es-text">No campaigns yet. Create your first one.</div>
            <span class="es-btn">+ Create campaign</span>
          </div>
        </div>
      </div>
    </div>
    <div class="buried-callout">Workflows is buried — only 11% find it</div>
    <div class="msg-text" style="margin-top:12px;">
      The fix: <strong>surface Workflows in the dashboard empty-state.</strong> Linear, Notion, and Stripe used the same pattern — recovered <strong>47–61% of activation drop</strong>. Want me to generate a PRD?
    </div>`
  );

  await wait(3500);
  await typeIntoInput("Yeah, generate the PRD.");
  await sendTypedMessage("Yeah, generate the PRD.");

  await wait(400);
  const t3 = aiThinking('Drafting PRD with full context...');
  await wait(1400);
  t3.querySelector('.thinking-line').innerHTML = '<div class="spinner"></div>Adding acceptance criteria and test plan...';
  await wait(1300);
  t3.remove();

  aiMsg(`
    <div class="msg-text">Done. Here's the PRD:</div>
    <div class="full-prd">
      <div class="full-prd-header">
        <div class="full-prd-title-wrap">
          <div class="full-prd-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div class="full-prd-title">Workflows discoverability — PRD</div>
        </div>
        <div class="full-prd-meta">v1 · Auto</div>
      </div>
      <div class="full-prd-body" id="prdBody">
        <div class="prd-block">
          <div class="prd-block-label">Context</div>
          <div class="prd-block-content">Workflows users retain 4.2× longer. Only 11% discover it in 30 days.</div>
        </div>
        <div class="prd-block">
          <div class="prd-block-label">Problem</div>
          <div class="prd-block-content">Workflows buried 3 levels deep. Empty-state pushes "Create campaign" instead.</div>
        </div>
        <div class="prd-block">
          <div class="prd-block-label">Solution</div>
          <div class="prd-block-content">
            <ul>
              <li>Surface Workflows in dashboard empty-state</li>
              <li>Post-publish nudge: "Try Workflows"</li>
              <li>Promote Workflows to top-level sidebar</li>
            </ul>
          </div>
        </div>
        <div class="prd-block">
          <div class="prd-block-label">Acceptance criteria</div>
          <div class="prd-block-content">
            <ul>
              <li>Visible in empty-state on first login</li>
              <li>Post-publish modal triggers within 30s</li>
              <li>Sidebar accessible in ≤1 click</li>
            </ul>
          </div>
        </div>
        <div class="prd-block">
          <div class="prd-block-label">Test plan</div>
          <div class="prd-block-content"><strong>Success:</strong> +15pt discoverability, +8pt retention. <strong>Stop:</strong> &gt;-5pt retention drop.</div>
        </div>
      </div>
      <div class="full-prd-actions">
        <button class="prd-act-btn primary" id="sendToClaude">Send to Claude Code →</button>
        <button class="prd-act-btn">Edit</button>
      </div>
    </div>
  `);

  const prdBody = document.getElementById('prdBody');
  if (prdBody) {
    await wait(2500);
    const scrollHeight = prdBody.scrollHeight;
    const duration = 4000;
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = t * t * (3 - 2 * t);
      prdBody.scrollTop = scrollHeight * eased;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  await wait(5000);
  const sendBtn = document.getElementById('sendToClaude');
  if (sendBtn) {
    sendBtn.classList.add('active');
    sendBtn.style.transform = 'scale(0.97)';
    await wait(220);
    sendBtn.style.transform = '';
  }

  await wait(400);
  const sendPanel = document.getElementById('sendPanel');
  if (sendPanel) sendPanel.classList.add('show');

  await wait(5500);
  const confirmBtn = document.getElementById('sendPanelConfirm');
  if (confirmBtn) {
    confirmBtn.style.transform = 'scale(0.97)';
    await wait(220);
    confirmBtn.style.transform = '';
    confirmBtn.classList.add('confirmed');
    confirmBtn.innerHTML = '✓ Sent';
  }

  await wait(2500);
  if (sendPanel) sendPanel.classList.remove('show');
  await wait(600);
  if (confirmBtn) {
    confirmBtn.classList.remove('confirmed');
    confirmBtn.innerHTML = 'Confirm';
  }

  // Build phase
  await wait(800);
  const t4 = aiThinking('Claude Code is shipping the change...');
  await wait(2200);
  t4.querySelector('.thinking-line').innerHTML = '<div class="spinner"></div>4 files modified, tests passing...';
  await wait(1800);
  t4.querySelector('.thinking-line').innerHTML = '<div class="spinner"></div>PR opened, deploy queued...';
  await wait(1500);
  t4.remove();

  await aiMsgTyped(
    "Workflows discoverability shipped to production. A/B test running at 5% traffic.",
    `<div class="ai-card">
      <div class="ai-card-eyebrow">Experiment · Live</div>
      <div class="ai-card-title">A/B test running at 5% traffic</div>
      <div class="ai-card-body">Treatment 80%, control 20%, ramping to 50% if metrics hold.</div>
      <div class="evi-row">
        <span class="evi-pill">Branch · <span class="v">workflows-discoverability</span></span>
        <span class="evi-pill">Traffic · <span class="v">5%</span></span>
      </div>
    </div>`
  );

  await wait(3500);
  const t5 = aiThinking('7 days later — measuring results...');
  await wait(2500);
  t5.remove();

  await aiMsgTyped(
    "Results are in. The metric moved. Ramping to 100%.",
    `<div class="ai-card">
      <div class="ai-card-eyebrow">Live results · Day 7</div>
      <div class="ai-card-title">+14.2% retention lift in treatment.</div>
      <div class="ai-card-body">
        Workflows discovery up from <strong>11% to 47%</strong>. 30-day retention <strong>+14.2pt</strong>. Confidence 96.
      </div>
      <div class="mini-chart">
        <div class="mini-chart-label">Discovery rate · before vs after</div>
        <div class="bar-row" id="bars2">
          <div class="bar muted" style="height: 22%"></div>
          <div class="bar highlighted" style="height: 92%"></div>
        </div>
        <div class="bar-labels"><span>Before · 11%</span><span>After · 47%</span></div>
      </div>
    </div>`
  );

  await wait(200);
  document.querySelectorAll('#bars2 .bar').forEach((b, i) => {
    setTimeout(() => b.classList.add('in'), i * 220);
  });

  await wait(5000);
  demoBody.innerHTML = '';
  // Reset intro overlay for the next loop
  const introReset = document.getElementById('demoIntro');
  const introTextReset = document.getElementById('demoIntroText');
  if (introReset) introReset.classList.remove('hidden');
  if (introTextReset) {
    introTextReset.classList.remove('has-text');
    introTextReset.textContent = 'Ask anything about your product...';
  }
  runHeroDemo();
}

// Send panel close button
const sendPanelClose = document.getElementById('sendPanelClose');
if (sendPanelClose) {
  sendPanelClose.addEventListener('click', () => {
    document.getElementById('sendPanel').classList.remove('show');
  });
}

// Start hero demo on intersection
const heroObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    heroObs.disconnect();
    runHeroDemo();
  }
}, { threshold: 0.2 });
if (demoBody) heroObs.observe(demoBody);

// ──────── AGENT TABS ────────
const tabs = document.querySelectorAll('.agent-tab');
const panels = document.querySelectorAll('.agent-panel');

if (tabs.length && panels.length) {
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      tabs.forEach(t => {
        t.classList.toggle('active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      panels.forEach(p => {
        p.classList.toggle('active', p.getAttribute('data-panel') === target);
      });
    });
  });
}

// ──────── BRIEFING DEMO ────────
async function runBriefingDemo() {
  const slackWindow = document.getElementById('briefingSlack');
  const loadingScreen = document.getElementById('briefingLoading');
  const sprntlyApp = document.getElementById('briefingApp');
  const cursor = document.getElementById('briefingCursor');
  const mp1 = document.getElementById('bpri1');
  const stage = document.querySelector('.briefing-mockup-frame');

  if (!slackWindow || !sprntlyApp || !cursor || !mp1 || !stage) return;

  while (true) {
    slackWindow.classList.remove('fading');
    if (loadingScreen) loadingScreen.classList.remove('show');
    sprntlyApp.classList.remove('show');
    cursor.classList.remove('show', 'clicking');
    cursor.style.left = '85%';
    cursor.style.top = '110%';
    mp1.classList.remove('opening');

    await wait(2200);

    const stageRect = stage.getBoundingClientRect();
    const targetRect = mp1.getBoundingClientRect();
    const targetX = targetRect.left - stageRect.left + targetRect.width * 0.55;
    const targetY = targetRect.top - stageRect.top + targetRect.height * 0.5;

    cursor.classList.add('show');
    await wait(300);

    cursor.style.left = (targetX) + 'px';
    cursor.style.top = (targetY) + 'px';
    await wait(1200);

    cursor.classList.add('clicking');
    mp1.classList.add('opening');
    await wait(220);
    cursor.classList.remove('clicking');
    await wait(220);

    slackWindow.classList.add('fading');
    cursor.classList.remove('show');
    await wait(450);

    if (loadingScreen) loadingScreen.classList.add('show');
    await wait(1100);

    if (loadingScreen) loadingScreen.classList.remove('show');
    sprntlyApp.classList.add('show');
    await wait(6000);

    sprntlyApp.classList.remove('show');
    await wait(450);
  }
}

const briefObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    briefObs.disconnect();
    runBriefingDemo();
  }
}, { threshold: 0.3 });
const briefObsTarget = document.querySelector('.briefing-mockup-frame');
if (briefObsTarget) briefObs.observe(briefObsTarget);

// ──────── ON-DEMAND MINI ────────
async function runOnDemandMini() {
  const typingSpan = document.getElementById('ondemandTyping');
  const cursor = document.getElementById('ondemandCursor');
  const thinking = document.getElementById('ondemandThinking');
  const results = document.getElementById('ondemandResults');
  if (!typingSpan || !thinking || !results) return;

  const question = "Of all feedback from last month, which impacts revenue?";

  while (true) {
    typingSpan.textContent = '';
    cursor.classList.add('show');
    thinking.classList.remove('show');
    results.classList.remove('show');
    await wait(1500);

    for (let i = 0; i < question.length; i++) {
      typingSpan.textContent = question.slice(0, i + 1);
      await wait(35 + Math.random() * 40);
    }
    await wait(600);
    cursor.classList.remove('show');

    thinking.classList.add('show');
    await wait(1300);
    thinking.innerHTML = '<span class="spinner-mini"></span> Clustering by theme...';
    await wait(1300);
    thinking.innerHTML = '<span class="spinner-mini"></span> Cross-referencing Stripe data...';
    await wait(1300);

    thinking.classList.remove('show');
    await wait(200);
    results.classList.add('show');

    await wait(5500);
  }
}

const odObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    odObs.disconnect();
    runOnDemandMini();
  }
}, { threshold: 0.3 });
const ondemandTile = document.getElementById('tileOnDemand');
if (ondemandTile) odObs.observe(ondemandTile);

// ──────── ON-CALL MINI (video-like, agent proactively types) ────────
async function typeOnCallText(textEl, text, speed = 20) {
  textEl.innerHTML = '<span class="msg-typing-cursor"></span>';
  for (let i = 0; i < text.length; i++) {
    textEl.innerHTML = text.slice(0, i + 1) + '<span class="msg-typing-cursor"></span>';
    await wait(speed + Math.random() * 18);
  }
  textEl.innerHTML = text;
}

function appendOnCallMsg(body, html) {
  const el = document.createElement('div');
  el.className = 'oncall-chat-msg oncall-chat-bot';
  el.innerHTML = html;
  body.appendChild(el);
  return el;
}

async function runOnCallMini() {
  const body = document.getElementById('oncallChatBody');
  if (!body) return;

  while (true) {
    body.innerHTML = '';
    await wait(800);

    // Message 1 — agent proactively raises the alarm
    const m1 = appendOnCallMsg(body, `
      <div class="oncall-chat-avatar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      </div>
      <div class="oncall-chat-bubble">
        <div class="oncall-chat-name">Sprntly · just now</div>
        <div class="oncall-chat-text" data-msg="1"></div>
      </div>
    `);
    await typeOnCallText(
      m1.querySelector('[data-msg="1"]'),
      'Hey John — checkout is failing on iOS. 2,847 users affected in the last 24 hours. Lost $50.2K so far.'
    );

    await wait(1100);

    // Message 2 — root cause + impact
    const m2 = appendOnCallMsg(body, `
      <div class="oncall-chat-avatar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      </div>
      <div class="oncall-chat-bubble">
        <div class="oncall-chat-text" data-msg="2"></div>
        <div class="oncall-chat-impact" data-impact style="display:none;">
          <div class="oncall-chat-stat"><span class="l">Lost / 24h</span><span class="v">$50.2K</span></div>
          <div class="oncall-chat-stat"><span class="l">ARR risk</span><span class="v">$2.2M</span></div>
        </div>
      </div>
    `);
    await typeOnCallText(
      m2.querySelector('[data-msg="2"]'),
      "Root cause: PaymentRequest.show() domain mismatch from Tuesday's deploy."
    );
    await wait(300);
    m2.querySelector('[data-impact]').style.display = 'grid';

    await wait(1300);

    // Message 3 — proposes fix + CTA
    const m3 = appendOnCallMsg(body, `
      <div class="oncall-chat-avatar">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      </div>
      <div class="oncall-chat-bubble">
        <div class="oncall-chat-text" data-msg="3"></div>
        <button class="oncall-chat-cta" data-cta style="display:none;">Review &amp; implement fix →</button>
      </div>
    `);
    await typeOnCallText(
      m3.querySelector('[data-msg="3"]'),
      "I've prepared the fix. ~2 hours to deploy. Want me to send it to engineering?"
    );
    await wait(300);
    m3.querySelector('[data-cta]').style.display = 'block';

    // Hold the final state, then loop
    await wait(7000);
  }
}

const ocObs = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    ocObs.disconnect();
    runOnCallMini();
  }
}, { threshold: 0.3 });
const oncallTile = document.getElementById('tileOnCall');
if (oncallTile) ocObs.observe(oncallTile);
