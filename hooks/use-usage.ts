"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { UsageTracking } from "@/types";
import { PLAN_LIMITS } from "@/lib/utils";

export function useUsage(userId?: string, plan: "free" | "pro" = "free") {
  const [usage, setUsage] = useState<UsageTracking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();

    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    supabase
      .from("usage_tracking")
      .select("*")
      .eq("user_id", userId)
      .eq("period_start", periodStart)
      .single()
      .then(({ data }) => {
        setUsage(data);
        setLoading(false);
      });
  }, [userId]);

  const limits = PLAN_LIMITS[plan];

  const aiUsagePercent = limits.aiGenerations === Infinity
    ? 0
    : Math.min(100, ((usage?.ai_generations_count ?? 0) / limits.aiGenerations) * 100);

  const postsUsagePercent = limits.scheduledPosts === Infinity
    ? 0
    : Math.min(100, ((usage?.scheduled_posts_count ?? 0) / limits.scheduledPosts) * 100);

  const canGenerateAI = limits.aiGenerations === Infinity
    || (usage?.ai_generations_count ?? 0) < limits.aiGenerations;

  const canSchedulePost = limits.scheduledPosts === Infinity
    || (usage?.scheduled_posts_count ?? 0) < limits.scheduledPosts;

  return {
    usage,
    loading,
    limits,
    aiUsagePercent,
    postsUsagePercent,
    canGenerateAI,
    canSchedulePost,
  };
}
