import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';
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
  KeyRound,
} from 'lucide-react';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('student');
  const [adminCode, setAdminCode] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* validation helpers */
  const isMiteEmail = (v: string) => v.toLowerCase().trim().endsWith('@mite.ac.in');

  const validate = (): string | null => {
    const cleanEmail = email.toLowerCase().trim();
    if (!fullName.trim()) return 'Full name is required.';
    if (!cleanEmail) return 'College email is required.';
    
    // Strict domain check for @mite.ac.in
    if (!isMiteEmail(cleanEmail)) {
      return 'Registration restricted: Only official MITE college emails (@mite.ac.in) are permitted.';
    }

    // Role-specific validation
    if (role === 'admin') {
      if (cleanEmail !== 'admin@mite.ac.in') {
        return 'Only the authorized security email (admin@mite.ac.in) can be registered as Campus Admin.';
      }
      if (adminCode.trim() !== 'ADMIN2026' && adminCode.trim() !== 'admin') {
        return 'Invalid Security Admin Passcode. Use "ADMIN2026" or register as Student.';
      }
    } else {
      // Student cannot use the master admin email for normal student account
      if (cleanEmail === 'admin@mite.ac.in') {
        return 'admin@mite.ac.in is reserved for the Campus Security Admin. Please select Campus Admin above.';
      }
    }

    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setError('');
    if (newRole === 'admin') {
      setEmail('admin@mite.ac.in');
      setFullName('MITE Security Admin');
    } else {
      if (email === 'admin@mite.ac.in') {
        setEmail('');
        setFullName('');
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const msg = validate();
    if (msg) return setError(msg);

    setLoading(true);
    const result = await signUp(
      email.toLowerCase().trim(),
      password,
      fullName.trim(),
      studentId.trim() || undefined,
      role
    );
    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      if (role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
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

  const benefits = [
    { icon: Search, text: 'AI matches your lost & found belongings' },
    { icon: Shield, text: 'Verified TrustLoop in-person handover' },
    { icon: Sparkles, text: 'Instant alerts on matching items' },
    { icon: CheckCircle, text: 'Exclusive to MITE students & campus staff' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* ───── LEFT: Branding ───── */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-dark to-gray-900 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute bottom-10 left-0 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20 w-full">
          <Link to="/" className="flex items-center gap-3 mb-12">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              MITE <span className="text-accent">CampusFind</span> AI
            </span>
          </Link>

          <h2 className="text-3xl xl:text-4xl font-extrabold text-white leading-tight">
            Official Lost & Found Network for MITE.
          </h2>
          <p className="mt-4 text-base text-indigo-200/80 max-w-md">
            Mangalore Institute of Technology & Engineering — connect finders and owners with AI matching and secure campus verification.
          </p>

          <div className="mt-8 inline-block px-3.5 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-white border border-white/20">
            🔒 Restricted to <b>@mite.ac.in</b> domains
          </div>

          <ul className="mt-8 space-y-4">
            {benefits.map((b) => (
              <li key={b.text} className="flex items-center gap-3 text-sm text-indigo-100">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <b.icon className="w-4 h-4 text-accent" />
                </div>
                <span>{b.text}</span>
              </li>
            ))}
          </ul>
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

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Create your account</h1>
          <p className="mt-2 text-gray-500">
            Already registered?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
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

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Account Type Selector */}
            <div>
              <label className="label">Select Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange('student')}
                  className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                    role === 'student'
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20 text-gray-900 font-semibold'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <User className={`w-5 h-5 ${role === 'student' ? 'text-primary' : 'text-gray-400'}`} />
                  <div>
                    <div className="text-xs font-bold">MITE Student</div>
                    <div className="text-[10px] text-gray-400">@mite.ac.in</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleRoleChange('admin')}
                  className={`p-3 rounded-xl border text-left transition flex items-center gap-2.5 ${
                    role === 'admin'
                      ? 'border-primary bg-primary/5 ring-2 ring-primary/20 text-gray-900 font-semibold'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <Shield className={`w-5 h-5 ${role === 'admin' ? 'text-primary' : 'text-gray-400'}`} />
                  <div>
                    <div className="text-xs font-bold">Campus Admin</div>
                    <div className="text-[10px] text-gray-400">admin@mite.ac.in</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Admin passcode if admin selected */}
            {role === 'admin' && (
              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl animate-fade-in space-y-2">
                <div className="flex items-center gap-1.5 text-blue-900 text-xs font-bold">
                  <Shield className="w-4 h-4 text-blue-700" />
                  MITE Campus Security Desk
                </div>
                <p className="text-[11px] text-blue-700">
                  Only <b>admin@mite.ac.in</b> is authorized. Passcode: <b>ADMIN2026</b>
                </p>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500" />
                  <input
                    type="password"
                    placeholder="Enter Security Passcode (ADMIN2026)"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    className="input-field !pl-10 !py-2 text-xs"
                  />
                </div>
              </div>
            )}

            {/* full name */}
            <div>
              <label htmlFor="fullName" className="label">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder={role === 'admin' ? 'MITE Security Admin' : 'e.g. Aryan Kumar'}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-field !pl-11"
                />
              </div>
            </div>

            {/* email */}
            <div>
              <label htmlFor="email" className="label flex items-center justify-between">
                <span>College Email</span>
                <span className="text-[11px] font-semibold text-primary">Must end with @mite.ac.in</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder={role === 'admin' ? 'admin@mite.ac.in' : 'yourname@mite.ac.in'}
                  value={email}
                  readOnly={role === 'admin'}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`input-field !pl-11 ${role === 'admin' ? 'bg-gray-100 cursor-not-allowed font-medium text-gray-700' : ''}`}
                />
              </div>
            </div>

            {/* student ID */}
            {role === 'student' && (
              <div>
                <label htmlFor="studentId" className="label">
                  USN / Student ID <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="studentId"
                    type="text"
                    placeholder="e.g. 4MT22CS042"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="input-field !pl-11"
                  />
                </div>
              </div>
            )}

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
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
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
                  Register as {role === 'admin' ? 'Campus Admin' : 'MITE Student'} <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            By registering, you agree to MITE CampusFind Terms & Safety Policies.
          </p>
        </div>
      </div>
    </div>
  );
}
