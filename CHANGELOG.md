# Changelog

All notable changes to Spielgarten are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

_Nothing yet._

## [0.0.8] - 2026-05-24

Two more games - the home screen is now full at six - and a gentler hint that
steps back once the child has the hang of a game.

### Added

- **Colouring** (`Malen`) - a new fifth game. Pick a colour, then colour the
  picture: tap a region to fill it solid. From level 2 a tool toggle is
  unlocked - keep tapping to fill, or pick the brush and sweep a finger to
  paint freely. The picture gains regions as the child plays. There is no
  "wrong" colour and no score.
- **Find-an-item** (`Suchen`) - a new sixth game. One item is shown in a
  frame; the child finds and taps that same item among the others scattered
  across the scene, until every item is found. More items appear the longer
  the child plays.
- A fifth and sixth home-screen tile - the home screen is now full at six
  games.

### Changed

- The destination hint in **Build Garage**, **Flower Garden** and **Shape
  Sorting** now shows only on the first two rounds of a session, then steps
  back so the child decides where each piece belongs. **Find-an-item** does
  the same: the target glows in the scene on the first levels only.
- Home tiles are now vertical cards - artwork above, a short word below - laid
  out in a 2-column grid so all six games fit on screen without scrolling.

## [0.0.7] - 2026-05-23

A fourth game, four distinct kinds of play, a gentle per-session difficulty
ramp, and a refresh of the safe dependencies.

### Added

- **Race** - a new fourth game. A calm steering game: hold the left or right
  side of the screen to steer. Drive **around** the obstacles and **into** the
  cheerful collectibles (stars, hearts, apples) for a happy sparkle and a
  little hop. The speed rises a little every 30 seconds. A bump just pauses the
  car briefly with a soft wobble - there is still no score and no "game over".
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

### Dependencies

- Updated within proven major versions: `framer-motion` 12, `lucide-react` 1,
  `tailwind-merge` 3, `vite-plugin-pwa` 1. `npm audit` reports 0 vulnerabilities.
- Deferred (need their own reviewed migration): React 19, Tailwind 4,
  TypeScript 6, Vite 8, `@vitejs/plugin-react` 6, and the Node 26 base image.

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

[Unreleased]: https://github.com/techlotse/TL-Games/compare/v0.0.8...HEAD
[0.0.8]: https://github.com/techlotse/TL-Games/compare/v0.0.7...v0.0.8
[0.0.7]: https://github.com/techlotse/TL-Games/compare/v0.0.1...v0.0.7
[0.0.1]: https://github.com/techlotse/TL-Games/releases/tag/v0.0.1
