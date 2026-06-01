# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server with HMR
npm run build      # type-check (tsc -b) then bundle
npm run lint       # eslint
npm run preview    # serve the production build locally
```

There is no test runner configured.

To add shadcn components: `npx shadcn add <component>`

## Architecture

**Stack**: React 19, TypeScript ~6, Vite 8, Tailwind CSS v4, shadcn/ui.

**Tailwind v4** is configured via the `@tailwindcss/vite` Vite plugin — there is no `tailwind.config.*` file. All theme tokens live in `src/index.css` under `@theme inline`. Design tokens use OKLCH color space with CSS custom properties.

**shadcn/ui** is configured in `components.json` (style: `base-sera`, base color: `taupe`). Components are added to `src/components/ui/` via the CLI and use `@base-ui/react` as the headless primitive layer.

**Path alias**: `@` resolves to `src/`. Use `@/components`, `@/lib/utils`, `@/hooks`, etc.

**Utility function**: `cn()` in `src/lib/utils.ts` merges Tailwind classes with `clsx` + `tailwind-merge`.

**Dark mode**: toggled by the `.dark` class on a parent element (via `next-themes`). Both `:root` and `.dark` variable sets are defined in `src/index.css`.

**Fonts**: `--font-sans` → Noto Sans Variable (body), `--font-heading` → Playfair Display Variable (headings). Use `font-sans` / `font-heading` Tailwind utilities.

**Charts**: Recharts is available for data visualization; chart color tokens `--chart-1` through `--chart-5` are defined in the theme.
