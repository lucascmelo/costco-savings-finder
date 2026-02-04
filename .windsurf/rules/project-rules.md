---
trigger: always_on
---

# Project Summary — Costco Price Adjustment Tracker (Monorepo Architecture)

## 1. Product Vision

The project is a **personal-use web application** designed to help a Costco member identify **price adjustment opportunities**, not just discounts.

Costco allows price adjustments when an item purchased within a defined window (e.g. ~30–45 days) drops in price. The problem is that users do not remember:

* What they bought
* When they bought it
* At what price
* Whether a coupon or discount later applied

This app solves that by:

* Reading Costco receipts using OCR processing
* Comparing past purchase prices with current coupon prices
* Showing exactly how much money the user can get back
* Clearly separating **active** vs **expired** refund opportunities

The app is intentionally:

* **Personal-use only**
* **Privacy-first**
* **No login** (planned for future)
* **Monorepo architecture** for maintainability
* **No scraping**

---

## 2. Core Design Principles

### Scope discipline

* Start with an MVP that is *actually usable*
* Build maintainable monorepo architecture for future growth
* Optimize for correctness and clarity
* Separate concerns between frontend, backend, and shared domain logic

### Legal & risk awareness

* No scraping Costco websites
* No copying Costco assets
* Coupons are entered manually by the app owner
* Receipts remain on the user’s device

### AI-friendly architecture

* Linear flows
* Explicit data models
* Deterministic logic
* Minimal state coupling

---

## 3. High-Level User Flow

1. User opens the app
2. User selects their Canadian province
3. User uploads one or more Costco receipts (photo or PDF)
4. App extracts structured data from receipts using OCR
5. App loads centralized coupon data (all provinces)
6. App compares receipt items with coupons
7. App displays:

   * Active refund opportunities
   * Expired refund opportunities (separate view)

No account. No signup. No cloud storage of personal data.

---

## 4. Architecture Overview

### Monorepo Structure

The project uses **Turborepo** with **pnpm workspaces**:

