# System design audit

Dream Home Builders is a static marketing site (HTML, CSS, JS, images). Production is inferred from `public/staticwebapp.config.json` and the Azure Static Web Apps URLs in page meta tags. Local preview is `server.mjs` (`npm run dev` / `npm start`), which serves `public/`. There is no database, API, or job worker.

The standard in `.cursor/rules/system-design.mdc` says a site like this mainly needs CDN, caching, security, and monitoring. Load balancing, database design, and message queues do not apply today. Do not add them until there is a real backend.

`.cursor/rules/dual-remote-push.mdc` was already present. It does not conflict (git remotes vs. design standards). Both rules stay, and both are `alwaysApply: true`.

A second, unused app sits at the repo root: `index.html`, `src/`, `vite.config.js`, `tsconfig.json`. `package.json` and `package-lock.json` declare no dependencies, and nothing starts Vite. The live pages are the files under `public/`.

## 1. System architecture

**Applies:** lightly. There is no controller/service/data-access split because there is no server-side business logic.

**In place**

- Static pages and routes: `public/*.html`, `public/apartments/*.html`, rewrites in `public/staticwebapp.config.json`.
- Local static server only: `server.mjs`. `PORT` comes from the environment (default 5180).
- `.gitignore` ignores `.env` and keeps `.env.example`. No env file is checked in.

**Gaps**

- No `.env.example`. The only env var is `PORT`. Formspree form URLs are hardcoded in `public/index.html` and `public/contact.html` (`/f/xykpgpzk`, `/f/mqeyarzv`, `/f/mjgowdwe`). Those IDs are public by nature of HTML forms, but they are not documented.
- The unused React/Vite tree (`src/App.tsx`, root `index.html`) can be mistaken for the site that ships.
- Page chrome is copied across ~35 HTML files instead of one shared layout.

**Fixes**

- **Medium.** Add a one-line `.env.example` for `PORT`. Leave Formspree IDs in the HTML until a build step exists.
- **Medium.** Delete or clearly quarantine the unused Vite/React app so one tree is the site.
- **Low.** Generate shared header/footer from one template when the next content pass happens. Not a runtime problem.

## 2. Load balancing

**Applies:** no, for this site. Azure Static Web Apps terminates TLS and spreads static files. There is no app process to health-check, drain, or stick sessions to.

**In place**

- Host rewrites and a custom 404: `public/staticwebapp.config.json`.
- Browser `sessionStorage` in `public/js/dhb-motion.js` only remembers that the preloader already ran. It is not a server session.

**Gaps**

- `server.mjs` has no `/health` or `/ready`, no SIGTERM handler, and no proxy-header handling. That matters only if the Node process is put behind a load balancer. It is not the production host today.

**Fixes**

- **Low.** Skip health checks and graceful shutdown until a service process is in production. If `server.mjs` is ever deployed, add `/health`, stop accepting on SIGTERM, and confine files to `public/` (see security).

## 3. Caching

**Applies:** yes.

**In place**

- Some vendor files are content-hashed: `public/vendor/media/c8e1c8b386dc5b7a.js` and the hashed SVGs next to it.
- Link-preview images use a query cache-buster (`?v=20260811`) in page meta tags.

**Gaps**

- `server.mjs` sets `Cache-Control: no-cache` on every response, including images and CSS.
- `public/staticwebapp.config.json` sets no cache headers. HTML, CSS, and images share one policy (platform default).
- First-party assets are unfingerprinted: `public/css/dhb-pages.css`, `public/css/dhb-site.shared.min.css`, `public/css/dhb-subpages.css`, `public/js/dhb-motion.js`, `public/js/dhb-projects.js`. A long `max-age` on those names would pin stale CSS/JS.
- No ETag or `Last-Modified` on the local server.

**Fixes**

- **High.** In `staticwebapp.config.json`, send a long immutable cache for hashed files under `/vendor/`, a short `max-age` plus revalidation for HTML, and a modest `max-age` for images. Do not mark unhashed CSS/JS immutable.
- **High.** Fingerprint `public/css` and `public/js` (hash in the filename) before extending their cache lifetime.
- **Medium.** On `server.mjs`, stop using `no-cache` for everything. Mirror the same split locally so preview matches production.

## 4. Database design

**Applies:** no. Copy, galleries, and testimonials are files (`public/`, `src/data.ts`). No schema, migrations, queries, or connection pool.

**Fixes**

- **Low.** Do not add a database for this brochure site. If leads must be stored later, start with migrations, indexes, and pagination at that point.

## 5. Message queues

**Applies:** no. The only slow side effect is quote and contact email, and that already leaves the request path: the browser `fetch`es Formspree (`public/contact.html`, `public/index.html`). There is no server work to queue.

**Gaps**

- Those `fetch` calls have no timeout. A hung Formspree request leaves the button on "Sending...".
- Success and failure are handled in the page, which is enough. There is no idempotency key; a double click can send two emails. Acceptable at this volume.

**Fixes**

- **Medium.** Add an `AbortSignal` timeout (about 10s) on the Formspree `fetch` calls. Do not add BullMQ, SQS, or a worker.
- **Low.** Disable the submit button for the whole request (already done) and ignore repeat submits until it finishes (already mostly done).

## 6. CDN

**Applies:** yes. This is the main delivery path.

**In place**

- Azure Static Web Apps serves the site on its edge (HTTPS, HTTP/2, and compression are platform features, not repo config).
- Modern formats exist for some media (`*.avif`, `*.webp` under `public/images/` and `public/vendor/media/`).
- `public/projects.html` lazy-loads gallery cards (`loading="lazy"`).
- Hero images declare `sizes` and `srcset` (`public/index.html`).

