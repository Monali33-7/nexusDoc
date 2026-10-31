import React from 'react';
import { Citation } from '../../types/index.ts';
import { FileText, Calendar, ExternalLink, Bookmark, AlertTriangle } from 'lucide-react';

interface CitationCardProps {
  citation: Citation;
  index: number;
  onViewDocument: (docId: string, pageNumber: number) => void;
}

export const CitationCard: React.FC<CitationCardProps> = ({ citation, index, onViewDocument }) => {
  return (
    <div
      className={`border rounded-xl p-3.5 transition-all text-xs ${
        citation.isSuperseded
          ? 'bg-amber-50/70 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm'
      }`}
    >
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-[11px] font-bold">
            {index + 1}
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="truncate max-w-[280px] sm:max-w-md">{citation.documentTitle}</span>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Page {citation.pageNumber}
          </span>
        </div>
      </div>

      {/* Metadata Badges */}
      <div className="flex items-center gap-2 mb-2.5 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
        <span className="inline-flex items-center gap-1">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span>Published: {citation.publicationDate}</span>
        </span>
        <span>•</span>
        <span className="inline-flex items-center gap-1">
          <Bookmark className="w-3 h-3 text-slate-400" />
          <span>{citation.category}</span>
        </span>
        {citation.isSuperseded && (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300">
            <AlertTriangle className="w-2.5 h-2.5" />
            Superseded Policy
          </span>
        )}
      </div>

      {/* Verbatim Source Passage */}
      <div className="relative pl-3 border-l-2 border-blue-500/70 bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-r-lg font-mono text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed mb-2.5 select-text">
        <div className="text-[10px] uppercase font-bold tracking-wider text-blue-600 dark:text-blue-400 mb-1">
          Verbatim Source Passage:
        </div>
        "{citation.sourcePassage}"
      </div>

      {/* Action to View Document */}
      <div className="flex items-center justify-between pt-1">
        {citation.supersedingNotice ? (
          <p className="text-[10px] text-amber-600 dark:text-amber-400 italic">
            {citation.supersedingNotice}
          </p>
        ) : (
          <span className="text-[10px] text-slate-400">Match score: {citation.relevanceScore}</span>
        )}
        <button
          onClick={() => onViewDocument(citation.documentId, citation.pageNumber)}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-md transition-colors"
        >
          <span>View Original Document</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
