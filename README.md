# FixItNow — Frontend

A marketplace web application that connects home-service customers with local technicians, with three
separate role experiences: **Customer**, **Technician**, and **Admin**. Customers browse and book
services, technicians publish services and manage their jobs, and admins oversee users, bookings,
and service categories. Payments are handled by a redirect-based hosted checkout, with the frontend
observing the result by polling.

The app is built with the Next.js App Router and talks to a separate FixItNow backend API through
server actions and a thin set of route handlers acting as a backend-for-frontend proxy.

---

## Table of Contents

1. Overview
2. Features
3. Tech Stack
4. Prerequisites
5. Getting Started
6. Environment Variables
7. Available Scripts
8. Project Structure
9. Routing Map
10. Roles and Access Control
11. Architecture and Data Flow
12. Conventions and Notes
13. Deployment

---

## Overview

**What it is**

- A public marketing and browsing site: home page, services directory, service detail, about, and
  contact.
- Three authenticated dashboards, one per role, sharing a common shell (sidebar, topbar with
  breadcrumbs, and a theme toggle).
- A payment flow where the backend creates a hosted checkout session, returns a checkout URL, and
  the customer is redirected back to the bookings page once they finish.

**Key architectural traits**

- **Server-first rendering.** Most reads happen in Server Components via server actions that call the
  backend directly with the session token read from cookies.
- **BFF proxy.** A small set of route handlers under `app/api/auth` mirrors the backend auth
  endpoints so the browser never talks to the backend domain directly.
- **Client cache.** TanStack Query handles client-side reads, mutation retries, and cache
  invalidation with tags.
- **Route-level access control.** Middleware decodes the role claim from the JWT cookie and
  redirects before a protected page renders.

---

## Features

### Public

- **Home** — hero, service category grid, how-it-works timeline, top-rated technicians, trust strip,
  FAQ, and a call-to-action section.
- **Services directory** — paginated list with text search and category filtering driven by
  `search`, `category`, and `page` query parameters.
- **Service detail** — full service record, technician card, embedded reviews, and a booking modal.
- **About** and **Contact** — static informational pages.
- **Booking modal** — date/time slot, service address, and notes, with client-side validation that
  the slot is in the future and the address matches the technician's service area.

### Customer

- **Overview** — profile summary, booking history, and total amount spent.
- **Bookings** — list of bookings with status badges, cancel dialog, payment actions, review dialog,
  and a polling watcher that detects when a payment completes.
- **Payments** — payment history with total spend and a receipt detail dialog.
- **Profile** — account record card.
- **Reviews** — leave a 1–5 star rating and comment on a completed booking.

### Technician

- **Overview** — booking and earnings summary.
- **Profile** — edit bio, skills, hourly rate, years of experience, service area, and account
  details.
- **Availability** — weekly schedule editor; add or remove time blocks per day of the week, saved as
  a whole-schedule replacement.
- **Services** — create and manage the technician's own service listings with title, description,
  category, price, and duration.
- **Bookings** — accept, decline, start, and complete jobs, each applied optimistically in the UI.

### Admin

- **Overview** — aggregated stats across users, bookings, and categories, with revenue computed from
  paid bookings.
- **Users** — paginated table with role and status filters, text search, and a ban/unban dialog.
- **Bookings** — filterable by status and date range, paginated, with a booking detail dialog.
- **Categories** — create new service categories.
- **Profile** — account record card.

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16.2.12 (App Router, dev server runs on webpack) |
| UI runtime | React 19.2.4, React DOM 19.2.4 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS v4, `tw-animate-css` |
| Component primitives | Radix UI, CVA, `clsx`, `tailwind-merge`, shadcn-style local components |
| Icons | lucide-react |
| Server cache and state | TanStack Query v5 |
| Theming | next-themes with class strategy and system default |
| Toasts | sonner |
| Validation | zod |
| Auth plumbing | jsonwebtoken types plus JWT payload decoding at the edge |
| HTTP | native fetch with undici support for server-side calls |
| Runtime guard | `server-only` on server-only modules |

---

## Prerequisites

- **Node.js** — a version supported by Next.js 16 (Node.js 20 or newer recommended).
- **npm** — ships with Node.js. Any package manager that can read `package-lock.json` works.
- **A running FixItNow backend API** — the frontend has no local data source; it needs the backend
  base URL to render data.

---

## Getting Started

**1. Install dependencies**

```bash
npm install
```

**2. Configure the environment**

Create a `.env.local` file in the project root and set both variables to your backend base URL,
including the scheme, with no trailing slash:

```bash
NEXT_PUBLIC_BACKEND_URL=<your-backend-base-url>
BACKEND_URL=<your-backend-base-url>
```

