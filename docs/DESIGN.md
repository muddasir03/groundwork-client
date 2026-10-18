# Groundwork design system

The rules every screen follows, so the whole product looks and behaves as one. They come from the
product brief (section 8) and the MVP screen designs.

- **Tokens** live in [`app/globals.css`](../app/globals.css).
- **Components** live in [`components/ui/`](../components/ui) and [`components/layout/`](../components/layout).
- **Live reference:** every token and component is rendered at **`/design-system`**. Open it on a
  PR's Vercel preview to review changes.

## Rules

1. **Build screens from existing components.** Look in `components/ui/` and `/design-system` first.
2. **Need something new?** Add it to `components/ui/` (or extend an existing component with a
   variant), show it on `/design-system`, add a test, and document it below, all in the same PR.
   Don't style a one-off version inside a page.
3. **Colours come only from tokens.** Tailwind's default palette is switched off, so classes like
   `bg-blue-600` don't exist, and ESLint rejects raw hex values like `bg-[#1e40c0]`. If a colour is
   truly missing, add a token to `globals.css` and to the table below.
4. **Same meaning, same look.** A fit band, a status or a primary action always looks the same,
   on every screen.
5. **Light theme only.** The brief specifies a light background; there is no dark mode.

## Colour tokens

| Token | Use |
|---|---|
| `canvas` | Page background (light grey) |
| `surface` | Cards (white) |
| `fill` | Tinted boxes inside cards (`Inset`), tags |
| `line` / `line-strong` | Borders and dividers / input and secondary-button borders |
| `ink` | Main text, dark panels ("How to approach", final call to action), company marks |
| `ink-muted` | Secondary text |
| `ink-subtle` | Meta text (dates, counts), weak-fit accents |
| `primary` / `primary-hover` | Cobalt: main actions, links, active navigation |
| `primary-soft` | Selected chips, active nav background, highlighted research pill |
| `success` / `success-soft` | Strong fit, "Published", "Interviewing", matching skills |
| `warning` / `warning-soft` | Possible fit, "In review", "Applied", gaps |
| `neutral-soft` | Weak fit, "Draft", "Researching" |

All text/background pairs meet WCAG AA contrast.

### Status colours

Pick a `Badge` tone by meaning, never by taste:

| Tone | Fit band | Admin status | Shortlist status |
|---|---|---|---|
| `success` (green) | Strong | Published | Interviewing |
| `warning` (amber) | Possible | In review | Applied |
| `primary` (cobalt) | — | Researching | Contacted |
| `neutral` (grey) | Weak | Draft | Researching |

## Typography

Fonts load through `next/font` in `app/layout.tsx` (self-hosted, no requests to Google).

| Style | Classes | Use |
|---|---|---|
| Page title | `font-display text-3xl md:text-4xl font-bold tracking-tight` (via `PageHeader`) | One per page |
| Hero title | `font-display text-4xl md:text-5xl font-bold tracking-tight` | Landing page only |
| Section title | `text-xl font-semibold` (via `SectionTitle`) | Card headings |
| Body | `text-base` (reports) / `text-sm` (cards, tables) | |
| Eyebrow | `text-xs font-semibold uppercase tracking-wide` | "MATCHES", "WHY YOU MATCH" |
| Meta | `text-xs text-ink-subtle` | Dates, source counts |

- **Display font:** Bricolage Grotesque, for page titles, the logo and big fit labels.
- **Body font:** IBM Plex Sans, for everything else.

## Shape and spacing

- Cards: `rounded-2xl`, 1px `line` border, padding from `Card`.
- Buttons and inputs: `rounded-lg`. Badges and chips: `rounded-full`. Tags: `rounded-md`.
- Page width: `max-w-6xl` with `px-4 md:px-6` (via `Container`).
- Gaps between cards: `gap-4` / `space-y-4` inside a column, `gap-6` between columns.
- Touch targets are at least 44px tall (`min-h-11`) for buttons, chips, inputs and nav items.

## Components

| Component | File | Use |
|---|---|---|
| `Button`, `ButtonLink` | `ui/Button.tsx` | `primary` main action (one per area), `secondary`, `dark` (e.g. "Compare selected"), `inverse` on dark panels |
| `Card`, `Inset` | `ui/Card.tsx` | Every content block; `highlight` for the fit card (band colour) or the item needing attention (`primary`) |
| `Badge`, `Tag` | `ui/Badge.tsx` | Statuses (see table above); `Tag` for facts and technologies (`highlighted` = also on the user's profile) |
| `Chip` | `ui/Chip.tsx` | Selectable pills: countries, sectors, quick filters, shortlist stages |
| `FitBadge` | `ui/FitBadge.tsx` | Fit as a pill: `full` "Strong fit · 82", `short` "Strong · 82" (tables), `score` "82" (mobile) |
| `FitScoreRing` | `ui/FitScoreRing.tsx` | The signature fit visual on the company page |
| `ScoreBreakdown` | `ui/ScoreBreakdown.tsx` | How the score is made up; `showBars` on mobile |
| `FitReasons` | `ui/FitReasons.tsx` | Matches and gaps. **Required wherever a fit score is shown in detail** |
| `ResearchMeta` | `ui/ResearchMeta.tsx` | "Researched 30 Sep 2026 · 18 sources". **Required wherever research is shown** |
| `CompanyMark`, `Avatar` | `ui/Identity.tsx` | Company letter tile; person initials (`soft`) or the signed-in user (`ink`) |
| `TextField`, `SelectField` | `ui/Field.tsx` | Labelled inputs and filter dropdowns |
| icons | `ui/icons.tsx` | Small inline icon set; always paired with text or an `aria-label` |
| `AppShell` | `layout/AppShell.tsx` | Signed-in frame: top nav on desktop, bottom tab bar on mobile |
| `Container`, `PageHeader`, `SectionTitle` | `layout/Page.tsx` | Page width, page title block, card headings |
| `Logo` | `layout/Logo.tsx` | Mark and wordmark; `onDark` for the admin header |

Formatting helpers: `formatResearchDate` and `pluralize` in `lib/format.ts`. Always use
`formatResearchDate` for dates so every date reads "30 Sep 2026".

## Layout patterns from the designs

- **Signed-in pages** sit inside `app/(app)/`, which wraps them in `AppShell`.
- **Desktop:** content in cards on the grey canvas. The company page uses a wide main column with
  a sticky right column (fit card, people, approach).
- **Mobile:** no top bar; a bottom tab bar (Search, Shortlist, Compare, Profile). The company page
  splits into three tabs: **Report**, **Your fit**, **People**. Long report sections collapse into rows.
- **Admin** (`app/admin/`) uses a dark (`ink`) header with `Logo onDark` and its own navigation.

## Content rules

- Every research claim shows its source and date (`ResearchMeta`, numbered source links).
- Show "Unconfirmed" and "Not public" exactly as the API returns them. Never fill a gap with a guess.
- A fit score never appears without its reasons, except in compact list views (badges in cards
  and tables) that link to the full verdict.
- Sample data uses fictional companies and people only.
- Tone: calm, clear, direct. No hype, no promises of outcomes.
