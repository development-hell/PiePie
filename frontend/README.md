# PiePie Frontend 🥧

The React client for the PiePie personal finance application.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css&logoColor=white)

## 🚀 Getting Started

### Prerequisites
*   Node.js v20+
*   `npm` or `pnpm`

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start Development Server
npm run dev
```

The app will run at `http://localhost:5173`.

---

## 🏗️ Architecture

This project follows a **Feature-First** directory structure with strict Separation of Concerns.

### Directory Structure

```
frontend/src/
├── app/                  # App-wide setup (store, providers)
├── features/             # Feature Modules (The Core)
│   ├── Auth/             # Login, Register, User State
│   ├── Chat/             # Messaging & Transactions
│   │   ├── components/   # ChatWindow, MessageBubble
│   │   ├── hooks/        # useChatMessages (Data Logic)
│   │   └── types.ts      # Feature-specific Types
│   ├── Contacts/         # Contact Management
│   └── Dashboard/        # Charts & Stats
├── components/           # Global "Dumb" Components (Button, Input, Layouts)
├── lib/                  # Utilities (API client, Formatters)
└── pages/                # Route Components
```

### Key Design Patterns

*   **Container/Presenter**: Complex logic (Data fetching, Error handling) is separated from UI rendering.
    *   _Example:_ `ChatWindow.tsx` (Container) vs `ChatWindowContent.tsx` (Presenter).
*   **Semantic Theming**: All colors use CSS variables (`bg-surface`, `text-primary`) defined in `index.css`. No hardcoded hex values.
*   **Strict Typing**: All Props and API responses are typed via TypeScript interfaces.

---

## ✨ Key Frontend Features

*   **Chat Interface**: Real-time polling, separating "Messages" from "Transactions".
*   **Robust Routing**:
    *   **Guards**: `RequireAuth` protects `/app/*`. `PublicOnly` protects `/login`.
    *   **Error Handling**: Context-aware 404 pages (Generic, User Not Found) with recovery buttons.
*   **Data Validation**:
    *   **Strict URL Parsing**: `/contacts/123v` -> Immediate 404 (RegEx check).
    *   **Input Masks**: Positive-only number inputs for money.
*   **Contact Experience**:
    *   **Detailed Profile**: Header, Stats grid, and Recent Activity feed.
