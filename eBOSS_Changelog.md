# eBOSS ePortal — Changelog
> **Status:** Active Development | **Started:** April 2026
> **Current Version:** v0.2.0
> **Tags:** `NEW` `IMPROVED` `FIX` `SECURITY` `REMOVED`

---

## Quick Reference (AI Context)

Use this section to get an instant read on the project state before diving into details.

| Key | Value |
|---|---|
| Project name | eBOSS ePortal |
| Workspace root | `mitcs boss/` |
| Frontend repo | `mitcs boss/blpo-boss/` |
| Backend repo | `mitcs boss/blpo-boss-api/` (currently dummy) |
| Frontend stack | React + Vite + Tailwind CSS |
| Backend stack | Laravel 11 + Sanctum + PostgreSQL |
| Auth method | Laravel Sanctum (token-based, Bearer header) |
| Current version | v0.3.0 — Register page done, auth wired, color rebrand to orange |
| Next milestone | v0.4.0 — Login page, protected routes, applicant dashboard stub |
| Reference system | EBIS 4.0 — Bacolod City MITCS (4-phase BOSS pipeline) |
| Legal basis | RA 11032 — Ease of Doing Business Act |

### What exists right now (v0.3.0)
- ✅ `Landing.jsx` — fully built, all sections complete
- ✅ `Register.jsx` — full form with validation, show/hide password, server error banner, spinner
- ✅ Axios token-based auth — Bearer token injected via request interceptor, 401 auto-logout
- ✅ Zustand auth store — `user`, `token`, `isAuthenticated`, `login()`, `logout()`, `register()`
- ✅ Laravel Sanctum configured for token-based auth (not cookie/stateful)
- ✅ MySQL connected (`bplo_db`), migrations run, test user created
- ✅ Primary color rebranded from `#1a4f8b` (blue) → `#ff9c43` (orange)
- ✅ Test user: `test@eboss.dev` / `password` (Al Christian)
- ❌ No `Login.jsx` yet
- ❌ No React Router / protected routes yet
- ❌ No applicant dashboard yet

### Target application flow (v1.0.0)
4 phases based on EBIS 4.0:
1. **Registration & Application** — wizard form, dynamic doc uploads, email confirmation
2. **BPLO Review & Departmental Clearance** — parallel routing to 11 departments, hard gate
3. **Assessment, Billing & Payment** — fee computation, GCash / PayMaya / DBP / Landbank / OTC, e-OR
4. **Permit Issuance** — QR-embedded PDF permit, auto-email, live QR database verification

---

## Version History

---

### v0.3.0 — Auth Wired + Register Page + Color Rebrand
**Date:** April 21, 2026 | **Status:** 🟢 Current

Register page built. Auth switched from cookie-based to token-based. Primary color rebranded from blue to orange. Backend migrated from PostgreSQL dummy to MySQL (`bplo_db`).

#### Frontend — `blpo-boss/`

**New files:**
- `src/pages/auth/Register.jsx` — full registration page

**Register.jsx features:**
- Fields: name, email, password, confirm password
- Client-side validation (all fields required, password match)
- Show/hide password toggle on both password fields
- Error banner for server-side auth errors (e.g. email already taken)
- Submit button shows spinner + disabled state while loading
- Redirects to `/dashboard` on success or if already authenticated
- `useEffect` clears all field errors on any input change
- Body scroll lock active on this page

**Auth layer:**
- `src/services/api.js` — token-based Axios setup
  - Reads Bearer token from Zustand store on every request via request interceptor
  - Removed `withCredentials: true` and all `initCsrf()` / `sanctum/csrf-cookie` logic
  - Response interceptor: auto-calls `logout()` + clears auth state on 401
- `src/store/auth.js` — Zustand store: `user`, `token`, `isAuthenticated`, `login()`, `logout()`, `register()`

**Color rebrand:**
- Primary color changed from `#1a4f8b` (blue) → `#ff9c43` (orange)
- All hover states, borders, and accent backgrounds updated to match orange theme

#### Backend — `blpo-boss-api/` (Laravel 11)

**Auth method changed:** cookie/stateful → token-based (Bearer)

**Fixes applied:**

| Issue | Fix |
|---|---|
| `tokens()` undefined error | Added `HasApiTokens` trait to `App\Models\User` |
| Missing DB tables | Ran `php artisan migrate` — created `personal_access_tokens`, `sessions`, `cache`, `jobs` |
| Duplicate migrations | Removed 3 duplicate `create_personal_access_tokens_table` files, kept original |
| Session driver error | Switched `SESSION_DRIVER` to `file` in `.env` (avoids `sessions` table dependency) |
| Invalid `.env` | Fixed broken `DB_CONNECTION` line — inline comments not supported in `.env` |
| Unknown database error | Created `bplo_db` MySQL database via phpMyAdmin before running migrations |
| CSRF mismatch on API | Added `validateCsrfTokens(except: ['api/*'])` to `bootstrap/app.php` |

