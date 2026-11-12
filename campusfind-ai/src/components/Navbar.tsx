import { Bell, Menu, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface Props {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: Props) {
  const { profile, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Left: menu toggle (mobile) */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-xl lg:hidden"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Center / Search */}
        <div className="hidden md:flex items-center gap-2 flex-1 max-w-md mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items, reports..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/notifications"
            className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </Link>

          <Link to="/profile" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-semibold">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-gray-900">{profile?.full_name || 'User'}</p>
              <p className="text-xs text-muted">{isAdmin ? 'Admin' : 'Student'}</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

