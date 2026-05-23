# Changelog

All notable changes to Spielgarten are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

_Nothing yet._

## [0.0.1] - 2026-05-23

First public MVP — a calm, Montessori-inspired toddler game platform.

### Added

- **App shell** — mobile-first PWA: installable, offline after first load,
  iPhone-first with Android support, iOS safe-area handling.
- **Home screen** with three large, readable-free game tiles.
- **Build Garage** game — match each vehicle to its outline.
- **Flower Garden** game — match each flower to its colour pot.
- **Shape Sorting** game — fit each wooden block into its hole.
- **Reusable matching engine** (`useMatchingGame`, `MatchingBoard`) shared by
  all three games — drag-and-drop and tap-to-place, forgiving feedback.
- **Light and dark themes**, high-contrast mode and reduced-motion mode,
  all persisted on-device.
- **Parent area** behind a hold-to-enter gate: theme, accessibility, progress.
- Gentle 3-dot progress tracking per game.
- German (de) interface strings.
- Hand-drawn SVG artwork and generated PWA icons.
- **Containerised deployment** — multi-stage Docker build served by a hardened,
  non-root nginx; `compose.yml` and `.env.example` for self-hosting.
- **CI/CD** — GitHub Actions for build/type-check, multi-arch image publishing
  to Docker Hub, and Trivy container security scanning.
- Dependabot for npm, GitHub Actions and Docker base-image updates.
- Project documentation: `README`, `CLAUDE.md`, and `docs/` (security,
  architecture, roadmap).

### Security

- No backend, no login, no analytics, no tracking, no third-party requests.
- Strict Content-Security-Policy and hardening headers served by nginx.
- Container runs as a non-root user with a read-only root filesystem.

[Unreleased]: https://github.com/techlotse/TL-Games/compare/v0.0.1...HEAD
[0.0.1]: https://github.com/techlotse/TL-Games/releases/tag/v0.0.1
