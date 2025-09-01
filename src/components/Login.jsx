import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Stethoscope, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('dentist');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState(''); // "error" | "success"

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !password) {
      setMessage('⚠️ Please enter both email and password.');
      setMessageType('error');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, password, role);
      if (!success) {
        setMessage("❌ Invalid credentials. Use 'demo123' as password for demo.");
        setMessageType('error');
      } else {
        setMessage(`✅ Welcome! Logged in as ${role}`);
        setMessageType('success');
      }
    } catch (error) {
      setMessage('⚠️ An error occurred during login.');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle p-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl shadow-medical-lg mb-4">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">OraVils Dental</h1>
          <p className="text-muted-foreground">Professional scan management system</p>
        </div>

        {/* Card */}
        <Card className="card-medical">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Choose your role and enter your credentials
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Role Select */}
              <div className="space-y-3">
                <Label>Select Your Role</Label>
                <RadioGroup
                  value={role}
                  onValueChange={(value) => setRole(value)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="dentist" id="dentist" className="peer sr-only" />
                    <Label
                      htmlFor="dentist"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-medical"
                    >
                      <Stethoscope className="mb-3 h-6 w-6" />
                      Dentist
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="technician" id="technician" className="peer sr-only" />
                    <Label
                      htmlFor="technician"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-muted p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 cursor-pointer transition-medical"
                    >
                      <UserCheck className="mb-3 h-6 w-6" />
                      Technician
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@dental.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-medical focus:shadow-medical"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="transition-medical focus:shadow-medical"
                  required
                />
              </div>

              {/* Demo Info */}
              <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-secondary/50 p-3 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span>
                  Demo password: <code className="bg-background px-1 rounded">demo123</code>
                </span>
              </div>

              {/* Inline Message */}
              {message && (
                <div
                  className={`p-3 rounded-md text-sm ${
                    messageType === 'error'
                      ? 'bg-red-100 text-red-700 border border-red-300'
                      : 'bg-green-100 text-green-700 border border-green-300'
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Submit */}
              <Button type="submit" className="w-full btn-medical" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
