---
trigger: always_on
---

# Project Standards & Development Rules

## 1. Git Commit Strategy
* **Format:** Strictly follow [Conventional Commits](https://www.conventionalcommits.org/).
    * **Header:** `type(scope): subject` (e.g., `feat(auth): add google oauth login`).
    * **Body:** **ALWAYS** include an extended description explaining *why* the change was made, not just *what* changed.
    * **Footer:** Reference issues if applicable (e.g., `Closes #123`).
* **Types:** Use standard types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

## 2. Python Environment & Tooling (Astral 'uv')
* **Manager:** Do NOT use `pip` or `python -m venv` directly. Use **`uv`** for all package and project management.
* **Commands:**
    * To run scripts: `uv run main.py`
    * To install/update dependencies: `uv sync` or `uv add <package>`
* **Configuration:** Ensure `pyproject.toml` is the source of truth for dependencies.

## 3. Code Quality & Typing
* **Type Annotations:** All Python function signatures (arguments and return values) and class attributes must use strict type hints (e.g., `def process_data(items: list[str]) -> dict[str, int]:`).
* **Documentation:**
    * **Docstrings:** Every module, class, and public function must have a docstring.
    * **Inline Comments:** Add comments to explain *complex logic* or *business rules*. Do not comment on obvious syntax (e.g., avoid `# increment i` above `i += 1`).