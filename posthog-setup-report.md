<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Thesis AI Next.js 15 App Router project. PostHog is initialised via `instrumentation-client.ts` (the correct approach for Next.js 15.3+), with a reverse proxy configured through `next.config.js` rewrites so all analytics traffic routes through the app's own domain. A server-side PostHog client (`lib/posthog-server.ts`) handles API-route events. Environment variables are stored in `.env.local`.

Key changes made:
- **`instrumentation-client.ts`** (new) — client-side PostHog init with exception capture and debug mode in dev
- **`lib/posthog-server.ts`** (new) — singleton `posthog-node` client for server-side events
- **`next.config.js`** — added PostHog reverse proxy rewrites (`/ingest/*`), `skipTrailingSlashRedirect: true`, and PostHog domains added to Content Security Policy `connect-src`
- **`.env.local`** — `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` set
- **13 events** instrumented across 8 files

| Event | Description | File |
|---|---|---|
| `waitlist_submitted` | User successfully submitted the waitlist form | `app/components/WaitlistForm.tsx` |
| `user_signed_up` | User completed account registration | `app/(auth)/sign-up/page.tsx` |
| `user_signed_in` | User signed in (email/password or guest) | `app/(auth)/sign-in/page.tsx` |
| `onboarding_completed` | User completed the onboarding flow | `app/(auth)/onboarding/page.tsx` |
| `watchlist_symbol_added` | User added a stock symbol to a watchlist | `components/WatchlistTable.tsx` |
| `watchlist_symbol_removed` | User removed a stock symbol from a watchlist | `components/WatchlistTable.tsx` |
| `watchlist_created` | User created a new watchlist | `app/(app)/watchlist/page.tsx` |
| `portfolio_created` | User created a new portfolio | `app/(app)/portfolio/page.tsx` |
| `portfolio_holding_added` | User added a holding to a portfolio | `app/(app)/portfolio/page.tsx` |
| `stock_viewed` | User viewed the stock detail page (top of research funnel) | `app/(app)/stock/[symbol]/page.tsx` |
| `price_alert_set` | User set a price alert for a stock | `app/(app)/stock/[symbol]/page.tsx` |
| `ai_message_sent` | User sent a message to the AI chat | `components/AiChatPanel.tsx` |
| `waitlist_api_signup` | Server-side: waitlist entry persisted to the database | `app/api/waitlist/route.ts` |

User identification (`posthog.identify()`) is called on sign-up and sign-in with the user's email as the distinct ID, enabling person-level analytics across sessions. Error tracking (`posthog.captureException()`) is added to auth error handlers and enabled globally via `capture_exceptions: true` in the init config.

## Next steps

We've built a dashboard and five insights to keep an eye on user behaviour as events start flowing:

- **Dashboard — Analytics basics**: https://us.posthog.com/project/393645/dashboard/1509976
- **Signup Conversion Funnel** (waitlist → sign-up → onboarding): https://us.posthog.com/project/393645/insights/MFrpJxZC
- **Daily Sign-ins**: https://us.posthog.com/project/393645/insights/QG6uBp3n
- **AI Chat Messages Sent**: https://us.posthog.com/project/393645/insights/YjwNkJkG
- **Stock Research Funnel** (stock viewed → price alert set): https://us.posthog.com/project/393645/insights/MKJZS1LR
- **Watchlist & Portfolio Activity**: https://us.posthog.com/project/393645/insights/bw9xqf53

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
