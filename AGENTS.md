<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — groundwork-client

Instructions for AI coding agents (and people) working in this repository. The block above is
managed by Next.js (`next dev` rewrites anything between its markers); write project rules below it.
Keep this file accurate: when a convention or workflow changes, update it in the same pull request.

## What this is

The web app for **Groundwork** (working name): company research before you apply — sourced company
reports, a personal fit verdict, and the right people to contact. It talks to
[groundwork-api](https://github.com/muddasir03/groundwork-api) (locally `../groundwork-api`).

- **Read the product brief before designing any feature:**
  [groundwork-api/docs/PRODUCT.md](https://github.com/muddasir03/groundwork-api/blob/develop/docs/PRODUCT.md)
  (locally `../groundwork-api/docs/PRODUCT.md`). Its design, tone and accessibility sections apply here.
- **Status:** design foundation only. The design system (tokens, components, `/design-system`) and
  the app shell exist; the home page is a placeholder and no product screens are built yet. Never
  describe features as built when they aren't.
- **Read [docs/DESIGN.md](docs/DESIGN.md) before building any UI.** It is the design system every
  screen must follow.
- **Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict), Tailwind CSS 4.

## Commands

```sh
nvm use              # Node 24, from .nvmrc
npm install
cp .env.example .env.local   # first time only
npm run dev          # http://localhost:3000; needs the API on :3001 (bin/dev in groundwork-api)
npm run lint
npm test             # Vitest, once (npm run test:watch while developing)
npm run build
```

**Before opening a PR**, run `npm run lint`, `npm test` and `npm run build`. CI runs all three
(check `build`) and it must pass to merge.

## Git workflow

- `develop` deploys to **staging**, `main` deploys to **production**. Both are protected: changes
  arrive only by pull request, with CI green. No force-pushes, no direct pushes.
- Branch from the latest `develop`: `feature/<name>`, `fix/<name>`, `chore/<name>` or `docs/<name>`.
  Open the PR into `develop`. Vercel posts a preview URL on every PR.
- **Releases** are a PR from `develop` into `main`, merged by the project owner only. Agents never
  merge into `main`.
- `main` only receives merges from `develop`, so no back-merge is needed after a release (GitHub may
  show `develop` as "behind" by the release merge commit; that's harmless). If a fix ever has to go
  straight to `main`, merge `main` back into `develop` with a merge commit, not a squash.
- Keep PRs small and focused on one change. Commit messages: imperative mood, and say *why*.
- Commit `AGENTS.md` if `next dev` changed its managed blocks, so the tree stays clean.

## Next.js in this project

This config differs from older Next.js defaults; check `node_modules/next/dist/docs/` before writing
data-fetching, caching or routing code.
- `cacheComponents: true` and `partialPrefetching: true` are on (`next.config.ts`).
- `experimental.agentFeedback: true` is on, so `next dev` maintains a feedback block in this file.
- Tailwind runs through the Turbopack CSS loader configured in `next.config.ts`.

## Code conventions

### Structure
- `app/` — routes (App Router). Group the signed-in product under a route group such as `app/(app)/`
  and the internal admin area under `app/admin/`.
- `components/ui/` — the design system's components; `components/layout/` — the app shell, page
  container and headers. See [docs/DESIGN.md](docs/DESIGN.md). Components used by only one route
  live next to that route.
- `app/(app)/` — the signed-in product, wrapped in `AppShell`. `app/(app)/design-system/` is the
  living reference of every token and component.
- `lib/api/` — **the only place that calls the API.** It reads `process.env.NEXT_PUBLIC_API_URL` and
  exports typed functions; response types live in `lib/api/types.ts`. Pages and components never
  `fetch` the API directly.
- Import with the `@/` alias (`@/components/ui/Button`), not long relative paths.

### React and TypeScript
- Server Components by default. Add `"use client"` only for state, effects, browser APIs or event
  handlers, and keep client components small and at the leaves of the tree.
- TypeScript strict; no `any` (use `unknown` and narrow it). Type every API response.
- Handle loading, empty and error states for everything that loads data.
- Names: components `PascalCase.tsx`, everything else `camelCase.ts`; route folders in `kebab-case`.

### Styling and design
**[docs/DESIGN.md](docs/DESIGN.md) is the rulebook for all UI.** In short:
- Build screens from `components/ui/` and `components/layout/`. A new UI pattern goes into
  `components/ui/` with a test, a demo on `/design-system` and a row in DESIGN.md, in the same PR.
  Never style a one-off version inside a page.
- Colours come only from the tokens in `app/globals.css`. Tailwind's default palette is removed,
  and ESLint blocks raw hex values. Light theme only.
- Fit bands are always **strong = green, possible = amber, weak = grey** (`FitBadge`,
  `FitScoreRing`). Status badges follow the tone table in DESIGN.md.
- Dates always go through `formatResearchDate` ("30 Sep 2026").
- Responsive and mobile-first: top nav on desktop, bottom tab bar on mobile. On mobile, a company
  page has three tabs: **Report**, **Your fit**, **People**.
- With `cacheComponents` on, anything calling `usePathname`/`useSearchParams` in a shared layout must
  sit inside `<Suspense>` with a server-rendered fallback (see `AppShell`).
- Accessibility is required: semantic HTML, labelled form fields, visible focus states, full keyboard
  use, WCAG AA contrast, touch targets of at least 44×44 px.

### Content rules (from the product brief)
- Show every research claim with its source and research date.
- Show "Unconfirmed" and "Not public" exactly as the API returns them; never fill gaps with guesses.
- Never show a fit score without its reasons (what matches, what's missing, the explanation).
- Tone: calm, clear and direct. Plain language, no hype, no promises of outcomes.

### Dependencies and tests
- **Ask the owner before adding a dependency**, and say why in the PR.
- Tests use **Vitest** and **Testing Library** (`*.test.ts(x)` next to the code). Every component
  in `components/ui/` and every helper in `lib/` has tests. Query by role and accessible name, the
  way a user or screen reader finds things, not by class names (except to check token colours).
- Vitest can't render `async` Server Components; test those through their child components, or
  later with end-to-end tests (Playwright, not set up yet; ask first).

## Environments and deployment

| Environment | Branch      | URL                                                                 | API |
|-------------|-------------|---------------------------------------------------------------------|-----|
| Local       | `feature/*` | http://localhost:3000                                               | http://localhost:3001 |
| Staging     | `develop`   | https://groundwork-client-git-develop-muddasir03s-projects.vercel.app (Vercel login required) | staging API |
| Production  | `main`      | https://groundwork-client.vercel.app                                | production API |

- Hosted on **Vercel's free Hobby plan**; it deploys every push. `main` is the production branch.
- `NEXT_PUBLIC_API_URL` is set per environment in Vercel. `NEXT_PUBLIC_*` values are baked in at
  build time, so a change needs a redeploy.
- The staging API accepts requests from `https://groundwork-client-*-muddasir03s-projects.vercel.app`,
  so PR previews can call it.
- Everything must stay within free tiers. Don't add a paid service, plan or add-on.

## Secrets

This repository is **public**.
- `NEXT_PUBLIC_*` variables are visible to every visitor; never put a secret in one.
- `.env.local` is git-ignored and holds a Vercel token; never commit or print it.
