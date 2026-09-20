# API Integration — FixItNow Frontend

This document maps every backend endpoint consumed by the FixItNow frontend to the exact component / server action that calls it, with demo request and response shapes for each.

- **Base URL:** `https://b7-assignment4.vercel.app/` (dev fallback `http://localhost:3000`)
- **Auth:** `Authorization: Bearer <accessToken>` header (the token is also mirrored to an `accessToken` cookie by the backend on login)
- **Envelope:** every response is `{ success, statusCode, message, data?, meta?, errorDetails? }`
- **Money:** `hourlyRate`, `price`, `priceAtBooking`, `amount` are returned as **strings** (`"350.00"`) by the backend; the frontend converts with `Number()` for math and `formatBDT()` for display.

---

## 1. Endpoint Reference Table

| Method | Endpoint | Access | Frontend consumer |
|---|---|---|---|
| POST | `/api/auth/register` | Public | `register/page.tsx` → `app/api/auth/register/route.ts` |
| POST | `/api/auth/login` | Public | `login/page.tsx`, `LoginForm.tsx` → `app/api/auth/login/route.ts`, `(auth)/_actions/authAction.ts` |
| GET | `/api/auth/me` | All roles | `getMyProfile.ts`, `app/api/auth/me/route.ts`, `book-service-button.tsx` |
| GET | `/api/category` | Public | `getAllCategory.ts` → `services/page.tsx`, home `categories.tsx` |
| GET | `/api/services` | Public | `getAllServices.ts` → `services/page.tsx` (`ServicesBoard`) |
| GET | `/api/services/:id` | Public | `getServiceById.ts` → `services/[id]/page.tsx` |
| POST | `/api/services/` | TECHNICIAN | `createService.ts` → `services-board.tsx` |
| GET | `/api/technician` | Public | `getAllTechnician.ts` → home `pros.tsx` |
| GET | `/api/technician/:id` | Public | `getTechnicianById.ts`, `getMyTechnician.ts` |
| PATCH | `/api/technician/profile` | TECHNICIAN | `updateTechnicianProfile.ts` → `technician-profile-form.tsx` |
| PUT | `/api/technician/availability` | TECHNICIAN | `setTechnicianAvailability.ts` → `availability-sheet.tsx` |
| POST | `/api/bookings/create` | CUSTOMER | `createBooking.ts` → `book-service-button.tsx` |
| GET | `/api/bookings` | CUSTOMER / TECHNICIAN | `getMyBookings.ts` → `bookings-list`, `dashboard-overview`, `technician-overview`, `payment-confirm-watcher` |
| GET | `/api/bookings/:id` | CUSTOMER / ADMIN | `getAdminBookingDetail.ts` → `booking-detail-dialog.tsx` |
| PATCH | `/api/bookings/status/:id` | TECHNICIAN | `updateBookingStatus.ts` → `technician-bookings.tsx` |
| PATCH | `/api/bookings/:id/cancel` | CUSTOMER | `cancelBooking.ts` → `cancel-booking-dialog.tsx` |
| POST | `/api/payment/create` | CUSTOMER | `createPayment.ts` → `booking-actions.tsx` |
| GET | `/api/payment/` | CUSTOMER | `getMyPayments.ts` → `payments-list`, `dashboard-overview` |
| GET | `/api/payment/:id` | CUSTOMER | `getPaymentById.ts` → `payment-detail-dialog.tsx` |
| POST | `/api/review/` | CUSTOMER | `createReview.ts` → `review-dialog.tsx` |
| GET | `/api/admin/categories` | ADMIN | `getAdminCategories.ts` → `admin-categories-board.tsx`, `admin-overview.tsx` |
| POST | `/api/admin/categories` | ADMIN | `createCategory.ts` → `admin-categories-board.tsx` |
| GET | `/api/admin/allUsers` | ADMIN | `getAdminUsers.ts` → `users-board.tsx`, `admin-overview.tsx` |
| GET | `/api/admin/bookings` | ADMIN | `getAdminBookings.ts` → `admin-bookings-board.tsx`, `admin-overview.tsx` |
| PATCH | `/api/admin/user/:id` | ADMIN | `updateUserStatus.ts` → `ban-user-dialog.tsx` |

