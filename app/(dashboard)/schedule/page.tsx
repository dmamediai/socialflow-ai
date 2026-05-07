"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Plus, CalendarDays, Loader2, Trash2, Edit3, Clock,
  AlertCircle, CheckCircle2, FileText
} from "lucide-react";
import { InstagramIcon, FacebookIcon, LinkedinIcon, TwitterXIcon } from "@/components/ui/social-icons";
import type { Post, Platform, PostStatus } from "@/types";
import { formatDateTime, getStatusColor } from "@/lib/utils";

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  instagram: <InstagramIcon className="h-3.5 w-3.5" />,
  facebook: <FacebookIcon className="h-3.5 w-3.5" />,
  linkedin: <LinkedinIcon className="h-3.5 w-3.5" />,
  twitter: <TwitterXIcon className="h-3.5 w-3.5" />,
};

const STATUS_TABS: { value: string; label: string }[] = [
  { value: "all", label: "All Posts" },
  { value: "scheduled", label: "Scheduled" },
  { value: "draft", label: "Drafts" },
  { value: "published", label: "Published" },
];

interface CreatePostForm {
  content: string;
  platform: Platform;
  scheduledAt: string;
  status: PostStatus;
}

export default function SchedulePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [form, setForm] = useState<CreatePostForm>({
    content: "",
    platform: "instagram",
    scheduledAt: "",
    status: "draft",
  });

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    const supabase = createClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    setPosts((data ?? []) as Post[]);
    setLoading(false);
  }

  async function createPost() {
    if (!form.content.trim()) {
      toast.error("Please add some content");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Not authenticated");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("posts").insert({
      user_id: user.id,
      content: form.content,
      platform: form.platform,
      scheduled_at: form.scheduledAt || null,
      status: form.scheduledAt ? "scheduled" : "draft",
    });

    if (error) {
      console.error("Create post error:", error.message, error.code, error.details, error.hint);
      toast.error(`Failed to create post: ${error.message || error.code || "Unknown error"}`);
    } else {
      toast.success(form.scheduledAt ? "Post scheduled!" : "Draft saved!");
      setDialogOpen(false);
      setForm({ content: "", platform: "instagram", scheduledAt: "", status: "draft" });
      loadPosts();
    }
    setSaving(false);
  }

  async function deletePost(id: string) {
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete post");
    } else {
      toast.success("Post deleted");
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
    setDeletingId(null);
  }

  const filteredPosts = posts.filter((p) =>
    activeTab === "all" ? true : p.status === activeTab
  );

  const counts = {
    all: posts.length,
    scheduled: posts.filter((p) => p.status === "scheduled").length,
    draft: posts.filter((p) => p.status === "draft").length,
    published: posts.filter((p) => p.status === "published").length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Post Scheduler</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Manage and schedule your social media posts
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)} variant="gradient" className="gap-2">
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-auto p-1">
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5 text-xs">
              {tab.label}
              <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">
                {counts[tab.value as keyof typeof counts]}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <div className="grid gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <CalendarDays className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="font-semibold">No posts yet</p>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  {activeTab === "all"
                    ? "Create your first post to get started"
                    : `No ${activeTab} posts found`}
                </p>
                <Button onClick={() => setDialogOpen(true)} variant="outline" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create post
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredPosts.map((post) => (
                <Card key={post.id} className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-muted shrink-0">
                        {PLATFORM_ICONS[post.platform]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-2">{post.content}</p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className="text-xs py-0 px-1.5 capitalize">
                            {post.platform}
                          </Badge>
                          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(post.status)}`}>
                            {post.status === "published" && <CheckCircle2 className="h-3 w-3" />}
                            {post.status === "failed" && <AlertCircle className="h-3 w-3" />}
                            {post.status === "scheduled" && <Clock className="h-3 w-3" />}
                            {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
                          </span>
                          {post.scheduled_at && (
                            <span className="text-xs text-muted-foreground">
                              {formatDateTime(post.scheduled_at)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => deletePost(post.id)}
                          disabled={deletingId === post.id}
                        >
                          {deletingId === post.id
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <Trash2 className="h-3.5 w-3.5" />
                          }
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create post dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                placeholder="Write your post content..."
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="h-32"
              />
              <p className="text-xs text-muted-foreground text-right">
                {form.content.length} chars
              </p>
            </div>

            <div className="space-y-2">
              <Label>Platform</Label>
              <Select value={form.platform} onValueChange={(v) => setForm({ ...form, platform: v as Platform })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="linkedin">LinkedIn</SelectItem>
                  <SelectItem value="twitter">X / Twitter</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Schedule Date & Time (optional)</Label>
              <Input
                type="datetime-local"
                value={form.scheduledAt}
                onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })}
                min={new Date().toISOString().slice(0, 16)}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to save as draft
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={createPost} disabled={saving} variant="gradient">
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : (
                form.scheduledAt ? <><CalendarDays className="h-4 w-4" /> Schedule</> : <><FileText className="h-4 w-4" /> Save Draft</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
