# Application Security

This document describes the security posture of **Spielgarten** — what the
application is, what it deliberately is *not*, and the controls that keep it
safe for its users (toddlers) and their families.

## Security posture in one paragraph

Spielgarten is a fully static, client-side Progressive Web App. There is **no
backend, no database, no authentication, no user accounts, no analytics, no
advertising and no third-party network calls**. Nothing the child does ever
leaves the device. This removes entire classes of risk (server compromise,
credential theft, injection against a database, data breaches) by design — the
attack surface is intentionally tiny.

## Threat model

| Asset | Threat | Mitigation |
|---|---|---|
| The child using the device | Exposure to ads, tracking, inappropriate content, dark patterns | None present by design; no network content is loaded |
| The child's behaviour/data | Collection or exfiltration of personal data | Nothing is collected; only local preferences are stored |
| The served page | Cross-site scripting, clickjacking, content injection | Strict CSP, framing denied, hardening headers (below) |
| The container host | Container escape / privilege escalation | Non-root image, read-only FS, dropped capabilities |
| The supply chain | Malicious or vulnerable dependency / base image | Lockfile, `npm audit`, Dependabot, Trivy image scan |
| The release pipeline | Leaked credentials, tampered image | Scoped secrets, least-privilege tokens, scan-before-publish |

## Application-level security

- **No backend & no third-party requests.** Fonts, icons and all assets are
  bundled and served from the same origin. The service worker only ever talks
  to its own origin.
- **No personal data.** The only persisted state is a small set of local
  preferences (theme, accessibility toggles, per-game round counts) in
  `localStorage`. There are no identifiers, no accounts and no telemetry.
- **Content Security Policy.** Served by nginx on every response:
  `default-src 'self'`, `script-src 'self'` (no inline scripts),
  `object-src 'none'`, `base-uri 'self'`, `frame-ancestors 'none'`.
  `style-src` allows `'unsafe-inline'` only because the animation library sets
  inline style attributes; no inline `<style>`/`<script>` blocks are emitted.
- **Hardening headers.** `X-Content-Type-Options: nosniff`,
  `X-Frame-Options: DENY`, `Referrer-Policy: no-referrer`,
  `Cross-Origin-Opener-Policy`, `Cross-Origin-Resource-Policy`, and a
  restrictive `Permissions-Policy` (camera, microphone, geolocation, USB and
  payment are all disabled).
- **No dangerous APIs.** The code uses no `eval`, no `dangerouslySetInnerHTML`,
  and no dynamic remote code.

## Child safety & privacy

Spielgarten is built for 3-year-olds, so child safety is a primary requirement,
not an afterthought:

- No advertising, no in-app purchases, no "rewards" loops engineered for
  compulsion.
- No data collection — there is nothing to be COPPA/GDPR-K relevant about,
  because no personal data is ever gathered or transmitted.
- The parent area is placed behind a hold-to-enter gate so a toddler cannot
  reach settings by accident.
- No external links and no way to navigate out of the app.

## Container security

- **Multi-stage build.** Node.js, the source code and `node_modules` exist only
  in the build stage. The published image contains nginx plus the static build
  output and nothing else.
- **Non-root.** The runtime image is `nginxinc/nginx-unprivileged`, which runs
  as an unprivileged user and listens on port `8080`.
- **Hardened runtime** (see `compose.yml`): read-only root filesystem, all
  Linux capabilities dropped, `no-new-privileges` enabled, and writable paths
  limited to `tmpfs` mounts.
- **Health checks** are defined in both the `Dockerfile` and `compose.yml`.

## Supply-chain security

- Dependencies are installed from a committed `package-lock.json` with
  `npm ci` (reproducible, no surprise versions).
- **Dependabot** raises update PRs weekly for npm packages, GitHub Actions and
  the Docker base image.
- **`npm audit`** runs in the CI workflow.
- **Trivy** scans the built container image in the publish workflow. A
  CRITICAL or HIGH severity finding with an available fix **fails the build and
  blocks publishing**. Results are also uploaded to the repository's GitHub
  Security tab as SARIF.
- The image is rebuilt monthly on a schedule so base-image patches are picked
  up even without code changes.

## CI/CD security

- Workflow `GITHUB_TOKEN` permissions are least-privilege (`contents: read` by
  default; elevated only where a job genuinely needs it).
- Docker Hub credentials are provided as repository secrets
  (`ORG_DOCKERHUB_USER`, `ORG_DOCKERHUB_KEY`) and are never written to logs or
  baked into the image.
- The image is security-scanned **before** it is pushed.

## Reporting a vulnerability

Please report suspected security issues privately to the maintainers (e.g. via
a GitHub Security Advisory on `techlotse/TL-Games`) rather than opening a public
issue. Include reproduction steps and affected versions.

## Accepted limitations

- `style-src 'unsafe-inline'` is required by the animation library. Inline
  *scripts* remain forbidden, so the XSS risk is low.
- The PWA service worker caches assets for offline use; a stale cache is
  refreshed on the next online visit (the worker uses skip-waiting).
