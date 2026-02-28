import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { config } from "@/lib/config";

export async function POST(req: Request) {
  const stripe = getStripe();
  if (!stripe || !config.stripeWebhookSecret) {
    return NextResponse.json({ ok: true });
  }

  const body = await req.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Missing signature" }, { status: 400 });

  try {
    const event = stripe.webhooks.constructEvent(body, signature, config.stripeWebhookSecret);
    // TODO: update subscriptions table based on event.type + event.data.object
    return NextResponse.json({ received: true, type: event.type });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Webhook error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
