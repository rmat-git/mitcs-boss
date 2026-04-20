# eBOSS ePortal — File Tree & Sequence
> **Status:** Rough Draft | **Version:** 0.2 | **Last Updated:** April 2026

---

## Current Disk State
> Reflects actual files on disk as of April 20, 2026.
> Root: `d:\Coding Projects\mitcs boss\`

---

## File Tree

### Frontend — React + Vite (`blpo-boss/`)

```
blpo-boss/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── components/
│   │   ├── layout/               # empty — navbar, sidebar, footer (TODO)
│   │   ├── shared/               # empty — file uploader, stepper, status badge (TODO)
│   │   └── ui/                   # empty — buttons, inputs, modals (TODO)
│   ├── hooks/                    # empty — useAuth.js, useApp.js (TODO)
│   ├── pages/
│   │   ├── admin/                # empty — Users.jsx, Logs.jsx (TODO)
│   │   ├── applicant/            # empty — Apply.jsx, Dashboard.jsx, Permit.jsx (TODO)
│   │   ├── auth/                 # empty — Login.jsx, Register.jsx (TODO)
│   │   ├── officer/              # empty — Queue.jsx, Review.jsx, Referral.jsx (TODO)
│   │   └── public/               # empty — Landing.jsx, Guides.jsx, Track.jsx (TODO)
│   ├── routes/                   # empty — index.jsx, PublicRoute.jsx, ProtectedRoute.jsx (TODO)
│   ├── services/                 # empty — api.js (TODO)
│   ├── store/                    # empty — auth.js (TODO)
│   ├── utils/                    # empty
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
└── vite.config.js
```

**Next steps (frontend):**
- Install dependencies: `npm install axios react-router-dom zustand`
- Update `vite.config.js` — add proxy to `:8000` and `@/` alias
- Create `src/services/api.js` — Axios instance + CSRF + interceptors
- Create `src/store/auth.js` — Zustand auth store
- Create `src/routes/index.jsx` + `ProtectedRoute.jsx`

---

### Backend — Laravel 11 (`blpo-boss-api/`)

```
blpo-boss-api/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Controller.php    # base controller only — subfolders not yet created
│   │   # MISSING: Auth/, Public/, Applicant/, Officer/, Admin/ controller folders
│   │   # MISSING: Middleware/RoleMiddleware.php
│   │   # MISSING: Requests/ (form validation)
│   ├── Models/
│   │   └── User.php              # default only — other models not yet created
│   │   # MISSING: Application.php, Document.php, Permit.php, Payment.php
│   └── Providers/
│       └── AppServiceProvider.php
│   # MISSING: app/Services/ (PaymentService, StorageService, NotifyService)
│   # MISSING: app/Notifications/ApplicationStatus.php
│   # MISSING: app/Enums/ (ApplicationStatus, BusinessType, UserRole)
├── bootstrap/
│   ├── app.php
│   └── providers.php
├── config/
│   ├── app.php
│   ├── auth.php
│   ├── cache.php
│   ├── database.php
│   ├── filesystems.php
│   ├── logging.php
│   ├── mail.php
│   ├── queue.php
│   ├── sanctum.php               # ✅ published via vendor:publish
│   ├── services.php
│   └── session.php
├── database/
│   ├── factories/
│   │   └── UserFactory.php
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── 0001_01_01_000001_create_cache_table.php
│   │   ├── 0001_01_01_000002_create_jobs_table.php
│   │   └── 2026_04_20_015850_create_personal_access_tokens_table.php
│   │   # MISSING: applications, documents, payments, referrals, audit_logs, permits
│   ├── seeders/
│   │   └── DatabaseSeeder.php
│   └── database.sqlite           # default SQLite — switch to PostgreSQL in .env
├── public/
│   ├── .htaccess
│   ├── favicon.ico
│   ├── index.php
│   └── robots.txt
├── resources/
│   ├── css/app.css
│   ├── js/app.js
│   └── views/welcome.blade.php
├── routes/
│   ├── console.php
│   └── web.php
│   # MISSING: api.php — must be created manually or via php artisan install:api
├── storage/
│   ├── app/private/
│   ├── app/public/
│   ├── framework/sessions/
│   ├── framework/testing/
│   ├── framework/views/
│   └── logs/
├── tests/
│   ├── Feature/ExampleTest.php
│   ├── Unit/ExampleTest.php
│   └── TestCase.php
├── vendor/                       # Composer packages (do not edit)
├── .env.example
├── .gitignore
├── artisan
├── composer.json
├── package.json
├── phpunit.xml
└── vite.config.js                # default — not needed for API-only backend
```

**Next steps (backend):**
- Run `php artisan install:api` to generate `routes/api.php`
- Add role column to users migration and run `php artisan migrate`
- Create controller subfolders and stub controllers
- Create `app/Http/Middleware/RoleMiddleware.php`
- Register `role` middleware alias in `bootstrap/app.php`
- Create all missing models with Eloquent relationships
- Create all eBOSS migrations (applications, documents, payments, referrals, audit_logs, permits)
- Create `app/Services/` classes
- Update `.env` — switch DB from SQLite to PostgreSQL, configure Redis, S3/MinIO

---

## Target File Tree (Goal State)

### Frontend — `blpo-boss/src/`

```
src/
├── assets/
│   └── hero.png
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Footer.jsx
│   ├── shared/
│   │   ├── FileUploader.jsx
│   │   ├── Stepper.jsx
│   │   └── StatusBadge.jsx
│   └── ui/
│       ├── Button.jsx
│       ├── Input.jsx
│       └── Modal.jsx
├── hooks/
│   ├── useAuth.js
│   └── useApp.js
├── pages/
│   ├── public/
│   │   ├── Landing.jsx           # /
│   │   ├── Guides.jsx            # /guides
│   │   └── Track.jsx             # /track
│   ├── auth/
│   │   ├── Login.jsx             # /login
│   │   └── Register.jsx          # /register
│   ├── applicant/
│   │   ├── Apply.jsx             # /apply — login wall
│   │   ├── Dashboard.jsx         # /dashboard
│   │   └── Permit.jsx            # /permit/:id
│   ├── officer/
│   │   ├── Queue.jsx
│   │   ├── Review.jsx
│   │   └── Referral.jsx
│   └── admin/
│       ├── Users.jsx
│       └── Logs.jsx
├── routes/
│   ├── index.jsx
│   ├── PublicRoute.jsx
│   └── ProtectedRoute.jsx
├── services/
│   └── api.js
├── store/
│   └── auth.js
├── utils/
├── App.jsx
├── index.css
└── main.jsx
```

### Backend — `blpo-boss-api/app/`

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Auth/
│   │   │   ├── LoginController.php
│   │   │   └── RegisterController.php
│   │   ├── Public/
│   │   │   ├── TrackController.php
│   │   │   └── GuideController.php
│   │   ├── Applicant/
│   │   │   ├── ApplicationController.php
│   │   │   ├── DocumentController.php
│   │   │   └── PaymentController.php
│   │   ├── Officer/
│   │   │   ├── QueueController.php
│   │   │   └── ReferralController.php
│   │   └── Admin/
│   │       └── AdminController.php
│   ├── Middleware/
│   │   └── RoleMiddleware.php
│   └── Requests/
├── Models/
│   ├── User.php
│   ├── Application.php
│   ├── Document.php
│   ├── Permit.php
│   └── Payment.php
├── Services/
│   ├── PaymentService.php
│   ├── StorageService.php
│   ├── SlaService.php
│   └── NotifyService.php
├── Notifications/
│   └── ApplicationStatus.php
└── Enums/
    ├── ApplicationStatus.php
    ├── BusinessType.php
    └── UserRole.php
```