> `POST /api/payment/confirm` is a **Stripe webhook (server-to-server)** — the frontend intentionally never calls it. Stripe redirects the customer back to the app; the booking flips to `PAID` via the webhook, and the frontend detects it through the polling `payment-confirm-watcher.tsx`.

---

## 2. Auth — `/api/auth`

### POST `/api/auth/register` — Public

**Frontend consumer:** `app/(auth)/register/page.tsx` → proxy route `app/api/auth/register/route.ts` (which calls `serverFetch("/api/auth/register", { method: "POST", body })`).

**Demo request (TECHNICIAN):**

```json
{
  "role": "TECHNICIAN",
  "name": "Karim Hossain",
  "email": "karim@example.com",
  "password": "secret123",
  "phone": "+8801722222222",
  "address": "Mirpur, Dhaka",
  "bio": "Plumbing expert with 8 years experience",
  "skills": ["plumbing", "pipe fitting"],
  "hourlyRate": 500,
  "experienceYrs": 8,
  "location": "Mirpur"
}
```

**Demo response — 201:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "User created successfully",
  "data": {
    "id": "3f2b7a1e-...",
    "name": "Karim Hossain",
    "email": "karim@example.com",
    "phone": "+8801722222222",
    "role": "TECHNICIAN",
    "status": "ACTIVE",
    "address": "Mirpur, Dhaka",
    "avatarUrl": null,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T10:00:00.000Z"
  }
}
```

---

### POST `/api/auth/login` — Public

**Frontend consumer:** `app/(auth)/_components/LoginForm.tsx` → `(auth)/_actions/authAction.ts` → proxy route `app/api/auth/login/route.ts`. On success the frontend stores the `accessToken` in localStorage + `fin_token` cookie.

**Demo request:**

```json
{ "email": "karim@example.com", "password": "secret123" }
```

**Demo response — 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User logged in successfully",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi..."
  }
}
```

---

### GET `/api/auth/me` — Authenticated (all roles)

**Frontend consumer:** `app/(dashboaredGroup)/_actions/getMyProfile.ts`, `app/api/auth/me/route.ts`, and `book-service-button.tsx` (client-side via `apiFetch("/api/auth/me")` to prefill the address).

**Demo response — 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User info fetched successfully",
  "data": {
    "id": "3f2b7a1e-...",
    "name": "Karim Hossain",
    "email": "karim@example.com",
    "phone": "+8801722222222",
    "role": "TECHNICIAN",
    "status": "ACTIVE",
    "address": "Mirpur, Dhaka",
    "avatarUrl": null,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-01T10:00:00.000Z",
    "technicianProfile": {
      "id": "7c1a9d2f-...",
      "userId": "3f2b7a1e-...",
      "bio": "Plumbing expert with 8 years experience",
      "skills": ["plumbing", "pipe fitting"],
      "experienceYrs": 8,
      "hourlyRate": "500.00",
      "location": "Mirpur",
      "avgRating": 4.5,
      "totalReviews": 2,
      "isVerified": true,
      "createdAt": "2026-01-01T10:00:00.000Z",
      "updatedAt": "2026-01-01T10:00:00.000Z"
    }
  }
}
```

---

## 3. Category — `/api/category`

### GET `/api/category` — Public

**Frontend consumer:** `app/(public-route)/_actions/getAllCategory.ts` → `services/page.tsx` (category filter chips) and the home `categories.tsx` grid.

**Demo request:**

```
GET /api/category?search=Plumb&page=1&limit=10
```

**Demo response — 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Categories fetched successfully",
  "meta": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 },
  "data": [
    {
      "id": "c001...",
      "name": "Plumbing",
      "description": "Plumbing services",
      "iconUrl": "https://example.com/plumbing.png",
      "isActive": true,
      "createdAt": "2026-01-01T09:00:00.000Z",
      "updatedAt": "2026-01-01T09:00:00.000Z",
      "services": [
        { "title": "Pipe Leak Repair", "description": "Fix leaking pipes", "price": "350.00" }
      ],
      "_count": { "services": 1 }
    }
  ]
}
```

---

## 4. Service — `/api/services`

### GET `/api/services` — Public

**Frontend consumer:** `app/(public-route)/_actions/getAllServices.ts` → `services/page.tsx` (`ServicesBoard`). Filters passed: `search`, `category`, `page`.

