# Testing Strategy

TerraTrace relies on an extensive testing setup powered by Vitest to ensure 100% confidence in the application's core logic.

## Test Coverage
Run the test suite with coverage reporting:
```bash
npm run test:coverage
```

## Testing Focus Areas
1. **Validation & Sanitization:** Ensuring all inputs are sanitized against XSS payloads and validating that out-of-bound numbers or unrecognized categories are rejected. (`validators.test.ts`, `validateActivityInput.test.ts`)
2. **Emission Factors:** Validating that every category and subtype matches the exact IPCC AR6 and CEA 2023 grid constants. (`emissionFactors.test.ts`)
3. **Custom Hooks:** Mocking Firestore responses to verify state logic for `useActivities`, `useEmissions`, and Gemini AI fallback handling. (`useEmissions.test.ts`, `useGemini.test.ts`)
4. **UI Components:** React component testing via Testing Library to ensure correct renders under loading, error, and success states. (`ActivityLogger.test.tsx`)

Currently, 51 tests run across 7 suites with 0 failures.
