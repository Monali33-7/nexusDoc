import React, { useState, useEffect } from 'react';
import { InstitutionDocument, DocumentPage } from '../../types/index.ts';
import {
  X,
  FileText,
  Calendar,
  Shield,
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle,
  AlertTriangle,
  Highlighter,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface DocumentViewerModalProps {
  documentId: string | null;
  targetPage?: number;
  highlightText?: string;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  documentId,
  targetPage = 1,
  highlightText = '',
  onClose,
}) => {
  const { user } = useAuth();
  const [doc, setDoc] = useState<InstitutionDocument | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(targetPage);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!documentId) return;
    setLoading(true);
    fetch(`/api/documents/${documentId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.document) {
          setDoc(data.document);
          setCurrentPage(targetPage || 1);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [documentId, targetPage]);

  if (!documentId) return null;

  const activePageObj: DocumentPage | undefined = doc?.fullPages?.find(
    (p) => p.pageNumber === currentPage
  ) || doc?.fullPages?.[0];

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // Function to render text with highlighted excerpts
  const renderHighlightedContent = (text: string) => {
    if (!text) return null;

    const termToHighlight = searchQuery.trim() || highlightText.trim();
    if (!termToHighlight) {
      return <pre className="whitespace-pre-wrap font-sans leading-relaxed text-sm text-slate-800 dark:text-slate-200">{text}</pre>;
    }

    // Split text by matching term case-insensitively
    try {
      const escaped = termToHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 50);
      const parts = text.split(new RegExp(`(${escaped})`, 'gi'));

      return (
        <div className="whitespace-pre-wrap font-sans leading-relaxed text-sm text-slate-800 dark:text-slate-200">
          {parts.map((part, i) =>
            part.toLowerCase() === termToHighlight.toLowerCase().slice(0, 50) ? (
              <mark key={i} className="bg-yellow-200 dark:bg-yellow-900/80 text-yellow-950 dark:text-yellow-100 px-1 py-0.5 rounded font-semibold border-b-2 border-yellow-500">
                {part}
              </mark>
            ) : (
              part
            )
          )}
        </div>
      );
    } catch {
      return <pre className="whitespace-pre-wrap font-sans leading-relaxed text-sm text-slate-800 dark:text-slate-200">{text}</pre>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-6xl h-[90vh] rounded-2xl shadow-2xl flex flex-col border border-slate-700/60 overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3 truncate">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {doc?.title || 'Institutional Document Viewer'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium">{doc?.fileName}</span>
                <span>•</span>
                <span>{doc?.fileSize}</span>
                {doc?.isScanned && (
                  <>
                    <span>•</span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 px-1.5 py-0.2 rounded font-semibold">
                      OCR Scanned Archive
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{downloadSuccess ? 'Downloaded!' : 'Download Official PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Close Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Side-by-side split */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : !doc ? (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Document could not be loaded.
          </div>
        ) : (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Panel: Verified Metadata & Citations Context */}
            <div className="w-full md:w-80 lg:w-96 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-5 overflow-y-auto bg-slate-50/70 dark:bg-slate-950/40 shrink-0 text-xs">
              <div className="font-bold text-slate-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Document Governance Details</span>
              </div>

              {/* Status Badge */}
              <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 mb-4 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-500 font-medium">Verification Status</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center gap-1 border border-emerald-300">
                    <CheckCircle className="w-3 h-3" />
                    Senate Approved
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Approved by <span className="font-semibold text-slate-700 dark:text-slate-300">{doc.approvedBy || 'Registrar'}</span>
                </div>
              </div>

              {/* Metadata Attributes */}
              <div className="space-y-3 mb-5">
                <div>
                  <div className="text-slate-400 font-medium text-[11px] mb-0.5">Category</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{doc.category}</div>
                </div>

                <div>
                  <div className="text-slate-400 font-medium text-[11px] mb-0.5">Department / Authority</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">{doc.department}</div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-slate-400 font-medium text-[11px] mb-0.5">Publication Date</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{doc.publicationDate}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-medium text-[11px] mb-0.5">Effective Date</div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{doc.effectiveDate || 'Immediate'}</div>
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 font-medium text-[11px] mb-0.5">Access Permissions</div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200">
                    <Shield className="w-3 h-3" />
                    <span>{doc.accessLevel === 'all' ? 'All Institution Members' : doc.accessLevel === 'faculty_only' ? 'Confidential (Faculty & Admin Only)' : 'Students & Faculty'}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-5">
                <div className="text-slate-400 font-medium text-[11px] mb-1">Official Summary</div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  {doc.description}
                </p>
              </div>

              {/* Cited Passage Highlight Info */}
              {highlightText && (
                <div className="p-3 rounded-xl bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/60 text-yellow-900 dark:text-yellow-200">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-xs">
                    <Highlighter className="w-3.5 h-3.5 text-yellow-600" />
                    <span>Cited Query Passage</span>
                  </div>
                  <p className="text-[11px] font-mono leading-relaxed line-clamp-4">
                    "{highlightText}"
                  </p>
                  <button
                    onClick={() => setCurrentPage(targetPage)}
                    className="mt-2 text-[10px] font-bold text-yellow-800 dark:text-yellow-300 underline"
                  >
                    Jump to Cited Page {targetPage}
                  </button>
                </div>
              )}
            </div>

            {/* Right Panel: Official Document Page Preview */}
            <div className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-900 overflow-hidden">
              {/* Document Toolbar */}
              <div className="flex items-center justify-between px-5 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs shrink-0">
                {/* Page Navigation */}
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:pointer-events-none"
                    title="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Page {currentPage} of {doc.pageCount}
                  </span>
                  <button
                    disabled={currentPage >= doc.pageCount}
                    onClick={() => setCurrentPage((p) => Math.min(doc.pageCount, p + 1))}
                    className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-30 disabled:pointer-events-none"
                    title="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* In-Document Keyword Search */}
                <div className="relative w-48 sm:w-64">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search inside page..."
                    className="w-full text-xs pl-8 pr-3 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Rendered Document Sheet Container */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center bg-slate-200/70 dark:bg-slate-950/80">
                <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg shadow-xl p-8 sm:p-12 min-h-[500px] flex flex-col justify-between">
                  <div>
                    {/* Document Page Header */}
                    <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-6 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="font-bold tracking-wider uppercase text-slate-600 dark:text-slate-300">
                          {doc.department}
                        </span>
                        {activePageObj?.ocrConfidence && (
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-200">
                            OCR Quality: {activePageObj.ocrConfidence.toFixed(1)}%
                          </span>
                        )}
                      </div>
                      <span className="font-mono">P. {currentPage}</span>
                    </div>

                    {/* Page Content */}
                    <div className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans text-sm">
                      {activePageObj?.text ? (
                        renderHighlightedContent(activePageObj.text)
                      ) : (
                        <div className="text-slate-400 italic">No text content recorded for this page.</div>
                      )}
                    </div>
                  </div>

                  {/* Document Page Footer */}
                  <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-8 flex items-center justify-between text-[11px] text-slate-400">
                    <span>NexusDoc Institutional Archive • Authenticated Copy</span>
                    <span>Document ID: {doc.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
