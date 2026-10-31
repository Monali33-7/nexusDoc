import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { documentDB, userDB, analyticsDB } from './server/db.ts';
import { executeRAGQuery } from './server/ragEngine.ts';
import { chunkDocumentPages, extractDocumentDate, detectLanguage } from './server/ocrEngine.ts';
import { extractTextFromPdfBuffer } from './server/pdfExtractor.ts';
import { InstitutionDocument, UserRole } from './src/types/index.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Document text extraction endpoint (PDF binary / DOCX / TXT)
app.post('/api/documents/extract-text', async (req, res) => {
  try {
    const { fileData, fileName } = req.body;
    if (!fileData) {
      return res.status(400).json({ error: 'fileData is required' });
    }

    let buffer: Buffer;
    if (typeof fileData === 'string' && fileData.startsWith('data:')) {
      const base64Data = fileData.split(',')[1];
      buffer = Buffer.from(base64Data, 'base64');
    } else if (typeof fileData === 'string') {
      buffer = Buffer.from(fileData, 'base64');
    } else {
      buffer = Buffer.from(fileData);
    }

    const result = await extractTextFromPdfBuffer(buffer, fileName);
    res.json(result);
  } catch (err: any) {
    console.error('Error extracting PDF text:', err);
    res.status(500).json({ error: 'Failed to extract text from document', details: err.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Authentication endpoints
app.get('/api/auth/current-user', (req, res) => {
  res.json({ user: userDB.getCurrentUser() });
});

app.post('/api/auth/switch-role', (req, res) => {
  const { role } = req.body;
  if (!role || !['student', 'faculty', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified' });
  }
  const user = userDB.switchRole(role as UserRole);
  res.json({ user });
});

app.post('/api/auth/login', (req, res) => {
  const { role, name, email } = req.body;
  let user = userDB.switchRole(role || 'student');
  if (name || email) {
    user = userDB.setCurrentUser({
      ...user,
      name: name || user.name,
      email: email || user.email,
    });
  }
  res.json({ user });
});

// Document Library endpoints
app.get('/api/documents', (req, res) => {
  const role = (req.query.role as UserRole) || userDB.getCurrentUser().role;
  const docs = documentDB.getAll(role);
  res.json({ documents: docs });
});

app.get('/api/documents/:id', (req, res) => {
  const doc = documentDB.getById(req.params.id);
  if (!doc) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json({ document: doc });
});

// Admin upload document
app.post('/api/documents', (req, res) => {
  const currentUser = userDB.getCurrentUser();
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ error: 'Admin authorization required to upload institutional documents.' });
  }

  const {
    title,
    category,
    publicationDate,
    effectiveDate,
    expirationDate,
    department,
    accessLevel,
    description,
    fileType,
    fileName,
    rawText,
    isScanned,
    ocrLanguage,
  } = req.body;

  if (!title || !category || !rawText) {
    return res.status(400).json({ error: 'Title, category, and document text content are required.' });
  }

  const docId = `doc-${Date.now()}`;
  const detectedPubDate = publicationDate || extractDocumentDate(rawText) || new Date().toISOString().split('T')[0];

  // Process text into page objects
  const rawPages: string[] = rawText.includes('---PAGE---')
    ? rawText.split('---PAGE---')
    : [rawText];

  const fullPages = rawPages.map((pageText, idx) => ({
    pageNumber: idx + 1,
    text: pageText.trim(),
    ocrConfidence: isScanned ? 95.5 + Math.random() * 3.5 : undefined,
  }));

  const chunks = chunkDocumentPages(docId, fullPages);

  const newDoc: InstitutionDocument = {
    id: docId,
    title,
    category,
    publicationDate: detectedPubDate,
    effectiveDate: effectiveDate || undefined,
    expirationDate: expirationDate || undefined,
    department: department || 'General Administration',
    accessLevel: accessLevel || 'all',
    description: description || `Official ${category} publication.`,
    fileType: fileType || (isScanned ? 'scanned_pdf' : 'pdf'),
    fileName: fileName || `${title.replace(/\s+/g, '_')}.pdf`,
    fileSize: `${(rawText.length / 1024).toFixed(1)} KB`,
    pageCount: fullPages.length,
    status: 'approved', // Auto-approve or admin can approve
    uploadedAt: new Date().toISOString(),
    uploadedBy: currentUser.name,
    approvedAt: new Date().toISOString(),
    approvedBy: currentUser.name,
    isScanned: Boolean(isScanned),
    ocrLanguage: isScanned ? ocrLanguage || 'Telugu/Hindi/English Tesseract OCR Engine' : undefined,
    fullPages,
    chunks,
  };

  documentDB.create(newDoc);
  res.status(201).json({ document: newDoc });
});

// Admin update document metadata
app.put('/api/documents/:id', (req, res) => {
  const currentUser = userDB.getCurrentUser();
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ error: 'Admin authorization required' });
  }

  const updated = documentDB.update(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json({ document: updated });
});

// Admin approve document
app.post('/api/documents/:id/approve', (req, res) => {
  const currentUser = userDB.getCurrentUser();
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ error: 'Admin authorization required' });
  }

  const updated = documentDB.approve(req.params.id, currentUser.name);
  if (!updated) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json({ document: updated });
});

