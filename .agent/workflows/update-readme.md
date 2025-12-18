---
description: Readme updator that updates the readme based on the changes
---

# Workflow: Update Project Documentation (READMEs)

**Trigger:** When the user types `/update-readme` or asks to "refresh the readme."

**Action:**
1.  **Analyze Root:** Scan the root directory to understand the high-level project structure (e.g., Monorepo vs. Single App).
2.  **Update Root README:** Generate/Update `./README.md` to serve as the "Entry Point" for the whole project.
3.  **Iterate Sub-directories:**
    * Check for major sub-folders: `frontend/`, `backend/`, or `services/`.
    * **Action:** If found, generate a specific `README.md` inside that folder (e.g., `backend/README.md`).
4.  **Context Scoping:**
    * When writing `frontend/README.md`, ignore Python/Database tools. Focus on React/Vite/Tailwind.
    * When writing `backend/README.md`, ignore UI tools. Focus on API endpoints/Auth/Models.

---

## README Structure Guidelines

### 1. Header & Badges
* **Title:** Project/Module Name.
* **Badges:** Relevant tech only (e.g., React badge for Frontend, Python badge for Backend).

### 2. Getting Started (Context Aware)
* **Root README:** High-level orchestration (e.g., "How to start both servers").
* **Frontend README:** Specifics: `npm install`, `npm run dev`.
* **Backend README:** Specifics: `uv sync`, `uv run main.py`.

### 3. Tech Stack
* **Auto-Detect:** List libraries found in `package.json` (for frontend) or `pyproject.toml` (for backend).

### 4. Architecture & Features
* **Directory Tree:** Show the tree *relative* to that readme's location.
* **Key Features:** List capabilities specific to that module.

---

**Instruction to Agent:**
* **Do NOT duplicate content unnecessarily.** The Root README should link to the sub-readmes for deep details.
* **Cross-Linking:** In the Root README, clearly link to the sub-modules:
    * "[Frontend Documentation](./frontend/README.md)"
    * "[Backend Documentation](./backend/README.md)"
* **Validation:** Ensure the commands listed actually work for that specific folder (e.g., don't tell the user to run `npm install` inside the python backend folder).