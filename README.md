<div align="center">
  <h1>KPLY DIA Front-End</h1>
  <p><strong>React 19 + Vite 7 + Redux Toolkit + Tailwind CSS</strong></p>
  <p>Modular admin/dashboard style interface with authentication, navigation, PDF receipt generation and scalable state management.</p>
</div>

---

## 📌 Overview

This project is a React (Vite) front-end implementing:

- A responsive dashboard layout with collapsible sidebar navigation
- Authentication state (mock) with persistence using Redux Toolkit + redux-persist
- Modular route-driven pages (Forane, Parish, Institution, Community, Family, User Profile, etc.)
- PDF receipt generation utilities (generic + family specific) using jsPDF
- Tailwind CSS (v4 with @tailwindcss/vite) for styling
- Opinionated project structure for easy extension

> Note: APIs are currently mocked (see `src/services/authApi.js`). Swap these out with real HTTP calls when backend endpoints are available.

---

## 🗂️ Project Structure (Key Folders)

```
src/
  assets/                # Static assets (images, svg, etc.)
  components/
    layout/              # Layout shell (Sidebar, Header, wrapper)
    pages/               # Route-level views
    ui/                  # Reusable presentational components / cards / modal
    forms/               # Entity creation / edit forms
    auth/                # Auth related views (Login, Dashboard placeholder)
  services/
    authApi.js           # Mock auth API service
    pdfHelper.ts         # PDF generation helpers (generic + family receipt)
  store/
    slices/              # Redux slices (auth slice implemented)
    hooks.js             # Convenience selector/dispatch hooks
    index.js             # Store + persistence config
  types/
    auth.js              # Auth related type constants & JSDoc typedefs
  App.jsx                # App root wiring layout
  main.jsx               # React root + Provider + Router binding
```

See `REDUX_SETUP.md` for deeper Redux-specific notes.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended LTS)
- npm (bundled with Node) or pnpm/yarn if you adapt scripts

### Install Dependencies

```powershell
npm install
```

### Run Development Server

```powershell
npm run dev
```

The app will start (by default) at: http://localhost:5173

### Build for Production

```powershell
npm run build
```

Output goes to `dist/`. You can locally preview the production build:

```powershell
npm run preview
```

### Code Quality

```powershell
npm run lint        # ESLint
npm run format      # Prettier write
npm run format:check
```

---

## 📦 Scripts (package.json)

| Script        | Description                                              |
| ------------- | -------------------------------------------------------- |
| dev           | Start Vite dev server                                    |
| build         | Production build                                         |
| preview       | Preview built assets                                     |
| lint          | Run ESLint over project                                  |
| format        | Auto-format with Prettier                                |
| format:check  | Check formatting (no write)                              |
| format:staged | Format only staged files (use with lint-staged / manual) |

---

## 🧱 Tech Stack

- React 19 (Concurrent features ready)
- Vite 7 bundler
- Redux Toolkit 2 + redux-persist
- React Router DOM v7
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- jsPDF (PDF generation)
- react-icons (iconography)
- ESLint 9 + Prettier 3 (consistent formatting & linting)

---

## 🔐 Authentication Layer

Implemented with Redux Toolkit slice (`authSlice.js`):

- Async thunks: `loginUser`, `registerUser`, `logoutUser`, `getCurrentUser`
- Persisted fields: `user`, `accessToken`, `isAuthenticated`
- Status handling: `idle | loading | success | failed`
- Error typing & classification (validation, auth, network, etc.)

Mock credentials (see `authApi.js`):

```
admin@example.com / admin123
user@example.com  / user123
```

Convenience hooks (`store/hooks.js`):

- `useAuth()` – full auth slice
- `useUser()` – current user object
- `useIsAuthenticated()` – boolean flag
- `useAuthLoading()` / `useAuthError()` – UI states

Protecting a route (manual pattern):

```jsx
import { useIsAuthenticated } from '@/store/hooks';
import { Navigate } from 'react-router-dom';

export function Protected({ children }) {
  const authed = useIsAuthenticated();
  return authed ? children : <Navigate to="/login" replace />;
}
```

---

## 🧭 Navigation & Routing