**Config changes:**
- `App\Models\User` — added `use Laravel\Sanctum\HasApiTokens`
- `bootstrap/app.php` — CSRF excluded for `api/*` routes
- `SESSION_DRIVER=file` in `.env`
- Database switched: PostgreSQL `eboss_dummy` → MySQL `bplo_db`

**Test credentials:**
```
Name:     Al Christian
Email:    test@eboss.dev
Password: password
Created via: php artisan tinker
```

#### Pending → carry into v0.4.0
- `src/pages/auth/Login.jsx` — email + password form
- `src/routes/index.jsx` — full React Router setup
- `src/routes/ProtectedRoute.jsx` — auth guard
- `src/pages/applicant/Dashboard.jsx` — placeholder post-login page
- Wire landing page "Start Application" CTA through auth check

---

### v0.2.0 — Frontend Scaffold + Dummy Backend
**Date:** April 20, 2026 | **Status:** ✅ Superseded by v0.3.0

Landing page fully built. Full Laravel backend replaced with a minimal dummy for auth testing only. Development is frontend-first.

#### Frontend — `blpo-boss/`

**New files:**
- `src/pages/public/Landing.jsx` — complete public landing page

**Landing.jsx breakdown:**

| Section | Details |
|---|---|
| Navbar | Sticky, transparent → frosted on scroll, Log In + Register as `<Link>`, mobile menu state |
| Hero | Headline, 3 CTAs (Start Application `/apply`, Track Application `/track`, How It Works `#how-it-works`), mock app status card, stat counters (3 days / 1 day / 100%) |
| Agency Strip | DTI, SEC, BIR, BFP, LGU, SSS, PhilHealth, Pag-IBIG |
| How It Works | 4-step process: Create Account → Submit → Pay → Receive Permit |
| Business Types | Grid: Sole Prop, Partnership, Corp/OPC, Cooperative |
| Track Section | Reference number input → `useNavigate` to `/track?ref=` on submit + Enter key |
| Footer | Services, Government, Support columns + RA 10173 / DICT compliance note |
| Animations | Scroll-triggered fade/slide via custom `useInView` hook (IntersectionObserver) |

**Font:** DM Sans via Google Fonts

**Routing:**
- `<Link to="/login">` and `<Link to="/register">` in Navbar
- `useNavigate` for `/track?ref=` in TrackSection
- All route targets stubbed — not yet wired to real pages
- Requires: `npm install react-router-dom`

**Bugs fixed this version:**
- `useNavigate()` was placed inside `<button>` props (invalid) — moved to top of `TrackSection` function body
- `#root` in `index.css` had `width: 1126px` + `border-inline: 1px solid` causing black sidebars — fixed to `width: 100%`, removed border and auto margins

#### Backend — `blpo-boss-api/` (Laravel 11 — Dummy)

Scope: auth testing only. No feature controllers. No domain models beyond `User.php`.

**Endpoints:**
```
POST  /api/register  → creates user, returns Sanctum token
POST  /api/login     → validates credentials, returns Sanctum token
POST  /api/logout    → revokes current token  [auth required]
GET   /api/user      → returns authenticated user  [auth required]
```

**Config:**
- Database: PostgreSQL, DB `eboss_dummy`
- Sanctum stateful domains: `localhost`, `127.0.0.1`
- CORS origins: `http://localhost:5173`, `http://127.0.0.1:5173`
- `bootstrap/app.php` — `statefulApi()` active, `routes/api.php` bound
- `database/seeders/DatabaseSeeder.php` — seeds test user

**Test credentials:**
```
Email:    test@eboss.dev
Password: password
```

#### Pending → carry into v0.3.0
- `src/services/api.js` — Axios instance, base URL from `.env`, CSRF cookie call
- `src/store/auth.js` — Zustand: `user`, `token`, `isAuthenticated`, `login()`, `logout()`, `register()`
- `src/routes/index.jsx` — React Router `<Routes>` definition
- `src/routes/ProtectedRoute.jsx` — redirects to `/login` if unauthenticated
- `src/pages/auth/Login.jsx` — email + password form
- `src/pages/auth/Register.jsx` — name + email + password form
- Page stubs: `applicant/Dashboard.jsx`, `officer/Queue.jsx`, `admin/Users.jsx`

---

### v0.1.0 — Project Scaffold
**Date:** April 20, 2026 | **Status:** ✅ Superseded by v0.2.0

