# Terms of Service Page — Design Spec

**Date:** 2026-04-28
**Status:** Approved

---

## Overview

Replace the placeholder `app/terms/page.tsx` with a complete, production-ready Terms of Service page covering both Thesis AI products: the Thesis AI Platform (AI investment research) and the Long Hold iOS app.

---

## Decisions

| Decision | Choice |
|---|---|
| Content | Real legal copy (not placeholder) |
| Scope | Both products — Thesis AI Platform + Long Hold |
| Governing law | California, USA |
| Layout | Sticky TOC sidebar + scrollable content |
| Style | Match Long Hold privacy page pattern (`SiteNav`, design tokens, footer) |

---

## Layout & Visual Design

### Pattern
Follows `app/long-hold/privacy/page.tsx` exactly:
- `<main className="page">`
- `<SiteNav />` at top
- Page header: `var(--bg-soft)` background, breadcrumb, h1, subtitle
- Content area: `section-wrap` class, `max-width: 720px`
- Effective date line with `var(--glass-border)` divider
- Section `<h2>` at `1.15rem`, body text in `var(--muted)` at `lineHeight: 1.7`
- Links in `var(--accent)`
- Footer matching the main site footer

### Sticky TOC Sidebar (new)
The Long Hold privacy page is a linear scroll. The ToS is longer (16 sections), so this page adds a sticky left-sidebar table of contents. Layout:

```
[ SiteNav ]
[ Page Header: breadcrumb / h1 / subtitle / effective date ]

[ two-column content area ]
  ┌─ sticky TOC (left, ~200px) ─┐  ┌─ sections (right, flex:1) ─┐
  │ 1. Acceptance                │  │ h2 + body paragraphs        │
  │ 2. Services                  │  │ (each section has id anchor) │
  │ 3. Accounts                  │  │                             │
  │ ...                          │  └─────────────────────────────┘
  └──────────────────────────────┘

[ Footer ]
```

On mobile (< 768px), the sidebar collapses — hides the sticky TOC, sections remain full-width.

---

## Content Structure

### Metadata
- **Page title:** "Terms of Service — Thesis AI"
- **Effective date:** April 28, 2026
- **Last updated:** April 28, 2026

### Breadcrumb
`Thesis AI › Terms of Service`

### Sections

| # | Section | Product scope | Notes |
|---|---|---|---|
| 1 | Acceptance of Terms | Both | Covers use of the website, Platform, and Long Hold app |
| 2 | Description of Services | Both | Describes the Platform (AI investment research, web + iOS) and Long Hold (iOS contribution tracker) |
| 3 | Thesis AI Platform — Beta Terms | Platform only | Invite-only access, no SLA, features may change, not production-ready |
| 4 | Long Hold — App Store Terms | Long Hold only | Subscriptions via Apple, billing governed by Apple, no direct refunds |
| 5 | Accounts | Both | Registration, accurate info, credential security, account termination rights |
| 6 | Acceptable Use | Both | Prohibited: automated scraping, impersonation, illegal activity, circumventing access controls |
| 7 | Intellectual Property | Both | Thesis AI owns the platform; users own their input data; AI outputs are licensed for personal use only |
| 8 | Not Financial Advice | Platform | Explicit disclaimer: outputs are research assistance only, not personalized investment advice, not a licensed advisor |
| 9 | AI-Generated Content | Platform | Accuracy not guaranteed, outputs may be incomplete or incorrect, user bears responsibility for investment decisions |
| 10 | Privacy | Both | Pointer to Privacy Policy at `/privacy` |
| 11 | Disclaimers | Both | Services provided "as is", no warranty, beta limitations |
| 12 | Limitation of Liability | Both | Standard liability cap to fees paid (or $100 for free tier), no indirect/consequential damages |
| 13 | Indemnification | Both | User indemnifies Thesis AI for misuse |
| 14 | Changes to Terms | Both | Material changes notified via email or in-app notice, 30-day notice |
| 15 | Governing Law | Both | California law, Santa Clara County courts, informal dispute resolution first |
| 16 | Contact | Both | hello@thesisai.app |

---

## Technical Implementation

### File to modify
- `app/terms/page.tsx` — replace placeholder content entirely

### No new files needed
- No new components required (follows existing patterns)
- No new routes

### Metadata export
Add a `metadata` export matching the Long Hold privacy page pattern:
```ts
export const metadata: Metadata = {
  title: 'Terms of Service — Thesis AI',
  description: 'Terms of service governing use of Thesis AI products including the Thesis AI Platform and Long Hold iOS app.',
};
```

### TOC implementation
Client-side sticky sidebar using CSS `position: sticky`. No JS required for basic behavior. Anchor links (`href="#section-1"`) scroll to `id`-tagged `<section>` elements. Mobile: TOC hidden via CSS media query.

### Design tokens used
- `var(--bg-soft)` — page header background
- `var(--bg-mid)` — TOC sidebar background
- `var(--glass-border)` — dividers, TOC border
- `var(--muted)` — body text, TOC links
- `var(--text)` — headings, bold terms
- `var(--accent)` — active TOC link, inline links
- `var(--border)` — TOC wrapper border

---

## Key Legal Constraints

- **Not financial advice** — must be explicit, unambiguous, and prominent. The platform surfaces AI-generated investment research. This disclaimer is essential.
- **AI output accuracy** — must disclaim accuracy guarantees; AI outputs are research aids, not verified facts.
- **California law** — include CCPA rights pointer (covered in Privacy Policy), informal dispute resolution before arbitration.
- **Long Hold App Store** — billing is 100% Apple-controlled; ToS must not create conflicting refund expectations.
- **Beta** — limit liability for the Platform's early-access / invite-only state.