Routes are defined within `components/layout/index.jsx` using `<Routes>`. Sidebar items are configured centrally in `constants.js` (`menuItems`). Submenu expansion auto-detects active descendant paths and supports mobile toggle.

Key paths:

```
/dashboard
/forane/list, /forane/add
/parish/list, /parish/add
/institution/list, /institution/add
/parish/list/:parishId/community/list
/parish/list/:parishId/community/:communityId/visit
/parish/list/:parishId/community/:communityId/family/add
/user-profile
```

---

## 🧾 PDF Receipt Generation (`pdfHelper.ts`)

Two primary builder utilities:

- `buildGenericReceiptPdf(payload)` – Flexible, multi-entity receipt layout
- `buildFamilyReceiptPdf(data)` – Backward compatible specific variant
- `generateReceiptPdf(payload, options)` – Save or open print dialog
- `generateFamilyReceiptPdf(data, options)` – Same for family data

Highlights:

- Clean A4 layout with badge, metadata, two-column dynamic field grid
- Currency normalization (`formatCurrency`) tolerant of varied input formats
- Print vs Download mode (`options.mode`)
- Extensible: supply any custom fields array

Example usage:

```ts
generateReceiptPdf(
  {
    id: 42,
    title: 'St. Mary Family',
    subtitleLabel: 'Community',
    subtitleValue: 'North Block',
    fields: [
      { label: 'Parish', value: 'Example Parish' },
      { label: 'Family Head', value: 'John Augustine' },
      { label: 'Contact', value: '+91 9876543210' },
    ],
    totalValue: 60000,
    generatedBy: 'Admin',
  },
  { mode: 'download' }
);
```

---

## 🎨 Styling

Tailwind CSS v4 via the official Vite plugin (`@tailwindcss/vite`). Utility classes are used directly in JSX. You can add design tokens or component abstractions as the UI matures. Global styles live in `index.css` & `App.css`.

---

## 🧪 Testing (Planned)

Currently no automated tests. Suggested future additions:

- Unit tests for `authSlice` reducers & thunks (msw for API mocking)
- Utility tests for `formatCurrency` and PDF builder layout decisions
- Component smoke tests (React Testing Library) for Sidebar navigation logic

---

## 🔄 State Persistence Details

`redux-persist` stores the auth slice (selected keys) in `localStorage`. Rehydration happens via `<PersistGate>` in `main.jsx`, displaying a lightweight fallback while restoring state.

---

## 🏗️ Extending the App

Suggested next steps:

1. Replace mock auth with real HTTP API (e.g., fetch/axios layer)
2. Implement role-based route protection using `USER_ROLES`
3. Add form validation (React Hook Form + Zod/Yup)
4. Add loading skeleton components for list pages
5. Introduce an error boundary + toast notification system
6. Add environment variable handling (e.g., `.env` -> `import.meta.env.VITE_API_URL`)
7. Introduce testing + CI lint/format/test pipeline

---

## 🛡️ Environment & Configuration

Vite config: `vite.config.js` (React + Tailwind plugins). Add environment variables by creating `.env` files and accessing via `import.meta.env`.

Example `.env` snippet:

```
VITE_API_BASE_URL=https://api.example.com
```

---

## 🧹 Code Style & Linting

- ESLint base + React Hooks + Refresh plugins
- Prettier for formatting
- Run `npm run lint` before committing; optionally add a pre-commit hook using husky/lint-staged.

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feat/your-feature`
2. Install deps & run dev server
3. Keep commits focused; follow conventional style if possible (e.g., `feat: add X`)
4. Run lint & format scripts
5. Open PR against the active development branch (`feat/ui-components` or `main` as designated)

---

## 🧾 License

Currently unspecified (private/internal). Add a LICENSE file when ready (MIT / Apache-2.0 / Proprietary).

---

## 🙋 FAQ

**Q: Why mock auth?**
To enable front-end integration & state handling early without blocking on backend readiness.

**Q: How to add another entity (e.g., Donations)?**
Create a slice, API service file, form component, and add routes + sidebar entry; follow existing patterns.

**Q: Can I tree-shake unused icons?**
Yes, `react-icons` already exposes per-icon modules; only imported icons are bundled.

---

## 📚 Additional Docs

See `REDUX_SETUP.md` for in-depth Redux explanations.

---
