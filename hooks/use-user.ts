"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Profile, Subscription } from "@/types";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function loadUserData(userId: string) {
      const [profileResult, subscriptionResult] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase.from("subscriptions").select("*").eq("user_id", userId).single(),
      ]);
      setProfile(profileResult.data);
      setSubscription(subscriptionResult.data);
    }

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) loadUserData(user.id).finally(() => setLoading(false));
      else setLoading(false);
    });

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) loadUserData(session.user.id);
      }
    );

    return () => authSub.unsubscribe();
  }, []);

  return { user, profile, subscription, loading };
}
