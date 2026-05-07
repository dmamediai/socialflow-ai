import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import crypto from "crypto";
import { z } from "zod";

function generateApiKey(): string {
  return `sf_live_${crypto.randomBytes(24).toString("hex")}`;
}

function hashKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

const createSchema = z.object({
  name: z.string().min(1).max(100),
});

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("api_keys")
    .select("id, name, key_prefix, last_used_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ keys: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const { data: existing } = await supabase
    .from("api_keys")
    .select("id")
    .eq("user_id", user.id);

  if ((existing?.length ?? 0) >= 10) {
    return NextResponse.json({ error: "Maximum of 10 API keys allowed." }, { status: 400 });
  }

  const rawKey = generateApiKey();
  const keyHash = hashKey(rawKey);
  const keyPrefix = rawKey.slice(0, 16) + "...";

  const { data, error } = await supabase
    .from("api_keys")
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      key_hash: keyHash,
      key_prefix: keyPrefix,
    })
    .select("id, name, key_prefix, created_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ key: data, raw: rawKey }, { status: 201 });
}
