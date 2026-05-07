import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

export async function createOrRetrieveCustomer(userId: string, email: string) {
  const { createAdminClient } = await import("@/lib/supabase/server");
  const supabase = await createAdminClient();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  if (subscription?.stripe_customer_id) {
    return subscription.stripe_customer_id;
  }

  const customer = await getStripe().customers.create({
    email,
    metadata: { supabase_user_id: userId },
  });

  await supabase
    .from("subscriptions")
    .update({ stripe_customer_id: customer.id })
    .eq("user_id", userId);

  return customer.id;
}

export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string,
  returnUrl: string
) {
  const customerId = await createOrRetrieveCustomer(userId, email);

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${returnUrl}/billing?success=true`,
    cancel_url: `${returnUrl}/billing?canceled=true`,
    metadata: { user_id: userId },
    subscription_data: {
      metadata: { user_id: userId },
    },
  });

  return session;
}

export async function createPortalSession(customerId: string, returnUrl: string) {
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${returnUrl}/billing`,
  });
  return session;
}
