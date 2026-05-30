# BDI

> **Status: Beta** 🚧

BDI — a Next.js 16 application built with Firebase, Genkit AI, and MapTiler mapping.

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
- **Backend:** Firebase
- **Package Manager:** pnpm
- **Deployment:** Vercel-optimized

## Getting Started

```bash
# Install pnpm (if not already installed)
npm install -g pnpm

# Install dependencies
pnpm install

# Copy environment file and fill in your keys
cp .env.example .env

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
