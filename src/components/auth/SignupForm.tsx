"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";
import { signUp } from "@/actions/auth";
import { Button, Input } from "@/components/ui";
import type { FormState } from "@/types";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState<FormState | null, FormData>(
    signUp,
    null
  );

  return (
    <>
      {state?.success && (
        <div className="mb-4 p-4 rounded-lg bg-success/10 border border-success/20 text-success text-sm">
          <p className="font-medium">Check your email!</p>
          <p className="mt-1 text-success/80">{state.message}</p>
        </div>
      )}

      {state?.message && !state.success && (
        <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <Input
          name="fullName"
          type="text"
          label="Full Name"
          placeholder="John Doe"
          leftIcon={<User className="h-4 w-4" />}
          error={state?.errors?.fullName?.[0]}
        />

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
          placeholder="Create a password"
          leftIcon={<Lock className="h-4 w-4" />}
          hint="Must be at least 8 characters with uppercase, lowercase, and number"
          error={state?.errors?.password?.[0]}
          required
        />

        <Input
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="Confirm your password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={state?.errors?.confirmPassword?.[0]}
          required
        />

        <Button type="submit" fullWidth isLoading={isPending}>
          Create account
        </Button>
      </form>

      <p className="mt-4 text-xs text-text-muted text-center">
        By signing up, you agree to our{" "}
        <Link href="/terms" className="text-primary hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-primary hover:underline">
          Privacy Policy
        </Link>
      </p>
    </>
  );
}
