"use client";

import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui";
import { OAuthButtons, SignupForm } from "@/components/auth";
import { APP_ROUTES } from "@/lib/constants";

export default function SignupPage() {
  return (
    <Card padding="lg" className="w-full max-w-md">
      <CardHeader
        title="Create an account"
        description="Start building surveys in minutes"
      />

      <CardBody>
        <OAuthButtons />
        <SignupForm />
      </CardBody>

      <CardFooter>
        <p className="text-center text-sm text-text-muted">
          Already have an account?{" "}
          <Link
            href={APP_ROUTES.login}
            className="text-primary hover:text-primary-light transition-colors font-medium"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