**Demo request:**

```
GET /api/services/?category=Plumbing&search=leak&page=1
```

**Demo response — 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Services fetched successfully",
  "meta": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 },
  "data": [
    {
      "id": "5aa2c11d-...",
      "technicianId": "7c1a9d2f-...",
      "categoryId": "c001...",
      "title": "Pipe Leak Repair",
      "description": "Fix leaking pipes at home",
      "price": "350.00",
      "durationMins": 60,
      "isActive": true,
      "createdAt": "2026-01-01T11:00:00.000Z",
      "updatedAt": "2026-01-01T11:00:00.000Z",
      "category": { "name": "Plumbing", "description": "Plumbing services", "iconUrl": null },
      "technician": {
        "user": { "name": "Karim Hossain", "avatarUrl": null, "email": "karim@example.com" },
        "bio": "Plumbing expert with 8 years experience",
        "location": "Mirpur",
        "avgRating": 4.5,
        "totalReviews": 2
      },
      "bookings": [],
      "_count": { "bookings": 1 }
    }
  ]
}
```

---

### GET `/api/services/:id` — Public

**Frontend consumer:** `app/(public-route)/_actions/getServiceById.ts` → `services/[id]/page.tsx` (detail, technician card, reviews, "Book this job").

**Demo response — 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Service fetched successfully",
  "data": {
    "id": "5aa2c11d-...",
    "technicianId": "7c1a9d2f-...",
    "categoryId": "c001...",
    "title": "Pipe Leak Repair",
    "description": "Fix leaking pipes at home",
    "price": "350.00",
    "durationMins": 60,
    "isActive": true,
    "createdAt": "2026-01-01T11:00:00.000Z",
    "updatedAt": "2026-01-01T11:00:00.000Z",
    "category": { "name": "Plumbing", "description": "Plumbing services", "iconUrl": null },
    "technician": {
      "user": { "name": "Karim Hossain", "avatarUrl": null, "email": "karim@example.com", "phone": "+8801722222222" },
      "bio": "Plumbing expert with 8 years experience",
      "skills": ["plumbing", "pipe fitting"],
      "experienceYrs": 8,
      "location": "Mirpur",
      "avgRating": 4.5,
      "totalReviews": 2,
      "isVerified": true
    },
    "bookings": [{ "review": { "rating": 5, "comment": "Great work!", "customer": { "name": "Rahim Uddin", "avatarUrl": null } } }],
    "_count": { "bookings": 1 }
  }
}
```

---

### POST `/api/services/` — TECHNICIAN

**Frontend consumer:** `app/(dashboaredGroup)/_actions/createService.ts` → `services-board.tsx` (form fields: title, description, category **name**, price, durationMins). On success it calls `updateTag("public-services")`.

**Demo request:**

```json
{
  "title": "Pipe Leak Repair",
  "description": "Fix leaking pipes at home",
  "category": "Plumbing",
  "price": 350,
  "durationMins": 60
}
```

