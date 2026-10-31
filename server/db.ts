import fs from 'fs';
import path from 'path';
import { InstitutionDocument, InstitutionAnalytics, UserProfile, UserRole, DocCategory, DocAccessLevel, DocumentStatus } from '../src/types/index.ts';
import { INITIAL_DOCUMENTS } from './seedData.ts';
import {
  initPostgres,
  insertDocumentToPostgres,
  updateDocumentInPostgres,
  deleteDocumentFromPostgres,
  recordQueryLogToPostgres,
} from '../src/db/service.ts';

// Initialize PostgreSQL on module load
initPostgres().catch((err) => console.warn('PostgreSQL lazy init:', err));

function loadDatasetDocuments(): InstitutionDocument[] {
  const loaded: InstitutionDocument[] = [];
  try {
    const datasetPaths = [
      path.resolve('dataset/circulars_and_policies.json'),
      path.resolve('/dataset/circulars_and_policies.json'),
      path.resolve('public/dataset/circulars_and_policies.json'),
    ];
    let filePath = '';
    for (const p of datasetPaths) {
      if (fs.existsSync(p)) {
        filePath = p;
        break;
      }
    }
    if (!filePath) return [];

    const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    if (Array.isArray(raw)) {
      raw.forEach((d: any) => {
        let cat: DocCategory = 'Academic Regulations';
        if (d.document_category?.includes('circular')) {
          if (d.document_title?.toLowerCase().includes('exam')) cat = 'Examination Notifications';
          else if (d.document_title?.toLowerCase().includes('fee') || d.department?.includes('Finance')) cat = 'Fee Structures & Circulars';
          else cat = 'Administrative Notices';
        } else if (d.document_category?.includes('handbook')) {
          cat = 'Student Handbooks';
        } else if (d.document_category?.includes('scholarship')) {
          cat = 'Scholarship Information';
        } else if (d.document_category?.includes('hostel')) {
          cat = 'Hostel Rules & Timings';
        }

        let access: DocAccessLevel = 'all';
        if (d.access_role === 'Faculty') access = 'faculty_only';
        else if (d.access_role === 'Administrator') access = 'admin_only';
        else if (d.access_role === 'Student') access = 'students_and_faculty';

        let stat: DocumentStatus = 'approved';
        if (d.approval_status === 'Draft') stat = 'pending';
        else if (d.approval_status === 'Rejected') stat = 'rejected';

        const fullPages = (d.pages || []).map((p: any, idx: number) => ({
          pageNumber: p.page_number || idx + 1,
          text: p.text || ''
        }));

        loaded.push({
          id: d.document_id,
          title: d.document_title,
          category: cat,
          publicationDate: d.issue_date || '2025-06-01',
          effectiveDate: d.effective_date,
          expirationDate: d.expiry_date,
          department: d.department || 'Academic Senate',
          accessLevel: access,
          description: d.document_content ? d.document_content.slice(0, 160) + '...' : `Official institutional publication ${d.document_id}`,
          fileType: 'pdf',
          fileName: d.file_name || `${d.document_id}.pdf`,
          fileSize: '1.4 MB',
          pageCount: fullPages.length || 2,
          status: stat,
          supersedesDocId: d.supersedes_document_id || undefined,
          isScanned: false,
          uploadedAt: `${d.issue_date || '2025-06-01'}T09:00:00Z`,
          uploadedBy: d.approved_by || 'Registrar',
          approvedAt: `${d.effective_date || '2025-06-01'}T10:00:00Z`,
          approvedBy: d.approved_by || 'Registrar',
          fullPages: fullPages.length ? fullPages : [{ pageNumber: 1, text: d.document_content || '' }],
          chunks: (d.pages || []).map((p: any, cIdx: number) => ({
            id: `chk-${d.document_id}-${cIdx}`,
            documentId: d.document_id,
            pageNumber: p.page_number || cIdx + 1,
            chunkIndex: cIdx,
            text: p.text || '',
            language: (d.language || 'en') as any,
            heading: p.heading
          }))
        });
      });
    }
  } catch (err) {
    console.warn('Dataset documents load warning:', err);
  }
  return loaded;
}

// In-memory document storage (fast cached layer) combining base seed + dataset
const datasetDocs = loadDatasetDocuments();
let documents: InstitutionDocument[] = [...INITIAL_DOCUMENTS, ...datasetDocs.filter(d => !INITIAL_DOCUMENTS.some(init => init.id === d.id))];

