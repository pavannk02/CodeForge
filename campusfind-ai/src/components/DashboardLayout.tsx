import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { clsx } from 'clsx';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <Sidebar
          collapsed={false}
          onToggle={() => {}}
          onClose={() => setMobileOpen(false)}
          mobile
        />
      )}

      {/* Main content */}
      <div
        className={clsx(
          'transition-all duration-300',
          collapsed ? 'lg:ml-[72px]' : 'lg:ml-64'
        )}
      >
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="page-container animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

