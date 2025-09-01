import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Send,
  Mic,
  User,
  Bot,
  Heart,
  GraduationCap,
  Phone,
  ArrowLeft,
  Clock,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const quickOptions = [
  { label: "Exam Stress", icon: GraduationCap, color: "bg-primary/10 text-primary" },
  { label: "Counseling Help", icon: Heart, color: "bg-success/10 text-success" },
  { label: "Academic Query", icon: GraduationCap, color: "bg-warning/10 text-warning" },
  { label: "Crisis Support", icon: Phone, color: "bg-destructive/10 text-destructive" },
];

export default function StudentChat() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm here to support you. How are you feeling today? You can share whatever is on your mind, and I'll do my best to help.",
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (content?: string) => {
    const messageContent = content || inputValue.trim();
    if (!messageContent) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageContent,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(messageContent),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("stress") || lowerMessage.includes("exam")) {
      return "I understand that exams can be really stressful. It's completely normal to feel overwhelmed. Have you tried any relaxation techniques like deep breathing or short breaks during study sessions? I'm here to help you work through this.";
    }
    
    if (lowerMessage.includes("help") || lowerMessage.includes("counseling")) {
      return "I'm glad you're reaching out for support - that takes courage. While I can provide immediate guidance, I can also connect you with our professional counselors if you'd like to speak with someone. What specific area would you like help with?";
    }
    
    if (lowerMessage.includes("academic") || lowerMessage.includes("study")) {
      return "Academic challenges are something many students face. Let's break this down together. What specific academic area are you struggling with? Sometimes organizing our thoughts and creating a plan can make things feel more manageable.";
    }
    
    return "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about how you're feeling or what specific support you might need right now?";
  };

  const handleQuickOption = (option: string) => {
    handleSendMessage(option);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/5">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="font-semibold text-foreground">MindSupport Bot</h1>
                  <p className="text-xs text-success flex items-center gap-1">
                    <span className="w-2 h-2 bg-success rounded-full"></span>
                    Always here for you
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/student/profile')}
              className="text-muted-foreground"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Quick Options */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">Quick topics to get started:</p>
          <div className="flex flex-wrap gap-2">
            {quickOptions.map((option) => (
              <Badge
                key={option.label}
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-opacity-20 transition-all duration-200 px-3 py-2",
                  option.color
                )}
                onClick={() => handleQuickOption(`I need help with ${option.label.toLowerCase()}`)}
              >
                <option.icon className="w-3 h-3 mr-1" />
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Messages */}
        <Card className="mb-6 border-border/50 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 max-w-[80%]",
                    message.isUser ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    message.isUser 
                      ? "bg-chat-user text-chat-user-foreground" 
                      : "bg-chat-bot text-chat-bot-foreground border border-border"
                  )}>
                    {message.isUser ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={cn(
                    "rounded-2xl px-4 py-3 shadow-sm",
                    message.isUser
                      ? "bg-chat-user text-chat-user-foreground rounded-tr-md"
                      : "bg-chat-bot text-chat-bot-foreground border border-border rounded-tl-md"
                  )}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className={cn(
                      "flex items-center gap-1 mt-2 text-xs opacity-70",
                      message.isUser ? "justify-end" : "justify-start"
                    )}>
                      <Clock className="w-3 h-3" />
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-chat-bot text-chat-bot-foreground border border-border">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-chat-bot text-chat-bot-foreground border border-border rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Input Area */}
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="flex-1 flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Share what's on your mind..."
                  className="border-border/50 focus:border-primary/50"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0 border-border/50 hover:bg-muted/50"
                  title="Voice input"
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Your conversations are private and confidential. Press Enter to send.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Floating Help Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          size="lg"
          className="rounded-full w-14 h-14 bg-destructive hover:bg-destructive/90 shadow-lg"
          title="Emergency Support"
        >
          <Phone className="w-6 h-6" />
        </Button>
      </div>
    </div>
  );
}
