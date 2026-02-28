export const config = {
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || "",
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
  stripePriceId: process.env.STRIPE_PRICE_ID || "",
};

export const isConfigured = {
  supabase: Boolean(config.supabaseUrl && config.supabaseAnonKey),
  stripe: Boolean(config.stripeSecretKey && config.stripePriceId),
};
