import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Shield, Award, CheckCircle2, LogOut } from 'lucide-react';

export default function Profile() {
  const { profile, updateProfile, signOut, isAdmin } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [studentId, setStudentId] = useState(profile?.student_id || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        full_name: fullName,
        student_id: studentId,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Your Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your student credentials & account preferences</p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Profile updated successfully!
        </div>
      )}

      {/* Profile Overview Card */}
      <div className="card flex flex-col sm:flex-row items-center gap-6 p-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
          {profile?.full_name?.charAt(0) || 'U'}
        </div>
        <div className="text-center sm:text-left space-y-1">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <h2 className="text-xl font-bold text-gray-900">{profile?.full_name}</h2>
            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
              isAdmin ? 'bg-primary/10 text-primary' : 'bg-blue-50 text-blue-600'
            }`}>
              {isAdmin ? 'Campus Admin' : 'Student'}
            </span>
          </div>
          <p className="text-sm text-gray-500">{profile?.email}</p>
          <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
            <span>Student ID: <b className="text-gray-700">{profile?.student_id || 'Not set'}</b></span>
            <span>•</span>
            <span>Status: <b className="text-emerald-600">Active</b></span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Edit Personal Information</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="input-field"
            />
          </div>

          <div>
            <label className="label">College Email (Read only)</label>
            <input
              type="email"
              disabled
              value={profile?.email || ''}
              className="input-field bg-gray-50 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="label">Student ID Number</label>
            <input
              type="text"
              placeholder="e.g. CS2024042"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              className="input-field"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={signOut}
              className="btn-danger text-sm py-2 px-4 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary text-sm py-2 px-6"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

