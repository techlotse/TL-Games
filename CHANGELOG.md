# Changelog

All notable changes to Spielgarten are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

_Nothing yet._

## [0.0.5] - 2026-05-23

This release adds a fourth game, makes Build Garage a distinct kind of play,
and gives every game a gentle in-session difficulty ramp.

### Added

- **Race** - a new fourth game. A calm steering game: hold the left or right
  side of the screen to steer. Drive **around** the obstacles and **into** the
  cheerful collectibles (stars, hearts, apples) for a happy sparkle. The speed
  rises a little every 30 seconds. A bump just pauses the car briefly with a
  soft wobble - there is still no score and no "game over".
- **Difficulty progression** in every game. Each game starts gentle and ramps
  up the longer the child plays, then resets to easy at the home screen.
- A fourth home-screen tile.

### Changed

- **Build Garage** is now an **assembly** game - build a vehicle by dragging
  (or tapping) each part onto it. Placing is forgiving: a part dropped anywhere
  on the vehicle snaps to the nearest spot that fits, and the vehicle is one
  coherent drawing so the parts always line up. The vehicle gains a part each
  round (3 - 5).
- **Flower Garden** keeps its calm **colour-matching** gameplay (match each
  flower to the pot of its colour) and now adds more flowers (3 - 5) as
  difficulty ramps.
- **Shape Sorting** keeps its **shape-matching** gameplay and now adds more
  shapes (3 - 5) as difficulty ramps.

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
