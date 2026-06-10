# 🌱 TerraTrace — Built by Akhil

> PromptWars Virtual | Challenge 3 | Hack2Skill × Google for Developers

## Your chosen vertical
Carbon Footprint Tracking & Reduction (Challenge 3 — PromptWars Virtual)

## Tech Stack
React 19 · Vite 8 · TypeScript 5 · Tailwind CSS v4 · Firebase Auth & Firestore · @google/genai · Recharts · React Router v7

## Approach and logic
TerraTrace is a cloud-synced, multi-user React application with Firebase authentication and Firestore persistence. Users log daily activities across four categories (Transport, Food, Energy, Shopping). An emission calculation engine translates activities into kg CO₂e using IPCC AR6-aligned coefficients. The Dashboard visualises a 7-day trend and benchmarks the user against the global average. Gemini 2.5 Flash analyses the user's actual data and returns 3 context-specific, actionable tips — guaranteed by schema configuration using the @google/genai SDK's `generateContent` with structured JSON schema parameters. Eco Challenges nudge behaviour change with Firestore-persisted completion tracking.

## How the solution works
1. User authenticates via Email/Password, Google, Apple, Facebook, or Phone OTP
2. User logs an activity → emission engine calculates kg CO₂e → saved to Firestore
3. Dashboard charts 7-day trend, scores user vs global average (4 t/year ≈ 11 kg/day)
4. Insights page sends a 7-day summary to Gemini 2.5 Flash → receives 3 JSON tips
5. Tips are cached for 24 hours — Gemini only called when data changes or cache expires
6. Challenges page tracks user progress with completion state in Firestore

## AI Integration
- SDK: `@google/genai` 2.8.0 (official GA SDK — replaces deprecated `@google/generative-ai`)
- Model: `gemini-2.5-flash` via Google AI Studio API key
- Usage pattern: structured JSON schema verification (`responseSchema` and `responseMimeType: 'application/json'` configuration on `generateContent`)
- Security: API key via env only · input sanitisation · prompt injection guard in system prompt · schema validation
- Caching: 24-hour localStorage cache keyed on summary hash — avoids unnecessary API calls
- Error handling: graceful fallback for missing API key, rate limiting, and parse failures

## Efficiency & Performance
- **Code Splitting:** React `lazy()` and `Suspense` are used to route-split large chunks (Dashboard, Charts, and API pages) reducing initial bundle sizes by nearly 50% and fully eliminating bundle chunk warnings.
- **Rollup Code Partitioning:** External heavy libraries (`recharts`, `firebase`) are strictly split at build time in Vite to enable concurrent client-side caching.

## Security Measures
- API key: `import.meta.env.VITE_GEMINI_API_KEY` only — never committed
- Firebase config via environment variables — mock fallbacks for development
- Input sanitisation: strips `<>"'\`` from all user text before storage and Gemini injection
- Prompt injection guard: system prompt instructs model to ignore embedded commands
- No `dangerouslySetInnerHTML` used anywhere
- Firestore security rules: users can only read/write their own data
- Strict Firestore Schema Rules: Rejection of any writes missing proper types, numeric properties, or expected static categorical values.
- Production headers: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy
- Error boundary catches runtime crashes and shows recovery UI

## Accessibility
- WCAG 2.1 AA compliant
- WAI-ARIA standards compliant Roving TabIndex keyboard-navigable CategoryPicker
- Semantic HTML throughout (`<main>`, `<nav>`, `<section>`, `<article>`)
- High-priority dynamic status updates (`aria-live="assertive"`) applied across interactive visual dashboards and async data-fetching logic so screen readers reflect the entire page cycle.
- All form fields labelled · 44px minimum tap targets · focus-visible rings
- Colour never sole state indicator · `prefers-reduced-motion` respected
- `aria-live` on dynamic content · skip navigation link
- Mobile bottom navigation for thumb-friendly access

## Any assumptions made
- Emission factors: IPCC AR6 / Our World in Data / CEA 2023 (India grid)
- India grid electricity factor: 0.71 kg CO₂e/kWh
- Global average: ~4 tonnes CO₂e/year (≈ 11 kg/day)

## Setup
```bash
git clone <repo-url>
cd terratrace
npm install
cp .env.example .env
# Add your keys:
#   VITE_GEMINI_API_KEY from https://aistudio.google.com/app/apikey
#   VITE_FIREBASE_* from Firebase Console > Project Settings > Web App
npm run dev
```

## Testing
- Unit and integration tests written in Vitest (testing hooks, components, API fallback).
- Run `npm run test:coverage` to generate full coverage reports.

```bash
npm run test
npm run test:coverage
```

## Build & Deploy
```bash
npm run build
```

## Live Preview
https://ecofoot-8fa45.web.app/

## License
MIT
