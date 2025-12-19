# PiePie - Backend API 🐍

This directory contains the Django backend for the PiePie application. It handles authentication, transaction logic, and data persistence.

![Python](https://img.shields.io/badge/Python-3.13+-blue?logo=python&logoColor=white)
![Django](https://img.shields.io/badge/Django-6.0+-092E20?logo=django&logoColor=white)
![DRF](https://img.shields.io/badge/DRF-Latest-red)

## 🛠️ Tech Stack
*   **Framework:** Django 6.0+
*   **API:** Django Rest Framework (DRF)
*   **Authentication:** `djangorestframework-simplejwt` (JWT)
*   **Database:** PostgreSQL (Production)
*   **Package Manager:** `uv`
*   **Image Processing:** `Pillow`

## 🚀 Getting Started

### Prerequisites
*   Python 3.13+
*   `uv` (Universal Python Package Manager)

### Installation
```bash
# 1. Install dependencies
uv sync

# 2. Apply database migrations
uv run python manage.py migrate

# 3. Create a superuser (optional)
uv run python manage.py createsuperuser

# 4. Run the development server
uv run python manage.py runserver
```

The API will be available at `http://localhost:8000`.

## 📂 Architecture

```
backend/
├── config/             # Project settings (settings.py, urls.py)
├── core/               # Core App: User Model, Auth, Contacts
│   ├── models.py       # Custom User model
│   ├── views.py        # Auth & Profile endpoints
│   └── serializers.py  # Public/Private User serializers
├── ledger/             # Ledger App: Transactions & Chats
│   ├── models.py       # Transaction, Message, Split models
│   ├── views.py        # Dashboard, Chat, Transaction logic
│   └── serializers.py  # Transaction serialization
└── manage.py           # Django CLI
```

## ✨ Key Features
*   **JWT Auth:** Secure token-based access with refresh rotation.
*   **Dashboard API:** Aggregated stats and time-series data for frontend graphs.
*   **Transaction Workflow:** `PENDING` -> `CONFIRMED`/`REJECTED` state machine.
*   **Privacy:** Strict separation of public user info (username, photo) vs private info (email, phone).
