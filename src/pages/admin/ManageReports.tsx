import { useState, useEffect } from 'react';
import { getItems, updateItem } from '@/services/itemService';
import type { Item, ItemType, ItemStatus } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ITEM_STATUS_LABELS } from '@/lib/constants';
import { Search, Filter, Trash2, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManageReports() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'ALL' | ItemType>('ALL');
  const [search, setSearch] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getItems();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, status: ItemStatus) => {
    try {
      await updateItem(id, { status });
      setActionMsg(`Report status updated to ${status}`);
      setTimeout(() => setActionMsg(null), 3000);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(i => {
    if (typeFilter !== 'ALL' && i.type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return i.item_name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Manage Reports</h1>
          <p className="text-sm text-gray-500 mt-1">Review, approve, or moderate student lost & found submissions</p>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {actionMsg}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search report by name or keywords..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold ${typeFilter === 'ALL' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter('LOST')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold ${typeFilter === 'LOST' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Lost Only
          </button>
          <button
            onClick={() => setTypeFilter('FOUND')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold ${typeFilter === 'FOUND' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            Found Only
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="lg" label="Loading reports database..." />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-xs uppercase font-bold text-gray-400 tracking-wider">
                <tr>
                  <th className="px-5 py-4">Item</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Location</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">{item.item_name}</div>
                      <div className="text-xs text-gray-400 truncate max-w-xs">{item.description}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.type === 'LOST' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-5 py-4">{item.category}</td>
                    <td className="px-5 py-4">{item.location}</td>
                    <td className="px-5 py-4 text-xs">{new Date(item.item_date).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={item.status} labels={ITEM_STATUS_LABELS} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/item/${item.id}`}
                          className="p-1.5 text-gray-400 hover:text-primary rounded-lg hover:bg-gray-100"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        {item.status !== 'ACTIVE' && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'ACTIVE')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                            title="Set Active"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        {item.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'REJECTED')}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                            title="Reject/Flag"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

