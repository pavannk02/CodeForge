import { useState } from 'react';
import { Users, Shield, UserCheck, Search } from 'lucide-react';

const mockUsers = [
  { id: '1', name: 'Aryan Kumar', email: 'student@campus.edu', studentId: 'CS2024001', role: 'student', reports: 3, status: 'Active' },
  { id: '2', name: 'Neha Sharma', email: 'student2@campus.edu', studentId: 'CS2024002', role: 'student', reports: 2, status: 'Active' },
  { id: '3', name: 'Security Admin', email: 'admin@campus.edu', studentId: 'ADM-SEC-01', role: 'admin', reports: 0, status: 'Active' },
  { id: '4', name: 'Rohan Verma', email: 'rohan.v@campus.edu', studentId: 'ME2024018', role: 'student', reports: 1, status: 'Active' },
  { id: '5', name: 'Kunal Joshi', email: 'kunal.j@campus.edu', studentId: 'EC2024055', role: 'student', reports: 4, status: 'Active' },
];

export default function ManageUsers() {
  const [search, setSearch] = useState('');

  const filtered = mockUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.studentId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Campus User Directory</h1>
          </div>
          <p className="text-sm text-gray-500 mt-1">Authorized campus personnel and verified students</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student name, college email or ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50/75 border-b border-gray-100 text-xs uppercase font-bold text-gray-400">
            <tr>
              <th className="px-5 py-4">User</th>
              <th className="px-5 py-4">Student ID</th>
              <th className="px-5 py-4">Role</th>
              <th className="px-5 py-4">Submissions</th>
              <th className="px-5 py-4 text-right">Account Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-gray-50/50">
                <td className="px-5 py-4">
                  <div className="font-semibold text-gray-900">{u.name}</div>
                  <div className="text-xs text-gray-400">{u.email}</div>
                </td>
                <td className="px-5 py-4 font-mono text-xs">{u.studentId}</td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    u.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-5 py-4 font-semibold text-gray-700">{u.reports}</td>
                <td className="px-5 py-4 text-right">
                  <span className="badge-success text-xs font-semibold">{u.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

