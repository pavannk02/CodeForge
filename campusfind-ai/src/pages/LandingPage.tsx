import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Cpu,
  MessageCircle,
  CheckCircle,
  Sparkles,
  Bell,
  ShieldCheck,
  LayoutDashboard,
  Camera,
  SearchCheck,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  MapPin,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Animated counter hook                                              */
/* ------------------------------------------------------------------ */
function useAnimatedCounter(target: number, suffix = '', duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const step = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { ref, display: `${count.toLocaleString()}${suffix}` };
}

/* ------------------------------------------------------------------ */
/*  Section reveal hook                                                */
/* ------------------------------------------------------------------ */
function useFadeInOnScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, className: visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8' };
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  /* animated sections */
  const howFade = useFadeInOnScroll();
  const featuresFade = useFadeInOnScroll();
  const statsFade = useFadeInOnScroll();

  /* animated counters */
  const items = useAnimatedCounter(500, '+');
  const recovered = useAnimatedCounter(300, '+');
  const accuracy = useAnimatedCounter(95, '%');
  const students = useAnimatedCounter(1000, '+');

  /* step data */
  const steps = [
    { icon: Search, title: 'Report', desc: 'Describe your lost or found item with as many details as possible.' },
    { icon: Cpu, title: 'AI Matches', desc: 'Our intelligent engine scans listings and finds potential matches instantly.' },
    { icon: MessageCircle, title: 'Connect', desc: 'Reach out to the finder or owner through our secure messaging system.' },
    { icon: CheckCircle, title: 'Recover', desc: 'Verify ownership, arrange a meeting, and get your item back!' },
  ];

  /* feature data */
  const features = [
    { icon: Sparkles, title: 'AI Matching', desc: 'Deep-learning powered matching that compares descriptions, images and metadata for high-accuracy results.' },
    { icon: Bell, title: 'Real-Time Notifications', desc: 'Get instant alerts when a potential match is found or someone claims your item.' },
    { icon: ShieldCheck, title: 'Secure Verification', desc: 'Multi-step verification protects against false claims and ensures items reach their rightful owners.' },
    { icon: LayoutDashboard, title: 'Admin Dashboard', desc: 'Powerful analytics and moderation tools for campus security staff to oversee operations.' },
    { icon: Camera, title: 'Photo Upload', desc: 'Upload clear images of items to help our AI engine produce more accurate matches.' },
    { icon: SearchCheck, title: 'Smart Search', desc: 'Filter and search across categories, locations, dates and colors to find exactly what you need.' },
  ];

  /* stats data */
  const stats = [
    { ...items, label: 'Items Listed', color: 'from-blue-500 to-indigo-600' },
    { ...recovered, label: 'Successfully Recovered', color: 'from-emerald-500 to-teal-600' },
    { ...accuracy, label: 'Match Accuracy', color: 'from-violet-500 to-purple-600' },
    { ...students, label: 'Active Students', color: 'from-amber-500 to-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ───────── NAVBAR ───────── */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          {/* logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary tracking-tight hidden sm:inline">
              Campus<span className="text-accent">Find</span> AI
            </span>
          </Link>

          {/* desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {(['how-it-works', 'features', 'stats'] as const).map((id) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors capitalize"
              >
                {id.replace(/-/g, ' ')}
              </button>
            ))}
          </div>

          {/* desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-primary hover:text-accent transition-colors px-4 py-2">
              Log in
            </Link>
            <Link to="/register" className="btn-primary text-sm !px-5 !py-2.5 flex items-center gap-1.5">
              Sign Up <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* mobile toggle */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
            <div className="px-4 py-4 space-y-2">
              {(['how-it-works', 'features', 'stats'] as const).map((id) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="block w-full text-left px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 font-medium capitalize"
                >
                  {id.replace(/-/g, ' ')}
                </button>
              ))}
              <hr className="my-2 border-gray-100" />
              <Link to="/login" className="block px-4 py-2.5 rounded-xl font-semibold text-primary">
                Log in
              </Link>
              <Link to="/register" className="btn-primary block text-center text-sm !py-2.5">
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ───────── HERO ───────── */}
      <section className="relative overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-accent/20 to-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-blue-200/30 to-indigo-200/20 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* text */}
            <div className="animate-fade-in">
              <span className="inline-flex items-center gap-2 bg-accent/10 text-accent text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                <Sparkles className="w-4 h-4" /> AI-Powered Campus Lost & Found
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Lost Something?{' '}
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Let AI Help You Find It.
                </span>
              </h1>
              <p className="mt-6 text-lg text-gray-500 max-w-lg leading-relaxed">
                CampusFind AI uses intelligent matching to reunite students with their lost belongings — faster, smarter, and with minimal effort.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/report-lost" className="btn-primary flex items-center gap-2 text-base">
                  Report Lost Item <ArrowRight className="w-5 h-5" />
                </Link>
                <Link to="/report-found" className="btn-secondary flex items-center gap-2 text-base">
                  Report Found Item
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-6 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-success" /> Free for students
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-success" /> No sign-up needed to browse
                </span>
              </div>
            </div>

            {/* illustration area */}
            <div className="hidden lg:flex justify-center items-center relative animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="relative w-80 h-80">
                {/* main blob */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-accent/30 to-blue-200/40 animate-pulse-gentle" />
                {/* inner circle */}
                <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-white/80 to-accent/10 backdrop-blur-sm border border-white/40 flex items-center justify-center shadow-2xl">
                  <div className="text-center">
                    <Search className="w-16 h-16 text-primary mx-auto mb-3" strokeWidth={1.5} />
                    <p className="text-sm font-bold text-primary">AI Matching</p>
                    <p className="text-xs text-gray-400 mt-1">Powered by intelligence</p>
                  </div>
                </div>
                {/* floating badges */}
                <div className="absolute -top-2 right-4 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 animate-bounce" style={{ animationDuration: '3s' }}>
                  <Bell className="w-4 h-4 text-accent" />
                  <span className="text-xs font-semibold text-gray-700">Match found!</span>
                </div>
                <div className="absolute bottom-4 -left-4 bg-white rounded-xl shadow-lg px-3 py-2 flex items-center gap-2 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-xs font-semibold text-gray-700">Item recovered</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-surface">
        <div
          ref={howFade.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-out ${howFade.className}`}
        >
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">Process</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">Four simple steps to reunite with your belongings.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="relative card text-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* step number */}
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent text-white text-sm font-bold flex items-center justify-center shadow-md">
                  {i + 1}
                </span>
                <div className="mt-4 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <s.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FEATURES ───────── */}
      <section id="features" className="py-20 sm:py-28">
        <div
          ref={featuresFade.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-out ${featuresFade.className}`}
        >
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-accent uppercase tracking-wider">Capabilities</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">Powerful Features</h2>
            <p className="mt-4 text-gray-500 max-w-xl mx-auto">Everything you need to recover lost items on campus.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="card group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── STATS ───────── */}
      <section id="stats" className="py-20 sm:py-28 bg-gradient-to-br from-primary via-primary-dark to-gray-900">
        <div
          ref={statsFade.ref}
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-out ${statsFade.className}`}
        >
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">Impact</span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-white">Trusted Across Campus</h2>
            <p className="mt-4 text-indigo-200 max-w-xl mx-auto">Join thousands of students who've already recovered their belongings.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div
                key={s.label}
                ref={s.ref}
                className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center hover:bg-white/15 transition-colors"
              >
                <p className={`text-4xl sm:text-5xl font-extrabold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                  {s.display}
                </p>
                <p className="mt-2 text-sm font-medium text-indigo-200">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA BANNER ───────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Ready to Find Your Lost Item?
          </h2>
          <p className="mt-4 text-gray-500 max-w-lg mx-auto">
            Create a free account and let our AI start searching for matches immediately.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary flex items-center gap-2 text-base">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="btn-secondary text-base">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── FOOTER ───────── */}
      <footer className="bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* brand */}
            <div>
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">
                  Campus<span className="text-accent">Find</span> AI
                </span>
              </Link>
              <p className="text-sm leading-relaxed">AI-powered campus lost & found platform helping students recover their belongings.</p>
            </div>

            {/* links */}
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/report-lost" className="hover:text-white transition-colors">Report Lost Item</Link></li>
                <li><Link to="/report-found" className="hover:text-white transition-colors">Report Found Item</Link></li>
                <li><Link to="/browse" className="hover:text-white transition-colors">Browse Items</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollTo('how-it-works')} className="hover:text-white transition-colors">How It Works</button></li>
                <li><button onClick={() => scrollTo('features')} className="hover:text-white transition-colors">Features</button></li>
                <li><button onClick={() => scrollTo('stats')} className="hover:text-white transition-colors">Stats</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Account</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/login" className="hover:text-white transition-colors">Log In</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">CampusFind AI &copy; {new Date().getFullYear()}. All rights reserved.</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
              <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
              <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
