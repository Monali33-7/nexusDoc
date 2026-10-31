import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Briefcase,
  Shield,
  FileText,
  DollarSign,
  Calendar,
  Lock,
  ArrowRight,
  MessageSquare,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface FacultyDashboardProps {
  onNavigateToChat: (prefill?: string) => void;
  onOpenViewer: (docId: string, pageNumber: number) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({
  onNavigateToChat,
  onOpenViewer,
}) => {
  const { user } = useAuth();

  const FACULTY_EXCLUSIVE_RECORDS = [
    {
      title: 'Faculty Seed Research Grant',
      stat: '₹5,00,000',
      highlight: 'Internal Seed Funding 2026',
      detail: 'Available for Assistant & Associate Professors for experimental setups, hardware procurement, and publishing in Scopus / Web of Science Q1 journals. Evaluated biannually in Jan & July.',
      docId: 'doc-faculty-rules-confidential',
      page: 1,
      tag: 'Restricted Confidential',
      query: 'What is the maximum limit for faculty seed research grants?',
    },
    {
      title: 'Consultancy Revenue Sharing',
      stat: '70% : 30%',
      highlight: '70% Investigator / 30% University',
      detail: 'Net revenue generated from sponsored testing and industrial consultancy projects is apportioned directly to the Principal Investigator and team.',
      docId: 'doc-faculty-rules-confidential',
      page: 2,
      tag: 'Consultancy Board',
      query: 'What is the consultancy revenue sharing policy for faculty?',
    },
    {
      title: 'Earned Leave Accumulation',
      stat: '300 Days',
      highlight: 'Maximum Retirement Encashment',
      detail: 'Earned leave is credited at 30 days per completed calendar year, accumulative up to a ceiling of 300 days for encashment upon superannuation.',
      docId: 'doc-faculty-rules-confidential',
      page: 2,
      tag: 'HR Service Statute',
      query: 'What is the earned leave accumulation limit for faculty?',
    },
    {
      title: 'Annual API Merit Increment',
      stat: '3%',
      highlight: 'API Score > 85 / 100',
      detail: 'Faculty members securing Academic Performance Indicator (API) scores above 85 receive an additional 3% merit increment over standard DA.',
      docId: 'doc-faculty-rules-confidential',
      page: 1,
      tag: 'Performance Council',
      query: 'What is the faculty performance appraisal increment rule?',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Faculty Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 mb-8 border border-emerald-800/60 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold mb-3">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <span>Faculty & Staff Clearance • ID: {user.studentOrEmployeeId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1 max-w-2xl leading-relaxed">
            {user.department}. You have authorized security clearance to query institutional HR regulations, confidential research seed grants, and sabbatical leave guidelines.
          </p>
        </div>

        <button
          onClick={() => onNavigateToChat()}
          className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-2 shrink-0 transition-all hover:scale-105"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask NexusDoc AI</span>
        </button>
      </div>

      {/* Confidential Notice */}
      <div className="mb-6 p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/80 flex items-center gap-3 text-xs text-purple-900 dark:text-purple-200">
        <Lock className="w-5 h-5 text-purple-600 shrink-0" />
        <div>
          <span className="font-bold">Role-Based Clearance Active:</span> You are authenticated with Faculty / Staff privileges. When you ask queries regarding seed grants and salary structures, confidential senate statutes will be retrieved. If a student asks the same questions, access is automatically restricted.
        </div>
      </div>

      {/* High-Impact Faculty Cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-600" />
            <span>Confidential Faculty Policies & Research Grants</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">Senate Research Board 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FACULTY_EXCLUSIVE_RECORDS.map((policy, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors"
            >
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 mb-2 border border-purple-200">
                  {policy.tag}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                  {policy.title}
                </h3>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 my-2">
                  {policy.stat}
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  {policy.highlight}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  {policy.detail}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <button
                  onClick={() => onOpenViewer(policy.docId, policy.page)}
                  className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-medium flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Page {policy.page}</span>
                </button>
                <button
                  onClick={() => onNavigateToChat(policy.query)}
                  className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Verify</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
