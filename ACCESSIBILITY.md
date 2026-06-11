# Accessibility (A11y) Statement

TerraTrace is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.

## WCAG 2.1 AA Compliance
This project targets full WCAG 2.1 AA compliance across all views.

## Implemented Features
1. **Keyboard Navigation:** All interactive elements (`Button`, `Modal`, `CategoryPicker`) are fully navigable using the `Tab` key. Custom inputs utilize roving tabindex for native-feeling arrow navigation.
2. **Aria Labels:** Action buttons and SVG icons implement `aria-label` or `aria-hidden` to provide necessary context to screen reader users without cluttering the visual UI.
3. **Live Regions:** Dynamic data loading, including the Gemini AI insight fetching, utilizes `aria-live="assertive"` so screen reader users are notified when insights load or error out.
4. **Contrast Ratios:** The UI maintains a minimum 4.5:1 text-to-background contrast ratio, verified via Axe tools, in both light and dark modes.
5. **Reduced Motion:** CSS animations respect the user's OS-level `prefers-reduced-motion` settings.

## Automated Accessibility Testing
We utilize `vitest-axe` within our component tests to catch accessibility regressions during CI/CD pipelines.
