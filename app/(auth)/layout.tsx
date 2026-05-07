import { Zap } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Branding panel */}
      <div className="hidden lg:flex flex-col gradient-bg p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col h-full">
          <Link href="/" className="flex items-center gap-2 mb-auto">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold">SocialFlow AI</span>
          </Link>

          <div className="space-y-6">
            <blockquote className="text-2xl font-medium leading-relaxed">
              "SocialFlow AI helped us grow our Instagram from 2K to 50K followers in 3 months using AI-powered content."
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-white/30 flex items-center justify-center text-sm font-bold">
                SM
              </div>
              <div>
                <p className="font-semibold">Sarah Mitchell</p>
                <p className="text-white/70 text-sm">Founder, Bloom Studio</p>
              </div>
            </div>
          </div>

          <div className="mt-auto pt-8 border-t border-white/20 grid grid-cols-3 gap-4 text-center">
            {[
              { value: "10K+", label: "Active Users" },
              { value: "2M+", label: "Posts Scheduled" },
              { value: "4.9★", label: "App Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-white/70">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="p-2 gradient-bg rounded-xl">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">SocialFlow AI</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
