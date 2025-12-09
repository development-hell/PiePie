---
trigger: always_on
---

# Tailwind CSS v4: Dynamic Theming Standards

## 1. Philosophy: Variable-Based Switching
* **Concept:** Themes must be implemented by swapping CSS variable values, NOT by swapping utility classes.
* **Goal:** Keep HTML/JSX clean.
    * *Forbidden:* `className="bg-white dark:bg-gray-900"`
    * *Required:* `className="bg-surface"` (where `surface` updates automatically).

## 2. CSS Configuration (`src/index.css`)
You must use the `@variant` directive inside CSS to handle overrides. Structure the file exactly like this:

```css
@import "tailwindcss";

/* 1. Define Custom Variant for Class-Based Toggle */
@custom-variant dark (&:where(.dark, .dark *));

/* 2. Define Base Theme (Light Mode Defaults) */
/* These variables automatically become utilities like 'bg-primary' */
@theme {
  --color-primary: oklch(60% 0.2 250);
  --color-surface: oklch(98% 0 0);
  --color-text: oklch(20% 0 0);
}

/* 3. Dynamic Overrides */
/* Use @layer theme to ensure correct cascade order */
@layer theme {
  :root {
    /* When 'dark' variant is active, update the underlying variable */
    @variant dark {
      --color-primary: oklch(70% 0.15 250);
      --color-surface: oklch(25% 0 0);
      --color-text: oklch(95% 0 0);
    }
  }
}