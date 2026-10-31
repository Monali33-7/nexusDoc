import { db } from './index.ts';
import { documents, documentChunks, users, queryLogs, unansweredQuestions } from './schema.ts';
import { eq, desc } from 'drizzle-orm';
import { InstitutionDocument, UserProfile, UserRole } from '../types/index.ts';
import { INITIAL_DOCUMENTS } from '../../server/seedData.ts';
import { DEMO_USERS } from '../../server/db.ts';

let isInitialized = false;

/**
 * Initialize PostgreSQL tables with seed documents and users if empty
 */
export async function initPostgres() {
  if (isInitialized) return;
  try {
    // Check if documents table already has records
    const existing = await db.select().from(documents).limit(1);
    if (existing.length === 0) {
      console.log('PostgreSQL database is empty. Seeding initial institutional documents and users...');

      // Seed Demo Users
      for (const u of DEMO_USERS) {
        await db
          .insert(users)
          .values({
            uid: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            department: u.department,
            studentOrEmployeeId: u.studentOrEmployeeId,
            avatar: u.avatar,
          })
          .onConflictDoNothing();
      }

      // Seed Documents and Chunks
      for (const doc of INITIAL_DOCUMENTS) {
        await db.insert(documents).values({
          id: doc.id,
          title: doc.title,
          category: doc.category,
          publicationDate: doc.publicationDate,
          effectiveDate: doc.effectiveDate,
          expirationDate: doc.expirationDate,
          department: doc.department,
          accessLevel: doc.accessLevel,
          description: doc.description,
          fileType: doc.fileType,
          fileName: doc.fileName,
          fileSize: doc.fileSize,
          pageCount: doc.pageCount,
          status: doc.status,
          supersededByDocId: doc.supersededByDocId,
          supersedesDocId: doc.supersedesDocId,
          conflictNotes: doc.conflictNotes,
          ocrLanguage: doc.ocrLanguage,
          isScanned: doc.isScanned,
          uploadedAt: doc.uploadedAt,
          uploadedBy: doc.uploadedBy,
          approvedAt: doc.approvedAt,
          approvedBy: doc.approvedBy,
          fullPages: doc.fullPages as any,
        }).onConflictDoNothing();

        for (const chunk of doc.chunks) {
          await db.insert(documentChunks).values({
            id: chunk.id,
            documentId: chunk.documentId,
            pageNumber: chunk.pageNumber,
            chunkIndex: chunk.chunkIndex,
            text: chunk.text,
            language: chunk.language,
            heading: chunk.heading,
            embedding: (chunk.embedding || []) as any,
          }).onConflictDoNothing();
        }
      }

      console.log('PostgreSQL seeded successfully with institutional records.');
    } else {
      // Ensure any newly added seed documents (like Mtech Regulation 2025) are synced
      await syncSeedDocumentsToPostgres();
    }
    isInitialized = true;
  } catch (error) {
    console.warn('PostgreSQL initialization notice (will use in-memory fallback if DB proxy offline):', error);
  }
}

/**
 * Synchronize seed documents and fix corrupted entries in PostgreSQL
 */
export async function syncSeedDocumentsToPostgres() {
  try {
    for (const doc of INITIAL_DOCUMENTS) {
      await db
        .insert(documents)
        .values({
          id: doc.id,
          title: doc.title,
          category: doc.category,
          publicationDate: doc.publicationDate,
          effectiveDate: doc.effectiveDate,
          expirationDate: doc.expirationDate,
          department: doc.department,
          accessLevel: doc.accessLevel,
          description: doc.description,
          fileType: doc.fileType,
          fileName: doc.fileName,
          fileSize: doc.fileSize,
          pageCount: doc.pageCount,
          status: doc.status,
          supersededByDocId: doc.supersededByDocId,
          supersedesDocId: doc.supersedesDocId,
          conflictNotes: doc.conflictNotes,
          ocrLanguage: doc.ocrLanguage,
          isScanned: doc.isScanned,
          uploadedAt: doc.uploadedAt,
          uploadedBy: doc.uploadedBy,
          approvedAt: doc.approvedAt,
          approvedBy: doc.approvedBy,
          fullPages: doc.fullPages as any,
        })
        .onConflictDoUpdate({
          target: documents.id,
          set: {
            title: doc.title,
            category: doc.category,
            publicationDate: doc.publicationDate,
            fullPages: doc.fullPages as any,
            pageCount: doc.pageCount,
            description: doc.description,
            status: doc.status,
          },
        });

      await db.delete(documentChunks).where(eq(documentChunks.documentId, doc.id));
      for (const chunk of doc.chunks) {
        await db
          .insert(documentChunks)
          .values({
            id: chunk.id,
            documentId: chunk.documentId,
            pageNumber: chunk.pageNumber,
            chunkIndex: chunk.chunkIndex,
            text: chunk.text,
            language: chunk.language,
            heading: chunk.heading,
            embedding: (chunk.embedding || []) as any,
          })
          .onConflictDoNothing();
      }
    }
    console.log('PostgreSQL seed documents synchronized successfully.');
  } catch (err) {
    console.warn('PostgreSQL sync notice:', err);
  }
}

