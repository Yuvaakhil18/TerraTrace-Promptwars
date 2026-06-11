# Application Architecture

## Core Technologies
- **Frontend Framework:** React 19 / Vite 8
- **Language:** TypeScript 5 (Strict Mode)
- **Styling:** Tailwind CSS v4
- **Backend/Database:** Firebase Authentication & Firestore
- **AI Integration:** `@google/genai` (Gemini 2.5 Flash)

## High-Level Data Flow
1. **User Authentication:** Handled exclusively via Firebase Auth (Email, Google, Apple, Facebook, Phone).
2. **Activity Logging:** Users log activities -> sanitized input -> `calculateEmission` factors IPCC constants -> data saved to Firestore `users/{uid}/activities`.
3. **Data Aggregation:** `useEmissions` hook aggregates data locally to derive `weeklySummary` and `categoryBreakdown`.
4. **AI Processing:** `useGemini` hook sends the aggregated JSON structure to the Gemini API with a strict JSON schema requirement to guarantee formatted response tips. Responses are cached locally using `localStorage` to prevent API rate limits.
5. **Eco Challenges:** Firestore manages completion statuses globally per user in the `users/{uid}/data` directory.

## Code Splitting & Performance
To maximize efficiency scores, the application utilizes React's `lazy()` and `Suspense` features to split heavy routes (Dashboard, Insights, Logs) from the critical rendering path. Heavy chart libraries (Recharts) are explicitly isolated in Rollup configurations.
