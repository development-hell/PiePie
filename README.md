# PiePie 🥧

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Python](https://img.shields.io/badge/Python-3.13+-blue?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-6.0+-092E20?logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-19+-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.0+-646CFF?logo=vite&logoColor=white)

PiePie is a unified personal finance application designed to merge personal expense tracking, shared ledgers, and informal debts into a single, networked platform. It aims to solve financial fragmentation by treating every transaction as a potential networked interaction between users.

---

## 🛠️ Tech Stack

### Backend
*   **Core:** Python 3.13+, Django 6.0+, Django Rest Framework (DRF)
*   **Auth:** `djangorestframework-simplejwt` (JWT Authentication)
*   **Database:** PostgreSQL (Production), SQLite (Dev)
*   **Tooling:** `uv` (Package Management)

### Frontend
*   **Core:** React 19, TypeScript
*   **Build:** Vite 7
*   **Styling:** Tailwind CSS v4 (Variable-based theming)
*   **Routing:** React Router DOM 7
*   **State:** React Context API (Auth), Axios (API Client)

---

## 🚀 Getting Started

### Prerequisites
*   **Python:** 3.13 or higher
*   **Node.js:** v20+ recommended
*   **Package Manager:** `uv` (for Python) and `npm` (for Node)

### Installation

#### 1. Backend Setup (Django)
```bash
cd backend
# Install dependencies using uv
uv sync
# Run migrations
uv run python manage.py migrate
# Start the dev server
uv run python manage.py runserver
```

#### 2. Frontend Setup (React)
```bash
cd frontend
# Install dependencies
npm install
# Start the dev server
npm run dev
```

The app will accept API requests at `http://localhost:8000` and the frontend will run at `http://localhost:5173`.

---

## 📂 Project Architecture

The project follows a decoupled structure:

```
PiePie/
├── backend/               # Django API
│   ├── config/            # Settings & Configuration
│   ├── core/              # Core functionality (Auth, User Model, Contacts)
│   ├── ledger/            # Transaction & Ledger logic
│   └── manage.py
├── frontend/              # React Client
│   ├── src/
│   │   ├── components/    # Global shared components
│   │   ├── features/      # Feature-based modules (Auth, Chat, Contacts)
│   │   ├── lib/           # Utilities (API client)
│   │   ├── App.tsx        # Main Routing
│   │   └── index.css      # Global Styles & Theme Variables
│   └── vite.config.ts
└── Docs/                  # Documentation (SRS, Changelog)
```

---

## ✨ Features

*   **🔐 Authentication:** Safe and secure Email-based Login & Registration using **JWT**.
    *   Auto-refreshing tokens via Axios interceptors.
    *   Smart Redirection (`?next=`) logic.
*   **👥 Contacts Management:**
    *   Add users by unique username.
    *   Shared transaction history.
*   **💸 Transaction Ledger:**
    *   Record expenses/payments with contacts.
    *   Smart splitting logic (Basic).
*   **🛡️ Route Protection:** Check authentication state before accessing private routes (`/app/*`).
*   **🎨 Dynamic Theming:** Light/Dark mode support using CSS Variables & Tailwind v4.
*   **📱 Responsive Layouts:**
    *   **Mobile:** App-like Full-screen experience with Collapsible Drawer.
    *   **Desktop:** "Holy Grail" layout with **Collapsible/Pinnable Sidebar** (`w-20` <-> `w-56`).
*   **👤 User Profile:** Manage session via Navbar dropdown.
*   **🔒 Data Privacy:** Strict "Public vs Private" data separation. Emails/Phones are never exposed to other users.
*   **✅ Robust Validation:** Server-side and Client-side checks (e.g., Positive-only transaction amounts).

---

## 📏 Development Standards

*   **Commits:** Must follow [Conventional Commits](https://www.conventionalcommits.org/) (e.g., `feat(auth): add logout`).
*   **Package Management:** Always use `uv add <pkg>` for backend and `npm install <pkg>` for frontend.
*   **Styling:** Use semantic variables (e.g., `bg-surface`) defined in `index.css`. Avoid hardcoded colors.
*   **Code Quality:** Strict TypeScript typing and Python type hints required.
