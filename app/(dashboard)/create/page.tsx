"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Sparkles, Copy, RefreshCw, Loader2, Save, Check,
  Hash, Zap, MessageSquare, BookOpen
} from "lucide-react";
import { InstagramIcon, FacebookIcon, LinkedinIcon, TwitterXIcon } from "@/components/ui/social-icons";
import type { Platform, Tone, GeneratedContent } from "@/types";
import { copyToClipboard } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

const PLATFORMS: { value: Platform; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "instagram", label: "Instagram", icon: <InstagramIcon className="h-4 w-4" />, color: "from-purple-500 to-pink-500" },
  { value: "facebook", label: "Facebook", icon: <FacebookIcon className="h-4 w-4" />, color: "from-blue-600 to-blue-700" },
  { value: "linkedin", label: "LinkedIn", icon: <LinkedinIcon className="h-4 w-4" />, color: "from-blue-700 to-blue-800" },
  { value: "twitter", label: "X/Twitter", icon: <TwitterXIcon className="h-4 w-4" />, color: "from-gray-800 to-black" },
];

const TONES: { value: Tone; label: string; emoji: string; desc: string }[] = [
  { value: "professional", label: "Professional", emoji: "💼", desc: "Authoritative & polished" },
  { value: "funny", label: "Funny", emoji: "😄", desc: "Witty & entertaining" },
  { value: "luxury", label: "Luxury", emoji: "✨", desc: "Premium & sophisticated" },
  { value: "minimal", label: "Minimal", emoji: "◻️", desc: "Clean & concise" },
  { value: "genz", label: "Gen Z", emoji: "🔥", desc: "Trendy & relatable" },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const success = await copyToClipboard(text);
    if (success) {
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  );
}

export default function CreatePage() {
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform>("instagram");
  const [tone, setTone] = useState<Tone>("professional");
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [content, setContent] = useState<GeneratedContent | null>(null);
  const [savedCaption, setSavedCaption] = useState<string>("");
  const router = useRouter();

  async function generate(isRegenerate = false) {
    if (!topic.trim()) {
      toast.error("Please enter a topic first");
      return;
    }

    isRegenerate ? setRegenerating(true) : setLoading(true);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, platform, tone }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          toast.error(data.error, {
            action: { label: "Upgrade", onClick: () => router.push("/billing") },
          });
        } else {
          toast.error(data.error ?? "Failed to generate");
        }
        return;
      }

      setContent(data.content);
      toast.success("Content generated!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  }

  async function saveDraft() {
    if (!content) return;
    const caption = savedCaption || content.caption;

    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `${caption}\n\n${content.hashtags.map((h: string) => `#${h}`).join(" ")}`,
        platform,
        status: "draft",
      }),
    });

    if (res.ok) {
      toast.success("Draft saved!", {
        action: { label: "View", onClick: () => router.push("/schedule") },
      });
    } else {
      toast.error("Failed to save draft");
    }
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl">
      <div>
        <h2 className="text-xl font-bold">AI Content Generator</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Generate high-converting social media content in seconds
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="space-y-5">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">What do you want to post about?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or idea</Label>
                <Textarea
                  id="topic"
                  placeholder="e.g. Our new product launch for an ergonomic chair designed for remote workers..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="h-24 resize-none"
                />
              </div>

              {/* Platform selector */}
              <div className="space-y-2">
                <Label>Platform</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p.value}
                      onClick={() => setPlatform(p.value)}
                      className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm transition-all ${
                        platform === p.value
                          ? "border-primary bg-primary/5 text-primary font-medium"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      {p.icon}
                      {p.label}
                      {platform === p.value && <Check className="ml-auto h-3.5 w-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone selector */}
              <div className="space-y-2">
                <Label>Tone</Label>
                <div className="grid grid-cols-1 gap-1.5">
                  {TONES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setTone(t.value)}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border text-sm transition-all text-left ${
                        tone === t.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <span className="text-base">{t.emoji}</span>
                      <div>
                        <p className={`font-medium text-xs ${tone === t.value ? "text-primary" : ""}`}>
                          {t.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{t.desc}</p>
                      </div>
                      {tone === t.value && <Check className="ml-auto h-3.5 w-3.5 text-primary" />}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => generate(false)}
                disabled={loading || !topic.trim()}
                className="w-full"
                variant="gradient"
                size="lg"
              >
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Generating...</>
                ) : (
                  <><Sparkles className="h-4 w-4" /> Generate Content</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output panel */}
        <div className="space-y-4">
          {!content ? (
            <Card className="h-full min-h-[400px] flex items-center justify-center">
              <div className="text-center p-8">
                <div className="mx-auto w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mb-4">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <p className="font-semibold text-sm">Your AI content will appear here</p>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  Enter a topic, select your platform and tone, then click Generate
                </p>
              </div>
            </Card>
          ) : (
            <>
              {/* Caption */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-primary" />
                      <CardTitle className="text-sm">Caption</CardTitle>
                    </div>
                    <div className="flex items-center gap-1">
                      <CopyButton text={content.caption} />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => generate(true)}
                        disabled={regenerating}
                      >
                        <RefreshCw className={`h-3.5 w-3.5 ${regenerating ? "animate-spin" : ""}`} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={savedCaption || content.caption}
                    onChange={(e) => setSavedCaption(e.target.value)}
                    className="text-sm resize-none border-0 p-0 focus-visible:ring-0 min-h-[100px]"
                  />
                </CardContent>
              </Card>

              {/* Hooks */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-orange-500" />
                    <CardTitle className="text-sm">Hooks</CardTitle>
                  </div>
                  <CardDescription className="text-xs">Alternative opening lines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {content.hooks.map((hook: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 p-2.5 rounded-lg bg-muted/50 group">
                      <span className="text-xs font-bold text-muted-foreground mt-0.5 w-4">{i + 1}</span>
                      <p className="text-sm flex-1">{hook}</p>
                      <CopyButton text={hook} />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Hashtags */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-blue-500" />
                      <CardTitle className="text-sm">Hashtags</CardTitle>
                    </div>
                    <CopyButton text={content.hashtags.map((h: string) => `#${h}`).join(" ")} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {content.hashtags.map((tag: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                        onClick={() => copyToClipboard(`#${tag}`)}>
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-green-500" />
                      <CardTitle className="text-sm">Call to Action</CardTitle>
                    </div>
                    <CopyButton text={content.cta} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium text-primary">{content.cta}</p>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2" onClick={saveDraft}>
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Link href="/schedule" className="flex-1">
                  <Button className="w-full gap-2" variant="gradient">
                    <Sparkles className="h-4 w-4" />
                    Schedule Post
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
