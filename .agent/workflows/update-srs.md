---
description: updates the SRS
---

# Workflow: Maintain Software Requirements Specification (SRS)

**Trigger:** When the user types `/update-srs` or provides new requirements (e.g., "Change the button color", "Add a user login feature").

**Action:**
1.  **Locate File:** Check for `docs/SRS.md`.
    * *If missing:* Create the `docs/` folder and generate the file using the structure below.
    * *If exists:* Read the current content of `docs/SRS.md`.
2.  **Analyze Updates:** Compare the **Existing SRS** against **Current User Instructions** and **Codebase State**.
3.  **Apply Smart Updates (The "Patch" Method):**
    * **New Requirement:** If the user mentions a new detail (e.g., "We need a search bar") that isn't in the SRS, find the appropriate section and **append** it.
    * **Modified Requirement:** If the user changes a specific detail (e.g., "Primary color: Blue" -> "Primary color: Orange"), locate the specific line in the SRS and **replace only the value**.
    * **Implicit Details:** If the codebase has specific versions/libraries not listed in the SRS, add them to the "Technical Stack" section.
    * **Preservation:** Do **NOT** delete existing requirements unless they are explicitly contradicted by new instructions.

---

## SRS Structure Schema

Ensure the content adheres to this schema. If updating, slot new information into these categories.

### 1. Introduction
* **Purpose:** The goal of the application.
* **Scope:** What the system will and will not do.

### 2. User Requirements (The "What")
* **User Personas:** Who is using the system?
* **User Stories:** High-level capabilities (e.g., "As a user, I want to login...").

### 3. Functional Requirements (The "How")
* **UI/UX Specifications:** Specific design choices (Colors, layouts, fonts). *Update this section immediately if user specifies design changes.*
* **Features:** Detailed list of system functions.
* **Data Inputs/Outputs:** Specific data constraints (e.g., "Phone number must be 10 digits").

### 4. Technical Constraints (Minor Details)
* **Technology Stack:** Language versions, specific library versions (scan `requirements.txt`/`package.json`).
* **File Structure:** A tree view of the current project organization.
* **System Limitations:** Any known constraints or hard limits.

---

**Instruction to Agent:**
* **Role:** You are a Documentation Maintainer.
* **Behavior:** Your output must be the **full updated content** of `docs/SRS.md`.
* **Merge Strategy:**
    * Keep existing text that is still valid.
    * Only rewrite sections that are affected by the new information.
    * *Example:* If the user says "Change database to PostgreSQL," only update the "Technology Stack" section. Leave the "User Stories" alone.