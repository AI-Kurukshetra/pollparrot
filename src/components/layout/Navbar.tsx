"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui";
import { useUser } from "@/hooks/useUser";
import { APP_ROUTES } from "@/lib/constants";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/templates", label: "Templates" },
];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, isLoading } = useUser();

  // Set mounted after hydration to prevent mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const isActivePath = (href: string) => {
    if (href.startsWith("/#")) return false;
    return pathname === href;
  };

  // Render auth buttons based on state
  const renderAuthButtons = (mobile = false) => {
    // Before hydration, render nothing to avoid mismatch
    if (!mounted) {
      return mobile ? (
        <div className="h-10 animate-pulse rounded-lg bg-background-light" />
      ) : (
        <div className="h-9 w-20 animate-pulse rounded-lg bg-background-light" />
      );
    }

    // After hydration, show loading state while checking auth
    if (isLoading) {
      return mobile ? (
        <div className="h-10 animate-pulse rounded-lg bg-background-light" />
      ) : (
        <div className="h-9 w-20 animate-pulse rounded-lg bg-background-light" />
      );
    }

    // User is authenticated
    if (user) {
      return (
        <Link href={APP_ROUTES.dashboard}>
          <Button fullWidth={mobile}>Dashboard</Button>
        </Link>
      );
    }

    // User is not authenticated
    if (mobile) {
      return (
        <div className="space-y-2">
          <Link href={APP_ROUTES.login}>
            <Button variant="outline" fullWidth>Log in</Button>
          </Link>
          <Link href={APP_ROUTES.signup}>
            <Button fullWidth>Sign up</Button>
          </Link>
        </div>
      );
    }

    return (
      <>
        <Link href={APP_ROUTES.login}>
          <Button variant="ghost">Log in</Button>
        </Link>
        <Link href={APP_ROUTES.signup}>
          <Button>Sign up</Button>
        </Link>
      </>
    );
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Logo size="md" />

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActivePath(link.href) ? "text-primary" : "text-text-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:gap-3">
            {renderAuthButtons(false)}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-background-light transition-colors"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActivePath(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-background-light hover:text-text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-gray-200" />
            {renderAuthButtons(true)}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
