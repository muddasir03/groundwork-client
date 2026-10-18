# Groundwork

> **Groundwork does the company research before you apply: what they do, whether you fit, and who to talk to, in minutes instead of days.**
>
> "Groundwork" is a working name; the final name will be chosen before launch.

## The problem

Job seekers spend days researching each company and still end up applying blindly, because they can't quickly answer three questions:

1. What does this company actually do?
2. Am I a good fit, and why or why not?
3. Who should I contact, and how should I approach them?

Answering these properly takes hours per company, so most people send generic CVs to dozens of companies instead. Groundwork is the opposite of mass-applying: fewer applications, better matched, each backed by real knowledge.

## The four promises

- **Instant and comparable.** Companies are researched in advance, so you can filter by country and sector and compare them side by side.
- **Verified and current.** Every claim shows its source and the date it was researched, and reports are refreshed regularly.
- **Personal and persistent.** You enter your profile once, and every company shows a fit verdict for you, saved for later.
- **Actionable.** Each company lists its senior people and suggests a way to approach them.

## Product principles

- **Trust over volume.** No invented facts. Anything that can't be verified is marked "Unconfirmed" or "Not public", and a person reviews every report before it's published.
- **Show the reasons.** A fit verdict is never a bare number; you always see why you fit or don't.
- **Respect privacy.** Only public information about companies and their people. No LinkedIn scraping, no private email addresses. Your CV and profile are yours, and you can delete all your data at any time.
- **Help people act, not just read.** Every company page leads to a next step.
- **Be honest about limits.** Groundwork informs decisions; it doesn't guarantee outcomes.
- **Stay affordable.** Each company is researched once and shared by all users.

## The user journey

1. **Create a profile:** upload a CV, link GitHub, GitLab, LinkedIn and a portfolio, and choose target countries and sectors.
2. **Confirm it:** review the skills, experience and languages Groundwork extracted, and correct anything wrong.
3. **Search companies** by country, sector, city, size and fit level.
4. **Read the report:** a sourced overview of what the company does, its clients and competitors, business model, product and engineering, team and hiring, market and risks.
5. **See your fit:** a score, a band (strong, possible or weak), what matches, what's missing, and why. Rate whether the verdict is right.
6. **Find the right people:** CEO, CTO, engineering leaders and talent leads, linked to their public profiles.
7. **Get an approach:** a proof-of-work idea based on the company's real gaps, who to contact, and a draft message.
8. **Compare and shortlist:** compare up to three companies, save them with notes, and track each from research to interview.

## MVP scope

Groundwork is an MVP in early development. **No product features are built yet**; this repository currently contains the web app foundation and its deployment setup.

- **Planned for the MVP:** the journey above, launching with about 30 researched software and SaaS companies in Spain, for engineers looking for roles there.
- **Not included yet:** live job listings, visa sponsorship information, payments, sending messages or applying on your behalf, native mobile apps, and countries beyond Spain.

The full product brief is in [groundwork-api/docs/PRODUCT.md](https://github.com/muddasir03/groundwork-api/blob/develop/docs/PRODUCT.md).

## This repository

The Groundwork web app: a responsive site for desktop and mobile, where people build their profile, read company reports, see their fit and shortlist companies. It talks to [groundwork-api](https://github.com/muddasir03/groundwork-api).

Next.js 16, React 19, Tailwind CSS 4, TypeScript.

### Local development

Requires Node 24 (see `.nvmrc`; run `nvm use`).

```sh
npm install
cp .env.example .env.local   # points at the API on http://localhost:3001
npm run dev                  # http://localhost:3000
npm test                     # component tests (Vitest)
```

The UI follows the design system in [docs/DESIGN.md](docs/DESIGN.md); every component is shown at `/design-system`.

Run the API alongside it with `bin/dev` in `groundwork-api`.

### Environments & releasing

| Environment | Branch      | Runs on                              | `NEXT_PUBLIC_API_URL`    |
|-------------|-------------|--------------------------------------|--------------------------|
| Development | `feature/*` | your machine                         | `http://localhost:3001`  |
| Staging     | `develop`   | Vercel (Hobby), `develop` branch URL | staging API on Render    |
| Production  | `main`      | Vercel (Hobby), production URL       | production API on Render |

`develop` and `main` are protected: changes arrive only through pull requests, and CI must pass.

1. Branch off `develop` (`feature/<name>`), open a PR into `develop`. CI lints and builds it, and
   Vercel posts a preview URL on the PR.
2. Merging into `develop` updates **staging**. Test there against the staging API.
3. To release, open a PR from `develop` into `main`. Merging deploys to **production**.

On Vercel, `main` is the production branch. Set `NEXT_PUBLIC_API_URL` under
Settings → Environment Variables: the production API for **Production**, the staging API for **Preview**.
`NEXT_PUBLIC_*` values are baked in at build time, so redeploy after changing them.
