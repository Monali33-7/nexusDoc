import { boolean, integer, jsonb, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table (linked with Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID or system demo ID
  name: text('name').notNull(),
  email: text('email').notNull(),
  role: text('role').notNull(), // 'student' | 'faculty' | 'admin'
  department: text('department').notNull(),
  studentOrEmployeeId: text('student_or_employee_id').notNull(),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Official Institutional Documents table
export const documents = pgTable('documents', {
  id: text('id').primaryKey(), // e.g. 'doc-acad-reg-2026'
  title: text('title').notNull(),
  category: text('category').notNull(),
  publicationDate: text('publication_date').notNull(),
  effectiveDate: text('effective_date'),
  expirationDate: text('expiration_date'),
  department: text('department').notNull(),
  accessLevel: text('access_level').notNull(), // 'all' | 'students_and_faculty' | 'faculty_only' | 'admin_only'
  description: text('description').notNull(),
  fileType: text('file_type').notNull(),
  fileName: text('file_name').notNull(),
  fileSize: text('file_size').notNull(),
  pageCount: integer('page_count').notNull().default(1),
  status: text('status').notNull().default('approved'), // 'approved' | 'pending' | 'rejected'
  supersededByDocId: text('superseded_by_doc_id'),
  supersedesDocId: text('supersedes_doc_id'),
  conflictNotes: text('conflict_notes'),
  ocrLanguage: text('ocr_language'),
  isScanned: boolean('is_scanned').notNull().default(false),
  uploadedAt: text('uploaded_at').notNull(),
  uploadedBy: text('uploaded_by').notNull(),
  approvedAt: text('approved_at'),
  approvedBy: text('approved_by'),
  fullPages: jsonb('full_pages').notNull(), // array of DocumentPage { pageNumber, text, ocrConfidence }
  createdAt: timestamp('created_at').defaultNow(),
});

// Chunks table with embeddings and page citations
export const documentChunks = pgTable('document_chunks', {
  id: text('id').primaryKey(),
  documentId: text('document_id')
    .references(() => documents.id, { onDelete: 'cascade' })
    .notNull(),
  pageNumber: integer('page_number').notNull(),
  chunkIndex: integer('chunk_index').notNull(),
  text: text('text').notNull(),
  language: text('language').notNull(),
  heading: text('heading'),
  embedding: jsonb('embedding'), // multilingual vector representation
  createdAt: timestamp('created_at').defaultNow(),
});

// Search & Query telemetry log
export const queryLogs = pgTable('query_logs', {
  id: text('id').primaryKey(),
  question: text('question').notNull(),
  language: text('language').notNull(),
  userRole: text('user_role').notNull(),
  answered: boolean('answered').notNull().default(true),
  timestamp: text('timestamp').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Frequently unanswered questions (Senate policy gaps)
export const unansweredQuestions = pgTable('unanswered_questions', {
  id: serial('id').primaryKey(),
  question: text('question').notNull().unique(),
  frequency: integer('frequency').notNull().default(1),
  language: text('language').notNull(),
  lastAsked: text('last_asked').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const documentsRelations = relations(documents, ({ many }) => ({
  chunks: many(documentChunks),
}));

export const documentChunksRelations = relations(documentChunks, ({ one }) => ({
  document: one(documents, {
    fields: [documentChunks.documentId],
    references: [documents.id],
  }),
}));
