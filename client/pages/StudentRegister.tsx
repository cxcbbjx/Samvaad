import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, ArrowLeft, Loader2, CheckCircle, Copy, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegistrationData {
  name: string;
  email: string;
  university: string;
  studentId: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
}

interface RegistrationResult {
  samvaadId: string;
  tempPassword: string;
}

export default function StudentRegister() {
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationResult, setRegistrationResult] = useState<RegistrationResult | null>(null);
  const [copied, setCopied] = useState({ id: false, password: false });
  
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: '',
    university: '',
    studentId: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const generateSamvaadId = (): string => {
    // Generate unique SAMVAAD-ID format: STU + 6 random digits
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    return `STU${randomNum}`;
  };

  const generateTempPassword = (): string => {
    // Generate temporary password
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    if (error) setError('');
  };

  const handleUniversityChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      university: value
    }));
    if (error) setError('');
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.university) {
      setError('Please select your university');
      return false;
    }
    if (!formData.studentId.trim()) {
      setError('Please enter your university student ID');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (!formData.emergencyContact.trim()) {
      setError('Please enter emergency contact name');
      return false;
    }
    if (!formData.emergencyPhone.trim()) {
      setError('Please enter emergency contact phone');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Check if email already exists
      const existingStudents = JSON.parse(localStorage.getItem('samvaad_students') || '[]');
      const emailExists = existingStudents.some((student: any) => 
        student.email.toLowerCase() === formData.email.toLowerCase()
      );

      if (emailExists) {
        setError('This email is already registered. Each student can only register once.');
        setIsLoading(false);
        return;
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate SAMVAAD-ID and temporary password
      const samvaadId = generateSamvaadId();
      const tempPassword = generateTempPassword();

      // Create student record
      const studentRecord = {
        ...formData,
        samvaadId,
        tempPassword,
        registrationDate: new Date().toISOString(),
        isActive: true
      };

      // Store in localStorage (in real app, this would be sent to backend)
      const students = JSON.parse(localStorage.getItem('samvaad_students') || '[]');
      students.push(studentRecord);
      localStorage.setItem('samvaad_students', JSON.stringify(students));

      setRegistrationResult({ samvaadId, tempPassword });
      setStep('success');
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: 'id' | 'password') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(prev => ({ ...prev, [type]: true }));
      setTimeout(() => {
        setCopied(prev => ({ ...prev, [type]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard');
    }
  };

  const proceedToLogin = () => {
    navigate('/login/student');
  };

  if (step === 'success' && registrationResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <CardTitle className="text-xl text-success">Registration Successful!</CardTitle>
              <CardDescription>
                Your SAMVAAD account has been created. Save these credentials safely.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                  <Label className="text-sm font-medium text-primary">Your SAMVAAD-ID</Label>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-bold text-foreground">{registrationResult.samvaadId}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(registrationResult.samvaadId, 'id')}
                      className="h-8"
                    >
                      {copied.id ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use this ID to login from now on
                  </p>
                </div>

                <div className="p-4 bg-warning/5 border border-warning/20 rounded-lg">
                  <Label className="text-sm font-medium text-warning">Temporary Password</Label>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-lg font-mono text-foreground">{registrationResult.tempPassword}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(registrationResult.tempPassword, 'password')}
                      className="h-8"
                    >
                      {copied.password ? <CheckCircle className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Change this password after first login
                  </p>
                </div>
              </div>

              <Alert>
                <AlertDescription className="text-sm">
                  <strong>Important:</strong> Save these credentials safely. You'll need your SAMVAAD-ID to login and access support services.
                </AlertDescription>
              </Alert>

              <Button onClick={proceedToLogin} className="w-full bg-primary hover:bg-primary/90">
                Proceed to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <User className="w-8 h-8 text-primary" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Student Registration
          </h1>
          <p className="text-muted-foreground">
            Register once to get your unique SAMVAAD-ID
          </p>
        </div>

        {/* Registration Form */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Create Your Account</CardTitle>
            <CardDescription>
              Fill in your details to register for SAMVAAD support services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="university">University *</Label>
                  <Select onValueChange={handleUniversityChange} disabled={isLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your university" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="du">University of Delhi</SelectItem>
                      <SelectItem value="jnu">Jawaharlal Nehru University</SelectItem>
                      <SelectItem value="iit-delhi">IIT Delhi</SelectItem>
                      <SelectItem value="dtu">Delhi Technological University</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentId">University Student ID *</Label>
                  <Input
                    id="studentId"
                    name="studentId"
                    placeholder="Enter your student ID"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
                  <Input
                    id="emergencyContact"
                    name="emergencyContact"
                    placeholder="Parent/Guardian name"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone *</Label>
                  <Input
                    id="emergencyPhone"
                    name="emergencyPhone"
                    type="tel"
                    placeholder="Emergency contact number"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Register & Get SAMVAAD-ID'
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Already have a SAMVAAD-ID?{' '}
                <button
                  onClick={() => navigate('/login/student')}
                  className="text-primary hover:underline"
                  disabled={isLoading}
                >
                  Login here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <div className="text-center text-xs text-muted-foreground mt-4">
          <p>
            Your information is secure and confidential. Each student can register only once.
          </p>
        </div>
      </div>
    </div>
  );
}
