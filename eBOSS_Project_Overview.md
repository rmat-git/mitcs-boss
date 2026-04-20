# eBOSS ePortal — Project Overview
> **Status:** Rough Draft | **Version:** 0.1 | **Last Updated:** April 2026

---

## What Is This?
A web-based ePortal for the Business One Stop Shop (BOSS) process in the Philippines. Lets business owners register, apply for permits, and comply with government requirements online — no need to physically visit city hall.

Modeled after **EBIS 4.0** (Electronic Business Integrated System) implemented by Bacolod City's MITCS Department — a proven working reference for simultaneous multi-department processing.

Legal basis: RA 11032 (Ease of Doing Business Act) — mandates 3-day processing for new apps, 1-day for renewals. Also aligns with Joint Memorandum Circulars on BOSS implementation.

---

## Application Phases (Based on EBIS 4.0)

| Phase | Name | What Happens |
|---|---|---|
| 1 | Registration & Application | User onboarding, form fill, document upload |
| 2 | BPLO Review & Departmental Clearance | Parallel routing to all regulatory offices |
| 3 | Assessment, Billing & Payment | Fee computation, invoicing, online/OTC payment |
| 4 | Issuance & Tracking | QR-embedded permit generation, email delivery, status tracking |

> Phase 2 is a hard gate — application cannot move to billing until **all** required department clearances return approved.

---

## Goals
- One portal for all BOSS transactions
- Online submission + real-time tracking
- Simultaneous parallel clearance routing to all departments
- Support all business types: Sole Prop, Partnership, Corp/OPC, Cooperative
- QR code verification embedded on issued permits
- Works on desktop and mobile

---

## Users

| User | Role |
|---|---|
| Applicant — New Business | Registers with email, submits application, uploads docs, pays, downloads permit |
| Applicant — Renewal | Uses previous Business Permit No. + Account No. to pull existing records |
| BPLO Officer | Initial formal review, routes to departments, issues final permit |
| Department Reviewer | BFP, Zoning, CHO, OBO, BENRO, Barangay, etc. — approves or denies clearance |
| System Admin | Manages users, fee config, audit logs |

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

## Core Features

### Public (No Login)
- Landing page with BOSS explainer
- Step-by-step registration guides (all business types)
- Application status tracker via reference number (no login needed)

### Phase 1 — Registration & Application (Login Required)
- New business: register with email, data must match DTI/SEC/CDA records
- Renewal: login with previous Business Permit No. + Business Account No.
- Dynamic application form — adapts fields based on business type
- Dynamic document checklist based on business profile:
  - **Sole Prop** → DTI Registration
  - **Corporation** → SEC Registration + Board Resolution / Secretary's Certificate + SPA/Authorization with ID
  - **Cooperative** → CDA Registration
  - **All** → Owner's valid ID
  - **Rented premises** → Lease Contract
  - **Franchise** → Written Franchise Agreement
- System emails unified application form to user on successful submission

### Phase 2 — BPLO Review & Departmental Clearance
- BPLO conducts initial formal document review
- Application simultaneously routed to all required departments:
  - Barangay (BRGY) Clearance
  - Bureau of Fire Protection (BFP)
  - Zoning Division
  - City Health Office (CHO)
  - Office of the Building Official (OBO)
  - City Environment and Natural Resources Office (BENRO)
  - BTTMD
  - City Administrator
  - City Veterinarian
  - City Agriculture
  - Tourism Office
- Department dashboard shows real-time status per department: Pending / Approved / Denied
- Application is **locked** from Phase 3 until all clearances are approved

### Phase 3 — Assessment, Billing & Payment
- System computes fees based on verified business data
- Generates formal billing statement
- Payment channels:
  - Online: GCash, PayMaya, DBP Visa, Landbank
  - Over the counter at treasury office
- Webhook confirmation auto-generates Electronic Official Receipt (e-OR)

### Phase 4 — Permit Issuance & Tracking
- e-OR triggers auto-generation of digital Mayor's Permit
- QR code embedded on permit + barangay clearance for authenticity verification
- QR scan cross-references live database to validate document
- Permit dispatched via email automatically
- Option for physical pickup at BPLO office
- Status tracking via Application No. + Business Account No.

### Admin
- User management + role assignment (BPLO, department reviewers, admin)
- Fee schedule configuration
- Audit logs for all actions

---

## Tech Stack

| Layer | Choice |
|---|---|
| Frontend | React + Tailwind CSS |
| Backend | Laravel (PHP) |
| Database | PostgreSQL + Redis |
| Auth | Laravel Sanctum (SPA) |
| File Storage | AWS S3 or MinIO |
| Payment | GCash, PayMaya, DBP Visa, Landbank (via PayMongo or DragonPay) |

---

## Key Frontend Components (Reference: EBIS 4.0)

| Component | Purpose |
|---|---|
| `ApplicationWizard.jsx` | Multi-step Phase 1 form — conditionally renders fields (e.g. Lease Contract only if `isRented: true`, Franchise Agreement only if franchise type) |
| `DepartmentDashboard.jsx` | Phase 2 admin view — maps all departments, shows real-time Pending/Approved/Denied badges per clearance |
| `PaymentGateway.jsx` | Phase 3 — renders online payment options or generates OTC payment slip |
| `TrackerPortal.jsx` | Public status lookup — input App No. + Account No., returns phase timeline |
| `PermitViewer.jsx` | Phase 4 — displays QR-embedded digital permit, download button |

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
