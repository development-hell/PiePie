# PiePie - Frontend Client ⚛️

This directory contains the React frontend for PiePie. It provides a responsive, app-like experience for managing personal finances.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-7.0-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css&logoColor=white)

## 🛠️ Tech Stack
*   **Core:** React 19, TypeScript
*   **Build Tool:** Vite 7
*   **Styling:** Tailwind CSS v4 (with CSS Variables)
*   **Routing:** React Router DOM 7
*   **State Management:** React Context (Auth), Local State
*   **Data Fetching:** Axios (with Interceptors)
*   **Visualization:** Recharts
*   **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites
*   Node.js v20+
*   npm

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📂 Architecture

```
src/
├── components/         # Shared UI components (Input, Button, Skeleton)
│   └── layout/         # App Shell, Sidebar, Navbar
├── features/           # Feature-based architecture
│   ├── Auth/           # Login, Register, AuthContext
│   ├── Chat/           # Messaging, Transaction Bubbles
│   ├── Contacts/       # Contact List & Management
│   ├── Dashboard/      # Stats, Trend Graphs, Activity Feed
│   └── Settings/       # Profile management
├── lib/                # Utilities (api.ts, utils.ts)
├── App.tsx             # Main Router & Route Guards
└── index.css           # Global Theme Variables & Tailwind Config
```

## ✨ Key Features
*   **Feature-First Structure:** Code is collocated by business logic (Auth, Chat, etc.) rather than file type.
*   **Dark Mode:** Semantic CSS variables controlled by a global ThemeContext.
*   **Route Guards:** `RequireAuth` and `PublicOnly` components for security.
*   **Responsive Design:** Mobile Drawer navigation and Desktop Pinnable Sidebar.
