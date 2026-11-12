// ──────────────────────────────────────────
// CampusFind AI — Student Dashboard
// ──────────────────────────────────────────
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Eye,
  Sparkles,
  Package,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Calendar,
  AlertTriangle,
  Plus,
  Compass,
  RotateCcw,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/context/AuthContext';
import { getDashboardStats, getItems } from '@/services/itemService';
import { ITEM_STATUS_LABELS } from '@/lib/constants';
import LoadingSpinner from '@/components/LoadingSpinner';
import StatusBadge from '@/components/StatusBadge';
import type { Item } from '@/types';

interface DashboardData {
  totalReports: number;
  lostItems: number;
  foundItems: number;
  potentialMatches: number;
  pendingRequests: number;
  completedRecoveries: number;
  disputed: number;
  recentItems: Item[];
  recentRecoveries: unknown[];
}

// Stat card config
const statCards = [
  {
    key: 'totalReports' as const,
    label: 'Total Reports',
    icon: FileText,
    change: '+12%',
    gradient: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
    textColor: 'text-blue-600',
    iconBg: 'bg-blue-500/10',
  },
  {
    key: 'lostItems' as const,
    label: 'Lost Items',
    icon: Search,
    change: '+8%',
    gradient: 'from-red-500 to-rose-600',
    bgLight: 'bg-red-50',
    textColor: 'text-red-600',
    iconBg: 'bg-red-500/10',
  },
  {
    key: 'foundItems' as const,
    label: 'Found Items',
    icon: Package,
    change: '+15%',
    gradient: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-600',
    iconBg: 'bg-emerald-500/10',
  },
  {
    key: 'potentialMatches' as const,
    label: 'AI Matches',
    icon: Sparkles,
    change: '+24%',
    gradient: 'from-purple-500 to-indigo-600',
    bgLight: 'bg-purple-50',
    textColor: 'text-purple-600',
    iconBg: 'bg-purple-500/10',
  },
];

// Quick action cards
const quickActions = [
  {
    title: 'Report Lost',
    description: 'Report a lost item and let AI find matches',
    icon: Search,
    to: '/report?type=lost',
    bgTint: 'bg-red-50 hover:bg-red-100/80',
    iconBg: 'bg-red-100',
    iconColor: 'text-red-500',
    borderColor: 'border-red-100',
  },
  {
    title: 'Report Found',
    description: 'Report an item you found on campus',
    icon: Plus,
    to: '/report?type=found',
    bgTint: 'bg-emerald-50 hover:bg-emerald-100/80',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-500',
    borderColor: 'border-emerald-100',
  },
  {
    title: 'Explore Items',
    description: 'Browse all lost and found reports',
    icon: Compass,
    to: '/explore',
    bgTint: 'bg-blue-50 hover:bg-blue-100/80',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-500',
    borderColor: 'border-blue-100',
  },
  {
    title: 'View Matches',
    description: 'Check AI-powered matches for your items',
    icon: Sparkles,
    to: '/matches',
    bgTint: 'bg-purple-50 hover:bg-purple-100/80',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-500',
    borderColor: 'border-purple-100',
  },
];

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats(profile.id);
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [profile]);

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" label="Loading your dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">Something went wrong</h2>
          <p className="text-muted max-w-sm">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'Student';

  return (
    <div className="page-container animate-fade-in">
      {/* ── Greeting Header ─────────────────────────── */}
      <div className="mb-8">
        <h1 className="page-title">Welcome back, {firstName}! 👋</h1>
        <p className="page-subtitle">Here's what's happening with your reports.</p>
      </div>

      {/* ── Stats Row ───────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          const value = stats ? stats[card.key] : 0;

          return (
            <div
              key={card.key}
              className="stat-card group relative overflow-hidden"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Decorative gradient accent */}
              <div
                className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${card.gradient} opacity-5 -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500`}
              />

              <div className="flex items-start justify-between relative z-10">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`p-3 rounded-xl ${card.iconBg}`}>
                  <Icon className={`w-5 h-5 ${card.textColor}`} />
                </div>
              </div>

              {/* Change badge */}
              <div className="flex items-center gap-1.5 mt-3 relative z-10">
                <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  {card.change}
                </span>
                <span className="text-xs text-gray-400">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Quick Actions ───────────────────────────── */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                to={action.to}
                className={`group relative rounded-2xl border ${action.borderColor} ${action.bgTint} p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                <div className={`w-11 h-11 rounded-xl ${action.iconBg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${action.iconColor}`} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{action.description}</p>
                <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Recent Activity ─────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Link
            to="/explore"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition-colors"
          >
            View All
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recentItems && stats.recentItems.length > 0 ? (
          <div className="card p-0 overflow-hidden">
            <div className="divide-y divide-gray-100">
              {stats.recentItems.map((item) => (
                <Link
                  key={item.id}
                  to={`/item/${item.id}`}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/80 transition-colors group"
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.item_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">
                        {item.item_name}
                      </h4>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wide ${
                          item.type === 'LOST'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        {item.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(item.item_date), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>

                  {/* Status + Time */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <StatusBadge status={item.status} labels={ITEM_STATUS_LABELS} />
                    <span className="text-[11px] text-gray-400">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  {/* Hover arrow */}
                  <Eye className="w-4 h-4 text-gray-300 group-hover:text-indigo-500 transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div className="card flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <FileText className="w-7 h-7 text-gray-300" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">No reports yet</h3>
            <p className="text-sm text-gray-500 mb-4 max-w-xs">
              Start by reporting a lost or found item to see your activity here.
            </p>
            <Link to="/report" className="btn-primary">
              <Plus className="w-4 h-4" />
              Create Report
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
