import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
  LogOut,
  Shield,
  Zap,
  Target,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  Meh,
  Download,
  RefreshCw,
  Eye,
  Globe,
  Lightbulb,
  FileText,
  LineChart
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";

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

// Mock data for analytics
const weeklyData = [
  { day: 'Mon', sessions: 24, positive: 18, neutral: 4, negative: 2 },
  { day: 'Tue', sessions: 31, positive: 22, neutral: 6, negative: 3 },
  { day: 'Wed', sessions: 28, positive: 20, neutral: 5, negative: 3 },
  { day: 'Thu', sessions: 35, positive: 25, neutral: 7, negative: 3 },
  { day: 'Fri', sessions: 42, positive: 30, neutral: 8, negative: 4 },
  { day: 'Sat', sessions: 18, positive: 14, neutral: 3, negative: 1 },
  { day: 'Sun', sessions: 15, positive: 12, neutral: 2, negative: 1 }
];

const topicData = [
  { name: 'Exam Stress', value: 35, color: '#ef4444' },
  { name: 'Academic Pressure', value: 28, color: '#f97316' },
  { name: 'Social Anxiety', value: 22, color: '#eab308' },
  { name: 'Time Management', value: 15, color: '#22c55e' },
  { name: 'Sleep Issues', value: 12, color: '#3b82f6' },
  { name: 'Depression', value: 8, color: '#8b5cf6' }
];

const performanceMetrics = [
  { hour: '9AM', responseTime: 2.1, satisfaction: 4.2 },
  { hour: '10AM', responseTime: 1.8, satisfaction: 4.5 },
  { hour: '11AM', responseTime: 2.3, satisfaction: 4.1 },
  { hour: '12PM', responseTime: 2.8, satisfaction: 3.9 },
  { hour: '1PM', responseTime: 3.2, satisfaction: 3.7 },
  { hour: '2PM', responseTime: 2.5, satisfaction: 4.3 },
  { hour: '3PM', responseTime: 1.9, satisfaction: 4.6 },
  { hour: '4PM', responseTime: 2.1, satisfaction: 4.4 },
  { hour: '5PM', responseTime: 2.7, satisfaction: 4.0 }
];

const crisisInterventions = [
  { date: '2024-01-15', count: 2, resolved: 2, escalated: 0 },
  { date: '2024-01-16', count: 1, resolved: 1, escalated: 0 },
  { date: '2024-01-17', count: 3, resolved: 2, escalated: 1 },
  { date: '2024-01-18', count: 0, resolved: 0, escalated: 0 },
  { date: '2024-01-19', count: 1, resolved: 1, escalated: 0 },
  { date: '2024-01-20', count: 2, resolved: 2, escalated: 0 },
  { date: '2024-01-21', count: 1, resolved: 1, escalated: 0 }
];

export default function PsychologistDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("analytics");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Real-time insights updated {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <Card className="border-border/50 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs text-muted-foreground">Sessions Today</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-primary" />
              <span className="text-xl font-bold">147</span>
            </div>
            <p className="text-xs text-success mt-1">↑ 12% vs yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs text-muted-foreground">Avg Response</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-success" />
              <span className="text-xl font-bold">2.3</span>
              <span className="text-xs text-muted-foreground">sec</span>
            </div>
            <p className="text-xs text-success mt-1">↓ 0.5s improved</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs text-muted-foreground">Crisis Alerts</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-xl font-bold">7</span>
            </div>
            <p className="text-xs text-destructive mt-1">↑ 2 vs yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs text-muted-foreground">Resolution Rate</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span className="text-xl font-bold">94%</span>
            </div>
            <p className="text-xs text-success mt-1">↑ 3% improvement</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs text-muted-foreground">User Satisfaction</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <ThumbsUp className="w-4 h-4 text-success" />
              <span className="text-xl font-bold">4.7</span>
              <span className="text-xs text-muted-foreground">/5</span>
            </div>
            <p className="text-xs text-success mt-1">↑ 0.2 rating increase</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs text-muted-foreground">Active Students</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              <span className="text-xl font-bold">1,247</span>
            </div>
            <p className="text-xs text-primary mt-1">↑ 45 new today</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Weekly Session Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Area type="monotone" dataKey="sessions" stroke="hsl(var(--primary))" fill="hsl(var(--primary)/.1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Top Discussion Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topicData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {topicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Sentiment Analysis Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="positive" stroke="#22c55e" strokeWidth={2} name="Positive" />
                  <Line type="monotone" dataKey="neutral" stroke="#64748b" strokeWidth={2} name="Neutral" />
                  <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} name="Negative" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={performanceMetrics}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="hour" className="text-xs" />
                  <YAxis yAxisId="left" className="text-xs" />
                  <YAxis yAxisId="right" orientation="right" className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar yAxisId="left" dataKey="responseTime" fill="hsl(var(--primary))" name="Response Time (s)" />
                  <Line yAxisId="right" type="monotone" dataKey="satisfaction" stroke="#22c55e" strokeWidth={2} name="Satisfaction" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crisis Intervention Tracking */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-destructive" />
            Crisis Intervention Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-destructive">7</div>
              <div className="text-sm text-muted-foreground">Crisis Alerts Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">6</div>
              <div className="text-sm text-muted-foreground">Successfully Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">1</div>
              <div className="text-sm text-muted-foreground">Escalated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">2.3 min</div>
              <div className="text-sm text-muted-foreground">Avg Response Time</div>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={crisisInterventions}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="resolved" stackId="a" fill="#22c55e" name="Resolved" />
                <Bar dataKey="escalated" stackId="a" fill="#f97316" name="Escalated" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights and Recommendations */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-warning" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Peak Usage Detected</p>
                    <p className="text-xs text-muted-foreground">Session volume is 23% higher than usual during 3-5 PM. Consider adding more capacity.</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-warning/5 border border-warning/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Concerning Pattern</p>
                    <p className="text-xs text-muted-foreground">Increase in exam-related anxiety. Consider proactive stress management resources.</p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-success/5 border border-success/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Improved Outcomes</p>
                    <p className="text-xs text-muted-foreground">94% resolution rate this week, up 6% from last week. Great work!</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Language & Demographics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">English</span>
                  <span className="text-sm font-medium">72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Hindi</span>
                  <span className="text-sm font-medium">18%</span>
                </div>
                <Progress value={18} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Spanish</span>
                  <span className="text-sm font-medium">6%</span>
                </div>
                <Progress value={6} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Other</span>
                  <span className="text-sm font-medium">4%</span>
                </div>
                <Progress value={4} className="h-2" />
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold">18-22</div>
                  <div className="text-xs text-muted-foreground">Avg Age Range</div>
                </div>
                <div>
                  <div className="text-lg font-bold">2.4x</div>
                  <div className="text-xs text-muted-foreground">Growth Rate</div>
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
                  <h1 className="font-bold text-sidebar-foreground">SAMVAAD</h1>
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
              onClick={handleLogout}
              className="w-full text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-destructive"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
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
