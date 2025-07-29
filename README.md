# HR Management SaaS — Multi-Tenant Web App 🚧

> ⚠️ **This project is still under active development.**  
> Features and structure may change. Not yet production-ready.

A scalable, full-stack **multi-tenant HR management system**, designed to support multiple businesses (tenants) under a single platform. Built with **Next.js**, **Prisma**, and **PostgreSQL**, the app supports custom subdomains, role-based access control, and clean UX flows for HR operations.


---

## 🚀 Features

### ✅ Multi-Tenant Architecture
- Custom **subdomain-based tenant routing** (e.g. `company1.app.com`, `company2.app.com`)
- All data is scoped per tenant securely via `tenantId`.

### ✅ Authentication & Authorization
- **JWT-based authentication**
- Centralized **RBAC** (Role-Based Access Control) via permissions abstraction
- Separate role definitions for **users** and **employees**

### ✅ User & Employee Management
- Send **email invites** to join a tenant
- Accept invite → auto-create user under tenant
- Manage **employee details**, departments, designations, work locations

### ✅ Leave Management
- Employees can **apply for leave**
- Shows which employees are **currently on leave**

### ✅ Form Handling
- **Zod validation** for both client and server
- Regex-based strict validation for fields like Aadhaar, PAN, etc.
- Built with `react-hook-form` and custom UI components

### ✅ Server Actions & API Routes
- Next.js **Server Actions** for secure form handling and mutation
- RESTful **API routes** for dynamic data fetching

### ✅ Filtering, Pagination, and Performance
- **Server-side pagination** for large datasets
- Filter employees, leave requests, and notifications
- Optimized database queries using **Prisma**

---

## 🧱 Tech Stack

| Tech | Purpose |
|------|---------|
| **Next.js App Router** | Full-stack React framework |
| **Prisma ORM** | Type-safe DB access |
| **PostgreSQL** | Relational DB |
| **Tailwind CSS + shadcn/ui** | UI styling and components |
| **React Hook Form + Zod** | Form state and validation |
| **JWT** | Stateless auth |
| **TypeScript** | End-to-end type safety |

---

## 🔮 Planned Features

- Email/OTP verification
- Audit logging for admin actions
- Dashboard with key HR metrics (leave, headcount, pending requests)
- Announcement system for company-wide updates
- Task assignment and tracking for employees
