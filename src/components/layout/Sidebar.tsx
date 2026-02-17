"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FileText, Copy, User, LogOut, X } from "lucide-react";
import { Logo } from "./Logo";
import { signOut } from "@/actions/auth";
import { APP_ROUTES } from "@/lib/constants";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: APP_ROUTES.dashboard, icon: LayoutDashboard, label: "Dashboard" },
  { href: APP_ROUTES.surveys.list, icon: FileText, label: "My Surveys" },
  { href: APP_ROUTES.templates, icon: Copy, label: "Templates" },
  { href: APP_ROUTES.account, icon: User, label: "Account" },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActivePath = (href: string) => {
    if (href === APP_ROUTES.dashboard) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64
          bg-[#FAFAFA] border-r border-gray-200
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo Area */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white">
          <Logo size="md" />
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = isActivePath(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#FFF5F0] text-[#FF6B35]"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }
                `}
              >
                <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-[#FF6B35]" : ""}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
