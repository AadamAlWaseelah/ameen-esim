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
