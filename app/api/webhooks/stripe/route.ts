import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createAdminClient();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        if (!userId) break;

        await supabase.from("subscriptions").update({
          stripe_subscription_id: session.subscription as string,
          plan: "pro",
          status: "active",
        }).eq("user_id", userId);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (!userId) break;

        const plan = sub.status === "active" ? "pro" : "free";
        await supabase.from("subscriptions").update({
          stripe_subscription_id: sub.id,
          plan,
          status: sub.status as string,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          current_period_start: new Date((sub as any).current_period_start * 1000).toISOString(),
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
        }).eq("user_id", userId);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.user_id;
        if (!userId) break;

        await supabase.from("subscriptions").update({
          plan: "free",
          status: "canceled",
          stripe_subscription_id: null,
        }).eq("user_id", userId);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        await supabase.from("subscriptions").update({ status: "past_due" })
          .eq("stripe_customer_id", customerId);
        break;
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