---

## API Routes (`routes/api.php`) — Target

```php
// Public — no auth
Route::get('/track/{ref}', [TrackController::class, 'show']);
Route::get('/guides', [GuideController::class, 'index']);

// Auth
Route::post('/login', [LoginController::class, 'login']);
Route::post('/register', [RegisterController::class, 'register']);

// Protected — Sanctum
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [LoginController::class, 'logout']);

    // Applicant
    Route::apiResource('applications', ApplicationController::class);
    Route::post('documents', [DocumentController::class, 'store']);
    Route::post('payments', [PaymentController::class, 'create']);
    Route::post('payments/webhook', [PaymentController::class, 'webhook']);

    // Officer
    Route::middleware('role:officer')->group(function () {
        Route::get('queue', [QueueController::class, 'index']);
        Route::patch('applications/{id}/status', [QueueController::class, 'updateStatus']);
        Route::post('referrals', [ReferralController::class, 'store']);
    });

    // Admin
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', AdminController::class);
        Route::get('logs', [AdminController::class, 'logs']);
    });
});
```

---

## Route Access Model

| Route | Guest | Applicant | Officer | Admin |
|---|---|---|---|---|
| `/` | ✅ | ✅ | ✅ | ✅ |
| `/guides` | ✅ | ✅ | ✅ | ✅ |
| `/track` | ✅ | ✅ | ✅ | ✅ |
| `/login` `/register` | ✅ | ✅ | ✅ | ✅ |
| `/apply` | 🔒 login wall | ✅ | — | — |
| `/dashboard` | 🔒 | ✅ | — | — |
| `/officer/*` | 🔒 | 🔒 | ✅ | — |
| `/admin/*` | 🔒 | 🔒 | 🔒 | ✅ |

---

## Sequence Flow

*(Unchanged from v0.1 — see previous version for full sequence diagrams)*

---

## TBD
- [ ] Confirm state management library — Zustand (recommended) vs Redux
- [ ] Decide S3 vs MinIO (budget/hosting dependent)
- [ ] PayMongo vs DragonPay — check availability per LGU
- [ ] Officer referral sequence (BPLO → BFP → Sanitary → Zoning) needs its own flow diagram
- [ ] Password reset flow not yet documented
- [ ] Token refresh / session expiry strategy
- [ ] Switch `database.sqlite` to PostgreSQL — update `.env` before first migration
