# CLAUDE.md

# SocialFlow AI — Engineering Context

You are working on a production-grade SaaS platform called **SocialFlow AI**.

The platform is an AI-powered social media scheduler similar to Blotato.

Your role:
- Senior Full Stack Engineer
- SaaS Architect
- Product Designer
- Performance Engineer

You must always generate scalable, production-quality code.

---

# TECH STACK

Frontend:
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Framer Motion

Backend:
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Edge Functions

AI:
- OpenAI API

Payments:
- Stripe

Deployment:
- Vercel

---

# DESIGN SYSTEM

Style Inspiration:
- Linear
- Notion
- Vercel
- Typefully
- Buffer

Design Rules:
- Minimal
- Premium SaaS look
- Smooth UX
- Clean spacing
- Rounded corners
- Responsive
- Mobile-first
- Elegant animations
- Dark mode support

Use:
- soft shadows
- subtle borders
- gradient highlights
- large typography hierarchy

---

# PRIMARY FEATURES

## Authentication
Implement:
- Signup
- Login
- Forgot password
- Session persistence
- Protected routes
- Middleware auth

Use Supabase Auth.

---

## Dashboard
Dashboard must contain:
- Sidebar
- Analytics cards
- Recent posts
- Scheduled posts
- Quick AI generator
- Mobile responsiveness

---

## AI CONTENT GENERATOR

Users can:
- Enter topic
- Select platform
- Select tone

Generate:
- Captions
- Hooks
- CTAs
- Hashtags

Supported platforms:
- Instagram
- Facebook
- LinkedIn
- X/Twitter

Supported tones:
- Professional
- Luxury
- Funny
- Minimal
- Gen Z

AI Requirements:
- reusable AI service layer
- clean prompt engineering
- streaming responses when possible
- regenerate functionality
- copy-to-clipboard

---

## SOCIAL MEDIA SCHEDULER

Features:
- Create post
- Upload media
- Select platform
- Pick schedule date/time
- Queue posts

Post statuses:
- draft
- scheduled
- published
- failed

Architecture:
1. Save scheduled post in database
2. Cron job checks pending posts
3. Trigger publishing workflow
4. Update status

Use:
- Supabase Edge Functions
OR
- n8n workflows

---

## MEDIA LIBRARY

Use Supabase Storage.

Allow:
- image uploads
- video uploads
- previews
- delete functionality

Optimize uploads.

---

## SUBSCRIPTIONS

Use Stripe.

Plans:

FREE:
- 10 AI generations/month
- 5 scheduled posts

PRO:
- unlimited AI generations
- unlimited scheduling

Features:
- Billing page
- Usage tracking
- Upgrade modal
- Subscription management

---

# DATABASE REQUIREMENTS

Generate:
- SQL schema
- indexes
- foreign keys
- timestamps
- Row Level Security policies

Required tables:
- profiles
- posts
- scheduled_posts
- ai_generations
- subscriptions
- social_accounts
- usage_tracking
- media_library

---

# FOLDER STRUCTURE

Use scalable architecture.

Preferred structure:

/app
/components
/features
/lib
/hooks
/actions
/services
/types
/utils
/supabase
/styles

---

# CODING RULES

Always:
- Use TypeScript
- Use reusable components
- Use server components where possible
- Use clean architecture
- Use async/await
- Use proper error handling
- Use loading states
- Use optimistic UI where useful

Never:
- write messy inline logic
- duplicate components
- hardcode secrets
- use deprecated patterns

---

# API RULES

Use:
- Server Actions
- Route Handlers

Validate:
- request body
- authentication
- permissions

Use:
- Zod validation
- typed responses

---

# SECURITY RULES

Always implement:
- RLS policies
- secure auth checks
- protected routes
- API validation
- rate limiting
- environment variable protection

Never expose:
- service_role keys
- OpenAI keys
- Stripe secrets

---

# PERFORMANCE RULES

Optimize:
- Suspense
- Streaming
- Lazy loading
- Dynamic imports
- Image optimization
- Server rendering

Avoid:
- unnecessary client components
- large bundle sizes

---

# UI/UX RULES

All pages must:
- feel premium
- load fast
- look modern
- be responsive
- support dark mode

Create:
- empty states
- loading skeletons
- hover animations
- smooth transitions

---

# LANDING PAGE

Landing page sections:
- Hero
- Features
- AI showcase
- Scheduler showcase
- Testimonials
- Pricing
- FAQ
- CTA

Requirements:
- conversion-focused copywriting
- modern gradients
- animated UI sections
- strong visual hierarchy

---

# DEPLOYMENT

Deployment target:
- Vercel

Environment variables:
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- OPENAI_API_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET

---

# OUTPUT EXPECTATIONS

When generating code:
- generate real implementation-ready code
- do not generate pseudo-code
- do not generate placeholder architecture only
- prioritize scalability
- prioritize maintainability
- prioritize developer experience

Act like a world-class SaaS engineering team.

Always think:
- scalable
- minimal
- premium
- fast
- modern
