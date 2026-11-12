import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getRecoveryRequests, updateRecoveryRequest } from '@/services/itemService';
import type { RecoveryRequest, RecoveryStatus } from '@/types';
import StatusBadge from '@/components/StatusBadge';
import LoadingSpinner from '@/components/LoadingSpinner';
import { RECOVERY_STATUS_LABELS, MEETING_LOCATIONS } from '@/lib/constants';
import {
  RotateCcw, ShieldCheck, MapPin, Calendar, Clock,
  CheckCircle2, XCircle, AlertTriangle, ArrowRight, Lock
} from 'lucide-react';

export default function RecoveryRequests() {
  const { profile, isAdmin } = useAuth();
  const [requests, setRequests] = useState<RecoveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ALL' | 'SENT' | 'RECEIVED'>('ALL');
  const [scheduleModalReq, setScheduleModalReq] = useState<RecoveryRequest | null>(null);
  const [meetingLocation, setMeetingLocation] = useState(MEETING_LOCATIONS[0]);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getRecoveryRequests(isAdmin ? undefined : profile?.id);
      setRequests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [profile?.id, isAdmin]);

  const handleUpdateStatus = async (id: string, status: RecoveryStatus, extra?: Partial<RecoveryRequest>) => {
    try {
      await updateRecoveryRequest(id, { status, ...extra });
      setActionMsg(`Status updated to ${status}`);
      setTimeout(() => setActionMsg(null), 3000);
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleModalReq) return;
    await handleUpdateStatus(scheduleModalReq.id, 'MEETING_SCHEDULED', {
      meeting_location: meetingLocation,
      meeting_date: meetingDate,
      meeting_time: meetingTime,
    });
    setScheduleModalReq(null);
  };

  const handleConfirmHandover = async (req: RecoveryRequest) => {
    const isOwner = req.owner_id === profile?.id;
    const isFinder = req.finder_id === profile?.id;

    const updates: Partial<RecoveryRequest> = {};
    if (isOwner) updates.owner_confirmed = true;
    if (isFinder) updates.finder_confirmed = true;

    const willBeCompleted =
      (isOwner && req.finder_confirmed) ||
      (isFinder && req.owner_confirmed) ||
      isAdmin;

    if (willBeCompleted) {
      updates.status = 'COMPLETED';
    } else {
      updates.status = 'VERIFICATION_PENDING';
    }

    await handleUpdateStatus(req.id, updates.status || req.status, updates);
  };

  const filteredRequests = requests.filter(r => {
    if (activeTab === 'SENT') return r.owner_id === profile?.id;
    if (activeTab === 'RECEIVED') return r.finder_id === profile?.id;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
              <RotateCcw className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              TrustLoop™ Recovery Requests
            </h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Safe person-to-person handover protocol with dual confirmation & security supervision
          </p>
        </div>

        {/* Tab selection */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'ALL' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
          >
            All ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('SENT')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'SENT' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
          >
            Sent Claims
          </button>
          <button
            onClick={() => setActiveTab('RECEIVED')}
            className={`px-3 py-1.5 rounded-lg transition ${activeTab === 'RECEIVED' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
          >
            Received Claims
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {actionMsg}
        </div>
      )}

      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="lg" label="Loading recovery workflow..." />
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="card text-center py-16 px-4">
          <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">No active recovery requests</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            When you claim an item from AI Matches or someone claims an item you found, requests will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map(req => {
            const isOwner = req.owner_id === profile?.id;
            const isFinder = req.finder_id === profile?.id;

            return (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 sm:p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
                      #{req.id.slice(-4).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 text-base">
                          {req.found_item?.item_name || req.lost_item?.item_name || 'Campus Item'}
                        </h3>
                        <StatusBadge status={req.status} labels={RECOVERY_STATUS_LABELS} />
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {isOwner ? 'You claimed this item' : isFinder ? 'Someone claims your found item' : 'Supervised recovery'}
                        {' • '}
                        {new Date(req.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Flow Badges */}
                  <div className="flex items-center gap-2 self-start lg:self-auto text-xs">
                    <span className={`px-2.5 py-1 rounded-full font-medium ${req.owner_confirmed ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {req.owner_confirmed ? '✓ Owner Confirmed' : '○ Owner Pending'}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full font-medium ${req.finder_confirmed ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                      {req.finder_confirmed ? '✓ Finder Confirmed' : '○ Finder Pending'}
                    </span>
                  </div>
                </div>

                {/* Meeting information if scheduled */}
                {req.meeting_location && (
                  <div className="mt-4 p-4 rounded-xl bg-blue-50/70 border border-blue-100 flex flex-wrap items-center gap-6 text-sm text-blue-900">
                    <div className="flex items-center gap-2 font-medium">
                      <MapPin className="w-4 h-4 text-blue-600" />
                      <span>{req.meeting_location}</span>
                    </div>
                    {req.meeting_date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-600" />
                        <span>{req.meeting_date}</span>
                      </div>
                    )}
                    {req.meeting_time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span>{req.meeting_time}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Verification instructions banner */}
                <div className="mt-4 p-3 bg-gray-50 rounded-xl flex items-start gap-3 text-xs text-gray-600">
                  <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-gray-800">TrustLoop Protocol:</span> In-person handover requires the claimant to describe unrevealed marks, stickers, serial codes, or bag contents. For valuable items, always meet at the <b>College Security Office</b>.
                  </div>
                </div>

                {/* Action buttons */}
                <div className="mt-5 flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  {/* If status is REQUESTED and current user is Finder */}
                  {req.status === 'REQUESTED' && (isFinder || isAdmin) && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'ACCEPTED')}
                        className="btn-success text-xs py-2 px-4 flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Accept Claim
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                        className="btn-danger text-xs py-2 px-4 flex items-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" /> Reject Claim
                      </button>
                    </>
                  )}

                  {/* If status is ACCEPTED */}
                  {req.status === 'ACCEPTED' && (
                    <button
                      onClick={() => {
                        setScheduleModalReq(req);
                        setMeetingDate(new Date().toISOString().split('T')[0]);
                        setMeetingTime('14:00');
                      }}
                      className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                    >
                      <Calendar className="w-4 h-4" /> Schedule Handover Meeting
                    </button>
                  )}

                  {/* If status is MEETING_SCHEDULED or VERIFICATION_PENDING */}
                  {(req.status === 'MEETING_SCHEDULED' || req.status === 'VERIFICATION_PENDING') && (
                    <button
                      onClick={() => handleConfirmHandover(req)}
                      className="btn-success text-xs py-2 px-4 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Confirm Physical Handover
                    </button>
                  )}

                  {/* Disputed or Cancel */}
                  {req.status !== 'COMPLETED' && req.status !== 'CANCELLED' && (
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'DISPUTED')}
                      className="text-xs text-gray-500 hover:text-red-600 px-3 py-2"
                    >
                      Report Issue / Dispute
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Schedule Handover Modal */}
      {scheduleModalReq && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-fade-in space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Schedule In-Person Handover</h3>
            <p className="text-xs text-gray-500">
              Pick a safe public campus location and time to verify ownership and exchange the item.
            </p>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 pt-2">
              <div>
                <label className="label">Meeting Location</label>
                <select
                  value={meetingLocation}
                  onChange={e => setMeetingLocation(e.target.value as any)}
                  className="select-field"
                >
                  {MEETING_LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Date</label>
                  <input
                    type="date"
                    required
                    value={meetingDate}
                    onChange={e => setMeetingDate(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="label">Time</label>
                  <input
                    type="time"
                    required
                    value={meetingTime}
                    onChange={e => setMeetingTime(e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setScheduleModalReq(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-sm py-2">
                  Confirm Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

