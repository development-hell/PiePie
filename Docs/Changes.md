# Changelog

## [2025-12-13 23:55] feat(ui): implement collapsible desktop sidebar & update docs
**Summary:** Enhanced the Desktop Sidebar to be collapsible (`w-20` <-> `w-56`) with a "Pin" feature via double-click. Reverted uncommitted Real-Time Chat infrastructure to clean up the codebase. Updated SRS and README to reflect the current state (React 19, Django 6).
**Files Changed:**
*   `frontend/src/components/layout/Navbar.tsx`: Added `onMenuDoubleClick` prop to capture pinning intent.
*   `frontend/src/components/layout/ProtectedLayout.tsx`: Implemented state management for `isDesktopExpanded` and `isPinned`. Fixed layout to use `h-dvh` and correct flexbox flow instead of fixed `vh` heights.
*   `frontend/src/components/layout/Sidebar.tsx`: Added styles for collapsed vs expanded states. Changed desktop positioning to `relative` to respect layout flow.
*   `backend/config/settings.py`: Removed `channels` and `daphne` apps (reverting unused real-time config).
*   `Docs/SRS.md`: Updated Sidebar specifications and Tech Stack versions.
*   `README.md`: Refreshed badges, feature list, and installation guides.


## [2025-12-13 09:05] feat(chat): implement core messaging and transaction system
**Summary:** Implemented the core "Chat & Transaction" feature set. This allows users to manage contacts, navigate to 1:1 chats, exchange text messages, and record financial transactions. Currently operating via REST API (Fetch-on-load). Also enhanced user profile validation.
**Backend Changes:**
* `backend/ledger/`: [NEW] Created `ledger` app.
    * `models.py`: Added `Transaction` and `Message` models.
    * `views.py`: Implemented `ChatViewSet` for message history and transaction creation.
    * `serializers.py`: Added serializers for Messages and Transactions.
* `backend/core/`:
    * `models.py`: Added `RegexValidator` for usernames. Fixed `phone_number` length.
    * `views.py`: Implemented `ContactViewSet`.
**Frontend Changes:**
* `frontend/src/features/Chat/`: [NEW] Implemented full Chat UI.
    * `ChatSidebar.tsx`: Lists recent chats with "You:" prefix for sent messages.
    * `ChatWindow.tsx`: Message list and input area.
    * `MessageBubble.tsx`: Renders text or transaction cards.
* `frontend/src/features/Contacts/`:
    * `ContactsPage.tsx`: Implemented Contact List with navigation to Chat.
* `frontend/src/features/Settings/`: Added username editing to `SettingsPage`.
* `frontend/src/App.tsx`: Registered Chat and Contact routes.


## [2025-12-10 20:50] feat(app): implement settings & refine application layout
**Summary:** Implemented User Settings (Profile Update), enforced security restrictions on Email/Phone, and significantly polished the application layout (App Shell, Full-Width Footer, Hidden Scrollbars). Updated SRS to v0.2.0.
**Files Changed:**
* `Docs/SRS.md`: Updated to v0.2.0 reflecting Layout and Feature changes.
* `backend/core/views.py`: Upgraded `UserDataView` to support PATCH updates. Added `UpdateEmailView`/`UpdatePhoneView` (Restricted).
* `backend/core/serializers.py`: Marked `email` and `phone_number` as read-only.
* `frontend/src/features/Settings/`: [NEW] Added `SettingsPage.tsx` with Profile Form and Security Section.
* `frontend/src/components/layout/ProtectedLayout.tsx`: Refactored to "App Shell" structure (Navbar -> Flex content -> Full-Width Footer). Hidden scrollbars.
* `frontend/src/components/layout/Sidebar.tsx`: Reduced width to `w-56`, increased icon sizes, removed sticky positioning.
* `frontend/src/features/Auth/api.ts` & `AuthContext.tsx`: Added `updateProfile` and restricted field update methods.
* `frontend/src/index.css`: Added `.no-scrollbar` utility.


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
