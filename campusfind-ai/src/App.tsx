import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';

// Public pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

// Student / Common pages
import StudentDashboard from '@/pages/StudentDashboard';
import ExploreItems from '@/pages/ExploreItems';
import ReportLost from '@/pages/ReportLost';
import ReportFound from '@/pages/ReportFound';
import ItemDetails from '@/pages/ItemDetails';
import MyReports from '@/pages/MyReports';
import AIMatches from '@/pages/AIMatches';
import RecoveryRequests from '@/pages/RecoveryRequests';
import NotificationsPage from '@/pages/NotificationsPage';
import Profile from '@/pages/Profile';

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import ManageReports from '@/pages/admin/ManageReports';
import ManageMatches from '@/pages/admin/ManageMatches';
import ManageRecovery from '@/pages/admin/ManageRecovery';
import Verification from '@/pages/admin/Verification';
import ReturnedItems from '@/pages/admin/ReturnedItems';
import ManageUsers from '@/pages/admin/ManageUsers';
import Analytics from '@/pages/admin/Analytics';
import AdminSettings from '@/pages/admin/AdminSettings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes wrapped in common DashboardLayout */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Student & Common */}
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/explore" element={<ExploreItems />} />
            <Route path="/report-lost" element={<ReportLost />} />
            <Route path="/report-found" element={<ReportFound />} />
            <Route path="/item/:id" element={<ItemDetails />} />
            <Route path="/my-reports" element={<MyReports />} />
            <Route path="/matches" element={<AIMatches />} />
            <Route path="/recovery" element={<RecoveryRequests />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/profile" element={<Profile />} />

            {/* Admin Portal */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/reports"
              element={
                <ProtectedRoute requireAdmin>
                  <ManageReports />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/matches"
              element={
                <ProtectedRoute requireAdmin>
                  <ManageMatches />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/recovery"
              element={
                <ProtectedRoute requireAdmin>
                  <ManageRecovery />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/verification"
              element={
                <ProtectedRoute requireAdmin>
                  <Verification />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/returned"
              element={
                <ProtectedRoute requireAdmin>
                  <ReturnedItems />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requireAdmin>
                  <ManageUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute requireAdmin>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
