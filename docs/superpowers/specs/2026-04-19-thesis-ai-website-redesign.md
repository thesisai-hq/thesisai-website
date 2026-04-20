# Thesis AI Website Redesign — Design Spec

**Date:** 2026-04-19
**Status:** Approved

---

## Goal

Restructure the Thesis AI marketing website so that:
- `thesisai.app` is the Thesis AI **company** homepage featuring both products
- **Thesis AI** (AI investment research platform) remains the primary product with all existing content intact
- **Long Hold** (iOS app) is introduced as a second product with its own dedicated page, support page, and privacy policy

---

## URL Structure

| Route | Description | Action |
|-------|-------------|--------|
| `/` | Company homepage — intro + products grid + existing Thesis AI platform content | Modify |
| `/long-hold` | Long Hold product marketing page | Create |
| `/long-hold/support` | Long Hold support / FAQ | Create |
| `/long-hold/privacy` | Long Hold privacy policy | Create |
| `/privacy` | Existing Thesis AI privacy page | Unchanged |
| `/terms` | Existing terms page | Unchanged |
| `/dashboard`, `/watchlist`, etc. | Authenticated app routes | Unchanged |

---

## 1. Homepage Redesign (`app/page.tsx`)

### What changes
A new **company intro + products section** is prepended to the existing page. Everything currently on the page (hero, multi-agent diagram, features grid, how-it-works, trust section, FAQ, waitlist) stays intact below it — no content is removed.

### New top section structure

```
[Company Intro]
  - Headline: "Thesis AI builds tools for serious investors"
  - Subline: "We combine AI and behavioral finance to help you research smarter and invest consistently."

[Our Products — 2-column card grid]
  Card 1: Thesis AI Platform
    - Badge: "In Beta"
    - Short description: AI-powered investment research with multi-agent synthesis
    - CTA: "Request Access" → scrolls to existing waitlist section (#waitlist)

  Card 2: Long Hold
    - Badge: "Available on iOS"
    - Short description: Track contributions, build streaks, visualize long-term growth
    - CTA: "Learn More" → /long-hold

[Divider / section label: "Thesis AI Platform"]
  ... existing homepage content continues unchanged ...
```

### Styling
- Follows existing design system: dark bg `#060d18`, accent `#3b9eff`, glassmorphic cards, IBM Plex Sans / Avenir Next fonts
- Product cards use the existing card border style (`rgba(103,129,156,0.26)` border, `#0b1729` bg)
- Company intro section is minimal — no animations, just clean typography

---

## 2. Shared Navigation

### What changes
The existing nav component (in `app/layout.tsx` or a shared `components/` file) gets a **Products dropdown** added between the logo and the existing right-side CTAs.

### Nav structure
```
[Thesis AI logo] → /

[Products ▾]  (dropdown on hover/click)
  ├── Thesis AI Platform  → /#platform (anchor on homepage)
  └── Long Hold           → /long-hold

[Dashboard]  → /dashboard   (existing)
[Request Access]  → /#waitlist  (existing)
```

### Behavior
- Dropdown appears on hover (desktop) or tap (mobile)
- Active state highlights the current product section
- Mobile: collapses into hamburger menu with Products as an expandable item
- Existing nav links and styling are preserved; only the Products item is added

---

## 3. Long Hold Product Page (`app/long-hold/page.tsx`)

A focused iOS app marketing page. Matches the visual language of the existing site.

### Sections

**Hero**
- App icon (chart.line.uptrend SF Symbol styled as app icon)
- Headline: "Build wealth through consistency"
- Subline: "Track investments, build streaks, and watch compounding do its work."
- Primary CTA: "Download on App Store" (links to App Store listing)
- Secondary CTA: "Learn more ↓" (scrolls to features)

**Feature Grid (6 items, 2×3)**
1. Contribution Tracking — log every investment
2. Streak System — accountability through consistency
3. Growth Projections — 30-year compound calculator
4. Crash Mode — historical context during downturns
5. Education — bite-sized investing fundamentals
6. Goal Tracking (Pro) — retirement, house, emergency fund

**Pro Tier Callout**
- Highlighted card listing Pro features: full education library, scenario comparison, inflation-adjusted projections, Discipline Score, milestones, achievements
- CTA: "Upgrade to Pro in-app"

**Footer links**
- Support → `/long-hold/support`
- Privacy Policy → `/long-hold/privacy`

---

## 4. Long Hold Support Page (`app/long-hold/support/page.tsx`)

### Sections
- **Header:** breadcrumb (Thesis AI › Long Hold › Support), title, subtitle
- **Contact card:** `support@thesisai.app` prominently featured
- **App info strip:** App name, Platform (iOS), Version (1.0), Developer (Thesis AI)
- **FAQ (9 questions):**
  1. What is Long Hold?
  2. What's included in the free tier?
  3. What does Long Hold Pro include?
  4. How do I restore my Pro subscription?
  5. How do I cancel my subscription?
  6. I forgot my password — how do I reset it?
  7. Is my data secure?
  8. How is the projection calculated?
  9. What is the Discipline Score?

---

## 5. Long Hold Privacy Policy (`app/long-hold/privacy/page.tsx`)

### Sections
- Effective date: April 19, 2026
- Overview
- Information We Collect (email, password hash, contribution logs, profile prefs, goals)
- How We Use Your Information
- Data Storage and Security (Supabase, row-level security)
- In-App Purchases (Apple handles payment, we store nothing)
- Push Notifications (local only, no remote server)
- Data Retention and Deletion (email to delete)
- Children's Privacy (13+)
- Third-Party Services (Supabase, Apple StoreKit only — no ad SDKs)
- Your Rights (access, correct, delete, export)
- Changes to This Policy
- Contact: `support@thesisai.app`

---

## 6. Cleanup

- Delete `/Users/alfonsomeraz/Development/thesisai-website/index.html` (static file I created earlier, now replaced by Next.js)
- Delete `/Users/alfonsomeraz/Development/thesisai-website/long-hold/` directory (static HTML, replaced by Next.js pages)
- Keep `CNAME` and `.nojekyll` at root only if needed; move to `web/public/` if Vercel deployment uses it (likely not needed with Vercel)

---

## Implementation Order

1. Update shared nav — Products dropdown
2. Modify `app/page.tsx` — prepend company intro + products grid
3. Create `app/long-hold/page.tsx`
4. Create `app/long-hold/support/page.tsx`
5. Create `app/long-hold/privacy/page.tsx`
6. Delete stale static HTML files at root

---

## Out of Scope

- No changes to authenticated app routes (`/dashboard`, `/watchlist`, `/portfolio`, etc.)
- No changes to `/privacy`, `/terms`, or existing API routes
- No backend changes
- No new dependencies
