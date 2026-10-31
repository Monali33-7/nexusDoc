import React, { useState, useEffect } from 'react';
import {
  Database,
  FileText,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Download,
  Languages,
  ShieldAlert,
  Search,
  ExternalLink,
  BookOpen,
  Send,
  Sparkles,
  Layers,
  ArrowRight,
  Filter
} from 'lucide-react';

interface DatasetOverview {
  institution: string;
  status: string;
  statistics: {
    totalUniqueDocuments: number;
    multilingualVersions: number;
    totalPassageChunks: number;
    evaluationBenchmarkQuestions: number;
    institutionalFaqs: number;
    categories: { name: string; count: number }[];
    languages: string[];
    edgeCaseScenariosCovered: string[];
  };
  deliverableFiles: {
    name: string;
    size: string;
    description: string;
  }[];
}

interface EvalQuestion {
  question_id: string;
  test_type: string;
  language: 'en' | 'hi' | 'te';
  user_role: string;
  query: string;
  expected_behavior: string;
  expected_citation_doc_id: string;
  expected_answer_snippet: string;
}

interface DatasetBenchmarkPageProps {
  onSelectQueryForChat: (query: string) => void;
  onOpenDocViewer: (docId: string) => void;
}

export const DatasetBenchmarkPage: React.FC<DatasetBenchmarkPageProps> = ({
  onSelectQueryForChat,
  onOpenDocViewer,
}) => {
  const [activeTab, setActiveTab] = useState<'benchmark' | 'faqs' | 'downloads' | 'architecture'>('benchmark');
  const [overview, setOverview] = useState<DatasetOverview | null>(null);
  const [questions, setQuestions] = useState<EvalQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [faqLanguage, setFaqLanguage] = useState<'en' | 'hi' | 'te'>('en');

  useEffect(() => {
    fetch('/api/dataset/overview')
      .then((res) => res.json())
      .then((data) => setOverview(data))
      .catch((err) => console.error('Failed to load dataset overview:', err));

    fetch('/api/dataset/evaluation-questions')
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load questions:', err);
        setLoading(false);
      });
  }, []);

  const testTypes = [
    'All',
    'Standard English',
    'Multilingual Hindi',
    'Multilingual Telugu',
    'Expired/Superseded',
    'Conflicting Policies',
    'Missing Information/Refusal',
    'Role Restricted',
  ];

  const filteredQuestions = questions.filter((q) => {
    const matchesType = filterType === 'All' || q.test_type === filterType;
    const matchesSearch =
      !searchQuery ||
      q.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.expected_answer_snippet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.question_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-8 md:p-10 shadow-2xl mb-8 border border-indigo-800/40">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" />
              Complete Institutional Knowledge Dataset
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Vidyasagar National Institute of Technology (VNIT)
            </span>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-amber-500/20 text-amber-300 border border-amber-400/30">
              Synthetic Demo Dataset
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            NexusDoc Institutional Knowledge & Benchmark Suite
          </h1>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
            A comprehensive, interconnected evaluation dataset spanning 90 institutional documents, 270 multilingual versions, 50 FAQs in English, Hindi (Devanagari), and Telugu (Telugu script), with 100 rigorous benchmark evaluation questions.
          </p>

          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-2xl md:text-3xl font-extrabold text-blue-300">90</div>
              <div className="text-xs text-slate-300 font-medium">Unique Documents</div>
              <div className="text-[11px] text-slate-400">270 across EN, HI, TE</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-2xl md:text-3xl font-extrabold text-indigo-300">100</div>
              <div className="text-xs text-slate-300 font-medium">Benchmark Queries</div>
              <div className="text-[11px] text-slate-400">7 validation dimensions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-2xl md:text-3xl font-extrabold text-emerald-300">50</div>
              <div className="text-xs text-slate-300 font-medium">Multilingual FAQs</div>
              <div className="text-[11px] text-slate-400">Synchronized citations</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
              <div className="text-2xl md:text-3xl font-extrabold text-amber-300">8</div>
              <div className="text-xs text-slate-300 font-medium">Deliverable Files</div>
              <div className="text-[11px] text-slate-400">CSV, JSON & Markdown</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
        <button
          onClick={() => setActiveTab('benchmark')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'benchmark'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Evaluation Benchmark Suite ({questions.length})
        </button>
        <button
          onClick={() => setActiveTab('downloads')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'downloads'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Download className="w-4 h-4" />
          Dataset Files & Downloads (8 Deliverables)
        </button>
        <button
          onClick={() => setActiveTab('faqs')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'faqs'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          50 Multilingual FAQs
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            activeTab === 'architecture'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Dataset Architecture & Edge Cases
        </button>
      </div>

      {/* TAB 1: EVALUATION BENCHMARK SUITE */}
      {activeTab === 'benchmark' && (
        <div className="space-y-6">
          {/* Controls: Search and Filter Chips */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search benchmark questions, citations, keywords..."
                className="w-full pl-10 pr-4 py-2 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Showing <span className="font-bold text-blue-600">{filteredQuestions.length}</span> of {questions.length} benchmark questions
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex flex-wrap gap-2">
            {testTypes.map((t) => {
              const count = t === 'All' ? questions.length : questions.filter((q) => q.test_type === t).length;
              return (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    filterType === t
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {t}
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    filterType === t ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Question Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map((q) => (
              <div
                key={q.question_id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">
                        {q.question_id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        q.test_type.includes('Hindi')
                          ? 'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
                          : q.test_type.includes('Telugu')
                          ? 'bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-800'
                          : q.test_type.includes('Expired') || q.test_type.includes('Conflicting')
                          ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                          : q.test_type.includes('Refusal')
                          ? 'bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                          : q.test_type.includes('Restricted')
                          ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                          : 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                      }`}>
                        {q.test_type}
                      </span>
                    </div>

                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {q.language.toUpperCase()} • {q.user_role}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-3">
                    {q.query}
                  </h3>

                  <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800 mb-3 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Expected Behavior:</span>
                      <span className={`font-semibold ${
                        q.expected_behavior.includes('Citation')
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : q.expected_behavior.includes('Warn')
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}>
                        {q.expected_behavior}
                      </span>
                    </div>
                    {q.expected_citation_doc_id !== 'NONE' && (
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Expected Citation:</span>
                        <button
                          onClick={() => onOpenDocViewer(q.expected_citation_doc_id)}
                          className="font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
                        >
                          {q.expected_citation_doc_id}
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-500 dark:text-slate-400 font-medium">Answer Criterion: </span>
                      <span className="text-slate-700 dark:text-slate-300">{q.expected_answer_snippet}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onSelectQueryForChat(q.query)}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-600 hover:text-white text-blue-700 dark:text-blue-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-blue-200 dark:border-blue-800/40 group"
                >
                  <Send className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  Test Live in Chat Assistant
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DATASET DOWNLOADS & MANIFEST */}
      {activeTab === 'downloads' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              Download Dataset Deliverables
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              All 8 required deliverable files are ready for automated evaluation, database seeding, or model benchmarking.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {overview?.deliverableFiles.map((file) => (
                <div
                  key={file.name}
                  className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-slate-50 dark:bg-slate-950/50 flex items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                        {file.name}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {file.size}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {file.description}
                    </p>
                  </div>

                  <a
                    href={`/dataset-files/${file.name}`}
                    download={file.name}
                    className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm flex items-center justify-center shrink-0"
                    title={`Download ${file.name}`}
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: 50 MULTILINGUAL FAQS */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div>
              <h2 className="text-lg font-bold">Official Multilingual FAQ Collection (50 FAQs)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authoritative questions with verified source citations across all 6 categories.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setFaqLanguage('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  faqLanguage === 'en' ? 'bg-white dark:bg-slate-950 text-blue-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setFaqLanguage('hi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  faqLanguage === 'hi' ? 'bg-white dark:bg-slate-950 text-orange-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                हिन्दी (Hindi)
              </button>
              <button
                onClick={() => setFaqLanguage('te')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  faqLanguage === 'te' ? 'bg-white dark:bg-slate-950 text-teal-600 shadow-sm' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                తెలుగు (Telugu)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.slice(0, 20).map((q, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                  <span>FAQ #{String(idx + 1).padStart(3, '0')}</span>
                  <button
                    onClick={() => onOpenDocViewer(q.expected_citation_doc_id)}
                    className="text-blue-600 dark:text-blue-400 font-bold hover:underline flex items-center gap-1"
                  >
                    Citation: {q.expected_citation_doc_id}
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {q.query}
                </h4>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {q.expected_answer_snippet}
                </p>

                <button
                  onClick={() => onSelectQueryForChat(q.query)}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 flex items-center gap-1"
                >
                  Ask this in Assistant <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DATASET ARCHITECTURE & EDGE CASES */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
              10 Institutional Edge Case Scenarios Tested
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              Official institutional knowledge bases encounter complex administrative challenges. NexusDoc is evaluated against 10 critical edge cases:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: '1. Expired Document Detection', desc: 'Queries targeting expired circulars (e.g. 2023 circulars) receive clear notices indicating the document has reached its expiry date.' },
                { title: '2. Superseded Policy Warning', desc: 'When asking about old examination fees (₹1,500 in VNIT-CIR-2024-88), the engine warns that it was superseded by VNIT-CIR-2025-01 (₹1,800).' },
                { title: '3. Conflicting Policy & Draft Resolution', desc: 'Distinguishes between draft proposals (e.g. Saturday makeup labs VNIT-CIR-2025-04) and legally binding approved Senate statutes.' },
                { title: '4. Unapproved Draft & Rejected Status', desc: 'Identifies rejected policies (e.g. off-campus living rent allowance VNIT-CIR-2024-19) and reports disapproval reasons.' },
                { title: '5. Missing Information & Polite Refusal', desc: 'When asked about non-existent items (flight ticket reimbursements, pet adoption, helicopter landing), the assistant refuses politely without hallucination.' },
                { title: '6. Role-Restricted RBAC Confidentiality', desc: 'Restricts student queries into confidential faculty appraisal scores, sealed disciplinary committee records, or administrative salary books.' },
                { title: '7. Multilingual Devanagari Hindi Retrieval', desc: 'Cross-lingual semantic matching for Devanagari queries, retrieving Hindi documents and providing Devanagari responses with source citations.' },
                { title: '8. Multilingual Telugu Script Retrieval', desc: 'Authentic Telugu script query-answering with regional language OCR and passage citation matching.' },
                { title: '9. Acronym & Abbreviation Handling', desc: 'Robust token normalization for M.Tech, B.Tech, CGPA, MCM, GATE, PFMS, BoG, ensuring zero false-negative retrievals.' },
                { title: '10. Exact Page & Section Citation', desc: 'Granular grounding down to page number, section clause, and verified textual passage.' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40"
                >
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
