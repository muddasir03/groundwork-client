import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";
import { Logo } from "@/components/layout/Logo";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "Log in" };

export default async function AdminLoginPage({ searchParams }: PageProps<"/admin/login">) {
  const { expired } = await searchParams;
  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <Card padding="lg">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Admin log in</h1>
          <p className="mt-1 mb-5 text-sm text-ink-muted">For the Groundwork research team.</p>
          <LoginForm expired={expired === "1"} />
        </Card>
      </div>
    </main>
  );
}
