# PiePie - Software Requirements Specification (SRS)
**Version**: 0.3.0 (Living Document)
**Date**: December 14, 2025
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
*   "As a user, I want to manage my profile details (Name, Photo) while keeping sensitive info (Email, Phone) secure."
*   "As a user, I want to find and connect with other users (friends) on the platform to start sharing expenses."
*   "As a user, I want to record a transaction where I pay a merchant, so I can track my spending."
*   "As a user, I want to split a bill with a friend, so the app tracks who owes what."
*   "As a user, I want to see a chat-like history of transactions with a specific contact or group."

## 3. Functional Requirements (The "How")
### 3.1 UI/UX Specifications
The application is divided into two distinct zones with specific layouts:
1.  **Public Zone (PublicLayout)**: Accessible to everyone (Landing Page, Auth). Contains Navbar and Footer.
2.  **Private App Zone (ProtectedLayout)**: A chat-centric, Telegram-Web-like interface for logged-in users.
    *   **Transaction-First Chat UI**: The chat window input defaults to valid transaction entry (Amount, Pay/Request buttons) with a toggle for standard text messages.
    *   **App Shell Structure**: `h-screen` Flex Column.
        *   **Top**: Navbar (Logo, Theme Toggle, Profile Dropdown).
        *   **Middle**: Flex Row containing Sidebar and Main Content.
        *   **Bottom**: Full-width Footer.
    *   **Chat Window**:
        *   **Header**: Contains Back Button (returns to list), User Avatar (with initials fallback), Display Name (First Last > Username), and Context Menu.
        *   **Display Name Logic**: Prioritizes `First Name Last Name`. Falls back to `@username` if names are missing.
    *   **Contacts Page**:
        *   **Layout**: Tabular list view for better organization.
        *   **Columns**: # (Serial Number), Name (w/ Avatar), Username, Actions.
        *   **Actions**: Message (Jump to chat), Settings, Delete.
        *   **Interaction**: Row click navigates to Contact Detail view.
    *   **Contact Detail Page**:
        *   **Header**: Large Profile Photo, Name, Username, and Quick Actions (Message, Block, Delete).
        *   **Stats Grid**: 'Shared History' (Transaction Count), 'Last Interaction' (Date), and Relationship Status.
        *   **Recent Activity**: Chronological list of recent financial transactions (In/Out) derived from chat history.
    *   **Sidebar**:
        *   **Desktop**:
            *   **Default**: Collapsed (`w-20`), displaying icons only.
            *   **Interactive**:
                *   **Click**: Expands temporally (`w-56`) to show labels. Collapses on outside click.
                *   **Double-Click**: Pins sidebar open.
        *   **Mobile**: Fixed Collapsible drawer with overlay.
        *   **Style**: Large icons (`24px`), readable text (`text-base`).
    *   **Main Content**:
        *   Scrollable area independently handling overflow.
        *   **Scrollbars**: Hidden (`.no-scrollbar`) for a cleaner look while maintaining functionality.

**Theme Support**:
*   **Light/Dark Mode**: The application will support both light and dark themes.
*   **Implementation**: Toggle via Navbar. Uses **Tailwind v4 CSS variables** (`--color-surface`, `--color-text`) defined in `index.css`. Manual `dark:` utility classes are **forbidden** in components.
*   **Error Handling**:
    *   **Consistent 404s**: All "Not Found" states (Generic, User, Contact) must provide consistent navigation options: "Go Back", "Go Home", and "Dashboard".
    *   **Contextual Feedback**: Error pages should clearly state *what* was not found (e.g., "User @foo not found").

**Main Views / URLs**:
1.  **Landing Page / Home**: Public marketing page explaining features.
2.  **Register**: User sign-up form.
3.  **Login**: User authentication form.
4.  **Web App Dashboard / Chat** (`/app/chats`): Core interaction center.
5.  **Settings** (`/app/settings`): User profile management.

### 3.2 Features
*   **Authentication**:
    *   Complete Register/Login flow with secure **JWT** based authentication (Access/Refresh tokens).
    *   **Strictly Email-based authentication.**
    *   **Smart Redirection**: Returns user to intended page after login.
*   **User Management**:
    *   **Profile Updates**: Users can update First Name and Last Name.
    *   **Security Restrictions**: Email and Phone Number are **Read-Only** in the UI. Updates via API are restricted (return 403 Forbidden).
