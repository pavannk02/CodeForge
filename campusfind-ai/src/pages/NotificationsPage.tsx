import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/services/itemService';
import type { Notification } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Bell, CheckCheck, Sparkles, RotateCcw, Info, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationsPage() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNotifs = async () => {
    setLoading(true);
    try {
      if (profile?.id) {
        const data = await getNotifications(profile.id);
        setNotifications(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifs();
  }, [profile?.id]);

  const handleMarkRead = async (id: string) => {
    await markNotificationRead(id);
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    if (profile?.id) {
      await markAllNotificationsRead(profile.id);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'MATCH_FOUND':
        return <Sparkles className="w-5 h-5 text-indigo-600" />;
      case 'RECOVERY_REQUESTED':
      case 'RECOVERY_ACCEPTED':
      case 'RECOVERY_REJECTED':
      case 'ITEM_RETURNED':
        return <RotateCcw className="w-5 h-5 text-blue-600" />;
      case 'MEETING_SCHEDULED':
        return <Calendar className="w-5 h-5 text-emerald-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 text-primary">
              <Bell className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Notifications</h1>
            {unreadCount > 0 && (
              <span className="badge-danger ml-2">{unreadCount} unread</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">Real-time alerts for AI matches, recovery requests, and meetings</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="lg" label="Loading alerts..." />
        </div>
      ) : notifications.length === 0 ? (
        <div className="card text-center py-16 px-4">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">No notifications</h3>
          <p className="text-sm text-gray-500 mt-1">You're completely caught up with all campus updates!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => !n.is_read && handleMarkRead(n.id)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                n.is_read
                  ? 'bg-white border-gray-100 opacity-80'
                  : 'bg-blue-50/40 border-blue-100 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-xl bg-white border border-gray-100 shadow-xs shrink-0">
                  {getIcon(n.type)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    {n.title}
                    {!n.is_read && (
                      <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                    )}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">{n.message}</p>
                  <span className="text-[11px] text-gray-400 mt-2 block">
                    {new Date(n.created_at).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="shrink-0 self-center">
                {n.type === 'MATCH_FOUND' && (
                  <Link
                    to="/matches"
                    className="text-xs font-semibold text-primary hover:underline px-2 py-1"
                  >
                    View Match →
                  </Link>
                )}
                {n.type.includes('RECOVERY') && (
                  <Link
                    to="/recovery"
                    className="text-xs font-semibold text-primary hover:underline px-2 py-1"
                  >
                    View Request →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

