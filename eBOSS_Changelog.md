# eBOSS ePortal — Changelog
> **Status:** Active Development | **Started:** April 2026
> **Current Version:** v0.2.1
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
| Auth method | Laravel Sanctum (SPA / stateful cookie) |
| Current version | v0.2.1 — landing page content aligned to EBIS 4.0, EBIS version rebrand complete |
| Next milestone | v0.3.0 — auth layer (Login, Register, Axios, Zustand, routing) |
| Reference system | EBIS 4.0 — Bacolod City MITCS (4-phase BOSS pipeline) |
| Legal basis | RA 11032 — Ease of Doing Business Act |

### What exists right now (v0.2.0)
- ✅ `Landing.jsx` — fully built, all sections complete
- ✅ Dummy Laravel backend — 4 auth endpoints only
- ✅ PostgreSQL connected (`eboss_dummy` DB), Sanctum configured, CORS set for Vite dev server
- ✅ Test user seeded: `test@eboss.dev` / `password`
- ❌ No Axios service layer
- ❌ No Zustand store
- ❌ No React Router setup
- ❌ No `Login.jsx` / `Register.jsx`
- ❌ No protected routes

### Target application flow (v1.0.0)
4 phases based on EBIS 4.0:
1. **Registration & Application** — wizard form, dynamic doc uploads, email confirmation
2. **BPLO Review & Departmental Clearance** — parallel routing to 11 departments, hard gate
3. **Assessment, Billing & Payment** — fee computation, GCash / PayMaya / DBP / Landbank / OTC, e-OR
4. **Permit Issuance** — QR-embedded PDF permit, auto-email, live QR database verification

---

## Version History

---

### v0.2.1 — Landing Page Content Alignment + EBIS 4.0 Rebrand
**Date:** April 20, 2026 | **Status:** 🟢 Current

Content-only patch. No layout, styling, or structural changes. All text and data in `Landing.jsx` aligned to the official EBIS 4.0 / Bacolod City BOSS architecture document. System version reference updated from EBIS 2.0 → EBIS 4.0 throughout.

#### Frontend — `blpo-boss/`

**Modified files:**
- `src/pages/public/Landing.jsx`

**EBIS version rebrand (6 instances updated):**
- Hero badge: `EBIS 2.0 — Bacolod City BOSS Portal` → `EBIS 4.0 — Bacolod City BOSS Portal`
- Hero card title bar: `EBIS 2.0 — Application Status` → `EBIS 4.0 — Application Status`
- Business Types body copy: `EBIS 2.0 dynamically loads...` → `EBIS 4.0 dynamically loads...`
- Footer logo label: `EBIS 2.0 — BOSS Portal` → `EBIS 4.0 — BOSS Portal`
- Footer description: `Electronic Business Integrated System 2.0` → `Electronic Business Integrated System 4.0`
- Footer copyright: `© 2025 EBIS 2.0 — Bacolod City Government` → `© 2025 EBIS 4.0 — Bacolod City Government`

**Navbar:**
- `IMPROVED` Sub-label changed from `ePORTAL` → `BACOLOD CITY`

**Hero section:**
- `IMPROVED` Headline changed from `Your Business Permit, Done Online.` → `Your Mayor's Permit, Done Online.`
- `IMPROVED` Subtext updated to reference simultaneous departmental clearances and Bacolod City Hall specifically
- `IMPROVED` Trust stats updated: `3 days / 1 day / 100% Secure` → `4 Phases / 11+ Concurrent dept. clearances / QR-verified digital permits`
- `IMPROVED` Hero card progress steps renamed to reflect the 4 EBIS phases: `Application Submitted` / `Dept. Clearances Approved` / `Payment Confirmed` / `Permit Issued`
- `IMPROVED` Hero card permit-ready message now references QR verification

**Agency Strip:**
- `IMPROVED` Label changed from `Connected agencies` → `Clearing departments`
- `IMPROVED` Agency list replaced: `DTI, SEC, BIR, BFP, LGU, SSS, PhilHealth, Pag-IBIG` → `BPLO, BFP, Zoning, City Health, OBO, BENRO, Barangay, City Administrator, Tourism Office, City Agriculture`

