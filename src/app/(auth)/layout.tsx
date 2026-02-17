import Link from "next/link";
import { Logo } from "@/components/layout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Header with Logo */}
      <header className="flex justify-center pt-8 pb-4">
        <Logo size="lg" />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <Link
          href="/"
          className="text-sm text-text-muted hover:text-primary transition-colors"
        >
          &larr; Back to home
        </Link>
      </footer>
    </div>
  );
}
