import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  Home, Search, FilePlus, FileCheck, FolderOpen, Sparkles,
  RotateCcw, Bell, User, LayoutDashboard, FileText, Users,
  Shield, Package, BarChart3, Settings, ChevronLeft, ChevronRight,
  LogOut, X
} from 'lucide-react';
import { clsx } from 'clsx';

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  onClose?: () => void;
  mobile?: boolean;
}

const studentNav = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/explore', label: 'Explore', icon: Search },
  { to: '/report-lost', label: 'Report Lost', icon: FilePlus },
  { to: '/report-found', label: 'Report Found', icon: FileCheck },
  { to: '/my-reports', label: 'My Reports', icon: FolderOpen },
  { to: '/matches', label: 'AI Matches', icon: Sparkles },
  { to: '/recovery', label: 'Recovery Requests', icon: RotateCcw },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
];

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/reports', label: 'Reports', icon: FileText },
  { to: '/admin/matches', label: 'Matches', icon: Sparkles },
  { to: '/admin/recovery', label: 'Recovery Requests', icon: RotateCcw },
  { to: '/admin/verification', label: 'Verification', icon: Shield },
  { to: '/admin/returned', label: 'Returned Items', icon: Package },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ collapsed, onToggle, onClose, mobile }: Props) {
  const { isAdmin, profile, signOut } = useAuth();
  const location = useLocation();
  const nav = isAdmin ? adminNav : studentNav;

  return (
    <>
      {/* Mobile overlay */}
      {mobile && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={clsx(
          'fixed top-0 left-0 h-full bg-white border-r border-gray-100 z-50 flex flex-col transition-all duration-300',
          mobile ? 'w-64' : collapsed ? 'w-[72px]' : 'w-64',
          mobile && 'lg:hidden'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          {(!collapsed || mobile) && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-primary">CampusFind</h1>
                <span className="text-[10px] text-muted font-medium">AI Platform</span>
              </div>
            </div>
          )}
          {collapsed && !mobile && (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
              <Search className="w-4 h-4 text-white" />
            </div>
          )}
          {mobile ? (
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          ) : (
            <button
              onClick={onToggle}
              className="p-1 hover:bg-gray-100 rounded-lg hidden lg:block"
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              )}
            </button>
          )}
        </div>

        {/* Role badge */}
        {(!collapsed || mobile) && (
          <div className="px-4 py-2">
            <span className={clsx(
              'text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md',
              isAdmin ? 'bg-primary/10 text-primary' : 'bg-blue-50 text-blue-600'
            )}>
              {isAdmin ? 'Admin Portal' : 'Student'}
            </span>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                title={collapsed ? label : undefined}
                className={clsx(
                  active ? 'sidebar-link-active' : 'sidebar-link',
                  collapsed && !mobile && 'justify-center px-2'
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {(!collapsed || mobile) && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100">
          {(!collapsed || mobile) && profile && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                {profile.full_name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{profile.full_name}</p>
                <p className="text-xs text-muted truncate">{profile.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={signOut}
            title={collapsed ? 'Sign Out' : undefined}
            className={clsx(
              'flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all',
              collapsed && !mobile && 'justify-center px-2'
            )}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {(!collapsed || mobile) && <span className="text-sm font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}