Initial repos created. Both frontend and backend initialized under `mitcs boss/` workspace.

#### Frontend — `blpo-boss/`
- `NEW` Vite + React project initialized
- `NEW` Tailwind CSS integrated
- `NEW` Folder structure scaffolded:
  ```
  src/
  ├── pages/
  │   ├── public/   auth/   applicant/   officer/   admin/
  ├── components/
  │   ├── ui/   layout/   shared/
  ├── hooks/   services/   store/   routes/   utils/
  ```
- `NEW` `package.json` — planned dependencies: `axios`, `react-router-dom`, `zustand`
- `NEW` `vite.config.js` — proxy to Laravel `:8000`, `@/` alias
- `NEW` `eslint.config.js` included

#### Backend — `blpo-boss-api/` (Laravel 11)
- `NEW` Laravel 11 created via Composer
- `NEW` Sanctum installed + published
- `NEW` All standard config files present
- `NEW` Default migrations: `users`, `cache`, `jobs`, `personal_access_tokens`
- `NEW` `.env.example` present, `artisan` accessible

---

## Planned Versions

---

### v0.4.0 — Login Page + Routing + Protected Routes *(Next)*
**Date:** TBD | **Status:** 🔵 Up Next

Wire login, establish React Router, protect authenticated routes.

- `NEW` `src/pages/auth/Login.jsx` — email + password form, calls Zustand `login()`, redirects to `/dashboard`
- `NEW` `src/routes/index.jsx` — full React Router `<Routes>` with all defined paths
- `NEW` `src/routes/ProtectedRoute.jsx` — checks `isAuthenticated`, redirects to `/login`
- `NEW` `src/pages/applicant/Dashboard.jsx` — placeholder authenticated landing page
- `NEW` `main.jsx` wrapped with `<BrowserRouter>`
- `NEW` Landing page "Start Application" CTA wired through auth check → `/apply` or `/login`

---

### v1.0.0 — Initial Release *(Planned)*
**Date:** TBD | **Status:** 🔵 Upcoming

First full working version. Sole proprietorship permit end-to-end. Full Laravel backend replaces dummy. Based on EBIS 4.0.

#### Phase 1 — Registration & Application
- `NEW` New business pathway — email registration, data matched against DTI records
- `NEW` Renewal pathway — login via Business Permit No. + Business Account No.
- `NEW` `ApplicationWizard.jsx` — multi-step form, conditional field rendering (`isRented`, franchise type, entity type)
- `NEW` Dynamic document uploads:
  - Sole Prop → DTI Registration
  - Corporation → SEC Registration + Board Resolution / Secretary's Certificate + SPA with ID
  - Cooperative → CDA Registration
  - All → Owner's valid ID
  - Rented → Lease Contract
  - Franchise → Written Franchise Agreement
- `NEW` On submission: system emails unified application form to applicant

#### Phase 2 — BPLO Review & Departmental Clearance
- `NEW` BPLO formal review queue — initial document check
- `NEW` Simultaneous routing to all departments: BRGY, BFP, Zoning, CHO, OBO, BENRO, BTTMD, City Administrator, City Veterinarian, City Agriculture, Tourism Office
- `NEW` `DepartmentDashboard.jsx` — real-time Pending / Approved / Denied badge per department
- `NEW` Hard gate — Phase 3 locked until every department returns Approved

#### Phase 3 — Assessment, Billing & Payment
- `NEW` Fee computation based on verified business data
- `NEW` Formal billing statement generation
- `NEW` Online payments: GCash, PayMaya, DBP Visa, Landbank
- `NEW` OTC payment slip for treasury counter
- `NEW` Webhook handler → auto-generates Electronic Official Receipt (e-OR)

#### Phase 4 — Permit Issuance & Tracking
- `NEW` QR code generation — hashed permit ID embedded in Mayor's Permit
- `NEW` `PermitService` — PDF generation with QR embed
- `NEW` Auto-email permit PDF to applicant on issuance
- `NEW` QR scan cross-references live database for document validity check
- `NEW` Public status tracker — Application No. + Business Account No. lookup (no login)

#### Backend (Full Laravel replaces dummy)
- `NEW` All Phase 1–4 controllers, models, services
- `NEW` `DepartmentClearance` model — one row per department per application
- `NEW` `QRService` — hashes permit ID, returns QR
- `NEW` `PermitService` — PDF generation
- `NEW` `StorageService` — S3 / MinIO
- `NEW` `NotifyService` — email (unified form + permit PDF)
- `NEW` `PaymentService` — GCash, PayMaya, DBP, Landbank webhook handling

#### Admin
- `NEW` Admin panel — user management, role assignment, fee config, audit logs

---

