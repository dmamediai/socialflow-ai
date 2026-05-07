import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateContent } from "@/services/ai";
import { z } from "zod";

const schema = z.object({
  topic: z.string().min(3).max(500),
  platform: z.enum(["instagram", "facebook", "linkedin", "twitter"]),
  tone: z.enum(["professional", "funny", "luxury", "minimal", "genz"]),
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { topic, platform, tone } = parsed.data;

    // Check usage limits
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const [usageResult, subResult] = await Promise.all([
      supabase
        .from("usage_tracking")
        .select("*")
        .eq("user_id", user.id)
        .eq("period_start", periodStart)
        .single(),
      supabase
        .from("subscriptions")
        .select("plan")
        .eq("user_id", user.id)
        .single(),
    ]);

    const plan = subResult.data?.plan ?? "free";
    const currentUsage = usageResult.data?.ai_generations_count ?? 0;
    const limit = plan === "pro" ? Infinity : 10;

    if (currentUsage >= limit) {
      return NextResponse.json(
        { error: "Monthly AI generation limit reached. Upgrade to Pro for unlimited generations." },
        { status: 429 }
      );
    }

    // Generate content
    const content = await generateContent(topic, platform, tone);

    // Save generation to DB
    const [generationResult] = await Promise.all([
      supabase.from("ai_generations").insert({
        user_id: user.id,
        topic,
        platform,
        tone,
        caption: content.caption,
        hooks: content.hooks,
        hashtags: content.hashtags,
        cta: content.cta,
      }),
      // Increment usage counter
      supabase.rpc("increment_ai_usage", { p_user_id: user.id }),
    ]);

    return NextResponse.json({ content });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("AI generation error:", message);
    return NextResponse.json(
      { error: message || "Failed to generate content. Please try again." },
      { status: 500 }
    );
  }
}
