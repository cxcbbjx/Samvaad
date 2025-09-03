import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Brain, 
  Shield, 
  Globe, 
  Clock, 
  Users, 
  Zap,
  Heart,
  Star,
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description: "Advanced RAG + BERT + LLM technology provides personalized, evidence-based mental health support",
      color: "text-blue-500"
    },
    {
      icon: Globe,
      title: "Multi-Language Support",
      description: "Communicate in your preferred language - English, Hindi, and more with natural conversation flow",
      color: "text-green-500"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Instant support whenever you need it, day or night. No appointments, no waiting lists",
      color: "text-purple-500"
    },
    {
      icon: Shield,
      title: "Complete Privacy",
      description: "Anonymous, encrypted conversations with strict confidentiality. Your privacy is our priority",
      color: "text-red-500"
    },
    {
      icon: Users,
      title: "Human + AI Hybrid",
      description: "AI support backed by licensed psychologists for comprehensive care when you need it most",
      color: "text-orange-500"
    },
    {
      icon: Zap,
      title: "Crisis Intervention",
      description: "Intelligent crisis detection with immediate escalation to professional help and resources",
      color: "text-yellow-500"
    }
  ];

  const stats = [
    { number: "24/7", label: "Available Support" },
    { number: "10+", label: "Languages Supported" },
    { number: "100%", label: "Confidential" },
    { number: "5s", label: "Average Response Time" }
  ];

  const comparisons = [
    {
      feature: "Instant Response",
      samvaad: true,
      others: false,
      description: "Get immediate support, not appointment wait times"
    },
    {
      feature: "Multi-Language",
      samvaad: true,
      others: false,
      description: "Communicate naturally in your preferred language"
    },
    {
      feature: "AI + Human Hybrid",
      samvaad: true,
      others: false,
      description: "Best of both worlds: AI efficiency + human empathy"
    },
    {
      feature: "Student-Focused",
      samvaad: true,
      others: false,
      description: "Designed specifically for academic and student life challenges"
    },
    {
      feature: "Complete Anonymity",
      samvaad: true,
      others: true,
      description: "No personal information required to get support"
    },
    {
      feature: "Evidence-Based",
      samvaad: true,
      others: true,
      description: "Techniques grounded in clinical psychology research"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/10 to-primary/5">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-primary/10 rounded-full mb-8 animate-float">
            <MessageCircle className="w-12 h-12 text-primary" />
          </div>
          
          {/* Main Heading */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-4 animate-slide-up">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                SAMVAAD
              </span>
            </h1>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered
              </Badge>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <Shield className="w-3 h-3 mr-1" />
                Confidential
              </Badge>
              <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                <Clock className="w-3 h-3 mr-1" />
                24/7 Support
              </Badge>
            </div>
          </div>

          <h2 className="text-2xl lg:text-4xl font-semibold text-foreground/90 mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Your Mental Health Companion
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Experience the future of student mental health support. SAMVAAD combines cutting-edge AI technology with human empathy to provide personalized, multilingual, and instant mental health assistance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in" style={{ animationDelay: '0.3s' }}>
            <Button 
              onClick={() => navigate('/home')}
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold group"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="px-8 py-6 text-lg font-semibold border-2"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Choose <span className="text-primary">SAMVAAD</span>?
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Advanced technology meets compassionate care to revolutionize student mental health support
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How We Compare
            </h3>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See why students choose SAMVAAD over traditional mental health solutions
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="font-semibold text-muted-foreground">Feature</div>
                  <div className="font-bold text-primary text-lg">SAMVAAD</div>
                  <div className="font-semibold text-muted-foreground">Traditional Solutions</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {comparisons.map((comparison, index) => (
                  <div 
                    key={index} 
                    className="grid grid-cols-3 gap-4 items-center py-3 border-b border-border/30 last:border-b-0"
                  >
                    <div className="font-medium text-foreground">{comparison.feature}</div>
                    <div className="text-center">
                      {comparison.samvaad ? (
                        <CheckCircle className="w-6 h-6 text-success mx-auto" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-muted mx-auto"></div>
                      )}
                    </div>
                    <div className="text-center">
                      {comparison.others ? (
                        <CheckCircle className="w-6 h-6 text-muted-foreground mx-auto" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-muted mx-auto"></div>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              What Students Say
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "SAMVAAD helped me through my anxiety during finals week. The instant support and breathing techniques really made a difference.",
                author: "Anonymous Student",
                university: "University of Delhi"
              },
              {
                quote: "I love that I can talk to SAMVAAD in Hindi. It feels more natural and comfortable to express my feelings.",
                author: "Anonymous Student", 
                university: "IIT Delhi"
              },
              {
                quote: "Having 24/7 support available is incredible. When I felt overwhelmed at 2 AM, SAMVAAD was there to help.",
                author: "Anonymous Student",
                university: "JNU"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="border-border/50 shadow-lg animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.university}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Ready to Start Your Mental Health Journey?
            </h3>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students who trust SAMVAAD for their mental health support. 
              Your wellbeing matters, and help is just a click away.
            </p>
            <Button 
              onClick={() => navigate('/home')}
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold group"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">SAMVAAD</span>
          </div>
          <p className="text-muted-foreground mb-4">
            Empowering students with AI-powered mental health support
          </p>
          <p className="text-sm text-muted-foreground">
            All conversations are encrypted and confidential. Professional help is always available when needed.
          </p>
        </div>
      </footer>
    </div>
  );
}
