# CLAUDE.md — working notes for continuing this project

Instructions for an AI agent (or any developer) picking up Spielgarten. Read
this fully before making changes.

## 1. What this project is

Spielgarten is a calm, Montessori-inspired **toddler game platform**, shipped as
a mobile-first PWA. The target user is a **3-year-old who cannot read**.

**Prime directive:** a 3-year-old must be able to explore and play every screen
**without reading anything and without being told how**. If a change makes that
harder, it is wrong — revert it.

## 2. Non-negotiable constraints

These are product requirements, not preferences. Do not violate them:

- **No reading required.** Guidance is visual only: glowing targets, arrows,
  motion, large highlighted objects. German text is short and for the *parent*.
- **Huge touch targets** — never below 64px for anything a child taps.
- **Forgiving always.** Wrong actions bounce back gently. No failure state, no
  "game over", no score, no timer, no countdown.
- **Calm.** Animations are gentle and short (180–220ms). No flashing, no
  confetti, no particle storms, no loud celebrations.
- **No dark patterns.** No ads, no tracking, no analytics, no accounts, no
  compulsion/reward loops. No backend, no external network calls.
- **Accessibility.** Respect reduced motion, high contrast, safe areas.

If asked to add something that breaks the above, push back and propose a
calm, child-appropriate alternative.

## 3. Tech stack & dependency policy

React 18 · Vite 6 · TypeScript (strict) · Tailwind 3 · Zustand · Framer Motion
· vite-plugin-pwa · nginx (container runtime).

- Stay **within the current major versions**. Newest minors/patches are fine.
- Major upgrades (React 19, Tailwind 4, Vite 8, etc.) arrive as **Dependabot
  PRs** — treat each as its own reviewed, separately-tested change.
- After any dependency change: regenerate `package-lock.json`, run
  `npm audit`, and run a full build.
- Do **not** add a dependency that introduces a backend, tracking, ads, or
  external runtime requests.

## 4. Commands

```bash
npm install        # install (uses package-lock.json)
npm run dev        # dev server
npm run build      # tsc type-check + vite build + service worker  <-- the gate
npm run preview    # preview the production build

docker build -t techlotse/tl-games:dev .   # build the container image
docker compose up -d                       # run the published image
```

**Definition of done for any change:** `npm run build` passes with zero errors
(TypeScript is strict, including `noUnusedLocals`/`noUnusedParameters`), and the
dev server runs without console errors.

## 5. Project structure

See `docs/architecture.md` for the full picture. Quick map:

- `src/app/` — shell + `routes.tsx` (the store-driven router and game list).
- `src/games/shared/` — the **reusable matching engine**. Most game work
  reuses this; understand it before touching games.
- `src/games/<game>/` — one folder per game: `data.ts`, `logic.ts`,
  `art.tsx`, and the screen component.
- `src/components/toddler/` — large child-facing components.
- `src/store/appStore.ts` — all global state (Zustand + localStorage).
- `src/theme/` — `tokens.css` (CSS variables) + `ThemeProvider`.
- `src/pwa/` — manifest, service worker, registration.
- `src/i18n/de.ts` — all German strings.

## 6. How to add a new matching game

The home screen supports up to **6 tiles** (MVP ships 3). To add one:

1. Create `src/games/<game>/`:
   - `data.ts` — the set of match keys + per-key content (colours/art data).
   - `art.tsx` — inline SVG components (item art, target art, a home tile).
   - `logic.ts` — a thin hook calling `useMatchingGame({ keys, count })`.
   - `<Game>.tsx` — renders `<GameScreen tone="..."><MatchingBoard .../></GameScreen>`.
2. Add the game id to `GameId` / `ScreenId` in `src/store/appStore.ts` and the
   empty-progress record.
3. Register it in `src/app/routes.tsx` (`ROUTES` and `GAMES`).
4. Add a tile tone: a `--tile-<id>` token in `src/theme/tokens.css`, the colour
   in `tailwind.config.js`, and the tone in `GameTone` + the tone maps.
5. Add German labels to `src/i18n/de.ts`.

If the new activity is **not** a 1:1 match, extend the shared engine rather
than forking it — keep games thin.

## 7. The matching engine

- `useMatchingGame` is **headless** — rules only, no DOM, no browser APIs.
  Keep it that way; it is the most portable part of the codebase.
- `MatchingBoard` owns presentation: drag-and-drop, tap-to-place, the glow/arrow
  hint, the wrong-answer wiggle, and the completion overlay.
- `DraggablePiece` supports both drag and tap. Wrong/missed drops spring home
  via `dragSnapToOrigin`.

## 8. Theming

- Never hard-code colours in components. Use the semantic Tailwind classes
  (`bg-surface`, `text-ink`, `bg-tile-*`, etc.) which resolve to CSS variables.
- Game *artwork* may use literal hex (it is content); UI chrome must not.
- All theme/contrast/motion classes are applied **only** by `ThemeProvider`.
- Honour reduced motion via `useCalmMotion()` for any Framer Motion animation.

## 9. Conventions

- TypeScript strict; no `any` unless truly unavoidable.
- Functional components, named exports. One screen/component per file.
- Keep German labels short — they are parent hints, not instructions.
- No emojis in code or UI.
- Animation timing stays in the 180–220ms range; reuse the presets in
  `src/lib/motion.ts`.
- Browser-only APIs go through `src/lib/platform.ts` — never call them directly
  from game or UI code (this keeps a native port cheap).

## 10. PWA & container

- The service worker is authored in `src/pwa/service-worker.ts` and built by
  vite-plugin-pwa (injectManifest). It must keep the literal token
  `self.__WB_MANIFEST`. It is excluded from the app `tsconfig.json`.
- The container is a multi-stage build → non-root nginx serving `dist/`.
  Security headers and SPA routing live in `nginx.conf`.
- CI: `.github/workflows/ci.yml` (build), `publish.yml` (multi-arch build →
  Trivy scan → push to Docker Hub `techlotse/tl-games` → release on tag).
- Bump the version in **`package.json`** (single source of truth — the app
  reads it via the `__APP_VERSION__` build define) and add a `CHANGELOG.md`
  entry for every release. Tag releases `vX.Y.Z`.

## 11. Before you finish

- [ ] `npm run build` passes cleanly.
- [ ] `npm run dev` shows no console errors.
- [ ] New interactive elements are ≥64px and work by both drag and tap.
- [ ] No reading is required to understand the change.
- [ ] Animations are gentle and respect reduced motion.
- [ ] `CHANGELOG.md` updated if the change is user-facing.
- [ ] No new tracking, ads, accounts, backends or external requests.
