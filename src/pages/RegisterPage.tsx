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
  User,
  CreditCard,
  Search,
  CheckCircle,
  Sparkles,
  Shield,
} from 'lucide-react';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* validation helpers */
  const isEmailValid = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const validate = (): string | null => {
    if (!fullName.trim()) return 'Full name is required.';
    if (!email.trim()) return 'Email is required.';
    if (!isEmailValid(email.trim())) return 'Please enter a valid email address.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const msg = validate();
    if (msg) return setError(msg);

    setLoading(true);
    const result = await signUp(email.trim(), password, fullName.trim(), studentId.trim() || undefined);
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      navigate('/dashboard');
    }
  };

  /* password strength indicator */
  const strength = (() => {
    if (!password) return { pct: 0, label: '', color: 'bg-gray-200' };
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    if (s <= 1) return { pct: 20, label: 'Weak', color: 'bg-red-500' };
    if (s <= 2) return { pct: 40, label: 'Fair', color: 'bg-orange-500' };
    if (s <= 3) return { pct: 60, label: 'Good', color: 'bg-amber-500' };
    if (s <= 4) return { pct: 80, label: 'Strong', color: 'bg-emerald-500' };
    return { pct: 100, label: 'Excellent', color: 'bg-emerald-600' };
  })();

  /* benefits for left panel */
  const benefits = [
    { icon: Search, text: 'AI matches your items in seconds' },
    { icon: Shield, text: 'Verified recovery process' },
    { icon: Sparkles, text: 'Smart notifications & filters' },
    { icon: CheckCircle, text: '100% free for all students' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ───── LEFT: Branding ───── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-dark to-gray-900 relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-10 left-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />

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
            Join CampusFind AI ✨
          </h2>
          <p className="mt-4 text-indigo-200 text-lg leading-relaxed max-w-md">
            Create a free account and start using AI to recover lost items on campus.
          </p>

          {/* benefits */}
          <div className="mt-10 space-y-4">
            {benefits.map((b) => (
              <div key={b.text} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center">
                  <b.icon className="w-5 h-5 text-indigo-300" />
                </div>
                <span className="text-sm text-indigo-200 font-medium">{b.text}</span>
              </div>
            ))}
          </div>

          {/* stats */}
          <div className="mt-14 grid grid-cols-3 gap-4 max-w-sm">
            {[
              { n: '500+', l: 'Items Listed' },
              { n: '300+', l: 'Recovered' },
              { n: '95%', l: 'Accuracy' },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10">
                <p className="text-xl font-extrabold text-white">{s.n}</p>
                <p className="text-[11px] text-indigo-300 mt-1">{s.l}</p>
              </div>
            ))}
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

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Create your account</h1>
          <p className="mt-2 text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-accent font-semibold hover:underline">
              Log in
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
            {/* full name */}
            <div>
              <label htmlFor="fullName" className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Aryan Kumar"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field !pl-11"
                />
              </div>
            </div>

            {/* email */}
            <div>
              <label htmlFor="email" className="label">College Email</label>
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

            {/* student ID */}
            <div>
              <label htmlFor="studentId" className="label">
                Student ID <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="studentId"
                  type="text"
                  placeholder="CS2024001"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="input-field !pl-11"
                />
              </div>
            </div>

            {/* password */}
            <div>
              <label htmlFor="password" className="label">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Min 6 characters"
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
              {/* strength bar */}
              {password && (
                <div className="mt-2">
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{strength.label}</p>
                </div>
              )}
            </div>

            {/* confirm password */}
            <div>
              <label htmlFor="confirmPassword" className="label">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field !pl-11"
                />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Passwords do not match
                </p>
              )}
              {confirmPassword && password === confirmPassword && confirmPassword.length >= 6 && (
                <p className="text-xs text-emerald-600 mt-1.5 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Passwords match
                </p>
              )}
            </div>

            {/* submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 text-base !py-3.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Creating account…
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            By registering, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
