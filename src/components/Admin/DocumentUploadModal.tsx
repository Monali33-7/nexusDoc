import React, { useState } from 'react';
import { DocCategory, DocAccessLevel } from '../../types/index.ts';
import {
  X,
  UploadCloud,
  FileText,
  Calendar,
  Shield,
  Layers,
  Sparkles,
  CheckCircle,
  FileCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

const CATEGORIES: DocCategory[] = [
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

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
}) => {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocCategory>('Academic Regulations');
  const [publicationDate, setPublicationDate] = useState('2026-03-20');
  const [effectiveDate, setEffectiveDate] = useState('2026-04-01');
  const [department, setDepartment] = useState('Academic Senate & Governance');
  const [accessLevel, setAccessLevel] = useState<DocAccessLevel>('all');
  const [description, setDescription] = useState('');
  const [rawText, setRawText] = useState('');
  const [isScanned, setIsScanned] = useState(false);
  const [ocrLanguage, setOcrLanguage] = useState('Telugu (తెలుగు) + Tesseract Pack');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [extractingPdf, setExtractingPdf] = useState(false);
  const [extractionNotice, setExtractionNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  // Pre-fill realistic test document templates for instant hackathon demonstration
  const handlePreFill = (type: 'telugu' | 'attendance' | 'confidential' | 'mtech') => {
    if (type === 'mtech') {
      setTitle('Mtech Regulation 2025');
      setCategory('Academic Regulations');
      setPublicationDate('2025-06-15');
      setEffectiveDate('2025-07-01');
      setDepartment('Postgraduate Studies & Academic Senate');
      setAccessLevel('all');
      setIsScanned(false);
      setDescription('Academic regulations, curriculum framework, 75% attendance rule, 68 credits structure, and thesis guidelines for M.Tech.');
      setRawText(`ACADEMIC REGULATIONS AND CURRICULUM FRAMEWORK FOR M.TECH. PROGRAMMES (2025-2026)
CENTRAL SENATE STATUTE NO. SEN/MTECH/2025/14

SECTION 1: PROGRAMME DURATION AND ADMISSION ELIGIBILITY
1.1 Duration of Programme:
The regular duration of the Master of Technology (M.Tech) programme is 2 academic years (4 semesters). The maximum allowable duration to complete the degree requirements is 4 consecutive years from the date of admission.

1.2 Eligibility for Admission:
Candidates seeking admission to M.Tech must possess a B.Tech / B.E. degree in the relevant discipline with a minimum of 60% aggregate marks (or 6.5 CGPA on a 10-point scale). A relaxation of 5% is granted to SC/ST/PwD candidates. Valid GATE score or state PGECET rank is mandatory for regular admission.
---PAGE---
SECTION 2: ATTENDANCE REQUIREMENTS AND CONDONATION RULES
2.1 Minimum Attendance:
Every registered M.Tech student must maintain a minimum attendance of 75% in aggregate across all lectures, tutorials, and laboratory sessions in each semester to be eligible to appear for the end-semester examinations.

2.2 Medical Condonation:
A student securing attendance between 65% and 74.9% may be granted condonation on genuine medical grounds (accompanied by a medical certificate from a Civil Surgeon or University Medical Officer) upon recommendation of the Department Postgraduate Committee (DPGC) and approval of the Dean of Academic Affairs, subject to payment of Rs. 1,000/- condonation fee.

2.3 Strict Detention Clause:
Students securing less than 65% attendance under any circumstances will not be eligible for condonation and shall be summarily DETAINED in that semester.
---PAGE---
SECTION 3: CREDIT STRUCTURE, EVALUATION AND DISSERTATION
3.1 Total Credit Requirements:
A student must successfully earn a total of 68 academic credits for the award of the M.Tech degree (Core: 24 credits, Electives: 18 credits, IPR: 3 credits, Dissertation: 20 credits). Candidates must complete Dissertation Phase-I & II, achieve a minimum CGPA of 5.50, and publish at least one research paper in a Scopus-indexed or UGC-CARE journal prior to thesis defense.`);
      setExtractionNotice('Pre-filled official M.Tech Regulations 2025 (3 pages with page dividers).');
    } else if (type === 'telugu') {
      setTitle('ఆంధ్రప్రదేశ్ ఉన్నత విద్యా శాఖ - హాస్టల్ నిబంధనల సర్క్యులర్ 2026');
      setCategory('Hostel Rules & Timings');
      setPublicationDate('2026-03-10');
      setDepartment('వసతిగృహ పరిపాలన విభాగం');
      setAccessLevel('all');
      setIsScanned(true);
      setOcrLanguage('Telugu (తెలుగు) + Tesseract Pack');
      setDescription('హాస్టల్ ప్రవేశ సమయాలు, రాత్రి 9:00 గంటల కర్ఫ్యూ మరియు బయోమెట్రిక్ హాజరుపై అధికారిక నోటిఫికేషన్.');
      setRawText(`ఆంధ్రప్రదేశ్ ఉన్నత విద్యా శాఖ - అధికారిక సర్క్యులర్
తేదీ: 10 మార్చి 2026
విషయం: నూతన విద్యా సంవత్సరం హాస్టల్ ప్రవేశ వేళలు

1. విద్యార్థులందరూ రాత్రి 9:00 గంటల లోపు హాస్టల్ లోపలికి చేరుకోవాలి.
2. ప్రతిరోజూ రాత్రి 9:00 నుండి 9:45 మధ్య బయోమెట్రిక్ హాజరు తప్పనిసరి.
3. అత్యవసర సెలవు లేదా నైట్ పాస్ కోసం వార్డెన్ అనుమతి 24 గంటల ముందు తీసుకోవాలి.
---PAGE---
4. ర్యాగింగ్ చట్టరీత్యా నేరం. ఉల్లంఘిస్తే తక్షణ బహిష్కరణ మరియు క్రిమినల్ కేసు నమోదు చేయబడుతుంది.`);
      setExtractionNotice('Pre-filled Scanned Telugu Circular with Tesseract OCR pack.');
    } else if (type === 'attendance') {
      setTitle('Notification on Semester Attendance Rules and Medical Condonation 2026');
      setCategory('Attendance Policies');
      setPublicationDate('2026-03-22');
      setDepartment('Dean of Academic Affairs');
      setAccessLevel('all');
      setIsScanned(false);
      setDescription('Official mandate requiring 75% attendance for semester exam eligibility.');
      setRawText(`OFFICE OF THE DEAN ACADEMIC AFFAIRS
CIRCULAR: ATTENDANCE MANDATE 2026
PUBLISHED: 22 MARCH 2026

Every student must maintain at least 75% aggregate attendance in all subjects to appear for semester examinations.
Attendance between 65% and 74.9% may be condoned only on valid medical grounds with Civil Surgeon certification and Rs. 1,000 fee.
Attendance below 65% results in immediate semester detention.`);
      setExtractionNotice('Pre-filled Semester Attendance Mandate.');
    } else if (type === 'confidential') {
      setTitle('Confidential Faculty Seed Grant & Consultancy Sharing Rules 2026');
      setCategory('HR Policies & Grants');
      setPublicationDate('2026-02-15');
      setDepartment('Research & Consultancy Board');
      setAccessLevel('faculty_only');
      setIsScanned(false);
      setDescription('Restricted internal document: Faculty seed research grant up to Rs. 5,00,000/-.');
      setRawText(`INTERNAL & CONFIDENTIAL: FACULTY RESEARCH SENATE STATUTE
Assistant and Associate Professors are eligible for seed research grants up to Rs. 5,00,000/- for experimental setups.
Earned leave accumulation is capped at 300 days for encashment.
Consultancy revenue sharing: 70% to faculty investigator and 30% to Institutional Fund.`);
      setExtractionNotice('Pre-filled Confidential Faculty Grant.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
    if (!title) {
      setTitle(baseName);
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

    if (isPdf) {
      setExtractingPdf(true);
      setExtractionNotice('Extracting text & preserving page structure from PDF...');
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const dataUrl = event.target?.result as string;
          try {
            const res = await fetch('/api/documents/extract-text', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                fileData: dataUrl,
                fileName: file.name,
              }),
            });
            const data = await res.json();
            if (data.text) {
              setRawText(data.text);
              if (data.detectedTitle) setTitle(data.detectedTitle);
              if (data.detectedDate) setPublicationDate(data.detectedDate);
              setExtractionNotice(`Extracted ${data.pageCount} page(s) successfully with page numbers preserved!`);
            } else {
              setExtractionNotice('Could not extract text layer. Please check the PDF.');
            }
          } catch (err: any) {
            setExtractionNotice('Error during PDF extraction. You can paste text manually below.');
          } finally {
            setExtractingPdf(false);
          }
        };
        reader.readAsDataURL(file);
      } catch (err) {
        setExtractingPdf(false);
        setExtractionNotice('Failed to read file.');
      }
    } else {
      // Plain text or markdown
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          setRawText(content);
          const dateMatch = content.match(/\b(20\d{2})[-/.](0[1-9]|1[0-2])[-/.](0[1-9]|[12]\d|3[01])\b/);
          if (dateMatch) {
            setPublicationDate(`${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`);
          }
          setExtractionNotice('File text imported successfully.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !rawText) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          publicationDate,
          effectiveDate,
          department,
          accessLevel,
          description,
          rawText,
          isScanned,
          ocrLanguage: isScanned ? ocrLanguage : undefined,
          fileType: isScanned ? 'scanned_pdf' : 'pdf',
          fileName: `${title.replace(/\s+/g, '_')}.pdf`,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onUploadSuccess();
          onClose();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700/60 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Upload & Ingest Official Document
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                OCR extraction, page splitting, multilingual embeddings & senate approval
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Quick Test Pre-fillers */}
          <div className="p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Quick Test Samples for Hackathon Demonstration:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handlePreFill('mtech')}
                className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 font-medium hover:bg-emerald-100 transition-colors"
              >
                + M.Tech Regulations 2025
              </button>
              <button
                type="button"
                onClick={() => handlePreFill('telugu')}
                className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 font-medium hover:bg-blue-100 transition-colors"
              >
                + Scanned Telugu Circular (OCR test)
              </button>
              <button
                type="button"
                onClick={() => handlePreFill('attendance')}
                className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800 font-medium hover:bg-blue-100 transition-colors"
              >
                + Attendance Policy (75% rule)
              </button>
              <button
                type="button"
                onClick={() => handlePreFill('confidential')}
                className="px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-800 font-medium hover:bg-purple-100 transition-colors"
              >
                + Confidential Faculty Grant (Role-restricted)
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Document Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Academic Regulations & Curriculum Framework 2026"
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Category & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocCategory)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Department / Authority
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Controller of Examinations"
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Dates: Publication & Effective */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Publication Date (Detected / Manual Override) *
              </label>
              <input
                type="date"
                required
                value={publicationDate}
                onChange={(e) => setPublicationDate(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Effective Date (Optional)
              </label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Access Permissions */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Access Permissions & Confidentiality *
            </label>
            <select
              value={accessLevel}
              onChange={(e) => setAccessLevel(e.target.value as DocAccessLevel)}
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Public to Institution (Students, Faculty, Staff, Admins)</option>
              <option value="students_and_faculty">Students & Faculty Only</option>
              <option value="faculty_only">Confidential: Faculty & Staff Only (Restricted from Students)</option>
              <option value="admin_only">Strictly Confidential: Administrators Only</option>
            </select>
          </div>

          {/* Scanned PDF & OCR Option */}
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isScannedCheck"
                checked={isScanned}
                onChange={(e) => setIsScanned(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="isScannedCheck" className="font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
                Scanned Document (Enable OCR Engine)
              </label>
            </div>

            {isScanned && (
              <select
                value={ocrLanguage}
                onChange={(e) => setOcrLanguage(e.target.value)}
                className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="Telugu (తెలుగు) + Tesseract Pack">Telugu (తెలుగు) + Tesseract Pack</option>
                <option value="Hindi (हिन्दी) Devanagari Pack">Hindi (हिन्दी) Devanagari Pack</option>
                <option value="English Standard Pack">English Standard Pack</option>
              </select>
            )}
          </div>

          {/* Document Content / Pages */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-slate-700 dark:text-slate-300">
                Document Text Content (Use "---PAGE---" to separate pages) *
              </label>
              <label className="text-blue-600 dark:text-blue-400 hover:underline cursor-pointer font-medium flex items-center gap-1">
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload PDF / TXT Document</span>
                <input
                  type="file"
                  accept=".txt,.pdf,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {extractingPdf && (
              <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 flex items-center gap-2 mb-2 animate-pulse">
                <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
                <span>Extracting PDF text layer & splitting into pages... Please wait.</span>
              </div>
            )}

            {extractionNotice && !extractingPdf && (
              <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-2 mb-2">
                <span>{extractionNotice}</span>
                <button
                  type="button"
                  onClick={() => setExtractionNotice(null)}
                  className="text-emerald-600 hover:text-emerald-900 dark:hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <textarea
              required
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste document full text or extract from file. To create multiple pages, insert '---PAGE---' between page contents..."
              className="w-full p-2.5 rounded-lg font-mono text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Description / Summary (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief administrative summary..."
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || success}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center gap-1.5 transition-colors"
            >
              {success ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-300" />
                  <span>Document Approved & Ingested!</span>
                </>
              ) : submitting ? (
                <span>Generating Chunks & Embeddings...</span>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>Approve & Ingest to Library</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
