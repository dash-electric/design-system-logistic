# @dash-electric/logistic-kit

The Dash Design System UI atoms, re-themed for **Dash Logistic**. Ships **raw
`.tsx` source** + a **self-contained token layer** — your bundler transpiles the
atoms, so they stay theme-able at build time.

- **51 atoms** (Button, Badge, Input, Card, Table, Banner, Alert, FileUpload,
  Pagination, Stat, StepIndicator, …) — identical API surface to the parent
  `@dash-electric/kit`.
- **Dash Logistic GSM baked in:** themed to the Logistic *Graphic Standard
  Manual* — editorial restraint, **Ink `#171717` / White / Neutral `#5C5C5C`**
  + four greys, **hairline rules** at 10% / 22% black (no shadows/glow), and
  **one accent: Dash Purple `#5E2AAC`** used like punctuation (logo, eyebrow
  numerals, live dots, selection) — never as a fill on text blocks or
  backgrounds. Status color is treated as operational data, not brand.
- **Type:** Plus Jakarta Sans (200–800) + JetBrains Mono (400–600), OpenType
  `ss01/cv11/cv02`, tabular numerals on figures.
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
`@import "tailwindcss"`, the full GSM foundation (ink/white/neutral/greys,
hairline rules, type scale), the single Dash Purple accent, and the Tailwind v4
`@theme` mapping that powers utilities like `bg-bg-white-0`,
`text-text-strong-950`, `bg-primary`, `bg-accent`, `border-rule`, and `bg-tint`:

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
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
```

## Use

```tsx
import { Button, Badge, Stat } from "@dash-electric/logistic-kit"

export function Toolbar() {
  return (
    <div className="flex items-center gap-2">
      <Button>Assign batch</Button>
      <Badge status="information">In transit</Badge>
    </div>
  )
}
```

## Theming notes

- **Accent** = **Primary** = **Dash Purple** (`bg-accent` / `bg-primary`,
  `text-accent`, `border-accent`). The GSM mandates a single chromatic color.
  Reserve it for *brand moments* — logo, eyebrow numerals, live-state dots,
  selection, do-markers. **Never** wash a surface, text block, or button in it.
- **Ink / White / Neutral** carry the page: `text-text-strong-950` (Ink
  `#171717`), `bg-bg-white-0` (White), `text-text-sub-600` (Neutral `#5C5C5C`).
- **Rules & tints:** `border-rule` (10% black hairline), `border-rule-strong`
  (22%), `bg-tint` (4%), `bg-tint-strong` (7% hover). Prefer a hairline over a
  shadow — elevation is hairline-forward, no glow.
- **Status color is operational data, not brand:** the semantic state tokens
  (`success`, `warning`, `error`, `information`, `feature`, `stable`,
  `verified`, `away`, `faded`) carry meaning and are exempt from the
  one-accent rule.
- **Corners are sharp (2px).** `gsm.html` only ever uses a 2px radius (and
  `50%` for dots), so the whole Tailwind radius scale is collapsed: every
  `rounded-sm/md/lg/xl/2xl` resolves to **2px**. `rounded-full` is preserved
  for dots, pills, avatars, and spinners. This is the GSM newspaper square —
  don't reach for large radii.
- **Elevation is a hairline ring, not a shadow.** `gsm.html`'s only elevation
  primitive is `inset 0 0 0 1px var(--rule)`. Inline surfaces (cards, stroke
  buttons, inputs) reproduce that flat ring; only floating overlays (modal,
  popover, toast, tooltip) add the gentlest outer lift for legibility.

## Relationship to `@dash-electric/kit`

This package is a **re-themed sibling**, not a fork of the component logic. The
atom source is copied verbatim from the parent kit; only the token layer
(`src/styles/tokens.css`) diverges — it encodes the Dash Logistic Graphic
Standard Manual. Keep component changes upstream in the parent Design System and
re-sync here.
