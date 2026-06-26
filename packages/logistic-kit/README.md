# @dash-electric/logistic-kit

The Dash Design System UI atoms, re-themed for **Dash Logistic**. Ships **raw
`.tsx` source** + a **self-contained token layer** — your bundler transpiles the
atoms, so they stay theme-able at build time.

- **51 atoms** (Button, Badge, Input, Card, Table, Banner, Alert, FileUpload,
  Pagination, Stat, StepIndicator, …) — identical API surface to the parent
  `@dash-electric/kit`.
- **Logistic theme baked in:** Dash Purple `#5e2aac` stays the primary
  (family identity); a **delivery-orange `#ea580c`** accent is exposed for
  queue badges, batch progress, "needs action" pulses, and package-state pills.
- **Light + dark** via a `.dark` class on any ancestor.

## Install

```bash
pnpm add @dash-electric/logistic-kit react react-dom @remixicon/react
```

(`class-variance-authority`, `clsx`, `tailwind-merge`, `@radix-ui/react-slot`,
and the `@tiptap/*` packages used by `RichEditor` are pulled in automatically.)

## Setup (3 steps)

**1. Transpile the package** — atoms are raw `.tsx`. In Next.js:

```js
// next.config.js
module.exports = { transpilePackages: ["@dash-electric/logistic-kit"] }
```

Vite transpiles `.tsx` from dependencies out of the box.

**2. Import the token layer once at the app root.** It contains
`@import "tailwindcss"`, the full Layer-0 foundation, the logistic accent
overlay, and the Tailwind v4 `@theme` mapping that powers utilities like
`bg-bg-white-0`, `text-text-strong-950`, `bg-primary`, and `bg-accent`:

```ts
import "@dash-electric/logistic-kit/styles"
```

Make sure your app scans the package for class names. With the Tailwind v4
Vite/PostCSS plugin, add a source glob in your CSS:

```css
@source "../node_modules/@dash-electric/logistic-kit/src";
```

**3. Load the fonts** (the one permitted external resource) in your `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

## Use

```tsx
import { Button, Badge, Stat } from "@dash-electric/logistic-kit"

export function Toolbar() {
  return (
    <div className="flex items-center gap-2">
      <Button>Assign batch</Button>
      <Badge variant="light" color="orange">In transit</Badge>
    </div>
  )
}
```

## Theming notes

- **Primary** (`bg-primary`, `text-primary`, …) → Dash Purple. Use for the one
  primary action per region.
- **Accent** (`bg-accent`, `text-accent-700`, `border-accent`, …) → delivery
  orange. Use as punctuation for logistics state — never a full orange screen.
  Body text on accent surfaces uses `accent-700` minimum (AA).
- Semantic state tokens (`success`, `warning`, `error`, `information`,
  `feature`, `stable`, `verified`, `away`, `faded`) are unchanged from Layer 0.

## Relationship to `@dash-electric/kit`

This package is a **re-themed sibling**, not a fork of the component logic. The
atom source is copied verbatim from the parent kit; only the token layer
diverges (logistic accent overlay). Keep component changes upstream in the
parent Design System and re-sync here.
