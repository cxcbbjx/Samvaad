interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  language?: string;
  sentiment?: string;
}

interface ChatResponse {
  success: boolean;
  data: {
    response: string;
    conversationId: string;
    language: string;
    sentiment: string;
    timestamp: string;
  };
  error?: string;
}

interface UserProfile {
  name?: string;
  preferredLanguage?: string;
  concerns?: string[];
}

class ChatService {
  private baseURL: string;
  private conversationId: string | null = null;

  constructor() {
    // Use different API URLs based on environment
    this.baseURL = import.meta.env.VITE_API_URL || 
                   (window.location.hostname === 'localhost' 
                     ? 'http://localhost:3000' 
                     : '/.netlify/functions');
  }

  async sendMessage(
    message: string, 
    userId: string, 
    userProfile?: UserProfile
  ): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseURL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userId,
          conversationId: this.conversationId,
          userProfile
        }),
      });

      const data = await response.json();

      if (data.success && data.data.conversationId) {
        this.conversationId = data.data.conversationId;
        // Store conversation ID in localStorage for persistence
        localStorage.setItem('samvaad_conversation_id', this.conversationId);
      }

      return data;
    } catch (error) {
      console.error('Chat service error:', error);
      return {
        success: false,
        data: {
          response: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. I'm here to support you.",
          conversationId: this.conversationId || `fallback-${Date.now()}`,
          language: 'en',
          sentiment: 'neutral',
          timestamp: new Date().toISOString()
        },
        error: 'Network error'
      };
    }
  }

  async getConversationHistory(conversationId: string) {
    try {
      const response = await fetch(`${this.baseURL}/api/conversation/${conversationId}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      return { success: false, error: 'Failed to fetch conversation history' };
    }
  }

  async reportEmergency(message: string, userId: string, location?: string) {
    try {
      const response = await fetch(`${this.baseURL}/api/emergency`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          userId,
          conversationId: this.conversationId,
          location,
          timestamp: new Date().toISOString()
        }),
      });

      return await response.json();
    } catch (error) {
      console.error('Emergency service error:', error);
      return {
        success: false,
        error: 'Emergency service unavailable'
      };
    }
  }

  async checkServiceHealth() {
    try {
      const response = await fetch(`${this.baseURL}/api/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      return { success: false, status: 'unhealthy' };
    }
  }

  getConversationId(): string | null {
    if (!this.conversationId) {
      // Try to restore from localStorage
      this.conversationId = localStorage.getItem('samvaad_conversation_id');
    }
    return this.conversationId;
  }

  setConversationId(id: string | null) {
    this.conversationId = id;
    if (id) {
      localStorage.setItem('samvaad_conversation_id', id);
    } else {
      localStorage.removeItem('samvaad_conversation_id');
    }
  }

  resetConversation() {
    this.conversationId = null;
    localStorage.removeItem('samvaad_conversation_id');
  }

  // Enhanced bot response with better conversation flow
  getEnhancedResponse(message: string, previousResponse?: string): string {
    const lowerMessage = message.toLowerCase();
    
    // Emergency keywords detection
    const emergencyKeywords = ['suicide', 'kill myself', 'end it all', 'self harm', 'hurt myself', 'want to die'];
    if (emergencyKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return "I'm really concerned about what you're sharing with me. You matter so much, and I want you to get the immediate support you deserve. Please reach out to a crisis counselor right now - call 988 or text HOME to 741741. You don't have to face this alone.";
    }

    // Contextual responses based on conversation flow
    if (previousResponse && previousResponse.includes('breathing')) {
      if (lowerMessage.includes('better') || lowerMessage.includes('helped')) {
        return "I'm so glad that helped! Your body's stress response is calming down. Sometimes it's amazing how much power we have to help ourselves feel better. How are you feeling right now?";
      }
    }

    // Emotion-specific responses
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety')) {
      return "Anxiety can feel so overwhelming, and it's completely understandable that you're struggling with it. You're not alone in this - so many students experience anxiety. Would you like to try a quick grounding technique that might help right now?";
    }

    if (lowerMessage.includes('lonely') || lowerMessage.includes('isolated')) {
      return "Feeling lonely is really hard, especially when you're trying to manage everything else in your life. It takes courage to reach out, and I'm glad you're here talking with me. You matter, and your feelings are completely valid. What's been making you feel most isolated lately?";
    }

    if (lowerMessage.includes('exam') || lowerMessage.includes('test') || lowerMessage.includes('grade')) {
      return "Academic pressure can be intense, and it sounds like you're really feeling the weight of it. Remember that your worth isn't determined by your grades - you're so much more than your academic performance. Let's talk about some ways to manage this stress. What's feeling most overwhelming about your exams right now?";
    }

    if (lowerMessage.includes('sleep') || lowerMessage.includes('tired') || lowerMessage.includes('exhausted')) {
      return "Not getting enough sleep can make everything feel so much harder. Your body and mind need that rest to function well. Sleep troubles often go hand-in-hand with stress. Have you noticed anything specific that's been keeping you awake or affecting your sleep?";
    }

    // Positive responses
    if (lowerMessage.includes('better') || lowerMessage.includes('good') || lowerMessage.includes('thank you')) {
      return "That's wonderful to hear! I'm so proud of you for working through this and for taking care of yourself. It takes real strength to reach out and work on feeling better. How can I continue to support you?";
    }

    // Default empathetic response
    return "I hear you, and I want you to know that what you're feeling matters. Sometimes just having someone listen can make a difference. I'm here with you right now. Can you tell me a bit more about what's been on your mind lately?";
  }
}

export default new ChatService();
