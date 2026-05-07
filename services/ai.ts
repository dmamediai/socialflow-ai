import OpenAI from "openai";
import type { Platform, Tone, GeneratedContent } from "@/types";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PLATFORM_CONTEXT: Record<Platform, string> = {
  instagram: "Instagram post (visual-first, story-driven, use emojis, 2200 char limit)",
  facebook: "Facebook post (conversational, community-focused, can be longer)",
  linkedin: "LinkedIn post (professional, thought leadership, value-driven, B2B tone)",
  twitter: "X/Twitter post (punchy, concise, under 280 characters, hook-first)",
};

const TONE_CONTEXT: Record<Tone, string> = {
  professional: "professional, authoritative, credible, and polished",
  funny: "humorous, witty, playful, and entertaining with light humor",
  luxury: "premium, sophisticated, aspirational, exclusive, and high-end",
  minimal: "clean, concise, minimalist, and elegant — less is more",
  genz: "Gen Z slang, trendy, relatable, casual, uses internet culture references",
};

export async function generateContent(
  topic: string,
  platform: Platform,
  tone: Tone
): Promise<GeneratedContent> {
  const platformCtx = PLATFORM_CONTEXT[platform];
  const toneCtx = TONE_CONTEXT[tone];

  const prompt = `You are a world-class social media copywriter specializing in viral content.

Create content for a ${platformCtx}.
Topic: "${topic}"
Tone: ${toneCtx}

Return ONLY valid JSON (no markdown, no explanation) in this exact structure:
{
  "caption": "The main post caption (platform-appropriate length)",
  "hooks": ["Hook 1", "Hook 2", "Hook 3"],
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5"],
  "cta": "One strong call-to-action"
}

Rules:
- caption must be engaging, platform-native, and match the tone perfectly
- hooks are alternative opening lines to grab attention
- hashtags without # prefix, relevant and specific (mix popular + niche)
- cta is direct, action-oriented, and compelling
- For Twitter: keep caption under 260 characters
- For LinkedIn: make it educational/insightful
- For Instagram: use 3-5 relevant emojis naturally`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8,
    max_tokens: 800,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content;
  if (!content) throw new Error("No content generated");

  return JSON.parse(content) as GeneratedContent;
}

export async function regenerateCaption(
  topic: string,
  platform: Platform,
  tone: Tone,
  previousCaption: string
): Promise<string> {
  const prompt = `You are a social media copywriter. Write a completely different caption for:
Topic: "${topic}"
Platform: ${platform}
Tone: ${TONE_CONTEXT[tone]}
Previous caption (avoid repeating): "${previousCaption}"

Return ONLY the caption text, nothing else.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.9,
    max_tokens: 400,
  });

  return response.choices[0].message.content?.trim() ?? "";
}
