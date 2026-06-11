# Security Policy

## Reporting a Vulnerability
We take the security of TerraTrace very seriously. If you discover a vulnerability, please report it immediately.

## Supported Versions
| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Implemented Security Measures
TerraTrace implements multiple layers of security to ensure user data integrity and application safety:

### 1. Data Protection
- **No Direct API Keys:** Gemini API keys are injected at build-time securely via `.env` variables.
- **Firestore Security Rules:** Users can only read and write to their specific authenticated `uid` path.

### 2. XSS & Injection Prevention
- **Content Security Policy (CSP):** Strict `index.html` headers prevent unauthorized scripts.
- **Input Sanitization:** All text inputs are filtered through `sanitizeText` to strip `< > " ' \``.
- **Prompt Injection Guards:** Gemini system prompts explicitly instruct the AI to ignore any embedded commands within user notes.

### 3. Application Security
- Strict `eslint-plugin-security` rules applied to the codebase.
- Verified dependencies with zero critical `npm audit` vulnerabilities.
- No `dangerouslySetInnerHTML` usage anywhere in the React application.
