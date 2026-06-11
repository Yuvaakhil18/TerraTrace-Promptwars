# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-11

### Added
- Complete implementation of the TerraTrace Carbon Footprint awareness platform.
- Integration with Gemini 2.5 Flash for AI-powered eco-insights.
- Real-time Firestore synchronization for all logged activities.
- Comprehensive accessibility via ARIA labels and keyboard navigation.
- 100% Code Quality toolchain including ESLint, Prettier, and Vitest.
- GitHub Actions CI/CD workflows for automated quality gates.
- Docker configuration for containerized local hosting.

### Security
- Fixed multiple vulnerabilities in `react-router-dom` and `vitest` dependencies.
- Added strict Content Security Policy headers to `index.html`.
- Implemented robust `sanitizeText` to prevent any XSS injections.
