"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Plus, Trash2, Loader2, Copy, Check, Eye, EyeOff,
  Key, AlertTriangle, Terminal, Code2, Shield, Zap
} from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  last_used_at: string | null;
  created_at: string;
}

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <Button variant="ghost" size="icon" className={`h-7 w-7 ${className}`} onClick={handleCopy}>
      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  );
}

const CODE_EXAMPLES = {
  curl: `curl -X POST https://yourdomain.com/api/ai/generate \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "topic": "Product launch for ergonomic chair",
    "platform": "instagram",
    "tone": "professional"
  }'`,
  javascript: `const response = await fetch("https://yourdomain.com/api/ai/generate", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    topic: "Product launch for ergonomic chair",
    platform: "instagram",
    tone: "professional",
  }),
});

const { content } = await response.json();
console.log(content.caption);`,
  python: `import requests

response = requests.post(
    "https://yourdomain.com/api/ai/generate",
    headers={
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json",
    },
    json={
        "topic": "Product launch for ergonomic chair",
        "platform": "instagram",
        "tone": "professional",
    },
)

content = response.json()["content"]
print(content["caption"])`,
};

export default function ApiAccessPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [revealedKey, setRevealedKey] = useState<string | null>(null);
  const [showKey, setShowKey] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [codeTab, setCodeTab] = useState("curl");

  useEffect(() => {
    loadKeys();
  }, []);

  async function loadKeys() {
    const res = await fetch("/api/api-keys");
    if (res.ok) {
      const { keys } = await res.json();
      setKeys(keys);
    }
    setLoading(false);
  }

  async function createKey() {
    if (!newKeyName.trim()) {
      toast.error("Please enter a key name");
      return;
    }
    setCreating(true);

    const res = await fetch("/api/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName.trim() }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error ?? "Failed to create API key");
    } else {
      setRevealedKey(data.raw);
      setShowKey(true);
      setCreateOpen(false);
      setNewKeyName("");
      loadKeys();
    }
    setCreating(false);
  }

  async function revokeKey(id: string, name: string) {
    setDeletingId(id);
    const res = await fetch(`/api/api-keys/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success(`"${name}" revoked`);
      setKeys((prev) => prev.filter((k) => k.id !== id));
    } else {
      toast.error("Failed to revoke key");
    }
    setDeletingId(null);
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">API Access</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Generate API keys to integrate SocialFlow AI into your own apps
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} variant="gradient" className="gap-2">
          <Plus className="h-4 w-4" />
          New API Key
        </Button>
      </div>

      {/* Newly revealed key banner */}
      {revealedKey && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">
                  Save your API key now — it won&apos;t be shown again
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5 mb-3">
                  Copy and store this key securely. You cannot retrieve it after closing this banner.
                </p>
                <div className="flex items-center gap-2 p-2.5 bg-white dark:bg-black/30 rounded-lg border border-amber-200 dark:border-amber-800 font-mono text-sm">
                  <span className="flex-1 truncate text-xs">
                    {showKey ? revealedKey : revealedKey.replace(/./g, "•").slice(0, 40)}
                  </span>
                  <button
                    onClick={() => setShowKey((v) => !v)}
                    className="text-muted-foreground hover:text-foreground shrink-0"
                  >
                    {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                  <CopyButton text={revealedKey} />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="shrink-0 text-amber-700 hover:text-amber-900 hover:bg-amber-100 dark:text-amber-400"
                onClick={() => setRevealedKey(null)}
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Keys list */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            Your API Keys
          </CardTitle>
          <CardDescription className="text-xs">
            {keys.length}/10 keys used
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : keys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Key className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium">No API keys yet</p>
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                Create your first key to start using the API
              </p>
              <Button variant="outline" size="sm" onClick={() => setCreateOpen(true)} className="gap-2">
                <Plus className="h-3.5 w-3.5" />
                Generate API key
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {keys.map((key) => (
                <div key={key.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <div className="p-2 rounded-lg bg-muted shrink-0">
                    <Key className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">{key.name}</p>
                      <Badge variant="secondary" className="text-xs font-mono py-0 px-1.5">
                        {key.key_prefix}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Created {formatRelativeTime(key.created_at)}
                      {key.last_used_at && ` · Last used ${formatRelativeTime(key.last_used_at)}`}
                      {!key.last_used_at && " · Never used"}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive shrink-0"
                    onClick={() => revokeKey(key.id, key.name)}
                    disabled={deletingId === key.id}
                    title="Revoke key"
                  >
                    {deletingId === key.id
                      ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      : <Trash2 className="h-3.5 w-3.5" />
                    }
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex gap-3">
            <Shield className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Secure by default</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Keys are hashed with SHA-256. We never store the raw key.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex gap-3">
            <Zap className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">Rate limits</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Free: 10 req/min · Pro: 60 req/min per key.
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex gap-3">
            <Terminal className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">REST API</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pass your key as a Bearer token in the Authorization header.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Code examples */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Code2 className="h-4 w-4 text-primary" />
            Code Examples
          </CardTitle>
          <CardDescription className="text-xs">
            Generate AI content via API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={codeTab} onValueChange={setCodeTab}>
            <TabsList className="h-8 mb-4">
              <TabsTrigger value="curl" className="text-xs h-7">cURL</TabsTrigger>
              <TabsTrigger value="javascript" className="text-xs h-7">JavaScript</TabsTrigger>
              <TabsTrigger value="python" className="text-xs h-7">Python</TabsTrigger>
            </TabsList>
            {(["curl", "javascript", "python"] as const).map((lang) => (
              <TabsContent key={lang} value={lang} className="mt-0">
                <div className="relative rounded-lg bg-muted/60 border">
                  <div className="absolute top-3 right-3">
                    <CopyButton text={CODE_EXAMPLES[lang]} />
                  </div>
                  <pre className="p-4 text-xs overflow-x-auto font-mono leading-relaxed text-foreground/80">
                    <code>{CODE_EXAMPLES[lang]}</code>
                  </pre>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {/* Endpoints quick ref */}
          <div className="mt-4 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Endpoints</p>
            {[
              { method: "POST", path: "/api/ai/generate", desc: "Generate AI content" },
              { method: "GET", path: "/api/posts", desc: "List your posts" },
              { method: "POST", path: "/api/posts", desc: "Create a post" },
            ].map((ep) => (
              <div key={ep.path} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40 border">
                <Badge
                  className={`text-xs font-mono shrink-0 ${ep.method === "GET" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"} border-0`}
                >
                  {ep.method}
                </Badge>
                <code className="text-xs font-mono text-foreground/80 flex-1">{ep.path}</code>
                <span className="text-xs text-muted-foreground hidden sm:block">{ep.desc}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create key dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription className="text-xs">
              Give your key a descriptive name so you can identify it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="key-name">Key name</Label>
              <Input
                id="key-name"
                placeholder="e.g. Production App, Testing"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && createKey()}
                autoFocus
              />
            </div>
            <p className="text-xs text-muted-foreground">
              The full key will only be shown once after creation.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={createKey} disabled={creating || !newKeyName.trim()} variant="gradient">
              {creating ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</> : "Create Key"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
