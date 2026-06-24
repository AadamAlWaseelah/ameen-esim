import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const markupTypeEnum = pgEnum("markup_type", [
  "percent",
  "fixed",
  "none",
]);

export const plans = pgTable("plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  country: text("country").notNull().default("SA"),
  dataAmountMb: integer("data_amount_mb"),
  validityDays: integer("validity_days").notNull(),
  network: text("network"),
  description: text("description").notNull(),
  featureList: text("feature_list").array().notNull().default([]),
  costPence: integer("cost_pence"),
  markupType: markupTypeEnum("markup_type").notNull().default("none"),
  markupValue: integer("markup_value"),
  retailPricePence: integer("retail_price_pence"),
  providerRefs: jsonb("provider_refs")
    .$type<Record<string, string>>()
    .notNull()
    .default({}),
  badge: text("badge"),
  active: boolean("active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "paid",
  "provisioning",
  "delivered",
  "failed",
  "refunded",
]);

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  // Snapshot of the plan at purchase time, so the order is self-contained
  // even if the plan is later edited or removed.
  planId: text("plan_id"),
  planSlug: text("plan_slug").notNull(),
  planTitle: text("plan_title").notNull(),
  quantity: integer("quantity").notNull().default(1),
  amountPence: integer("amount_pence").notNull(),
  currency: text("currency").notNull().default("GBP"),
  // Active provider + its orderable ref (packageCode) at purchase time.
  providerId: text("provider_id").notNull(),
  providerRef: text("provider_ref").notNull(),
  // Stripe linkage.
  stripeSessionId: text("stripe_session_id").unique(),
  stripePaymentIntentId: text("stripe_payment_intent_id"),
  // Provisioned eSIM (filled once the provider allocates a profile).
  providerOrderRef: text("provider_order_ref"),
  iccid: text("iccid"),
  lpaString: text("lpa_string"),
  smdpAddress: text("smdp_address"),
  activationCode: text("activation_code"),
  qrImageDataUri: text("qr_image_data_uri"),
  status: orderStatusEnum("status").notNull().default("pending"),
  errorMessage: text("error_message"),
  emailSentAt: timestamp("email_sent_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
