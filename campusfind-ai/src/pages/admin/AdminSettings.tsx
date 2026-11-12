import { Settings, Save } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">System Settings</h1>
        </div>
        <p className="text-sm text-gray-500 mt-1">Configure AI matching weights and platform security policies</p>
      </div>

      <div className="card p-6 space-y-6">
        <h3 className="font-bold text-gray-900 text-base">AI Weighted Matching Thresholds</h3>
        <div className="space-y-4 text-sm">
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-gray-700">Description Semantic Weight</span>
              <span className="font-bold text-primary">35%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[35%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-gray-700">Category Match Weight</span>
              <span className="font-bold text-primary">25%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[25%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-gray-700">Location Proximity Weight</span>
              <span className="font-bold text-primary">25%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[25%]" />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="font-medium text-gray-700">Date Proximity Weight</span>
              <span className="font-bold text-primary">15%</span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-[15%]" />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 space-y-3">
          <h4 className="font-bold text-gray-900 text-sm">TrustLoop Protocol Safeguards</h4>
          <label className="flex items-center gap-3 cursor-pointer text-xs text-gray-700">
            <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
            <span>Require dual sign-off (both Owner and Finder) before resolving claims</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer text-xs text-gray-700">
            <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary" />
            <span>Hide claimant private details from public explore pages</span>
          </label>
        </div>
      </div>
    </div>
  );
}

