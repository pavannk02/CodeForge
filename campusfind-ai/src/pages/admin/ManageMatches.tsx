import { useState, useEffect } from 'react';
import { getMatches } from '@/services/itemService';
import type { Match } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ManageMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMatches().then(data => {
      setMatches(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">AI Matching Oversight</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Review system-generated cross-correlations between lost and found items</p>
      </div>

      {loading ? (
        <div className="py-20">
          <LoadingSpinner size="lg" label="Loading AI match registry..." />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/75 border-b border-gray-100 text-xs uppercase font-bold text-gray-400 tracking-wider">
                <tr>
                  <th className="px-5 py-4">Lost Item</th>
                  <th className="px-5 py-4">Found Item</th>
                  <th className="px-5 py-4">Match Score</th>
                  <th className="px-5 py-4">Key Factors</th>
                  <th className="px-5 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {matches.map(m => (
                  <tr key={m.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">{m.lost_item?.item_name || 'Lost Item'}</div>
                      <div className="text-xs text-gray-400">{m.lost_item?.location} • {m.lost_item?.item_date}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">{m.found_item?.item_name || 'Found Item'}</div>
                      <div className="text-xs text-gray-400">{m.found_item?.location} • {m.found_item?.item_date}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-base font-extrabold ${m.similarity_score >= 80 ? 'text-emerald-600' : m.similarity_score >= 60 ? 'text-blue-600' : 'text-amber-600'}`}>
                        {m.similarity_score}%
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {m.match_reasons.slice(0, 2).map((r, i) => (
                          <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to="/matches"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        Inspect <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
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

