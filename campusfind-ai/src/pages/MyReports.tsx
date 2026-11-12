import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getItems } from '@/services/itemService';
import type { Item, ItemType } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ITEM_STATUS_LABELS } from '@/lib/constants';
import { MapPin, Calendar, PlusCircle, Sparkles, Eye, AlertCircle } from 'lucide-react';

export default function MyReports() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<'ALL' | ItemType>('ALL');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      try {
        const data = await getItems({
          userId: profile?.id,
          type: activeTab === 'ALL' ? undefined : activeTab,
        });
        setItems(data);
      } catch (err) {
        console.error('Failed to load reports', err);
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [profile?.id, activeTab]);

  const lostCount = items.filter(i => i.type === 'LOST').length;
  const foundCount = items.filter(i => i.type === 'FOUND').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">My Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage all your reported lost and found items</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/report-lost"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition shadow-sm text-sm"
          >
            <PlusCircle className="w-4 h-4" /> Report Lost
          </Link>
          <Link
            to="/report-found"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 transition shadow-sm text-sm"
          >
            <PlusCircle className="w-4 h-4" /> Report Found
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'ALL'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All Reports ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('LOST')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'LOST'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Lost Items ({lostCount})
        </button>
        <button
          onClick={() => setActiveTab('FOUND')}
          className={`pb-3 text-sm font-semibold transition-colors border-b-2 ${
            activeTab === 'FOUND'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Found Items ({foundCount})
        </button>
      </div>

      {loading ? (
        <div className="py-16">
          <LoadingSpinner size="lg" label="Loading your reports..." />
        </div>
      ) : items.length === 0 ? (
        <div className="card text-center py-12 px-4">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">No reports found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            {activeTab === 'ALL'
              ? "You haven't submitted any lost or found reports yet."
              : `You don't have any ${activeTab.toLowerCase()} item reports.`}
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link to="/report-lost" className="btn-primary text-sm py-2">
              Report Lost Item
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.item_name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-gray-300">
                      {item.type === 'LOST' ? '?' : '!'}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        item.type === 'LOST' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {item.type}
                    </span>
                    <StatusBadge status={item.status} labels={ITEM_STATUS_LABELS} />
                    <span className="text-xs text-gray-400">• {item.category}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mt-1 truncate">
                    {item.item_name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-1 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {item.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {new Date(item.item_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto">
                <Link
                  to={`/matches`}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" /> AI Matches
                </Link>
                <Link
                  to={`/item/${item.id}`}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-100 text-gray-700 text-xs font-semibold hover:bg-gray-200 transition"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

