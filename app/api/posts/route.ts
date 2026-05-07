import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const createPostSchema = z.object({
  content: z.string().min(1).max(5000),
  platform: z.enum(["instagram", "facebook", "linkedin", "twitter"]),
  status: z.enum(["draft", "scheduled"]).optional().default("draft"),
  scheduled_at: z.string().optional().nullable(),
  media_urls: z.array(z.string()).optional().default([]),
  social_account_id: z.string().uuid().optional().nullable(),
});

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const platform = searchParams.get("platform");

  let query = supabase
    .from("posts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (status) query = query.eq("status", status);
  if (platform) query = query.eq("platform", platform);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ posts: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = createPostSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const postData = {
    ...parsed.data,
    user_id: user.id,
    status: parsed.data.scheduled_at ? "scheduled" : parsed.data.status,
  };

  // Check scheduling limits for free plan
  if (postData.status === "scheduled") {
    const [subResult, usageResult] = await Promise.all([
      supabase.from("subscriptions").select("plan").eq("user_id", user.id).single(),
      supabase.from("usage_tracking").select("scheduled_posts_count")
        .eq("user_id", user.id)
        .gte("period_end", new Date().toISOString())
        .single(),
    ]);

    const plan = subResult.data?.plan ?? "free";
    if (plan === "free") {
      const count = usageResult.data?.scheduled_posts_count ?? 0;
      if (count >= 5) {
        return NextResponse.json(
          { error: "Monthly scheduled posts limit reached. Upgrade to Pro for unlimited scheduling." },
          { status: 429 }
        );
      }
    }
  }

  const { data, error } = await supabase.from("posts").insert(postData).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Update usage if scheduling
  if (postData.status === "scheduled") {
    await supabase.rpc("increment_posts_usage", { p_user_id: user.id });
  }

  return NextResponse.json({ post: data }, { status: 201 });
}
