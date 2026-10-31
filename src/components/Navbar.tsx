import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import { UserRole, LanguageCode } from '../types/index.ts';
import {
  ShieldCheck,
  Languages,
  UserCheck,
  BookOpen,
  MessageSquare,
  LayoutDashboard,
  BarChart3,
  User,
  GraduationCap,
  Briefcase,
  Shield,
  ChevronDown,
  Database,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenUpload?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenUpload }) => {
  const { user, switchRole, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return {
          label: 'Admin (Registrar)',
          bg: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
          icon: <Shield className="w-3.5 h-3.5 text-purple-600" />,
        };
      case 'faculty':
        return {
          label: 'Faculty / Staff',
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
          icon: <Briefcase className="w-3.5 h-3.5 text-emerald-600" />,
        };
      case 'student':
      default:
        return {
          label: 'Student',
          bg: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
          icon: <GraduationCap className="w-3.5 h-3.5 text-blue-600" />,
        };
    }
  };

  const roleInfo = getRoleBadge(user.role);

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-blue-200 bg-clip-text text-transparent">
                  NexusDoc AI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  Institutional RAG
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                Official Knowledge Assistant
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'home'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'chat'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              {t.navChat}
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'documents'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              {t.navDocuments}
            </button>
            {isAdmin ? (
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin Console
              </button>
            ) : user.role === 'faculty' ? (
              <button
                onClick={() => setActiveTab('faculty-portal')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeTab === 'faculty-portal'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Faculty Portal
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('student-portal')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                  activeTab === 'student-portal'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Student Portal
              </button>
            )}
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('dataset-benchmark')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                activeTab === 'dataset-benchmark'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Database className="w-4 h-4 text-indigo-400" />
              Dataset & Benchmark
            </button>
          </nav>

          {/* Right Controls: Role Switcher & Language */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* UI Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
                title="Select Language"
              >
                <Languages className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">
                  {language === 'te' ? 'తెలుగు' : language === 'hi' ? 'हिन्दी' : 'English'}
                </span>
                <span className="sm:hidden">{language.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-36 rounded-xl bg-slate-800 border border-slate-700 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onClick={() => setLangMenuOpen(false)}
                >
                  <button
                    onClick={() => setLanguage('en')}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between ${
                      language === 'en' ? 'bg-blue-600/30 text-blue-400 font-bold' : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>English</span>
                    <span className="text-[10px] text-slate-400">EN</span>
                  </button>
                  <button
                    onClick={() => setLanguage('hi')}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between ${
                      language === 'hi' ? 'bg-blue-600/30 text-blue-400 font-bold' : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>हिन्दी</span>
                    <span className="text-[10px] text-slate-400">HI</span>
                  </button>
                  <button
                    onClick={() => setLanguage('te')}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between ${
                      language === 'te' ? 'bg-blue-600/30 text-blue-400 font-bold' : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span>తెలుగు</span>
                    <span className="text-[10px] text-slate-400">TE</span>
                  </button>
                </div>
              )}
            </div>

            {/* Role Switcher Pill (Quick Interactive Role Toggle) */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition-all ${roleInfo.bg}`}
              >
                {roleInfo.icon}
                <span className="max-w-[120px] truncate">{roleInfo.label}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {roleMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-800 border border-slate-700 shadow-2xl py-2 z-50"
                  onClick={() => setRoleMenuOpen(false)}
                >
                  <div className="px-3 py-1.5 border-b border-slate-700/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Interactive Role Switcher
                  </div>

                  <button
                    onClick={() => switchRole('student')}
                    className={`w-full text-left px-3 py-2.5 hover:bg-slate-700 flex items-start gap-2.5 transition-colors ${
                      user.role === 'student' ? 'bg-blue-900/30 border-l-2 border-blue-500' : ''
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-blue-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-white">Student</div>
                      <div className="text-[11px] text-slate-400">Ananya Sharma (CSE Dept)</div>
                      <div className="text-[10px] text-blue-400 mt-0.5">Approved student docs only</div>
                    </div>
                  </button>

                  <button
                    onClick={() => switchRole('faculty')}
                    className={`w-full text-left px-3 py-2.5 hover:bg-slate-700 flex items-start gap-2.5 transition-colors ${
                      user.role === 'faculty' ? 'bg-emerald-900/30 border-l-2 border-emerald-500' : ''
                    }`}
                  >
                    <Briefcase className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-white">Faculty & Staff</div>
                      <div className="text-[11px] text-slate-400">Dr. Rajesh Rao (Mech Engg)</div>
                      <div className="text-[10px] text-emerald-400 mt-0.5">Can access confidential HR & grants</div>
                    </div>
                  </button>

                  <button
                    onClick={() => switchRole('admin')}
                    className={`w-full text-left px-3 py-2.5 hover:bg-slate-700 flex items-start gap-2.5 transition-colors ${
                      user.role === 'admin' ? 'bg-purple-900/30 border-l-2 border-purple-500' : ''
                    }`}
                  >
                    <Shield className="w-4 h-4 text-purple-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-white">Administrator (Registrar)</div>
                      <div className="text-[11px] text-slate-400">Prof. K. R. Ramanathan</div>
                      <div className="text-[10px] text-purple-400 mt-0.5">Upload, approve & manage all docs</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* User Profile Mini Trigger */}
            <button
              onClick={() => setActiveTab('profile')}
              className="p-1 rounded-full border border-slate-700 hover:border-blue-400 transition-colors"
              title="User Profile"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
