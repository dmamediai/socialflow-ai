"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { useUser } from "@/hooks/use-user";
import { cn } from "@/lib/utils";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/create": "AI Content Generator",
  "/schedule": "Post Scheduler",
  "/media": "Media Library",
  "/accounts": "Social Accounts",
  "/api-access": "API Access",
  "/billing": "Billing & Plans",
  "/settings": "Settings",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { profile, subscription } = useUser();

  const title = PAGE_TITLES[pathname] ?? "SocialFlow AI";

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-60 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar profile={profile} subscription={subscription} />
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
