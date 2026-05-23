# Changelog

All notable changes to Spielgarten are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

_Nothing yet._

## [0.0.5] - 2026-05-23

This release makes every game a distinct kind of play, adds a fourth game, and
introduces a gentle in-session difficulty ramp.

### Added

- **Race** - a new fourth game. A calm steering game: hold the left or right
  side of the screen to steer and drive around the obstacles. The speed rises
  a little every 30 seconds. A bump just pauses the car briefly with a soft
  wobble - there is still no score and no "game over".
- **Difficulty progression** in every game. Each game starts gentle and ramps
  up the longer the child plays, then resets to easy at the home screen.
- A fourth home-screen tile.

### Changed

- The three original games are now **genuinely different game types** instead
  of the same matching game re-themed:
  - **Build Garage** is now an **assembly** game - build a vehicle by dragging
    each part onto its place. The vehicle gains a part each round (3 - 5).
  - **Flower Garden** is now a **find-and-tap discovery** game - tap the
    bushes, leaves and flowers to reveal hidden creatures. More spots and
    decoys appear as play continues.
  - **Shape Sorting** stays the **sort-into-holes matching** game and now adds
    more shapes (3 - 5) as difficulty ramps.
- The matching engine is now shared by Shape Sorting only; the other games
  have their own logic and boards.

## [0.0.1] - 2026-05-23

First public MVP - a calm, Montessori-inspired toddler game platform.

### Added

- **App shell** - mobile-first PWA: installable, offline after first load,
  iPhone-first with Android support, iOS safe-area handling.
- **Home screen** with large, readable-free game tiles.
- Three matching games on a shared engine, with drag-and-drop and
  tap-to-place, and forgiving feedback.
- **Light and dark themes**, high-contrast mode and reduced-motion mode,
  all persisted on-device.
- **Parent area** behind a hold-to-enter gate: theme, accessibility, progress.
- German (de) interface strings, hand-drawn SVG artwork, generated PWA icons.
- **Containerised deployment** - multi-stage Docker build served by a hardened,
  non-root nginx; `compose.yml` and `.env.example` for self-hosting.
- **CI/CD** - GitHub Actions for build/type-check, multi-arch image publishing
  to Docker Hub, and Trivy container security scanning.
- Dependabot for npm, GitHub Actions and Docker base-image updates.
- Project documentation: `README`, `CLAUDE.md`, and `docs/`.

### Security

- No backend, no login, no analytics, no tracking, no third-party requests.
- Strict Content-Security-Policy and hardening headers served by nginx.
- Container runs as a non-root user with a read-only root filesystem.

[Unreleased]: https://github.com/techlotse/TL-Games/compare/v0.0.5...HEAD
[0.0.5]: https://github.com/techlotse/TL-Games/compare/v0.0.1...v0.0.5
[0.0.1]: https://github.com/techlotse/TL-Games/releases/tag/v0.0.1
