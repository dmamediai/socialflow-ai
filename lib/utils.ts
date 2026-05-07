import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    instagram: "bg-gradient-to-r from-purple-500 to-pink-500",
    facebook: "bg-blue-600",
    linkedin: "bg-blue-700",
    twitter: "bg-sky-500",
  };
  return colors[platform] || "bg-gray-500";
}

export function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    instagram: "Instagram",
    facebook: "Facebook",
    linkedin: "Linkedin",
    twitter: "Twitter",
  };
  return icons[platform] || "Globe";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    published: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export const PLAN_LIMITS = {
  free: {
    aiGenerations: 10,
    scheduledPosts: 5,
  },
  pro: {
    aiGenerations: Infinity,
    scheduledPosts: Infinity,
  },
};
