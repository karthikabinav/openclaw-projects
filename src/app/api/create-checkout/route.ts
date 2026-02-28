import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { config } from "@/lib/config";

export async function POST() {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json({ error: "Stripe is not configured" }, { status: 500 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: config.stripePriceId, quantity: 1 }],
    success_url: `${config.appUrl || "http://localhost:3000"}/dashboard?checkout=success`,
    cancel_url: `${config.appUrl || "http://localhost:3000"}/dashboard?checkout=cancel`,
  });

  return NextResponse.json({ url: session.url });
}
