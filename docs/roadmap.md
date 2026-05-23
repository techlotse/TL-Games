# Roadmap

This roadmap is a direction, not a promise. Dates are deliberately omitted —
quality and calm matter more than pace.

## Guiding principles

Every future change is measured against the things that make Spielgarten what
it is. A feature is only worth adding if it keeps the app:

- **Calm** — no overstimulation, no flashing, no noise.
- **Readable-free** — a 3-year-old must still understand it without words.
- **Forgiving** — no failure states, no punishment, no time pressure.
- **Private & safe** — no ads, no tracking, no accounts, no data collection.
- **Not a compulsion loop** — no engineered "rewards" or streak mechanics.

Anything that conflicts with the list above is explicitly out of scope.

## Released

### v0.0.1 — MVP

The app shell, theming, PWA support, the parent area, and three playable games
(Build Garage, Flower Garden, Shape Sorting) on a shared matching engine.
Containerised, with CI/CD and image security scanning.

## Near term (0.1.x)

- More variety per game: larger content pools, more rounds.
- A fourth and fifth game tile (the home screen already supports up to six),
  reusing the matching engine — e.g. animal homes, day/night sorting.
- Optional, very gentle audio (soft confirmation tones) with a parent toggle,
  off by default.
- A simple first-run visual hint that teaches the drag/tap gesture.
- Additional languages alongside German (the i18n layer already supports it).

## Mid term (0.x)

- Native packaging via Capacitor (iOS/Android), reusing the existing game
  logic unchanged — only `src/lib/platform.ts` gains a native implementation.
- A light, calm parent insights view (which activities were played most),
  computed entirely on-device.
- A formal accessibility pass (screen-reader walkthrough, switch-control,
  contrast audit) and automated checks in CI.
- A small automated test suite around the headless matching engine.

## Long term (1.0+)

- Publication to the App Store and Google Play as a wrapped native build.
- Optional downloadable content packs (new themed games) — always one-time,
  never subscription, never ad-supported.
- A simple, documented authoring format so new matching games can be added as
  data rather than code.

## Permanently out of scope

- Advertising of any kind.
- Behavioural analytics or tracking.
- User accounts, cloud sync or social features.
- Reward loops, streaks, timers or anything designed to maximise screen time.
