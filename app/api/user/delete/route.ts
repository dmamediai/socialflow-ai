import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const adminClient = await createAdminClient();

    // Delete storage files
    const { data: mediaItems } = await supabase
      .from("media_library")
      .select("storage_path")
      .eq("user_id", user.id);

    if (mediaItems?.length) {
      await supabase.storage.from("media").remove(mediaItems.map((m) => m.storage_path));
    }

    // Delete auth user (cascades to all tables via RLS)
    await adminClient.auth.admin.deleteUser(user.id);

    await supabase.auth.signOut();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
