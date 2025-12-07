# PiePie - Software Requirements Specification (SRS)
**Version**: 0.1.1 (Living Document)
**Date**: December 7, 2025
**Project Owner**: Kishan Dev

## 1. Introduction
### 1.1 Purpose
The purpose of "PiePie" is to provide a unified personal finance application that solves the problem of financial fragmentation. It merges personal expense tracking, shared ledgers (like Splitwise), and simple informal ledgers (khatas) into a single platform.

### 1.2 Scope
PiePie will allow users to manage all money movements as transactions between entities. This includes expenses with merchants, shared expenses with friends, and transfers between own accounts (e.g., Bank to Wallet). The system will focus on a "Networked-First" approach, treating every interaction as a potential networked transaction.

## 2. User Requirements (The "What")
### 2.1 User Personas
*   **Individual User**: Someone who wants to track personal spending and income.
*   **Social User**: Someone who shares expenses with roommates, friends, or travel groups.
*   **Informal Lender/Borrower**: Users keeping track of casual loans and debts.

### 2.2 User Stories
*   "As a user, I want to record a transaction where I pay a merchant, so I can track my spending."
*   "As a user, I want to split a bill with a friend, so the app tracks who owes what."
*   "As a user, I want to see a chat-like history of transactions with a specific contact or group."
*   "As a user, I want to move money from my Bank Account to my Cash Wallet and have it reflected in my balances."

## 3. Functional Requirements (The "How")
### 3.1 UI/UX Specifications
*   **Chat-Centric Interface**: The core interaction model will resemble a messaging app. Transactions are "messages" in a conversation thread with an entity (friend, merchant, or account).
*   **Unified Entity Model**: A consistent UI for interacting with any entity type.

### 3.2 Features
*   **Transaction Management**: Create, read, update, delete transactions.
*   **Entity Management**: Manage Contacts, Groups, and Accounts.
*   **Ledger Calculation**: Automated balancing of shared expenses.

### 3.3 Data Inputs/Outputs
*   **Inputs**: Transaction amounts, dates, descriptions, split details.
*   **Outputs**: Net balances, transaction history feeds, expense reports.

## 4. Technical Constraints (Minor Details)
### 4.1 Technology Stack
| Component | Technology | Tooling | Notes |
| :--- | :--- | :--- | :--- |
| **Backend** | **Python (>=3.13)** | `uv` | Modern runtime. (Planning Django >= 5.2.8) |
| **Frontend** | **React.js (^19.2.0)** | **Vite (^7.2.4)** | TypeScript (~5.9.3) based setup. |
| **Database** | **PostgreSQL** | - | Required for complex relationship modeling. |
| **Mobile** | **React Native** | - | Future target, sharing logic with web. |

### 4.2 File Structure
The project follows a decoupled structure separating the backend API and the frontend client.

```
PiePie/
├── backend/       # Python backend application code
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
