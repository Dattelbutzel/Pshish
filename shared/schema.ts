import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const phishingAttempts = pgTable("phishing_attempts", {
  id: serial("id").primaryKey(),
  ipAddress: text("ip_address").notNull(),
  username: text("username").notNull(),
  password: text("password").notNull(),
  userAgent: text("user_agent"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const sessionStats = pgTable("session_stats", {
  id: serial("id").primaryKey(),
  totalAttempts: integer("total_attempts").default(0).notNull(),
  scenarioCounts: text("scenario_counts").notNull(), // JSON string
  lastReset: timestamp("last_reset").defaultNow().notNull(),
});

export const insertPhishingAttemptSchema = createInsertSchema(phishingAttempts).omit({
  id: true,
  timestamp: true,
});

export const insertSessionStatsSchema = createInsertSchema(sessionStats).omit({
  id: true,
  lastReset: true,
});

export type InsertPhishingAttempt = z.infer<typeof insertPhishingAttemptSchema>;
export type PhishingAttempt = typeof phishingAttempts.$inferSelect;
export type InsertSessionStats = z.infer<typeof insertSessionStatsSchema>;
export type SessionStats = typeof sessionStats.$inferSelect;
