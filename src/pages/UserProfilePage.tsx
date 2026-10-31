import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { UserRole } from '../types/index.ts';
import {
  User,
  Shield,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Lock,
  Mail,
  Building,
  KeyRound,
  IdCard,
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { user, switchRole } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden mb-8">
        {/* Cover banner */}
        <div className="h-32 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800" />

        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 sm:-mt-12 mb-6 gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-xl"
              />
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  {user.name}
                </h1>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center justify-center sm:justify-start gap-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{user.department}</span>
                  <span>•</span>
                  <span>ID: {user.studentOrEmployeeId}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                user.role === 'admin'
                  ? 'bg-purple-100 text-purple-800 border border-purple-200'
                  : user.role === 'faculty'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-blue-100 text-blue-800 border border-blue-200'
              }`}>
                {user.role} role active
              </span>
            </div>
          </div>

          {/* User Profile Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Mail className="w-3.5 h-3.5 text-blue-500" />
                <span className="font-medium">Institutional Email</span>
              </div>
              <div className="font-semibold text-slate-900 dark:text-white truncate">
                {user.email}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <Building className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-medium">Department</span>
              </div>
              <div className="font-semibold text-slate-900 dark:text-white truncate">
                {user.department}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                <IdCard className="w-3.5 h-3.5 text-purple-500" />
                <span className="font-medium">Academic / Staff ID</span>
              </div>
              <div className="font-semibold text-slate-900 dark:text-white font-mono">
                {user.studentOrEmployeeId}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Role Clearance & Interactive Switcher */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs mb-8">
        <h2 className="text-base font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-blue-600" />
          <span>Role-Based Access Control (RBAC) Permissions</span>
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          NexusDoc AI enforces zero-leakage security. Switch between roles below to inspect how document search and confidential permissions dynamically adjust.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Student Profile */}
          <div
            onClick={() => switchRole('student')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              user.role === 'student'
                ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-400 shadow-md ring-2 ring-blue-500/20'
                : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              {user.role === 'student' && (
                <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">Student</div>
            <div className="text-xs text-slate-500 mb-3">Ananya Sharma (B.Tech CSE)</div>
            <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 border-t border-slate-200 dark:border-slate-700/60 pt-3">
              <li className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Academic Regulations & Attendance</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Examination Fees & Deadlines</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Hostel Rules & Curfew</span>
              </li>
              <li className="flex items-center gap-1.5 text-rose-500 font-medium">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                <span>Confidential Faculty HR & Grants (Blocked)</span>
              </li>
            </ul>
          </div>

          {/* Faculty Profile */}
          <div
            onClick={() => switchRole('faculty')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              user.role === 'faculty'
                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 shadow-md ring-2 ring-emerald-500/20'
                : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
              {user.role === 'faculty' && (
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">Faculty & Staff</div>
            <div className="text-xs text-slate-500 mb-3">Dr. Rajesh Rao (Mech Engg)</div>
            <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 border-t border-slate-200 dark:border-slate-700/60 pt-3">
              <li className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>All Student Institutional Policies</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Confidential Seed Research Grants (₹5L)</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Consultancy Revenue Sharing (70:30)</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Earned Leave (300 Days Ceiling)</span>
              </li>
            </ul>
          </div>

          {/* Admin Profile */}
          <div
            onClick={() => switchRole('admin')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              user.role === 'admin'
                ? 'bg-purple-50/80 dark:bg-purple-950/40 border-purple-400 shadow-md ring-2 ring-purple-500/20'
                : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              {user.role === 'admin' && (
                <span className="text-[10px] font-bold bg-purple-600 text-white px-2 py-0.5 rounded-full">
                  Current
                </span>
              )}
            </div>
            <div className="font-bold text-sm text-slate-900 dark:text-white mb-1">Administrator (Registrar)</div>
            <div className="text-xs text-slate-500 mb-3">Prof. K. R. Ramanathan</div>
            <ul className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1.5 border-t border-slate-200 dark:border-slate-700/60 pt-3">
              <li className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Upload PDF/DOCX & Scanned Docs</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Approve or Reject Ingested Policies</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Manage Permissions & Date Overrides</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Full Access to All 100% of Documents</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
