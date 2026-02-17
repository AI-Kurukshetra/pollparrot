"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";
import { forgotPassword } from "@/actions/auth";
import { Button, Input } from "@/components/ui";
import type { FormState } from "@/types";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState<FormState | null, FormData>(
    forgotPassword,
    null
  );

  if (state?.success) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
          <Mail className="h-8 w-8 text-success" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Check your email</h3>
          <p className="mt-2 text-text-secondary">
            {state.message || "We've sent a password reset link to your email address."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state?.message && !state.success && (
        <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
          {state.message}
        </div>
      )}

      <Input
        name="email"
        type="email"
        label="Email"
        placeholder="you@example.com"
        leftIcon={<Mail className="h-4 w-4" />}
        error={state?.errors?.email?.[0]}
        required
      />

      <Button type="submit" fullWidth isLoading={isPending}>
        Send reset link
      </Button>
    </form>
  );
}
