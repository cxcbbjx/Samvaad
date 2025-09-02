# SAMVAAD AI System Setup Guide

## 🤖 Overview

SAMVAAD now features a sophisticated AI backend using:
- **RAG (Retrieval-Augmented Generation)** with Weaviate vector database
- **BERT** for semantic encoding and similarity matching
- **OpenAI GPT-4** for human-like conversation generation
- **Multi-language support** with automatic language detection
- **Context-aware conversations** with user profiling
- **Crisis intervention** capabilities

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
npm install
```

The following AI/ML packages are now included:
- `openai` - GPT-4 integration
- `weaviate-ts-client` - Vector database client
- `@xenova/transformers` - BERT embeddings
- `franc` - Language detection
- `uuid` - Conversation ID generation

### 2. Set Up Weaviate (Vector Database)

**Option A: Docker (Recommended)**
```bash
docker run -p 8080:8080 \
  -e QUERY_DEFAULTS_LIMIT=25 \
  -e AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED=true \
  -e PERSISTENCE_DATA_PATH='/var/lib/weaviate' \
  -e DEFAULT_VECTORIZER_MODULE='none' \
  semitechnologies/weaviate:1.22.4
```

**Option B: Docker Compose**
Create `docker-compose.yml`:
```yaml
version: '3.4'
services:
  weaviate:
    image: semitechnologies/weaviate:1.22.4
    ports:
      - 8080:8080
    environment:
      QUERY_DEFAULTS_LIMIT: 25
      AUTHENTICATION_ANONYMOUS_ACCESS_ENABLED: 'true'
      PERSISTENCE_DATA_PATH: '/var/lib/weaviate'
      DEFAULT_VECTORIZER_MODULE: 'none'
    volumes:
      - weaviate_data:/var/lib/weaviate
volumes:
  weaviate_data:
```

Then run: `docker-compose up -d`

### 3. Configure Environment Variables

Create a `.env` file with:

```env
# Required: OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key-here

# Weaviate Configuration
WEAVIATE_HOST=localhost:8080

# Server Configuration
PORT=3000
NODE_ENV=development
PING_MESSAGE="SAMVAAD AI is running"
```

### 4. Get OpenAI API Key

1. Go to [OpenAI API](https://platform.openai.com/api-keys)
2. Create a new API key
3. Add it to your `.env` file

## 🏗️ Architecture

### Backend Structure

```
server/
├── services/
│   └── AIService.ts          # Main AI orchestration
├── routes/
│   ├── chat.ts              # Chat API endpoints
│   └── demo.ts              # Legacy demo route
├── config/
│   └── weaviate.ts          # Vector DB configuration
└── index.ts                 # Updated server setup

client/
├── services/
│   └── chatService.ts       # Frontend AI service
└── pages/
    └── StudentChat.tsx      # Updated to use AI
```

### Key Features

**🧠 AI Service (`server/services/AIService.ts`)**
- RAG system with mental health knowledge base
- BERT embeddings for semantic search
- GPT-4 integration with conversation context
- Multi-language support (English, Hindi, Spanish, French, etc.)
- Crisis detection and intervention
- User profiling and risk assessment

**💬 Chat Service (`client/services/chatService.ts`)**
- Real-time AI communication
- Conversation persistence
- Emergency response handling
- Service health monitoring
- Fallback responses for offline mode

**📚 Knowledge Base**
Pre-loaded with:
- Anxiety management techniques
- Academic stress guidance
- Time management strategies
- Crisis intervention resources
- Sleep and wellness tips
- Social support advice

## 🌐 API Endpoints

### Chat API
```
POST /api/chat
{
  "message": "I'm feeling anxious about exams",
  "userId": "user123",
  "conversationId": "optional-conversation-id",
  "userProfile": {
    "name": "Student",
    "preferredLanguage": "en"
  }
}
```

### Conversation History
```
GET /api/conversation/:conversationId
```

### Health Check
```
GET /api/health
```

### Emergency Response
```
POST /api/emergency
{
  "message": "crisis message",
  "userId": "user123",
  "location": "optional"
}
```

## 🤖 How It Works

1. **User sends message** → Language detected automatically
2. **BERT encoding** → Query converted to semantic embeddings
3. **RAG search** → Relevant knowledge retrieved from Weaviate
4. **Context building** → Conversation history + knowledge + user profile
5. **GPT-4 generation** → Human-like response in user's language
6. **Response delivery** → Natural, empathetic conversation

## 🛡️ Safety Features

- **Crisis detection** - Identifies emergency situations
- **Risk assessment** - Tracks user mental health indicators
- **Human escalation** - Routes to counselors when needed
- **Privacy protection** - Secure conversation handling
- **Multi-language support** - Responds in user's language

## 🔧 Development

### Start the Development Server
```bash
npm run dev
```

### Test AI Service
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I am feeling very anxious about my upcoming exams",
    "userId": "test-user"
  }'
```

### Check Service Health
```bash
curl http://localhost:3000/api/health
```

## 🎯 Conversation Examples

**English:**
- User: "I'm stressed about exams"
- SAMVAAD: "I understand exam stress can feel overwhelming. You're not alone in this - many students experience this pressure. Let's work through some techniques that can help you feel more in control..."

**Hindi:**
- User: "मुझे परीक्षा की चिंत��� हो रही है"
- SAMVAAD: "मैं समझ सकता हूं कि परीक्षा की चिंता कितनी परेशान करने वाली हो सकती है। आप इसमें अकेले नहीं हैं - कई छात्र इस दबाव का अनुभव करते हैं..."

## 🚨 Production Deployment

For production, ensure:
1. **OpenAI API key** is properly secured
2. **Weaviate** is running on a stable server
3. **Environment variables** are configured
4. **Monitoring** is set up for API usage
5. **Backup** strategy for conversation data

## 🔍 Monitoring

The system includes:
- Health check endpoints
- Error logging and handling
- API usage tracking
- Conversation analytics
- Crisis alert system

## 📝 Next Steps

1. **Set up OpenAI API key** in environment variables
2. **Start Weaviate** using Docker
3. **Test the chat system** with the new AI backend
4. **Monitor conversations** for quality and safety
5. **Expand knowledge base** with more mental health resources

The AI system is now ready to provide sophisticated, human-like mental health support to students in multiple languages! 🎉
