import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleChat,
  getConversationHistory,
  healthCheck,
  getConversationAnalytics,
  handleEmergency
} from "./routes/chat";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' })); // Increased limit for AI requests
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));


  // Health check endpoints
  app.get("/api/health", healthCheck);
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "SAMVAAD API is running";
    res.json({ message: ping });
  });

  // AI Chat endpoints
  app.post("/api/chat", handleChat);
  app.get("/api/conversation/:conversationId", getConversationHistory);
  app.post("/api/emergency", handleEmergency);

  // Analytics endpoints (for psychologists)
  app.get("/api/analytics/:userId", getConversationAnalytics);

  // Legacy demo endpoint
  app.get("/api/demo", handleDemo);

  // Error handling middleware
  app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
  });

  return app;
}