/**
 * Fetch all documents from PostgreSQL
 */
export async function getDocumentsFromPostgres(): Promise<InstitutionDocument[]> {
  try {
    await initPostgres();
    const rows = await db.select().from(documents);
    const chunkRows = await db.select().from(documentChunks);

    return rows.map((r) => {
      const docChunks = chunkRows
        .filter((c) => c.documentId === r.id)
        .map((c) => ({
          id: c.id,
          documentId: c.documentId,
          pageNumber: c.pageNumber,
          chunkIndex: c.chunkIndex,
          text: c.text,
          language: c.language as any,
          heading: c.heading || undefined,
          embedding: c.embedding as any,
        }));

      return {
        id: r.id,
        title: r.title,
        category: r.category as any,
        publicationDate: r.publicationDate,
        effectiveDate: r.effectiveDate || undefined,
        expirationDate: r.expirationDate || undefined,
        department: r.department,
        accessLevel: r.accessLevel as any,
        description: r.description,
        fileType: r.fileType as any,
        fileName: r.fileName,
        fileSize: r.fileSize,
        pageCount: r.pageCount,
        status: r.status as any,
        supersededByDocId: r.supersededByDocId || undefined,
        supersedesDocId: r.supersedesDocId || undefined,
        conflictNotes: r.conflictNotes || undefined,
        ocrLanguage: r.ocrLanguage || undefined,
        isScanned: r.isScanned,
        uploadedAt: r.uploadedAt,
        uploadedBy: r.uploadedBy,
        approvedAt: r.approvedAt || undefined,
        approvedBy: r.approvedBy || undefined,
        fullPages: (r.fullPages as any) || [],
        chunks: docChunks,
      };
    });
  } catch (error) {
    console.error('Failed to query PostgreSQL documents:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

/**
 * Insert new document and its chunks into PostgreSQL
 */
export async function insertDocumentToPostgres(doc: InstitutionDocument) {
  try {
    await db.insert(documents).values({
      id: doc.id,
      title: doc.title,
      category: doc.category,
      publicationDate: doc.publicationDate,
      effectiveDate: doc.effectiveDate,
      expirationDate: doc.expirationDate,
      department: doc.department,
      accessLevel: doc.accessLevel,
      description: doc.description,
      fileType: doc.fileType,
      fileName: doc.fileName,
      fileSize: doc.fileSize,
      pageCount: doc.pageCount,
      status: doc.status,
      supersededByDocId: doc.supersededByDocId,
      supersedesDocId: doc.supersedesDocId,
      conflictNotes: doc.conflictNotes,
      ocrLanguage: doc.ocrLanguage,
      isScanned: doc.isScanned,
      uploadedAt: doc.uploadedAt,
      uploadedBy: doc.uploadedBy,
      approvedAt: doc.approvedAt,
      approvedBy: doc.approvedBy,
      fullPages: doc.fullPages as any,
    });

    for (const chunk of doc.chunks) {
      await db.insert(documentChunks).values({
        id: chunk.id,
        documentId: chunk.documentId,
        pageNumber: chunk.pageNumber,
        chunkIndex: chunk.chunkIndex,
        text: chunk.text,
        language: chunk.language,
        heading: chunk.heading,
        embedding: (chunk.embedding || []) as any,
      });
    }
  } catch (error) {
    console.error('Failed to insert document into PostgreSQL:', error);
    // Silent catch so in-memory persists
  }
}

/**
 * Update document metadata in PostgreSQL
 */
export async function updateDocumentInPostgres(id: string, updates: Partial<InstitutionDocument>) {
  try {
    await db.update(documents).set(updates as any).where(eq(documents.id, id));
  } catch (error) {
    console.error('Failed to update document in PostgreSQL:', error);
  }
}

/**
 * Delete document from PostgreSQL
 */
export async function deleteDocumentFromPostgres(id: string) {
  try {
    await db.delete(documents).where(eq(documents.id, id));
  } catch (error) {
    console.error('Failed to delete document from PostgreSQL:', error);
  }
}

/**
 * Record query log in PostgreSQL
 */
export async function recordQueryLogToPostgres(
  question: string,
  language: string,
  userRole: string,
  answered: boolean
) {
  try {
    await db.insert(queryLogs).values({
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      question,
      language,
      userRole,
      answered,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    // Non-critical telemetry logging error
  }
}
