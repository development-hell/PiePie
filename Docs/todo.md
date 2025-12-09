# PiePie Implementation Todo

## 🟢 Completed
- [x] **Project Scaffolding**: Initialize `backend/` and `frontend/` directories.
- [x] **Documentation**: Create `Docs/SRS.md` (v0.1.3) and `Docs/Changes.md`.
- [x] **Version Control**: Git init, branch setup, and initial commit.

## 🟡 In Progress / Next Up
### Backend (Django + DRF)
- [x] **Environment Setup**: Install Django, djangorestframework, psycopg2-binary, uv.
- [x] **Project Setup**: `django-admin startproject config .` inside `backend/`.
- [x] **App Structure**: Create `core` (users/auth) and `ledger` (transactions) apps.
- [x] **Database**: Setup PostgreSQL connection in `settings.py`.
- [x] **Auth API**: Implement Registration and Login (JWT or Session) with DRF.

### Frontend (React + Vite)
- [x] **Routing**: Install `react-router-dom` and setup routes (/, /login, /register, /app).
- [x] **UI Framework**: Setup TailwindCSS (if deciding to use it) or basic CSS variables for "Theme".
- [x] **Public Pages**: Implement `LandingPage`, `LoginPage`, `RegisterPage`.
- [ ] **Private App**: Implement `Dashboard` layout (Sidebar + Chat Area).

## 🔴 Pending / Future
- [ ] **Entity Models**: Define Contact, Group, Variable Expenses models.
- [ ] **Transaction Logic**: APIs for creating and listing transactions.
- [ ] **WebSockets**: Real-time updates for chat interface (Django Channels?).
- [ ] **Deployment Config**: Dockerfile and docker-compose.yml.
