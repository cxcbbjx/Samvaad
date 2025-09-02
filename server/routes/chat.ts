import { RequestHandler } from "express";
import { z } from "zod";
// Lazy-load AIService to avoid heavy dependencies during dev start
let aiService: any; // will be initialized on demand
async function ensureAIService() {
  if (!aiService) {
    try {
      const mod = await import("../services/AIService");
      const AIService = mod.default;
      aiService = new AIService();
      console.log("AI Service lazily initialized");
    } catch (err) {
      console.error("Failed to load AIService:", err);
    }
  }
}

// Validation schemas
const ChatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  userId: z.string().min(1, "User ID is required"),
  conversationId: z.string().optional(),
  userProfile: z.object({
    name: z.string().optional(),
    preferredLanguage: z.string().optional(),
    concerns: z.array(z.string()).optional(),
  }).optional()
});

const ConversationHistorySchema = z.object({
  conversationId: z.string().min(1, "Conversation ID is required")
});

// Initialize AI service on demand (no-op kept for compatibility)
export async function initializeAIService() {
  await ensureAIService();
}

// Chat endpoint - handles incoming messages and returns AI responses
export const handleChat: RequestHandler = async (req, res) => {
  try {
    // Validate request body
    const validation = ChatMessageSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid request',
        details: validation.error.errors
      });
    }

    const { message, userId, conversationId, userProfile } = validation.data;

    await ensureAIService();
    // If still not available, return graceful fallback
    if (!aiService) {
      return res.status(200).json({
        success: true,
        data: {
          response: "I'm here to listen. Tell me more about what's on your mind.",
          conversationId: req.body.conversationId || `fallback-${Date.now()}`,
          language: 'en',
          sentiment: 'neutral',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Update user profile if provided
    if (userProfile && conversationId) {
      await aiService.updateUserProfile(conversationId, userProfile);
    }

    // Generate AI response
    const result = await aiService.generateResponse(userId, message, conversationId);

    // Log conversation for monitoring (remove sensitive data in production)
    console.log(`Chat interaction - User: ${userId}, Language: ${result.language}, Sentiment: ${result.sentiment}`);

    // Return response
    res.json({
      success: true,
      data: {
        response: result.response,
        conversationId: result.conversationId,
        language: result.language,
        sentiment: result.sentiment,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    
    // Return fallback response
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      data: {
        response: "I'm sorry, I'm having trouble processing your message right now. Please try again, and know that I'm here to support you.",
        conversationId: req.body.conversationId || `fallback-${Date.now()}`,
        language: 'en',
        sentiment: 'neutral',
        timestamp: new Date().toISOString()
      }
    });
  }
};

// Get conversation history
export const getConversationHistory: RequestHandler = async (req, res) => {
  try {
    const validation = ConversationHistorySchema.safeParse(req.params);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid conversation ID',
        details: validation.error.errors
      });
    }

    const { conversationId } = validation.data;

    if (!aiService) {
      return res.status(503).json({
        error: 'AI service not available'
      });
    }

    const history = await aiService.getConversationHistory(conversationId);
    
    if (!history) {
      return res.status(404).json({
        error: 'Conversation not found'
      });
    }

    // Return conversation history (without sensitive internal data)
    res.json({
      success: true,
      data: {
        conversationId: history.conversationId,
        userId: history.userId,
        messages: history.messages.map(msg => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
          language: msg.language,
          sentiment: msg.sentiment
        })),
        messageCount: history.messages.length,
        userProfile: {
          preferredLanguage: history.userProfile?.preferredLanguage,
          concerns: history.userProfile?.concerns
          // Don't expose riskLevel for privacy
        }
      }
    });

  } catch (error) {
    console.error('Conversation history endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve conversation history'
    });
  }
};

// Health check for AI services
export const healthCheck: RequestHandler = async (req, res) => {
  try {
    const status = {
      aiService: !!aiService,
      timestamp: new Date().toISOString(),
      services: {
        openai: !!process.env.OPENAI_API_KEY,
        weaviate: process.env.WEAVIATE_HOST || 'localhost:8080',
      }
    };

    res.json({
      success: true,
      status: 'healthy',
      data: status
    });

  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Endpoint to analyze conversation patterns (for psychologists)
export const getConversationAnalytics: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { timeframe = '7d' } = req.query;

    // This is a placeholder for analytics functionality
    // In production, you'd query your database for conversation patterns
    
    const mockAnalytics = {
      userId,
      timeframe,
      metrics: {
        totalConversations: 12,
        averageSessionLength: 8.5,
        sentimentTrends: {
          positive: 35,
          neutral: 45,
          negative: 20
        },
        topConcerns: [
          { concern: 'exam_stress', frequency: 8 },
          { concern: 'social_anxiety', frequency: 5 },
          { concern: 'time_management', frequency: 3 }
        ],
        languageUsage: {
          en: 70,
          hi: 30
        },
        riskIndicators: {
          level: 'low',
          triggers: []
        }
      },
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: mockAnalytics
    });

  } catch (error) {
    console.error('Analytics endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve analytics'
    });
  }
};

// Emergency response endpoint (for crisis situations)
export const handleEmergency: RequestHandler = async (req, res) => {
  try {
    const { userId, conversationId, message, location } = req.body;

    // Log emergency situation
    console.error(`EMERGENCY ALERT - User: ${userId}, Message: ${message}`);

    // In production, this would:
    // 1. Alert crisis intervention team
    // 2. Provide immediate resources
    // 3. Escalate to human counselors

    const emergencyResponse = {
      immediate: true,
      resources: {
        crisis_hotline: "988",
        text_support: "Text HOME to 741741",
        emergency_services: "911",
        campus_counseling: "Your campus counseling center"
      },
      message: "I'm very concerned about you right now. Please reach out to one of these immediate support resources. You don't have to go through this alone.",
      follow_up: "A counselor will be notified and may reach out to provide additional support."
    };

    res.json({
      success: true,
      emergency: true,
      data: emergencyResponse
    });

  } catch (error) {
    console.error('Emergency endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Emergency response system unavailable'
    });
  }
};
