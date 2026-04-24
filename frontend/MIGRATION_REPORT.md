# 🚀 Vercel Migration & Infrastructure Report

This document outlines the technical transition of **Book-Hub** from a traditional VPS architecture (MetroVPS) to a high-performance Serverless environment (Vercel).

## 📋 Infrastructure Comparison

| Feature | MetroVPS (Legacy) | Vercel (Current) |
| :--- | :--- | :--- |
| **Architecture** | Monolithic SSR | Serverless Functions + Edge Runtime |
| **Deployment** | Manual Git Pull / PM2 | Atomic CI/CD (GitHub Integration) |
| **SSL/HTTPS** | Manual Certbot/Nginx | Automated Managed Certificates |
| **Scaling** | Vertical (Limited by RAM) | Horizontal (Auto-scaling per request) |

---

## 🛠️ Resolved Technical Challenges

### 1. The "Trust Proxy" Cookie Issue
*   **Problem:** On the previous VPS, authentication cookies were intermittently failing because Express did not recognize the reverse proxy.
*   **Solution:** Implemented `app.set('trust proxy', 1)` in `backend/index.ts`. This allows Vercel's Edge Proxy to pass the `X-Forwarded-Proto` header correctly, ensuring `Secure: true` cookies are set only over HTTPS.

### 2. Next.js App Router Bridge Failure
*   **Problem:** The original API bridge in `app/api/[...route]/route.ts` used the Web Fetch API, which struggled to serialize complex Express response streams and headers (like `Set-Cookie`).
*   **Solution:** Migrated the bridge to the **Pages Router** (`pages/api/[...route].ts`). This provides native Node.js `req`/`res` objects, enabling a 100% stable connection between Next.js and the Express backend.

### 3. Database Connection Pooling
*   **Problem:** Serverless functions can exhaust MongoDB connection pools quickly during high traffic.
*   **Solution:** Implemented a global connection caching pattern in `dbConnect.ts` to reuse existing database connections across multiple function invocations.

### 4. Production Build Strictness (TypeScript)
*   **Problem:** Local builds were passing, but Vercel's production environment caught strict type errors regarding `params` and `searchParams` being possibly null.
*   **Solution:** Audited and patched over 9 files with optional chaining (`?.`) to satisfy Next.js 15+ strict type checking.

---

## ✅ Final Health Status
*   **Homepage:** Loaded successfully with dynamic data.
*   **Search API:** Functional and optimized.
*   **Authentication:** Cookies persisting correctly via the new bridge.
*   **Mobile Responsiveness:** 100% verified across 4 breakpoints.

---
**Status:** `Completed` // **Deploy URL:** [oxpecker.pro.bd](https://oxpecker.pro.bd)