**Demo response — 201:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Service created successfully",
  "data": {
    "id": "5aa2c11d-...",
    "technicianId": "7c1a9d2f-...",
    "categoryId": "c001...",
    "title": "Pipe Leak Repair",
    "description": "Fix leaking pipes at home",
    "price": "350.00",
    "durationMins": 60,
    "isActive": true,
    "createdAt": "2026-01-01T11:00:00.000Z",
    "updatedAt": "2026-01-01T11:00:00.000Z"
  }
}
```

---

## 5. Technician — `/api/technician`

### GET `/api/technician` — Public

**Frontend consumer:** `app/(public-route)/_actions/getAllTechnician.ts` → home `pros.tsx` (top-rated technicians).

**Demo request:**

```
GET /api/technician/?search=karim&minRating=4&page=1&limit=10
```

**Demo response — 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Technicians fetched successfully",
  "meta": { "page": 1, "limit": 10, "total": 1, "totalPages": 1 },
  "data": [
    {
      "id": "7c1a9d2f-...",
      "userId": "3f2b7a1e-...",
      "bio": "Plumbing expert with 8 years experience",
      "skills": ["plumbing", "pipe fitting"],
      "experienceYrs": 8,
      "hourlyRate": "500.00",
      "location": "Mirpur",
      "avgRating": 4.5,
      "totalReviews": 2,
      "isVerified": true,
      "createdAt": "2026-01-01T10:00:00.000Z",
      "updatedAt": "2026-01-01T10:00:00.000Z",
      "user": {
        "name": "Karim Hossain",
        "avatarUrl": null,
        "address": "Mirpur, Dhaka",
        "phone": "+8801722222222",
        "email": "karim@example.com",
        "status": "ACTIVE"
      },
      "services": [
        {
          "id": "5aa2c11d-...",
          "technicianId": "7c1a9d2f-...",
          "categoryId": "c001...",
          "title": "Pipe Leak Repair",
          "description": "Fix leaking pipes at home",
          "price": "350.00",
          "durationMins": 60,
          "isActive": true,
          "createdAt": "2026-01-01T11:00:00.000Z",
          "updatedAt": "2026-01-01T11:00:00.000Z"
        }
      ],
      "bookings": [
        {
          "status": "COMPLETED",
          "priceAtBooking": "350.00",
          "payment": { "status": "COMPLETED" },
          "customer": { "name": "Rahim Uddin", "phone": "+8801711111111", "email": "rahim@example.com", "avatarUrl": null }
        }
      ],
      "reviews": [
        { "rating": 5, "comment": "Great work!" },
        { "rating": 4, "comment": "Good service." }
      ],
      "_count": { "services": 1, "reviews": 2, "bookings": 1 }
    }
  ]
}
```

---

### GET `/api/technician/:id` — Public (id is `TechnicianProfile.id`)

**Frontend consumer:** `app/(public-route)/_actions/getTechnicianById.ts` and `app/(dashboaredGroup)/_actions/getMyTechnician.ts` (dashboards fetch the logged-in technician's profile by `user.technicianProfile.id`).

**Demo response — 200:** same shape as a single item of the list above.

---

### PATCH `/api/technician/profile` — TECHNICIAN

**Frontend consumer:** `app/(dashboaredGroup)/_actions/updateTechnicianProfile.ts` → `technician-profile-form.tsx`. Only provided fields are sent.

**Demo request:**

```json
{
  "name": "Karim Hossain Khan",
  "phone": "+8801733333333",
  "address": "Gulshan, Dhaka",
  "avatarUrl": "https://example.com/new-avatar.png",
  "bio": "Senior plumbing & electrical expert",
  "skills": ["plumbing", "electrical"],
  "hourlyRate": 600,
  "experienceYrs": 9,
  "location": "Gulshan"
}
```

**Demo response — 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Technician profile updated successfully",
  "data": {
    "id": "3f2b7a1e-...",
    "name": "Karim Hossain Khan",
    "phone": "+8801733333333",
    "role": "TECHNICIAN",
    "status": "ACTIVE",
    "address": "Gulshan, Dhaka",
    "avatarUrl": "https://example.com/new-avatar.png",
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-02T10:00:00.000Z",
    "technicianProfile": {
      "id": "7c1a9d2f-...",
      "bio": "Senior plumbing & electrical expert",
      "skills": ["plumbing", "electrical"],
      "experienceYrs": 9,
      "hourlyRate": "600.00",
      "location": "Gulshan",
      "avgRating": 4.5,
      "totalReviews": 2,
      "isVerified": true
    }
  }
}
```

---

### PUT `/api/technician/availability` — TECHNICIAN

**Frontend consumer:** `app/(dashboaredGroup)/_actions/setTechnicianAvailability.ts` → `availability-sheet.tsx` (weekly scheduler: add/remove time blocks per day, replaces the whole schedule).

**Demo request:**

```json
[
  { "dayOfWeek": "MONDAY", "startTime": "09:00", "endTime": "17:00" },
  { "dayOfWeek": "FRIDAY", "startTime": "14:00", "endTime": "20:00" }
]
```

**Demo response — 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Availability updated successfully",
  "data": [
    {
      "id": "a1b2c3d4-...",
      "technicianId": "7c1a9d2f-...",
      "dayOfWeek": "FRIDAY",
      "startTime": "14:00",
      "endTime": "20:00",
      "isActive": true,
      "createdAt": "2026-01-02T10:00:00.000Z",
      "updatedAt": "2026-01-02T10:00:00.000Z"
    }
  ]
}
```

---

