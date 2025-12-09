---
trigger: always_on
---

# React, Vite & Tailwind Development Standards

## 1. Modular Directory Structure (Feature-First)
* **Organization:** Group files by **Feature**, not file type.
    * **`src/features/<FeatureName>/`**: Contains all components, hooks, api services, and types specific to that feature (e.g., `src/features/Auth/`).
    * **`src/components/`**: Strictly for **Global, Dumb UI** components (Buttons, Inputs, Cards, Skeletons).
    * **`src/layouts/`**: For page wrappers (Sidebar, Navbar, Footer).
* **Barrels:** Each feature folder should have an `index.ts` that exports *only* public parts.

## 2. Component Best Practices
* **Syntax:** Use Functional Components with TypeScript interfaces.
* **Naming:** PascalCase for files (`UserProfile.tsx`), camelCase for hooks (`useAuth.ts`).
* **Logic Separation:** Extract complex logic (>100 lines) into custom hooks.
* **Imports:** Use Absolute Imports (`@/components/Button`) configured in `vite.config.ts`.

## 3. Styling with Tailwind CSS (v4 Standards)
* **Documentation Authority:** **ALWAYS** refer to the **Tailwind CSS v4** documentation.
* **Configuration:**
    * **Forbidden:** Do NOT create `tailwind.config.ts` or `tailwind.config.js`.
    * **Mechanism:** Define all theme variables in `src/index.css` using `@theme`.
* **Custom Utilities:** Define custom utilities in `src/index.css` using the `@utility` directive.
* **Class Management:** Use `clsx` and `tailwind-merge` (via a `cn()` helper). STRICTLY avoid `@apply` in component files.

## 4. Testing (Vitest)
* **Co-location:** Test files (`.test.tsx`) must live next to the source file.
* **Tools:** Use `Vitest` and `@testing-library/react`.
* **Focus:** Test user interactions, not implementation details.

## 5. Performance (Vite)
* **Lazy Loading:** Use `React.lazy` for all top-level routes.
* **Env Variables:** Access via `import.meta.env`.

## 6. UX Patterns (Loading & Skeletons)
* **Skeleton First:** strictly avoid full-screen spinners or blocking loaders for initial page loads.
    * Use **Skeleton Loaders** that mimic the final layout (shape and size) of the content being fetched.
    * This reduces layout shift (CLS) and improves perceived performance.
* **Implementation:**
    * Create a global primitive: `src/components/Skeleton.tsx`.
    * **Style:** Use Tailwind's `animate-pulse` utility (e.g., `bg-muted/50 animate-pulse rounded`).
* **Usage:**
    * *Bad:* `{isLoading ? <Spinner /> : <Card />}`
    * *Good:* `{isLoading ? <CardSkeleton /> : <Card />}`
    * If a feature has a complex layout, define a specific skeleton component inside that feature folder (e.g., `features/Dashboard/components/DashboardSkeleton.tsx`).