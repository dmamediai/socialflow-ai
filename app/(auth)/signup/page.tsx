"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, Check } from "lucide-react";

const PASSWORD_REQUIREMENTS = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
];

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Check your email to verify.");
      router.push("/login");
    }
    setLoading(false);
  }

  const passwordStrength = PASSWORD_REQUIREMENTS.filter((r) => r.test(password)).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="text-muted-foreground text-sm">
          Start for free. No credit card required.
        </p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {password && (
            <div className="space-y-1.5 pt-1">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i < passwordStrength
                        ? passwordStrength === 1
                          ? "bg-red-500"
                          : passwordStrength === 2
                          ? "bg-yellow-500"
                          : "bg-green-500"
                        : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <div className="space-y-1">
                {PASSWORD_REQUIREMENTS.map((req) => (
                  <div key={req.label} className="flex items-center gap-1.5 text-xs">
                    <Check
                      className={`h-3 w-3 ${req.test(password) ? "text-green-500" : "text-muted-foreground"}`}
                    />
                    <span className={req.test(password) ? "text-foreground" : "text-muted-foreground"}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={loading || passwordStrength < 3}
        >
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating account...</> : "Create free account"}
        </Button>
      </form>

      <p className="text-xs text-center text-muted-foreground">
        By creating an account, you agree to our{" "}
        <Link href="/terms" className="underline hover:text-foreground">Terms</Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
      </p>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary font-medium hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
