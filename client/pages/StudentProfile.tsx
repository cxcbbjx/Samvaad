import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MessageCircle,
  Calendar,
  Clock,
  TrendingUp,
  Heart,
  GraduationCap,
  Shield,
  Download,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ChatSession {
  id: string;
  date: Date;
  duration: string;
  messages: number;
  topic: string;
  mood: "positive" | "neutral" | "concerned";
}

const mockChatHistory: ChatSession[] = [
  {
    id: "1",
    date: new Date(2024, 0, 15, 14, 30),
    duration: "12 min",
    messages: 18,
    topic: "Exam Stress",
    mood: "concerned"
  },
  {
    id: "2", 
    date: new Date(2024, 0, 12, 16, 45),
    duration: "8 min",
    messages: 12,
    topic: "Academic Query",
    mood: "neutral"
  },
  {
    id: "3",
    date: new Date(2024, 0, 10, 19, 20),
    duration: "15 min", 
    messages: 22,
    topic: "Counseling Help",
    mood: "positive"
  }
];

const getMoodColor = (mood: ChatSession["mood"]) => {
  switch (mood) {
    case "positive":
      return "bg-success/10 text-success border-success/20";
    case "neutral":
      return "bg-muted/50 text-muted-foreground border-border";
    case "concerned":
      return "bg-warning/10 text-warning border-warning/20";
  }
};

const getMoodLabel = (mood: ChatSession["mood"]) => {
  switch (mood) {
    case "positive":
      return "Positive";
    case "neutral":
      return "Neutral";
    case "concerned":
      return "Needs Support";
  }
};

export default function StudentProfile() {
  const navigate = useNavigate();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
                onClick={() => navigate('/student')}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Chat
              </Button>
              <h1 className="text-xl font-semibold text-foreground">Your Profile</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Sessions</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">{mockChatHistory.length}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Conversations completed</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Time</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-success" />
                <span className="text-2xl font-bold text-foreground">35</span>
                <span className="text-sm text-muted-foreground">min</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Time supported</p>
            </CardContent>
          </Card>

          <Card className="border-border/50 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Progress</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-warning" />
                <span className="text-2xl font-bold text-foreground">+2</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Sessions this week</p>
            </CardContent>
          </Card>
        </div>

        {/* Chat History */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Chat History
              </CardTitle>
              <Button variant="outline" size="sm" className="text-muted-foreground">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockChatHistory.map((session, index) => (
                <div key={session.id}>
                  <div className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-lg transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-foreground">{session.topic}</h3>
                          <Badge
                            variant="outline"
                            className={getMoodColor(session.mood)}
                          >
                            {getMoodLabel(session.mood)}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(session.date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(session.date)}
                          </span>
                          <span>{session.duration}</span>
                          <span>{session.messages} messages</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-muted-foreground">
                      View Details
                    </Button>
                  </div>
                  {index < mockChatHistory.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Support Resources */}
        <Card className="border-border/50 shadow-sm mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-success" />
              Support Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-success" />
                  <h4 className="font-medium text-foreground">Academic Support</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Get help with study strategies, time management, and academic planning.
                </p>
                <Button variant="outline" size="sm" className="text-success border-success/20">
                  Learn More
                </Button>
              </div>
              
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <h4 className="font-medium text-foreground">Crisis Support</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  24/7 emergency support for urgent mental health concerns.
                </p>
                <Button variant="outline" size="sm" className="text-primary border-primary/20">
                  Get Help Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
