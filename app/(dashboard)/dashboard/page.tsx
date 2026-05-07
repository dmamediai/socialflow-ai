import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3, Sparkles, CalendarDays, CheckCircle2,
  Clock, AlertCircle, Plus, ArrowRight, FileText, Crown
} from "lucide-react";
import Link from "next/link";
import { formatDateTime, getStatusColor, PLAN_LIMITS } from "@/lib/utils";
import type { Post } from "@/types";

async function getDashboardData(userId: string) {
  const supabase = await createClient();
  const now = new Date();
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const [postsResult, usageResult, subResult] = await Promise.all([
    supabase
      .from("posts")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("usage_tracking")
      .select("*")
      .eq("user_id", userId)
      .eq("period_start", periodStart)
      .single(),
    supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single(),
  ]);

  return {
    posts: (postsResult.data ?? []) as Post[],
    usage: usageResult.data,
    subscription: subResult.data,
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { posts, usage, subscription } = await getDashboardData(user.id);

  const plan = (subscription?.plan ?? "free") as "free" | "pro";
  const limits = PLAN_LIMITS[plan];
  const isPro = plan === "pro";

  const totalPosts = posts.length;
  const scheduledPosts = posts.filter((p) => p.status === "scheduled").length;
  const publishedPosts = posts.filter((p) => p.status === "published").length;
  const aiCount = usage?.ai_generations_count ?? 0;
  const scheduledCount = usage?.scheduled_posts_count ?? 0;

  const recentPosts = posts.slice(0, 5);
  const upcomingPosts = posts
    .filter((p) => p.status === "scheduled" && p.scheduled_at)
    .sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Good morning! 👋</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Here&apos;s what&apos;s happening with your social media today.
          </p>
        </div>
        <Link href="/create">
          <Button variant="gradient" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Create with AI
          </Button>
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Posts"
          value={totalPosts}
          description="All time"
          icon={FileText}
          iconColor="text-violet-600"
        />
        <StatsCard
          title="Scheduled"
          value={scheduledPosts}
          description="Upcoming"
          icon={CalendarDays}
          iconColor="text-blue-600"
        />
        <StatsCard
          title="Published"
          value={publishedPosts}
          description="This month"
          icon={CheckCircle2}
          iconColor="text-green-600"
        />
        <StatsCard
          title="AI Generations"
          value={aiCount}
          description="This month"
          icon={Sparkles}
          iconColor="text-orange-500"
        />
      </div>

      {/* Usage + Upcoming */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Usage */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Monthly Usage</CardTitle>
              {!isPro && (
                <Link href="/billing">
                  <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-0 gap-1 cursor-pointer hover:bg-violet-200 transition-colors">
                    <Crown className="h-3 w-3" /> Upgrade
                  </Badge>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">AI Generations</span>
                <span className="font-medium">
                  {aiCount} / {isPro ? "∞" : limits.aiGenerations}
                </span>
              </div>
              <Progress
                value={isPro ? 0 : Math.min(100, (aiCount / limits.aiGenerations) * 100)}
                className="h-1.5"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Scheduled Posts</span>
                <span className="font-medium">
                  {scheduledCount} / {isPro ? "∞" : limits.scheduledPosts}
                </span>
              </div>
              <Progress
                value={isPro ? 0 : Math.min(100, (scheduledCount / limits.scheduledPosts) * 100)}
                className="h-1.5"
              />
            </div>

            {!isPro && (
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground mb-2">
                  Resets on the 1st of next month
                </p>
                <Link href="/billing" className="block">
                  <Button variant="outline" size="sm" className="w-full text-xs h-8">
                    <BarChart3 className="h-3.5 w-3.5" />
                    View plans
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming posts */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Upcoming Posts</CardTitle>
              <Link href="/schedule">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  View all <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CalendarDays className="h-10 w-10 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium">No upcoming posts</p>
                <p className="text-xs text-muted-foreground mt-1 mb-4">
                  Schedule your first post to get started
                </p>
                <Link href="/schedule">
                  <Button size="sm" variant="outline" className="gap-2">
                    <Plus className="h-3.5 w-3.5" />
                    Schedule post
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingPosts.map((post) => (
                  <div key={post.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Clock className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{post.content.slice(0, 80)}...</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs py-0 px-1.5 capitalize">
                          {post.platform}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {post.scheduled_at ? formatDateTime(post.scheduled_at) : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent posts */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Posts</CardTitle>
            <Link href="/schedule">
              <Button variant="ghost" size="sm" className="text-xs gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {recentPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Sparkles className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium">No posts yet</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Generate AI content and start scheduling your social media posts.
              </p>
              <Link href="/create">
                <Button size="sm" variant="gradient" className="gap-2">
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate first post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-3 font-medium text-muted-foreground text-xs">Content</th>
                    <th className="text-left pb-3 font-medium text-muted-foreground text-xs hidden sm:table-cell">Platform</th>
                    <th className="text-left pb-3 font-medium text-muted-foreground text-xs hidden md:table-cell">Date</th>
                    <th className="text-left pb-3 font-medium text-muted-foreground text-xs">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 pr-4">
                        <p className="truncate max-w-[200px] lg:max-w-xs">{post.content}</p>
                      </td>
                      <td className="py-3 pr-4 hidden sm:table-cell">
                        <Badge variant="outline" className="text-xs py-0 px-1.5 capitalize">
                          {post.platform}
                        </Badge>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground text-xs hidden md:table-cell">
                        {post.scheduled_at ? formatDateTime(post.scheduled_at) : formatDateTime(post.created_at)}
                      </td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(post.status)}`}>
                          {post.status === "failed" && <AlertCircle className="h-3 w-3" />}
                          {post.status === "published" && <CheckCircle2 className="h-3 w-3" />}
                          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
