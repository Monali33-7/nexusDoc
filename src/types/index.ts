export type UserRole = 'student' | 'faculty' | 'admin';

export type DocAccessLevel = 'all' | 'students_and_faculty' | 'faculty_only' | 'admin_only';

export type DocCategory =
  | 'Academic Regulations'
  | 'Examination Notifications'
  | 'Fee Structures & Circulars'
  | 'Hostel Rules & Timings'
  | 'Attendance Policies'
  | 'Leave Policies'
  | 'Scholarship Information'
  | 'HR Policies & Grants'
  | 'Administrative Notices'
  | 'Student Handbooks';

export type DocumentStatus = 'approved' | 'pending' | 'rejected';

export type LanguageCode = 'en' | 'hi' | 'te';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar: string;
  studentOrEmployeeId: string;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  pageNumber: number;
  chunkIndex: number;
  text: string;
  language: 'en' | 'hi' | 'te' | 'mixed';
  heading?: string;
  embedding?: number[];
}

export interface DocumentPage {
  pageNumber: number;
  text: string;
  ocrConfidence?: number;
}

export interface InstitutionDocument {
  id: string;
  title: string;
  category: DocCategory;
  publicationDate: string; // YYYY-MM-DD
  effectiveDate?: string;
  expirationDate?: string;
  department: string;
  accessLevel: DocAccessLevel;
  description: string;
  fileType: 'pdf' | 'docx' | 'scanned_pdf';
  fileName: string;
  fileSize: string;
  pageCount: number;
  status: DocumentStatus;
  supersededByDocId?: string;
  supersedesDocId?: string;
  conflictNotes?: string;
  ocrLanguage?: string;
  isScanned: boolean;
  uploadedAt: string;
  uploadedBy: string;
  approvedAt?: string;
  approvedBy?: string;
  chunks: DocumentChunk[];
  fullPages: DocumentPage[];
}

export interface Citation {
  documentId: string;
  documentTitle: string;
  category: DocCategory;
  pageNumber: number;
  publicationDate: string;
  effectiveDate?: string;
  sourcePassage: string;
  relevanceScore: number;
  isSuperseded?: boolean;
  supersedingNotice?: string;
}

export interface ConflictWarning {
  detected: boolean;
  type: 'superseded_policy' | 'conflicting_terms' | 'expired_document';
  olderDocTitle: string;
  olderDocDate: string;
  olderPassage: string;
  newerDocTitle: string;
  newerDocDate: string;
  newerPassage: string;
  resolutionExplanation: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  detectedLanguage?: LanguageCode;
  isRefusal?: boolean;
  refusalReason?: string;
  citations?: Citation[];
  conflicts?: ConflictWarning[];
  processingTimeMs?: number;
  isSearching?: boolean;
}

export interface RAGQueryRequest {
  question: string;
  userRole: UserRole;
  preferredLanguage?: LanguageCode | 'auto';
}

export interface RAGQueryResponse {
  query: string;
  detectedLanguage: LanguageCode;
  responseLanguage: LanguageCode;
  answer: string;
  isRefusal: boolean;
  refusalReason?: string;
  citations: Citation[];
  conflicts?: ConflictWarning[];
  retrievedCount: number;
  processingTimeMs: number;
  accessRestrictedCount?: number;
}

export interface InstitutionAnalytics {
  totalDocuments: number;
  approvedDocuments: number;
  pendingApprovals: number;
  expiredDocuments: number;
  totalUserQueries: number;
  languageBreakdown: {
    english: number;
    hindi: number;
    telugu: number;
  };
  mostSearchedTopics: { topic: string; count: number; category: string }[];
  recentQueries: {
    id: string;
    question: string;
    language: LanguageCode;
    userRole: UserRole;
    timestamp: string;
    answered: boolean;
  }[];
  frequentlyUnansweredQuestions: {
    question: string;
    frequency: number;
    language: LanguageCode;
    lastAsked: string;
  }[];
}
