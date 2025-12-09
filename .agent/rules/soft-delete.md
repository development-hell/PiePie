---
trigger: always_on
---

# Data Safety & Soft Delete Policy

## 1. Deletion Strategy (Soft Delete Only)
* **Prohibition:** Never use permanent deletion methods (e.g., SQL `DELETE`, ORM `.delete()`, or `os.remove()`) for business data.
* **Mechanism:**
    * **Schema:** All data models/tables must have a status field (e.g., `is_deleted: bool` or `deleted_at: datetime`).
    * **Action:** When a "delete" action is requested, update this field instead of removing the record (e.g., set `is_deleted = True` or `deleted_at = fn.now()`).

## 2. Query Filtering
* **Default Behavior:** All standard "get" or "list" queries must automatically filter out records where the deleted flag is set.
* **Admin Access:** Only explicit "admin" or "audit" queries are allowed to retrieve soft-deleted records.

## 3. Naming Convention
* **Functions:** Name functions accurately to reflect this behavior (e.g., `archive_user()` or `soft_delete_item()`) rather than `destroy_` or `remove_` to avoid ambiguity.