"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { FormMessage } from "@/components/admin/FormMessage";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";

/** Admin login. The password goes straight to a server action; the browser never sees a token. */
export function LoginForm({ expired = false }: { expired?: boolean }) {
  const [result, action, pending] = useActionState(login, null);

  return (
    <form action={action} className="space-y-4">
      {expired && !result && (
        <p role="status" className="rounded-lg bg-primary-soft px-3 py-2 text-sm text-primary">
          Your session ended. Log in again to continue.
        </p>
      )}
      <FormMessage result={result} />
      <TextField label="Email" name="email" type="email" autoComplete="username" required maxLength={254} />
      <TextField label="Password" name="password" type="password" autoComplete="current-password" required maxLength={200} />
      <Button type="submit" fullWidth size="lg" disabled={pending}>
        {pending ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}
