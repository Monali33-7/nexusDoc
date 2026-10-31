import React, { useState, useEffect } from 'react';
import { InstitutionAnalytics, InstitutionDocument } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  UploadCloud,
  Layers,
  Search,
  BarChart3,
  Sparkles,
  ArrowRight,
  Shield,
  RefreshCw,
  Cpu,
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenUpload: () => void;
  onNavigateToDocuments: () => void;
  onOpenViewer: (docId: string, pageNumber: number) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenUpload,
  onNavigateToDocuments,
  onOpenViewer,
}) => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<InstitutionAnalytics | null>(null);
  const [recentDocs, setRecentDocs] = useState<InstitutionDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = () => {
    setLoading(true);
    Promise.all([
      fetch('/api/analytics').then((r) => r.json()),
      fetch('/api/documents?role=admin').then((r) => r.json()),
    ])
      .then(([analyticsData, docsData]) => {
        setAnalytics(analyticsData);
        if (docsData.documents) {
          setRecentDocs(docsData.documents.slice(0, 6));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 mb-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold mb-3">
            <Shield className="w-3.5 h-3.5" />
            <span>Academic Senate Governance Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Institutional Knowledge Governance Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Welcome, Registrar {user.name}. Manage document ingestion pipelines, OCR text extraction, Telugu/Hindi language packs, approval workflows, and audit queries.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={fetchDashboardData}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenUpload}
            className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Ingest Official Document</span>
          </button>
        </div>
      </div>

      {/* Metric Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Documents */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Library</span>
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {analytics?.totalDocuments ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Official senate approved records</div>
        </div>

        {/* Approved Documents */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Approved & Active</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {analytics?.approvedDocuments ?? 0}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Searchable in RAG vector space</div>
        </div>

        {/* Pending Approvals */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Pending Review</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {analytics?.pendingApprovals ?? 0}
          </div>
          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Awaiting registrar sanction</div>
        </div>

        {/* Total Queries */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total User Queries</span>
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {analytics?.totalUserQueries ?? 0}
          </div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 mt-1">Students & faculty searches</div>
        </div>
      </div>

      {/* Document Ingestion & Processing Status Pipeline */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 mb-8 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Institutional Processing Pipeline & Vector Indexing
            </h2>
          </div>
          <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200">
            Engine: Gemini Multilingual Embeddings + Tesseract OCR
          </span>
        </div>

        {/* Pipeline Step Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-blue-600 font-bold text-xs mb-1">STAGE 1: Ingestion</div>
            <div className="text-slate-800 dark:text-slate-200 font-semibold text-xs">PDF & DOCX Upload</div>
            <p className="text-[11px] text-slate-500 mt-1">Base64 file parsing, mime validation, and metadata extraction.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-indigo-600 font-bold text-xs mb-1">STAGE 2: OCR & Text</div>
            <div className="text-slate-800 dark:text-slate-200 font-semibold text-xs">Telugu & Hindi OCR</div>
            <p className="text-[11px] text-slate-500 mt-1">Tesseract OCR with Telugu language pack & page number preservation.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-purple-600 font-bold text-xs mb-1">STAGE 3: Chunking</div>
            <div className="text-slate-800 dark:text-slate-200 font-semibold text-xs">Semantic Chunks</div>
            <p className="text-[11px] text-slate-500 mt-1">Split paragraphs with exact page markers and section headings.</p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-emerald-600 font-bold text-xs mb-1">STAGE 4: Approval</div>
            <div className="text-slate-800 dark:text-slate-200 font-semibold text-xs">Senate Clearance</div>
            <p className="text-[11px] text-slate-500 mt-1">Activated for student search only upon registrar authorization.</p>
          </div>
        </div>

        {/* Recent Uploads Table */}
        <div className="overflow-x-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-xs text-slate-700 dark:text-slate-300">
              Recent Repository Ingestions
            </span>
            <button
              onClick={onNavigateToDocuments}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View All In Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px] font-semibold">
                <th className="pb-2">Document Title</th>
                <th className="pb-2">Category</th>
                <th className="pb-2">Published Date</th>
                <th className="pb-2">Access Clearance</th>
                <th className="pb-2">Status</th>
                <th className="pb-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentDocs.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="py-2.5 font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {doc.title}
                  </td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {doc.category}
                  </td>
                  <td className="py-2.5 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    {doc.publicationDate}
                  </td>
                  <td className="py-2.5 whitespace-nowrap">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {doc.accessLevel}
                    </span>
                  </td>
                  <td className="py-2.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200">
                      {doc.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => onOpenViewer(doc.id, 1)}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
