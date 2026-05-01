# Sprntly — SEO + AI Search Launch Checklist

This document covers everything that's been built into the site, everything you need to deploy with it, and the post-launch playbook to drive ranking. Status as of April 30, 2026.

---

## ✅ What's already in the site (built, ready to ship)

### On-page SEO
- [x] Title tag optimized for top keywords ("AI Agents for Product Managers")
- [x] Meta description with competitor framing (ChatPRD, Productboard, Dovetail, Kraftful)
- [x] Top 50 PM-related keywords in keywords meta tag
- [x] Author, publisher, robots directives
- [x] Canonical URL set to https://sprntly.ai/
- [x] Theme color and Apple/PWA meta tags

### AI search optimization
- [x] Explicit allow directives for GPTBot, ChatGPT-User, OAI-SearchBot
- [x] Explicit allow for ClaudeBot, anthropic-ai
- [x] Explicit allow for PerplexityBot, Perplexity-User
- [x] Explicit allow for Google-Extended (Gemini)
- [x] Explicit allow for CCBot, Cohere, Apple Intelligence

### Structured data (JSON-LD)
- [x] SoftwareApplication schema with full feature list, pricing, audience
- [x] Organization schema with founders and contact info
- [x] FAQPage schema with 12 detailed Q&As (rich snippet eligible)
- [x] WebSite schema for site structure
- [x] BreadcrumbList schema

### Open Graph / social
- [x] Open Graph tags for LinkedIn, Slack, Facebook
- [x] Twitter Card tags with summary_large_image
- [x] og:image dimensions specified (1200x630)

### Semantic content
- [x] "Sprntly vs ChatPRD" comparison content (visible on page)
- [x] "Sprntly vs Productboard" comparison content
- [x] "Sprntly vs Dovetail and Kraftful" comparison content
- [x] "Sprntly + Cursor + Claude Code" positioning content
- [x] "What Sprntly does for PMs" overview content
- [x] "Eight AI agents working together" content
- [x] "Who Sprntly is built for" content
- [x] "How Sprntly works in practice" content

### Site files included
- [x] index.html — main landing page
- [x] style.css — all styles
- [x] script.js — all interactivity
- [x] robots.txt — with full AI bot allowlist + sitemap reference
- [x] sitemap.xml — XML sitemap with image annotations
- [x] llms.txt — AI search standard manifest (concise version)
- [x] llms-full.txt — comprehensive AI search content
- [x] manifest.json — PWA manifest
- [x] humans.txt — team + tech stack info

---

## 📦 Files you need to add before deploying (assets)

### Required for full SEO
- [ ] **og-image.png** (1200x630px PNG) — referenced in OG/Twitter tags. Without it, social previews show no image.
- [ ] **logo.png** — referenced in Organization schema
- [ ] **icon-192.png** (192x192) — referenced in manifest.json
- [ ] **icon-512.png** (512x512) — referenced in manifest.json
- [ ] **favicon.ico** — standard favicon

### How to make these quickly
- og-image.png: Use Figma. Export 1200x630. Include logo, tagline ("AI Agents for Product Managers"), and a hint of the product UI.
- Logo + icons: Same Figma file, different sizes/crops.
- Favicon: Use favicon.io to convert your logo PNG into .ico.

---

## 🚀 Day-of-launch checklist (the day sprntly.ai goes live)

### Verification (15 min)
- [ ] Verify site at **Google Search Console** (search.google.com/search-console)
  - Add property: https://sprntly.ai
  - Verify via DNS TXT record (easiest) or HTML file upload
  - Submit sitemap: https://sprntly.ai/sitemap.xml
  - Request indexing for homepage

- [ ] Verify site at **Bing Webmaster Tools** (bing.com/webmasters)
  - This matters because **Bing's index powers ChatGPT Search and Copilot**
  - Submit sitemap
  - Request indexing

