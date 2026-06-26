# Dash Logistic Design System

The Dash Design System UI atoms, **re-themed for Dash Logistic** — packaged as an
installable npm library plus a live component gallery.

- **`packages/logistic-kit`** — [`@dash-electric/logistic-kit`](./packages/logistic-kit/README.md).
  51 atoms (raw `.tsx`) + a self-contained token layer. Dash Purple `#5E2AAC`
  stays the primary (family identity); a **delivery-orange `#EA580C`** accent is
  exposed for queue badges, batch progress, and package-state pills.
- **`apps/docs`** — a Vite + React **component gallery** to browse every atom
  with live demos, search, and light/dark toggle.

```
dash-logistic-design-system/
├── packages/
│   └── logistic-kit/        # the publishable library
│       └── src/
│           ├── *.tsx        # 51 atoms (flat)
│           ├── lib/utils.tsx
│           ├── styles/tokens.css   # the theme: Layer-0 + logistic accent + @theme
│           └── index.tsx    # barrel
└── apps/
    └── docs/                # Vite gallery → "page to check all component documents"
```

## Develop

```bash
npm install          # installs both workspaces
npm run dev          # boots the gallery at http://localhost:4321
```

Other scripts (from the repo root):

| Command | What it does |
| --- | --- |
| `npm run dev` | Boot the component gallery (apps/docs) |
| `npm run build` | Production build of the gallery |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | TypeScript check across both workspaces |

## Theme

The whole theme lives in one file:
[`packages/logistic-kit/src/styles/tokens.css`](./packages/logistic-kit/src/styles/tokens.css).
It contains `@import "tailwindcss"`, the full Layer-0 foundation (neutral ramps,
type scale, radius, spacing, shadow, motion, semantic surfaces, light + dark),
the **logistic delivery-orange accent overlay**, and the Tailwind v4 `@theme`
mapping that turns tokens into utilities (`bg-bg-white-0`, `text-text-strong-950`,
`bg-primary`, `bg-accent`, …).

## Relationship to the parent Design System

This repo is a **re-themed sibling** of `dash-design-system`. Atom source is
copied verbatim from `@dash-electric/kit`; only the token layer diverges. Keep
component logic changes upstream in the parent and re-sync here so the two
don't drift.
