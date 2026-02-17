"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { signIn } from "@/actions/auth";
import { Button, Input } from "@/components/ui";
import { APP_ROUTES } from "@/lib/constants";
import type { FormState } from "@/types";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState<FormState | null, FormData>(
    signIn,
    null
  );

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

      <Input
        name="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        leftIcon={<Lock className="h-4 w-4" />}
        error={state?.errors?.password?.[0]}
        required
      />

      <div className="flex items-center justify-end">
        <Link
          href={APP_ROUTES.forgotPassword}
          className="text-sm text-primary hover:text-primary-light transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" fullWidth isLoading={isPending}>
        Sign in
      </Button>
    </form>
  );
}