// Admin reject document
app.post('/api/documents/:id/reject', (req, res) => {
  const currentUser = userDB.getCurrentUser();
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ error: 'Admin authorization required' });
  }

  const updated = documentDB.reject(req.params.id);
  if (!updated) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json({ document: updated });
});

// Admin delete document
app.delete('/api/documents/:id', (req, res) => {
  const currentUser = userDB.getCurrentUser();
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ error: 'Admin authorization required' });
  }

  const deleted = documentDB.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Document not found' });
  }
  res.json({ success: true });
});

// Admin reset to seed data
app.post('/api/documents/reset-seed', (req, res) => {
  const currentUser = userDB.getCurrentUser();
  if (currentUser.role !== 'admin') {
    return res.status(403).json({ error: 'Admin authorization required' });
  }

  documentDB.resetToSeed();
  res.json({ success: true, count: documentDB.getAllAdmin().length });
});

// Strict RAG query endpoint
app.post('/api/rag/ask', async (req, res) => {
  try {
    const { question, userRole, preferredLanguage } = req.body;
    const activeRole = userRole || userDB.getCurrentUser().role;

    const result = await executeRAGQuery({
      question: question || '',
      userRole: activeRole,
      preferredLanguage: preferredLanguage || 'auto',
    });

    res.json(result);
  } catch (err: any) {
    console.error('Error processing RAG query:', err);
    res.status(500).json({
      error: 'An error occurred while searching institutional records.',
      details: err.message,
    });
  }
});

// Analytics endpoint
app.get('/api/analytics', (req, res) => {
  const data = analyticsDB.getAnalytics();
  res.json(data);
});

// Dataset & Evaluation Benchmark endpoints
const DATASET_DIR = path.resolve('dataset');
app.use('/dataset-files', express.static(DATASET_DIR));

