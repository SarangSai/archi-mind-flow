import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Building2, Wrench, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address').max(255, 'Email is too long'),
  password: z.string().min(1, 'Password is required').max(128, 'Password is too long'),
});

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('manager');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }
    setErrors({});
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    login(result.data.email, result.data.password, role);
    setIsLoading(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-accent" />
            <h1 className="font-display text-3xl font-bold text-primary-foreground tracking-tight">
              ArchiTech
            </h1>
          </div>
          <p className="text-primary-foreground/60 font-body text-sm">
            Intelligent Facility Operations
          </p>
        </div>
        <div className="relative z-10 space-y-6">
          <blockquote className="text-primary-foreground/80 text-lg font-display leading-relaxed max-w-md">
            "The AI-powered knowledge layer that sits on top of your existing systems — 
            turning manuals into instant answers and emails into work orders."
          </blockquote>
          <div className="flex items-center gap-6 text-primary-foreground/40 text-xs font-body">
            <span>RAG-Powered</span>
            <span className="h-1 w-1 rounded-full bg-primary-foreground/30" />
            <span>Human-in-the-Loop</span>
            <span className="h-1 w-1 rounded-full bg-primary-foreground/30" />
            <span>No API Required</span>
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 justify-center mb-4">
            <Sparkles className="h-6 w-6 text-accent" />
            <span className="font-display font-bold text-2xl text-foreground">ArchiTech</span>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">Sign in to your account</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your credentials to access the platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                  required
                  maxLength={255}
                  className={cn("h-11", errors.email && "border-destructive")}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }}
                    required
                    maxLength={128}
                    className={cn("h-11 pr-10", errors.password && "border-destructive")}
                  />
                  {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Role selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select your role</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole('manager')}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200",
                    role === 'manager'
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <Building2 className={cn(
                    "h-6 w-6 transition-colors",
                    role === 'manager' ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "text-sm font-display font-semibold",
                    role === 'manager' ? "text-primary" : "text-muted-foreground"
                  )}>Manager</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('technician')}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200",
                    role === 'technician'
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-muted-foreground/30"
                  )}
                >
                  <Wrench className={cn(
                    "h-6 w-6 transition-colors",
                    role === 'technician' ? "text-primary" : "text-muted-foreground"
                  )} />
                  <span className={cn(
                    "text-sm font-display font-semibold",
                    role === 'technician' ? "text-primary" : "text-muted-foreground"
                  )}>Technician</span>
                </button>
              </div>
            </div>

            {/* Role preview */}
            <AnimatePresence mode="wait">
              <motion.div
                key={role}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary text-sm"
              >
                {role === 'manager' ? (
                  <Building2 className="h-4 w-4 text-primary" />
                ) : (
                  <Wrench className="h-4 w-4 text-primary" />
                )}
                <span className="text-muted-foreground">You are logging in as:</span>
                <span className="font-semibold text-foreground capitalize">{role}</span>
              </motion.div>
            </AnimatePresence>

            <Button
              type="submit"
              className="w-full h-11 font-display font-semibold"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            Secured with encryption at rest & in transit
          </p>
        </motion.div>
      </div>
    </div>
  );
}
