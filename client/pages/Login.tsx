import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageCircle, Brain, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export default function Login() {
  const { role } = useParams<{ role: 'student' | 'psychologist' }>();
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    identifier: '', // SAATHI-ID for students, email for psychologists
    password: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const userRole = role as UserRole;
  const isStudent = userRole === 'student';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.identifier || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Additional validation for student SAATHI-ID format
    if (isStudent && !formData.identifier.match(/^STU\d{6}$/)) {
      setError('Please enter a valid SAATHI-ID (format: STU123456)');
      return;
    }

    const success = await login(formData.identifier, formData.password, userRole);

    if (success) {
      // Redirect based on role
      navigate(isStudent ? '/student' : '/psychologist');
    } else {
      if (isStudent) {
        setError('Invalid SAATHI-ID or password. Please check your credentials.');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.name === 'identifier' && isStudent
      ? e.target.value.toUpperCase()
      : e.target.value;

    setFormData(prev => ({
      ...prev,
      [e.target.name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const demoCredentials = isStudent
    ? [
        { identifier: 'STU123456', password: 'demo123', label: 'Demo Student 1' },
        { identifier: 'STU789012', password: 'demo456', label: 'Demo Student 2' }
      ]
    : [
        { identifier: 'dr.smith@saathi.com', password: 'psychologist123', label: 'Dr. Smith' },
        { identifier: 'dr.johnson@saathi.com', password: 'admin123', label: 'Dr. Johnson' }
      ];

  const fillDemo = (credentials: { identifier: string; password: string }) => {
    setFormData(credentials);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className={cn(
            "inline-flex items-center justify-center w-16 h-16 rounded-full mb-4",
            isStudent ? "bg-primary/10" : "bg-secondary/20"
          )}>
            {isStudent ? (
              <MessageCircle className="w-8 h-8 text-primary" />
            ) : (
              <Brain className="w-8 h-8 text-secondary-foreground" />
            )}
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {isStudent ? 'Student' : 'Psychologist'} Login
          </h1>
          <p className="text-muted-foreground">
            {isStudent 
              ? 'Access your personal support space' 
              : 'Access your professional dashboard'
            }
          </p>
        </div>

        {/* Login Form */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="identifier">
                  {isStudent ? 'SAATHI-ID' : 'Email'}
                </Label>
                <Input
                  id="identifier"
                  name="identifier"
                  type={isStudent ? 'text' : 'email'}
                  placeholder={isStudent ? 'Enter your SAATHI-ID (STU123456)' : 'Enter your email'}
                  value={formData.identifier}
                  onChange={handleInputChange}
                  className="border-border/50 focus:border-primary/50"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="border-border/50 focus:border-primary/50 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className={cn(
                  "w-full",
                  isStudent 
                    ? "bg-primary hover:bg-primary/90" 
                    : "bg-secondary hover:bg-secondary/90"
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-muted-foreground">Demo Credentials</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoCredentials.map((cred, index) => (
              <button
                key={index}
                onClick={() => fillDemo(cred)}
                className="w-full text-left p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors text-sm"
                disabled={isLoading}
              >
                <div className="font-medium text-foreground">{cred.email}</div>
                <div className="text-muted-foreground">Password: {cred.password}</div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="text-center text-xs text-muted-foreground">
          <p>
            Your data is protected with enterprise-grade security. 
            All conversations are encrypted and confidential.
          </p>
        </div>
      </div>
    </div>
  );
}