### v1.1.0 — Planned
**Date:** Q3 2026 | **Status:** 🔵 Upcoming

SMS + corp/partnership support + renewal workflow.

- `NEW` SMS notifications via Semaphore API
- `NEW` Partnership + Corporation/OPC registration (SEC docs, Board Resolution flow)
- `NEW` In-portal messaging — applicant ↔ BPLO officer thread
- `NEW` Renewal workflow — auto-alert 30 days before permit expiry
- `IMPROVED` Document checklist fully dynamic across all business types
- `IMPROVED` Fee breakdown displayed before payment confirmation
- `FIX` File upload limit raised: 5MB → 10MB per document

---

### v1.2.0 — Planned
**Date:** Q4 2026 | **Status:** 🔵 Upcoming

BIR integration + mobile + 2FA.

- `NEW` BIR Form 1901 / 1903 pre-fill from applicant profile
- `NEW` BIR RDO locator by business address
- `NEW` Mobile-responsive redesign (all applicant-facing pages)
- `NEW` Cooperative registration support (CDA)
- `IMPROVED` BPLO dashboard analytics — volume, SLA compliance, rejection rate
- `IMPROVED` Search + filter in application queue
- `SECURITY` Mandatory 2FA for all BPLO officer and admin accounts

---

### v2.0.0 — Roadmap
**Date:** 2027 | **Status:** 🟡 Planned

Multi-LGU platform, PhilSys auth, full agency integrations.

- `NEW` Multi-LGU — single platform, separate instances per city/municipality
- `NEW` PhilSys / National ID authentication
- `NEW` SSS, PhilHealth, Pag-IBIG employer registration modules
- `NEW` Open data API for DICT compliance
- `NEW` Offline mode for low-connectivity areas
- `NEW` Native mobile apps (iOS + Android)
- `IMPROVED` Full WCAG 2.1 AA accessibility audit + remediation
- `REMOVED` Legacy paper-form upload — replaced by structured digital forms

---

## Tech Decisions Log

| Layer | Choice | Status | Notes |
|---|---|---|---|
| Frontend | React + Vite + Tailwind CSS | ✅ Confirmed | |
| Backend | Laravel 11 | ✅ Confirmed | |
| Auth | Laravel Sanctum (token-based, Bearer header) | ✅ Confirmed | Switched from cookie/stateful in v0.3.0 |
| Database | MySQL (`bplo_db`) | ✅ Confirmed | Switched from PostgreSQL in v0.3.0 |
| Cache / Queue | Redis | ✅ Confirmed | Laravel Horizon for async jobs |
| State management | Zustand | 🟡 Leaning confirmed | Lightweight, simple API |
| File storage | AWS S3 or MinIO | ❌ Pending | Budget/hosting dependent |
| Payment | GCash, PayMaya, DBP Visa, Landbank | 🟡 Pending | Via PayMongo or DragonPay |
| SMS | Semaphore | ❌ Pending | vs Globe — needs confirmation |
| QR (frontend) | qrcode.react | ❌ Pending | |
| QR (backend) | SimpleSoftwareIO/simple-qrcode | ❌ Pending | Laravel package |
| PDF generation | Laravel DomPDF or Spatie | ❌ Pending | For permit PDF with QR embed |
| Hosting | Cloud (AWS/GCP) or on-premise LGU | ❌ Pending | |

---

## Versioning Convention

`MAJOR.MINOR.PATCH`

| Type | When to increment |
|---|---|
| MAJOR | Breaking changes, full overhaul, incompatible API |
| MINOR | New backward-compatible features |
| PATCH | Bug fixes, security patches, minor tweaks |

---

## Open Issues / TBD

### Active (v0.4.0 blockers)
- [ ] Build `src/pages/auth/Login.jsx`
- [ ] Set up `src/routes/index.jsx` + `ProtectedRoute.jsx`
- [ ] Wrap `main.jsx` with `<BrowserRouter>`
- [ ] Build `src/pages/applicant/Dashboard.jsx` stub
- [ ] Wire landing page "Start Application" CTA through auth check
- [ ] Confirm `vite.config.js` proxy port matches Laravel

### Ongoing
- [ ] S3 vs MinIO — pending budget/hosting decision
- [ ] PayMongo vs DragonPay — confirm PH gateway per LGU
- [ ] On-premise vs cloud hosting
- [ ] Token refresh / session expiry strategy
- [ ] Password reset flow not yet designed
- [ ] Which departments are required vs optional per business type
- [ ] OTC payment flow — manual treasury entry sequence not documented
- [ ] Renewal flow — Business Permit No. + Account No. sequence not built
- [ ] BIR API availability — verify before v1.2.0 planning
- [ ] Multi-LGU data isolation strategy for v2.0.0
