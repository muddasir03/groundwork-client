"use client";

import { useActionState, useState } from "react";
import { verifyCode } from "@/app/admin/actions";
import { FormMessage } from "@/components/admin/FormMessage";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";

/** The second login step: a code from the authenticator app, or a recovery code. */
export function VerifyCodeForm() {
  const [result, action, pending] = useActionState(verifyCode, null);
  const [recovery, setRecovery] = useState(false);

  return (
    <form action={action} className="space-y-4">
      <FormMessage result={result} />
      <input type="hidden" name="method" value={recovery ? "recovery" : "totp"} />
      {recovery ? (
        <TextField key="recovery" label="Recovery code" name="code" autoComplete="off" required maxLength={11} placeholder="abcde-fghij" hint="Each recovery code works once." />
      ) : (
        <TextField key="totp" label="6-digit code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" required maxLength={6} hint="From your authenticator app." />
      )}
      <Button type="submit" fullWidth size="lg" disabled={pending}>
        {pending ? "Checking…" : "Verify"}
      </Button>
      <Button variant="secondary" fullWidth onClick={() => setRecovery(!recovery)}>
        {recovery ? "Use the authenticator app instead" : "Use a recovery code instead"}
      </Button>
    </form>
  );
}