Replace the placeholder with the actual origin of your backend instance. If neither variable is set,
the app falls back to a hardcoded hosted backend URL defined in `lib/backend.ts`.

**3. Start the development server**

```bash
npm run dev
```

The app is served on the standard Next.js development port.

**4. Open the app and sign in**

Use a customer, technician, or admin account. After login you are redirected to the dashboard home
for your role.

**Production build**

```bash
npm run build
npm start
```

---

## Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_BACKEND_URL` | Optional | Backend base URL exposed to the browser bundle. Used by `lib/backend.ts` to resolve the API origin. |
| `BACKEND_URL` | Optional | Backend base URL for server-side calls. Falls back to the same hosted default when the public variable is absent. |
| `NODE_ENV` | Set by Next.js | Controls whether auth cookies are issued with the `secure` flag. Set automatically in production builds. |

Notes:

- All `.env*` files are excluded from version control by `.gitignore`.
- Never commit backend credentials or secrets. The frontend only needs the base URL.
- `lib/backend.ts` is the single place that resolves the backend origin. If you add a new module that
  needs the API host, import from there rather than reading `process.env` directly.

---

## Available Scripts

| Script | Command | What it does |
| --- | --- | --- |
| `dev` | `next dev --webpack` | Starts the dev server with hot reload on webpack. |
| `build` | `next build` | Produces an optimized production build. |
| `start` | `next start` | Serves the production build. |
| `lint` | `eslint` | Runs ESLint across the project using the flat config. |

There is no automated test suite configured in this project. Verification is currently manual:
run the dev server and exercise the flows for each role.

---

## Project Structure

```text
.
├── app/
│   ├── layout.tsx                  # Root layout: fonts, Providers, Toaster
│   ├── providers.tsx               # QueryClientProvider + ThemeProvider + AuthProvider
│   ├── globals.css                 # Tailwind entry and global styles
│   ├── loading.tsx                 # Global route loading state
│   ├── error.tsx                   # Global error boundary
│   ├── not-found.tsx               # Global 404
│   │
│   ├── (public-route)/             # Public site: home, about, contact, services
│   │   ├── layout.tsx              # Header + Providers + Toaster + Footer
│   │   ├── page.tsx                # Home page
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── services/
│   │   │   ├── page.tsx            # Services directory
│   │   │   └── [id]/               # Service detail + generateMetadata + not-found
│   │   ├── _actions/               # Server actions for public reads + booking creation
│   │   └── _components/            # home/, about/, contact/, services/, service-details/
│   │
│   ├── (auth)/                     # Login and register
│   │   ├── layout.tsx
│   │   ├── login/page.tsx          # Honours the ?next= query parameter
│   │   ├── register/page.tsx       # Customer vs technician form switch
│   │   ├── _actions/authAction.ts
│   │   └── _components/            # LoginForm.tsx, RegisterForm.tsx
│   │
│   ├── (dashboaredGroup)/          # All three role dashboards (note the folder spelling)
│   │   ├── layout.tsx              # Server: reads role, renders DashboardShell
│   │   ├── error.tsx
│   │   ├── dashboard/              # CUSTOMER
│   │   ├── technician-dashboard/   # TECHNICIAN
│   │   ├── admin-dashboard/        # ADMIN
│   │   ├── _actions/               # ~20 server actions for all dashboard reads/writes
│   │   └── _components/            # Overviews, boards, dialogs, badges, pagination
│   │
│   ├── api/auth/                   # BFF proxy route handlers
│   │   ├── login/route.ts          # POST  -> sets httpOnly accessToken cookie
│   │   ├── logout/route.ts         # POST  -> clears cookie
│   │   ├── me/route.ts             # GET   -> current user
│   │   └── register/route.ts       # POST  -> creates account
│   │
│   └── payment/cancel/page.tsx     # Landing page after a cancelled checkout
│
├── components/
│   ├── theme-toggle.tsx
│   ├── dashboard/                  # shell.tsx, sidebar.tsx, topbar.tsx, nav.ts
│   ├── shared/                     # header.tsx, mobile-nav.tsx, footer.tsx, user-menu.tsx
│   └── ui/                         # Local UI primitives (badge, button, card, dialog, ...)
│
├── contexts/
│   └── auth-context.tsx            # AuthProvider + useAuth hook
│
├── lib/
│   ├── backend.ts                  # Backend origin + token key/cookie names
│   ├── api.ts                      # Server-only: serverFetch, serverFetchPage, getRole
│   ├── api-client.ts               # Client: apiFetch with retry + timeout
│   ├── fetch-backend.ts            # Server-side fetch wrapper
│   ├── client-fetch.ts
│   ├── http.ts                     # routeError() helper for route handlers
│   ├── types.ts                    # Role, statuses, and all entity/list-item types
│   ├── booking-status.ts           # ACTIVE_STATUSES, nextActionsForBooking()
│   └── utils.ts                    # cn(), formatBDT(), formatDate(), formatDateTime()
│
├── public/                         # Static assets
├── middleware.ts                   # Auth and role-based route protection
├── next.config.ts                  # Next config (allowed remote image hosts)
├── components.json                 # shadcn/ui component registry config
├── tailwind + postcss configs
├── tsconfig.json                   # Path alias: @/* -> ./*
├── API_INTEGRATION.md              # Endpoint-by-endpoint reference for the backend
└── eslint.config.mjs               # Flat ESLint config
```

