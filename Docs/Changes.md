# Changelog

## [2025-12-10 14:02] feat(ui): improve responsive layout & documentation
**Summary:** Refined the application layout for better responsiveness and usability. Key improvements include a Mobile Sidebar (Drawer) toggle, Full-Width Desktop Layout (removing max-width boundaries), and Fixed/Scrollable Footer positioning. Also synchronized the `README.md` and `SRS.md` documenation with the latest codebase state.
**Files Changed:**
* `frontend/src/components/layout/Navbar.tsx`: Added `Menu` toggle for mobile and removed max-width constraints.
* `frontend/src/components/layout/Sidebar.tsx`: Implemented Mobile Drawer pattern with `isOpen` control.
* `frontend/src/components/layout/ProtectedLayout.tsx`: Updated layout logic for Sidebar states, Full-Width container, and Footer positioning (content-relative).
* `frontend/src/lib/utils.ts`: Added `cn` utility for Tailwind class merging.
* `Docs/SRS.md`: Updated Layout specs, Responsive behaviors, and UI/UX requirements.
* `README.md`: Updated with accurate Project Tech Stack (Django 5/React 19), Setup Instructions, and Architecture overview.

## [2025-12-10 00:55] feat: implement complete auth system & frontend foundation
**Summary:** Implemented the complete end-to-end Authentication system and established the core Frontend architecture. This massive update includes the transition to **JWT Authentication**, creation of the Custom User Model, full Login/Registration UI, Route Protection, and the main Application Layouts (Sidebar, Navbar with Profile Dropdown).
**Backend Changes:**
* `backend/core/`: Created `core` app with Custom `User` model (email-based auth) and soft-delete support.
* `backend/config/`: configured Django settings, including `CORS`, `CSRF`, and `rest_framework_simplejwt`.
* `backend/core/urls.py`, `views.py`: Exposed Auth endpoints (`/register`, `/token`, `/token/refresh`, `/logout`, `/user`).
**Frontend Changes:**
* `frontend/src/features/Auth/`: Implemented `LoginPage`, `RegisterPage`, `AuthContext` (managing JWT tokens in `localStorage`), and `api` service.
* `frontend/src/lib/api.ts`: Configured Axios with Interceptors for auto-attaching `Bearer` tokens and handling Token Refresh (401 reprocessing).
* `frontend/src/components/layout/`: Created `ProtectedLayout` (App), `PublicLayout` (Auth), `Sidebar` (Navigation), and `Navbar` (Conditionals + Profile Dropdown).
* `frontend/src/components/RouteGuards.tsx`: Implemented `RequireAuth` and `PublicOnly` guards with Smart Redirection (`?next=` support).
* `frontend/src/index.css`: Set up Tailwind CSS v4 with semantic theming (Light/Dark mode variables).
**Documentation:**
* `Docs/SRS.md`: Updated to reflect the actual implementation details (JWT, Features, UI Specs).

## [2025-12-07 23:15] chore(init): initial project setup and SRS update
**Summary:** Initialized the project repository, set up the directory structure for backend and frontend, and established the Software Requirements Specification (SRS) v0.1.1.
**Files Changed:**
* `Docs/SRS.md`: Created/Updated SRS with project vision, scope, and technical stack details (Python/Django backend, React/Vite frontend).
* `Docs/Changes.md`: Created this changelog file.
* `backend/`: Included initial backend configuration and structure.
* `frontend/`: Included initial frontend configuration and structure.
* `.gitignore`, `README.md`: Initial project files.
