"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Lock, CheckCircle } from "lucide-react";
import { resetPassword } from "@/actions/auth";
import { Button, Input } from "@/components/ui";
import { APP_ROUTES } from "@/lib/constants";
import type { FormState } from "@/types";

export function ResetPasswordForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<FormState | null, FormData>(
    resetPassword,
    null
  );

  useEffect(() => {
    if (state?.success) {
      const timer = setTimeout(() => {
        router.push(APP_ROUTES.login);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  if (state?.success) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-success" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-text-primary">Password updated!</h3>
          <p className="mt-2 text-text-secondary">
            Your password has been reset successfully. Redirecting to login...
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
        name="password"
        type="password"
        label="New Password"
        placeholder="Enter new password"
        leftIcon={<Lock className="h-4 w-4" />}
        hint="Must be at least 8 characters with uppercase, lowercase, and number"
        error={state?.errors?.password?.[0]}
        required
      />

      <Input
        name="confirmPassword"
        type="password"
        label="Confirm New Password"
        placeholder="Confirm new password"
        leftIcon={<Lock className="h-4 w-4" />}
        error={state?.errors?.confirmPassword?.[0]}
        required
      />

      <Button type="submit" fullWidth isLoading={isPending}>
        Reset password
      </Button>
    </form>
  );
}
