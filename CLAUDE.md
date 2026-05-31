# CLAUDE.md

Guidance for AI agents working in this repository. Read this first — it captures
what is **real vs. mocked**, which is not obvious from the code alone.

## What this is

**NLI-Thai** (internal codename "GeoMapper") — a bilingual (EN/TH) GIS dashboard
for analyzing the impact of major infrastructure investments in Thailand
(high-speed rail, the EEC, land bridges, an LRT command center, etc.).

It is a **front-end demo/prototype**. There is no backend database and no real
analytics engine yet. Most "data" is mock. The architecture is built so that
real data sources can be plugged in incrementally — see *Real-vs-Mock pattern*.

## Tech stack

- **Next.js 16** (App Router, Turbopack) · **React 19** · TypeScript
- **MapTiler SDK** for the map; `@mapbox/mapbox-gl-draw` for drawing; `@turf/turf` for measure/geometry
- **Genkit + Google AI (Gemini 2.0 Flash)** for the "Typhoon LLM" GIS assistant
- **Tailwind CSS + Radix UI + shadcn/ui** (`src/components/ui`)
- **pnpm** (v10) · Node ≥ 20.9
- **Deploy:** AWS Amplify (`amplify.yml`); `apphosting.yaml` also present (Firebase App Hosting). README still says "Vercel-optimized" — stale.

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Dev server on **port 9002** (Turbopack) |
| `pnpm build` | Production build |
| `pnpm typecheck` | `tsc --noEmit` — **run this before committing** |
| `pnpm genkit:dev` | Genkit AI dev server (`src/ai/dev.ts`) |

There is **no test runner and no linter** configured. `pnpm typecheck` is the
only automated gate.

## Architecture

Single-page app. **`src/app/page.tsx` is the hub** — it owns essentially all
application state (`useState`) and passes it down as props. There is no global
store, no context, no router beyond the single route.

```
page.tsx (all state lives here)
├─ nli-header            project switcher, compare/analyze toggles, theme, language
├─ (toolbar row)         import/settings/legend/table/params/notes/export buttons
├─ nli-map-toolbar       basemap switch + map tools (zoom, measure, draw, 3D…)
├─ nli-left-sidebar      data-layer toggles
├─ nli-map               ← the real workhorse (MapTiler)
├─ nli-right-sidebar     analysis / comparison charts (shown only when active)
└─ dialogs               ai-chat, share, new-project, compare, analyze
```

Conventions:
- App components are prefixed **`nli-`**; primitives live in `src/components/ui`.
- Path alias **`@/` → `src/`**.
- **Bilingual by convention:** each component defines a local `translations = { en, th }`
  object and receives a `language` prop threaded down from `page.tsx`. When adding
  user-facing text, add both `en` and `th` keys.
- **Theme** (`dark`/`light`) is persisted to `localStorage['nli-theme']`; the
  MapTiler basemap style swaps with the theme.
- Server code uses `'use server'` (`src/ai/flows/*`); UI uses `'use client'`.

## Real-vs-Mock pattern (important)

The app runs end-to-end **with an empty `.env`**. Each external service reads its
key from env; if the key is present it serves **real** data, otherwise it falls
back to **mock**. Feature detection lives in **`src/lib/config.ts`**
(`isLlmConfigured()`, `isMapConfigured()`). See **`.env.template`** for all vars.

| Subsystem | Env var | Real when key set | Mock fallback |
|---|---|---|---|
| LLM assistant | `GEMINI_API_KEY` | live Gemini via Genkit | canned responses in `getMockResponse()` |
| Map tiles/data | `NEXT_PUBLIC_MAPTILER_API_KEY` | your MapTiler account | shared demo key (hardcoded fallback) |

The LLM flow (`src/ai/flows/gis-assistant.ts`) tags every result with
`source: 'live' | 'mock'`; the chat UI shows a green **Live AI** / amber
**Demo Mode** badge accordingly. **Follow this same pattern for any new data
source** (try real → catch/empty → mock, and surface which one ran).

⚠️ The MapTiler fallback key (`lVz5lFRZJpi7sv6fXhdz`) and several dataset URLs in
`src/components/nli-map.tsx` are committed in source. Fine for the demo; rotate to
env-only before any public/production deployment.

## Current status — what's real vs. placeholder

**Working / real-ish:**
- The MapTiler map: pan/zoom, basemap switching, layer toggles, province
  click-to-select, measure & draw tools, 3D pitch. Layers (Province, Roads,
  Railways, Ports, Airports, Industrial Zones, SEZ) load from hosted MapTiler GeoJSON.
- The AI assistant end-to-end (live with a key, mock without).
- Bilingual UI, theme switching, resizable sidebars, fullscreen, share-link.

**Mock / placeholder:**
- All economic analytics in `src/lib/project-data.ts` are **`Math.random()`** —
  GDP, freight, jobs, ROI, etc. `pop_density` is randomized per-feature at load
  time in `nli-map.tsx`.
- The map defaults to **Khon Kaen** (`INITIAL_VIEW` in `nli-map.tsx`, zoom 11.5) —
  the LRT command center's home city. `regionData` is a hardcoded handful
  (Khon Kaen, Bangkok, Chiang Mai, Phuket, Chon Buri) used for click-to-fly.
- The **top toolbar buttons** (Import, Settings, Legend, Attribute Table,
  Parameters, Time-Series, User Notes, Export) are **decorative** — tooltips only,
  no onClick wiring.

**Not built at all** (despite appearing in product/vision docs): no database
(no PostGIS/Supabase), no CCTV/SCAMTIR demand pipeline, no 3D Right-of-Way /
expropriation engine, no citizen-complaint NLP, no Qdrant/pgvector RAG. The
unified geospatial schema for these is sketched in `.env.template` comments and
discussed but **not implemented**.

## Gotchas

- `tsconfig` is strict-ish but `nli-map.tsx` uses `any` in places (MapTiler/Draw
  typings). Keep new map code typed where practical.
- `genkit.ts` initializes `googleAI()` with no explicit key — it relies on env.
  The flow guards with `isLlmConfigured()` so it never calls the model keyless.
- `docs/blueprint.md` describes an older "GeoMapper" dark-teal design; the live
  theme is Civic Blue. Treat the blueprint as historical.
- Commits land directly on `main` (solo workflow); Amplify deploys from `main`.
