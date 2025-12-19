# PiePie Backend 🐍

The Django REST Framework API for the PiePie application.

![Python](https://img.shields.io/badge/Python-3.13-blue?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-6.0-092E20?logo=django&logoColor=white)

## 🚀 Getting Started

### Prerequisites
*   Python 3.13+
*   `uv` Package Manager

### Installation

```bash
# 1. Install Dependencies
uv sync

# 2. Run Migrations
uv run python manage.py migrate

# 3. Start Server
uv run python manage.py runserver
```

The API will run at `http://localhost:8000`.

---

## 🏗️ Architecture

The backend is structured into modular Django Apps.

### Key Modules

*   **`core/`**: Handles fundamental data.
    *   **Custom User Model**: Extends `AbstractUser`.
    *   **Contacts**: Manages `Contact` relationships using `symmetric=False`.
*   **`ledger/`**: Handles the business logic.
    *   **Transactions**: The core entity recording money movement.
    *   **Splits**: (Future) Logic for multi-user bill splitting.

### Security Features

*   **JWT Authentication**: Stateless auth via `simplejwt`.
*   **Soft Delete**: Data is never removed (`DELETE` SQL), only marked `is_deleted=True`.
*   **Privacy Guard**: Public Serializers strictly exclude `email` and `phone_number`.

---

## 📝 API Overview

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/token/` | POST | Obtain Access/Refresh Token |
| `/api/users/me/` | GET | Get generic profile |
| `/api/contacts/` | GET | List all contacts |
| `/api/ledger/transactions/` | POST | Create defined transaction |
| `/api/ledger/dashboard/` | GET | Get stats summary |
