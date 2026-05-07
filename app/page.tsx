import Link from "next/link";
import { Navbar } from "@/components/landing/navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles, CalendarDays, BarChart3, Zap, Check,
  ArrowRight, Star, RefreshCw, Clock, Globe, TrendingUp, MessageSquare,
  Hash, BookOpen, ChevronDown, Shield
} from "lucide-react";
import { InstagramIcon, FacebookIcon, LinkedinIcon, TwitterXIcon } from "@/components/ui/social-icons";

const FEATURES = [
  {
    icon: Sparkles,
    title: "AI Content Generator",
    desc: "Generate platform-perfect captions, hooks, hashtags, and CTAs in seconds with GPT-4 powered AI.",
    color: "text-violet-600",
    bg: "bg-violet-100 dark:bg-violet-900/30",
  },
  {
    icon: CalendarDays,
    title: "Smart Scheduling",
    desc: "Schedule posts to Instagram, Facebook, LinkedIn, and X at the perfect time for maximum reach.",
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Track performance, monitor post statuses, and understand what content resonates with your audience.",
    color: "text-green-600",
    bg: "bg-green-100 dark:bg-green-900/30",
  },
  {
    icon: Globe,
    title: "Multi-Platform",
    desc: "Manage all your social accounts from one beautiful dashboard. No more switching between apps.",
    color: "text-orange-500",
    bg: "bg-orange-100 dark:bg-orange-900/30",
  },
  {
    icon: MessageSquare,
    title: "5 AI Tones",
    desc: "Professional, Funny, Luxury, Minimal, and Gen Z — match every tone to every brand and audience.",
    color: "text-pink-600",
    bg: "bg-pink-100 dark:bg-pink-900/30",
  },
  {
    icon: Clock,
    title: "Time Saver",
    desc: "Save 10+ hours per week. Let AI handle content creation while you focus on growing your business.",
    color: "text-cyan-600",
    bg: "bg-cyan-100 dark:bg-cyan-900/30",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah Mitchell",
    role: "Founder, Bloom Studio",
    content: "SocialFlow AI helped us grow from 2K to 50K Instagram followers in 3 months. The AI captions are genuinely better than what we wrote manually.",
    avatar: "SM",
    stars: 5,
  },
  {
    name: "James Carter",
    role: "Marketing Director, Nexus Labs",
    content: "We went from spending 5 hours a week on social media to 30 minutes. The AI understands our brand voice perfectly.",
    avatar: "JC",
    stars: 5,
  },
  {
    name: "Priya Sharma",
    role: "Creator & Coach",
    content: "I manage 3 different brands now with the same energy I used to spend on one. SocialFlow AI is a genuine superpower.",
    avatar: "PS",
    stars: 5,
  },
];

