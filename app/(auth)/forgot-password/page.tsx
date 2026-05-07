"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="space-y-6 text-center animate-fade-in">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Check your email</h1>
          <p className="text-muted-foreground text-sm">
            We sent a password reset link to <strong>{email}</strong>
          </p>
        </div>
        <Link href="/login">
          <Button variant="outline" className="w-full">
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Forgot password?</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</> : "Send reset link"}
        </Button>
      </form>

      <div className="text-center">
        <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 justify-center">
          <ArrowLeft className="h-3 w-3" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