*   **Transaction & Chat Management**:
    *   **Unified Chat Interface**: Messages and Transactions appear in a single chronological feed.
    *   **Real-Time Updates (Polling)**: "Near real-time" experience via smart polling (3s interval, window-focus aware).
    *   **Lazy Loading**: Efficient history loading. Initial fetch (30 items) with seamless scroll-up pagination.
    *   **Transaction Workflow**:
        *   **Send vs Request**: Distinct flows for paying vs requesting money.
        *   **Confirmation Loop**: Transactions start as `PENDING`. Counterparty must `CONFIRM` or `REJECT`.
        *   **Security**: Initiator cannot approve their own requests.
    *   Create, read, update, delete transactions.
*   **Entity Management**: Manage Contacts, Groups, and Accounts.
    *   **Strict URL Validation**: ID parameters in URLs (e.g., `/contacts/:id`) must be strictly numeric. Non-numeric IDs (e.g., `123v`) must trigger an immediate 404 error.
*   **Privacy & Security**:
    *   **Data Minimization**: Public endpoints (Contact Search, Chat Recipients) only expose `username`, `first_name`, `last_name`, and `profile_photo`.
    *   **Field Restricted**: `email` and `phone_number` are strictly private to the owner.
*   **Validation**:
    *   **Positive Values**: Transaction amounts must be strictly positive (> 0). Negative values are rejected at both UI and API levels.
*   **Ledger Calculation**: Automated balancing of shared expenses.
*   **Dashboard**:
    *   **Financial Overview**: High-level stats (Total Sent, Total Received, Pending Actions).
    *   **Trend Analysis**: Interactive graph (Line/Bar/Pie) illustrating spending history over time (7d, 30d, 90d, 1y).
        *   **Filters**: View 'All', 'Sent', 'Received', 'My Requests' (Owned), or 'Others Requests' (Not Owned).
    *   **Activity Feed**: Unified chronological stream of recent transactions.

### 3.3 Data Inputs/Outputs
*   **Inputs**: User credentials, transaction amounts, dates, descriptions, split details.
*   **Data Models**:
    *   **User**:
        *   `username`: Unique handle.
        *   `first_name`: Compulsory.
        *   `last_name`: Optional.
        *   `email`: Unique, Read-Only after registration.
        *   `phone_number`: Unique, Read-Only after registration.
        *   `profile_photo`: Image path.
        *   `is_deleted`: Boolean (Soft delete flag).
    *   **Message**:
        *   `sender`, `recipient`, `content`, `transaction_link`.
    *   **Transaction**:
        *   `payer`, `recipient`, `amount`, `description`.
        *   `status`: PENDING, CONFIRMED, REJECTED.
        *   `created_by`: User who initiated the transaction (for Pay vs Request logic).
*   **Outputs**: Net balances, transaction history feeds.

## 4. Technical Constraints (Minor Details)
### 4.1 Technology Stack
| Component | Technology | Tooling | Notes |
| :--- | :--- | :--- | :--- |
| **Backend** | **Python (>=3.13)** | `uv` | Modern runtime. |
| **API Framework** | **Django (>=6.0)** & **DRF** | `simplejwt`, `Pillow` | **Django Rest Framework** for API. `simplejwt` for Auth. |
| **Frontend** | **React.js (^19.2.0)** | **Vite (^7.2.4)** | TypeScript (~5.9.3), Tailwind CSS v4. **Recharts** for graphs. |
| **Database** | **PostgreSQL** | - | Required for complex relationship modeling. |
| **Mobile** | **React Native** | - | Future target, sharing logic with web. |

### 4.2 File Structure
The project follows a decoupled structure separating the backend API and the frontend client.

```
PiePie/
├── backend/       # Python backend application code (Django + DRF)
│   ├── core/      # User & Auth
│   ├── ledger/    # Chat & Transactions
│   ├── main.py
│   └── pyproject.toml
├── frontend/      # React/Vite frontend application code
│   ├── package.json
│   ├── src/
│   │   ├── components/  # Global UI components & Layouts
│   │   ├── features/    # Feature-based folders (Auth, Chat, Contacts, Settings)
│   │   │   └── Chat/
│   │   │       ├── components/
│   │   │       ├── hooks/       # Custom hooks (useChatMessages)
│   │   │       ├── pages/
│   │   │       ├── api.ts
│   │   │       └── types.ts
│   │   └── lib/         # Utilities (API, Helper functions)
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
    *   **Imports**: Use Absolute Imports (`@/features/...`) exclusively.
    *   **Design Patterns**: Use **Container/Presenter** pattern for complex logic (e.g., ChatWindow). Separate Data/Error logic (Container) from UI/Rendering logic (Presenter) into distinct files.

### 5.3 Backend Standards (Django)
*   **Data Safety**: **Soft Delete Only.**
    *   Never use SQL `DELETE`. Use `is_deleted` flag or `deleted_at` timestamp.
    *   Queries must filter out deleted records by default.
*   **Code Quality**: Strict Type Annotations for all functions. Docstrings for all modules/classes.