**Gaps**

- `srcset` repeats one file at 500w, 800w, 1080w, 1600w, and 1920w (same path in `public/index.html`). The browser cannot pick a smaller file.
- Galleries are mixed JPEG, PNG, WebP, and AVIF (`public/js/dhb-projects.js`). Many project photos are still JPEG.
- Below-the-fold images on the home page and the apartment pages use `loading="eager"` (about 14 per apartment file, 28 on `public/apartments.html`).
- User uploads do not exist. Nothing belongs in object storage yet.

**Fixes**

- **High.** Generate real width variants (or one WebP/AVIF plus a JPEG fallback) and point `srcset` at those files.
- **Medium.** Convert the remaining gallery JPEGs/PNGs in `public/images/projects/` to WebP or AVIF.
- **Medium.** Mark below-the-fold images `loading="lazy"`. Keep `eager` only for the first hero.

## 7. Scalability

**Applies:** partly. Static hosting already scales horizontally. There is no shared cache, database, or queue to design.

**In place**

- Stateless files. Azure Static Web Apps can add instances without session affinity.
- Expected load is a small local-business marketing site. The first bottleneck is image weight, not CPU.

**Gaps**

- No rate limit and no body size limit. Form spam is Formspree's problem; the local server will read any file under `public/` fully into memory (`fs.readFile` in `server.mjs`).
- Apartment pages are large duplicated HTML documents, so origin responses are heavier than they need to be.
- Outbound Formspree calls have no timeout (see queues).

**Fixes**

- **Medium.** Treat image bytes as the bottleneck: fix `srcset` and lazy-load before any infra work.
- **Low.** Add rate limiting only if a first-party API appears. No sticky sessions to remove.

## 8. Reliability and security

**Applies:** yes for security headers, input leaving the browser, and change safety. No for DB backups, password hashing, or authz. There are no accounts and no payments.

**In place**

- `public/staticwebapp.config.json` sets `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`.
- Unknown routes rewrite to `public/404.html`.
- Contact forms show a generic failure string and do not render server stack traces (there is no app server).
- `.gitignore` excludes `.env`. No secrets were found in the tree.
- External links that open a new tab use `rel="noopener noreferrer"`.
- Content restore is git history. There is no database to back up.

**Gaps**

- No Content-Security-Policy, no frame protection (`X-Frame-Options` or CSP `frame-ancestors`), no HSTS in repo config. Platform HTTPS is on; HSTS is not declared here.
- `server.mjs` joins the URL path onto `public/` and does not reject `..`, so a request can escape the web root if that process is reachable.
- No tests and no CI (no `.github/workflows`). A bad HTML edit ships with no check.
- Google Tag Manager `GTM-WMDRV3P6` is loaded from `public/index.html` with no documented CSP allowlist.
- `npm audit` is a no-op: the lockfile has zero packages, while `vite.config.js` imports `vite` and `@vitejs/plugin-react`.

**Fixes**

- **High.** Add CSP, `X-Frame-Options` or `frame-ancestors`, and HSTS in `globalHeaders`. Allow only the Formspree and GTM hosts the pages actually call.
- **High.** In `server.mjs`, resolve the path and refuse anything outside `public/`. Return 404 instead of reading `server.mjs` or `.git`.
- **Medium.** Add a CI workflow that checks HTML rewrites still match files on disk, and run `npm audit` once dependencies are real.
- **Low.** Document that git is the content backup. No database backup runbook is needed.

## 9. Monitoring

**Applies:** yes, in the website sense (uptime and Core Web Vitals). Request-rate dashboards and queue depth do not apply.

**In place**

- Google Tag Manager on the home page (`GTM-WMDRV3P6` in `public/index.html`). That can host analytics if someone configured it in GTM. Nothing in the repo records errors or Web Vitals.
- Local server logs two `console.log` lines at startup. No request id, level, or JSON logs.

**Gaps**

- No Sentry (or similar) on the static pages.
- No uptime check on the production host or on `/`.
- No LCP, CLS, or INP measurement. The fake `srcset` and eager images are the likely LCP problem.
- No alert path for a failed Formspree form.

**Fixes**

- **High.** Add an uptime check on the production homepage and on one interior route (`/contact`).
- **High.** Record Core Web Vitals (GTM, or a small beacon). Alert if LCP regresses after image changes.
- **Medium.** Add a browser error reporter (Sentry or equivalent) with a low sample rate. Do not log form field values.
- **Low.** Structured logs are unnecessary while the Node process is local-only.

## Priority list

| Priority | Fix | Area |
| --- | --- | --- |
| High | Cache policy: immutable only for hashed vendor files; short cache for HTML; fingerprint CSS/JS before caching them long | Caching |
| High | Real image variants and `srcset`; stop eager-loading below-the-fold photos | CDN, scalability, monitoring |
| High | CSP, frame protection, and HSTS in `public/staticwebapp.config.json` | Reliability & security |
| High | Confine `server.mjs` to `public/` so `..` cannot read the repo | Reliability & security |
| High | Uptime checks plus Core Web Vitals | Monitoring |
| Medium | Formspree `fetch` timeout | Queues, scalability |
| Medium | Convert remaining JPEG/PNG galleries; lazy-load apartment images | CDN |
| Medium | Remove or label the unused Vite/React app; add `.env.example` | Architecture |
| Medium | CI check that rewrites point at real files | Reliability & security |
| Low | `/health` and SIGTERM only if the Node server is deployed | Load balancing |
| Low | Do not add a database or a queue for the current site | Database, queues |
