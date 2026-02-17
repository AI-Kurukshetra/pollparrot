"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui";
import { ResetPasswordForm } from "@/components/auth";
import { APP_ROUTES } from "@/lib/constants";

export default function ResetPasswordPage() {
  return (
    <Card padding="lg" className="w-full max-w-md">
      <CardHeader
        title="Reset your password"
        description="Enter your new password below"
      />

      <CardBody>
        <ResetPasswordForm />
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
