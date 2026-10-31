import React from 'react';
import { ConflictWarning } from '../../types/index.ts';
import { AlertCircle, History, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ConflictWarningCardProps {
  conflict: ConflictWarning;
}

export const ConflictWarningCard: React.FC<ConflictWarningCardProps> = ({ conflict }) => {
  return (
    <div className="rounded-xl border border-amber-300 dark:border-amber-700/80 bg-amber-50/90 dark:bg-amber-950/30 p-4 mb-4 text-xs shadow-sm">
      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm mb-2">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>Policy Update & Conflict Detected</span>
      </div>

      <p className="text-amber-900 dark:text-amber-200/90 mb-3 leading-relaxed">
        {conflict.resolutionExplanation}
      </p>

      {/* Side by side or stacked comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {/* Older circular */}
        <div className="p-3 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-amber-200 dark:border-amber-900/50">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold mb-1">
            <History className="w-3.5 h-3.5 text-amber-600" />
            <span>Older Policy ({conflict.olderDocDate})</span>
          </div>
          <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5 line-clamp-1">
            {conflict.olderDocTitle}
          </div>
          <div className="p-2 rounded bg-slate-50 dark:bg-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 italic">
            "{conflict.olderPassage.slice(0, 180)}..."
          </div>
          <span className="inline-block mt-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            Status: Superseded
          </span>
        </div>

        {/* Newer circular */}
        <div className="p-3 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-semibold mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Newer Active Policy ({conflict.newerDocDate})</span>
          </div>
          <div className="font-semibold text-slate-900 dark:text-white mb-1.5 line-clamp-1">
            {conflict.newerDocTitle}
          </div>
          <div className="p-2 rounded bg-white dark:bg-slate-900 text-[11px] font-mono text-emerald-900 dark:text-emerald-200 italic">
            "{conflict.newerPassage.slice(0, 180)}..."
          </div>
          <span className="inline-block mt-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700">
            Status: Currently In Force
          </span>
        </div>
      </div>

      <div className="text-[11px] text-amber-800 dark:text-amber-300/90 flex items-center gap-1">
        <ArrowRight className="w-3 h-3 text-amber-600 shrink-0" />
        <span>NexusDoc AI strictly prioritizes the newer notification because it contains an explicit superseding statute clause.</span>
      </div>
    </div>
  );
};
