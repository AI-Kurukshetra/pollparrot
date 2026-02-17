"use client";

import { useState, useEffect } from "react";
import { Sidebar, DashboardHeader } from "@/components/layout";
import { ToastContainer } from "@/components/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";

const SIDEBAR_WIDTH = 256; // 16rem = 256px (w-64)

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect desktop breakpoint (lg = 1024px)
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen w-full bg-gray-50">
        {/* Sidebar - Fixed on desktop, overlay on mobile */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area - offset by sidebar width on desktop */}
        <div
          className="min-h-screen w-full flex flex-col"
          style={{
            marginLeft: isDesktop ? SIDEBAR_WIDTH : 0,
            width: isDesktop ? `calc(100% - ${SIDEBAR_WIDTH}px)` : '100%'
          }}
        >
          {/* Top Header */}
          <DashboardHeader
            title="Dashboard"
            onMenuClick={() => setIsSidebarOpen(true)}
          />

          {/* Page Content */}
          <main className="flex-1 w-full p-4 md:p-6 lg:p-8 overflow-x-hidden">
            <div className="w-full max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Toast Container */}
        <ToastContainer position="top-right" />
      </div>
    </AuthGuard>
  );
}