---

## Routing Map

### Public

| Route | Page | Notes |
| --- | --- | --- |
| `/` | `app/(public-route)/page.tsx` | Composed from the `home/` component folder. |
| `/services` | `app/(public-route)/services/page.tsx` | Reads `search`, `category`, `page` params. |
| `/services/[id]` | `app/(public-route)/services/[id]/page.tsx` | `generateMetadata`, includes booking modal. |
| `/about` | `app/(public-route)/about/page.tsx` | Static. |
| `/contact` | `app/(public-route)/contact/page.tsx` | Static. |
| `/login` | `app/(auth)/login/page.tsx` | Redirects to `?next=` after sign-in. |
| `/register` | `app/(auth)/register/page.tsx` | Customer or technician signup. |
| `/payment/cancel` | `app/payment/cancel/page.tsx` | Post-cancel landing, reads `tran_id`. |

### Customer — section label "My book"

| Route | Main component |
| --- | --- |
| `/dashboard` | `DashboardOverview` |
| `/dashboard/profile` | `Userprofile/record-card.tsx` |
| `/dashboard/bookings` | `BookingsList` + `PaymentConfirmWatcher` |
| `/dashboard/payments` | `PaymentsList` |

### Technician — section label "Workshop"

| Route | Main component |
| --- | --- |
| `/technician-dashboard` | `TechnicianOverview` |
| `/technician-dashboard/profile` | `TechnicianProfileForm` |
| `/technician-dashboard/availability` | `AvailabilitySheet` |
| `/technician-dashboard/services` | `ServicesBoard` |
| `/technician-dashboard/bookings` | `TechnicianBookings` |

### Admin — section label "Operations"

| Route | Main component |
| --- | --- |
| `/admin-dashboard` | `AdminOverview` |
| `/admin-dashboard/profile` | `Userprofile/record-card.tsx` |
| `/admin-dashboard/users` | `UsersBoard` |
| `/admin-dashboard/bookings` | `AdminBookingsBoard` |
| `/admin-dashboard/categories` | `AdminCategoriesBoard` |

Every dashboard page ships a sibling `loading.tsx` skeleton, so adding a page should include one.

The sidebar configuration lives in `components/dashboard/nav.ts` and is the single source of truth for
navigation labels, section names, breadcrumbs, and page titles.

---

## Roles and Access Control

`middleware.ts` runs on every navigation except API routes, Next.js internals, and static image
files. It decodes the `role` claim from the JWT payload found in the `fin_token` cookie **without
verifying the signature** — this is fine because the cookie is only used for routing decisions here;
real authorization is enforced by the backend, which validates the token on every request.

Rules applied:

1. **Public routes** — `/`, `/services`, `/about`, `/contact`. Anonymous visitors may browse these.
2. **Auth routes** — `/login`, `/register`. An already-authenticated user is redirected to their role
   home instead of seeing the form.
3. **Unauthenticated access** to any non-public route redirects to `/login` with the attempted path
   preserved in the `next` query parameter, so login can return the user where they were going.
4. **Unreadable token** — if a token exists but the role claim cannot be decoded, the cookie is
   cleared and the user is sent to login.
5. **Role guard** — the three dashboards each require a specific role; a mismatch redirects the user
   to their own dashboard home rather than showing a 403.

| Path prefix | Required role |
| --- | --- |
| `/dashboard` | `CUSTOMER` |
| `/technician-dashboard` | `TECHNICIAN` |
| `/admin-dashboard` | `ADMIN` |

Role-to-home mapping: `CUSTOMER` to `/dashboard`, `TECHNICIAN` to `/technician-dashboard`, `ADMIN`
to `/admin-dashboard`.

**Client session state:** `contexts/auth-context.tsx` exposes `user`, `status`, `isAuthenticated`,
`role`, `setUser`, `refresh`, `login`, and `logout`. It resolves the session on mount and on every
pathname change by calling the local `/api/auth/me` route, and exposes a tri-state `status` of
`loading`, `authenticated`, or `unauthenticated`.

