# Craftly

**See what else it could be.**

Craftly is an imaginative upcycling and invention studio that transforms ordinary, unused, damaged, or overlooked household objects into unconventional, realistically buildable creations. Users can describe an object, upload a photo, or draw a quick sketch—Craftly analyzes the object's materials and reusable mechanics, then synthesizes three distinct invention concepts across **Practical**, **Unexpected**, and **Experimental** directions.

The application works immediately upon first load with zero required accounts, onboarding walls, or client-side API key configuration. When server-side Gemini AI is configured, Craftly enhances object analysis, concept synthesis, blueprint refinement, and studio photo previews; when offline or unconfigured, it falls back seamlessly to a deterministic local synthesis engine.

---

## Features

- **Three Input Modes**
  - **Describe (`Text`)**: Enter any object name or material description, or pick from curated studio examples.
  - **Upload Photo (`Photo`)**: Upload or drag-and-drop an image for visual and structural analysis.
  - **Sketch (`Sketch`)**: Draw on an HTML5 Pointer Events canvas with responsive `devicePixelRatio` scaling, stroke undo, clear, and PNG export.
- **Goal Presets & Workshop Constraints**: Focus inventions toward specific outcomes (e.g., workspace organization, plant care, lighting, zero-cost salvage) and filter by available tools or time.
- **Three-Direction Invention Synthesis**: Generates one **Practical**, one **Unexpected**, and one **Experimental** concept per session, complete with difficulty ratings, build times, materials reused, additional parts, and required tools.
- **Discovery & Refinement**:
  - **"What else?"** generates fresh, deduplicated concepts for the same object without repeating earlier titles.
  - **Single-Card Refinements** adapt an individual concept to be *More Practical*, *More Creative*, or *Cheaper*.
- **Interactive Blueprint Studio**:
  - **Crafted 3D Output Reference**: Custom HTML5 Canvas 3D perspective turntable renderer (`Crafted3DViewer`) with drag-to-orbit, zoom/reset controls, interactive numbered callouts, and an optional **Studio Photo View** toggle.
  - **Illustrated Step-by-Step Guide**: Action-coded SVG diagrams (`measure`, `cut`, `puncture`, `fold`, `thread`, `join`, `mount`, `finish`, `test`), maker tips, and persistent step completion checkboxes.
- **Multi-Currency Cost Estimates**: Live conversion across `PHP`, `USD`, `EUR`, `GBP`, and `JPY`, persisted in `localStorage` (`craftly-currency`).
- **My Workshop**: Versioned `localStorage` persistence (`craftly-creations-v1`) supporting search, invention category filtering (`All Categories`, `Practical`, `Unexpected`, `Experimental`), favorites filtering, and build progress tracking.
- **Responsive Design**: Adapts cleanly across mobile (`320px+`), tablet, and desktop viewports.

---

## Tech Stack

- **Frontend**: React 19, TypeScript (strict mode), Tailwind CSS v4, Framer Motion, Lucide React
- **Backend / Dev Server**: Node.js, Express, Vite (mounted via `vite.middlewares` in development; serves `dist/` in production)
- **AI Integration**: `@google/genai` (server-side proxy routes only)

---

## Getting Started

### Prerequisites

- Node.js 20+ and npm (or Bun)

### Installation

```bash
npm install
```

### Environment Configuration

Copy `.env.example` to `.env` if you want to enable server-side Gemini AI synthesis and studio image rendering:

```bash
cp .env.example .env
```

Available environment variables (`.env.example`):

| Variable | Description | Required |
| --- | --- | --- |
| `GEMINI_API_KEY` | Server-side API key for `@google/genai` requests. Leave unset to run purely on the local synthesis engine. | Optional |
| `APP_URL` | Hosted application URL injected by the runtime environment. | Optional |
| `PORT` | Server port (defaults to `3000`). | Optional |

### Running Locally

Start the Express + Vite development server on port `3000`:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the development server (`tsx server.ts`) on port `3000`. |
| `npm run start` | Runs the server (`tsx server.ts`). |
| `npm run build` | Builds the production frontend bundle into `dist/` (`vite build`). |
| `npm run preview` | Previews the built Vite bundle locally. |
| `npm run lint` | Runs strict TypeScript type-checking (`tsc --noEmit`). |
| `npm run clean` | Removes `dist/` and `server.js`. |

---

## Architecture & Offline-First AI

All `@google/genai` SDK calls live exclusively on the server in `server.ts` so API keys are never exposed to client code:

- `POST /api/inventions/synthesize` — Analyzes text, photo, or sketch inputs and returns structured object analysis plus three invention concepts (`gemini-2.5-flash` with fallback to `gemini-4-hydrogen`).
- `POST /api/inventions/refine` — Refines an existing invention concept toward `practical`, `creative`, or `cheaper` constraints.
- `POST /api/inventions/render-photo` — Generates a warm daylight studio preview image (`gemini-3.1-flash-lite-image`) when Studio Photo View is requested.

If `GEMINI_API_KEY` is missing, a request times out (`14000ms`), or an upstream error occurs, the endpoints return `{ fallback: true }` and `src/services/inventionService.ts` delegates seamlessly to `src/utils/localSynthesisEngine.ts`.

---

## Project Structure

```text
├── .env.example
├── index.html
├── metadata.json
├── package.json
├── server.ts                        # Express server, Vite middleware, and /api/inventions/* routes
├── tsconfig.json                    # Strict TypeScript configuration
├── vite.config.ts
└── src/
    ├── App.tsx                      # Root application state and Discover / My Workshop views
    ├── index.css                    # Tailwind CSS v4 setup and design tokens
    ├── main.tsx
    ├── components/
    │   ├── BlueprintView.tsx        # Detailed blueprint view with 3D viewer, materials, and steps
    │   ├── Crafted3DViewer.tsx      # Interactive HTML5 Canvas 3D turntable and Studio Photo toggle
    │   ├── CraftlyLogo.tsx          # Custom handcrafted SVG wordmark
    │   ├── CurrencySelector.tsx     # PHP / USD / EUR / GBP / JPY switcher
    │   ├── Header.tsx               # Navigation header and How It Works trigger
    │   ├── HowItWorksModal.tsx      # 4-step studio overview modal
    │   ├── InputWorkspace.tsx       # Object text/photo/sketch input, goal presets, and constraints
    │   ├── InventionResults.tsx     # Three-direction concept cards, "What else?", and refinements
    │   ├── SketchCanvas.tsx         # Pointer Events drawing pad with undo/clear/export
    │   ├── StepIllustration.tsx     # Vector technical diagrams per build action type
    │   ├── Toast.tsx                # Dismissible workshop feedback notifications
    │   ├── WorkshopBackground.tsx   # Subtle studio canvas textures
    │   └── WorkshopView.tsx         # Saved creations library with search, category, and favorite filters
    ├── config/
    │   ├── ai.ts                    # Server/client AI model constants and timeout config
    │   └── currency.ts              # Currency conversion rates and formatting helpers
    ├── services/
    │   └── inventionService.ts      # Client orchestrator with automatic local fallback
    ├── types/
    │   └── invention.ts             # Shared TypeScript domain interfaces
    └── utils/
        ├── localSynthesisEngine.ts  # Deterministic offline object analyzer and invention generator
        └── storage.ts               # Versioned localStorage persistence for saved creations
```
