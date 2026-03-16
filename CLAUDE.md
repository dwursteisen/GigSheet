# GigSheet

Concert setlist & technical documentation app. Manages setlists, stage plots, sound patches, monitor mixes, lighting fixtures/cues, and generates printable export sheets.

## Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Type-check (tsc -b) then production build
npm run lint      # ESLint
npm run preview   # Preview production build locally
```

## Architecture

React 19 + TypeScript, Tailwind CSS v4, Vite. No router — single-page with tab navigation.

### State management

Context + `useReducer` pattern in `src/store/`:
- `context.ts` — React context provider
- `reducer.ts` — state reducer
- `actions.ts` — action creators (dispatched from components)
- `selectors.ts` — derived state helpers

### Domain model

`src/types.ts` defines the full data model. Root type is `GigSheetProject` containing: event details, schedule, musicians, setlist (songs/pauses/set headers), sound patches, song-track matrix, monitor returns, lighting fixtures, and per-song lighting cues.

### UI structure

Five tabs (`TabId`): Infos, Setlist, Son (sound), Lumière (lighting), Export.

- `src/components/tabs/` — one component per tab
- `src/components/shared/` — reusable components (StagePlot, LightingPlot, Modal, RGBSliders)
- `src/components/export/` — printable document layouts (Rundown, SoundSheet, LightingSheet)

### Storage

Projects are persisted to `localStorage` via `src/hooks/useProjectStorage.ts` with auto-save (`useAutoSave.ts`).

## Path alias

`@/` resolves to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

## Deployment

GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`). Pushes to `main` trigger build + deploy. Base path is `/GigSheet/` in CI.
