export type Platform = "instagram" | "facebook" | "linkedin" | "twitter";
export type PostStatus = "draft" | "scheduled" | "published" | "failed";
export type Tone = "professional" | "funny" | "luxury" | "minimal" | "genz";
export type SubscriptionPlan = "free" | "pro";
export type SubscriptionStatus = "active" | "canceled" | "past_due" | "trialing";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SocialAccount {
  id: string;
  user_id: string;
  platform: Platform;
  account_id: string;
  account_name: string;
  access_token: string;
  refresh_token: string | null;
  token_expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  platform: Platform;
  content: string;
  media_urls: string[];
  status: PostStatus;
  scheduled_at: string | null;
  published_at: string | null;
  social_account_id: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface AIGeneration {
  id: string;
  user_id: string;
  topic: string;
  platform: Platform;
  tone: Tone;
  caption: string;
  hooks: string[];
  hashtags: string[];
  cta: string;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface UsageTracking {
  id: string;
  user_id: string;
  period_start: string;
  period_end: string;
  ai_generations_count: number;
  scheduled_posts_count: number;
  created_at: string;
  updated_at: string;
}

export interface MediaLibraryItem {
  id: string;
  user_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  public_url: string;
  created_at: string;
}

export interface DashboardStats {
  totalPosts: number;
  scheduledPosts: number;
  publishedPosts: number;
  aiGenerations: number;
  planLimit: {
    aiGenerations: number;
    scheduledPosts: number;
  };
}

export interface GeneratedContent {
  caption: string;
  hooks: string[];
  hashtags: string[];
  cta: string;
}
