import Stripe from "stripe";
import { config, isConfigured } from "./config";

export function getStripe() {
  if (!isConfigured.stripe) return null;
  return new Stripe(config.stripeSecretKey);
}
