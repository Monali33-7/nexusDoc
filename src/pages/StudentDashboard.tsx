import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  GraduationCap,
  MessageSquare,
  Clock,
  Award,
  CreditCard,
  FileText,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigateToChat: (prefill?: string) => void;
  onOpenViewer: (docId: string, pageNumber: number) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onNavigateToChat,
  onOpenViewer,
}) => {
  const { user } = useAuth();

  const STUDENT_POLICIES = [
    {
      title: 'Minimum Attendance Requirement',
      stat: '75%',
      highlight: 'Mandatory in each subject',
      detail: 'Condonation permitted between 65% and 74.9% with Dean approval and Rs. 1,000/- medical fee. Below 65% leads to summary detention.',
      docId: 'doc-acad-reg-2026',
      page: 1,
      tag: 'Academic Regulations 2026',
      query: 'What is the minimum attendance requirement?',
    },
    {
      title: 'Semester Examination Fee',
      stat: '₹1,800',
      highlight: 'Last Date: 25 March 2026',
      detail: 'Regular undergraduate semester examination fee. Late fee of Rs. 500/- applies between 26 March and 02 April 2026.',
      docId: 'doc-exam-circular-2026',
      page: 1,
      tag: 'COE Circular 2026',
      query: 'What is the examination fee?',
    },
    {
      title: 'Hostel Entry Curfew & Timings',
      stat: '9:00 PM',
      highlight: 'Biometric: 9:00 - 9:45 PM',
      detail: 'All residential students must check in before 9:00 PM on weekdays (9:30 PM on weekends). Night out pass requires 24h prior parental approval.',
      docId: 'doc-hostel-rules-2025',
      page: 1,
      tag: 'Hostel Handbook',
      query: 'What are the hostel timings?',
    },
    {
      title: 'Merit Scholarship Waiver',
      stat: '50%',
      highlight: 'Eligibility: CGPA ≥ 8.50',
      detail: 'Institutional Merit Scholarship provides 50% tuition waiver for students with no active backlogs. Need-cum-Merit is available for family income < 5 Lakhs.',
      docId: 'doc-scholarship-2025',
      page: 1,
      tag: 'Scholarship Policy',
      query: 'What is the scholarship eligibility criteria?',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Student Welcome Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 mb-8 border border-blue-800/80 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold mb-3">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span>Student Academic Portal • Roll No: {user.studentOrEmployeeId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-2xl leading-relaxed">
            Department of {user.department}. Search verified senate policies, exam deadlines, and hostel rules with 100% citation accuracy.
          </p>
        </div>

        <button
          onClick={() => onNavigateToChat()}
          className="px-6 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs shadow-lg shadow-blue-500/30 flex items-center gap-2 shrink-0 transition-all hover:scale-105"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask NexusDoc AI</span>
        </button>
      </div>

      {/* High-Impact Policy Cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span>Essential Institutional Statutes for Students</span>
          </h2>
          <span className="text-xs text-slate-500 font-medium">All numbers backed by Senate circulars</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STUDENT_POLICIES.map((policy, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
            >
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-2">
                  {policy.tag}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                  {policy.title}
                </h3>
                <div className="text-3xl font-black text-blue-600 dark:text-blue-400 my-2">
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
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <span>Verify</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Multilingual Quick Assistance Banner */}
      <div className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
            Need help in your regional language?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ask queries in Telugu (తెలుగు) or Hindi (हिन्दी) and get instant official answers with original source citations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateToChat('కనీస హాజరు ఎంత ఉండాలి?')}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-slate-300 dark:border-slate-600 shadow-xs hover:bg-slate-50"
          >
            తెలుగు ప్రశ్నించండి
          </button>
          <button
            onClick={() => onNavigateToChat('न्यूनतम उपस्थिति कितनी होनी चाहिए?')}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-slate-300 dark:border-slate-600 shadow-xs hover:bg-slate-50"
          >
            हिन्दी में पूछें
          </button>
        </div>
      </div>
    </div>
  );
};
