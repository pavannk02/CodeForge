import { BarChart3, TrendingUp, CheckCircle, Clock } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Campus Analytics</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Platform recovery metrics and campus incident distributions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="text-xs font-semibold text-gray-400 uppercase">Avg. Recovery Time</div>
          <div className="text-2xl font-black text-gray-900 mt-2">14.2 Hours</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">↓ 3.1 hrs faster this month</div>
        </div>
        <div className="card p-5">
          <div className="text-xs font-semibold text-gray-400 uppercase">AI Match Accuracy</div>
          <div className="text-2xl font-black text-gray-900 mt-2">94.8%</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">↑ +2.4% vs benchmark</div>
        </div>
        <div className="card p-5">
          <div className="text-xs font-semibold text-gray-400 uppercase">Total Handover Value</div>
          <div className="text-2xl font-black text-gray-900 mt-2">₹1,84,000+</div>
          <div className="text-xs text-gray-400 mt-1">Laptops, phones, bags saved</div>
        </div>
        <div className="card p-5">
          <div className="text-xs font-semibold text-gray-400 uppercase">Dispute Rate</div>
          <div className="text-2xl font-black text-gray-900 mt-2">1.2%</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">Below target threshold</div>
        </div>
      </div>

      {/* Campus Heatmap by Location */}
      <div className="card p-6">
        <h3 className="font-bold text-gray-900 text-base mb-4">Reports by Campus Location</h3>
        <div className="space-y-3">
          {[
            { name: 'Library', count: 18, pct: '38%' },
            { name: 'Canteen', count: 12, pct: '25%' },
            { name: 'Computer Lab', count: 8, pct: '17%' },
            { name: 'Main Building', count: 6, pct: '12%' },
            { name: 'Sports Ground', count: 4, pct: '8%' },
          ].map(loc => (
            <div key={loc.name} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-gray-700 font-semibold">{loc.name}</span>
                <span className="text-gray-500">{loc.count} reports ({loc.pct})</span>
              </div>
              <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: loc.pct }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

