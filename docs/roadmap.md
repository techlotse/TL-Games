# Roadmap

This roadmap is a direction, not a promise. Dates are deliberately omitted -
quality and calm matter more than pace.

## Guiding principles

Every future change is measured against the things that make Spielgarten what
it is. A feature is only worth adding if it keeps the app:

- **Calm** - no overstimulation, no flashing, no noise.
- **Readable-free** - a 3-year-old must still understand it without words.
- **Forgiving** - no failure states, no punishment, no time pressure.
- **Private & safe** - no ads, no tracking, no accounts, no data collection.
- **Not a compulsion loop** - no engineered "rewards" or streak mechanics.

Anything that conflicts with the list above is explicitly out of scope.

## Released

### v0.3.0

Every game now supports at least twenty levels of play - hand-crafted
and procedurally generated where useful - and the home shell has a more
refined look. In-game art polish continues in a follow-up release.

### v0.2.0

A seventh game: Bagger - a gentle side-scrolling platform game where a
friendly excavator runs, hops and digs up gems across six levels.

### v0.1.1

Polish across the board: ten vehicle types in Build Garage, ten Colouring
pictures, grid layouts for the matching games, and more joyful finishes.

### v0.1.0

A broad round of polish: six vehicle types in Build Garage, a goal in
Race, flowers planted inside their pots, true freehand painting in
Colouring, and dark mode as the default.

### v0.0.8

Two more games - Colouring ("Malen") and Find-an-item ("Suchen") - bringing
the home screen to its full six tiles, plus a destination hint that steps
back after the first rounds of a session.

### v0.0.5

Four games - Build Garage (assembly), Flower Garden (colour matching),
Shape Sorting (shape matching) and Race (steering: collect and avoid) - plus a gentle in-session
difficulty ramp in every game.

### v0.0.1 - MVP

The app shell, theming, PWA support, the parent area, and three matching games
on a shared engine. Containerised, with CI/CD and image security scanning.

## Near term (0.1.x)

- Optional, very gentle audio (soft confirmation tones) with a parent toggle,
  off by default.
- A simple first-run visual hint for each game's gesture.
- Additional languages alongside German (the i18n layer already supports it).
- A small automated test suite around each game's logic.

## Mid term (0.x)

- Native packaging via Capacitor (iOS/Android), reusing the existing game
  logic unchanged - only `src/lib/platform.ts` gains a native implementation.
- A light, calm parent insights view, computed entirely on-device.
- A formal accessibility pass and automated checks in CI.

## Long term (1.0+)

- Publication to the App Store and Google Play as a wrapped native build.
- Optional downloadable content packs - always one-time, never subscription,
  never ad-supported.

## Permanently out of scope

- Advertising of any kind.
- Behavioural analytics or tracking.
- User accounts, cloud sync or social features.
- Reward loops, streaks, timers or anything designed to maximise screen time.
