"use client";

import Link from "next/link";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui";
import { OAuthButtons, LoginForm } from "@/components/auth";
import { APP_ROUTES } from "@/lib/constants";

export default function LoginPage() {
  return (
    <Card padding="lg" className="w-full max-w-md">
      <CardHeader
        title="Welcome back"
        description="Sign in to your account to continue"
      />

      <CardBody>
        <OAuthButtons />
        <LoginForm />
      </CardBody>

      <CardFooter>
        <p className="text-center text-sm text-text-muted">
          Don&apos;t have an account?{" "}
          <Link
            href={APP_ROUTES.signup}
            className="text-primary hover:text-primary-light transition-colors font-medium"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
