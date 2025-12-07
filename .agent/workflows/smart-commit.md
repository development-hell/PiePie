---
description: Commits the latest changes along with logging
---

# Workflow: Smart Git Commit & Changelog

**Trigger:** When the user types `/commit` or asks to "save changes" or "push updates."

**Action:**
1.  **Analyze Diff:** Run `git diff` (and `git status` for untracked files) to understand exactly what has changed in the codebase.
2.  **Update Changelog:**
    * **Target:** Check for `Docs/Changes.md`. Create the folder/file if they don't exist.
    * **Content:** Append a new entry to the top (or bottom, depending on preference - typically top is better for chronological reading) of the file.
    * **Format:**
        ```markdown
        ## [YYYY-MM-DD HH:MM] <Commit Title>
        **Summary:** <Extended description of the change>
        **Files Changed:**
        * `path/to/file`: <Specific detail on what changed inside this file>
        ```
3.  **Generate Commit Message:**
    * Draft a **Conventional Commit** message based on the analysis (e.g., `feat(user): add login logic`).
    * Ensure the body contains the "Extended Description" as per project rules.
4.  **Execute:**
    * Stage the `Docs/Changes.md` file along with the code changes.
    * Run the git commit command.

---

**Instruction to Agent:**
* **Step 1 (Log):** You MUST write to `Docs/Changes.md` *before* committing.
* **Step 2 (Commit):** The commit message used in git must match the title used in `Changes.md`.
* **Detail Level:** In `Changes.md`, do not just list file names. Explain *what logic* changed in that file (e.g., "Updated `utils.py`: Refactored date parser to use ISO format").