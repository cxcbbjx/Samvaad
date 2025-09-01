import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  MessageCircle,
  BarChart3,
  Users,
  AlertTriangle,
  Search,
  Filter,
  ArrowLeft,
  Brain,
  TrendingUp,
  Clock,
  User,
  MessageSquare,
  Heart,
  GraduationCap,
  Phone,
  Calendar,
  Activity,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

type TabType = "live-chats" | "analytics" | "student-profiles";

interface LiveChat {
  id: string;
  studentId: string;
  studentName: string;
  topic: string;
  duration: string;
  messages: number;
  urgency: "low" | "medium" | "high";
  lastMessage: string;
  timestamp: Date;
}

interface StudentProfile {
  id: string;
  name: string;
  totalSessions: number;
  lastSession: Date;
  riskLevel: "low" | "medium" | "high";
  topics: string[];
  notes: string;
}

const mockLiveChats: LiveChat[] = [
  {
    id: "1",
    studentId: "s1",
    studentName: "Anonymous Student #1",
    topic: "Exam Anxiety",
    duration: "15 min",
    messages: 23,
    urgency: "high",
    lastMessage: "I can't sleep and the exam is tomorrow...",
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: "2",
    studentId: "s2", 
    studentName: "Anonymous Student #2",
    topic: "Academic Stress",
    duration: "8 min",
    messages: 12,
    urgency: "medium",
    lastMessage: "Thank you, that helps a lot",
    timestamp: new Date(Date.now() - 15 * 60 * 1000)
  }
];

const mockStudentProfiles: StudentProfile[] = [
  {
    id: "s1",
    name: "Anonymous Student #1",
    totalSessions: 5,
    lastSession: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    riskLevel: "high",
    topics: ["Exam Anxiety", "Sleep Issues", "Academic Pressure"],
    notes: "Recurring anxiety patterns before exams. Recommended breathing exercises."
  },
  {
    id: "s2",
    name: "Anonymous Student #2", 
    totalSessions: 3,
    lastSession: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    riskLevel: "medium",
    topics: ["Time Management", "Study Strategies"],
    notes: "Making good progress with study planning techniques."
  }
];

export default function PsychologistDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("live-chats");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarItems = [
    { id: "live-chats", label: "Live Chats", icon: MessageCircle, count: mockLiveChats.length },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "student-profiles", label: "Student Profiles", icon: Users, count: mockStudentProfiles.length }
  ] as const;

  const getUrgencyColor = (urgency: LiveChat["urgency"]) => {
    switch (urgency) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "low":
        return "bg-success/10 text-success border-success/20";
    }
  };

  const getRiskColor = (risk: StudentProfile["riskLevel"]) => {
    switch (risk) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "low":
        return "bg-success/10 text-success border-success/20";
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  const renderLiveChats = () => (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="text-xl lg:text-2xl font-bold text-foreground">Live Conversations</h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1 lg:flex-none">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full lg:w-64"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 lg:mr-2" />
            <span className="hidden lg:inline">Filter</span>
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {mockLiveChats.map((chat) => (
          <Card key={chat.id} className="border-border/50 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{chat.studentName}</h3>
                      <p className="text-sm text-muted-foreground">{chat.topic}</p>
                    </div>
                    <Badge variant="outline" className={getUrgencyColor(chat.urgency)}>
                      {chat.urgency} priority
                    </Badge>
                    {chat.urgency === "high" && (
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-3 mb-3">
                    <p className="text-sm text-foreground italic">"{chat.lastMessage}"</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {chat.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {chat.messages} messages
                    </span>
                    <span>{formatTime(chat.timestamp)}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Monitor
                  </Button>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Join Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs lg:text-sm text-muted-foreground">Total Sessions Today</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 lg:w-5 lg:h-5 text-primary" />
              <span className="text-xl lg:text-2xl font-bold">12</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs lg:text-sm text-muted-foreground">Avg Session Time</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 lg:w-5 lg:h-5 text-success" />
              <span className="text-xl lg:text-2xl font-bold">8.5</span>
              <span className="text-xs lg:text-sm text-muted-foreground">min</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs lg:text-sm text-muted-foreground">High Priority</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 lg:w-5 lg:h-5 text-destructive" />
              <span className="text-xl lg:text-2xl font-bold">3</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs lg:text-sm text-muted-foreground">Active Students</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 lg:w-5 lg:h-5 text-warning" />
              <span className="text-xl lg:text-2xl font-bold">24</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Common Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { topic: "Exam Stress", count: 15, color: "bg-destructive/10 text-destructive" },
                { topic: "Academic Pressure", count: 12, color: "bg-warning/10 text-warning" },
                { topic: "Time Management", count: 8, color: "bg-primary/10 text-primary" },
                { topic: "Social Anxiety", count: 6, color: "bg-success/10 text-success" }
              ].map(item => (
                <div key={item.topic} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.topic}</span>
                  <Badge variant="outline" className={item.color}>
                    {item.count}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Sentiment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Positive Interactions</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-success/20 rounded-full">
                    <div className="w-16 h-2 bg-success rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">67%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Neutral Interactions</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted/50 rounded-full">
                    <div className="w-8 h-2 bg-muted-foreground rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">25%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Concerning Interactions</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-destructive/20 rounded-full">
                    <div className="w-2 h-2 bg-destructive rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">8%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStudentProfiles = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Student Profiles</h2>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-64"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {mockStudentProfiles.map((student) => (
          <Card key={student.id} className="border-border/50 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{student.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getRiskColor(student.riskLevel)}>
                          {student.riskLevel} risk
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {student.totalSessions} sessions
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-medium text-foreground mb-1">Recent Topics:</p>
                    <div className="flex flex-wrap gap-1">
                      {student.topics.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-3 mb-3">
                    <p className="text-sm text-foreground">{student.notes}</p>
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Last session: {formatTime(student.lastSession)}
                  </p>
                </div>
                
                <div className="flex flex-col gap-2">
                  <Button variant="outline" size="sm">
                    View History
                  </Button>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Add Note
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "live-chats":
        return renderLiveChats();
      case "analytics":
        return renderAnalytics();
      case "student-profiles":
        return renderStudentProfiles();
      default:
        return renderLiveChats();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={cn(
          "w-64 bg-sidebar border-r border-sidebar-border min-h-screen transition-transform duration-300 z-50",
          "lg:relative lg:translate-x-0",
          sidebarOpen ? "fixed translate-x-0" : "fixed -translate-x-full lg:translate-x-0"
        )}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-sidebar-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-bold text-sidebar-foreground">MindSupport</h1>
                  <p className="text-xs text-sidebar-foreground/70">Psychologist Portal</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-sidebar-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <nav className="space-y-2">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    activeTab === item.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {"count" in item && item.count && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.count}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="absolute bottom-6 left-6 right-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="w-full text-sidebar-foreground hover:bg-sidebar-accent/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:p-8 p-4">
          {/* Mobile Header */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="text-foreground"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <h1 className="font-semibold text-foreground">
                {sidebarItems.find(item => item.id === activeTab)?.label}
              </h1>
              <div></div>
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
}
