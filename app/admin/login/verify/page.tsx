import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { VerifyCodeForm } from "@/components/admin/VerifyCodeForm";
import { Logo } from "@/components/layout/Logo";
import { Card } from "@/components/ui/Card";
import { readLoginChallenge } from "@/lib/admin/session";

export const metadata: Metadata = { title: "Enter your code" };

// Reached only after a correct password (which leaves a short-lived challenge cookie).
export default async function VerifyLoginPage() {
  if (!(await readLoginChallenge())) redirect("/admin/login?expired=1");

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <Card padding="lg">
          <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink">Enter your code</h1>
          <p className="mt-1 mb-5 text-sm text-ink-muted">Two-factor login keeps the research safe even if a password leaks.</p>
          <VerifyCodeForm />
          <p className="mt-4 text-center text-sm">
            <Link href="/admin/login" className="font-medium text-primary hover:underline">
              Start over
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
}