### Quick wins (1 hour)
- [ ] Test social previews:
  - LinkedIn Post Inspector: linkedin.com/post-inspector
  - X Card Validator: cards-dev.twitter.com/validator
  - Facebook Sharing Debugger: developers.facebook.com/tools/debug
- [ ] Test structured data:
  - Google Rich Results Test: search.google.com/test/rich-results
  - Schema.org Validator: validator.schema.org

### Performance check (30 min)
- [ ] Run PageSpeed Insights: pagespeed.web.dev
  - Target: 90+ on mobile, 95+ on desktop
- [ ] Check Core Web Vitals
  - LCP < 2.5s
  - INP < 200ms
  - CLS < 0.1

---

## 📈 Week 1 post-launch (do all of this)

### Get listed in AI tool directories (~3 hours total)
These directories get crawled by AI search engines and feed into LLM training/retrieval. Submit to all of them:

**Top tier (highest priority):**
- [ ] Product Hunt — schedule launch for week 4-6 after refining
- [ ] Futurepedia (futurepedia.io) — biggest AI tool directory
- [ ] There's An AI For That (theresanaiforthat.com) — high LLM citation rate
- [ ] Toolify (toolify.ai)
- [ ] AI Skill Market (aiskill.market) — Claude-affiliated, gets cited by Claude

**Mid tier:**
- [ ] Insidr.ai
- [ ] AIToolsDirectory.com
- [ ] AI Agents Directory (aiagentslist.com)
- [ ] Topai.tools
- [ ] AIxploria
- [ ] EasyWithAI
- [ ] FavTutor AI

**PM-specific:**
- [ ] Productschool community resources
- [ ] aipmtools.org (AI PM Tools Directory)
- [ ] Prodmgmt.world resources

### Community presence (~2 hours)
- [ ] LinkedIn announcement post by Kwame
- [ ] LinkedIn announcement post by Parth
- [ ] Indie Hackers product launch
- [ ] r/ProductManagement post (genuine, not promotional)
- [ ] Hacker News Show HN post
- [ ] Twitter/X announcement thread

