import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/layout/Page";

// Temporary home page until the landing page is built.
export default function Home() {
  return (
    <Container className="flex flex-1 flex-col justify-center py-16">
      <Logo />
      <h1 className="mt-8 max-w-2xl font-display text-4xl font-extrabold tracking-tight text-ink md:text-5xl">
        Know the company before you apply.
      </h1>
      <p className="mt-4 max-w-xl text-base text-ink-muted">
        Groundwork does the company research before you apply: what they do, whether you fit, and who to talk to.
        It is in early development.
      </p>
    </Container>
  );
}
