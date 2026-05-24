# Spielgarten

[![CI](https://github.com/techlotse/TL-Games/actions/workflows/ci.yml/badge.svg)](https://github.com/techlotse/TL-Games/actions/workflows/ci.yml)
[![Version](https://img.shields.io/github/package-json/v/techlotse/TL-Games?label=version&color=4f86af)](CHANGELOG.md)
[![Open PRs](https://img.shields.io/github/issues-pr/techlotse/TL-Games?label=open%20PRs&color=4f86af)](https://github.com/techlotse/TL-Games/pulls)

A calm, Montessori-inspired **toddler game platform**, built as a mobile-first
**Progressive Web App**. Designed for a 3-year-old who **cannot read yet** -
every interaction is understood through colour, shape, motion and exploration.

It is intentionally **not** a dopamine casino: no scores, no "game over", no
loud celebrations, no ads, no tracking, no accounts.

> Badge, repository and image references assume the GitHub repository
> `techlotse/TL-Games` and the Docker Hub image `techlotse/tl-games`. Docker Hub
> repository names must be lowercase, so the image is `tl-games` even though the
> GitHub repository is `TL-Games`. Adjust these if yours differ.

---

## What's inside

- **App shell** - installable PWA, offline after first load, iPhone-first.
- **Home screen** - six large, readable-free game tiles.
- **Six games:**
  1. **Build Garage** (`Werkstatt`) - *assembly*: build six vehicle types in
     turn - car, truck, bus, tractor, bulldozer, excavator - part by part.
  2. **Flower Garden** (`Blumengarten`) - *colour match*: match each flower to
     the plant pot of the same colour.
  3. **Shape Sorting** (`Formen`) - *shape match*: sort each block into its hole.
  4. **Race** (`Rennen`) - *steering*: hold and move the car to drive around
     the obstacles and collect ten cheerful items to fill its smile.
  5. **Colouring** (`Malen`) - *colouring*: pick a colour and colour the
     picture in - tap to fill a region, or sweep the brush to paint freely.
  6. **Find-an-item** (`Suchen`) - *searching*: find the item shown in the
     frame among the others scattered across the scene.
- **Difficulty progression** - every game starts gentle and ramps up the
  longer the child plays, then resets to easy at the home screen.
- **Light & dark themes** (calm, muted - never neon), saved on-device.
- **Parent area** behind a hold-to-enter gate: theme, accessibility, progress.
- Hand-drawn **SVG artwork** - no external image assets.

## Tech stack

React 18 - Vite 6 - TypeScript (strict) - Tailwind CSS 3 - shadcn/ui-style
components - Lucide icons - Framer Motion (used sparingly) - Zustand -
vite-plugin-pwa - Inter (bundled locally for offline use).

## Getting started

Requirements: **Node 18+** (developed on Node 22).

```bash
npm install      # install dependencies
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
```

### Install it on a phone (PWA)

1. `npm run build`, then deploy `dist/` to any static host - or run the
   container (below). It must be served over **HTTPS** for the service worker.
2. Open the site in **Safari** (iPhone) or **Chrome** (Android).
3. iPhone: Share -> *Add to Home Screen*. Android: menu -> *Install app*.
4. Launch it from the home screen - it runs full-screen and works offline.

## Run with Docker

A published image is available on Docker Hub as **`techlotse/tl-games`**
(multi-arch: `linux/amd64` and `linux/arm64`).

```bash
docker run --rm -p 8080:8080 techlotse/tl-games:latest
# then open http://localhost:8080
```

Or with Compose - recommended, as it adds health checks and runtime hardening
(read-only filesystem, dropped capabilities, no privilege escalation):

```bash
cp .env.example .env      # adjust IMAGE_TAG / HOST_PORT if needed
docker compose up -d
```

Available image tags:

- `latest` - the most recent tagged release
- `0.0.8`, `0.0` - specific semantic versions
- `edge` - the latest build from `main`

Build the image yourself with `docker build -t techlotse/tl-games:dev .`

## Versioning & releases

This project follows [Semantic Versioning](https://semver.org). The version in
`package.json` is the single source of truth - it is injected into the build
and shown in the in-app parent area; `VERSION` mirrors it and `CHANGELOG.md`
records every release.

Cut a release by pushing a Git tag:

```bash
git tag v0.0.8
git push origin v0.0.8
```

That triggers the publish workflow, which builds the image, scans it with
Trivy, pushes the versioned tags to Docker Hub, and creates a GitHub Release.

## Continuous integration

- **CI** (`.github/workflows/ci.yml`) - type-checks and builds on every push
  and pull request; `npm audit` runs here.
- **Publish** (`.github/workflows/publish.yml`) - on push to `main`, on `v*`
  tags, and monthly: builds the image, **fails if Trivy finds fixable
  CRITICAL/HIGH CVEs**, then builds multi-arch and pushes to Docker Hub.
- **Dependabot** keeps npm packages, GitHub Actions and the Docker base image
  up to date.

## Documentation

- [`docs/architecture.md`](docs/architecture.md) - how the app is built
- [`docs/security.md`](docs/security.md) - security & privacy posture
- [`docs/roadmap.md`](docs/roadmap.md) - what is planned next
- [`CLAUDE.md`](CLAUDE.md) - guide for continuing development
- [`CHANGELOG.md`](CHANGELOG.md) - release history

## Project structure

```
src/
  app/            App shell + a small store-driven router
  components/
    ui/           shadcn/ui-style primitives
    layout/       AppShell, GameScreen frames
    toddler/      GameTile, RoundButton, ParentGate, CompletionOverlay, ...
  games/
    shared/       Matching engine (useMatchingGame, MatchingBoard) + DraggablePiece
    build-garage/ Assembly game - build a vehicle from parts
    flower-garden/ Colour-matching game
    shape-sorting/ Shape-matching game
    race/         Steering game with a gentle game loop
    colouring/    Colouring game - fill regions or finger-paint
    find-item/    Find-an-item searching game
  screens/        HomeScreen, ParentScreen
  store/          Zustand state + localStorage persistence
  theme/          tokens.css (CSS variables) + ThemeProvider
  pwa/            manifest, service worker, registration
  i18n/           German strings
  lib/            Framework-agnostic helpers
```

Each game folder is self-contained: `data.ts` (content), `logic.ts` (rules),
`art.tsx` (modular inline SVG), the board where one is needed, and the screen
component.

## How it is designed for a toddler

- **No reading required.** Guidance is visual: glowing targets, bouncing
  arrows, happy sparkles. German text is short and for the parent.
- **Huge, obvious targets.** Every touch target is at least 64px.
- **Forgiving by design.** Wrong choices drift gently back; a part dropped on
  the car snaps to the nearest spot; a bump in Race only pauses the car.
  There is no failure state.
- **Touch-first.** Drag-and-drop, tap-to-place and hold-to-steer - whichever
  suits the game and small motor skills.
- **Calm.** Animations are gentle (180-220ms): no flashing, no confetti.
- **Few choices at once**, growing slowly as the child keeps playing.

## Accessibility

- Respects the OS **reduce-motion** setting; a parent toggle forces it too.
- **High-contrast** mode and theme choice in the parent area.
- Visible focus rings, ARIA roles, keyboard-activatable pieces.
- iPhone safe-area insets handled throughout (`viewport-fit=cover`).

## Parent area

Reachable from the small corner button on the home screen, then a
**hold-the-circle gate** - easy for an adult, unlikely for a toddler. Inside:
light/dark theme, high-contrast, reduced-motion, per-game progress and a
progress reset. No accounts, no cloud - everything stays on the device.

## Privacy & security

No backend, no login, no ads, no analytics, no tracking, no external API calls.
The only stored data is a small set of preferences in `localStorage`. The
container runs as a non-root user with a read-only root filesystem, and every
response carries a strict Content-Security-Policy. See
[`docs/security.md`](docs/security.md) for the full posture.

## Built to become a native app

The architecture anticipates a later move to **Capacitor / Expo / React Native
/ Tauri**:

- Game **rules** live in framework-light hooks (each game's `logic.ts`) with no
  DOM dependencies.
- All browser-only calls (haptics, install detection) are isolated in
  `src/lib/platform.ts` - the single file a native build would re-implement.
- Navigation is a small store-driven router, not URL-coupled.
- Artwork is modular inline SVG, so it travels with the components.

## Extending - adding a game

The home screen supports up to **6** tiles. A new game needs a `src/games/<id>/`
folder (`data.ts`, `logic.ts`, `art.tsx`, a board if needed, screen component),
registration in `src/app/routes.tsx`, a `GameId` in the store, a tile-tone
token, and a German label. See [`CLAUDE.md`](CLAUDE.md) for the step-by-step.

## Notes

- The interface is German only; add languages alongside `src/i18n/de.ts`.
- The app name (`Spielgarten`) lives in `src/i18n/de.ts` and `index.html`.
- App icons are in `public/icons/`; regenerate them if you change the artwork.
- License: private / all rights reserved (`UNLICENSED`).
