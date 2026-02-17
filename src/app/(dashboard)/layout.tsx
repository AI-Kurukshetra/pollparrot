"use client";

import { useState } from "react";
import { Sidebar, DashboardHeader } from "@/components/layout";
import { ToastContainer } from "@/components/ui";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar - Fixed on desktop, overlay on mobile */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area - offset by sidebar width on lg screens */}
        <div className="lg:ml-64 min-h-screen flex flex-col">
          {/* Top Header */}
          <DashboardHeader
            title="Dashboard"
            onMenuClick={() => setIsSidebarOpen(true)}
          />

          {/* Page Content */}
          <main className="flex-1 p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
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
