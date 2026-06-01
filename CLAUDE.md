# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project structure

This is a monorepo with two projects:

- `frontend/` — React SPA (Vite)
- `backend/` — ASP.NET Core minimal API (.NET 10)
- `dashboard.slnx` — .NET solution file

## Commands

### Frontend (run from `frontend/`)

```bash
npm run dev        # start dev server with HMR
npm run build      # type-check (tsc -b) then bundle
npm run lint       # eslint
npm run preview    # serve the production build locally
```

### Backend (run from `backend/`)

```bash
dotnet run         # start API (http://localhost:5032)
dotnet build       # build
dotnet watch       # hot reload
```

Backend runs on `http://localhost:5032` (HTTP) and `https://localhost:7089` (HTTPS).
OpenAPI spec is available at `/openapi/v1.json` in Development.

There is no test runner configured.

To add shadcn components: `npx shadcn add <component>` (from `frontend/`)

## Architecture

### Frontend

**Stack**: React 19, TypeScript ~6, Vite 8, Tailwind CSS v4, shadcn/ui.

**Tailwind v4** is configured via the `@tailwindcss/vite` Vite plugin — there is no `tailwind.config.*` file. All theme tokens live in `src/index.css` under `@theme inline`. Design tokens use OKLCH color space with CSS custom properties.

**shadcn/ui** is configured in `components.json` (style: `base-rhea`, base color: `zinc`). Components are added to `src/components/ui/` via the CLI and use `@base-ui/react` as the headless primitive layer.

**Path aliases**:
- `@` → `src/`
- `@custom` → `src/custom-components/`

Use `@/components`, `@/lib/utils`, `@/hooks`, `@custom/MyComponent`, etc.

**Utility function**: `cn()` in `src/lib/utils.ts` merges Tailwind classes with `clsx` + `tailwind-merge`.

**Dark mode**: toggled by the `.dark` class on a parent element (via `next-themes`). Both `:root` and `.dark` variable sets are defined in `src/index.css`.

**Fonts**: `--font-sans` → Inter Variable (body), `--font-heading` → Raleway Variable (headings). Use `font-sans` / `font-heading` Tailwind utilities.

**Charts**: Both Recharts and ECharts are available for data visualization.
- Recharts: chart color tokens `--chart-1` through `--chart-5` are defined in the theme.
- ECharts: use the `useEChart` hook (`src/hooks/useEChart.ts`).
- `useBarLineChart` hook (`src/hooks/useBarLineChart.ts`) provides a ready-made bar+line combo chart.
- `CustomChart` (`src/custom-components/CustomChart.tsx`) is the main reusable chart component.
- `CardGraph` (`src/custom-components/CardGraph.tsx`) wraps charts in a card layout.
- Chart configuration lives in `src/config/chartConfig.ts`.

**Data tables**: `@tanstack/react-table` with `@tanstack/match-sorter-utils` for filtering. The `DataTable` component lives in `src/custom-components/DataTable.tsx`.

**Other notable libraries**: `xlsx` for spreadsheet export, `date-fns` + `react-day-picker` for date handling, `sonner` for toasts, `embla-carousel-react` for carousels, `react-resizable-panels` for resizable layouts, `vaul` for drawers, `cmdk` for command palette.

### Backend

**Stack**: ASP.NET Core minimal API, .NET 10, `Microsoft.AspNetCore.OpenApi`.

Currently a scaffold — only the `/weatherforecast` demo endpoint is implemented.
