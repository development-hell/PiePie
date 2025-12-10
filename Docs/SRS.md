# PiePie - Software Requirements Specification (SRS)
**Version**: 0.1.4 (Living Document)
**Date**: December 8, 2025
**Project Owner**: Kishan Dev

## 1. Introduction
### 1.1 Purpose
The purpose of "PiePie" is to provide a unified personal finance application that solves the problem of financial fragmentation. It merges personal expense tracking, shared ledgers (like Splitwise), and simple informal ledgers (khatas) into a single platform.

### 1.2 Scope
PiePie will allow users to manage all money movements as transactions between entities. This includes expenses with merchants, shared expenses with friends, and transfers between own accounts (e.g., Bank to Wallet). The system will focus on a "Networked-First" approach, treating every interaction as a potential networked transaction.
**Key Change**: The platform is explicitly multi-user. Users can register, log in, and interact with other registered users securely.

## 2. User Requirements (The "What")
### 2.1 User Personas
*   **Individual User**: Someone who wants to track personal spending and income.
*   **Social User**: Someone who shares expenses with roommates, friends, or travel groups.
*   **Informal Lender/Borrower**: Users keeping track of casual loans and debts.

### 2.2 User Stories
*   "As a user, I want to register and login so that my financial data is private and secure."
*   "As a user, I want to find and connect with other users (friends) on the platform to start sharing expenses."
*   "As a user, I want to record a transaction where I pay a merchant, so I can track my spending."
*   "As a user, I want to split a bill with a friend, so the app tracks who owes what."
*   "As a user, I want to see a chat-like history of transactions with a specific contact or group."
*   "As a user, I want to move money from my Bank Account to my Cash Wallet and have it reflected in my balances."

## 3. Functional Requirements (The "How")
### 3.1 UI/UX Specifications
The application is divided into two distinct zones with specific layouts:
1.  **Public Zone (PublicLayout)**: Accessible to everyone (Landing Page, Auth). Contains Navbar (Logo + Theme Toggle, Login/Get Started or "Go to App" if logged in) and Footer.
2.  **Private App Zone (ProtectedLayout)**: A chat-centric, Telegram-Web-like interface for logged-in users.
    *   **Layout Behavior**: Uses a **Full Width** container (`w-full`) with fixed side margins (`px-4`) on all devices (no max-width cap).
    *   **Navbar**: Contains Logo, Theme Toggle, and **Profile Dropdown** (with Settings/Logout).
    *   **Sidebar**: Collapsible drawer on mobile (Hamburger toggle), Sticky/Fixed on Desktop.
    *   **Footer**: Positioned within the scrollable content area (right side), appearing at the bottom of content or screen.

**Theme Support**:
*   **Light/Dark Mode**: The application will support both light and dark themes.
*   **Implementation**: Toggle via Navbar. Uses **Tailwind v4 CSS variables** (`--color-surface`, `--color-text`) defined in `index.css`. Manual `dark:` utility classes are **forbidden** in components.

**Main Views / URLs**:
1.  **Landing Page / Home**: Public marketing page explaining features.
2.  **Register**: User sign-up form.
3.  **Login**: User authentication form.
4.  **Web App Dashboard / Chat**: The core application where all financial interactions happen (Chat-centric UI).

### 3.2 Features
*   **Authentication**: Complete Register/Login flow with secure **JWT** based authentication. **Strictly Email-based authentication.** Includes **Smart Redirection** (returns user to intended page after login).
*   **Transaction Management**: Create, read, update, delete transactions.
*   **Entity Management**: Manage Contacts, Groups, and Accounts.
*   **Ledger Calculation**: Automated balancing of shared expenses.

### 3.3 Data Inputs/Outputs
*   **Inputs**: User credentials, transaction amounts, dates, descriptions, split details.
*   **Data Models**:
    *   **User**:
        *   `username`: Unique handle for app interactions/chat.
        *   `first_name`: Compulsory.
        *   `last_name`: Optional.
        *   `email`: Unique, used for authentication (login).
        *   `phone_number`: Unique, used for identification/discovery (not login).
        *   `profile_photo`: Image path (Requires Pillow).
        *   `is_deleted`: Boolean (Soft delete flag).
        *   `deleted_at`: Timestamp of deletion.
*   **Outputs**: Net balances, transaction history feeds, expense reports.

## 4. Technical Constraints (Minor Details)
### 4.1 Technology Stack
| Component | Technology | Tooling | Notes |
| :--- | :--- | :--- | :--- |
| **Backend** | **Python (>=3.13)** | `uv` | Modern runtime. |
| **API Framework** | **Django (>=5.2.8)** & **DRF** | `simplejwt`, `Pillow` | **Django Rest Framework** for API. `simplejwt` for Auth. `Pillow` for images. |
| **Frontend** | **React.js (^19.2.0)** | **Vite (^7.2.4)** | TypeScript (~5.9.3), Tailwind CSS v4. |
| **Database** | **PostgreSQL** | - | Required for complex relationship modeling. |
| **Mobile** | **React Native** | - | Future target, sharing logic with web. |

### 4.2 File Structure
The project follows a decoupled structure separating the backend API and the frontend client.

```
PiePie/
├── backend/       # Python backend application code (Django + DRF)
│   ├── main.py
│   └── pyproject.toml
├── frontend/      # React/Vite frontend application code
│   ├── package.json
│   ├── src/
│   └── public/
├── Docs/          # Documentation including SRS
│   └── SRS.md
└── ...
```

### 4.3 System Limitations
*   Initial release will focus on manual data entry; bank sync APIs are out of scope for MVP.

## 5. Development Standards & Rules
This project enforces strict development guidelines to ensure maintainability and consistency.

### 5.1 Project Management
*   **Git Commit Strategy**: Strictly follow [Conventional Commits](https://www.conventionalcommits.org/).
    *   Header: `type(scope): subject` (e.g., `feat(auth): add google login`).
    *   Body: Must explain *why* the change was made.
*   **Python Tooling**: Use **`uv`** for all package management (`uv add`, `uv run`). No `pip` or `venv` directly.

### 5.2 Frontend Standards (React/Vite)
*   **Structure**: **Feature-First** architecture.
    *   `src/features/<FeatureName>/`: Contains components, hooks, routes, API logic specific to a feature.
    *   `src/components/`: Only for global, dumb UI components (Buttons, Cards).
*   **Styling (Tailwind v4)**:
    *   **Configuration**: NO `tailwind.config.ts`. All variables defined in `src/index.css` using `@theme`.
    *   **Theming**: Use semantic CSS variables (e.g., `bg-surface` NOT `bg-white dark:bg-slate-900`) to handle light/dark mode.
    *   **Classes**: Use `clsx` and `tailwind-merge` via `cn()` helper. Avoid `@apply`.
*   **Components**: Key patterns:
    *   **Skeletons**: Use Skeleton loaders instead of full-screen spinners.
    *   **Functional**: Use React Functional Components with strict TS interfaces.

### 5.3 Backend Standards (Django)
*   **Data Safety**: **Soft Delete Only.**
    *   Never use SQL `DELETE`. Use `is_deleted` flag or `deleted_at` timestamp.
    *   Queries must filter out deleted records by default.
*   **Code Quality**: Strict Type Annotations for all functions. Docstrings for all modules/classes.
