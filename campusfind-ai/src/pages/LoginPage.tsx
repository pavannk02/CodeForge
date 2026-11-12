import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  MapPin,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  AlertCircle,
  Search,
  Shield,
  Bell,
  Sparkles,
} from 'lucide-react';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) return setError('Email is required.');
    if (!password) return setError('Password is required.');

    setLoading(true);
    const result = await signIn(email.trim(), password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      navigate('/dashboard');
    }
  };

  /* feature highlights for left panel */
  const highlights = [
    { icon: Search, text: 'AI-powered item matching' },
    { icon: Bell, text: 'Real-time notifications' },
    { icon: Shield, text: 'Secure identity verification' },
    { icon: Sparkles, text: 'Smart search & filters' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ───── LEFT: Branding ───── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-dark to-gray-900 relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 w-full">
          {/* logo */}
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Campus<span className="text-indigo-300">Find</span> AI
            </span>
          </Link>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight">
            Welcome back 👋
          </h2>
          <p className="mt-4 text-indigo-200 text-lg leading-relaxed max-w-md">
            Sign in to check your matches, track recovery progress, and manage your reported items.
          </p>

          {/* highlights */}
          <div className="mt-10 space-y-4">
            {highlights.map((h) => (
              <div key={h.text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <h.icon className="w-5 h-5 text-indigo-300" />
                </div>
                <span className="text-sm text-indigo-200 font-medium">{h.text}</span>
              </div>
            ))}
          </div>

          {/* quote */}
          <div className="mt-14 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 max-w-sm">
            <p className="text-sm text-indigo-100 italic leading-relaxed">
              "I found my laptop within 3 hours of reporting it lost. The AI matching is incredible!"
            </p>
            <p className="mt-3 text-xs text-indigo-300 font-semibold">— Aryan K., CS Sophomore</p>
          </div>
        </div>
      </div>

      {/* ───── RIGHT: Form ───── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-surface">
        <div className="w-full max-w-md animate-fade-in">
          {/* mobile logo */}
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">
              Campus<span className="text-accent">Find</span> AI
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Sign in to your account</h1>
          <p className="mt-2 text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent font-semibold hover:underline">
              Register
            </Link>
          </p>

          {/* error */}
          {error && (
            <div className="mt-6 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm animate-fade-in">
              <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {/* email */}
            <div>
              <label htmlFor="email" className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@campus.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field !pl-11"
                />
              </div>
            </div>

            {/* password */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="label">Password</label>
                <button type="button" className="text-xs text-accent font-semibold hover:underline mb-1.5">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field !pl-11 !pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 text-base !py-3.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* demo hint */}
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-xs text-blue-700 font-medium mb-1">🧪 Demo Mode</p>
            <p className="text-xs text-blue-600 leading-relaxed">
              Use <strong>student@campus.edu</strong> or <strong>admin@campus.edu</strong> with any 6+ character password.
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
