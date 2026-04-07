# IGC-Frontend - Project Context for Agent

This file serves as the primary context reference for Artificial Intelligence agents (like Antigravity/Gemini) working on the `IGC-Frontend` codebase.

## 1. Tech Stack Overview

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | React 19 + TypeScript | Core UI framework and language |
| **Build Tool** | Vite 8 (Beta) | Fast build and development server |
| **Routing** | React Router 7 | For complex application routing and layouts |
| **Styling** | Tailwind CSS v4 | Utility-first CSS, configured in `src/index.css` |
| **UI Components** | Radix UI + shadcn/ui | Headless UI primitives and customizable components |
| **Icons** | Lucide React | Clean, consistent icons |
| **State Management** | Redux Toolkit & React Query | Redux for global app/auth state, React Query for server state |
| **Forms** | React Hook Form + Zod | Form management and schema validation |
| **API Client** | Axios | Configured with interceptors for token refresh handling |
| **Testing** | Vitest + Playwright | Unit/Integration testing and E2E testing |
| **Animations** | Framer Motion & Tailwind Animate | For smooth UI transitions and micro-interactions |

---

## 2. Directory Structure

```text
c:\VNFT\IGC-Frontend\
├── .agents/                 # AI Agent specialized skills (design, UX, refactoring tools)
├── public/                  # Static assets
└── src/                     # Main source code
    ├── components/          # Reusable UI components (custom and shadcn ui)
    ├── features/            # Redux Slices & Thunks (auth, organization, user, store setup)
    ├── hooks/               # Custom React hooks
    ├── lib/                 # Utility functions, axios instances, query clients
    ├── pages/               # React Router pages organized by layout/route
    ├── router/              # React Router configuration (index.tsx)
    ├── services/            # API services/clients
    ├── types/               # Global TypeScript definitions
    ├── App.tsx              # Main App entry (Providers, Interceptors, App initialization)
    └── main.tsx             # React DOM render entry
```

---

## 3. Architecture & Routing

The layout architecture is handled through `react-router` and is highly modular, split between Public paths, User Dashboards, and Organization Dashboards.

### 3.1 Public Routes
* Accessed by unauthorized users.
* Paths: `/` (Landing), `/auth` (Login/Register).
* Open paths for specific logic: `/verify`, `/claim`, `/verify/file` (Certificate verifications).

### 3.2 User Protected Routes (`/usr`)
* For regular users interacting with their personal dashboard.
* Main layout: `UserDashboardLayout`
* Sub-paths: `/usr` (General), `/usr/certificates` (My Certificates), `/usr/organizations` (My Orgs).
* Independent Layout: `/account` (Profile & Security settings).

### 3.3 Organization Protected Routes (`/org/:orgCode`)
* For managing an organization's resources.
* Main layout: `OrgDashboardLayout`
* Sub-paths:
  * `/org/:orgCode` (Overview)
  * `/org/:orgCode/info` (Organization Details)
  * `/org/:orgCode/members` (Member Management)
  * `/org/:orgCode/certificates` (Certificate Management & Verification)
  * `/org/:orgCode/settings` (Org Settings)

---

## 4. State Management Approach

1. **Redux Toolkit (`src/features`)**:
   - Primarily handles Authentication (`authSlice`, `authThunk`).
   - Handles global User state (`userThunk`).
   - Persisted using `redux-persist`.
2. **React Query (`@tanstack/react-query`)**:
   - Handles API data fetching, caching, and mutation (e.g., fetching lists, submitting forms).
3. **Axios Interceptors (`src/lib/axiosInstance.ts`)**:
   - Wired to Redux in `App.tsx` handling silent token refresh (`onTokenRefreshed`) and auto-logout (`onLogout`).

---

## 5. Design & UI Guidelines
* **Theming**: Uses `next-themes` for Dark/Light mode integration with shadcn variables.
* **Colors & Variables**: Built around Oklch color format (referenced in recent HR portal tasks).
* **Components**: When adding new components, check if they exist in `src/components/ui/` or use standard shadcn/ui.
* **Aesthetics**: Focus on rich aesthetics, smooth Framer Motion micro-animations, and clean layouts over basic unstyled pages.

---

## Agent Instructions for Future Edits
- When adding new layouts, ensure they integrate smoothly into `src/router/index.tsx`.
- Place stateful data-fetching logic inside React Query or Redux Thunks.
- UI elements should be composed using existing tools in `components/ui`.
- Use `lucide-react` for any icon requirements.
