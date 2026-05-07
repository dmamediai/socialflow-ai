"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useUser } from "@/hooks/use-user";
import { useUsage } from "@/hooks/use-usage";
import { toast } from "sonner";
import {
  Crown, Check, Sparkles, CalendarDays, Zap, CreditCard,
  Loader2, ArrowRight, Shield, RefreshCw
} from "lucide-react";
import { PLAN_LIMITS, formatDate } from "@/lib/utils";

const FREE_FEATURES = [
  "10 AI content generations/month",
  "5 scheduled posts",
  "1 social account",
  "Basic analytics",
  "Media library (100MB)",
];

const PRO_FEATURES = [
  "Unlimited AI content generations",
  "Unlimited scheduled posts",
  "Unlimited social accounts",
  "Advanced analytics",
  "Media library (10GB)",
  "Priority support",
  "API access",
  "Custom tone profiles",
];

export default function BillingPage() {
  const { user, subscription } = useUser();
  const { usage } = useUsage(user?.id, subscription?.plan ?? "free");
  const [loading, setLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);

  const isPro = subscription?.plan === "pro";
  const limits = PLAN_LIMITS[subscription?.plan ?? "free"];

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.error(data.error ?? "Failed to start checkout");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else toast.error(data.error ?? "Failed to open portal");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      <div>
        <h2 className="text-xl font-bold">Billing & Plans</h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Manage your subscription and usage
        </p>
      </div>

      {/* Current plan */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">Current Plan</CardTitle>
              <CardDescription>Your active subscription details</CardDescription>
            </div>
            <Badge
              className={`text-sm px-3 py-1 ${
                isPro
                  ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-0"
                  : "bg-secondary text-secondary-foreground"
              }`}
            >
              {isPro ? <><Crown className="h-3.5 w-3.5 mr-1" />Pro</> : "Free"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isPro && subscription?.current_period_end && (
            <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-muted/50">
              <span className="text-muted-foreground">Next billing date</span>
              <span className="font-medium">{formatDate(subscription.current_period_end)}</span>
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5" /> AI Generations
                </span>
                <span className="font-medium">
                  {usage?.ai_generations_count ?? 0} / {isPro ? "Unlimited" : limits.aiGenerations}
                </span>
              </div>
              {!isPro && (
                <Progress
                  value={Math.min(100, ((usage?.ai_generations_count ?? 0) / limits.aiGenerations) * 100)}
                  className="h-2"
                />
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" /> Scheduled Posts
                </span>
                <span className="font-medium">
                  {usage?.scheduled_posts_count ?? 0} / {isPro ? "Unlimited" : limits.scheduledPosts}
                </span>
              </div>
              {!isPro && (
                <Progress
                  value={Math.min(100, ((usage?.scheduled_posts_count ?? 0) / limits.scheduledPosts) * 100)}
                  className="h-2"
                />
              )}
            </div>
          </div>

          {isPro && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handlePortal}
              disabled={portalLoading}
            >
              {portalLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CreditCard className="h-3.5 w-3.5" />}
              Manage Billing
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Plan comparison */}
      {!isPro && (
        <div className="grid sm:grid-cols-2 gap-4">
          {/* Free plan */}
          <Card className="border">
            <CardContent className="p-6">
              <div className="mb-4">
                <p className="font-semibold">Free</p>
                <p className="text-3xl font-bold mt-1">$0<span className="text-base font-normal text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground mt-1">Perfect for getting started</p>
              </div>
              <Separator className="mb-4" />
              <ul className="space-y-2.5">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-muted-foreground shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full mt-5" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Pro plan */}
          <Card className="border-primary shadow-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 gradient-bg" />
            <CardContent className="p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">Pro</p>
                  <Badge className="text-xs bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-0">
                    Most Popular
                  </Badge>
                </div>
                <p className="text-3xl font-bold mt-1">$29<span className="text-base font-normal text-muted-foreground">/mo</span></p>
                <p className="text-xs text-muted-foreground mt-1">For serious creators & businesses</p>
              </div>
              <Separator className="mb-4" />
              <ul className="space-y-2.5">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full mt-5 gap-2"
                variant="gradient"
                onClick={handleUpgrade}
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Processing...</>
                ) : (
                  <><Crown className="h-4 w-4" /> Upgrade to Pro <ArrowRight className="h-4 w-4" /></>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trust badges */}
      <div className="flex flex-wrap items-center justify-center gap-6 py-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Shield className="h-4 w-4" />
          <span>Secure payments via Stripe</span>
        </div>
        <div className="flex items-center gap-1.5">
          <RefreshCw className="h-4 w-4" />
          <span>Cancel anytime</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="h-4 w-4" />
          <span>Instant access</span>
        </div>
      </div>
    </div>
  );
}