## 6. Booking — `/api/bookings`

### POST `/api/bookings/create` — CUSTOMER

**Frontend consumer:** `app/(public-route)/_actions/createBooking.ts` → `book-service-button.tsx` ("Book this job" modal: date/time, address, notes). The modal pre-validates a future slot and that the address contains the technician's `location`. On success the action redirects to `/dashboard/bookings`.

**Demo request:**

```json
{
  "serviceId": "5aa2c11d-...",
  "scheduledAt": "2026-01-15T10:00:00.000Z",
  "address": "House 12, Mirpur 10, Dhaka",
  "notes": "Please bring your own tools"
}
```

**Demo response — 201:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Booking created successfully",
  "data": {
    "id": "b9d2e4f6-...",
    "customerId": "8a0c9b2e-...",
    "technicianId": "7c1a9d2f-...",
    "serviceId": "5aa2c11d-...",
    "status": "REQUESTED",
    "scheduledAt": "2026-01-15T10:00:00.000Z",
    "address": "House 12, Mirpur 10, Dhaka",
    "notes": "Please bring your own tools",
    "priceAtBooking": "350.00",
    "cancelledAt": null,
    "cancelReason": null,
    "createdAt": "2026-01-02T12:00:00.000Z",
    "updatedAt": "2026-01-02T12:00:00.000Z",
    "service": {
      "id": "5aa2c11d-...",
      "title": "Pipe Leak Repair",
      "description": "Fix leaking pipes at home",
      "price": "350.00",
      "durationMins": 60,
      "isActive": true,
      "category": { "id": "c001...", "name": "Plumbing", "description": "Plumbing services", "iconUrl": null, "isActive": true, "createdAt": "...", "updatedAt": "..." }
    },
    "technician": {
      "id": "7c1a9d2f-...",
      "userId": "3f2b7a1e-...",
      "bio": "Plumbing expert with 8 years experience",
      "skills": ["plumbing"],
      "experienceYrs": 8,
      "hourlyRate": "500.00",
      "location": "Mirpur",
      "avgRating": 4.5,
      "totalReviews": 2,
      "isVerified": true,
      "user": { "name": "Karim Hossain", "email": "karim@example.com", "phone": "+8801722222222" }
    }
  }
}
```

---

### GET `/api/bookings` — CUSTOMER or TECHNICIAN (own bookings)

**Frontend consumer:** `app/(dashboaredGroup)/_actions/getMyBookings.ts` → customer `bookings-list.tsx`, `dashboard-overview.tsx`; technician `technician-bookings.tsx`, `technician-overview.tsx`; `payment-confirm-watcher.tsx` polls this while a payment is `PENDING`.

**Customer demo response — 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Bookings fetched successfully",
  "data": [
    {
      "id": "b9d2e4f6-...",
      "customerId": "8a0c9b2e-...",
      "technicianId": "7c1a9d2f-...",
      "serviceId": "5aa2c11d-...",
      "status": "PAID",
      "scheduledAt": "2026-01-15T10:00:00.000Z",
      "address": "House 12, Mirpur 10, Dhaka",
      "notes": null,
      "priceAtBooking": "350.00",
      "cancelledAt": null,
      "cancelReason": null,
      "createdAt": "2026-01-02T12:00:00.000Z",
      "updatedAt": "2026-01-02T13:00:00.000Z",
      "service": {
        "title": "Pipe Leak Repair",
        "description": "Fix leaking pipes at home",
        "price": "350.00",
        "durationMins": 60,
        "isActive": true,
        "category": { "name": "Plumbing", "description": "Plumbing services" }
      },
      "technician": {
        "user": { "name": "Karim Hossain", "email": "karim@example.com", "phone": "+8801722222222" },
        "bio": "Plumbing expert with 8 years experience",
        "location": "Mirpur",
        "experienceYrs": 8,
        "hourlyRate": "500.00",
        "totalReviews": 2,
        "avgRating": 4.5
      },
      "payment": { "status": "COMPLETED", "amount": "350.00" }
    }
  ]
}
```

---

### GET `/api/bookings/:id` — CUSTOMER or ADMIN

**Frontend consumer:** `app/(dashboaredGroup)/_actions/getAdminBookingDetail.ts` → `booking-detail-dialog.tsx` (admin bookings detail view).

