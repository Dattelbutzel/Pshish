import { phishingAttempts, sessionStats, type PhishingAttempt, type InsertPhishingAttempt, type SessionStats, type InsertSessionStats } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Phishing attempts
  createPhishingAttempt(attempt: InsertPhishingAttempt): Promise<PhishingAttempt>;
  getAllPhishingAttempts(): Promise<PhishingAttempt[]>;
  clearPhishingAttempts(): Promise<void>;
  
  // Session stats
  getSessionStats(): Promise<SessionStats | undefined>;
  updateSessionStats(stats: Partial<InsertSessionStats>): Promise<SessionStats>;
  resetSessionStats(): Promise<SessionStats>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<PhishingAttempt | undefined> {
    const [attempt] = await db.select().from(phishingAttempts).where(eq(phishingAttempts.id, id));
    return attempt || undefined;
  }

  async createPhishingAttempt(insertAttempt: InsertPhishingAttempt): Promise<PhishingAttempt> {
    const [attempt] = await db
      .insert(phishingAttempts)
      .values(insertAttempt)
      .returning();
    
    // Update session stats
    const [currentStats] = await db.select().from(sessionStats).limit(1);
    
    if (currentStats) {
      const scenarioCounts = JSON.parse(currentStats.scenarioCounts);
      scenarioCounts.commerzbank = (scenarioCounts.commerzbank || 0) + 1;
      
      await db
        .update(sessionStats)
        .set({
          totalAttempts: currentStats.totalAttempts + 1,
          scenarioCounts: JSON.stringify(scenarioCounts),
        })
        .where(eq(sessionStats.id, currentStats.id));
    } else {
      // Create initial stats
      await db.insert(sessionStats).values({
        totalAttempts: 1,
        scenarioCounts: JSON.stringify({ commerzbank: 1 }),
      });
    }
    
    return attempt;
  }

  async getAllPhishingAttempts(): Promise<PhishingAttempt[]> {
    return await db.select().from(phishingAttempts).orderBy(phishingAttempts.timestamp);
  }

  async clearPhishingAttempts(): Promise<void> {
    await db.delete(phishingAttempts);
  }

  async getSessionStats(): Promise<SessionStats | undefined> {
    const [stats] = await db.select().from(sessionStats).limit(1);
    return stats || undefined;
  }

  async updateSessionStats(stats: Partial<InsertSessionStats>): Promise<SessionStats> {
    const [currentStats] = await db.select().from(sessionStats).limit(1);
    
    if (currentStats) {
      const [updated] = await db
        .update(sessionStats)
        .set(stats)
        .where(eq(sessionStats.id, currentStats.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(sessionStats)
        .values({
          totalAttempts: 0,
          scenarioCounts: JSON.stringify({ commerzbank: 0 }),
          ...stats,
        })
        .returning();
      return created;
    }
  }

  async resetSessionStats(): Promise<SessionStats> {
    await this.clearPhishingAttempts();
    
    const [currentStats] = await db.select().from(sessionStats).limit(1);
    
    if (currentStats) {
      const [updated] = await db
        .update(sessionStats)
        .set({
          totalAttempts: 0,
          scenarioCounts: JSON.stringify({ commerzbank: 0 }),
          lastReset: new Date(),
        })
        .where(eq(sessionStats.id, currentStats.id))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(sessionStats)
        .values({
          totalAttempts: 0,
          scenarioCounts: JSON.stringify({ commerzbank: 0 }),
        })
        .returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
