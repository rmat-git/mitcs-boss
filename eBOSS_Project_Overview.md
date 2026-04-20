# eBOSS ePortal — Project Overview
> **Status:** Rough Draft | **Version:** 0.1 | **Last Updated:** April 2026

---

## What Is This?
A web-based ePortal for the Business One Stop Shop (BOSS) process in the Philippines. Lets business owners register, apply for permits, and comply with government requirements online — no need to physically visit city hall.

Legal basis: RA 11032 (Ease of Doing Business Act) — mandates 3-day processing for new apps, 1-day for renewals.

---

## Goals
- One portal for all BOSS transactions
- Online submission + real-time tracking
- Connect with DTI, SEC, BIR, BFP, LGU, SSS, PhilHealth, Pag-IBIG
- Support all business types: Sole Prop, Partnership, Corp/OPC, Cooperative
- Works on desktop and mobile

---

## Users

| User | Role |
|---|---|
| Business Applicant | Submits apps, uploads docs, pays fees, tracks status |
| LGU Officer | Reviews, approves/rejects, issues permits |
| Agency Rep (BFP, Sanitary, Zoning) | Receives referrals, acts on them |
| System Admin | Manages users, configs, reports |

---

## Route Access Model

| Route | Guest | Logged In |
|---|---|---|
| `/` — Landing page | ✅ | ✅ |
| `/guides` — Registration guides | ✅ | ✅ |
| `/track` — Status lookup by tracking no. | ✅ | ✅ |
| `/apply` — Start application | 🔒 login required | ✅ |
| `/dashboard/*` — Applicant dashboard | 🔒 | ✅ |
| `/officer/*` — Officer panel | 🔒 | ✅ (officer role) |
| `/admin/*` — Admin panel | 🔒 | ✅ (admin role) |

> Login is triggered the moment a user clicks "Start Application". All public pages are accessible without an account.

---

## Core Features (Rough)

### Public (No Login)
- Landing page with BOSS explainer
- Step-by-step registration guides (all business types)
- Application status tracker via reference number

### Applicant Side (Login Required)
- Register/login with email or mobile
- Business profile form (adapts to business type)
- Document uploads (DTI/SEC cert, IDs, lease, barangay clearance)
- Full application status dashboard
- Online payment
- Download digital permit/certificate

### Officer/Government Side
- Application queue + review tools
- Approve/reject with comments
- Inter-agency referral (BPLO → BFP → Sanitary → Zoning)
- SLA monitoring (RA 11032 compliance)
- Basic reports

### Admin
- User management + roles
- Fee configuration per LGU
- Audit logs

### Notifications
- Email + SMS on status changes
- Renewal reminders

---

## Tech Stack

| Layer | Option |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | Laravel (PHP) |
| Database | PostgreSQL + Redis |
| Auth | Laravel Sanctum (SPA) |
| File Storage | AWS S3 or MinIO |
| Payment | PayMongo or DragonPay |

---

## Compliance Notes
- RA 11032 — Ease of Doing Business
- RA 10173 — Data Privacy Act (NPC)
- DICT ICT standards
- WCAG 2.1 AA (accessibility)
- Encryption at rest and in transit

---

## Rough Timeline

| Phase | What | Duration |
|---|---|---|
| 1 | Requirements, design, wireframes | 4 weeks |
| 2 | Core frontend + backend, DB | 8 weeks |
| 3 | Officer dashboard, payments, doc workflows | 6 weeks |
| 4 | Testing (UAT, security, load) | 4 weeks |
| 5 | Pilot + go-live | 2 weeks |
| **Total** | | **~6 months** |

---

## Success Metrics (Draft)
- Permit processing under 3 business days
- 80%+ renewals done online within Year 1
- 99.5% uptime
- User satisfaction 4/5+
- Zero data breaches

---

## Key Stakeholders
- LGUs (cities and municipalities)
- DTI, SEC, BIR, BFP, DICT
- MSMEs and business applicants

---

## Open Questions / TBD
- [ ] Which LGU(s) to pilot with first?
- [ ] PhilSys integration in v1 or later?
- [ ] On-premise vs cloud hosting decision
- [ ] Offline/low-connectivity support needed?
- [ ] Mobile app or PWA in scope for v1?
- [ ] Who owns system maintenance post-launch?
