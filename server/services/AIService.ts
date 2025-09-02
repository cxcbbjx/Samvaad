import OpenAI from 'openai';
import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';
import { pipeline, Pipeline } from '@xenova/transformers';
import { franc } from 'franc';
import { v4 as uuidv4 } from 'uuid';

interface ConversationContext {
  userId: string;
  conversationId: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    language?: string;
    sentiment?: string;
  }>;
  userProfile?: {
    name?: string;
    preferredLanguage?: string;
    concerns?: string[];
    riskLevel?: 'low' | 'medium' | 'high';
  };
}

interface RAGResult {
  content: string;
  relevanceScore: number;
  source: string;
  category: string;
}

class AIService {
  private openai: OpenAI;
  private weaviateClient: WeaviateClient;
  private bertEncoder: Pipeline | null = null;
  private languageDetector: any;
  private conversationContexts: Map<string, ConversationContext> = new Map();

  constructor() {
    // Initialize OpenAI
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Initialize Weaviate (using local instance for prototype)
    this.weaviateClient = weaviate.client({
      scheme: 'http',
      host: process.env.WEAVIATE_HOST || 'localhost:8080',
      apiKey: process.env.WEAVIATE_API_KEY ? new ApiKey(process.env.WEAVIATE_API_KEY) : undefined,
    });

    this.initializeServices();
  }

  private async initializeServices() {
    try {
      // Initialize BERT encoder for semantic similarity
      this.bertEncoder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      
      // Setup Weaviate schema if not exists
      await this.setupWeaviateSchema();
      
      // Load mental health knowledge base
      await this.loadKnowledgeBase();
      
      console.log('AI Services initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AI services:', error);
    }
  }

  private async setupWeaviateSchema() {
    try {
      const schemaExists = await this.weaviateClient.schema
        .classGetter()
        .withClassName('KnowledgeBase')
        .do();

      if (!schemaExists) {
        const classObj = {
          class: 'KnowledgeBase',
          description: 'Mental health and student support knowledge base',
          properties: [
            {
              name: 'content',
              dataType: ['text'],
              description: 'The knowledge content',
            },
            {
              name: 'category',
              dataType: ['string'],
              description: 'Category of knowledge (mental_health, academic, crisis, etc.)',
            },
            {
              name: 'language',
              dataType: ['string'],
              description: 'Language of the content',
            },
            {
              name: 'tags',
              dataType: ['string[]'],
              description: 'Relevant tags for the content',
            },
            {
              name: 'source',
              dataType: ['string'],
              description: 'Source of the information',
            },
          ],
          vectorizer: 'none', // We'll use BERT embeddings
        };

        await this.weaviateClient.schema.classCreator().withClass(classObj).do();
        console.log('Weaviate schema created successfully');
      }
    } catch (error) {
      console.error('Error setting up Weaviate schema:', error);
    }
  }

