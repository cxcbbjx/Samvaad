import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Brain, Users, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in flex flex-col justify-center items-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-8 animate-float">
            <MessageCircle className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-slide-up">
            SAATHI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            A safe space for students to receive support through AI-powered conversations
            and professional guidance from licensed psychologists.
          </p>
        </div>

        {/* Interface Selection */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Student Interface */}
          <Card className="relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl animate-scale-in hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 hover:animate-pulse-glow transition-all">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">I'm a Student</CardTitle>
              <CardDescription className="text-base">
                Get immediate support for academic stress, personal challenges, 
                and access helpful resources through our supportive chatbot.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <ul className="space-y-3 mb-6 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-success" />
                  Anonymous and confidential conversations
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-success" />
                  24/7 availability for immediate support
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-success" />
                  Connect with professional help when needed
                </li>
              </ul>
              <Button
                onClick={() => navigate('/login/student')}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                Student Login
              </Button>
            </CardContent>
          </Card>

          {/* Psychologist Interface */}
          <Card className="relative overflow-hidden border-2 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl animate-scale-in hover:scale-105" style={{ animationDelay: '0.1s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent" />
            <CardHeader className="relative">
              <div className="w-12 h-12 bg-secondary/20 rounded-lg flex items-center justify-center mb-4 hover:animate-pulse-glow transition-all">
                <Brain className="w-6 h-6 text-secondary-foreground" />
              </div>
              <CardTitle className="text-2xl">I'm a Psychologist</CardTitle>
              <CardDescription className="text-base">
                Monitor student conversations, provide professional guidance, 
                and access analytics to better support student wellbeing.
              </CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <ul className="space-y-3 mb-6 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-warning" />
                  Real-time conversation monitoring
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-warning" />
                  Detailed analytics and insights
                </li>
                <li className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-warning" />
                  Student profile management
                </li>
              </ul>
              <Button
                onClick={() => navigate('/login/psychologist')}
                variant="secondary"
                className="w-full"
                size="lg"
              >
                Psychologist Login
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-16 text-muted-foreground">
          <p className="text-sm">
            All conversations are encrypted and confidential. Professional help is always available when needed.
          </p>
        </div>
      </div>
    </div>
  );
}
