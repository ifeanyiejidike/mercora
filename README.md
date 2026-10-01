# Mercora Frontend

Mercora is a production-grade multi-role commerce SaaS frontend built with Next.js, TypeScript, and Tailwind CSS.

It powers five major product surfaces:

- marketing website
- authentication and onboarding
- merchant workspace
- public storefront buyer experience
- platform admin workspace

This frontend is intentionally built as an operational commerce product, not a brochure site. It must feel trustworthy, fast, responsive, and financially clear across acquisition, checkout, merchant operations, and platform oversight.

---

## Table of Contents

- [Known Issues Fixed](#known-issues-fixed)
- [Project Overview](#project-overview)
- [Product Positioning](#product-positioning)
- [Current Frontend Scope](#current-frontend-scope)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Current Route Map](#current-route-map)
- [Application Layers](#application-layers)
- [Authentication and Session Strategy](#authentication-and-session-strategy)
- [Tenant and Storefront Strategy](#tenant-and-storefront-strategy)
- [Payment Experience Model](#payment-experience-model)
- [Money and Currency Rules](#money-and-currency-rules)
- [Design System and UI Standards](#design-system-and-ui-standards)
- [Responsiveness Rules](#responsiveness-rules)
- [Accessibility Rules](#accessibility-rules)
- [State Management Strategy](#state-management-strategy)
- [API Integration Strategy](#api-integration-strategy)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Development Commands](#development-commands)
- [Suggested Working Conventions](#suggested-working-conventions)
- [Error, Empty, and Loading States](#error-empty-and-loading-states)
- [Performance Standards](#performance-standards)
- [Security Standards](#security-standards)
- [Testing and QA Checklist](#testing-and-qa-checklist)
- [Containerization and CI/CD](#containerization-and-cicd)
- [Deployment Notes](#deployment-notes)
- [Known Architectural Principles](#known-architectural-principles)

---

## Known Issues Fixed

Found and fixed during a production-readiness pass (dates approximate — check git blame for exact commits):

- **Next.js 16.1.6 → 16.3.6**: the pinned version had several real security advisories, including a critical unauthenticated RCE and a Server Actions CSRF bypass. Upgraded and re-verified typecheck/lint/build all still pass.
- **axios 1.13.5 → 1.20.0**: multiple real CVEs affecting a library used for every API call in this app (auth, payments, everything). `npm audit` went from 16 vulnerabilities (1 critical) to 0 after this and the Next.js bump plus `npm audit fix`.
- **`next lint` no longer exists** in Next.js 16; the project's ESLint config was also still in the pre-v9 `.eslintrc.cjs` format. Migrated to a native flat config (`eslint.config.mjs`) and pointed `npm run lint` at `eslint .` directly.
- **`/api/auth/logout` and `/api/auth/refresh`** were empty files with no exported handler — a Next.js build failure waiting to happen. Confirmed nothing calls them (the real auth flow hits the Django backend directly) and removed them rather than guessing at cookie-proxy logic nothing uses.
- **`next-sitemap` was removed entirely**, not just patched. It originally had a hardcoded, stale domain (fixed first), but the real problem surfaced later: it wrote static `public/sitemap.xml`/`robots.txt` that collided with Next.js's own native `src/app/sitemap.ts`/`robots.ts` routes at the same paths — a hard Next.js build error (`scripts/fix-sitemap-index.js`, referenced in `package.json`'s `postbuild` to paper over this, was never actually committed to the repo). Removed the static generator; the native routes now derive their domain from `NEXT_PUBLIC_SITE_URL` directly.
- **`next.config.ts` had leftover remote-image hostnames from a different project** (an unrelated backend domain, a placeholder Supabase URL). Removed; the real media hostname is now derived from `NEXT_PUBLIC_API_URL` so it can't silently drift again.
- **`revalidateTag` needed a second argument** under Next.js 16's updated cache API — caught by `tsc`, fixed.
- Removed two genuinely unused dependencies: `resend`, `@react-google-maps/api`.
- **`package.json`'s name, `.env.production`'s site/API URLs, and a comment in `.env.example` all still said "gravity-concepts"** — leftover from this project being bootstrapped off a different one (the Gravity Concepts agency site; a separate, commented-out CoursePilot URL was found in the same file, confirming the pattern). Mercora and Gravity Concepts are unrelated products; all references removed. The production domain isn't registered yet, so `.env.production` now holds an explicit `TODO` placeholder instead of a real-looking but wrong URL.
- **`(merchant)/dashboard/layout.tsx` was missing `StorefrontProvider`** despite wrapping `AuthProvider`/`MerchantProvider` — any page calling `useStorefront()` (5 settings pages) threw during Vercel's static prerendering, failing the build. Fixed, and the whole route segment marked `dynamic = "force-dynamic"` since an authenticated per-merchant dashboard has no business being statically prerendered in the first place — same root cause could otherwise recur on any future page in that segment.

---

## Project Overview

Mercora is not just a storefront builder.

Mercora is a commerce operating system for African merchants.

The frontend must communicate that clearly through:

- structured acquisition pages
- confidence-building onboarding
- transparent checkout flows
- merchant-side order, payment, receipt, and settlement visibility
- platform-side operational oversight

The UI should consistently feel:

- premium
- stable
- modern
- mobile-first
- operationally trustworthy
- clear under pressure

---

## Product Positioning

Mercora’s strongest product truth is:

**storefront + order management + payment orchestration + receipt infrastructure + settlement visibility**

That means the frontend should never behave like a lightweight template app.

Every major surface should reinforce:

- selling is structured
- payments are understandable
- receipts are credible
- settlement visibility matters
- operations are traceable

---

## Current Frontend Scope

The current frontend architecture already covers the following major areas:

### 1. Marketing
Public acquisition, trust, education, and conversion pages.

### 2. Auth and Onboarding
Login, sign-up, password recovery, invitation handling, onboarding flow, and role-aware access control.

### 3. Merchant Workspace
Dashboard home, catalog, orders, payments, settlements, subscriptions, receipts, customers, support, analytics, team, and settings.

### 4. Public Storefront
Tenant-aware buyer experience with store homepage, products, categories, search, cart, checkout, order tracking, manual payment proof flow, receipt access, contact, and policies.

### 5. Platform Admin
Platform-wide dashboards and control surfaces for merchants, stores, orders, payments, receipts, settlements, payouts, disputes, support tickets, notifications, analytics, subscriptions, and configuration.

---

## Tech Stack

Current and intended frontend stack:

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Axios-based API layer (calls the Django backend directly via `NEXT_PUBLIC_API_URL` — see Authentication and Session Strategy)
- Context providers for auth and merchant/storefront state
- lightweight client stores for cart and checkout workflows
- SEO metadata routes via App Router conventions (`sitemap.ts`, `robots.ts`, `manifest.ts`, `opengraph-image.tsx`)
- route handlers for health check (`/api/health`) and on-demand ISR revalidation (`/api/revalidate`)
- ESLint 9 (flat config — `eslint.config.mjs`; `next lint` no longer exists as of Next.js 16)
- Sentry error monitoring (`@sentry/nextjs`) — wired via `src/instrumentation.ts` (server/edge) and `src/instrumentation-client.ts` (browser), plus `withSentryConfig(...)` wrapping `next.config.ts`. Entirely no-op unless `NEXT_PUBLIC_SENTRY_DSN` is set — no Sentry account needed for local dev. Source-map upload (for readable stack traces) additionally needs `SENTRY_AUTH_TOKEN`/`SENTRY_ORG`/`SENTRY_PROJECT`; without them the build still succeeds, it just skips that step.
- `@radix-ui/colors` — source of the color token system (see Design System and UI Standards). Used only at the `globals.css` authoring stage; not imported at runtime by any component.

Optional or implementation-dependent tooling:

- query/state helpers for server-side data hydration
- theme provider if dark/light mode remains enabled
- `src/components/ui/button.tsx` is the one shadcn primitive kept (holds the real `brand` variant and the token-driven gradient); the other 10 were deleted as unused — see Design System and UI Standards

Removed as unused dead dependencies (were installed but never imported anywhere, or were dead imports inside a file that otherwise works): `resend`, `@react-google-maps/api`, `sonner`, `react-hook-form`, `@hookform/resolvers`. Re-add only if an actual feature starts using them.

---

## Architecture Overview

The frontend is organized around product surfaces rather than random component sprawl.

Top-level route groups currently include:

- `src/app/(marketing)`
- `src/app/(auth)`
- `src/app/(merchant)`
- `src/app/(storefront)`
- `src/app/(platform-admin)`
- `src/app/api`

Supporting layers include:

- `src/components`
- `src/config`
- `src/contexts`
- `src/hooks`
- `src/lib`
- `src/providers`
- `src/stores`
- `src/styles`
- `src/types`

This keeps the application readable as it grows and avoids coupling marketing, storefront, merchant, and admin concerns into one flat folder.

---

## Current Route Map

### App Root

Core app files currently include:

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/error.tsx`
- `src/app/global-error.tsx`
- `src/app/loading.tsx`
- `src/app/not-found.tsx`
- metadata assets such as `manifest.ts`, `robots.ts`, `sitemap.ts`, `opengraph-image.tsx`, and `twitter-image.tsx`

### Marketing Routes

Current public marketing routes include:

- `/`
- `/about`
- `/book-demo`
- `/contact`
- `/faq`
- `/features`
- `/how-it-works`
- `/pricing`
- `/legal/cookies`
- `/legal/privacy`
- `/legal/refunds`
- `/legal/terms`

### Auth Routes

Current auth and onboarding routes include:

- `/login`
- `/sign-up`
- `/forgot-password`
- `/reset-password`
- `/change-password`
- `/verify-email`
- `/invitation/[token]`
- `/onboarding`
- `/onboarding/business`
- `/onboarding/currency`
- `/onboarding/payments`
- `/onboarding/plan`
- `/onboarding/store`
- `/onboarding/complete`

### Merchant Workspace Routes

Current merchant workspace is centered on `/dashboard` and includes:

- `/dashboard`
- `/dashboard/analytics`
- `/dashboard/billing`
- `/dashboard/catalog/categories`
- `/dashboard/catalog/inventory`
- `/dashboard/catalog/products`
- `/dashboard/catalog/products/new`
- `/dashboard/catalog/products/[productId]`
- `/dashboard/customers`
- `/dashboard/customers/[customerId]`
- `/dashboard/discounts`
- `/dashboard/notifications`
- `/dashboard/orders`
- `/dashboard/orders/[orderId]`
- `/dashboard/payments`
- `/dashboard/payments/manual`
- `/dashboard/payments/[paymentId]`
- `/dashboard/payouts`
- `/dashboard/payouts/[batchId]`
- `/dashboard/receipts`
- `/dashboard/receipts/[receiptNumber]`
- `/dashboard/settlements`
- `/dashboard/settlements/[recordId]`
- `/dashboard/settlements/payout-batches/[payoutBatchId]`
- `/dashboard/subscriptions`
- `/dashboard/subscriptions/invoices/[invoiceId]`
- `/dashboard/support`
- `/dashboard/support/new`
- `/dashboard/support/[ticketId]`
- `/dashboard/team`
- `/dashboard/settings`
- `/dashboard/settings/profile`
- `/dashboard/settings/store`
- `/dashboard/settings/branding`
- `/dashboard/settings/domain`
- `/dashboard/settings/checkout`
- `/dashboard/settings/shipping`
- `/dashboard/settings/policies`
- `/dashboard/settings/payouts`
- `/dashboard/settings/payment-methods`
- `/dashboard/settings/kyc`

### Public Storefront Routes

The storefront is tenant-oriented under the `_stores` segment:

- `/_stores/[storeSlug]`
- `/_stores/[storeSlug]/products`
- `/_stores/[storeSlug]/products/[productSlug]`
- `/_stores/[storeSlug]/categories/[categorySlug]`
- `/_stores/[storeSlug]/search`
- `/_stores/[storeSlug]/cart`
- `/_stores/[storeSlug]/checkout`
- `/_stores/[storeSlug]/checkout/pending`
- `/_stores/[storeSlug]/checkout/success`
- `/_stores/[storeSlug]/checkout/failed`
- `/_stores/[storeSlug]/payment/manual/[orderRef]`
- `/_stores/[storeSlug]/order/[orderRef]`
- `/_stores/[storeSlug]/track`
- `/_stores/[storeSlug]/receipt/[receiptNumber]`
- `/_stores/[storeSlug]/contact`
- `/_stores/[storeSlug]/policies/privacy`
- `/_stores/[storeSlug]/policies/refund`
- `/_stores/[storeSlug]/policies/shipping`
- `/_stores/[storeSlug]/policies/terms`

### Platform Admin Routes

Current platform admin workspace is centered on `/platform-admin` and includes:

- `/platform-admin`
- `/platform-admin/action-logs`
- `/platform-admin/analytics`
- `/platform-admin/configuration`
- `/platform-admin/disputes`
- `/platform-admin/disputes/[disputeId]`
- `/platform-admin/merchants`
- `/platform-admin/merchants/[merchantId]`
- `/platform-admin/notifications`
- `/platform-admin/orders`
- `/platform-admin/orders/[orderId]`
- `/platform-admin/payments`
- `/platform-admin/payments/[paymentId]`
- `/platform-admin/payout-batches`
- `/platform-admin/payout-batches/[payoutBatchId]`
- `/platform-admin/provider-routing`
- `/platform-admin/receipts`
- `/platform-admin/receipts/[receiptNumber]`
- `/platform-admin/settlements`
- `/platform-admin/settlements/[recordId]`
- `/platform-admin/stores`
- `/platform-admin/stores/[storeId]`
- `/platform-admin/subscriptions`
- `/platform-admin/subscriptions/[subscriptionId]`
- `/platform-admin/support/tickets`
- `/platform-admin/support/tickets/[ticketId]`

### Internal App Route Handlers

Current app route handlers include:

- `/api/health` — liveness check for this app + a best-effort check that the Django backend is reachable
- `/api/revalidate` — on-demand ISR revalidation, gated by `REVALIDATE_SECRET` (see `.env.example`)

Note: `/api/auth/logout` and `/api/auth/refresh` were previously present
as empty stub files (no exported handler — would have failed the
production build) and unreferenced by any client code; the actual auth
flow (`src/lib/api/auth.ts`) calls the Django backend's
`/api/auth/logout/` and `/api/auth/refresh/` endpoints directly via
`NEXT_PUBLIC_API_URL`, not a local route. Removed rather than
implemented, since inventing cookie-proxy logic nothing currently calls
risked introducing a second, inconsistent auth path. If a Next.js-side
BFF proxy for these is actually wanted (e.g. to keep tokens off the
client entirely), that's a deliberate architecture decision worth
making explicitly rather than guessing at here.

---

## Application Layers

### `src/components`
Domain-oriented UI components.

Examples already present:

- analytics
- auth
- customers
- dashboard
- merchant
- notifications
- platform
- settlements
- storefront
- subscriptions
- support
- shared
- ui

### `src/config`
Navigation and configuration maps such as merchant and platform navigation.

### `src/contexts`
Cross-cutting state for authenticated user, merchant scope, and storefront scope.

### `src/hooks`
Reusable hooks such as auth, merchant, storefront, debounce, pagination, media query, and query param utilities.

### `src/lib`
Core implementation utilities:

- API clients
- auth helpers and guards
- env configuration
- constants
- formatters
- schemas
- telemetry helpers
- tenant helpers
- low-level utilities

### `src/providers`
Global React providers such as auth, modal, query, and theme providers.

### `src/stores`
Small client state containers for cart, checkout, and UI state.

### `src/types`
Typed domain contracts for auth, merchants, catalog, orders, payments, settlements, receipts, subscriptions, notifications, storefronts, public commerce, and platform admin.

---

## Authentication and Session Strategy

The frontend should treat authentication as a backend-owned concern.

Current architecture should assume:

- the Django backend is the source of session truth
- JWT/session handling must be backend-aligned
- unsafe requests must respect CSRF requirements
- the frontend must not treat a cached client flag as proof of authentication
- route protection should be role-aware and server-truth-driven

Production rules:

- do not store sensitive auth state in local storage as source of truth
- do not assume refresh success without backend confirmation
- do not skip current-user/bootstrap checks
- handle logged-out, expired, and unauthorized states separately

Expected frontend auth flow:

1. bootstrap session and CSRF context
2. submit login or registration request
3. refresh or bootstrap where required by backend flow
4. fetch current user
5. redirect by role and onboarding state

---

## Tenant and Storefront Strategy

Mercora storefronts are tenant-aware.

Frontend responsibilities include:

- resolving storefront context from slug/host strategy
- rendering store-specific public pages
- isolating cart and checkout state by store
- keeping storefront legal, contact, and policy pages tenant-scoped
- ensuring receipt, order, and manual payment flows remain tied to the active storefront

This is why tenant helpers exist under `src/lib/tenant` and storefront-specific types, hooks, and API clients are isolated instead of mixed into merchant components.

---

## Payment Experience Model

Mercora uses a hybrid payment model.

### 1. Merchant-Direct Payment

Use when the merchant already collects local payments directly.

Frontend behavior:

- show merchant instructions clearly
- present manual payment / proof submission cleanly
- mark order as awaiting confirmation, not paid
- avoid promising receipt issuance until payment is confirmed
- show post-submission order tracking path

### 2. Platform-Managed Payment

Use when Mercora orchestrates secure checkout.

Frontend behavior:

- create payment session through backend
- redirect or continue through provider-backed flow
- never assume success from callback alone
- fetch backend-confirmed payment state after redirect
- show success, pending, and failed states explicitly

Supported provider direction:

- Flutterwave
- Paystack
- OPay-ready architecture

The frontend must remain provider-aware at the UX layer but provider-agnostic at the domain layer.

---

## Money and Currency Rules

The frontend must never become the financial source of truth.

It can display money. It cannot authoritatively decide money.

Key concepts that should remain explicit:

- base currency
- presentment currency
- charge currency
- settlement currency
- gross amount
- fees
- net amount
- refund amount
- dispute amount

Rules:

- show the currency actually being charged
- avoid fake or implied conversion guarantees
- rely on backend-calculated financial values
- keep receipts, settlements, and payouts visually unambiguous

---

## Design System and UI Standards

### Color tokens (source of truth: `src/app/globals.css`)

Colors are defined once as CSS custom properties and exposed as Tailwind utilities. **Do not add raw hex values (`bg-[#…]`) or copy-paste gradient strings into components — reference a token.**

| Token | Value | Use |
|---|---|---|
| `--neutral-2` | `#0b1224` | Base app background → `bg-[color:var(--neutral-2)]` |
| `--neutral-1` | `#040a18` | Deepest background → `bg-[color:var(--neutral-1)]` |
| `--text-on-light` | `#1a2452` | Dark text on white/light surfaces (e.g. the white secondary buttons) — 14.81:1 on white |
| `--brand-1` … `--brand-12` | Radix "Iris" dark scale | Brand accent; step 9 (`#5b5bd6`) is the solid fill, step 11 (`#b1a9ff`) is accessible brand-tinted text (8.87:1 on `--neutral-2`) |
| `--brand-gradient` | `135deg, --brand-9 → #3b82f6` | The primary CTA gradient → `<Button variant="brand">` or `bg-[image:var(--brand-gradient)]` |
| `--success-* / --warning-* / --error-*` | Radix Green/Amber/Red dark scales | Semantic states |

Sourcing: values are copied verbatim from the `@radix-ui/colors` dark-mode scales (Iris for brand, Green/Amber/Red for semantic states); the neutrals are the values already established across the app, kept as-is rather than swapped for a generic gray scale.

**Badge/pill rule (verified, not a style preference):** solid semantic fills with white text *fail* WCAG AA for green (`--success-9`, 3.16:1) and red (`--error-9`, 3.91:1). Use the subtle pattern instead — step-3 background + step-11 text (7.75–10.26:1). Brand step 9 with white text is the exception (5.37:1, passes).

**Named utilities, not arbitrary-value brackets.** Every solid-color token above is used as a plain Tailwind utility (`bg-neutral-2`, `text-ink`, `bg-neutral-auth-bg`, etc.), not `bg-[color:var(--x)]` — the bracket form works too, but the named form is what the `@theme inline` mappings exist for. The one exception is `bg-[image:var(--brand-gradient)]`: gradients are `background-image`, not `background-color`, so there's no equivalent named utility for it in the `--color-*` namespace.

The 4 near-miss dark backgrounds found during the audit (`#050913`, `#111827`, `#0a1022`, `#06080F`) were resolved individually rather than folded into `neutral-1`/`neutral-2` as a batch — computed perceptual distance (ΔE) showed `#0a1022` was an imperceptible duplicate of `neutral-2` (ΔE 0.84, folded in), while the other three were each a distinct, real surface role (`--neutral-auth-bg`, `--neutral-sidebar`, `--neutral-panel` — see table above) that would have visibly shifted if forced onto the main two.

**The shadcn light/dark tokens (`--background`, `--primary`, etc.) are resolved, not removed.** They were scaffolding from the original `create-next-app`/shadcn init — `.dark` is never applied anywhere (confirmed: zero `dark:` variants in app code) and zero `src/components/ui/*` primitives were imported anywhere outside that folder itself (confirmed via import search). Rather than delete the tokens, they're now re-pointed at the real brand/neutral values above instead of the original unmodified gray `oklch(X 0 0)` placeholders — so if `<Button>` or any primitive is ever actually reached for, it renders correctly instead of gray. `:root` and `.dark` are kept identical for this same reason, in case a real toggle is added later.

10 of the 11 `src/components/ui/*` primitive files (`checkbox`, `form`, `input`, `label`, `radio-group`, `select`, `slider`, `sonner`, `switch`, `textarea`) were deleted — each had zero imports anywhere, and several (`checkbox`, `select`, `slider`, `switch`, `radio-group`, `label`) referenced `@radix-ui/react-*` packages that were never even in `package.json`, meaning they couldn't have rendered if imported. `button.tsx` was kept — it holds the real `brand` variant and the touch-target size fix, and is the intended canonical home for the gradient even though no page currently imports `<Button>` directly yet (real CTAs still hand-roll `className`; wiring them to the component is further follow-up, not done here). Three now-orphaned npm packages (`sonner`, `react-hook-form`, `@hookform/resolvers`) were also removed — the latter two were dead imports inside the login form itself (`useForm`/`zodResolver` imported but never called; the form actually validates via a direct `loginSchema.safeParse()` call).

Mercora’s frontend must remain:

- premium
- polished
- modern SaaS-grade
- readable
- calm under high-information screens
- visually consistent with the existing project direction

Non-negotiables:

- do not introduce a new color system
- do not redesign the visual identity casually
- maintain clear hierarchy and spacing rhythm
- ensure tables, filters, forms, and cards feel like one system
- keep admin and merchant surfaces operational rather than decorative

---

## Responsiveness Rules

Mercora is mobile-first, but not mobile-only.

All major pages should remain usable at:

- 320px
- 375px
- 390px
- 414px
- 768px
- 1024px
- 1280px
- 1440px
- 1536px
- ultrawide where relevant

Required standards:

- no horizontal overflow
- no unusable tables on phones
- no tiny tap targets
- drawers/sheets for mobile navigation where needed
- responsive card and stats layouts
- forms that remain usable on narrow widths
- platform and merchant data screens that degrade gracefully on smaller screens

---

## Accessibility Rules

Production-quality accessibility standards should include:

- semantic headings — **spot-checked**: `<h1>` usage is widespread and structurally sound (107 files); homepage/merchant-dashboard h1s live in their `*Client.tsx`/Hero components rather than the thin `page.tsx` wrappers
- explicit labels for all controls — **partially verified**: the login form's `FloatingInput` has correct `htmlFor`/`id` label association, plus `aria-invalid`/`aria-describedby` wired to its error state (was missing — screen reader users previously got no indication a field was invalid). Not yet swept across every other form.
- keyboard-accessible menus, drawers, and dialogs — **verified for the mobile nav drawer**: real focus trap (Tab/Shift+Tab cycle within it while open) and focus restoration to the trigger button on close, plus pre-existing Escape-key handling. Not yet checked for other dialogs/menus.
- focus visibility on interactive controls — **verified**: the base `Button` component's `focus-visible:ring-[3px]` is real and present
- readable color contrast — **computed and fixed where found**: `FloatingInput`'s resting label color was a real, computed WCAG AA failure (3.68:1, needs 4.5:1) — fixed to 6.83:1. Solid green/red fills with white text also fail (3.16:1/3.91:1) — documented in Design System and UI Standards as a pattern to avoid (use the subtle badge pattern instead).
- loading and empty states that are understandable to non-visual users — not yet audited
- descriptive button text instead of vague action labels — not yet audited

---

## State Management Strategy

Mercora uses multiple state categories and they should stay separated.

### Server State
Use typed API clients and query orchestration for remote data.

### Cross-App UI Context
Use contexts/providers for auth, current merchant, and current storefront.

### Small Client State
Use lightweight stores for:

- cart
- checkout session drafting
- temporary UI state

Avoid turning client stores into shadow databases.

---

## API Integration Strategy

The frontend is tightly coupled to a Django + DRF backend through a domain-based API layer.

Current API client areas include:

- auth
- analytics
- catalog-public
- customers
- merchant-operations
- merchants
- notifications
- payout-batches
- platform-admin
- public-commerce
- storefront-public
- storefronts
- subscriptions
- support

Rules:

- keep domain clients separated
- normalize errors at the API layer
- keep request/response types explicit
- do not scatter raw endpoint strings across UI components
- do not mix storefront public flows with merchant private flows
- do not make the frontend responsible for backend truth reconciliation

---

## Environment Variables

Full authoritative list with inline documentation: `.env.example` (copy to `.env.local` for local dev). Summary:

### Required

```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
```

`NEXT_PUBLIC_API_URL` should point to the Django backend origin, not just `/api`. `NEXT_PUBLIC_SITE_URL` is used for sitemap generation and canonical/OpenGraph URLs — **this previously drifted out of sync** (see Known Issues Fixed below); both now derive from the same env var everywhere it's needed.

### Auth cookie names (must match backend)

```bash
NEXT_PUBLIC_CSRF_COOKIE_NAME=csrftoken
AUTH_ACCESS_COOKIE_NAME=access_token
AUTH_REFRESH_COOKIE_NAME=refresh_token
```

### On-demand revalidation

```bash
REVALIDATE_SECRET=            # required for POST /api/revalidate to work at all
```

### Error monitoring (optional)

```bash
NEXT_PUBLIC_SENTRY_DSN=        # blank = disabled, no account needed for local dev
SENTRY_ENVIRONMENT=
SENTRY_ORG=                    # source-map upload only — safe to leave unset
SENTRY_PROJECT=                # source-map upload only — safe to leave unset
SENTRY_AUTH_TOKEN=              # source-map upload only — safe to leave unset
```

### Author / socials (footer, metadata)

```bash
NEXT_PUBLIC_AUTHOR_NAME=
NEXT_PUBLIC_AUTHOR_GITHUB=
NEXT_PUBLIC_AUTHOR_LINKEDIN=
NEXT_PUBLIC_AUTHOR_TWITTER=
```

### Notes

- use environment-specific files such as `.env.local` for local development
- keep secrets out of public client variables — anything prefixed `NEXT_PUBLIC_` is inlined into the client bundle and visible to anyone
- public env vars should only contain values safe for browser exposure
- `.env.production` should mirror this structure with real production values (never commit real secrets)

---

## Getting Started

1. `cp .env.example .env.local` and fill in real values (defaults work for local dev against a locally-running backend).
2. Install dependencies: `npm install`.
3. Point `NEXT_PUBLIC_API_URL` at the Django backend.
4. Start the development server: `npm run dev`.
5. Confirm that auth, merchant, storefront, and platform pages can all communicate with the backend.
6. Confirm the app itself and its backend dependency are both reachable: `curl http://localhost:3000/api/health/`

Or, with Docker (production-parity build using the `standalone` output):

```bash
docker build --build-arg NEXT_PUBLIC_SITE_URL=http://localhost:3000 \
              --build-arg NEXT_PUBLIC_API_URL=http://localhost:8000 \
              -t mercora-frontend .
docker run -p 3000:3000 mercora-frontend
```

---

## Development Commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
```

If you use a different package manager, keep command equivalents consistent.

Note: `next lint` was removed in Next.js 16 — `npm run lint` now runs `eslint .` directly against a native flat config (`eslint.config.mjs`), not the old `.eslintrc.cjs` format.

---

## Suggested Working Conventions

When adding or changing frontend functionality:

- keep route ownership strict
- add types before wiring UI when the contract is new
- keep platform admin concerns out of merchant components
- keep merchant concerns out of public storefront code
- keep marketing content free from dashboard assumptions
- return full fixed files during implementation work
- prefer exactness over abstraction for its own sake

---

## Error, Empty, and Loading States

Every serious page should provide all three.

### Loading

- skeletons or stable loading panels
- avoid layout shift where possible

### Empty

- tell the user what is missing
- provide a next action where appropriate

### Error

- clear, calm language
- retry path if possible
- never expose raw backend internals in the UI unnecessarily

---

## Performance Standards

Frontend performance expectations include:

- fast first render for public pages
- controlled bundle growth
- selective client components only where necessary
- route-based splitting through App Router
- stable image/meta asset generation
- minimal unnecessary re-renders in dashboard surfaces

---

## Security Standards

Frontend security rules:

- do not store auth truth in local storage
- respect CSRF for unsafe methods
- keep withCredentials behavior aligned to backend policy
- do not trust redirect success for payments
- do not expose privileged platform or merchant screens without backend-validated access
- treat all financial and operational status as backend-owned truth

**Production security headers** (`next.config.ts`, prod builds only — CSP is easy to fight with during local dev/HMR so it's intentionally scoped out of `DEBUG`/dev mode):

- `Content-Security-Policy` — restricts scripts/styles/images/connections to this origin, the Django API origin, and a short explicit allowlist (Vercel Analytics, Google Fonts, Cloudinary/Unsplash for images)
- `X-Frame-Options: DENY`, plus `frame-ancestors 'none'` in the CSP (clickjacking)
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` — disables camera/microphone/geolocation, which this app doesn't use

If you add a new external script or API host, update both `next.config.ts`'s CSP directives and the `img-src`/`connect-src` entries — a silently-blocked request (CSP violations fail closed, not with a helpful error) is a common source of "works locally, broken in prod" bugs.

---

## Testing and QA Checklist

**Current automated test status (verify before trusting this section — status can drift):**

- **Type checking**: `npx tsc --noEmit` — clean.
- **Lint**: `npm run lint` — 0 errors, 80 warnings (mostly `react-hooks/exhaustive-deps` and a few unused imports). Not yet fixed; safe to fix incrementally, none block a build.
- **Unit/component tests**: **none configured.** No Jest or Vitest setup exists yet. This is a real gap for a project this size — worth adding (Vitest + React Testing Library is the natural fit for a Next.js App Router project) before relying on this checklist alone for confidence.
- **E2E tests**: **scaffolded but not implemented.** `e2e/*.spec.ts` exist (auth, onboarding, merchant-dashboard, merchant-orders, managed-checkout-flow, manual-payment-flow, receipt-flow, platform-admin, marketing) but every file is currently empty, and `@playwright/test` is not in `package.json`. The file names describe the intended coverage — treat them as a to-do list, not existing tests. `npm test`/`npm run e2e` do not currently exist as scripts.
- **Build**: `npm run build` succeeds in any environment with normal internet access (Vercel, GitHub Actions). It will fail in network-restricted sandboxes specifically because `next/font/google` needs to fetch font files at build time — that's an environment limitation, not an app bug.

Before considering a frontend change complete, manually verify:

- marketing pages render and navigate correctly
- auth flows handle logged-out, invalid, expired, and success states
- merchant pages behave correctly when no merchant is active
- storefront pages handle missing stores, empty carts, pending checkout, failed checkout, and successful checkout
- platform pages handle list, detail, loading, error, and empty states
- layouts remain stable across small and large screens
- build passes without route/type errors

Recommended checks:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

- manual viewport sweep across mobile, tablet, laptop, and desktop

---

## Containerization and CI/CD

- **Dockerfile**: multi-stage (`deps` → `builder` → `runner`), using Next.js's `output: "standalone"` build for a minimal production image. `NEXT_PUBLIC_*` values must be passed as Docker build args (they're inlined into the client bundle at build time, not read at container start). Production deployment is Vercel — this Dockerfile is for local dev-parity testing and as an optional self-hosting path, not the primary deploy target.
- **GitHub Actions** (`.github/workflows/ci.yml`): on every push/PR to `main` — install → `tsc --noEmit` → `npm run lint` → `npm run build`.

---

## Deployment Notes

**Confirmed production hosting:**

- **Vercel** — this frontend
- **Render** — Django backend (web + worker services) + managed Redis
- **Neon** — managed PostgreSQL (backend)
- Media/static assets via Cloudinary (backend-owned)

Deployment concerns:

- ensure frontend origin is trusted by backend CORS/CSRF settings (`FRONTEND_ORIGINS` on the backend)
- ensure `NEXT_PUBLIC_API_URL` points to the correct backend origin
- ensure `NEXT_PUBLIC_SITE_URL` matches the actual production domain — sitemap/robots/OpenGraph URLs all derive from it
- verify payment callbacks and post-payment UX against production URLs
- verify SEO files, manifest, sitemap, and robots behavior in production
- set `REVALIDATE_SECRET` if any on-demand ISR revalidation is wired up
- CI green on `main` before deploying

---

## Known Architectural Principles

Mercora frontend should continue to respect these rules:

- frontend is not financial truth
- backend is authoritative for payment, receipt, and settlement state
- domain boundaries matter
- route groups should map to product surfaces cleanly
- UI must remain production-grade and highly responsive
- platform admin, merchant, storefront, and marketing should remain clearly separated
- maintainability matters as much as appearance