**Demo response — 200:** same shape as the customer booking item above.

---

### PATCH `/api/bookings/status/:id` — TECHNICIAN

**Frontend consumer:** `app/(dashboaredGroup)/_actions/updateBookingStatus.ts` → `technician-bookings.tsx` (Accept / Decline / Start job / Complete job). Uses optimistic UI.

**Demo request:**

```
PATCH /api/bookings/status/b9d2e4f6-...
```

```json
{ "status": "ACCEPTED" }
```

**Demo response — 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Booking status updated successfully",
  "data": {
    "id": "b9d2e4f6-...",
    "customerId": "8a0c9b2e-...",
    "technicianId": "7c1a9d2f-...",
    "serviceId": "5aa2c11d-...",
    "status": "ACCEPTED",
    "scheduledAt": "2026-01-15T10:00:00.000Z",
    "address": "House 12, Mirpur 10, Dhaka",
    "notes": null,
    "priceAtBooking": "350.00",
    "cancelledAt": null,
    "cancelReason": null,
    "createdAt": "2026-01-02T12:00:00.000Z",
    "updatedAt": "2026-01-02T12:01:00.000Z"
  }
}
```

---

### PATCH `/api/bookings/:id/cancel` — CUSTOMER

**Frontend consumer:** `app/(dashboaredGroup)/_actions/cancelBooking.ts` → `cancel-booking-dialog.tsx` (visible only for `REQUESTED` / `ACCEPTED` / `PAID` bookings).

**Demo request:**

```
PATCH /api/bookings/b9d2e4f6-.../cancel
```

```json
{ "cancelReason": "Changed my mind" }
```

**Demo response — 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Booking cancelled successfully",
  "data": {
    "id": "b9d2e4f6-...",
    "customerId": "8a0c9b2e-...",
    "technicianId": "7c1a9d2f-...",
    "serviceId": "5aa2c11d-...",
    "status": "CANCELLED",
    "scheduledAt": "2026-01-15T10:00:00.000Z",
    "address": "House 12, Mirpur 10, Dhaka",
    "notes": null,
    "priceAtBooking": "350.00",
    "cancelledAt": "2026-01-03T09:00:00.000Z",
    "cancelReason": "Changed my mind",
    "createdAt": "2026-01-02T12:00:00.000Z",
    "updatedAt": "2026-01-03T09:00:00.000Z"
  }
}
```

---

## 7. Payment — `/api/payment`

### POST `/api/payment/create` — CUSTOMER

**Frontend consumer:** `app/(dashboaredGroup)/_actions/createPayment.ts` → `booking-actions.tsx` ("Pay now" on an `ACCEPTED` booking). The returned `paymentURL` is opened in the browser (Stripe-hosted Checkout). Stripe's hardcoded `success_url` returns the user to `/dashboard/bookings`, where `payment-confirm-watcher.tsx` polls until the webhook flips the booking to `PAID`.

**Demo request:**

```json
{ "bookingId": "b9d2e4f6-..." }
```

**Demo response — 201:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Payment created successfully",
  "data": {
    "transactionId": "FIXITNOW-3f2b7a1e-...",
    "paymentURL": "https://checkout.stripe.com/c/pay/cs_test_..."
  }
}
```

---

### GET `/api/payment/` — CUSTOMER (own history)

**Frontend consumer:** `app/(dashboaredGroup)/_actions/getMyPayments.ts` → `payments-list.tsx` and `dashboard-overview.tsx` (total spent).

**Demo response — 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "All My Payments fetched successfully",
  "data": [
    {
      "id": "p001...",
      "bookingId": "b9d2e4f6-...",
      "customerId": "8a0c9b2e-...",
      "transactionId": "FIXITNOW-3f2b7a1e-...",
      "amount": "350.00",
      "provider": "STRIPE",
      "status": "COMPLETED",
      "paidAt": "2026-01-02T13:00:00.000Z",
      "failureReason": null,
      "stripeSessionId": "cs_test_...",
      "gatewayMeta": {
        "sessionId": "cs_test_...",
        "paymentIntentId": "pi_...",
        "paymentStatus": "paid",
        "amountTotal": 35000,
        "currency": "bdt",
        "customerEmail": "rahim@example.com"
      },
      "createdAt": "2026-01-02T12:30:00.000Z",
      "updatedAt": "2026-01-02T13:00:00.000Z",
      "booking": {
        "id": "b9d2e4f6-...",
        "status": "PAID",
        "scheduledAt": "2026-01-15T10:00:00.000Z",
        "address": "House 12, Mirpur 10, Dhaka",
        "priceAtBooking": "350.00",
        "service": {
          "id": "5aa2c11d-...",
          "title": "Pipe Leak Repair",
          "description": "Fix leaking pipes at home",
          "price": "350.00",
          "durationMins": 60
        }
      }
    }
  ]
}
```

