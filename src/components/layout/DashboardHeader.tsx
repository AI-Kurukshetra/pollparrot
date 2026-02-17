"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Menu, ChevronDown, User, Settings, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui";
import { useUser } from "@/hooks/useUser";
import { signOut } from "@/actions/auth";
import { APP_ROUTES } from "@/lib/constants";

interface DashboardHeaderProps {
  title: string;
  onMenuClick: () => void;
}

export function DashboardHeader({
  title,
  onMenuClick,
}: DashboardHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, profile } = useUser();

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
  };

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Page title - hidden on survey edit pages */}
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* User menu */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-all duration-200"
            >
              <Avatar
                src={profile?.avatar_url}
                name={displayName}
                size="sm"
              />
              <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
                {displayName}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  isUserMenuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {displayName}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <Link
                    href={APP_ROUTES.account}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4 text-gray-400" />
                    Profile
                  </Link>
                  <Link
                    href={`${APP_ROUTES.account}?tab=settings`}
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-4 w-4 text-gray-400" />
                    Settings
                  </Link>
                </div>

                {/* Sign out */}
                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-gray-400" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
