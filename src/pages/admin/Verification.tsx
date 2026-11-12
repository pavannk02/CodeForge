import { useState, useEffect } from 'react';
import { getRecoveryRequests, updateRecoveryRequest, getItems } from '@/services/itemService';
import type { RecoveryRequest, Item } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, Eye, Lock } from 'lucide-react';

export default function Verification() {
  const [requests, setRequests] = useState<RecoveryRequest[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReq, setSelectedReq] = useState<RecoveryRequest | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reqs, allItems] = await Promise.all([
        getRecoveryRequests(),
        getItems(),
      ]);
      setRequests(reqs.filter(r => ['REQUESTED', 'ACCEPTED', 'MEETING_SCHEDULED', 'VERIFICATION_PENDING'].includes(r.status)));
      setItems(allItems);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleVerify = async (id: string, approve: boolean) => {
    await updateRecoveryRequest(id, {
      status: approve ? 'COMPLETED' : 'REJECTED',
      admin_verified: approve,
    });
    setSelectedReq(null);
    await loadData();
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Ownership Verification Portal</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Review private proof & confidential markings submitted by claimants</p>
      </div>

      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="lg" label="Loading pending verifications..." />
        </div>
      ) : requests.length === 0 ? (
        <div className="card text-center py-16 px-4">
          <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">No verifications pending</h3>
          <p className="text-sm text-gray-500 mt-1">All current ownership claims are resolved or verified.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map(req => {
            const lost = items.find(i => i.id === req.lost_item_id);
            const found = items.find(i => i.id === req.found_item_id);

            return (
              <div key={req.id} className="card p-5 space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                      #{req.id.slice(-6).toUpperCase()}
                    </span>
                    <span className="text-xs text-amber-600 bg-amber-50 font-semibold px-2 py-0.5 rounded-full">
                      {req.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-gray-900 text-lg mt-2">
                    {found?.item_name || lost?.item_name || 'Item Verification'}
                  </h3>

                  <div className="mt-3 p-3 bg-gray-50 rounded-xl space-y-2 text-xs">
                    <div>
                      <span className="text-gray-400 font-medium">Found At:</span>{' '}
                      <span className="text-gray-800 font-semibold">{found?.location || 'Campus'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium">Reported Lost At:</span>{' '}
                      <span className="text-gray-800 font-semibold">{lost?.location || 'Campus'}</span>
                    </div>
                  </div>

                  {/* Private Details Inspection */}
                  <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-amber-900">
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                      Private Claimant Evidence:
                    </div>
                    <p className="text-amber-800 italic">
                      "{lost?.private_details || found?.private_details || 'Claimant specified private sticker and student ID verification.'}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => handleVerify(req.id, true)}
                    className="flex-1 btn-success text-xs py-2 flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve Claim
                  </button>
                  <button
                    onClick={() => handleVerify(req.id, false)}
                    className="btn-danger text-xs py-2 px-3"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

