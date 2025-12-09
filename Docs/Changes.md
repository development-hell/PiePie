# Changelog

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
