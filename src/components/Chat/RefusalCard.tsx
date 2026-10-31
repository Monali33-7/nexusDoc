import React, { useState } from 'react';
import { ShieldAlert, Send, CheckCircle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface RefusalCardProps {
  question: string;
  refusalText: string;
  reason?: string;
  accessRestrictedCount?: number;
}

export const RefusalCard: React.FC<RefusalCardProps> = ({
  question,
  refusalText,
  reason,
  accessRestrictedCount,
}) => {
  const { user } = useAuth();
  const { language, t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notes, setNotes] = useState('');
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/support/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          userEmail: user.email,
          userRole: user.role,
          notes,
        }),
      });
      setSubmitted(true);
      setShowInquiryForm(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/90 p-4 text-xs shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
          <ShieldAlert className="w-5 h-5" />
        </div>

        <div className="flex-1">
          <div className="font-bold text-sm text-slate-800 dark:text-slate-200 mb-1 flex items-center gap-2">
            <span>{t.refusalTitle}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              Zero Hallucination Guardrail
            </span>
          </div>

          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium mb-2">
            {refusalText}
          </p>

          {reason && (
            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-3 bg-white dark:bg-slate-800/80 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
              <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span>{reason}</span>
            </div>
          )}

          {accessRestrictedCount && accessRestrictedCount > 0 ? (
            <div className="text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 p-2 rounded-lg border border-amber-200 dark:border-amber-900 mb-3">
              Note: Information was identified in restricted documents, but your current role ({user.role}) lacks clearance to access these materials.
            </div>
          ) : null}

          {submitted ? (
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-200 dark:border-emerald-800 font-medium">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Inquiry successfully logged with the Academic Registrar. You will receive an official response via institutional email.</span>
            </div>
          ) : !showInquiryForm ? (
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => setShowInquiryForm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition-colors"
              >
                <Send className="w-3 h-3" />
                <span>{t.submitToRegistrar}</span>
              </button>
              <span className="text-slate-400 text-[11px]">Forward query for official administrative review</span>
            </div>
          ) : (
            <form onSubmit={handleSubmitInquiry} className="mt-3 p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                Submit Inquiry to Registrar & Senate Office
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                Query: "{question}"
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any specific context or student/employee details (optional)..."
                rows={2}
                className="w-full text-xs p-2 rounded-md border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 mb-2 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowInquiryForm(false)}
                  className="px-2.5 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-800 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit to Registrar'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