### Direct outreach (~3 hours)
- [ ] Email Lenny Rachitsky (Lenny's Newsletter) — pitch a guest essay or podcast appearance
- [ ] Email pmhq.dev / Mind the Product / Pragmatic Institute newsletters
- [ ] Reach out to AI tool reviewers on Twitter/LinkedIn

---

## 📅 Month 1 post-launch

### Comparison pages (this is the highest-leverage SEO work you can do)
Each comparison page should be ~1500 words, with a comparison table, feature-by-feature breakdown, pricing comparison, "when to choose which" section, and FAQs.

Create these as separate pages (e.g., /compare/chatprd, /compare/productboard):
- [ ] **Sprntly vs ChatPRD** — closest direct competitor; many PMs search this exactly
- [ ] **Sprntly vs Productboard** — biggest player in product management software
- [ ] **Sprntly vs Dovetail** — research synthesis category
- [ ] **Sprntly vs Kraftful** — feedback analysis category
- [ ] **Sprntly vs BuildBetter** — AI-native PM tool category
- [ ] **Sprntly vs Bagel AI** — newer evidence-based prioritization tool

Each comparison page:
- Add to sitemap.xml
- Get its own structured data (Product schema with ComparisonOf relationship)
- Internal-link to/from the homepage and other comparison pages
- Use FAQ schema for the comparison-specific Q&As

### Founder content
- [ ] Kwame: 3 LinkedIn posts/week about the build process, design partner conversations, product learnings
- [ ] Parth: 1 LinkedIn or Substack post/week on the engineering/AI side
- [ ] Each post = potential backlink + audience exposure + AI search citation source

### Podcast outreach
Pitch yourself to:
- [ ] Lenny's Podcast (Lenny Rachitsky)
- [ ] How I AI (Claire Vo)
- [ ] This is Product Management
- [ ] Product Thinking (Melissa Perri)
- [ ] Mind the Product Podcast
- [ ] The Product Podcast (Product School)
- [ ] Build with Leila Hormozi

---

## 📅 Months 2-3: Content moat

### Guest posts
- [ ] Lenny's Newsletter — pitch a guest essay (his audience is your exact ICP)
- [ ] First Round Review
- [ ] The Generalist
- [ ] Product Coalition (Medium publication)

### Original research / linkable assets
- [ ] Run a survey: "State of AI Tooling for Product Managers 2026"
  - Survey 200+ PMs (use your network, Reddit, LinkedIn outreach)
  - Publish full report on /reports/state-of-ai-pm-2026
  - Pitch the data to TechCrunch, Forbes, The Information
  - One good report = 30+ backlinks

### Use case content
Build /use-cases/ with sub-pages:
- [ ] /use-cases/series-a-pms
- [ ] /use-cases/founder-pms
- [ ] /use-cases/heads-of-product
- [ ] /use-cases/technical-pms
- [ ] /use-cases/product-ops

Each page targets a specific persona's search behavior.

### Answer-style pages (rank for AI search)
Build /answers/ with pages targeting how PMs phrase questions:
- [ ] /answers/how-to-write-prd-with-ai
- [ ] /answers/how-to-analyze-customer-feedback-with-ai
- [ ] /answers/how-to-prioritize-features-with-ai
- [ ] /answers/how-to-use-cursor-as-pm
- [ ] /answers/how-to-use-claude-code-as-pm

Each page is structured for AI search citation: clear question, comprehensive answer, citations, related questions at the bottom.

---

## 🛠 Tools to use (most are free)

### SEO monitoring
- [Google Search Console](https://search.google.com/search-console) — primary tool, free
- [Bing Webmaster Tools](https://www.bing.com/webmasters) — primary tool, free
- [Ahrefs](https://ahrefs.com) — paid, but worth it once revenue starts flowing
- [Semrush](https://semrush.com) — paid alternative
- [Ubersuggest](https://neilpatel.com/ubersuggest/) — free tier is decent

### AI search monitoring
- [Profound](https://www.tryprofound.com/) — tracks brand visibility in ChatGPT/Perplexity/Gemini answers
- [Otterly](https://otterly.ai) — same idea
- Manual: query ChatGPT/Claude/Perplexity weekly with PM tool questions, track if Sprntly appears

### Schema/structured data
- [Schema.org Validator](https://validator.schema.org)
- [Google Rich Results Test](https://search.google.com/test/rich-results)

### Performance
- [PageSpeed Insights](https://pagespeed.web.dev)
- [WebPageTest](https://webpagetest.org)
- [Cloudflare Web Analytics](https://www.cloudflare.com/web-analytics/) — privacy-friendly, free

---

## 📊 Realistic timeline

**Month 1**: AI search starts mentioning Sprntly when prompted with "AI tools for PMs". 10-30 visits/week from directories and community.

**Months 3-6**: Comparison pages start ranking on page 2-3 of Google. AI search citations become reliable. 100-300 visits/month.

**Months 6-12**: With consistent content + backlinks, comparison pages hit page 1. AI search citations are common. 1,000-3,000 visits/month.

**Year 2**: Compete for mid-volume keywords like "AI PRD generator" and "best AI tools for product managers". Top-of-page positioning possible.

---

## 🎯 What to obsess over (and what to ignore)

### Obsess over
- **Comparison pages** — highest ROI SEO work
- **Founder-led content** — backlinks + audience exposure
- **Original research** — linkable asset that compounds
- **AI search citations** — track these weekly
- **Page speed** — Core Web Vitals are real ranking factors

### Ignore
- Generic SEO advice that focuses on backlink counts
- "Top 100 AI tools" listicles from SEO mills (worth nothing)
- Reciprocal link schemes (penalized)
- Trying to rank for "AI for PM" as a generic term in your first 6 months
- Keyword stuffing (you're not doing this — your meta tags are already comprehensive but balanced)

---

## Contact for questions

- build@sprntly.ai
- All build files: `/sprntly-site/`
- Updated: 2026-04-30