// Demo user accounts
export const DEMO_USERS: UserProfile[] = [
  {
    id: 'user-student-1',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@institution.edu.in',
    role: 'student',
    department: 'Computer Science & Engineering',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    studentOrEmployeeId: '22BCSE104',
  },
  {
    id: 'user-faculty-1',
    name: 'Dr. Rajesh Rao',
    email: 'dr.rajesh.rao@institution.edu.in',
    role: 'faculty',
    department: 'Mechanical & Aerospace Engineering',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    studentOrEmployeeId: 'FAC-MECH-409',
  },
  {
    id: 'user-admin-1',
    name: 'Prof. K. R. Ramanathan',
    email: 'registrar@institution.edu.in',
    role: 'admin',
    department: 'Academic Senate & Governance',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    studentOrEmployeeId: 'ADMIN-REG-001',
  },
];

// Current active session user
let currentUser: UserProfile = DEMO_USERS[0]; // defaults to student

// In-memory query logs & analytics
const queryLogs: {
  id: string;
  question: string;
  language: 'en' | 'hi' | 'te';
  userRole: UserRole;
  timestamp: string;
  answered: boolean;
}[] = [
  {
    id: 'log-1',
    question: 'What is the minimum attendance requirement?',
    language: 'en',
    userRole: 'student',
    timestamp: '2026-10-30T19:30:00Z',
    answered: true,
  },
  {
    id: 'log-2',
    question: 'కనీస హాజరు ఎంత ఉండాలి?',
    language: 'te',
    userRole: 'student',
    timestamp: '2026-10-30T20:15:00Z',
    answered: true,
  },
  {
    id: 'log-3',
    question: 'न्यूनतम उपस्थिति कितनी होनी चाहिए?',
    language: 'hi',
    userRole: 'student',
    timestamp: '2026-10-30T21:05:00Z',
    answered: true,
  },
  {
    id: 'log-4',
    question: 'When is the last date for fee payment?',
    language: 'en',
    userRole: 'student',
    timestamp: '2026-10-30T21:40:00Z',
    answered: true,
  },
  {
    id: 'log-5',
    question: 'What is the faculty research grant limit?',
    language: 'en',
    userRole: 'faculty',
    timestamp: '2026-10-30T22:00:00Z',
    answered: true,
  },
];

const unansweredQuestions: {
  question: string;
  frequency: number;
  language: 'en' | 'hi' | 'te';
  lastAsked: string;
}[] = [
  {
    question: 'Is there a swimming pool in the sports complex?',
    frequency: 7,
    language: 'en',
    lastAsked: '2026-10-30T18:45:00Z',
  },
  {
    question: 'क्या कैंपस में बैंक एटीएम रात 12 बजे खुला रहता है?',
    frequency: 4,
    language: 'hi',
    lastAsked: '2026-10-30T17:20:00Z',
  },
  {
    question: 'క్యాంపస్ బస్సు మార్గాల సమయాలు ఏమిటి?',
    frequency: 5,
    language: 'te',
    lastAsked: '2026-10-30T19:10:00Z',
  },
];

