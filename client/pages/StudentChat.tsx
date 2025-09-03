import React, { useState, useRef, useEffect } from "react";
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
  LogOut,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Settings,
  MoreVertical,
  Copy,
  Share
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
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Prevent zoom on input focus (iOS Safari)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') {
        document.querySelector('meta[name=viewport]')?.setAttribute(
          'content',
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        );
      }
    };

    const handleTouchEnd = () => {
      setTimeout(() => {
        document.querySelector('meta[name=viewport]')?.setAttribute(
          'content',
          'width=device-width, initial-scale=1, user-scalable=no'
        );
      }, 500);
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  const playSound = (type: 'send' | 'receive') => {
    if (!soundEnabled) return;

    // Create audio context for notification sounds
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = type === 'send' ? 800 : 400;
    gainNode.gain.value = 0.1;

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handleSendMessage = async (content?: string) => {
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
    playSound('send');

    // Blur input to hide keyboard on mobile
    inputRef.current?.blur();

    try {
      // Import the chat service dynamically
      const { default: chatService } = await import("@/services/chatService");

      // Send message to AI service
      const response = await chatService.sendMessage(
        messageContent,
        user?.id || 'anonymous',
        {
          name: user?.name,
          preferredLanguage: 'auto' // Let the AI detect the language
        }
      );

      let botResponseContent;
      if (response.success) {
        botResponseContent = response.data.response;
      } else {
        // Fallback to enhanced local response
        botResponseContent = chatService.getEnhancedResponse(messageContent);
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponseContent,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botResponse]);
      playSound('receive');
    } catch (error) {
      console.error('Error sending message:', error);

      // Fallback response
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: isOnline
          ? "I'm here to listen and support you. Can you tell me more about what's on your mind?"
          : "I'm here for you even offline. While I can't process this message right now, I'll respond as soon as you're back online. Your message is important.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      playSound('receive');
    } finally {
      setIsTyping(false);
    }
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
    setShowOptions(false);
  };

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    // Show toast or feedback
  };

  const shareMessage = (content: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'SAMVAAD Conversation',
        text: content,
      });
    } else {
      copyMessage(content);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/5 flex flex-col">
      {/* Header */}
      <div className="bg-card/95 backdrop-blur-md border-b border-border/50 sticky top-0 z-10 safe-area-inset-top">
        <div className="px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/home')}
                className="text-muted-foreground hover:text-foreground p-2 sm:px-3"
              >
                <ArrowLeft className="w-4 h-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <div className="flex items-center gap-2 sm:gap-3 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="font-semibold text-foreground text-sm sm:text-base truncate">SAMVAAD</h1>
                  <p className="text-xs flex items-center gap-1">
                    {isOnline ? (
                      <>
                        <Wifi className="w-3 h-3 text-success" />
                        <span className="text-success">Online</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Offline</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-muted-foreground p-2"
                title={soundEnabled ? 'Disable sounds' : 'Enable sounds'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOptions(!showOptions)}
                className="text-muted-foreground p-2 sm:hidden"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/student/profile')}
                  className="text-muted-foreground"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-destructive hover:border-destructive/50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Options Menu */}
      {showOptions && (
        <div className="sm:hidden bg-card border-b border-border/50 px-4 py-2">
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigate('/student/profile');
                setShowOptions(false);
              }}
              className="text-muted-foreground flex-1"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleLogout();
                setShowOptions(false);
              }}
              className="text-muted-foreground hover:text-destructive hover:border-destructive/50 flex-1"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        {/* Quick Options */}
        <div className="px-4 py-3 sm:py-6 border-b border-border/30">
          <p className="text-sm text-muted-foreground mb-3">Quick topics to get started:</p>
          <div className="flex flex-wrap gap-2">
            {quickOptions.map((option) => (
              <Badge
                key={option.label}
                variant="outline"
                className={cn(
                  "cursor-pointer hover:bg-opacity-20 transition-all duration-200 px-3 py-2 touch-manipulation",
                  option.color
                )}
                onClick={() => handleQuickOption(`I need help with ${option.label.toLowerCase()}`)}
              >
                <option.icon className="w-3 h-3 mr-1" />
                <span className="text-xs sm:text-sm">{option.label}</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-hidden">
          <div
            ref={chatContainerRef}
            className="h-full overflow-y-auto px-4 py-3 space-y-4 scroll-smooth"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%] group",
                  message.isUser ? "ml-auto flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  message.isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground border border-border"
                )}>
                  {message.isUser ? (
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  ) : (
                    <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-sm relative",
                    message.isUser
                      ? "bg-primary text-primary-foreground rounded-tr-md"
                      : "bg-card text-card-foreground border border-border rounded-tl-md"
                  )}>
                    <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">{message.content}</p>
                    <div className={cn(
                      "flex items-center justify-between mt-2 text-xs opacity-70",
                      message.isUser ? "flex-row-reverse" : ""
                    )}>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(message.timestamp)}
                      </div>
                      {!message.isUser && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyMessage(message.content)}
                            className="h-6 w-6 p-0 hover:bg-muted/50"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          {navigator.share && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => shareMessage(message.content)}
                              className="h-6 w-6 p-0 hover:bg-muted/50"
                            >
                              <Share className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
              
            {isTyping && (
              <div className="flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%]">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-muted text-muted-foreground border border-border">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div className="bg-card text-card-foreground border border-border rounded-2xl rounded-tl-md px-3 py-2 sm:px-4 sm:py-3">
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
        </div>

        {/* Input Area */}
        <div className="border-t border-border/50 bg-card/95 backdrop-blur-sm" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <div className="p-3 sm:p-4">
            {!isOnline && (
              <div className="mb-3 p-2 bg-warning/10 border border-warning/20 rounded-lg">
                <p className="text-xs text-warning flex items-center gap-2">
                  <WifiOff className="w-3 h-3" />
                  You're offline. Messages will be sent when connection is restored.
                </p>
              </div>
            )}
            <div className="flex gap-2 sm:gap-3">
              <div className="flex-1 flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Share what's on your mind..."
                  className="border-border/50 focus:border-primary/50 text-base"
                  onKeyPress={handleKeyPress}
                  disabled={isTyping}
                  style={{ fontSize: '16px' }} // Prevent zoom on iOS
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0 border-border/50 hover:bg-muted/50 touch-manipulation"
                  title="Voice input"
                  disabled
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isTyping}
                className="bg-primary hover:bg-primary/90 touch-manipulation px-3 sm:px-4"
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Your conversations are private and confidential
            </p>
          </div>
        </div>
      </div>

      {/* Floating Help Button */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-20">
        <Button
          size="lg"
          className="rounded-full w-12 h-12 sm:w-14 sm:h-14 bg-destructive hover:bg-destructive/90 shadow-lg touch-manipulation"
          title="Emergency Support"
          onClick={() => window.open('tel:988', '_self')}
        >
          <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
      </div>
    </div>
  );
}
