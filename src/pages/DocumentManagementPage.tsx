import React, { useState, useEffect } from 'react';
import { InstitutionDocument, DocCategory, UserRole } from '../types/index.ts';
import { useAuth } from '../context/AuthContext.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';
import {
  Search,
  Filter,
  Plus,
  FileText,
  Calendar,
  Shield,
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

interface DocumentManagementPageProps {
  onOpenUpload: () => void;
  onOpenViewer: (docId: string, pageNumber: number) => void;
}

const CATEGORIES: (DocCategory | 'All')[] = [
  'All',
  'Academic Regulations',
  'Examination Notifications',
  'Fee Structures & Circulars',
  'Hostel Rules & Timings',
  'Attendance Policies',
  'Leave Policies',
  'Scholarship Information',
  'HR Policies & Grants',
  'Administrative Notices',
  'Student Handbooks',
];

export const DocumentManagementPage: React.FC<DocumentManagementPageProps> = ({
  onOpenUpload,
  onOpenViewer,
}) => {
  const { user, isAdmin } = useAuth();
  const { t } = useLanguage();

  const [documents, setDocuments] = useState<InstitutionDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchDocuments = () => {
    setLoading(true);
    fetch(`/api/documents?role=${user.role}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.documents) {
          setDocuments(data.documents);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDocuments();
  }, [user.role]);

  const handleApprove = async (docId: string) => {
    try {
      const res = await fetch(`/api/documents/${docId}/approve`, { method: 'POST' });
      if (res.ok) {
        setActionMessage('Document approved and activated for search!');
        setTimeout(() => setActionMessage(null), 3000);
        fetchDocuments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleReject = async (docId: string) => {
    try {
      const res = await fetch(`/api/documents/${docId}/reject`, { method: 'POST' });
      if (res.ok) {
        setActionMessage('Document status set to Rejected.');
        setTimeout(() => setActionMessage(null), 3000);
        fetchDocuments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!window.confirm('Are you sure you want to delete this official document from the repository?')) return;
    try {
      const res = await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
      if (res.ok) {
        setActionMessage('Document deleted successfully.');
        setTimeout(() => setActionMessage(null), 3000);
        fetchDocuments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResetSeed = async () => {
    if (!window.confirm('Reset the repository to the initial verified institutional seed documents?')) return;
    try {
      const res = await fetch('/api/documents/reset-seed', { method: 'POST' });
      if (res.ok) {
        setActionMessage('Document library reset to verified institutional seed dataset.');
        setTimeout(() => setActionMessage(null), 3000);
        fetchDocuments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || doc.category === selectedCategory;

    const matchesStatus =
      statusFilter === 'all' || doc.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Institutional Document Library
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200">
              {filteredDocs.length} Documents
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Central repository of approved official regulations, circulars, notifications, and handbooks.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              <button
                onClick={handleResetSeed}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
                title="Reset Library to Seed"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Seed</span>
              </button>
              <button
                onClick={onOpenUpload}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Document</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionMessage && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 mb-6 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, department, or keywords..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter (Admin only) */}
        {isAdmin && (
          <div className="w-full md:w-44">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="approved">Approved Only</option>
              <option value="pending">Pending Approval</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        )}
      </div>

      {/* Documents Table / Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading verified institutional documents...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
            No institutional documents found
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search keywords or category filters.
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                  <th className="py-3 px-4">Document Title & Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Dates</th>
                  <th className="py-3 px-4">Access Level</th>
                  <th className="py-3 px-4">Status & OCR</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredDocs.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Title & Metadata */}
                    <td className="py-3 px-4 max-w-sm">
                      <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {doc.description}
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                        <span>{doc.fileName}</span>
                        <span>•</span>
                        <span>{doc.pageCount} Pages</span>
                        <span>•</span>
                        <span>{doc.chunks.length} Chunks</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                        {doc.category}
                      </span>
                      <div className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[140px]">
                        {doc.department}
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Pub: {doc.publicationDate}</span>
                      </div>
                      {doc.effectiveDate && (
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          Eff: {doc.effectiveDate}
                        </div>
                      )}
                    </td>

                    {/* Access Level */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      {doc.accessLevel === 'faculty_only' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200">
                          Faculty Only (Confidential)
                        </span>
                      ) : doc.accessLevel === 'admin_only' ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-200">
                          Admin Only
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200">
                          All Institution Members
                        </span>
                      )}
                    </td>

                    {/* Status & OCR */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 mb-1">
                        {doc.status === 'approved' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Approved
                          </span>
                        ) : doc.status === 'rejected' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border border-red-300 flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending Review
                          </span>
                        )}
                      </div>
                      {doc.isScanned && (
                        <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400">
                          OCR: {doc.ocrLanguage ? 'Telugu/Hindi/Eng' : 'Scanned'}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenViewer(doc.id, 1)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 flex items-center gap-1 transition-colors"
                          title="View Document & Citations"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>

                        {isAdmin && (
                          <>
                            {doc.status === 'pending' && (
                              <button
                                onClick={() => handleApprove(doc.id)}
                                className="px-2 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
                                title="Approve Document"
                              >
                                Approve
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(doc.id)}
                              className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                              title="Delete Document"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
