"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Loader2, Link2, CheckCircle2 } from "lucide-react";
import { InstagramIcon, FacebookIcon, LinkedinIcon, TwitterXIcon } from "@/components/ui/social-icons";
import type { SocialAccount, Platform } from "@/types";
import { formatDate } from "@/lib/utils";

const PLATFORMS: {
  id: Platform;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  comingSoon?: boolean;
}[] = [
  {
    id: "facebook",
    name: "Facebook",
    icon: <FacebookIcon className="h-5 w-5" />,
    color: "bg-blue-600",
    description: "Connect your Facebook Page",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: <InstagramIcon className="h-5 w-5" />,
    color: "bg-gradient-to-br from-purple-600 to-pink-600",
    description: "Connect your Instagram Business account",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <LinkedinIcon className="h-5 w-5" />,
    color: "bg-blue-700",
    description: "Connect your LinkedIn Profile or Page",
    comingSoon: true,
  },
  {
    id: "twitter",
    name: "X / Twitter",
    icon: <TwitterXIcon className="h-5 w-5" />,
    color: "bg-gray-900",
    description: "Connect your X/Twitter account",
    comingSoon: true,
  },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadAccounts();
  }, []);

  async function loadAccounts() {
    const supabase = createClient();
    const { data } = await supabase
      .from("social_accounts")
      .select("*")
      .order("created_at", { ascending: false });
    setAccounts((data ?? []) as SocialAccount[]);
    setLoading(false);
  }

  async function toggleAccount(id: string, isActive: boolean) {
    const supabase = createClient();
    await supabase.from("social_accounts").update({ is_active: isActive }).eq("id", id);
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_active: isActive } : a))
    );
  }

  async function disconnectAccount(id: string) {
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("social_accounts").delete().eq("id", id);
    if (error) {
      toast.error("Failed to disconnect account");
    } else {
      toast.success("Account disconnected");
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    }
    setDeletingId(null);
  }

  function connectPlatform(platform: Platform) {
    // In production: redirect to OAuth flow
    toast.info(`Meta OAuth integration coming soon. Connect ${platform} via Meta Developer Dashboard.`);
  }

  const connectedPlatforms = new Set(accounts.map((a) => a.platform));

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h2 className="text-xl font-bold">Social Accounts</h2>
        <p className="text-muted-foreground text-sm mt-0.5">
          Connect your social media accounts to publish posts
        </p>
      </div>

      {/* Platform cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {PLATFORMS.map((platform) => {
          const connected = connectedPlatforms.has(platform.id);
          const account = accounts.find((a) => a.platform === platform.id);

          return (
            <Card key={platform.id} className={`card-hover ${platform.comingSoon ? "opacity-60" : ""}`}>
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${platform.color} text-white shrink-0`}>
                    {platform.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{platform.name}</h3>
                      {platform.comingSoon && (
                        <Badge variant="secondary" className="text-xs py-0">Soon</Badge>
                      )}
                      {connected && (
                        <Badge className="text-xs py-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Connected
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{platform.description}</p>

                    {account && (
                      <div className="mt-2 flex items-center gap-2">
                        <p className="text-xs font-medium">{account.account_name}</p>
                        <Switch
                          checked={account.is_active}
                          onCheckedChange={(v) => toggleAccount(account.id, v)}
                          className="scale-75"
                        />
                      </div>
                    )}
                  </div>

                  {connected ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                      onClick={() => disconnectAccount(account!.id)}
                      disabled={deletingId === account?.id}
                    >
                      {deletingId === account?.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Trash2 className="h-3.5 w-3.5" />
                      }
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="shrink-0 gap-1.5 text-xs h-8"
                      onClick={() => connectPlatform(platform.id)}
                      disabled={platform.comingSoon}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Connect
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Info card */}
      <Card className="border-dashed">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 shrink-0">
              <Link2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold">OAuth Integration</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Connect via Meta&apos;s official OAuth to publish directly to Facebook and Instagram.
                LinkedIn and Twitter integrations are coming in the next release. Store your access
                tokens securely and manage posting permissions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