  private async loadKnowledgeBase() {
    // Mental health and student support knowledge base
    const knowledgeItems = [
      {
        content: "Deep breathing exercises can help manage anxiety. Try the 4-7-8 technique: breathe in for 4 counts, hold for 7, exhale for 8. This activates your parasympathetic nervous system and promotes relaxation.",
        category: "anxiety_management",
        language: "en",
        tags: ["breathing", "anxiety", "relaxation", "technique"],
        source: "clinical_psychology"
      },
      {
        content: "गहरी साँस लेने की तकनीक चिंता को कम करने में मदद कर सकती है। 4-7-8 तकनीक आज़माएं: 4 गिनती में सांस लें, 7 गिनती तक रोकें, 8 गिनती में छोड़ें।",
        category: "anxiety_management", 
        language: "hi",
        tags: ["सांस", "चिंता", "आराम", "तकनीक"],
        source: "clinical_psychology"
      },
      {
        content: "Time management for students: Use the Pomodoro Technique - study for 25 minutes, then take a 5-minute break. This helps maintain focus and prevents burnout.",
        category: "academic_support",
        language: "en",
        tags: ["time_management", "study", "productivity", "pomodoro"],
        source: "educational_psychology"
      },
      {
        content: "छात्रों के लिए समय प्रबंधन: पोमोडोरो तकनीक का उपयोग करें - 25 मिनट पढ़ें, फिर 5 मिनट का ब्रेक लें। यह ध्यान बनाए रखने में मदद करता है।",
        category: "academic_support",
        language: "hi", 
        tags: ["समय_प्रबंधन", "अध्ययन", "उत्पादकता"],
        source: "educational_psychology"
      },
      {
        content: "If you're having thoughts of self-harm, please reach out immediately: National Suicide Prevention Lifeline: 988, Crisis Text Line: Text HOME to 741741. You are not alone.",
        category: "crisis_intervention",
        language: "en",
        tags: ["crisis", "suicide_prevention", "emergency", "help"],
        source: "crisis_intervention"
      },
      {
        content: "Exam stress is normal. Create a study schedule, practice relaxation techniques, get adequate sleep, and remember that your worth isn't determined by grades.",
        category: "exam_stress",
        language: "en", 
        tags: ["exams", "stress", "study_schedule", "self_worth"],
        source: "academic_counseling"
      },
      {
        content: "Building social connections: Join clubs or study groups, attend campus events, be open to new friendships. Quality matters more than quantity in relationships.",
        category: "social_support",
        language: "en",
        tags: ["social", "friendship", "connection", "campus_life"],
        source: "student_services"
      },
      {
        content: "Sleep hygiene for students: Maintain consistent sleep schedule, avoid screens before bed, create a comfortable environment, limit caffeine. Good sleep improves academic performance.",
        category: "wellness",
        language: "en",
        tags: ["sleep", "hygiene", "academic_performance", "health"],
        source: "health_services"
      }
    ];

    try {
      for (const item of knowledgeItems) {
        // Generate embedding using BERT
        const embedding = await this.generateEmbedding(item.content);
        
        await this.weaviateClient.data
          .creator()
          .withClassName('KnowledgeBase')
          .withProperties(item)
          .withVector(embedding)
          .do();
      }
      
      console.log('Knowledge base loaded successfully');
    } catch (error) {
      console.error('Error loading knowledge base:', error);
    }
  }

  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      if (!this.bertEncoder) {
        throw new Error('BERT encoder not initialized');
      }

