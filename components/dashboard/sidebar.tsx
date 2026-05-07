"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Sparkles, CalendarDays, Image, Users,
  CreditCard, Settings, Zap, ChevronRight, LogOut, Crown, KeyRound
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Profile, Subscription } from "@/types";
import { toast } from "sonner";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/create", icon: Sparkles, label: "AI Generator" },
  { href: "/schedule", icon: CalendarDays, label: "Scheduler" },
  { href: "/media", icon: Image, label: "Media Library" },
  { href: "/accounts", icon: Users, label: "Social Accounts" },
];

const BOTTOM_NAV = [
  { href: "/api-access", icon: KeyRound, label: "API Access" },
  { href: "/billing", icon: CreditCard, label: "Billing" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

interface SidebarProps {
  profile: Profile | null;
  subscription: Subscription | null;
}

export function Sidebar({ profile, subscription }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isPro = subscription?.plan === "pro";

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  }

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U";

  return (
    <aside className="flex h-full flex-col bg-sidebar border-r border-sidebar-border">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-4 border-b border-sidebar-border">
        <div className="p-1.5 gradient-bg rounded-lg">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="font-bold text-sm">SocialFlow AI</span>
        {isPro && (
          <Badge className="ml-auto text-xs py-0 px-1.5 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-0">
            Pro
          </Badge>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                active
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
              {active && <ChevronRight className="ml-auto h-3 w-3 opacity-50" />}
            </Link>
          );
        })}

        {/* Upgrade banner for free users */}
        {!isPro && (
          <div className="mx-1 mt-4 p-3 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-200 dark:border-violet-800">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-violet-600" />
              <span className="text-xs font-semibold text-violet-700 dark:text-violet-400">Upgrade to Pro</span>
            </div>
            <p className="text-xs text-muted-foreground mb-2">
              Unlimited AI generations & posts
            </p>
            <Link
              href="/billing"
              className="block text-center text-xs font-medium py-1.5 px-3 rounded-lg gradient-bg text-white hover:opacity-90 transition-opacity"
            >
              Upgrade now
            </Link>
          </div>
        )}
      </nav>

      {/* Bottom nav */}
      <div className="p-2 space-y-0.5 border-t border-sidebar-border">
        {BOTTOM_NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-150",
                active
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-primary"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          );
        })}

        {/* User profile */}
        <div className="flex items-center gap-2.5 px-3 py-2 mt-1">
          <Avatar className="h-7 w-7">
            <AvatarImage src={profile?.avatar_url ?? ""} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{profile?.full_name ?? "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{profile?.email}</p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