// Document database operations
export const documentDB = {
  getAll: (role: UserRole = 'admin'): InstitutionDocument[] => {
    if (role === 'admin') {
      return [...documents];
    }
    // Filter approved documents according to role permissions
    return documents.filter((doc) => {
      if (doc.status !== 'approved') return false;
      if (role === 'faculty') {
        return doc.accessLevel === 'all' || doc.accessLevel === 'students_and_faculty' || doc.accessLevel === 'faculty_only';
      }
      if (role === 'student') {
        return doc.accessLevel === 'all' || doc.accessLevel === 'students_and_faculty';
      }
      return false;
    });
  },

  getAllAdmin: (): InstitutionDocument[] => {
    return [...documents];
  },

  getById: (id: string): InstitutionDocument | undefined => {
    return documents.find((doc) => doc.id === id);
  },

  create: (doc: InstitutionDocument): InstitutionDocument => {
    const existingIndex = documents.findIndex((d) => d.id === doc.id);
    if (existingIndex >= 0) {
      documents[existingIndex] = doc;
    } else {
      documents.unshift(doc);
    }
    insertDocumentToPostgres(doc).catch((e) => console.warn('Postgres insert async:', e));
    return doc;
  },

  update: (id: string, updates: Partial<InstitutionDocument>): InstitutionDocument | null => {
    const index = documents.findIndex((doc) => doc.id === id);
    if (index === -1) return null;
    documents[index] = { ...documents[index], ...updates };
    updateDocumentInPostgres(id, updates).catch((e) => console.warn('Postgres update async:', e));
    return documents[index];
  },

  approve: (id: string, approverName: string): InstitutionDocument | null => {
    const doc = documentDB.getById(id);
    if (!doc) return null;
    return documentDB.update(id, {
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: approverName,
    });
  },

  reject: (id: string): InstitutionDocument | null => {
    const doc = documentDB.getById(id);
    if (!doc) return null;
    return documentDB.update(id, {
      status: 'rejected',
    });
  },

  delete: (id: string): boolean => {
    const initialLen = documents.length;
    documents = documents.filter((doc) => doc.id !== id);
    deleteDocumentFromPostgres(id).catch((e) => console.warn('Postgres delete async:', e));
    return documents.length < initialLen;
  },

  resetToSeed: (): void => {
    documents = [...INITIAL_DOCUMENTS];
  },
};

// User operations
export const userDB = {
  getCurrentUser: (): UserProfile => currentUser,

  setCurrentUser: (user: UserProfile): UserProfile => {
    currentUser = user;
    return currentUser;
  },

  switchRole: (role: UserRole): UserProfile => {
    const target = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    currentUser = target;
    return currentUser;
  },

  getAllUsers: (): UserProfile[] => DEMO_USERS,
};

// Analytics operations
export const analyticsDB = {
  recordQuery: (question: string, language: 'en' | 'hi' | 'te', userRole: UserRole, answered: boolean) => {
    queryLogs.unshift({
      id: `log-${Date.now()}`,
      question,
      language,
      userRole,
      timestamp: new Date().toISOString(),
      answered,
    });
    recordQueryLogToPostgres(question, language, userRole, answered).catch((e) => console.warn('Postgres query log:', e));

    if (!answered) {
      const existing = unansweredQuestions.find((q) => q.question.toLowerCase().trim() === question.toLowerCase().trim());
      if (existing) {
        existing.frequency += 1;
        existing.lastAsked = new Date().toISOString();
      } else {
        unansweredQuestions.unshift({
          question,
          frequency: 1,
          language,
          lastAsked: new Date().toISOString(),
        });
      }
    }
  },

  getAnalytics: (): InstitutionAnalytics => {
    const totalDocs = documents.length;
    const approvedDocs = documents.filter((d) => d.status === 'approved').length;
    const pendingDocs = documents.filter((d) => d.status === 'pending').length;
    const expiredDocs = documents.filter((d) => {
      if (!d.expirationDate) return false;
      return new Date(d.expirationDate) < new Date();
    }).length;

    const enCount = queryLogs.filter((q) => q.language === 'en').length;
    const hiCount = queryLogs.filter((q) => q.language === 'hi').length;
    const teCount = queryLogs.filter((q) => q.language === 'te').length;

    return {
      totalDocuments: totalDocs,
      approvedDocuments: approvedDocs,
      pendingApprovals: pendingDocs,
      expiredDocuments: expiredDocs,
      totalUserQueries: queryLogs.length,
      languageBreakdown: {
        english: enCount,
        hindi: hiCount,
        telugu: teCount,
      },
      mostSearchedTopics: [
        { topic: 'Attendance & Medical Condonation (75% rule)', count: 48, category: 'Academic Regulations' },
        { topic: 'Semester Exam Fees & Deadlines', count: 39, category: 'Examination Notifications' },
        { topic: 'Hostel Curfew & Biometric Attendance', count: 31, category: 'Hostel Rules & Timings' },
        { topic: 'Merit & Need-based Scholarship Eligibility', count: 24, category: 'Scholarship Information' },
        { topic: 'Night Out Pass / Leave Permission', count: 19, category: 'Hostel Rules & Timings' },
        { topic: 'Faculty Seed Grants & Research Funds', count: 12, category: 'HR Policies & Grants' },
      ],
      recentQueries: queryLogs.slice(0, 15),
      frequentlyUnansweredQuestions: unansweredQuestions.slice(0, 8),
    };
  },
};
