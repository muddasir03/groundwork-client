"use client";

import { useState, useTransition } from "react";
import { confirmTwoFactor, regenerateRecoveryCodes, startTwoFactorSetup } from "@/app/admin/actions";
import { SectionTitle } from "@/components/layout/Page";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/Field";
import type { TwoFactorStatus } from "@/lib/admin/types";
import { formatResearchDate } from "@/lib/format";

/** "ABCD EFGH IJKL MNOP": easier to type into an app by hand. */
const groupSecret = (secret: string) => secret.match(/.{1,4}/g)?.join(" ") ?? secret;

/** Recovery codes, shown once, with the one instruction that matters: save them now. */
export function RecoveryCodes({ codes }: { codes: string[] }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <p className="text-sm text-ink">
        <strong className="font-semibold">Save these recovery codes now.</strong> Each one logs you in once if you lose your phone. They won&apos;t be shown again.
      </p>
      <ul aria-label="Recovery codes" className="mt-3 grid grid-cols-2 gap-2 rounded-lg bg-fill p-4 font-mono text-sm text-ink sm:grid-cols-5">
        {codes.map((code) => (
          <li key={code}>{code}</li>
        ))}
      </ul>
      <Button
        size="sm"
        variant="secondary"
        className="mt-3"
        onClick={async () => {
          await navigator.clipboard.writeText(codes.join("\n")).catch(() => undefined);
          setCopied(true);
        }}
      >
        {copied ? "Copied" : "Copy codes"}
      </Button>
    </div>
  );
}

type Step = { name: "intro" } | { name: "scan"; qrCodeDataUri: string; secret: string } | { name: "done"; recoveryCodes: string[] };

/** First-time setup: start → scan the QR code and enter a code → save the recovery codes. */
export function TwoFactorSetup() {
  const [step, setStep] = useState<Step>({ name: "intro" });
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [pending, startTransition] = useTransition();

  const start = () =>
    startTransition(async () => {
      const result = await startTwoFactorSetup();
      setError(result.ok ? null : result.message);
      if (result.ok) setStep({ name: "scan", qrCodeDataUri: result.qrCodeDataUri, secret: result.secret });
    });

  const confirm = () =>
    startTransition(async () => {
      const result = await confirmTwoFactor(code);
      setError(result.ok ? null : result.message);
      if (result.ok) setStep({ name: "done", recoveryCodes: result.recoveryCodes });
    });

  return (
    <Card as="section" padding="lg" className="max-w-2xl">
      <SectionTitle>Set up two-factor login</SectionTitle>
      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-warning-soft px-3 py-2 text-sm text-warning">
          {error}
        </p>
      )}

      {step.name === "intro" && (
        <>
          <p className="mt-2 text-sm text-ink-muted">
            Admin accounts need a code from an authenticator app (such as Google Authenticator, 1Password or Authy) as well as the password. It takes
            about a minute.
          </p>
          <Button className="mt-5" onClick={start} disabled={pending}>
            {pending ? "Preparing…" : "Start setup"}
          </Button>
        </>
      )}

      {step.name === "scan" && (
        <div className="mt-4 grid gap-6 sm:grid-cols-[auto_1fr] sm:items-start">
          {/* An <img> with a data: URI can't run scripts, unlike inline SVG. */}
          {/* eslint-disable-next-line @next/next/no-img-element -- a data: URI, so next/image adds nothing */}
          <img src={step.qrCodeDataUri} alt="QR code to add Groundwork to your authenticator app" width={200} height={200} className="rounded-lg border border-line bg-white p-2" />
          <div className="space-y-4">
            <p className="text-sm text-ink">1. Scan the QR code with your authenticator app.</p>
            <p className="text-sm text-ink-muted">
              Can&apos;t scan? Enter this key instead: <code className="font-mono text-ink">{groupSecret(step.secret)}</code>
            </p>
            <TextField
              label="2. Enter the 6-digit code it shows"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
            />
            <Button onClick={confirm} disabled={pending || code.trim().length !== 6}>
              {pending ? "Checking…" : "Turn on two-factor login"}
            </Button>
          </div>
        </div>
      )}

      {step.name === "done" && (
        <div className="mt-4 space-y-5">
          <p role="status" className="rounded-lg bg-success-soft px-3 py-2 text-sm font-medium text-success">
            Two-factor login is on. Any other sessions on this account were logged out.
          </p>
          <RecoveryCodes codes={step.recoveryCodes} />
          <ButtonLink href="/admin">I&apos;ve saved them, continue</ButtonLink>
        </div>
      )}
    </Card>
  );
}

/** After setup: status, and new recovery codes when needed. */
export function TwoFactorManage({ status }: { status: TwoFactorStatus }) {
  const [code, setCode] = useState("");
  const [codes, setCodes] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const regenerate = () =>
    startTransition(async () => {
      const result = await regenerateRecoveryCodes(code);
      setError(result.ok ? null : result.message);
      if (result.ok) {
        setCodes(result.recoveryCodes);
        setCode("");
      }
    });

  return (
    <Card as="section" padding="lg" className="max-w-2xl">
      <SectionTitle>Two-factor login</SectionTitle>
      <p className="mt-2 text-sm text-ink">
        On since <time dateTime={status.enabledAt ?? undefined}>{status.enabledAt ? formatResearchDate(status.enabledAt) : "—"}</time>.{" "}
        {status.remainingRecoveryCodes} of 10 recovery codes left.
      </p>
      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-warning-soft px-3 py-2 text-sm text-warning">
          {error}
        </p>
      )}
      {codes ? (
        <div className="mt-5">
          <RecoveryCodes codes={codes} />
        </div>
      ) : (
        <div className="mt-5 max-w-sm space-y-3">
          <p className="text-sm text-ink-muted">Used some recovery codes, or think they were seen? Replace them all with new ones.</p>
          <TextField label="Current 6-digit code" value={code} onChange={(e) => setCode(e.target.value)} inputMode="numeric" autoComplete="one-time-code" maxLength={6} />
          <Button variant="secondary" onClick={regenerate} disabled={pending || code.trim().length !== 6}>
            {pending ? "Creating…" : "Create new recovery codes"}
          </Button>
        </div>
      )}
    </Card>
  );
}
