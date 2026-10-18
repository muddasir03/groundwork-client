import { publicLinks } from "@/components/layout/PublicShell";
import { Container } from "@/components/layout/Page";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { SAMPLE_REPORT_SLUG, getCompany } from "@/lib/api";
import { SampleFitCard } from "./_components/SampleFitCard";

const steps = [
  {
    title: "Upload your profile once",
    body: "Add your CV, GitHub, GitLab and LinkedIn. Confirm the skills and experience we extract.",
  },
  {
    title: "Search by country and sector",
    body: "Every company is researched in advance, with sources and a research date on each claim.",
  },
  {
    title: "See your fit and act on it",
    body: "Get a verdict with reasons, find the right senior people and a suggested way to approach them.",
  },
];

// The four promises from the product brief. Keep the wording honest: no claims of scale or
// refresh schedules the product doesn't deliver yet.
const promises = [
  {
    title: "Instant and comparable",
    body: "Companies are researched ahead of time. Filter them and compare them side by side.",
  },
  {
    title: "Verified and current",
    body: "Every claim shows its source and the date it was researched. Reports are refreshed regularly.",
  },
  {
    title: "Personal and persistent",
    body: "Your profile is saved once. Every company shows your fit automatically.",
  },
  {
    title: "Actionable",
    body: "See the CEO, CTO and engineering leads, with a suggested proof of work and message.",
  },
];

export default async function LandingPage() {
  const sample = await getCompany(SAMPLE_REPORT_SLUG);

  return (
    <>
      <section className="bg-canvas">
        <Container className="grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          <div>
            <Eyebrow>Research first. Apply second.</Eyebrow>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
              Know the company before you apply.
            </h1>
            <p className="mt-5 max-w-xl text-base text-ink-muted md:text-lg">
              Search companies by country, read a sourced research report on each one, see whether you fit and why,
              and find the senior people worth contacting.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={publicLinks.getStarted} size="lg">
                Build your profile
              </ButtonLink>
              <ButtonLink href={publicLinks.sampleReport} size="lg" variant="secondary">
                See a sample report
              </ButtonLink>
            </div>
          </div>
          {sample && <SampleFitCard company={sample} />}
        </Container>
      </section>

      <section aria-labelledby="how-it-works" className="bg-surface">
        <Container className="py-14 md:py-20">
          <h2 id="how-it-works" className="font-display text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
            How it works
          </h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <li key={step.title}>
                <Card className="h-full">
                  <span
                    aria-hidden="true"
                    className="inline-flex size-8 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-primary"
                  >
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{step.body}</p>
                </Card>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section aria-labelledby="promises" className="bg-canvas">
        <Container className="py-14 md:py-20">
          <h2 id="promises" className="font-display text-2xl font-extrabold tracking-tight text-ink md:text-3xl">
            More than a chatbot answer
          </h2>
          <p className="mt-2 text-base text-ink-muted">Four things you cannot get by pasting a prompt.</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {promises.map((promise) => (
              <li key={promise.title}>
                <Card className="h-full">
                  <h3 className="text-base font-semibold text-ink">{promise.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{promise.body}</p>
                </Card>
              </li>
            ))}
          </ul>

          <div className="mt-14 flex flex-col gap-6 rounded-2xl bg-ink p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-white md:text-3xl">
                Stop sending generic applications.
              </h2>
              <p className="mt-2 text-base text-line">Do the groundwork in minutes, not days.</p>
            </div>
            <ButtonLink href={publicLinks.getStarted} variant="inverse" size="lg" className="shrink-0">
              Build your profile
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
