import React from 'react';
import {
  ShieldCheck,
  Search,
  BookOpen,
  Languages,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowRight,
  FileText,
  Sparkles,
  ExternalLink,
  Award,
  Layers,
  Scale,
  Database,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

interface LandingPageProps {
  onStartAsking: () => void;
  onExploreLibrary: () => void;
  onSelectTestQuery: (query: string) => void;
  onNavigateToBenchmark?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAsking,
  onExploreLibrary,
  onSelectTestQuery,
  onNavigateToBenchmark,
}) => {
  const { t, language } = useLanguage();
  const { switchRole } = useAuth();

  const TEST_BENCH_SCENARIOS = [
    {
      id: 'test-1',
      title: 'TEST 1: English Query on English Regulation',
      query: 'What is the minimum attendance requirement?',
      expected: 'Accurate 75% rule with verbatim citation from Academic Regulations 2026, Page 1.',
      badge: 'Grounded RAG',
      color: 'blue',
    },
    {
      id: 'test-2',
      title: 'TEST 2: Telugu Query on English Document',
      query: 'కనీస హాజరు ఎంత ఉండాలి?',
      expected: 'Responds in natural Telugu, while preserving English source passage verbatim.',
      badge: 'Cross-Lingual Parity',
      color: 'indigo',
    },
    {
      id: 'test-3',
      title: 'TEST 3: Hindi Query on Attendance & Exams',
      query: 'न्यूनतम उपस्थिति कितनी होनी चाहिए?',
      expected: 'Responds in official Hindi (75% अनिवार्यता) with authentic page reference.',
      badge: 'Hindi Support',
      color: 'emerald',
    },
    {
      id: 'test-4',
      title: 'TEST 4: Absent Question (Strict Anti-Hallucination)',
      query: 'Is there an Olympic-size swimming pool in the student activity center?',
      expected: 'Strict Refusal: "Not found in the document..." Zero guessing or hallucination.',
      badge: 'Refusal Guardrail',
      color: 'amber',
    },
    {
      id: 'test-5',
      title: 'TEST 5: Outdated Policy & Conflict Detection',
      query: 'What is the examination fee?',
      expected: 'Flags 2024 fee (Rs 1,500) vs 2026 fee (Rs 1,800) with explicit supersession warning!',
      badge: 'Supersession Warning',
      color: 'purple',
    },
    {
      id: 'test-6',
      title: 'TEST 6: Role-Based Confidential Restriction',
      query: 'What is the maximum limit for faculty seed research grants?',
      expected: 'Restricted for Student role; Answered with Rs 5 Lakhs grant citation for Faculty!',
      badge: 'RBAC Security',
      color: 'rose',
    },
    {
      id: 'test-7',
      title: 'TEST 7: Scanned Telugu Circular (OCR Extraction)',
      query: 'హాస్టల్ ప్రవేశ వేళలు మరియు బయోమెట్రిక్ సమయాలు ఏమిటి?',
      expected: 'Extracts 9:00 PM curfew from scanned Telugu circular with page reference.',
      badge: 'Telugu OCR',
      color: 'cyan',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Trust Banner Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/90 border border-slate-700/80 text-blue-400 text-xs font-semibold mb-6 shadow-md backdrop-blur-sm">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Institution-Wide Shared Document Library • Senate Approved</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 max-w-4xl mx-auto leading-tight">
            One Institution.{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              One Knowledge Hub.
            </span>{' '}
            Zero Guesswork.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Your trusted AI assistant for finding accurate answers from official institutional documents in{' '}
            <span className="text-blue-400 font-semibold">English</span>,{' '}
            <span className="text-indigo-400 font-semibold">हिन्दी</span>, and{' '}
            <span className="text-purple-400 font-semibold">తెలుగు</span>. Backed strictly by page-level citations, date tracking, and zero hallucination.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={onStartAsking}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-blue-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95"
            >
              <span>Start Asking</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onExploreLibrary}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-base transition-colors flex items-center justify-center gap-2"
            >
              <BookOpen className="w-5 h-5 text-blue-400" />
              <span>Explore Document Library</span>
            </button>
            {onNavigateToBenchmark && (
              <button
                onClick={onNavigateToBenchmark}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-200 border border-indigo-700/60 font-semibold text-base transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Database className="w-5 h-5 text-indigo-400" />
                <span>Dataset & Benchmark (100 Tests)</span>
              </button>
            )}
          </div>

          {/* Institutional Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4 border-t border-slate-800/80 text-left">
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 mb-2" />
              <div className="font-bold text-white text-sm">100% Grounded RAG</div>
              <p className="text-xs text-slate-400 mt-1">Answers sourced strictly from senate statutes.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <FileText className="w-5 h-5 text-blue-400 mb-2" />
              <div className="font-bold text-white text-sm">Verbatim Citations</div>
              <p className="text-xs text-slate-400 mt-1">Exact page numbers & authentic source text.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <Scale className="w-5 h-5 text-amber-400 mb-2" />
              <div className="font-bold text-white text-sm">Conflict Detection</div>
              <p className="text-xs text-slate-400 mt-1">Detects superseded & conflicting circulars.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-800">
              <Lock className="w-5 h-5 text-purple-400 mb-2" />
              <div className="font-bold text-white text-sm">Role-Based Access</div>
              <p className="text-xs text-slate-400 mt-1">Student, Faculty, and Admin permissions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Hackathon Test Bench Section */}
      <section className="py-16 bg-slate-950/70 border-t border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>National Hackathon Verification Test Bench</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Test Core Capabilities in 1-Click
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Select any of the 7 pre-configured test scenarios below to see real-time strict retrieval, cross-lingual translation, conflict warnings, and security enforcement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEST_BENCH_SCENARIOS.map((scenario) => (
              <div
                key={scenario.id}
                onClick={() => {
                  if (scenario.id === 'test-6') {
                    // Switch to student to demo restriction or faculty
                    switchRole('student');
                  }
                  onSelectTestQuery(scenario.query);
                }}
                className="group p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/60 hover:bg-slate-850 cursor-pointer transition-all duration-200 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                      {scenario.badge}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">1-Click Test</span>
                  </div>
                  <h3 className="font-bold text-sm text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {scenario.title}
                  </h3>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 mb-3">
                    "{scenario.query}"
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Expected:</strong> {scenario.expected}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-semibold group-hover:translate-x-1 transition-transform">
                  <span>Run Live Query</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RAG Pipeline Architectural Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            How NexusDoc AI Enforces 100% Institutional Truth
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            The strict 9-step governance pipeline that replaces generic AI guesswork with verifiable administrative records.
          </p>
        </div>

        <div className="relative border-l-2 border-blue-600/40 ml-4 md:ml-32 space-y-8">
          <div className="relative pl-6 sm:pl-8">
            <span className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-blue-600 border-4 border-slate-900" />
            <div className="font-bold text-white text-base">Step 1: Multilingual Query Language Detection</div>
            <p className="text-xs text-slate-400 mt-1">Identifies whether the student or faculty asked in English, हिन्दी, or తెలుగు without altering original policy context.</p>
          </div>

          <div className="relative pl-6 sm:pl-8">
            <span className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-blue-600 border-4 border-slate-900" />
            <div className="font-bold text-white text-base">Step 2: Role-Based Document Access Filtering</div>
            <p className="text-xs text-slate-400 mt-1">Prevents unauthorized roles from retrieving confidential documents (e.g. Faculty seed grants are invisible to Students).</p>
          </div>

          <div className="relative pl-6 sm:pl-8">
            <span className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-blue-600 border-4 border-slate-900" />
            <div className="font-bold text-white text-base">Step 3: Multilingual Semantic & Keyword Vector Search</div>
            <p className="text-xs text-slate-400 mt-1">Retrieves approved document passages using cross-lingual embeddings supporting English, Hindi, and Telugu.</p>
          </div>

          <div className="relative pl-6 sm:pl-8">
            <span className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-blue-600 border-4 border-slate-900" />
            <div className="font-bold text-white text-base">Step 4: Strict Hallucination & Confidence Gate</div>
            <p className="text-xs text-slate-400 mt-1">If relevance threshold is not met, the system refuses immediately: "Not found in the document." Zero speculation permitted.</p>
          </div>

          <div className="relative pl-6 sm:pl-8">
            <span className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-blue-600 border-4 border-slate-900" />
            <div className="font-bold text-white text-base">Step 5: Conflict & Date Supersession Verification</div>
            <p className="text-xs text-slate-400 mt-1">Compares publication and effective dates. Warns users when an older circular is superseded by a newer approved statute.</p>
          </div>

          <div className="relative pl-6 sm:pl-8">
            <span className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-blue-600 border-4 border-slate-900" />
            <div className="font-bold text-white text-base">Step 6: Same-Language Synthesis with Exact Citations</div>
            <p className="text-xs text-slate-400 mt-1">Generates response in the user's prompt language with exact page references and clickable links to the authenticated original PDF.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
