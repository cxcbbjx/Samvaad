import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Star, 
  Clock, 
  Users, 
  MessageCircle,
  Lightbulb,
  Globe,
  Shield,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DemoDataService, demoConversations } from "@/services/demoData";
import type { DemoConversation } from "@/services/demoData";

interface DemoModeProps {
  onSelectConversation: (conversation: any) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function DemoMode({ onSelectConversation, onClose, isOpen }: DemoModeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const categories = [
    { id: "all", name: "All Scenarios", icon: MessageCircle, color: "text-primary" },
    { id: "Academic Stress", name: "Academic Stress", icon: Users, color: "text-orange-500" },
    { id: "Relationship Issues", name: "Relationships", icon: Star, color: "text-pink-500" },
    { id: "Crisis Support", name: "Crisis Support", icon: Shield, color: "text-red-500" },
    { id: "Social Support", name: "Social Issues", icon: Globe, color: "text-green-500" },
    { id: "Academic Support", name: "Study Help", icon: Lightbulb, color: "text-blue-500" }
  ];

  const filteredConversations = selectedCategory === "all" 
    ? demoConversations 
    : demoConversations.filter(conv => conv.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors = {
      "Academic Stress": "bg-orange-100 text-orange-800 border-orange-200",
      "Relationship Issues": "bg-pink-100 text-pink-800 border-pink-200", 
      "Crisis Support": "bg-red-100 text-red-800 border-red-200",
      "Social Support": "bg-green-100 text-green-800 border-green-200",
      "Academic Support": "bg-blue-100 text-blue-800 border-blue-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Demo Mode</h2>
              <p className="text-muted-foreground">
                Showcase SAMVAAD's capabilities with pre-designed conversation scenarios
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Category Sidebar */}
          <div className="w-64 border-r border-border p-4 overflow-y-auto">
            <h3 className="font-semibold text-foreground mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left",
                    selectedCategory === category.id
                      ? "bg-primary/10 text-primary border border-primary/20"
                      : "hover:bg-muted text-muted-foreground"
                  )}
                >
                  <category.icon className={cn("w-4 h-4", category.color)} />
                  <span className="font-medium text-sm">{category.name}</span>
                </button>
              ))}
            </div>

            {/* Demo Stats */}
            <div className="mt-6 p-3 bg-muted/30 rounded-lg">
              <h4 className="font-semibold text-sm text-foreground mb-2">Demo Statistics</h4>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Conversations:</span>
                  <span className="font-medium">{demoConversations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Rating:</span>
                  <span className="font-medium">4.7/5</span>
                </div>
                <div className="flex justify-between">
                  <span>Languages:</span>
                  <span className="font-medium">2</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-4">
              {filteredConversations.map((conversation) => (
                <Card 
                  key={conversation.id} 
                  className="border-border/50 hover:shadow-md transition-all cursor-pointer group"
                  onClick={() => onSelectConversation(conversation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {conversation.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {conversation.description}
                        </p>
                      </div>
                      <Button 
                        size="sm" 
                        className="ml-3 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Start
                      </Button>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <Badge 
                        variant="outline" 
                        className={getCategoryColor(conversation.category)}
                      >
                        {conversation.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {conversation.duration}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {conversation.satisfaction}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MessageCircle className="w-3 h-3" />
                        {conversation.messages.length} messages
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground font-medium mb-1">Outcome:</p>
                      <p className="text-sm text-foreground">{conversation.outcome}</p>
                    </div>

                    {/* Preview of first user message */}
                    <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <p className="text-xs text-primary font-medium mb-1">First Message Preview:</p>
                      <p className="text-sm text-foreground italic">
                        "{conversation.messages.find(m => m.isUser)?.content.substring(0, 100)}..."
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              These conversations demonstrate SAMVAAD's AI capabilities across various mental health scenarios
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <Shield className="w-3 h-3 mr-1" />
                Safe Demo Data
              </Badge>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <Lightbulb className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
