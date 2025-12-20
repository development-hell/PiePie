---
description: Commits the latest changes along with logging
---

# Workflow: Smart Git Commit & Changelog

**Trigger:** When the user types `/commit` or asks to "save changes."

**Action:**
1.  **Analyze Diff:** Run `git diff` (and `git status` for untracked files) to detect all code changes.
2.  **Target File:** Locate `Docs/Changes.md`.
    * *If missing:* Create it with the single line: `# Changelog` followed by a blank line.
3.  **Update Changelog (Strict Insertion):**
    * **Read:** Read the full content of `Docs/Changes.md`.
    * **Construct Entry:** Create the new entry string following this format:
        ```markdown
        ## [YYYY-MM-DD HH:MM] <Commit Title>
        **Summary:** <Extended description of the change>
        **Files Changed:**
        * `path/to/file`: <Specific detail on what changed>
        
        ```
    * **Insert:** Find the exact line containing `# Changelog`. **Insert** the new entry block *immediately below* that line (and its spacing).
    * **Preserve:** Write the modified content back to the file. **WARNING:** You are strictly forbidden from deleting, truncating, or overwriting any existing text below the new entry.
4.  **Generate Commit Message:**
    * Draft a **Conventional Commit** message based on the changes (e.g., `feat(auth): add google login`).
    * The commit `subject` line MUST match the `<Commit Title>` used in the Changelog.
    * The commit `body` must match the `**Summary**`.
5.  **Execute:**
    * Stage the changes: `git add .`
    * Commit: `git commit -m "..."`

---

**Instruction to Agent:**
* **File Path:** The changelog must always be at `Docs/Changes.md`.
* **Insertion Logic:** Do NOT append to the bottom of the file. The newest changes must appear at the **TOP** of the list, directly under the `# Changelog` title.
* **Safety:** Treat the existing content of `Docs/Changes.md` as read-only history. Your only operation is "Insert at line 2".