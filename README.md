# BDI

> **Status: Beta** 🚧

BDI — a bilingual (EN/TH) GIS dashboard for the **Khon Kaen LRT** command center,
built with Next.js 16, Genkit AI, and MapTiler mapping. It helps planners evaluate
proposed light-rail networks, their environmental/right-of-way impact, and approval
progress on a single interactive map.

## Features

- 🗺️ **Khon Kaen-centered map** (MapTiler) — pan/zoom, basemap + theme switching,
  measure & draw tools, province click-to-select, 3D pitch.
- 🚈 **LRT Line Plan overlay** — 10 proposed network configurations
  (`docs/lrt_plans.json`) rendered as routes + stations, selectable from the sidebar.
- ⚠️ **EIA & Right-of-Way box** _(mock)_ — corridor width, buildings to demolish,
  estimated compensation, EIA risk score, and community-friction complaint counts,
  reactive to the selected plan.
- ✅ **Project Tracking box** _(mock)_ — an 8-step approval timeline (survey → line
  plan confirmed → EIA → public hearing → budget → construction) with progress.
- 🤖 **AI assistant ("Typhoon LLM")** — live Google Gemini when `GEMINI_API_KEY`
  is set, graceful mock responses otherwise (Live AI / Demo Mode badge).

> **Real-vs-mock:** the app runs end-to-end with an empty `.env`. Most analytics
> are placeholder/mock; see [`CLAUDE.md`](CLAUDE.md) for exactly what's real vs.
> mocked, and [`.env.template`](.env.template) to plug in real data sources.

## Original Producers

This project was originally created by **NLI Thailand**:

| Name | |
|------|---|
| **Panitan Kwankaew** | ปณิธาน ขวัญแก้ว |
| **ภคว จำเริญ** | Pakawa Chamroen |
| **Pataradanai Akkharat** | ภัทรดนัย อัคฮาด |

## Tech Stack

- **Framework:** Next.js 16 (Turbopack)
- **Runtime:** React 19
- **AI:** Genkit with Google AI
- **Maps:** MapTiler SDK / Mapbox GL Draw
- **UI:** Radix UI + Tailwind CSS + shadcn/ui
- **Package Manager:** pnpm
- **Deployment:** AWS Amplify (`amplify.yml`)

## Getting Started

```bash
# Install pnpm (if not already installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Copy environment file and fill in your keys (all keys optional — blanks fall back to mock data)
cp .env.template .env.local

# Run the development server
pnpm dev
```

The app will be available at [http://localhost:9002](http://localhost:9002).

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server with Turbopack |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm typecheck` | Run TypeScript type checking |
| `pnpm genkit:dev` | Start Genkit AI dev server |

## License

This project is open source and available under the [MIT License](LICENSE).

---

*Made with ❤️ by the NLI Thailand team*
