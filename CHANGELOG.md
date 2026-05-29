# Changelog

All notable changes to Spielgarten are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

_Nothing yet._

## [0.3.0] - 2026-05-24

A longer journey in every game and a more refined look on the home screen.

### Added

- Every game now supports at least 20 levels of play:
  - **Bagger** combines six hand-built levels with a deterministic procedural
    generator for levels 7-20.
  - **Werkstatt** continues to cycle its ten vehicle types past level 10.
  - **Rennen** scales each run a little faster over twenty progressively
    harder runs.
  - **Blumengarten**, **Formen** and **Suchen** ramp their difficulty more
    gradually, spanning twenty levels of play before plateauing.
  - **Malen** already shipped twenty pictures and a free-style brush.

### Changed

- Home tiles now use a soft tonal gradient with a refined ring and lift
  shadow, giving the home screen a more polished, modern look.
- Tightened the matching-game ramp formula so target and decoy counts climb
  every other level instead of every level.

### Notes

- Further visual polish across each game's in-play artwork is planned as a
  follow-up - this release focuses on progression depth and the home shell.

## [0.2.3] - 2026-05-24

### Changed

- **Colouring** - finishing a picture now opens a gallery of all twenty
  pictures, so the child chooses which one to colour next instead of
  following a fixed sequence.

### Fixed

- **Bagger** - the "well done" screen now appears reliably and its Weiter
  button advances to the next level; its show-timer had been cancelled on
  every animation frame.

## [0.2.2] - 2026-05-24

More to colour, calmer matching, and a kinder platformer.

### Added

- **Colouring** now has twenty pictures - including three emojis and a blank
  canvas for free painting. The brush is available from the very first
  picture, so a child can free-style straight away.

### Changed

- **Flower Garden** lays its pots at most three across, and shows the
  destination tip only on the first level.
- **Bagger** - the first three levels have no holes at all; on later levels a
  fall now carries the excavator across to the far side of the gap, so play
  always moves forward.

### Fixed

- **Colouring** - freehand brush strokes now always stay; painting a lot no
  longer rubs out strokes painted earlier.

## [0.2.1] - 2026-05-24

A polish pass for Bagger, plus two fixes.

### Added

- **Bagger** now has six levels (up from three), and the excavator does a
  happy victory hop with a burst of sparkles on reaching the depot.

### Changed

- **Bagger** has a richer, more modern look: shaded gradients, a more
  detailed excavator, grassy platforms with flowers, layered hills, trees,
  birds and a glowing sun.

### Fixed

- **Colouring** - a picture is now finished with a clear check button rather
  than an unreliable automatic coverage check that often did not trigger.
- **Build Garage** - the finished vehicle now actually drives off the screen
  before the well-done screen (the animation had mismatched units).

## [0.2.0] - 2026-05-24

A seventh game - the excavator's first proper adventure.

### Added

- **Bagger** (`Bagger`) - a new seventh game, and the first platform game in
  Spielgarten. A friendly excavator runs and hops through a sunny construction
  site across three hand-built levels, digging up gems and rolling home to its
  depot. Press and hold to move, tap to jump. Forgiving as ever - a missed
  jump just lifts the excavator gently back onto solid ground; no score, no
  timer, no "game over". It has a picture-story intro, a cheerful arrival at
  the depot, big touch controls, keyboard play, bounce pads and a parallax
  world of hills, clouds and distant cranes.
- A seventh home-screen tile.

## [0.1.1] - 2026-05-24

Longer journeys in every game, and a more joyful finish.

### Added

- **Build Garage** now has ten vehicle types - joining the line-up are a race
  car, a garbage truck, a fire engine and a crane truck.
- **Colouring** now has ten pictures, half of them vehicles (car, truck, bus,
  tractor, digger).

### Changed

- **Build Garage** - a finished vehicle now drives cheerfully off the screen
  before the well-done screen.
- **Race** - reaching the goal is now a celebration: the car zooms off the
  road in a shower of sparkles.
- **Shape Sorting** and **Flower Garden** lay their pieces out in a grid, so a
  busy round grows down the screen as well as across instead of only shrinking
  a single row; both ramp difficulty over more levels.
- **Colouring** - the freehand brush now needs about three-quarters of the
  sheet painted before a picture counts as finished (it finished too soon
  before).

## [0.1.0] - 2026-05-24

A broad round of polish across every game, plus a calmer first impression.

### Added

- **Build Garage** now builds six vehicle types in turn - car, truck, bus,
  tractor, bulldozer and excavator - each with a few more parts than the last.
- **Race** has a goal: collect ten happy items to fill the car's smile, which
  brings a gentle "well done" and then another, slightly faster run.

### Changed

- **Build Garage** parts now line up exactly - every part's glow, tray piece
  and placed drawing come from one shared definition.
- **Flower Garden** flowers now stand planted *inside* their pots, and they
  are six Swiss plants (Enzian, Alpenrose, Loewenzahn, Krokus, Edelweiss,
  Mohn) with their German names shown for the parent.
- **Shape Sorting** higher levels add extra shapes with no hole, and the
  pieces come in different sizes - so the child sorts by shape, not size.
- **Race** is now steered by pressing and holding the car and moving it from
  side to side; the collision area is smaller, so tucking in just behind an
  obstacle is forgiven.
- **Colouring** - the brush is now true freehand: it paints wherever the
  finger goes instead of filling whole regions. A freehand picture finishes
  once enough of the sheet has been painted over.
- **Dark mode is now the default** theme.
- The home screen scrolls reliably in mobile browsers when a device is too
  short to show all six tiles at once.

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

[Unreleased]: https://github.com/techlotse/TL-Games/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/techlotse/TL-Games/compare/v0.2.3...v0.3.0
[0.2.3]: https://github.com/techlotse/TL-Games/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/techlotse/TL-Games/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/techlotse/TL-Games/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/techlotse/TL-Games/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/techlotse/TL-Games/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/techlotse/TL-Games/compare/v0.0.8...v0.1.0
[0.0.8]: https://github.com/techlotse/TL-Games/compare/v0.0.7...v0.0.8
[0.0.7]: https://github.com/techlotse/TL-Games/compare/v0.0.1...v0.0.7
[0.0.1]: https://github.com/techlotse/TL-Games/releases/tag/v0.0.1