---

## Architecture and Data Flow

**Server-side reads.** Server actions in the `_actions` folders import `serverFetch` or
`serverFetchPage` from `lib/api.ts`. These are `server-only` modules: they read the access token from
the request cookies, attach it as a bearer header, call the backend with caching disabled, unwrap the
response envelope, and throw `ApiError` with the backend's message and status on any non-success
response. `serverFetchPage` additionally normalizes paginated payloads and returns `{ data, meta }`.

**Response envelope.** Every backend response follows the shape
`{ success, statusCode, message, data, meta, errorDetails }`. Both server and client helpers unwrap
`data` and throw on `success: false`, so components never deal with the envelope directly.

**Client-side reads and writes.** `apiFetch` in `lib/api-client.ts` attaches the token from
localStorage, uses a five-second abort timeout, retries up to three times on network-level errors
(connection refused, reset, DNS failure, socket timeouts), and throws `ApiClientError` with the
backend message. Components wrap it in TanStack Query hooks.

**Token storage.** Three layers, by design:

- An httpOnly `accessToken` cookie set by the login route handler — the secure, server-readable copy.
- A `fin_token` cookie — readable by middleware for routing decisions.
- `fin_token` in localStorage — read by `apiFetch` for client-side requests.

`setToken` and the logout route keep all three in sync. Cookies are issued with `SameSite=Lax`,
`Path=/`, and `secure` only in production.

**Cache invalidation.** Server actions that change data call into `app/(dashboaredGroup)/_actions/mutate.ts`,
which wraps `revalidateTag` and `revalidatePath`. Tags like `public-services` and `public-categories`
are revalidated after technician and admin writes so the public pages reflect changes.

**Optimistic updates.** Booking status transitions on the technician dashboard update the local
query cache immediately and roll back if the server rejects the change.

**Payment flow.** The customer requests a checkout session for an accepted booking; the backend
returns a hosted checkout URL which is opened in the browser. The hosted provider redirects back to
the bookings page on success or to `/payment/cancel` on abort. The actual confirmation is a
server-to-server webhook that the frontend never calls — instead `PaymentConfirmWatcher` polls the
bookings endpoint until the booking flips to a paid status.

**Money and dates.** The backend returns monetary values as strings. Convert with `Number()` for
arithmetic and display with `formatBDT()` in `lib/utils.ts`, which renders Bangladeshi Taka. Dates use
`formatDate` and `formatDateTime` with a British locale format, and all three helpers return an
em-dash placeholder for unparsable input.

**Error handling.** Every mutation surfaces a success or error toast via sonner, forms render inline
`role="alert"` messages, and each route group has an error boundary component so a failed fetch
degrades to an in-page error state rather than a blank screen.

---

## Conventions and Notes

- **Path alias:** `@/*` maps to the project root. Prefer it over long relative paths.
- **Folder name typo:** the dashboard route group is literally named `(dashboaredGroup)`, not
  `dashboardGroup`. It does not affect URLs, but match the existing spelling when adding files.
- **Server actions live in `_actions`:** co-locate them with the route group that uses them. The
  `(public-route)` and `(dashboaredGroup)` groups each have their own.
- **Components live in `_components`:** private to a route group. Only genuinely shared components
  belong in the top-level `components/` folder.
- **Underscore-prefixed folders** are private to the App Router and never create URL segments.
- **Types:** shared domain types and enriched list-item shapes belong in `lib/types.ts`. Booking
  status transitions and active-status sets belong in `lib/booking-status.ts`.
- **Backend origin:** always import `BACKEND_URL` from `lib/backend.ts` rather than reading env vars
  ad hoc.
- **No comments policy:** match the surrounding style, which is largely self-documenting code without
  inline commentary.
- **Detailed endpoint reference:** `API_INTEGRATION.md` documents every backend endpoint, its access
  rule, the exact frontend file that calls it, and sample request and response payloads. Consult it
  before adding or changing an API call.

---

## Deployment

The project is set up for Vercel deployment — a `.vercel` directory is present in the working tree
and is gitignored.

Before deploying:

1. Configure `NEXT_PUBLIC_BACKEND_URL` and `BACKEND_URL` as project environment variables. Note that
   the public variable is inlined into the client bundle at build time, so changing it requires a
   rebuild, not just a restart.
2. Add any image hostnames you serve avatars from to the `images.remotePatterns` array in
   `next.config.ts`.
3. Confirm the backend allows requests from the deployed origin.
4. Run `npm run build` locally to catch type and lint errors before pushing.

Because authorization is enforced by the backend, the frontend only needs the backend base URL and
the cookie names — no secrets belong in this repository.
