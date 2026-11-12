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

    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail) return setError('Email is required.');
    if (!password) return setError('Password is required.');

    setLoading(true);
    const result = await signIn(cleanEmail, password);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      if (result.isAdmin || cleanEmail === 'admin@mite.ac.in') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  };

  const highlights = [
    { icon: Search, text: 'AI-powered item matching' },
    { icon: Bell, text: 'Real-time campus notifications' },
    { icon: Shield, text: 'Secure identity verification' },
    { icon: Sparkles, text: 'Exclusive to MITE students & staff' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ───── LEFT: Branding ───── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-dark to-gray-900 relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 w-full">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              MITE <span className="text-indigo-300">CampusFind</span> AI
            </span>
          </Link>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight">
            Welcome back to MITE Lost & Found 👋
          </h2>
          <p className="mt-4 text-indigo-200 text-lg leading-relaxed max-w-md">
            Sign in with your official <b>@mite.ac.in</b> credentials to check matches, submit claims, or oversee recoveries.
          </p>

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
        </div>
      </div>

      {/* ───── RIGHT: Form ───── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-surface">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">
              MITE <span className="text-accent">CampusFind</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Sign in to your account</h1>
          <p className="mt-2 text-gray-500">
            Don’t have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Register here
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
              <label htmlFor="email" className="label flex justify-between items-center">
                <span>College Email</span>
                <span className="text-[11px] text-gray-400">@mite.ac.in</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="yourname@mite.ac.in"
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
                <button type="button" className="text-xs text-primary font-semibold hover:underline mb-1.5">
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

          {/* Demo hint */}
          <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
            <p className="text-xs text-blue-800 font-bold mb-1">MITE Authorized Accounts</p>
            <p className="text-xs text-blue-700 leading-relaxed">
              Student: <b>student@mite.ac.in</b><br />
              Campus Admin: <b>admin@mite.ac.in</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