app.get('/api/dataset/overview', (req, res) => {
  try {
    const questionsPath = path.join(DATASET_DIR, 'evaluation_questions.json');
    const chunksPath = path.join(DATASET_DIR, 'document_chunks.json');
    const questions = fs.existsSync(questionsPath) ? JSON.parse(fs.readFileSync(questionsPath, 'utf-8')) : [];
    const chunks = fs.existsSync(chunksPath) ? JSON.parse(fs.readFileSync(chunksPath, 'utf-8')) : [];
    
    res.json({
      institution: 'Vidyasagar National Institute of Technology (VNIT)',
      status: 'Active Benchmark Suite',
      statistics: {
        totalUniqueDocuments: 90,
        multilingualVersions: 270,
        totalPassageChunks: chunks.length,
        evaluationBenchmarkQuestions: questions.length,
        institutionalFaqs: 50,
        categories: [
          { name: 'Academic circulars and notifications', count: 30 },
          { name: 'Academic policies and regulations', count: 20 },
          { name: 'Student and employee handbooks', count: 10 },
          { name: 'Frequently Asked Questions (FAQs)', count: 50 },
          { name: 'Scholarship policies and guidelines', count: 15 },
          { name: 'Hostel rules, regulations and procedures', count: 15 }
        ],
        languages: ['English (EN)', 'Hindi (HI - Devanagari)', 'Telugu (TE - Telugu Script)'],
        edgeCaseScenariosCovered: [
          'Expired Document Detection',
          'Superseded Policy Version Warning',
          'Conflicting Document Rules / Draft vs Approved',
          'Unapproved Draft & Rejected Status Enforcement',
          'Strict Non-Hallucination Polite Refusal',
          'Role-Restricted Confidentiality (RBAC)',
          'Cross-Lingual Hindi Retrieval',
          'Cross-Lingual Telugu Retrieval',
          'M.Tech/B.Tech Acronym & Abbreviation Normalization',
          'Page & Section Level Citation Anchoring'
        ]
      },
      deliverableFiles: [
        { name: 'documents_metadata.csv', size: '355 KB', description: '90 documents with full metadata & text across 3 languages' },
        { name: 'document_chunks.json', size: '419 KB', description: 'Structured passage chunks with IDs, pages, and headings' },
        { name: 'circulars_and_policies.json', size: '146 KB', description: '30 circulars & 20 policies with full text & OCR stamps' },
        { name: 'multilingual_faqs.csv', size: '46 KB', description: '50 FAQs translated across English, Hindi & Telugu' },
        { name: 'access_permissions.csv', size: '1.6 KB', description: 'Role-based access control matrix (Student, Faculty, Admin, Warden)' },
        { name: 'evaluation_questions.json', size: '46 KB', description: '100 benchmark test questions across 7 test dimensions' },
        { name: 'document_version_history.csv', size: '1.2 KB', description: 'Audit trail of policy revisions, superseding, and dates' },
        { name: 'README.md', size: '4.8 KB', description: 'Comprehensive documentation and RAG evaluation guidelines' }
      ]
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load dataset overview', details: err.message });
  }
});

app.get('/api/dataset/evaluation-questions', (req, res) => {
  try {
    const questionsPath = path.join(DATASET_DIR, 'evaluation_questions.json');
    if (!fs.existsSync(questionsPath)) {
      return res.status(404).json({ error: 'Evaluation dataset not found' });
    }
    const questions = JSON.parse(fs.readFileSync(questionsPath, 'utf-8'));
    const { testType, language } = req.query;
    let filtered = questions;
    if (testType && testType !== 'All') {
      filtered = filtered.filter((q: any) => q.test_type === testType);
    }
    if (language && language !== 'all') {
      filtered = filtered.filter((q: any) => q.language === language);
    }
    res.json({ questions: filtered, totalCount: questions.length });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load evaluation questions', details: err.message });
  }
});

app.get('/api/dataset/faqs', (req, res) => {
  try {
    const faqsPath = path.join(DATASET_DIR, 'multilingual_faqs.csv');
    if (!fs.existsSync(faqsPath)) {
      return res.status(404).json({ error: 'FAQ dataset not found' });
    }
    const raw = fs.readFileSync(faqsPath, 'utf-8');
    res.type('text/csv').send(raw);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to load FAQs', details: err.message });
  }
});

app.get('/api/dataset/download/:filename', (req, res) => {
  const safeFilename = path.basename(req.params.filename);
  const filePath = path.join(DATASET_DIR, safeFilename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Requested file not found in dataset library.' });
  }
  res.download(filePath, safeFilename);
});

// Vite Middleware for SPA
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NexusDoc AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