**How It Works:**
- `IMPROVED` Subtitle updated to reference joint memorandum circulars and simultaneous clearance processing
- `IMPROVED` Step 01: `Create an Account` → `Register & Apply` — describes email registration and required document types
- `IMPROVED` Step 02: `Submit Your Application` → `BPLO Review & Clearances` — describes parallel routing to all required departments
- `IMPROVED` Step 03: `Pay Fees Online` → `Assessment & Payment` — lists actual payment channels: GCash, PayMaya, DBP Visa, Landbank, OTC
- `IMPROVED` Step 04: `Receive Your Permit` — now references QR-embedded digital permit, auto-email delivery, and BPLO hard-copy pickup option

**Business Types:**
- `REMOVED` `Partnership` — not a supported entity type in EBIS 4.0
- `NEW` `Franchise Business` — added with Franchise Agreement document requirement noted
- `IMPROVED` All entity descriptions updated to cite their respective registration bodies and required documents (DTI / SEC + Board Resolution / CDA)
- `IMPROVED` Section heading: `All business types, one portal.` → `All business structures, one portal.`
- `IMPROVED` Body copy updated to reference dynamic document loading by business structure
- `IMPROVED` CTA link label: `View registration guides →` → `View document requirements →`

**Track Section:**
- `IMPROVED` Description updated to specify Application Number + Business Account Number as required lookup fields
- `IMPROVED` Input placeholder: `BOSS-2025-04891` → `APP-2025-04891`
- `IMPROVED` Helper text updated to reference both lookup fields by name

**Hero card (layout fix):**
- `FIX` Title bar text was visually off-center due to flex layout competing with traffic-light dots — fixed via `position: absolute; left: 0; right: 0; textAlign: center` on the title and `position: relative` on the parent container

**Footer:**
- `IMPROVED` Description updated to credit MITCS (Management Information Technology and Computer Services Department), Bacolod City
- `IMPROVED` Services column: `Start Application` → `New Application`
- `IMPROVED` Government column replaced with `Departments` column listing BPLO, BFP, City Health Office, Zoning Division
- `IMPROVED` Support column: `Contact Us` → `Contact BPLO`
- `IMPROVED` Compliance note: `DICT ICT Standards` → `JMC Standards`

---

### v0.2.0 — Frontend Scaffold + Dummy Backend
**Date:** April 20, 2026 | **Status:** ✅ Superseded by v0.2.1

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

### v0.3.0 — Auth Layer + Routing *(Next)*
**Date:** TBD | **Status:** 🔵 Up Next

Wire frontend auth to dummy backend. Establish routing foundation for all future pages.

- `NEW` `src/services/api.js` — Axios instance, base URL `VITE_API_URL`, calls `GET /sanctum/csrf-cookie` before login
- `NEW` `src/store/auth.js` — Zustand store: `user`, `token`, `isAuthenticated`, `login()`, `logout()`, `register()`
- `NEW` `src/routes/index.jsx` — full React Router `<Routes>` with all defined paths
- `NEW` `src/routes/ProtectedRoute.jsx` — checks `isAuthenticated`, redirects to `/login`
- `NEW` `src/pages/auth/Login.jsx` — form → calls `login()` → redirect to `/dashboard`
- `NEW` `src/pages/auth/Register.jsx` — form → calls `register()` → redirect to `/dashboard`
- `NEW` `src/pages/applicant/Dashboard.jsx` — placeholder authenticated landing
- `NEW` `main.jsx` wrapped with `<BrowserRouter>`
- `NEW` Landing page CTAs wired: Start Application → auth check → `/apply` or `/login`

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
| Auth | Laravel Sanctum (SPA stateful) | ✅ Confirmed | Cookie-based, works with React SPA |
| Database | PostgreSQL | ✅ Confirmed | |
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

### Active (v0.3.0 blockers)
- [ ] Build `src/services/api.js` — Axios + CSRF interceptor
- [ ] Build `src/store/auth.js` — Zustand auth store
- [ ] Set up `src/routes/index.jsx` + `ProtectedRoute.jsx`
- [ ] Build `Login.jsx` and `Register.jsx`
- [ ] Wire landing page CTAs to router
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