---

### GET `/api/payment/:id` — CUSTOMER

**Frontend consumer:** `app/(dashboaredGroup)/_actions/getPaymentById.ts` → `payment-detail-dialog.tsx` (the "Receipt" view opened from `payments-list.tsx`).

**Demo request:**

```
GET /api/payment/p001...
```

**Demo response — 200:** same shape as a single item of the list above.

---

### POST `/api/payment/confirm` — Stripe webhook (server-to-server)

**Not called from the frontend.** Stripe posts the signed event; the backend flips the payment to `COMPLETED` (booking → `PAID`) on `checkout.session.completed`, or the payment to `FAILED` on `checkout.session.expired`. The frontend only observes the result through `payment-confirm-watcher.tsx`.

---

## 8. Review — `/api/review`

### POST `/api/review/` — CUSTOMER

**Frontend consumer:** `app/(dashboaredGroup)/_actions/createReview.ts` → `review-dialog.tsx` ("Leave review" on a `COMPLETED` booking; rating 1–5).

**Demo request:**

```json
{
  "bookingId": "b9d2e4f6-...",
  "rating": 5,
  "comment": "Excellent work, very professional!"
}
```

**Demo response — 201:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Review created successfully",
  "data": {
    "id": "r001...",
    "bookingId": "b9d2e4f6-...",
    "customerId": "8a0c9b2e-...",
    "technicianId": "7c1a9d2f-...",
    "rating": 5,
    "comment": "Excellent work, very professional!",
    "createdAt": "2026-01-03T10:00:00.000Z",
    "updatedAt": "2026-01-03T10:00:00.000Z"
  }
}
```

---

## 9. Admin — `/api/admin`

### GET `/api/admin/categories` — ADMIN

**Frontend consumer:** `app/(dashboaredGroup)/_actions/getAdminCategories.ts` → `admin-categories-board.tsx`, `admin-overview.tsx`.

**Demo response — 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "All Categories fetched successfully",
  "data": [
    {
      "id": "c001...",
      "name": "Plumbing",
      "description": "Plumbing services",
      "iconUrl": null,
      "isActive": true,
      "createdAt": "2026-01-01T09:00:00.000Z",
      "updatedAt": "2026-01-01T09:00:00.000Z",
      "services": [
        {
          "id": "5aa2c11d-...",
          "technicianId": "7c1a9d2f-...",
          "categoryId": "c001...",
          "title": "Pipe Leak Repair",
          "description": "Fix leaking pipes at home",
          "price": "350.00",
          "durationMins": 60,
          "isActive": true,
          "createdAt": "...",
          "updatedAt": "..."
        }
      ],
      "_count": { "services": 1 }
    }
  ]
}
```

---

### POST `/api/admin/categories` — ADMIN

**Frontend consumer:** `app/(dashboaredGroup)/_actions/createCategory.ts` → `admin-categories-board.tsx`. On success it calls `updateTag("public-categories")`.

**Demo request:**

```json
{
  "name": "Gardening",
  "description": "Garden maintenance and landscaping"
}
```

**Demo response — 201:**

```json
{
  "success": true,
  "statusCode": 201,
  "message": "Category created successfully",
  "data": {
    "id": "c009...",
    "name": "Gardening",
    "description": "Garden maintenance and landscaping",
    "iconUrl": null,
    "isActive": true,
    "createdAt": "2026-01-03T11:00:00.000Z",
    "updatedAt": "2026-01-03T11:00:00.000Z"
  }
}
```

---

### GET `/api/admin/allUsers` — ADMIN

**Frontend consumer:** `app/(dashboaredGroup)/_actions/getAdminUsers.ts` → `users-board.tsx` and `admin-overview.tsx`. Filters passed: `role`, `status`, `search`, `page`, `limit`.

