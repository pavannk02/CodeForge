import { useState, useEffect } from 'react';
import { getRecoveryRequests, updateRecoveryRequest } from '@/services/itemService';
import type { RecoveryRequest, RecoveryStatus } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { RECOVERY_STATUS_LABELS } from '@/lib/constants';
import { RotateCcw, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ManageRecovery() {
  const [requests, setRequests] = useState<RecoveryRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getRecoveryRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdate = async (id: string, status: RecoveryStatus) => {
    await updateRecoveryRequest(id, { status, admin_verified: true });
    await loadData();
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-6 h-6 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Recovery Oversight</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Supervise handovers and manage disputes across campus departments</p>
      </div>

      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="lg" label="Loading recovery workflow queue..." />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-xs uppercase font-bold text-gray-400 tracking-wider">
                <tr>
                  <th className="px-5 py-4">Request</th>
                  <th className="px-5 py-4">Item</th>
                  <th className="px-5 py-4">Meeting Details</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Admin Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4 font-mono text-xs font-bold text-gray-800">
                      #{r.id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">
                        {r.found_item?.item_name || r.lost_item?.item_name || 'Item'}
                      </div>
                      <div className="text-xs text-gray-400">
                        Owner: {r.owner_id} ↔ Finder: {r.finder_id}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      {r.meeting_location ? (
                        <div>
                          <div className="font-semibold text-gray-800">{r.meeting_location}</div>
                          <div className="text-gray-400">{r.meeting_date} at {r.meeting_time}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not scheduled</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={r.status} labels={RECOVERY_STATUS_LABELS} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      {r.status !== 'COMPLETED' ? (
                        <button
                          onClick={() => handleUpdate(r.id, 'COMPLETED')}
                          className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 font-semibold text-xs hover:bg-emerald-100 transition inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Complete
                        </button>
                      ) : (
                        <span className="text-xs font-semibold text-emerald-600">✓ Finalized</span>
                      )}
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

