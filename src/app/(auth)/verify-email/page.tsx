"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card, CardBody, Button, Spinner } from "@/components/ui";
import { APP_ROUTES } from "@/lib/constants";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [countdown, setCountdown] = useState(5);

  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

  useEffect(() => {
    if (error) {
      setStatus("error");
    } else {
      // Email verified successfully via Supabase callback
      setStatus("success");
    }
  }, [error]);

  useEffect(() => {
    if (status === "success") {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push(APP_ROUTES.dashboard);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status, router]);

  return (
    <>
      {status === "loading" && (
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Verifying your email...
            </h3>
            <p className="mt-2 text-text-secondary">Please wait a moment.</p>
          </div>
        </div>
      )}

      {status === "success" && (
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Email verified!
            </h3>
            <p className="mt-2 text-text-secondary">
              Your email has been verified successfully. Redirecting to
              dashboard in {countdown} seconds...
            </p>
          </div>
          <Link href={APP_ROUTES.dashboard}>
            <Button fullWidth>Go to Dashboard</Button>
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-error/10 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-error" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              Verification failed
            </h3>
            <p className="mt-2 text-text-secondary">
              {errorDescription || "The verification link may have expired or is invalid."}
            </p>
          </div>
          <div className="space-y-2">
            <Link href={APP_ROUTES.signup}>
              <Button fullWidth>Try signing up again</Button>
            </Link>
            <Link href={APP_ROUTES.login}>
              <Button variant="ghost" fullWidth>
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

function VerifyEmailFallback() {
  return (
    <div className="text-center space-y-4">
      <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-text-primary">Loading...</h3>
        <p className="mt-2 text-text-secondary">Please wait a moment.</p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Card padding="lg" className="w-full max-w-md">
      <CardBody>
        <Suspense fallback={<VerifyEmailFallback />}>
          <VerifyEmailContent />
        </Suspense>
      </CardBody>
    </Card>
  );
}
