---
description: Readme updator that updates the readme based on the changes
---

# Workflow: Update GitHub README

**Trigger:** When the user types `/update-readme` or asks to "refresh the readme."

**Action:**
1.  **Analyze Project State:**
    * **Dependencies:** Check `pyproject.toml` (for Python/uv) or `package.json` (for Node) to identify the tech stack.
    * **Features:** Scan the `src/features/` (or equivalent) directory to list current capabilities.
    * **Commands:** Identify available scripts (e.g., `uv run`, `npm run dev`).
2.  **Read Existing:** Read the current `README.md` (if it exists) to preserve manual intros or diagrams.
3.  **Generate/Merge Content:** Update the sections below.

---

## README Structure Guidelines

### 1. Header
* **Title:** Project Name (H1).
* **Badges:** Add shields.io badges for the Tech Stack (e.g., React, Tailwind, Python, uv).
* **Description:** A concise 2-3 sentence summary of what the project solves.

### 2. Tech Stack (Auto-Detected)
* **Core:** List major frameworks (e.g., "React 19", "Tailwind CSS v4", "FastAPI").
* **Tooling:** Mention build tools (e.g., "Vite", "uv", "Vitest").

### 3. Getting Started
* **Prerequisites:** List what needs to be installed (e.g., "Python 3.12+", "Node.js 20+").
* **Installation:**
    * *If Python:* Show `uv sync`.
    * *If Node:* Show `npm install`.
* **Running the App:**
    * *If Python:* Show `uv run main.py`.
    * *If Node:* Show `npm run dev`.

### 4. Project Architecture
* Generate a **directory tree** of the `src/` folder.
* Briefly explain the **Feature-Based** structure (e.g., "Code is organized by feature in `src/features/`").

### 5. Features (Dynamic)
* Create a bulleted list of features found in the codebase.
* *Example:* "✅ **Auth:** JWT-based login with Google OAuth."

### 6. Development Standards
* **Commits:** Mention "Conventional Commits" are required.
* **Styling:** Mention "Tailwind v4 with CSS Variables" (if applicable).
* **Testing:** Mention "Vitest" or "pytest" and how to run them.

---

**Instruction to Agent:**
* **Tone:** Professional, developer-focused.
* **Accuracy:** Do NOT copy-paste generic instructions. If the project uses `uv`, strictly command the user to use `uv`, not `pip`.
* **Visuals:** Use code blocks for all terminal commands.