      const output = await this.bertEncoder(text, { pooling: 'mean', normalize: true });
      return Array.from(output.data);
    } catch (error) {
      console.error('Error generating embedding:', error);
      return [];
    }
  }

  private detectLanguage(text: string): string {
    try {
      const detected = franc(text);
      // Map ISO 639-3 to common language codes
      const languageMap: { [key: string]: string } = {
        'eng': 'en',
        'hin': 'hi',
        'spa': 'es',
        'fra': 'fr',
        'deu': 'de',
        'ben': 'bn',
        'urd': 'ur',
        'tam': 'ta',
        'tel': 'te',
        'guj': 'gu',
        'kan': 'kn',
        'mal': 'ml',
        'pun': 'pa'
      };
      
      return languageMap[detected] || 'en';
    } catch (error) {
      console.error('Language detection error:', error);
      return 'en';
    }
  }

  private async performRAGSearch(query: string, language: string): Promise<RAGResult[]> {
    try {
      const queryEmbedding = await this.generateEmbedding(query);
      
      const result = await this.weaviateClient.graphql
        .get()
        .withClassName('KnowledgeBase')
        .withFields('content category language tags source')
        .withNearVector({ vector: queryEmbedding })
        .withLimit(5)
        .do();

      const ragResults: RAGResult[] = [];
      
      if (result.data?.Get?.KnowledgeBase) {
        for (const item of result.data.Get.KnowledgeBase) {
          ragResults.push({
            content: item.content,
            relevanceScore: 0.8, // Placeholder - Weaviate provides distance
            source: item.source,
            category: item.category
          });
        }
      }

      return ragResults;
    } catch (error) {
      console.error('RAG search error:', error);
      return [];
    }
  }

  private buildSystemPrompt(ragResults: RAGResult[], language: string, userProfile?: any): string {
    const contextInfo = ragResults.map(r => `${r.category}: ${r.content}`).join('\n\n');
    
    const languageInstruction = language === 'en' 
      ? "Respond in English" 
      : `Respond in the same language as the user (${language}). Be natural and fluent.`;

    return `You are SAMVAAD, an empathetic and supportive AI companion for students. You provide mental health support, academic guidance, and personal assistance with warmth and understanding.

PERSONALITY:
- Warm, empathetic, and non-judgmental
- Speak like a caring friend, not a formal counselor
- Use natural, conversational language
- Show genuine concern and validation
- Be encouraging and supportive

GUIDELINES:
- ${languageInstruction}
- Never break character or mention you're an AI
- Focus on the person's feelings and validate their experiences
- Provide practical, actionable advice when appropriate
- If someone is in crisis, gently encourage professional help
- Keep responses conversational and human-like
- Use "I understand", "That sounds really difficult", etc.
- Ask follow-up questions to show you care

KNOWLEDGE CONTEXT:
${contextInfo}

Remember: You're here to listen, support, and help. Be the friend they need right now.`;
  }

  private async analyzeSentiment(text: string): Promise<string> {
    // Simple sentiment analysis - in production, use more sophisticated models
    const negativeWords = ['sad', 'depressed', 'anxious', 'worried', 'scared', 'hopeless', 'overwhelmed'];
    const positiveWords = ['happy', 'good', 'great', 'excited', 'confident', 'proud'];
    
    const lowerText = text.toLowerCase();
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    
    if (negativeCount > positiveCount) return 'negative';
    if (positiveCount > negativeCount) return 'positive';
    return 'neutral';
  }

  public async generateResponse(
    userId: string,
    message: string,
    conversationId?: string
  ): Promise<{
    response: string;
    conversationId: string;
    language: string;
    sentiment: string;
  }> {
    try {
      const currentConversationId = conversationId || uuidv4();
      const language = this.detectLanguage(message);
      const sentiment = await this.analyzeSentiment(message);

      // Get or create conversation context
      let context = this.conversationContexts.get(currentConversationId);
      if (!context) {
        context = {
          userId,
          conversationId: currentConversationId,
          messages: [],
          userProfile: {}
        };
        this.conversationContexts.set(currentConversationId, context);
      }

      // Add user message to context
      context.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
        language,
        sentiment
      });

      // Perform RAG search
      const ragResults = await this.performRAGSearch(message, language);

      // Build conversation history for GPT-4
      const conversationHistory = context.messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Generate response using GPT-4
      const systemPrompt = this.buildSystemPrompt(ragResults, language, context.userProfile);
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      });

      const response = completion.choices[0]?.message?.content || "I understand you're reaching out. Can you tell me more about how you're feeling?";

      // Add assistant response to context
      context.messages.push({
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        language,
        sentiment: 'supportive'
      });

      // Update risk assessment if needed
      if (sentiment === 'negative' || message.toLowerCase().includes('suicide') || message.toLowerCase().includes('harm')) {
        context.userProfile = context.userProfile || {};
        context.userProfile.riskLevel = 'high';
      }

      return {
        response,
        conversationId: currentConversationId,
        language,
        sentiment
      };

    } catch (error) {
      console.error('Error generating response:', error);
      
      // Fallback response
      const language = this.detectLanguage(message);
      const fallbackResponses = {
        en: "I'm here to listen and support you. Can you tell me more about what's on your mind?",
        hi: "मैं आपकी बात सुनने और आपका साथ देने के लिए यहाँ हूँ। क्या आप मुझे बता सकते हैं कि आपके मन में क्या है?",
        es: "Estoy aquí para escucharte y apoyarte. ¿Puedes contarme más sobre lo que tienes en mente?",
        fr: "Je suis là pour vous écouter et vous soutenir. Pouvez-vous me dire ce qui vous préoccupe?"
      };

      return {
        response: fallbackResponses[language as keyof typeof fallbackResponses] || fallbackResponses.en,
        conversationId: conversationId || uuidv4(),
        language,
        sentiment: 'neutral'
      };
    }
  }

  public async getConversationHistory(conversationId: string): Promise<ConversationContext | null> {
    return this.conversationContexts.get(conversationId) || null;
  }

  public async updateUserProfile(conversationId: string, profile: any): Promise<void> {
    const context = this.conversationContexts.get(conversationId);
    if (context) {
      context.userProfile = { ...context.userProfile, ...profile };
    }
  }
}

export default AIService;
