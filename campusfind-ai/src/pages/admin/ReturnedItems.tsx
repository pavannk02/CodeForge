import { useState, useEffect } from 'react';
import { getRecoveryRequests } from '@/services/itemService';
import type { RecoveryRequest } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { PackageCheck, CheckCircle2 } from 'lucide-react';

export default function ReturnedItems() {
  const [items, setItems] = useState<RecoveryRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRecoveryRequests().then(reqs => {
      setItems(reqs.filter(r => r.status === 'COMPLETED'));
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <PackageCheck className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Returned Items Log</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Audit log of successfully reunited belongings on campus</p>
      </div>

      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="lg" label="Loading returned inventory..." />
        </div>
      ) : items.length === 0 ? (
        <div className="card text-center py-16 px-4">
          <PackageCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">No returned items recorded</h3>
          <p className="text-sm text-gray-500 mt-1">As items complete the TrustLoop handover, they are archived here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/75 border-b border-gray-100 text-xs uppercase font-bold text-gray-400">
              <tr>
                <th className="px-5 py-4">Item Name</th>
                <th className="px-5 py-4">Claim ID</th>
                <th className="px-5 py-4">Handover Location</th>
                <th className="px-5 py-4">Handover Date</th>
                <th className="px-5 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(r => (
                <tr key={r.id}>
                  <td className="px-5 py-4 font-semibold text-gray-900">
                    {r.found_item?.item_name || r.lost_item?.item_name || 'Campus Belonging'}
                  </td>
                  <td className="px-5 py-4 font-mono text-xs">#{r.id.slice(-6).toUpperCase()}</td>
                  <td className="px-5 py-4 text-xs">{r.meeting_location || 'Campus Security Office'}</td>
                  <td className="px-5 py-4 text-xs">{new Date(r.updated_at).toLocaleDateString()}</td>
                  <td className="px-5 py-4 text-right">
                    <span className="badge-success text-xs font-semibold">
                      <CheckCircle2 className="w-3 h-3 inline mr-1" /> Reunited
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

