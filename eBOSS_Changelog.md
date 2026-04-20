# eBOSS ePortal — Changelog
> **Status:** Rough Draft | **Started:** April 2026
> Tags: `NEW` `IMPROVED` `FIX` `SECURITY` `REMOVED`

---

## v0.1.0 — Project Scaffold
**Date:** April 20, 2026 | **Status:** 🟢 Current

Initial project structure established. Both frontend and backend repos created and configured under `mitcs boss/`.

### Frontend — `blpo-boss/` (React + Vite)
- `NEW` Vite + React project initialized
- `NEW` Tailwind CSS integrated
- `NEW` Full folder structure scaffolded: `pages/`, `components/`, `hooks/`, `services/`, `store/`, `routes/`, `utils/`
- `NEW` Page folders created: `public/`, `auth/`, `applicant/`, `officer/`, `admin/`
- `NEW` Component folders created: `ui/`, `layout/`, `shared/`
- `NEW` `package.json` configured with `axios`, `react-router-dom`, `zustand` as planned dependencies
- `NEW` `vite.config.js` in place (proxy to Laravel `:8000` + `@/` alias — pending update)
- `NEW` ESLint config (`eslint.config.js`) included

### Backend — `blpo-boss-api/` (Laravel 11)
- `NEW` Laravel 11 project created via Composer
- `NEW` Laravel Sanctum installed and published (`config/sanctum.php` present)
- `NEW` Default Laravel folder structure in place: `app/`, `bootstrap/`, `config/`, `database/`, `routes/`, `storage/`
- `NEW` All standard config files present: `app.php`, `auth.php`, `cache.php`, `cors.php`, `database.php`, `filesystems.php`, `queue.php`, `sanctum.php`, `session.php`
- `NEW` Default migrations present: `users`, `cache`, `jobs`, `personal_access_tokens`
- `NEW` `.env.example` available as base for environment config
- `NEW` `artisan` CLI accessible

### Pending (not yet created)
- Controller subfolders: `Auth/`, `Public/`, `Applicant/`, `Officer/`, `Admin/`
- `app/Http/Middleware/RoleMiddleware.php`
- `app/Http/Requests/` (form validation classes)
- `app/Models/` — `Application.php`, `Document.php`, `Permit.php`, `Payment.php`
- `app/Services/` — `PaymentService.php`, `StorageService.php`, `NotifyService.php`
- `app/Notifications/ApplicationStatus.php`
- `routes/api.php` (only `web.php` and `console.php` exist)

---

## v1.0.0 — Initial Release *(Planned)*
**Date:** TBD | **Status:** 🔵 Upcoming

First working version. Covers sole proprietorship permit application end-to-end.

- `NEW` Applicant registration + email verification
- `NEW` Business profile form (sole prop)
- `NEW` Document upload (DTI cert, IDs, lease, barangay clearance)
- `NEW` Mayor's Permit application workflow
- `NEW` Application status tracker with timeline
- `NEW` LGU Officer dashboard — queue, review, approve/reject
- `NEW` Inter-agency referral: BPLO → BFP → Sanitary → Zoning
- `NEW` Fee calculator (based on capital + business type)
- `NEW` PayMongo payment integration
- `NEW` Email notifications for status updates
- `NEW` Digital permit PDF download on approval
- `NEW` Admin panel — user management + audit logs

---

## v1.1.0 — Planned
**Date:** Q3 2026 | **Status:** 🔵 Upcoming

SMS support + corp/partnership business types.

- `NEW` SMS notifications via Semaphore
- `NEW` Partnership + Corporation/OPC registration support
- `NEW` In-portal messaging (applicant ↔ officer)
- `NEW` Renewal workflow — auto-alert 30 days before expiry
- `IMPROVED` Document checklist adapts to business type
- `IMPROVED` Fee breakdown shown before payment
- `FIX` File upload limit raised from 5MB → 10MB

---

## v1.2.0 — Planned
**Date:** Q4 2026 | **Status:** 🔵 Upcoming

BIR tie-in + mobile.

- `NEW` BIR Form 1901/1903 pre-fill from profile
- `NEW` BIR RDO locator by address
- `NEW` Mobile-responsive redesign
- `NEW` Cooperative registration (CDA)
- `IMPROVED` Officer dashboard analytics (volume, SLA, rejection rate)
- `IMPROVED` Search + filter in application queue
- `SECURITY` Mandatory 2FA for all officer and admin accounts

---

## v2.0.0 — Roadmap
**Date:** 2027 | **Status:** 🟡 Planned

Multi-LGU, PhilSys, full agency integrations.

- `NEW` Multi-LGU support (one platform, separate instances per LGU)
- `NEW` PhilSys / National ID authentication
- `NEW` SSS, PhilHealth, Pag-IBIG employer registration modules
- `NEW` Open data API for DICT compliance
- `NEW` Offline mode for low-connectivity areas
- `NEW` Native mobile apps (iOS + Android)
- `IMPROVED` Full WCAG 2.1 AA accessibility
- `REMOVED` Legacy paper-form upload replaced by structured digital forms

---

## Versioning Convention
`MAJOR.MINOR.PATCH`
- **MAJOR** — breaking changes, major overhaul
- **MINOR** — new features, backward-compatible
- **PATCH** — bug fixes, security patches, minor tweaks

---

## Notes / TBD
- [ ] Confirm v1.0.0 target date once core scaffold is wired
- [ ] State management decision: Zustand vs Redux (leaning Zustand)
- [ ] Confirm SMS provider: Semaphore vs Globe
- [ ] S3 vs MinIO decision (budget/hosting dependent)
- [ ] PayMongo vs DragonPay — check availability per LGU
- [ ] BIR API availability needs verification
- [ ] Multi-LGU data isolation strategy for v2
- [ ] On-premise vs cloud hosting decision pending
- [ ] Token refresh / session expiry strategy to document
- [ ] Password reset flow not yet documented
