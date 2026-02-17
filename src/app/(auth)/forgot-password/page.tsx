"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui";
import { ForgotPasswordForm } from "@/components/auth";
import { APP_ROUTES } from "@/lib/constants";

export default function ForgotPasswordPage() {
  return (
    <Card padding="lg" className="w-full max-w-md">
      <CardHeader
        title="Forgot your password?"
        description="Enter your email and we'll send you a reset link"
      />

      <CardBody>
        <ForgotPasswordForm />
      </CardBody>

      <CardFooter>
        <Link
          href={APP_ROUTES.login}
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </CardFooter>
    </Card>
  );
}