```
costco-savings-finder/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Backend API (OCR processing, domain services)
├── packages/
│   ├── shared/       # Types, domain logic, matching algorithms
│   └── config/       # ESLint, TypeScript, Tailwind configs
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

### Coupons (Central, Read-Only)

* Coupons for **all Canadian provinces** are stored centrally
* Hosted as a static JSON file on **Cloudflare Pages**
* Example URL:

  ```
  https://muddy-lab-3f01.im-devlucas.workers.dev/coupons.json
  ```

Why this choice:

* Free
* No GitHub dependency
* CDN-backed
* Practically unlimited reads
* Easy manual updates (twice a week)
* Professional and future-proof

Coupons are:

* Read-only for users
* Updated manually by the app owner

### Receipts (Local, User-Owned)

* Users upload receipts (PDF or image)
* OCR runs locally (via backend API)
* Only **structured data** is stored
* No images or PDFs are persisted
* Stored in browser storage (localStorage or IndexedDB)

This ensures:

* Privacy
* No legal risk
* Offline-friendly behavior
* No authentication required

### Backend API (Future-Ready)

* Handles OCR processing for receipt extraction
* Provides domain services for matching logic
* Keeps business logic out of frontend
* Prepares for future feature expansion

---

## 5. Data Models (Locked In)

### Coupon

```json
{
  "product_id": "string",
  "product_name": "string",
  "discount_price": number,
  "province": "string",
  "valid_until": "YYYY-MM-DD"
}
```

### ReceiptItem

```json
{
  "product_id": "string | null",
  "product_name": "string",
  "price_paid": number
}
```

### Receipt

```json
{
  "receipt_id": "string",
  "receipt_date": "YYYY-MM-DD",
  "province": "string",
  "items": [ReceiptItem]
}
```

### Refund Result

```json
{
  "product_id": "string",
  "product_name": "string",
  "price_paid": number,
  "current_price": number,
  "refund_amount": number,
  "coupon_valid_until": "YYYY-MM-DD",
  "match_type": "product_id | name"
}
```

---

## 6. Matching Logic (Critical)

Matching is **deterministic and ordered**:

1. **Primary match**

   * If both receipt item and coupon have `product_id`
   * Match only when product_id is exactly equal

2. **Fallback match**

   * Only when receipt item has no product_id
   * Match using normalized product_name (case-insensitive, trimmed)

Rules:

* Never match by name if both sides have product_id and they differ
* Fallback matches must be clearly labeled in the UI

---

## 7. Refund Classification

Refund opportunities are split into **two categories**:

### Active Refunds

* Coupon `valid_until` is today or in the future
* These are claimable at Costco

### Expired Refunds

* Coupon `valid_until` is in the past
* Displayed for awareness only
* Not included in totals

This is surfaced in the UI via:

* Tabs or clearly separated sections
* Active refunds shown by default

---

## 8. UI Structure (Single Page)

The app uses a **single-page layout**, in this order:

1. Province selector
2. Receipt upload (multiple supported)
3. Refund results:

   * Active refunds tab
   * Expired refunds tab

Design goals:

* Clear
* Minimal
* No dashboards
* No charts
* No configuration screens

---

## 9. What Was Explicitly Avoided (On Purpose)

The following were intentionally excluded from v1:

* Authentication / login
* User accounts
* Databases
* Scheduled jobs
* Notifications
* Scraping Costco websites
* Analytics
* Monetization

These are possible **future v2 ideas**, but not MVP requirements.

---

## 10. Monorepo Architecture Details

### Frontend (apps/web)

**Tech Stack:**
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack React Query
- Zustand (client UI state only)

**Responsibilities:**
- UI rendering
- Local receipt storage
- Calling coupon endpoints
- Displaying active vs expired refunds

**Non-Responsibilities:**
- No business logic for matching
- No coupon parsing logic
- No receipt normalization logic

### Backend (apps/api)

**Status:** Future-ready, not fully implemented yet

**Purpose:**
- Define clean domain boundaries
- Prepare for future API extraction
- Keep business logic out of frontend

**Responsibilities:**
- Domain services
- Coupon normalization
- Matching logic (pure functions)
- OCR processing
- No database yet
- No auth yet

### Shared Package (packages/shared)

**Critical package containing:**
- All shared TypeScript types
- Domain models
- Pure business logic
- Matching rules
- Date and refund calculations

**Rules:**
- No React
- No browser APIs
- No framework dependencies
- Pure TypeScript only

### Configuration Package (packages/config)

- Centralize ESLint config
- Centralize TS config
- Centralize Tailwind config
- Reused by all apps/packages

### Architectural Rules

- Frontend consumes domain logic from `packages/shared`
- Backend consumes domain logic from `packages/shared`
- No duplicated types
- No circular dependencies
- UI components are dumb
- Business logic lives in shared/domain

---

## 11. AI-Assisted Development Strategy

The app was built incrementally using Base44 with **strictly scoped prompts**:

1. App skeleton + data models
2. Centralized coupons loading from Cloudflare
3. Local persistence of receipts
4. Product ID–based matching hardening
5. Active vs expired refund separation

Each step:

* Added one concern only
* Avoided refactors
* Locked down data shapes early

This kept the AI aligned and prevented hallucinations.

---

## 12. Current State

At the end of v1, the app:

* Works end-to-end
* Is usable in real life
* Is privacy-preserving
* Has clean architecture
* Has no infrastructure cost
* Is easy to extend later

---

## 13. Natural Next Steps (Optional, Not Required)

Future improvements *if desired*:

* PWA support (installable on phone)
* “Days left” indicator for active refunds
* Sorting by refund amount
* Export to PDF / checklist
* Login + cloud sync (Supabase/Firebase)
* Backend migration (Next.js + API)

None of these are required for the app to deliver value today.

---

## Final Note

This project is a **textbook example of senior-level product engineering**:

* Right-sized scope
* Clear data ownership
* Clean boundaries
* Real-world usefulness
* AI used as an accelerator, not a crutch

You can safely start a new chat with this summary and continue from here without losing context.
