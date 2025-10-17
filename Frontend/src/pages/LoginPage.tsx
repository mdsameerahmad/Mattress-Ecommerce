import { Bed, ShieldCheck, User } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<'user' | 'admin'>('user');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Login successful!');
        
        // For admin credentials, always redirect to admin dashboard
        if (email.toLowerCase() === 'admin@CustomMattres.com' || loginType === 'admin') {
          navigate('/admin');
        } else {
          navigate(redirect);
        }
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#1E3A8A]">
            <Bed className="h-7 w-7 text-white" />
          </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Login to your CustomMattres account</CardDescription>
          <div className="flex space-x-2 mt-4">
            <Button 
              type="button" 
              variant={loginType === 'user' ? 'default' : 'outline'} 
              className="flex-1 flex items-center justify-center gap-2"
              onClick={() => setLoginType('user')}
            >
              <User size={16} />
              User
            </Button>
            <Button 
              type="button" 
              variant={loginType === 'admin' ? 'default' : 'outline'} 
              className="flex-1 flex items-center justify-center gap-2"
              onClick={() => setLoginType('admin')}
            >
              <ShieldCheck size={16} />
              Admin
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-[#1E3A8A] hover:underline">
                Forgot password?
              </a>
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/90"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-300" />
            <span className="text-sm text-muted-foreground">OR</span>
            <div className="h-px flex-1 bg-gray-300" />
          </div>

          <div className="space-y-3">
            <Button variant="outline" size="lg" className="w-full">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
            <Button variant="outline" size="lg" className="w-full">
              Continue with Phone
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#1E3A8A] hover:underline">
              Sign up
            </Link>
          </p>

          <div className="mt-6 rounded-lg border-2 border-dashed border-[#FFC107] bg-[#FFC107]/10 p-4">
            <p className="mb-2 text-center text-sm">{loginType === 'admin' ? 'Admin' : 'User'} Demo Access:</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full border-[#FFC107] text-[#FFC107] hover:bg-[#FFC107] hover:text-black"
              onClick={() => {
                if (loginType === 'admin') {
                  setEmail('admin@CustomMattres.com');
                  setPassword('admin');
                } else {
                  setEmail('user@example.com');
                  setPassword('user123');
                }
              }}
            >
              Fill {loginType === 'admin' ? 'Admin' : 'User'} Credentials
            </Button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              {loginType === 'admin' ? 'Email: admin@CustomMattres.com | Password: any' : 'Email: user@example.com | Password: user123'}
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Demo credentials: Use any email/password for user access
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
