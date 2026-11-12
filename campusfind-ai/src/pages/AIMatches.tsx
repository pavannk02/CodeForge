import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getMatches, createRecoveryRequest } from '@/services/itemService';
import type { Match } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { classifyMatch, matchColorClass } from '@/utils/matchingAlgorithm';
import { Sparkles, ArrowRight, CheckCircle2, MapPin, Calendar, Check, Send } from 'lucide-react';

export default function AIMatches() {
  const { profile } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'high' | 'medium' | 'low'>('ALL');
  const [requestedIds, setRequestedIds] = useState<string[]>([]);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      try {
        const data = await getMatches(profile?.id);
        setMatches(data);
      } catch (err) {
        console.error('Failed to load matches', err);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, [profile?.id]);

  const handleRequestRecovery = async (match: Match) => {
    if (!profile) return;
    try {
      await createRecoveryRequest({
        lost_item_id: match.lost_item_id,
        found_item_id: match.found_item_id,
        owner_id: profile.id,
        finder_id: match.found_item?.user_id || 'demo-student-2',
      });
      setRequestedIds(prev => [...prev, match.id]);
      setActionSuccess(`Recovery request sent for "${match.found_item?.item_name || 'Item'}"!`);
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMatches = matches.filter(m => {
    if (filter === 'ALL') return true;
    return classifyMatch(m.similarity_score) === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">AI Potential Matches</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Weighted similarity engine comparing item descriptions, categories, campus locations & dates
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl self-start sm:self-auto text-xs font-semibold">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg transition ${filter === 'ALL' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
          >
            All ({matches.length})
          </button>
          <button
            onClick={() => setFilter('high')}
            className={`px-3 py-1.5 rounded-lg transition ${filter === 'high' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-600'}`}
          >
            High (80%+)
          </button>
          <button
            onClick={() => setFilter('medium')}
            className={`px-3 py-1.5 rounded-lg transition ${filter === 'medium' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600'}`}
          >
            Medium (60-79%)
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-3 py-1.5 rounded-lg transition ${filter === 'low' ? 'bg-white text-amber-700 shadow-sm' : 'text-gray-600'}`}
          >
            Low (40-59%)
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {actionSuccess}
        </div>
      )}

      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="lg" label="Running neural & weighted matching algorithm..." />
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="card text-center py-16 px-4">
          <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900">No matching items yet</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-md mx-auto">
            Our AI continuously monitors incoming lost and found reports. As soon as a matching report is submitted, it will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredMatches.map(match => {
            const classification = classifyMatch(match.similarity_score);
            const isRequested = requestedIds.includes(match.id);

            return (
              <div
                key={match.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 sm:p-6"
              >
                {/* Match header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-extrabold ${matchColorClass(match.similarity_score)}`}>
                        {match.similarity_score}%
                      </span>
                      <span className="text-xs font-semibold text-gray-400">Match</span>
                    </div>
                    <span
                      className={`text-xs uppercase font-bold px-2.5 py-1 rounded-full ${
                        classification === 'high'
                          ? 'bg-emerald-100 text-emerald-700'
                          : classification === 'medium'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {classification} confidence
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleRequestRecovery(match)}
                      disabled={isRequested}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                        isRequested
                          ? 'bg-emerald-50 text-emerald-700 cursor-default'
                          : 'bg-primary text-white hover:bg-primary-dark shadow-sm'
                      }`}
                    >
                      {isRequested ? (
                        <>
                          <Check className="w-4 h-4" /> Requested
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Request Recovery
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Compare items grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-5">
                  {/* Lost Item */}
                  <div className="p-4 rounded-xl bg-red-50/40 border border-red-100/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-red-600 bg-red-100 px-2 py-0.5 rounded-md">
                        Lost Item
                      </span>
                      {match.lost_item && (
                        <Link to={`/item/${match.lost_item_id}`} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                          View Details <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                    <h4 className="text-base font-semibold text-gray-900">
                      {match.lost_item?.item_name || 'Lost Belonging'}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {match.lost_item?.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {match.lost_item?.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {match.lost_item?.item_date}
                      </span>
                    </div>
                  </div>

                  {/* Found Item */}
                  <div className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md">
                        Found Item
                      </span>
                      {match.found_item && (
                        <Link to={`/item/${match.found_item_id}`} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                          View Details <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                    <h4 className="text-base font-semibold text-gray-900">
                      {match.found_item?.item_name || 'Discovered Belonging'}
                    </h4>
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {match.found_item?.description}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {match.found_item?.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        {match.found_item?.item_date}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score breakdown & reasons */}
                <div className="pt-3 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Reasons pills */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-semibold text-gray-500 mr-1">Match Factors:</span>
                    {match.match_reasons.map((reason, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md"
                      >
                        ✓ {reason}
                      </span>
                    ))}
                  </div>

                  {/* Subscores */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 shrink-0">
                    <div>
                      Desc: <span className="font-semibold text-gray-700">{match.description_score}%</span>
                    </div>
                    <div>
                      Category: <span className="font-semibold text-gray-700">{match.category_score}%</span>
                    </div>
                    <div>
                      Location: <span className="font-semibold text-gray-700">{match.location_score}%</span>
                    </div>
                    <div>
                      Date: <span className="font-semibold text-gray-700">{match.date_score}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

