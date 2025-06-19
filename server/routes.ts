import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertPhishingAttemptSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get session stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getSessionStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get session stats" });
    }
  });

  // Create phishing attempt (capture form data)
  app.post("/api/phishing-attempts", async (req, res) => {
    try {
      // Get IP address from request
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || 'unknown';
      
      const dataWithIp = {
        ...req.body,
        ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
        userAgent: req.headers['user-agent']
      };
      
      const validatedData = insertPhishingAttemptSchema.parse(dataWithIp);
      const attempt = await storage.createPhishingAttempt(validatedData);
      res.json(attempt);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create phishing attempt" });
      }
    }
  });

  // Get all phishing attempts
  app.get("/api/phishing-attempts", async (req, res) => {
    try {
      const attempts = await storage.getAllPhishingAttempts();
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get phishing attempts" });
    }
  });

  // Reset demonstration data
  app.post("/api/reset", async (req, res) => {
    try {
      const stats = await storage.resetSessionStats();
      res.json({ message: "Demonstration reset successfully", stats });
    } catch (error) {
      res.status(500).json({ message: "Failed to reset demonstration" });
    }
  });

  // Clear captured data only
  app.delete("/api/phishing-attempts", async (req, res) => {
    try {
      await storage.clearPhishingAttempts();
      res.json({ message: "Captured data cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear captured data" });
    }
  });

  // Download project files
  app.get("/download-project", (req, res) => {
    const path = require('path');
    const zipPath = path.join(process.cwd(), 'commerzbank-phishing-panel.zip');
    
    res.download(zipPath, 'commerzbank-phishing-panel.zip', (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(404).json({ message: "File not found" });
      }
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}