const FAQS = [
  {
    q: "How does the AI content generation work?",
    a: "We use OpenAI's GPT-4 to generate platform-optimized content based on your topic, tone, and target platform. Every generation is unique and tailored.",
  },
  {
    q: "Which social media platforms are supported?",
    a: "Currently we support Instagram, Facebook, LinkedIn, and X/Twitter. Direct publishing via Meta OAuth is in beta, with Twitter/LinkedIn coming next.",
  },
  {
    q: "Can I cancel my Pro subscription anytime?",
    a: "Yes, absolutely. Cancel anytime from your billing settings. You'll keep Pro access until the end of your billing period.",
  },
  {
    q: "Is my data secure?",
    a: "All data is encrypted at rest and in transit. We use Supabase with Row-Level Security policies. Your content and credentials are never shared.",
  },
  {
    q: "What happens if I hit the Free plan limit?",
    a: "You'll be notified and can upgrade to Pro instantly. Your existing content and drafts are never deleted.",
  },
  {
    q: "Do I need a credit card to start?",
    a: "No. The Free plan requires no credit card. You only need to add payment details when you upgrade to Pro.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-transparent blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-6 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-0 px-3 py-1 text-xs gap-1.5">
            <Sparkles className="h-3 w-3" />
            Powered by GPT-4 AI
          </Badge>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Create. Schedule.
            <br />
            <span className="gradient-text">Grow on autopilot.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            AI-powered social media content that converts. Generate viral captions, hooks, and hashtags for any platform — then schedule with one click.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12">
            <Link href="/signup">
              <Button size="lg" variant="gradient" className="gap-2 min-w-[200px]">
                <Sparkles className="h-5 w-5" />
                Start for free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="min-w-[160px]">
                See how it works
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500" /> No credit card</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500" /> Free tier forever</span>
            <span className="flex items-center gap-1.5"><Check className="h-4 w-4 text-green-500" /> Cancel anytime</span>
          </div>
        </div>

        {/* Platform logos */}
        <div className="max-w-lg mx-auto mt-16 flex items-center justify-center gap-6">
          {[
            { icon: InstagramIcon, label: "Instagram", color: "from-purple-500 to-pink-500" },
            { icon: FacebookIcon, label: "Facebook", color: "from-blue-600 to-blue-700" },
            { icon: LinkedinIcon, label: "LinkedIn", color: "from-blue-700 to-blue-800" },
            { icon: TwitterXIcon, label: "X/Twitter", color: "from-gray-800 to-black dark:from-gray-600 dark:to-gray-800" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof bar */}
      <div className="border-y bg-muted/30 py-4 overflow-hidden">
        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground flex-wrap px-4">
          <span className="flex items-center gap-2 font-semibold text-foreground">
            <TrendingUp className="h-4 w-4 text-primary" /> 10,000+ creators
          </span>
          <span className="hidden sm:block">·</span>
          <span>2M+ posts scheduled</span>
          <span className="hidden sm:block">·</span>
          <span className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />)}
            &nbsp;4.9 rating
          </span>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-0">
              Everything you need
            </Badge>
            <h2 className="text-4xl font-bold mb-4">
              Social media on <span className="gradient-text">autopilot</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              From AI-generated content to scheduled publishing — everything in one beautiful platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feature) => (
              <Card key={feature.title} className="card-hover border">
                <CardContent className="p-6">
                  <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Showcase */}
      <section className="py-24 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-0">
                AI Generator
              </Badge>
              <h2 className="text-4xl font-bold mb-4">
                5 AI tones.<br />
                <span className="gradient-text">Infinite possibilities.</span>
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Tell the AI your topic, pick your vibe, and watch it generate platform-perfect content in seconds. Hook your audience every time.
              </p>
              <ul className="space-y-3">
                {[
                  { icon: MessageSquare, text: "Captions tailored for each platform" },
                  { icon: Zap, text: "3 unique hooks per generation" },
                  { icon: Hash, text: "Optimized hashtag sets" },
                  { icon: BookOpen, text: "Compelling calls-to-action" },
                ].map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-center gap-3 text-sm">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    {text}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="inline-block mt-8">
                <Button variant="gradient" className="gap-2">
                  <Sparkles className="h-4 w-4" />
                  Try AI Generator free
                </Button>
              </Link>
            </div>

            {/* Mock UI */}
            <div className="relative">
              <div className="rounded-2xl border bg-background shadow-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg gradient-bg flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold">AI Caption</p>
                    <p className="text-xs text-muted-foreground">Instagram · Professional</p>
                  </div>
                  <Badge className="ml-auto bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-0 text-xs">Generated</Badge>
                </div>
                <div className="p-3 rounded-xl bg-muted/50 text-sm leading-relaxed">
                  🚀 Tired of guessing what content works? We analyzed 10,000+ top-performing posts so you don&apos;t have to.
                  <br /><br />
                  Here&apos;s the formula that doubled our engagement rate this quarter...
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {["contentmarketing", "socialmedia", "growthhack", "digitalmarketing"].map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">#{tag}</span>
                  ))}
                </div>
                <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-sm font-medium text-violet-700 dark:text-violet-400">
                  💡 &ldquo;Download our free guide — link in bio&rdquo;
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3">
              Loved by <span className="gradient-text">10,000+ creators</span>
            </h2>
            <p className="text-muted-foreground">Real results from real users</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex mb-3">
                    {[...Array(t.stars)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">&ldquo;{t.content}&rdquo;</p>
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-0">
              Simple pricing
            </Badge>
            <h2 className="text-4xl font-bold mb-3">
              Start free. <span className="gradient-text">Scale when ready.</span>
            </h2>
            <p className="text-muted-foreground">No hidden fees. Cancel anytime.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <Card className="border">
              <CardContent className="p-8">
                <p className="font-semibold text-lg mb-1">Free</p>
                <p className="text-4xl font-bold mb-1">$0</p>
                <p className="text-sm text-muted-foreground mb-6">Forever free · No card required</p>
                <Separator className="mb-6" />
                <ul className="space-y-3 mb-8">
                  {["10 AI generations/mo", "5 scheduled posts", "1 social account", "Media library (100MB)"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-muted-foreground shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button variant="outline" className="w-full">Get started free</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-primary relative overflow-hidden shadow-xl">
              <div className="absolute top-0 left-0 right-0 h-1 gradient-bg" />
              <CardContent className="p-8">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-lg">Pro</p>
                  <Badge className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400 border-0 text-xs">Popular</Badge>
                </div>
                <p className="text-4xl font-bold mb-1">$29</p>
                <p className="text-sm text-muted-foreground mb-6">per month · Cancel anytime</p>
                <Separator className="mb-6" />
                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited AI generations",
                    "Unlimited scheduled posts",
                    "Unlimited social accounts",
                    "Media library (10GB)",
                    "Priority support",
                    "API access",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button variant="gradient" className="w-full gap-2">
                    <Sparkles className="h-4 w-4" />
                    Start Pro trial
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-3">
              Frequently asked <span className="gradient-text">questions</span>
            </h2>
          </div>
          <Card>
            <CardContent className="p-6 sm:p-8">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group border-b border-border last:border-0">
                  <summary className="flex items-center justify-between py-4 cursor-pointer list-none">
                    <span className="font-medium text-sm pr-4">{faq.q}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="text-sm text-muted-foreground pb-4 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative rounded-3xl overflow-hidden gradient-bg p-12 text-white">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-4">
                Start growing your social media today
              </h2>
              <p className="text-white/80 mb-8 text-lg">
                Join 10,000+ creators who save 10+ hours per week with AI.
              </p>
              <Link href="/signup">
                <Button size="lg" className="bg-white text-violet-700 hover:bg-white/90 gap-2 font-semibold">
                  <Sparkles className="h-5 w-5" />
                  Get started free — no card needed
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 gradient-bg rounded-lg">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-sm">SocialFlow AI</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <a href="mailto:hello@socialflowai.com" className="hover:text-foreground">Contact</a>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2024 SocialFlow AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
