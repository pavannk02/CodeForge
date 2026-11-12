import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Search, Package, Sparkles, Handshake, ArrowRight,
  TrendingUp, CheckCircle, ChevronDown, Calendar, ShieldCheck
} from 'lucide-react';
import { getDashboardStats } from '@/services/itemService';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('Last 7 Days');

  useEffect(() => {
    getDashboardStats().then(data => setStats(data));
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">
            Admin Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-0.5">
            Campus Lost & Found
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitor reports, verify claims, and ensure items reach their owners.
          </p>
        </div>

        {/* Time range selector */}
        <div className="relative self-start sm:self-auto">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-xs">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{timeRange}</span>
            <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
          </button>
        </div>
      </div>

      {/* 5 Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Reports */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ↑ +12%
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900">
              {stats?.totalReports ?? 48}
            </div>
            <div className="text-xs font-medium text-gray-500 mt-0.5">Total Reports</div>
          </div>
        </div>

        {/* Lost Reports */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ↑ +8%
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900">
              {stats?.lostItems ?? 26}
            </div>
            <div className="text-xs font-medium text-gray-500 mt-0.5">Lost Reports</div>
          </div>
        </div>

        {/* Found Reports */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
              ↑ +16%
            </span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900">
              {stats?.foundItems ?? 22}
            </div>
            <div className="text-xs font-medium text-gray-500 mt-0.5">Found Reports</div>
          </div>
        </div>

        {/* Potential Matches */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900">
              {stats?.potentialMatches ?? 15}
            </div>
            <div className="text-xs font-medium text-gray-500 mt-0.5">Potential Matches</div>
          </div>
        </div>

        {/* Pending Requests */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Handshake className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900">
              {stats?.pendingRequests ?? 5}
            </div>
            <div className="text-xs font-medium text-gray-500 mt-0.5">Pending Requests</div>
          </div>
        </div>
      </div>

      {/* Row 2: Recent Requests (Left) & Blue Action Banner (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Recovery Requests */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-base">Recent Recovery Requests</h3>
            <Link
              to="/admin/recovery"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100 mt-1">
            {/* Item 1 */}
            <div className="py-3 flex items-center justify-between hover:bg-gray-50/50 px-2 rounded-xl transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                  🎧
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">White Earbuds</h4>
                  <p className="text-xs text-gray-400">Req #RQ1482 • Aryan ↔ Kunal</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                  Verification
                </span>
                <Link to="/admin/verification" className="text-gray-400 hover:text-gray-600">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Item 2 */}
            <div className="py-3 flex items-center justify-between hover:bg-gray-50/50 px-2 rounded-xl transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                  👛
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Black Wallet</h4>
                  <p className="text-xs text-gray-400">Req #RQ1481 • Neha ↔ Rohan</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  Meeting Scheduled
                </span>
                <Link to="/admin/recovery" className="text-gray-400 hover:text-gray-600">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Item 3 */}
            <div className="py-3 flex items-center justify-between hover:bg-gray-50/50 px-2 rounded-xl transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                  🍶
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Blue Bottle</h4>
                  <p className="text-xs text-gray-400">Req #RQ1480 • Vihaan ↔ Meera</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                  Pending
                </span>
                <Link to="/admin/recovery" className="text-gray-400 hover:text-gray-600">
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Blue Review Prompt Banner */}
        <div className="bg-gradient-to-br from-[#1d4ed8] to-[#1e40af] rounded-3xl p-6 text-white flex flex-col justify-between shadow-lg relative overflow-hidden">
          {/* Subtle background graphic */}
          <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-blue-200">
              Action Required
            </span>
            <h3 className="text-2xl font-black mt-2 leading-tight">
              5 requests need your review.
            </h3>
            <p className="text-xs text-blue-100 mt-2 leading-relaxed">
              Verify ownership, schedule handover, and close the loop safely.
            </p>
          </div>

          <div className="pt-6">
            <Link
              to="/admin/verification"
              className="w-12 h-12 rounded-full bg-white text-blue-700 flex items-center justify-center shadow-md hover:scale-105 transition"
            >
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Row 3: Recovery Overview Chart + Report by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recovery Overview Line/Trend chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-base">Recovery Overview</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                <CheckCircle className="w-3.5 h-3.5" /> 18 Items Recovered
              </span>
              <span className="flex items-center gap-1.5 font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                <TrendingUp className="w-3.5 h-3.5" /> 67% Recovery Rate
              </span>
            </div>
          </div>

          {/* Styled SVG Trend Graph */}
          <div className="pt-6 pb-2">
            <div className="relative h-44 w-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Area fill */}
                <path
                  d="M 20 120 Q 95 100 170 95 T 320 85 T 400 90 T 480 30 L 480 150 L 20 150 Z"
                  fill="url(#grad)"
                />
                {/* Line */}
                <path
                  d="M 20 120 Q 95 100 170 95 T 320 85 T 400 90 T 480 30"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                {/* Dots */}
                {[[20, 120], [95, 100], [170, 95], [245, 120], [320, 85], [400, 90], [480, 30]].map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="4" fill="#1d4ed8" stroke="#ffffff" strokeWidth="2" />
                ))}
              </svg>
            </div>
            {/* Days labels */}
            <div className="flex justify-between text-xs font-semibold text-gray-400 px-4 mt-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        {/* Report by Category Donut visualization */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-base">Report by Category</h3>
            <span className="text-xs text-gray-400 font-medium">This Week</span>
          </div>

          <div className="flex items-center justify-around py-4">
            {/* Circular representation */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#2563eb" strokeWidth="4" strokeDasharray="38 100" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#60a5fa" strokeWidth="4" strokeDasharray="21 100" strokeDashoffset="-38" />
                <circle cx="18" cy="18" r="14" fill="none" stroke="#93c5fd" strokeWidth="4" strokeDasharray="15 100" strokeDashoffset="-59" />
              </svg>
              <div className="absolute text-center">
                <span className="text-lg font-black text-gray-900">48</span>
                <span className="block text-[9px] uppercase font-bold text-gray-400">Reports</span>
              </div>
            </div>

            {/* Category legend */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-gray-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-600" /> Electronics
                </span>
                <b className="text-gray-900 font-bold">38%</b>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-gray-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-400" /> Accessories
                </span>
                <b className="text-gray-900 font-bold">21%</b>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-gray-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-300" /> Documents
                </span>
                <b className="text-gray-900 font-bold">15%</b>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-gray-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-slate-300" /> Bags
                </span>
                <b className="text-gray-900 font-bold">13%</b>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-1.5 text-gray-600 font-medium">
                  <span className="w-2 h-2 rounded-full bg-slate-200" /> Others
                </span>
                <b className="text-gray-900 font-bold">13%</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