**Demo request:**

```
GET /api/admin/allUsers?role=TECHNICIAN&status=ACTIVE&page=1&limit=10
```

**Demo response — 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "All Users fetched successfully",
  "meta": { "page": 1, "limit": 10, "total": 3, "totalPages": 1 },
  "data": [
    {
      "id": "3f2b7a1e-...",
      "name": "Karim Hossain",
      "email": "karim@example.com",
      "phone": "+8801722222222",
      "role": "TECHNICIAN",
      "status": "ACTIVE",
      "address": "Mirpur, Dhaka",
      "avatarUrl": null,
      "createdAt": "2026-01-01T10:00:00.000Z",
      "updatedAt": "2026-01-01T10:00:00.000Z",
      "technicianProfile": {
        "id": "7c1a9d2f-...",
        "avgRating": 4.5,
        "totalReviews": 2,
        "isVerified": true,
        "location": "Mirpur"
      }
    }
  ]
}
```

---

### GET `/api/admin/bookings` — ADMIN

**Frontend consumer:** `app/(dashboaredGroup)/_actions/getAdminBookings.ts` → `admin-bookings-board.tsx` and `admin-overview.tsx` (revenue is computed client-side from paid booking `priceAtBooking`). Filters passed: `status`, `customerId`, `technicianId`, `fromDate`, `toDate`, `search`, `page`, `limit`.

**Demo request:**

```
GET /api/admin/bookings?status=PAID&fromDate=2026-01-01&page=1&limit=10
```

**Demo response — 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "All Bookings fetched successfully",
  "meta": { "page": 1, "limit": 10, "total": 3, "totalPages": 1 },
  "data": [
    {
      "id": "b9d2e4f6-...",
      "customerId": "8a0c9b2e-...",
      "technicianId": "7c1a9d2f-...",
      "serviceId": "5aa2c11d-...",
      "status": "PAID",
      "scheduledAt": "2026-01-15T10:00:00.000Z",
      "address": "House 12, Mirpur 10, Dhaka",
      "notes": null,
      "priceAtBooking": "350.00",
      "cancelledAt": null,
      "cancelReason": null,
      "createdAt": "2026-01-02T12:00:00.000Z",
      "updatedAt": "2026-01-02T13:00:00.000Z",
      "customer": { "name": "Rahim Uddin", "email": "rahim@example.com" },
      "technician": { "user": { "name": "Karim Hossain", "email": "karim@example.com" } }
    }
  ]
}
```

---

### PATCH `/api/admin/user/:id` — ADMIN

**Frontend consumer:** `app/(dashboaredGroup)/_actions/updateUserStatus.ts` → `ban-user-dialog.tsx` (Ban / Unban toggle).

**Demo request:**

```
PATCH /api/admin/user/8a0c9b2e-...
```

```json
{ "status": "BANNED" }
```

**Demo response — 200:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "User status updated successfully",
  "data": {
    "id": "8a0c9b2e-...",
    "name": "Rahim Uddin",
    "email": "rahim@example.com",
    "phone": "+8801711111111",
    "role": "CUSTOMER",
    "status": "BANNED",
    "address": "Dhanmondi, Dhaka",
    "avatarUrl": null,
    "createdAt": "2026-01-01T10:00:00.000Z",
    "updatedAt": "2026-01-03T12:00:00.000Z"
  }
}
```

---

## 10. Error Handling & Client Helpers

- **Server side:** `lib/api.ts` — `serverFetch()` / `serverFetchPage()` unwrap the envelope and throw `ApiError(message, status)` on non-`success`.
- **Client side:** `lib/api-client.ts` — `apiFetch()` with retry/timeout, throws `ApiClientError`; `lib/fetch-backend.ts` handles network retries.
- **User feedback:** every mutation surfaces `toast.success` / `toast.error` (sonner), inline `role="alert"` form errors, and route-level error boundaries (`app/error.tsx`, `app/(dashboaredGroup)/error.tsx`, `error-boundary.tsx`).
- **Common mapped errors:** `401` → force logout + redirect to login; `400` → "This booking is no longer ACCEPTED…"; `409` → "This booking is already paid." / "You already reviewed this booking."
